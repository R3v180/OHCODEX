// =============== INICIO ARCHIVO: src/app/api/seed-all/route.ts =============== //
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const TRANSLATIONS: any = {
  fr: {
    landing: {
      heroTitle: "Architecture & Développement Logiciel",
      heroSubtitle: "Ingénierie pour le futur des écosystèmes numériques.",
      productsTitle: "Produits et Solutions",
      productsDescription: "Outils prêts à intégrer pour opérations réelles.",
      featuresTitle: "Ce Que Nous Faisons",
      featuresDescription: "Services : PWA, SaaS et intégrations.",
      testimonialsTitle: "Ce que disent nos clients",
      testimonialsSubtitle: "Avis réels de clients satisfaits.",
      faqTitle: "Questions Fréquentes",
      faqSubtitle: "Réponses aux doutes courants.",
    },
    company: {
      tagline: "Développement de Logiciels sur Mesure",
      description: "Solutions fiables et évolutives pour entreprises.",
      defaultTitle: "OHCodex | Développement Logiciel",
      // FIX: Texto extendido para cumplir minLength: 50
      defaultDescription: "OHCodex développe des solutions logicielles sur mesure : PWA performantes, plateformes SaaS évolutives et API robustes pour les entreprises modernes.",
      address: "Jávea, Alicante, Espagne",
      schedule: "L-V: 09:00 - 18:00"
    }
  },
  de: {
    landing: {
      heroTitle: "Software-Architektur & Entwicklung",
      heroSubtitle: "Engineering für die Zukunft digitaler Ökosysteme.",
      productsTitle: "Produkte und Lösungen",
      productsDescription: "Integrationsbereite Tools für den realen Betrieb.",
      featuresTitle: "Was Wir Tun",
      featuresDescription: "Dienstleistungen: PWAs, SaaS und Integrationen.",
      testimonialsTitle: "Was unsere Kunden sagen",
      testimonialsSubtitle: "Echte Meinungen von zufriedenen Kunden.",
      faqTitle: "Häufig gestellte Fragen",
      faqSubtitle: "Antworten auf häufige Fragen.",
    },
    company: {
      tagline: "Maßgeschneiderte Softwareentwicklung",
      description: "Zuverlässige und skalierbare Lösungen für Unternehmen.",
      defaultTitle: "OHCodex | Softwareentwicklung",
      // FIX: Texto extendido para cumplir minLength: 50
      defaultDescription: "OHCodex entwickelt maßgeschneiderte Softwarelösungen: Hochleistungs-PWAs, skalierbare SaaS-Plattformen und APIs für moderne Unternehmen.",
      address: "Jávea, Alicante, Spanien",
      schedule: "Mo-Fr: 09:00 - 18:00"
    }
  },
  it: {
    landing: {
      heroTitle: "Architettura & Sviluppo Software",
      heroSubtitle: "Ingegneria per il futuro degli ecosistemi digitali.",
      productsTitle: "Prodotti e Soluzioni",
      productsDescription: "Strumenti pronti all'uso per operazioni reali.",
      featuresTitle: "Cosa Facciamo",
      featuresDescription: "Servizi: PWA, SaaS e integrazioni.",
      testimonialsTitle: "Cosa dicono i nostri clienti",
      testimonialsSubtitle: "Opinioni reali di clienti soddisfatti.",
      faqTitle: "Domande Frequenti",
      faqSubtitle: "Risposte ai dubbi comuni.",
    },
    company: {
      tagline: "Sviluppo Software su Misura",
      description: "Soluzioni affidabili e scalabili per le aziende.",
      defaultTitle: "OHCodex | Sviluppo Software",
      // FIX: Texto extendido para cumplir minLength: 50
      defaultDescription: "OHCodex sviluppa soluzioni software su misura: PWA ad alte prestazioni, piattaforme SaaS scalabili e API robuste per le aziende moderne.",
      address: "Jávea, Alicante, Spagna",
      schedule: "L-V: 09:00 - 18:00"
    }
  },
  pt: {
    landing: {
      heroTitle: "Arquitetura e Desenvolvimento de Software",
      heroSubtitle: "Engenharia para o futuro dos ecossistemas digitais.",
      productsTitle: "Produtos e Soluções",
      productsDescription: "Ferramentas prontas para integrar em operações reais.",
      featuresTitle: "O Que Fazemos",
      featuresDescription: "Serviços: PWAs, SaaS e integrações.",
      testimonialsTitle: "O que dizem nossos clientes",
      testimonialsSubtitle: "Opiniões reais de clientes satisfeitos.",
      faqTitle: "Perguntas Frequentes",
      faqSubtitle: "Respostas para dúvidas comuns.",
    },
    company: {
      tagline: "Desenvolvimento de Software Sob Medida",
      description: "Soluções confiáveis e escaláveis para empresas.",
      defaultTitle: "OHCodex | Desenvolvimento de Software",
      // FIX: Texto extendido para cumplir minLength: 50
      defaultDescription: "A OHCodex desenvolve soluções de software sob medida: PWAs de alto desempenho, plataformas SaaS escaláveis e APIs robustas para empresas modernas.",
      address: "Jávea, Alicante, Espanha",
      schedule: "Seg-Sex: 09:00 - 18:00"
    }
  }
}

