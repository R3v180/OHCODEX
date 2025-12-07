// ========== src/app/sitemap.ts ========== //

// -----------------------------------------------------------------------------
// Archivo: src/app/sitemap.ts
// Versión: 1.0.0
// Descripción: Generador dinámico del mapa del sitio (Sitemap XML).
// Ayuda a Google a indexar todas las páginas, incluyendo los productos del CMS.
// -----------------------------------------------------------------------------

import { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: configPromise })
  
  // 1. Definir la URL base (Producción o Local)
  // IMPORTANTE: Asegúrate de configurar la variable NEXT_PUBLIC_SERVER_URL en Render
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://ohcodex.com'

  // 2. Obtener todos los productos publicados (live)
  // Solo queremos que Google indexe lo que está listo, no los borradores
  const { docs: products } = await payload.find({
    collection: 'products',
    where: {
      status: {
        equals: 'live', // Solo productos "En Producción"
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
    priority: 0.8,
  }))

  // 4. Generar URLs estáticas (Home y Legales)
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1, // La Home es la más importante
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

// ========== Fin de src/app/sitemap.ts ========== //