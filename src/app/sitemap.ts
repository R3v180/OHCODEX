import { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: configPromise })
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://ohcodex.com'
  
  // Definimos los idiomas que soporta la web
  const locales = ['es', 'en'] as const

  let sitemapEntries: MetadataRoute.Sitemap = []

  // Recorremos cada idioma para generar sus URLs específicas
  for (const locale of locales) {
    
    // 1. Obtener PRODUCTOS en el idioma actual (para tener el slug traducido)
    const { docs: products } = await payload.find({
      collection: 'products',
      where: {
        status: { in: ['live', 'beta', 'development', 'concept'] },
      },
      depth: 0,
      limit: 1000,
      locale: locale, // 👈 Clave: Pedimos el slug en este idioma
    })

    // 2. Obtener POSTS en el idioma actual
    const { docs: posts } = await payload.find({
      collection: 'posts',
      depth: 0,
      limit: 1000,
      locale: locale, // 👈 Clave: Pedimos el slug en este idioma
    })

    // 3. URLs ESTÁTICAS (Home, Blog Index, Legales)
    // Nota: Añadimos el prefijo /es o /en a todas
    const staticRoutes = [
      '', // Home
      '/blog',
      '/aviso-legal',
      '/privacidad',
      '/terminos',
    ].map(route => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1 : 0.8, // Home prioridad 1
    }))

    // 4. URLs PRODUCTOS
    const productUrls = products.map((product) => ({
      url: `${baseUrl}/${locale}/products/${product.slug}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: product.isFeatured ? 0.9 : 0.7,
    }))

    // 5. URLs POSTS
    const postUrls = posts.map((post) => ({
      url: `${baseUrl}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    // Añadir todo al array principal
    sitemapEntries.push(...staticRoutes, ...productUrls, ...postUrls)
  }

  return sitemapEntries
}