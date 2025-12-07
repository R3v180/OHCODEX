// ========== src/app/robots.ts ========== //

// -----------------------------------------------------------------------------
// Archivo: src/app/robots.ts
// Versión: 1.0.0
// Descripción: Generador dinámico del archivo robots.txt.
// Indica a Google qué partes de la web debe indexar y cuáles ignorar.
// -----------------------------------------------------------------------------

import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // URL base dinámica (debe coincidir con la de sitemap.ts)
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://ohcodex.com'

  return {
    rules: {
      userAgent: '*', // Reglas para todos los bots (Google, Bing, etc.)
      allow: '/',     // Permitir indexar la web pública
      disallow: [
        '/admin/',    // ⛔ PROHIBIDO: Panel de administración
        '/api/',      // ⛔ PROHIBIDO: Endpoints de la API (para no gastar recursos de crawling)
      ],
    },
    // Enlace al sitemap para facilitar el descubrimiento
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

// ========== Fin de src/app/robots.ts ========== //