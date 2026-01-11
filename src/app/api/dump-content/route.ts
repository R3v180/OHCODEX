// =============== INICIO ARCHIVO: src/app/api/dump-content/route.ts =============== //
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic' // Para asegurar que no se cachee

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })
    
    // Extraemos todo el contenido en ESPAÑOL ('es') para usarlo como base de traducción
    const locale = 'es'

    // 1. Colección: TOOLS
    const toolsReq = await payload.find({
      collection: 'tools',
      limit: 100,
      locale: locale as any,
      depth: 1, // Depth 1 para traer info básica, si hay relaciones
    })

    // 2. Colección: PRODUCTS
    const productsReq = await payload.find({
      collection: 'products',
      limit: 100,
      locale: locale as any,
      depth: 1,
    })

    // 3. Colección: POSTS
    const postsReq = await payload.find({
      collection: 'posts',
      limit: 100,
      locale: locale as any,
      depth: 1,
    })

    // 4. Global: LANDING PAGE
    const landing = await payload.findGlobal({
      slug: 'landing-page' as any,
      locale: locale as any,
    })

    // 5. Global: COMPANY INFO
    const company = await payload.findGlobal({
      slug: 'company-info' as any,
      locale: locale as any,
    })

    // 6. Global: LEGAL TEXTS
    const legal = await payload.findGlobal({
      slug: 'legal-texts' as any,
      locale: locale as any,
    })

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      message: "COPY THIS JSON CONTENT TO THE AI",
      data: {
        tools: toolsReq.docs.map(t => ({
          slug: t.slug,
          title: t.title,
          badge: t.badge,
          shortDescription: t.shortDescription,
          steps: t.steps,
          ctaTitle: t.ctaTitle,
          ctaDescription: t.ctaDescription,
          faqs: t.faqs,
          // Omitimos 'content' largo para no saturar el chat, 
          // a menos que sea necesario. Si lo necesitas, quita este comentario.
          // content: t.content 
        })),
        products: productsReq.docs.map(p => ({
          slug: p.slug,
          name: p.name,
          shortDescription: p.shortDescription,
          status: p.status,
          technologies: p.technologies
        })),
        posts: postsReq.docs.map(p => ({
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt
        })),
        landing: {
          heroTitle: landing.heroTitle,
          heroSubtitle: landing.heroSubtitle,
          heroBadge: landing.heroBadge,
          productsTitle: landing.productsTitle,
          productsDescription: landing.productsDescription,
          featuresTitle: landing.featuresTitle,
          featuresDescription: landing.featuresDescription,
          featuresList: landing.featuresList,
          testimonialsTitle: landing.testimonialsTitle,
          testimonialsSubtitle: landing.testimonialsSubtitle,
          testimonials: landing.testimonials,
          faqTitle: landing.faqTitle,
          faqSubtitle: landing.faqSubtitle,
          faqs: landing.faqs
        },
        company: {
          tagline: company.tagline,
          description: company.description,
          defaultTitle: company.defaultTitle,
          defaultDescription: company.defaultDescription,
          address: company.address,
          schedule: company.schedule
        }
      }
    }, { status: 200 })

  } catch (error: any) {
    console.error('Dump error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
// =============== FIN ARCHIVO: src/app/api/dump-content/route.ts =============== //