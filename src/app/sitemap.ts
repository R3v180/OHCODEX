// ========== src/app/sitemap.ts ========== //

import { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: configPromise })
  
  // 1. Definir la URL base
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://ohcodex.com'

  // 2. Obtener productos para indexar
  // CAMBIO: Añadimos 'development' y 'concept' para que TODO el portfolio se indexe
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

  // 3. Generar URLs dinámicas de productos
  const productUrls = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: product.isFeatured ? 0.9 : 0.7, // Prioridad más alta si es destacado
  }))

  // 4. Generar URLs estáticas (Home y Legales)
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1,
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

  // 5. Unir todo y devolver
  return [...staticRoutes, ...productUrls]
}