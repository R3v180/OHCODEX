import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// --- 1. CARGA DE ENTORNO ---
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

// --- 2. LÓGICA DE SINCRONIZACIÓN ---
async function syncCollections() {
  console.log('🔄 Iniciando sincronización de colecciones (ES -> EN)...')

  const { getPayload } = await import('payload')
  const configModule = await import('../payload.config')
  const payload = await getPayload({ config: configModule.default })

  // --- A. ARTÍCULOS (POSTS) ---
  console.log('--- Sincronizando Blog (Posts) ---')
  const posts = await payload.find({
    collection: 'posts',
    locale: 'es',
    limit: 1000,
  })

  for (const doc of posts.docs) {
    try {
      console.log(`📝 Clonando Post: ${doc.title}`)
      await payload.update({
        collection: 'posts',
        id: doc.id,
        data: {
          title: doc.title,
          content: doc.content,
          excerpt: doc.excerpt,
          slug: doc.slug,
          metaTitle: doc.metaTitle,
          metaDescription: doc.metaDescription
        },
        locale: 'en' // Guardamos en el hueco de inglés
      })
    } catch (e) {
      console.error(`Error en post ${doc.id}`)
    }
  }

  // --- B. PRODUCTOS ---
  console.log('--- Sincronizando Productos ---')
  const products = await payload.find({
    collection: 'products',
    locale: 'es',
    limit: 1000,
  })

  for (const doc of products.docs) {
    try {
      console.log(`🚀 Clonando Producto: ${doc.name}`)
      await payload.update({
        collection: 'products',
        id: doc.id,
        data: {
          name: doc.name,
          shortDescription: doc.shortDescription,
          description: doc.description,
          slug: doc.slug,
          metaTitle: doc.metaTitle,
          metaDescription: doc.metaDescription
        },
        locale: 'en'
      })
    } catch (e) {
      console.error(`Error en producto ${doc.id}`)
    }
  }
  
  // --- C. LEGALES ---
  console.log('--- Sincronizando Legales ---')
  try {
    const legal = await payload.findGlobal({ slug: 'legal-texts' as any, locale: 'es' })
    await payload.updateGlobal({
      slug: 'legal-texts' as any,
      data: legal,
      locale: 'en'
    })
    console.log('⚖️ Legales clonados')
  } catch (e) { console.error('Error en legales') }

  console.log('✅ ¡Sincronización Completada!')
  process.exit(0)
}

syncCollections()