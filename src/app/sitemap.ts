// src/app/sitemap.ts
import { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { routing } from '@/i18n/routing'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: configPromise })
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://ohcodex.com'
  const locales = routing.locales
  const postsPerPage = 6

  // 1. Carga masiva de datos (Productos, Posts, Tools + Categories)
  const [productsResult, postsResult, toolsResult, categoriesResult] = await Promise.all([
    payload.find({
      collection: 'products',
      depth: 0,
      limit: 1000,
      locale: 'all' as any,
    }),
    payload.find({
      collection: 'posts',
      depth: 1, // Subimos a 1 para poder acceder al ID de la categoría en el conteo
      limit: 1000,
      locale: 'all' as any,
    }),
    payload.find({
      collection: 'tools',
      depth: 0,
      limit: 1000,
      locale: 'all' as any,
    }),
    payload.find({
      collection: 'categories',
      depth: 0,
      limit: 1000,
      locale: 'all' as any,
    }),
  ])

  let sitemapEntries: MetadataRoute.Sitemap = []

  // --- HELPER: Obtener patrón de ruta (ej: /produits/[slug]) ---
  const getPathPattern = (pathKey: string, locale: string) => {
    // @ts-ignore
    const pathConfig = routing.pathnames[pathKey]
    if (typeof pathConfig === 'string') return pathConfig
    // @ts-ignore
    return pathConfig?.[locale] || pathKey
  }

  // --- A. RUTAS ESTÁTICAS ---
  const staticKeys = [
    '/',
    '/blog',
    '/tools',
    '/aviso-legal',
    '/privacidad',
    '/terminos',
  ]

  for (const key of staticKeys) {
    for (const locale of locales) {
      const path = getPathPattern(key, locale)
      const url = `${baseUrl}/${locale}${path === '/' ? '' : path}`

      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: key === '/' ? 1 : 0.8,
        alternates: {
          languages: locales.reduce((acc, l) => {
            const p = getPathPattern(key, l)
            acc[l] = `${baseUrl}/${l}${p === '/' ? '' : p}`
            return acc
          }, {} as Record<string, string>)
        }
      })
    }
  }

  // --- B. RUTAS DE CATEGORÍAS (SILOS SEO) ---
  categoriesResult.docs.forEach((category: any) => {
    const categorySlug = category.slug

    for (const locale of locales) {
      const pattern = getPathPattern('/blog/category/[category]', locale)
      const path = pattern.replace('[category]', categorySlug)
      const url = `${baseUrl}/${locale}${path}`

      sitemapEntries.push({
        url,
        lastModified: new Date(category.updatedAt || new Date()),
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: {
          languages: locales.reduce((acc, l) => {
            const p = getPathPattern('/blog/category/[category]', l)
            acc[l] = `${baseUrl}/${l}${p.replace('[category]', categorySlug)}`
            return acc
          }, {} as Record<string, string>)
        }
      })
    }

    // --- C. PAGINACIÓN DENTRO DE CATEGORÍA (NUEVO) ---
    const categoryPostsCount = postsResult.docs.filter(p => 
      typeof p.category === 'object' ? p.category.id === category.id : p.category === category.id
    ).length
    const catTotalPages = Math.ceil(categoryPostsCount / postsPerPage)

    if (catTotalPages > 1) {
      for (let i = 2; i <= catTotalPages; i++) {
        for (const locale of locales) {
          const pattern = getPathPattern('/blog/category/[category]/[pageNumber]', locale)
          const path = pattern.replace('[category]', categorySlug).replace('[pageNumber]', i.toString())
          const url = `${baseUrl}/${locale}${path}`

          sitemapEntries.push({
            url,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.4,
            alternates: {
              languages: locales.reduce((acc, l) => {
                const p = getPathPattern('/blog/category/[category]/[pageNumber]', l)
                acc[l] = `${baseUrl}/${l}${p.replace('[category]', categorySlug).replace('[pageNumber]', i.toString())}`
                return acc
              }, {} as Record<string, string>)
            }
          })
        }
      }
    }
  })

  // --- D. RUTAS DE PAGINACIÓN GENERAL (NUEVO) ---
  const totalPages = Math.ceil(postsResult.totalDocs / postsPerPage)
  for (let i = 2; i <= totalPages; i++) {
    for (const locale of locales) {
      const pattern = getPathPattern('/blog/page/[pageNumber]', locale)
      const path = pattern.replace('[pageNumber]', i.toString())
      const url = `${baseUrl}/${locale}${path}`

      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.5,
        alternates: {
          languages: locales.reduce((acc, l) => {
            const p = getPathPattern('/blog/page/[pageNumber]', l)
            acc[l] = `${baseUrl}/${l}${p.replace('[pageNumber]', i.toString())}`
            return acc
          }, {} as Record<string, string>)
        }
      })
    }
  }

  // --- E. RUTAS DINÁMICAS (HÍBRIDA - Tu lógica original exacta) ---
  const generateDynamicEntries = (
    docs: any[], 
    routingKey: string, 
    priority: number,
    changeFreq: 'weekly' | 'monthly'
  ) => {
    docs.forEach((doc) => {
      const isGlobalSlug = typeof doc.slug === 'string'
      const slugData = doc.slug

      for (const locale of locales) {
        let currentSlug = ''
        
        if (isGlobalSlug) {
          currentSlug = slugData 
        } else if (slugData && slugData[locale]) {
          currentSlug = slugData[locale] 
        }

        if (!currentSlug) continue

        const pattern = getPathPattern(routingKey, locale)
        const path = pattern.replace('[slug]', currentSlug)
        const url = `${baseUrl}/${locale}${path}`

        sitemapEntries.push({
          url,
          lastModified: new Date(doc.updatedAt),
          changeFrequency: changeFreq,
          priority: priority,
          alternates: {
            languages: locales.reduce((acc, l) => {
              let altSlug = ''
              if (isGlobalSlug) {
                altSlug = slugData
              } else if (slugData && slugData[l]) {
                altSlug = slugData[l]
              }

              if (altSlug) {
                const altPattern = getPathPattern(routingKey, l)
                const altPath = altPattern.replace('[slug]', altSlug)
                acc[l] = `${baseUrl}/${l}${altPath}`
              }
              return acc
            }, {} as Record<string, string>)
          }
        })
      }
    })
  }

  // Generamos las entradas finales
  generateDynamicEntries(toolsResult.docs, '/tools/[slug]', 0.9, 'weekly')
  generateDynamicEntries(postsResult.docs, '/blog/[slug]', 0.8, 'monthly')
  generateDynamicEntries(productsResult.docs, '/products/[slug]', 0.8, 'weekly')

  return sitemapEntries
}