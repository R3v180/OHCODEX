import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// 1. Cargar Entorno
const loadEnv = () => {
  const __filename = fileURLToPath(import.meta.url)
  const currentDir = path.dirname(__filename)
  const rootDir = path.resolve(currentDir, '..', '..')
  const envPath = path.resolve(rootDir, '.env')

  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8')
    content.split('\n').forEach(line => {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) return
      const index = trimmed.indexOf('=')
      const key = trimmed.substring(0, index).trim()
      let value = trimmed.substring(index + 1).trim()
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      process.env[key] = value
    })
  }
}
loadEnv()

// 2. Comprobar Datos
async function checkData() {
  console.log('🕵️‍♂️ Verificando integridad de datos...')
  
  const { getPayload } = await import('payload')
  const configModule = await import('../payload.config')
  const payload = await getPayload({ config: configModule.default })

  try {
    // Buscar en ESPAÑOL explícitamente
    const posts = await payload.find({ collection: 'posts', locale: 'es', limit: 0 })
    const products = await payload.find({ collection: 'products', locale: 'es', limit: 0 })
    const landing = await payload.findGlobal({ slug: 'landing-page' as any, locale: 'es' })

    console.log('\n---------------- RESULTADOS ----------------')
    console.log(`📝 Artículos (Blog) encontrados: ${posts.totalDocs}`)
    console.log(`📦 Productos encontrados: ${products.totalDocs}`)
    
    // Comprobar si la Landing tiene título
    if (landing && landing.heroTitle) {
      console.log(`🏠 Landing Page: ✅ Existe (Título: "${landing.heroTitle}")`)
    } else {
      console.log(`🏠 Landing Page: ❌ VACÍA O PERDIDA`)
    }
    console.log('--------------------------------------------\n')

    if (posts.totalDocs === 0 && products.totalDocs === 0) {
      console.log('⚠️ ALERTA: Parece que las colecciones están vacías.')
      console.log('RECOMENDACIÓN: Restaurar copia de seguridad de Neon DB.')
    } else {
      console.log('✅ BUENAS NOTICIAS: Los datos existen.')
      console.log('Si no los ves en la web, es solo cuestión de ejecutar el script de sincronización (sync-collections.ts) para rellenar el inglés.')
    }

  } catch (error) {
    console.error('Error verificando:', error)
  }
  process.exit(0)
}

checkData()