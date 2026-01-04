import { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: configPromise })
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://ohcodex.com'
  const locales = ['es', 'en'] as const

  const tools = [
    'vault',
    'image-optimizer',
    'pdf-studio',
    'data-station',
    'qr-factory',
  ]

  let sitemapEntries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    // 1. Consultar PRODUCTOS
    const { docs: products } = await payload.find({
      collection: 'products',
      depth: 0,
      limit: 1000,
      locale: locale,
    })

    // 2. Consultar POSTS
    const { docs: posts } = await payload.find({
      collection: 'posts',
      depth: 0,
      limit: 1000,
      locale: locale,
    })

    // 3. RUTAS ESTÁTICAS
    const staticRoutes = [
      '',
      '/blog',
      '/aviso-legal',
      '/privacidad',
      '/terminos',
      '/tools',
    ].map(route => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1 : 0.8,
      // Esto le dice a Google que existen versiones en otros idiomas para esta misma ruta
      alternates: {
        languages: {
          es: `${baseUrl}/es${route}`,
          en: `${baseUrl}/en${route}`,
        },
      },
    }))

    // 4. RUTAS DE TOOLS
    const toolsRoutes = tools.map(tool => ({
      url: `${baseUrl}/${locale}/tools/${tool}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
      alternates: {
        languages: {
          es: `${baseUrl}/es/tools/${tool}`,
          en: `${baseUrl}/en/tools/${tool}`,
        },
      },
    }))

    // 5. URLs DE PRODUCTOS
    // Nota: Como los slugs cambian, aquí Google los indexará por separado.
    const productUrls = products.map((product) => ({
      url: `${baseUrl}/${locale}/products/${product.slug}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // 6. URLs DE POSTS
    const postUrls = posts.map((post) => ({
      url: `${baseUrl}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    sitemapEntries.push(...staticRoutes, ...toolsRoutes, ...productUrls, ...postUrls)
  }

  return sitemapEntries
}