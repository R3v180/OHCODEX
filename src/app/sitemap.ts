// ========== src/app/sitemap.ts ========== //

import { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: configPromise })
  
  // 1. Definir la URL base
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://ohcodex.com'

  // 2. Obtener PRODUCTOS
  const { docs: products } = await payload.find({
    collection: 'products',
    where: {
      status: {
        in: ['live', 'beta', 'development', 'concept'], 
      },
    },
    depth: 0,
    limit: 1000,
  })

  // 3. Obtener POSTS DEL BLOG (Nuevo)
  const { docs: posts } = await payload.find({
    collection: 'posts',
    depth: 0,
    limit: 1000,
  })

  // 4. Generar URLs dinámicas de PRODUCTOS
  const productUrls = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: product.isFeatured ? 0.9 : 0.7,
  }))

  // 5. Generar URLs dinámicas de POSTS (Nuevo)
  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'monthly' as const, // Los posts cambian menos que los productos
    priority: 0.6, // Prioridad estándar para artículos
  }))

  // 6. Generar URLs estáticas (Home, Blog Index y Legales)
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`, // Índice del blog
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/aviso-legal`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacidad`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terminos`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]

  // 7. Unir todo y devolver
  return [...staticRoutes, ...productUrls, ...postUrls]
}