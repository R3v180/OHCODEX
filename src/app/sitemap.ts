// =============== INICIO ARCHIVO: src/app/sitemap.ts =============== //
import { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Tool, Product, Post } from '@/payload-types'
import { routing } from '@/i18n/routing'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: configPromise })
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://ohcodex.com'
  
  // Usamos la lista centralizada (es, en, fr, de, it, pt)
  const locales = routing.locales 

  let sitemapEntries: MetadataRoute.Sitemap = []

  // Iteramos por cada idioma
  for (const locale of locales) {
    
    // 1. Consultar PRODUCTOS
    const { docs: products } = await payload.find({
      collection: 'products',
      depth: 0,
      limit: 1000,
      // Usamos 'as any' temporalmente porque los tipos internos de Payload 
      // aún no se han regenerado para reconocer los nuevos idiomas.
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

    // --- HELPER PARA ALTERNATES (HREFLANG) ---
    // Genera automáticamente los enlaces a todos los idiomas disponibles
    const generateAlternates = (path: string) => {
      const languages: Record<string, string> = {}
      locales.forEach((lang) => {
        languages[lang] = `${baseUrl}/${lang}${path}`
      })
      return { languages }
    }

    // --- GENERACIÓN DE RUTAS ---

    // A. Rutas Estáticas
    const staticRoutes = [
      '',              // Home
      '/blog',         // Blog Index
      '/tools',        // Tools Hub
      '/aviso-legal',
      '/privacidad',
      '/terminos',
    ].map(route => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1 : 0.8,
      alternates: generateAlternates(route),
    }))

    // B. Rutas de Herramientas
    const toolsRoutes = tools.map((tool) => ({
      url: `${baseUrl}/${locale}/tools/${tool.slug}`,
      lastModified: new Date(tool.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
      alternates: generateAlternates(`/tools/${tool.slug}`),
    }))

    // C. Rutas de Productos
    const productUrls = products.map((product) => ({
      url: `${baseUrl}/${locale}/products/${product.slug}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      alternates: generateAlternates(`/products/${product.slug}`),
    }))

    // D. Rutas de Posts
    const postUrls = posts.map((post) => ({
      url: `${baseUrl}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      alternates: generateAlternates(`/blog/${post.slug}`),
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