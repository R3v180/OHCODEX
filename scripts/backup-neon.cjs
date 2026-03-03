// scripts/backup-neon.cjs
// Backup lógico en JSON de todas las tablas públicas de Neon (similar a backup-neon.ts)

const { Client } = require('pg')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') })

const uri = process.env.DATABASE_URI

if (!uri) {
  console.error('❌ DATABASE_URI no está definido en .env')
  process.exit(1)
}

async function backup() {
  const client = new Client({ connectionString: uri })
  await client.connect()
  console.log('🔌 Conectado a Neon PostgreSQL\n')

  // 1. Obtener todas las tablas públicas
  const tablesResult = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `)

  const tables = tablesResult.rows.map((r) => r.table_name)
  console.log(`📋 Encontradas ${tables.length} tablas:\n${tables.join(', ')}\n`)

  const backupDir = path.join(process.cwd(), 'backups')
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true })
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupFile = path.join(backupDir, `neon-backup-${timestamp}.json`)

  const fullBackup = {}

  // 2. Backup de cada tabla (SELECT * FROM "tabla")
  for (const table of tables) {
    try {
      const result = await client.query(`SELECT * FROM "${table}"`)
      fullBackup[table] = result.rows
      console.log(`✅ ${table}: ${result.rows.length} registros`)
    } catch (err) {
      console.log(`❌ ${table}: ERROR - ${err.message}`)
    }
  }

  // 3. Guardar backup
  fs.writeFileSync(backupFile, JSON.stringify(fullBackup, null, 2))
  console.log(`\n💾 Backup JSON guardado en: ${backupFile}`)

  await client.end()
  console.log('\n✅ Backup lógico completado')
}

backup().catch((err) => {
  console.error('❌ Error en backup-neon.cjs:', err)
  process.exit(1)
})

