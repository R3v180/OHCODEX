import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const payload = await getPayload({ config: configPromise })
  
  try {
    const db = payload.db as any // Acceso directo a la BD (Drizzle)
    let log: string[] = []

    // Función mágica que clona filas de ES a EN a nivel de SQL
    const cloneTableSQL = async (tableName: string) => {
      try {
        // 1. Obtener nombres de columnas reales de tu BD
        const columnsRes = await db.drizzle.execute(`
          SELECT column_name
          FROM information_schema.columns
          WHERE table_schema = 'public'
          AND table_name = '${tableName}'
          AND column_name != 'id';
        `)

        const columns = columnsRes.rows.map((r: any) => r.column_name)
        
        if (columns.length === 0) return `⚠️ Tabla ${tableName} no encontrada o vacía.`

        // 2. Construir la consulta SQL dinámica
        // Seleccionamos todas las columnas, pero forzamos que '_locale' sea 'en'
        const colsList = columns.map((c: string) => `"${c}"`).join(', ')
        const selectList = columns.map((c: string) => (c === '_locale' ? "'en'" : `"${c}"`)).join(', ')
        
        // Generamos la parte de UPDATE para conflictos (si ya existe, lo sobrescribe)
        const updateList = columns
          .filter((c: string) => c !== '_parent_id' && c !== '_locale')
          .map((c: string) => `"${c}" = EXCLUDED."${c}"`)
          .join(', ')

        const query = `
          INSERT INTO "${tableName}" (${colsList})
          SELECT ${selectList}
          FROM "${tableName}"
          WHERE "_locale" = 'es'
          ON CONFLICT ("_parent_id", "_locale") 
          DO UPDATE SET ${updateList};
        `

        // 3. Ejecutar
        await db.drizzle.execute(query)
        return `✅ Tabla ${tableName}: Contenido ES clonado a EN correctamente.`
        
      } catch (err: any) {
        return `❌ Error en tabla ${tableName}: ${err.message}`
      }
    }

    // --- LISTA DE TABLAS A SINCRONIZAR ---
    // Estas son las que se ven en tu captura de Neon
    const tablesToSync = [
      'posts_locales',
      'products_locales',
      'landing_page_locales',
      'legal_texts_locales',
      'company_info_locales'
    ]

    for (const table of tablesToSync) {
      const result = await cloneTableSQL(table)
      log.push(result)
    }

    return NextResponse.json({ success: true, log })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}