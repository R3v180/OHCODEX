// =============== INICIO ARCHIVO: src/app/sitemap.ts =============== //
import { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { routing } from '@/i18n/routing'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: configPromise })
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://ohcodex.com'
  const locales = routing.locales

  // 1. Carga masiva de datos en todos los idiomas (Optimizado)
  // Usamos locale: 'all' para recibir los slugs como objetos { es: '...', en: '...' }
  const [productsResult, postsResult, toolsResult] = await Promise.all([
    payload.find({
      collection: 'products',
      depth: 0,
      limit: 1000,
      locale: 'all' as any,
    }),
    payload.find({
      collection: 'posts',
      depth: 0,
      limit: 1000,
      locale: 'all' as any,
    }),
    payload.find({
      collection: 'tools',
      depth: 0,
      limit: 1000,
      locale: 'all' as any,
    }),
  ])

  let sitemapEntries: MetadataRoute.Sitemap = []

  // --- HELPER: Obtener el patrón de ruta traducido ---
  // Ejemplo: Input('/products/[slug]', 'fr') -> Output('/produits/[slug]')
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
    '/blog',       // Índice del blog
    '/tools',      // Índice de herramientas
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

  // --- B. RUTAS DINÁMICAS ---
  
  const generateDynamicEntries = (
    docs: any[], 
    routingKey: string, // Ej: '/products/[slug]'
    priority: number,
    changeFreq: 'weekly' | 'monthly'
  ) => {
    docs.forEach((doc) => {
      const slugs = doc.slug || {}

      for (const locale of locales) {
        // 1. Obtenemos el slug para el idioma actual
        const currentSlug = slugs[locale]
        if (!currentSlug) continue

        // 2. Obtenemos el patrón (ej: /produits/[slug])
        const pattern = getPathPattern(routingKey, locale)
        
        // 3. Reemplazamos [slug] por el valor real
        const path = pattern.replace('[slug]', currentSlug)
        
        const url = `${baseUrl}/${locale}${path}`

        sitemapEntries.push({
          url,
          lastModified: new Date(doc.updatedAt),
          changeFrequency: changeFreq,
          priority: priority,
          // 4. Generamos los alternates cruzando idiomas
          alternates: {
            languages: locales.reduce((acc, l) => {
              const altSlug = slugs[l]
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

  // Generamos las entradas usando las claves exactas de routing.ts
  generateDynamicEntries(toolsResult.docs, '/tools/[slug]', 0.9, 'weekly')
  generateDynamicEntries(postsResult.docs, '/blog/[slug]', 0.7, 'monthly')
  generateDynamicEntries(productsResult.docs, '/products/[slug]', 0.8, 'weekly')

  return sitemapEntries
}
// =============== FIN ARCHIVO: src/app/sitemap.ts =============== //