export async function GET() {
  const payload = await getPayload({ config: configPromise })
  const locales = ['fr', 'de', 'it', 'pt']
  const results = []

  try {
    console.log('🚀 Iniciando Seed V3 (Length fix)...')

    const companyEs = await payload.findGlobal({ slug: 'company-info' as any, locale: 'es' })
    const landingEs = await payload.findGlobal({ slug: 'landing-page' as any, locale: 'es' })
    const categoriesEs = await payload.find({ collection: 'categories', limit: 100, locale: 'es' })
    const postsEs = await payload.find({ collection: 'posts', limit: 100, locale: 'es' })
    const productsEs = await payload.find({ collection: 'products', limit: 100, locale: 'es' })
    const toolsEs = await payload.find({ collection: 'tools', limit: 100, locale: 'es' })

    for (const locale of locales) {
      console.log(`🌍 Procesando idioma: ${locale}...`)
      const t = TRANSLATIONS[locale]
      const prefix = `[${locale.toUpperCase()}] ` 

      // 1. COMPANY INFO
      try {
        const logoId = typeof companyEs.logo === 'object' ? companyEs.logo?.id : companyEs.logo
        const logoDarkId = typeof companyEs.logoDark === 'object' ? companyEs.logoDark?.id : companyEs.logoDark

        await payload.updateGlobal({
          slug: 'company-info' as any,
          locale: locale as any,
          data: {
            logo: logoId,
            logoDark: logoDarkId,
            tagline: t.company.tagline,
            description: t.company.description,
            defaultTitle: t.company.defaultTitle,
            titleTemplate: companyEs.titleTemplate || '%s | OHCodex',
            defaultDescription: t.company.defaultDescription,
            keywords: companyEs.keywords || [],
            contactEmail: companyEs.contactEmail || 'info@ohcodex.com',
            phoneNumber: companyEs.phoneNumber,
            address: t.company.address,
            schedule: t.company.schedule,
            linkedin: companyEs.linkedin,
            github: companyEs.github,
            twitter: companyEs.twitter,
          }
        })
        results.push({ locale, step: 'company', status: 'ok' })
      } catch (e: any) {
        console.error(`❌ Error en Company (${locale}):`, e.message)
        results.push({ locale, step: 'company', status: 'error', details: e.message })
      }

      // 2. LANDING PAGE
      try {
        await payload.updateGlobal({
          slug: 'landing-page' as any,
          locale: locale as any,
          data: {
            heroTitle: t.landing.heroTitle,
            heroSubtitle: t.landing.heroSubtitle,
            heroBadge: landingEs.heroBadge,
            productsTitle: t.landing.productsTitle,
            productsDescription: t.landing.productsDescription,
            featuresTitle: t.landing.featuresTitle,
            featuresDescription: t.landing.featuresDescription,
            testimonialsTitle: t.landing.testimonialsTitle,
            testimonialsSubtitle: t.landing.testimonialsSubtitle,
            faqTitle: t.landing.faqTitle,
            faqSubtitle: t.landing.faqSubtitle,
            featuresList: landingEs.featuresList?.map((f: any) => ({ 
              icon: f.icon,
              title: `${prefix}${f.title}`, 
              description: `${prefix}${f.description}` 
            })) || [],
            testimonials: landingEs.testimonials?.map((t: any) => ({ 
              authorName: t.authorName,
              authorRole: t.authorRole,
              companyName: t.companyName,
              quote: `${prefix}${t.quote}`,
              authorImage: typeof t.authorImage === 'object' ? t.authorImage?.id : t.authorImage
            })) || [],
            faqs: landingEs.faqs?.map((f: any) => ({ 
              question: `${prefix}${f.question}`, 
              answer: `${prefix}${f.answer}` 
            })) || []
          }
        })
        results.push({ locale, step: 'landing', status: 'ok' })
      } catch (e: any) {
        console.error(`❌ Error en Landing (${locale}):`, e.message)
        results.push({ locale, step: 'landing', status: 'error', details: e.message })
      }

      // 3. COLECCIONES (Sin cambios)
      for (const cat of categoriesEs.docs) {
        try {
          await payload.update({
            collection: 'categories',
            id: cat.id,
            locale: locale as any,
            data: { name: `${prefix}${cat.name}` }
          })
        } catch (e) {}
      }

      for (const post of postsEs.docs) {
        try {
          await payload.update({
            collection: 'posts',
            id: post.id,
            locale: locale as any,
            data: {
              title: `${prefix}${post.title}`,
              slug: `${post.slug}-${locale}`,
              excerpt: `${prefix}${post.excerpt}`,
              content: post.content,
              metaTitle: `${prefix}${post.metaTitle || post.title}`,
              metaDescription: `${prefix}${post.metaDescription || post.excerpt}`
            }
          })
        } catch (e) {}
      }

      for (const prod of productsEs.docs) {
        try {
          await payload.update({
            collection: 'products',
            id: prod.id,
            locale: locale as any,
            data: {
              name: prod.name,
              slug: `${prod.slug}-${locale}`,
              shortDescription: `${prefix}${prod.shortDescription}`,
              description: prod.description,
              metaTitle: `${prefix}${prod.name}`,
              metaDescription: `${prefix}${prod.shortDescription}`
            }
          })
        } catch (e) {}
      }

      for (const tool of toolsEs.docs) {
        try {
          await payload.update({
            collection: 'tools',
            id: tool.id,
            locale: locale as any,
            data: {
              title: tool.title,
              slug: `${tool.slug}`,
              badge: `${prefix}${tool.badge}`,
              shortDescription: `${prefix}${tool.shortDescription}`,
              steps: tool.steps?.map((s: any) => ({ ...s, stepTitle: `${prefix}${s.stepTitle}`, stepDescription: `${prefix}${s.stepDescription || ''}` })),
              ctaTitle: `${prefix}${tool.ctaTitle}`,
              ctaDescription: `${prefix}${tool.ctaDescription}`,
              content: tool.content,
              faqs: tool.faqs?.map((f: any) => ({ ...f, question: `${prefix}${f.question}`, answer: `${prefix}${f.answer}` })),
              metaTitle: `${prefix}${tool.metaTitle || tool.title}`,
              metaDescription: `${prefix}${tool.metaDescription || tool.shortDescription}`
            }
          })
        } catch (e) {}
      }

      results.push({ locale, step: 'collections', status: 'ok' })
    }

    return NextResponse.json({ success: true, message: "Seed process finished successfully", results })

  } catch (error: any) {
    console.error('Fatal Seed error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
// =============== FIN ARCHIVO: src/app/api/seed-all/route.ts =============== //