import { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { routing } from '@/i18n/routing'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: configPromise })
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://ohcodex.com'
  const locales = routing.locales

  // 1. OPTIMIZACIÓN DE RENDIMIENTO:
  // Consultamos "locale: 'all'" UNA sola vez para traer los slugs en todos los idiomas.
  // Esto evita hacer 6 consultas por colección (18 en total) y baja a solo 3.
  
  const [productsResult, postsResult, toolsResult] = await Promise.all([
    payload.find({
      collection: 'products',
      depth: 0,
      limit: 1000,
      locale: 'all' as any, // Trae { es: 'slug-es', en: 'slug-en' }
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

  // --- HELPER: Obtener ruta base traducida desde routing.ts ---
  const getBaseUrlForLocale = (pathKey: string, locale: string) => {
    // @ts-ignore - Accedemos a la config de rutas
    const pathConfig = routing.pathnames[pathKey]
    
    // Si es un string (ej: '/'), es igual para todos
    if (typeof pathConfig === 'string') return pathConfig
    
    // Si es un objeto, buscamos el idioma, o fallback a la key
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

  // Generamos entradas estáticas
  for (const key of staticKeys) {
    for (const locale of locales) {
      const localizedPath = getBaseUrlForLocale(key, locale)
      const url = `${baseUrl}/${locale}${localizedPath === '/' ? '' : localizedPath}`

      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: key === '/' ? 1 : 0.8,
        // Alternates para SEO Internacional (Google ama esto)
        alternates: {
          languages: locales.reduce((acc, l) => {
            const p = getBaseUrlForLocale(key, l)
            acc[l] = `${baseUrl}/${l}${p === '/' ? '' : p}`
            return acc
          }, {} as Record<string, string>)
        }
      })
    }
  }

  // --- B. RUTAS DINÁMICAS (Con Alternates correctos) ---
  
  // Función generadora para evitar repetir lógica
  const generateDynamicEntries = (
    docs: any[], 
    basePathKey: string, // Ej: '/tools'
    priority: number,
    changeFreq: 'weekly' | 'monthly'
  ) => {
    docs.forEach((doc) => {
      // El slug viene como objeto: { es: 'mi-slug', en: 'my-slug' ... }
      const slugs = doc.slug || {}

      for (const locale of locales) {
        // Obtenemos el slug para este idioma específico
        const currentSlug = slugs[locale]
        if (!currentSlug) continue // Si no hay traducción, saltamos

        // Obtenemos la base traducida (Ej: '/herramientas' para 'es', '/tools' para 'en')
        const translatedBase = getBaseUrlForLocale(basePathKey, locale)
        
        const url = `${baseUrl}/${locale}${translatedBase}/${currentSlug}`

        sitemapEntries.push({
          url,
          lastModified: new Date(doc.updatedAt),
          changeFrequency: changeFreq,
          priority: priority,
          // Generamos los alternates cruzando los slugs que ya tenemos en memoria
          alternates: {
            languages: locales.reduce((acc, l) => {
              const altSlug = slugs[l]
              if (altSlug) {
                const altBase = getBaseUrlForLocale(basePathKey, l)
                acc[l] = `${baseUrl}/${l}${altBase}/${altSlug}`
              }
              return acc
            }, {} as Record<string, string>)
          }
        })
      }
    })
  }

  // 1. Generar Herramientas (Base: '/tools' -> '/herramientas', '/outils'...)
  generateDynamicEntries(toolsResult.docs, '/tools', 0.9, 'weekly')

  // 2. Generar Blog (Base: '/blog' -> '/blog' en todos según routing.ts actual, pero preparado para futuro)
  generateDynamicEntries(postsResult.docs, '/blog', 0.7, 'monthly')

  // 3. Generar Productos (Base: '/products' implícito)
  // OJO: En tu routing.ts NO tienes definido '/products', así que Next-Intl usará '/products' por defecto.
  // Si quieres que sea /productos en español, añádelo a routing.ts primero.
  // Aquí asumo que la base es '/products' y si no está en routing, usa el fallback.
  generateDynamicEntries(productsResult.docs, '/products', 0.8, 'weekly')

  return sitemapEntries
}