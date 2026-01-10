import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

// Importamos los datos maestros de cada herramienta
import { vaultData } from '@/scripts/data/vault-data'
import { imageOptimizerData } from '@/scripts/data/image-optimizer-data'
import { pdfStudioData } from '@/scripts/data/pdf-studio-data'
import { dataStationData } from '@/scripts/data/data-station-data'
import { qrFactoryData } from '@/scripts/data/qr-factory-data'
import { ocrVisionData } from '@/scripts/data/ocr-vision-data'

// Lista completa de herramientas a procesar
const ALL_TOOLS = [
  vaultData,
  imageOptimizerData,
  pdfStudioData,
  dataStationData,
  qrFactoryData,
  ocrVisionData
]

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })
    console.log('🌱 SEED V4: Iniciando actualización masiva de herramientas...')
    
    const results = []

    for (const tool of ALL_TOOLS) {
      console.log(`Processing: ${tool.title.es}...`)

      // 1. Buscar si la herramienta ya existe
      const existing = await payload.find({
        collection: 'tools',
        where: { slug: { equals: tool.slug } },
      })

      if (existing.docs.length > 0) {
        const id = existing.docs[0].id
        
        // --- ACTUALIZACIÓN (ESPAÑOL) ---
        await payload.update({
          collection: 'tools',
          id,
          data: {
            codeKey: tool.codeKey as any, // 👈 FIX: Forzamos el tipo
            icon: tool.icon as any,       // 👈 FIX: Forzamos el tipo
            title: tool.title.es,
            badge: tool.badge.es,
            shortDescription: tool.shortDescription.es,
            steps: tool.steps.es,
            ctaTitle: tool.cta.es.title,
            ctaDescription: tool.cta.es.desc,
            content: tool.content.es,
            faqs: tool.faqs.es
          },
          locale: 'es'
        })

        // --- ACTUALIZACIÓN (INGLÉS) ---
        await payload.update({
          collection: 'tools',
          id,
          data: {
            title: tool.title.en,
            badge: tool.badge.en,
            shortDescription: tool.shortDescription.en,
            steps: tool.steps.en,
            ctaTitle: tool.cta.en.title,
            ctaDescription: tool.cta.en.desc,
            content: tool.content.en,
            faqs: tool.faqs.en
          },
          locale: 'en'
        })
        
        results.push({ slug: tool.slug, status: 'updated' })

      } else {
        // --- CREACIÓN (Si es nueva, como OCR Vision) ---
        // Primero creamos en Español (idioma base)
        const newDoc = await payload.create({
          collection: 'tools',
          data: {
            slug: tool.slug,
            codeKey: tool.codeKey as any, // 👈 FIX
            icon: tool.icon as any,       // 👈 FIX
            title: tool.title.es,
            badge: tool.badge.es,
            shortDescription: tool.shortDescription.es,
            steps: tool.steps.es,
            ctaTitle: tool.cta.es.title,
            ctaDescription: tool.cta.es.desc,
            content: tool.content.es,
            faqs: tool.faqs.es
          },
          locale: 'es'
        })

        // Luego actualizamos con los datos en Inglés
        await payload.update({
          collection: 'tools',
          id: newDoc.id,
          data: {
            title: tool.title.en,
            badge: tool.badge.en,
            shortDescription: tool.shortDescription.en,
            steps: tool.steps.en,
            ctaTitle: tool.cta.en.title,
            ctaDescription: tool.cta.en.desc,
            content: tool.content.en,
            faqs: tool.faqs.en
          },
          locale: 'en'
        })

        results.push({ slug: tool.slug, status: 'created' })
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Base de datos actualizada correctamente con textos SEO y Guías de 3 pasos.',
      results 
    })

  } catch (error: any) {
    console.error('Seed error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}