import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

export async function GET() {
  const payload = await getPayload({ config: configPromise })
  
  try {
    // Consultamos explícitamente en ESPAÑOL
    const posts = await payload.find({ 
      collection: 'posts', 
      limit: 0, 
      locale: 'es' 
    })
    
    const products = await payload.find({ 
      collection: 'products', 
      limit: 0, 
      locale: 'es' 
    })

    const landing = await payload.findGlobal({ 
      slug: 'landing-page' as any, 
      locale: 'es' 
    }) as any

    return NextResponse.json({
      status: 'success',
      report: {
        articulos_blog: posts.totalDocs,
        productos: products.totalDocs,
        home_titulo: landing.heroTitle || 'VACÍO (Posible pérdida)'
      }
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}