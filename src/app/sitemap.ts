// =============== INICIO ARCHIVO: src/app/sitemap.ts =============== //
import { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Tool, Product, Post } from '@/payload-types'
import { routing } from '@/i18n/routing'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: configPromise })
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://ohcodex.com'
  
  // Usamos la lista centralizada de idiomas
  const locales = routing.locales 

  let sitemapEntries: MetadataRoute.Sitemap = []

  // --- HELPER: Traducir rutas estáticas y bases dinámicas ---
  // Transforma '/aviso-legal' en '/mentions-legales' si el locale es 'fr'
  const getPathForLocale = (pathKey: string, locale: string) => {
    // @ts-ignore - Acceso dinámico al objeto de configuración de rutas
    const pathConfig = routing.pathnames[pathKey]
    
    if (!pathConfig) return pathKey // Fallback si no está en routing.ts
    if (typeof pathConfig === 'string') return pathConfig
    
    // @ts-ignore
    return pathConfig[locale] || pathKey
  }

  // --- HELPER: Resolver base dinámica (ej: /tools/[slug] -> /outils) ---
  const getDynamicBasePath = (pathKey: string, locale: string) => {
    const fullPath = getPathForLocale(pathKey, locale)
    // Quitamos la parte '/[slug]' para quedarnos con la base
    return fullPath.replace('/[slug]', '')
  }

  // Iteramos por cada idioma para generar sus entradas
  for (const locale of locales) {
    
    // 1. Consultar PRODUCTOS
    const { docs: products } = await payload.find({
      collection: 'products',
      depth: 0,
      limit: 1000,
      locale: locale as any, 
    }) as unknown as { docs: Product[] }

    // 2. Consultar POSTS
    const { docs: posts } = await payload.find({
      collection: 'posts',
      depth: 0,
      limit: 1000,
      locale: locale as any,
    }) as unknown as { docs: Post[] }

    // 3. Consultar HERRAMIENTAS
    const { docs: tools } = await payload.find({
      collection: 'tools',
      depth: 0,
      limit: 1000,
      locale: locale as any,
    }) as unknown as { docs: Tool[] }

    // --- A. Rutas Estáticas ---
    // Usamos las claves definidas en routing.ts
    const staticKeys = [
      '/',              
      '/blog',          
      '/tools',        
      '/aviso-legal',
      '/privacidad',
      '/terminos',
    ]

    const staticRoutes = staticKeys.map(key => {
      // Obtenemos la ruta traducida real (ej: /fr/mentions-legales)
      const translatedPath = getPathForLocale(key, locale)
      const url = `${baseUrl}/${locale}${translatedPath === '/' ? '' : translatedPath}`

      return {
        url,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: key === '/' ? 1 : 0.8,
        // Generamos los alternates correctos para cada idioma
        alternates: {
          languages: locales.reduce((acc, l) => {
            const p = getPathForLocale(key, l)
            acc[l] = `${baseUrl}/${l}${p === '/' ? '' : p}`
            return acc
          }, {} as Record<string, string>)
        }
      }
    })

    // --- B. Rutas de Herramientas ---
    const toolsBase = getDynamicBasePath('/tools/[slug]', locale)
    
    const toolsRoutes = tools.map((tool) => ({
      // Construimos: /fr + /outils + /slug-de-la-herramienta
      url: `${baseUrl}/${locale}${toolsBase}/${tool.slug}`,
      lastModified: new Date(tool.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
      // NOTA: Para alternates perfectos en dinámicas necesitaríamos consultar
      // todos los slugs de todos los idiomas. Por rendimiento, aquí enlazamos 
      // a la raíz del idioma o omitimos si no tenemos el slug traducido a mano.
    }))

    // --- C. Rutas de Productos ---
    const productsBase = getDynamicBasePath('/products/[slug]', locale)
    
    const productUrls = products.map((product) => ({
      url: `${baseUrl}/${locale}${productsBase}/${product.slug}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // --- D. Rutas de Posts ---
    const blogBase = getDynamicBasePath('/blog/[slug]', locale)

    const postUrls = posts.map((post) => ({
      url: `${baseUrl}/${locale}${blogBase}/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    sitemapEntries.push(
      ...staticRoutes, 
      ...toolsRoutes, 
      ...productUrls, 
      ...postUrls
    )
  }

  return sitemapEntries
}
// =============== FIN ARCHIVO: src/app/sitemap.ts =============== //