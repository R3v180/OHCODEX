import { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Tool, Product, Post } from '@/payload-types'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: configPromise })
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://ohcodex.com'
  const locales = ['es', 'en'] as const

  let sitemapEntries: MetadataRoute.Sitemap = []

  // Iteramos por cada idioma
  for (const locale of locales) {
    
    // 1. Consultar PRODUCTOS
    const { docs: products } = await payload.find({
      collection: 'products',
      depth: 0,
      limit: 1000,
      locale: locale,
    }) as unknown as { docs: Product[] }

    // 2. Consultar POSTS
    const { docs: posts } = await payload.find({
      collection: 'posts',
      depth: 0,
      limit: 1000,
      locale: locale,
    }) as unknown as { docs: Post[] }

    // 3. Consultar HERRAMIENTAS (¡NUEVO!)
    // Ahora leemos las tools reales de la base de datos
    const { docs: tools } = await payload.find({
      collection: 'tools',
      depth: 0,
      limit: 1000,
      locale: locale,
    }) as unknown as { docs: Tool[] }

    // --- GENERACIÓN DE RUTAS ---

    // A. Rutas Estáticas
    const staticRoutes = [
      '',              // Home
      '/blog',         // Blog Index
      '/tools',        // Tools Hub (App Store)
      '/aviso-legal',
      '/privacidad',
      '/terminos',
    ].map(route => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1 : 0.8,
      alternates: {
        languages: {
          es: `${baseUrl}/es${route}`,
          en: `${baseUrl}/en${route}`,
        },
      },
    }))

    // B. Rutas de Herramientas (Dinámicas desde CMS)
    const toolsRoutes = tools.map((tool) => ({
      url: `${baseUrl}/${locale}/tools/${tool.slug}`,
      lastModified: new Date(tool.updatedAt), // Google sabrá cuándo actualizas el texto SEO
      changeFrequency: 'weekly' as const,
      priority: 0.9,
      alternates: {
        languages: {
          es: `${baseUrl}/es/tools/${tool.slug}`,
          en: `${baseUrl}/en/tools/${tool.slug}`,
        },
      },
    }))

    // C. Rutas de Productos
    const productUrls = products.map((product) => ({
      url: `${baseUrl}/${locale}/products/${product.slug}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      alternates: {
        languages: {
          es: `${baseUrl}/es/products/${product.slug}`,
          en: `${baseUrl}/en/products/${product.slug}`,
        },
      },
    }))

    // D. Rutas de Posts
    const postUrls = posts.map((post) => ({
      url: `${baseUrl}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      alternates: {
        languages: {
          es: `${baseUrl}/es/blog/${post.slug}`,
          en: `${baseUrl}/en/blog/${post.slug}`,
        },
      },
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