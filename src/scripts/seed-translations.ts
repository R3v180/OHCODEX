import { getPayload } from 'payload'
import configPromise from '@payload-config'

async function translateContent() {
  console.log('🚀 Iniciando clonación de contenido ES -> EN...')
  
  // Inicializamos Payload
  const payload = await getPayload({ config: configPromise })

  // --- 1. GLOBALES (Home, Footer, Legales) ---
  const globals = ['company-info', 'landing-page', 'legal-texts']
  
  for (const slug of globals) {
    try {
      console.log(`Processing Global: ${slug}`)
      // Leer Español
      const esDoc = await payload.findGlobal({ 
        slug: slug as any, 
        locale: 'es' 
      })
      
      // Guardar en Inglés (Payload copiará la estructura)
      await payload.updateGlobal({
        slug: slug as any,
        data: esDoc, 
        locale: 'en'
      })
      console.log(`✅ ${slug} clonado a EN`)
    } catch (e) {
      console.error(`❌ Error en ${slug}:`, e)
    }
  }

  // --- 2. COLECCIONES (Blog, Productos, Categorías) ---
  const collections = ['posts', 'products', 'categories']

  for (const slug of collections) {
    console.log(`Processing Collection: ${slug}`)
    const { docs } = await payload.find({ 
      collection: slug as any, 
      locale: 'es', 
      limit: 1000 
    })

    for (const doc of docs) {
      try {
        await payload.update({
          collection: slug as any,
          id: doc.id,
          data: doc, // Copiamos datos tal cual
          locale: 'en'
        })
        console.log(`  -> Item ${doc.id} clonado`)
      } catch (e) {
        console.error(`  ❌ Error en item ${doc.id}:`, e)
      }
    }
  }

  console.log('🏁 Proceso finalizado. El contenido en Inglés ha sido rellenado.')
  process.exit(0)
}

translateContent()