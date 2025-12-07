// ========== src/app/(frontend)/page.tsx ========== //

// -----------------------------------------------------------------------------
// Archivo: src/app/(frontend)/page.tsx
// Versión: 2.0.0 - SEO Avanzado (JSON-LD)
// Descripción: Home con inyección de Datos Estructurados (Schema.org).
// Ayuda a Google a entender que esto es una Empresa de Software.
// -----------------------------------------------------------------------------

import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Hero } from '@/components/sections/Hero'
import { ProductsSection } from '@/components/sections/Products'
import { FeaturesSection } from '@/components/sections/Features'
import { ContactSection } from '@/components/sections/Contact'
import type { CompanyInfo } from '@/payload-types'

export default async function HomePage() {
  // 1. Obtener datos de la empresa para el SEO
  const payload = await getPayload({ config: configPromise })
  const company = (await payload.findGlobal({
    slug: 'company-info' as any,
  })) as unknown as CompanyInfo

  // URL base segura
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://ohcodex.com'
  
  // Obtener URL del logo (si existe)
  const logoUrl = typeof company?.logo === 'object' && company.logo?.url 
    ? `${baseUrl}${company.logo.url}` 
    : `${baseUrl}/logo.png`

  // 2. Construir el Esquema JSON-LD (Organization / ProfessionalService)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService', // Mejor que 'Organization' para servicios de IT
    name: 'OHCodex',
    url: baseUrl,
    logo: logoUrl,
    image: logoUrl,
    description: company?.description || 'Ingeniería de software avanzada y desarrollo SaaS.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Jávea',
      addressRegion: 'Alicante',
      addressCountry: 'ES',
      streetAddress: company?.address || 'Jávea, Alicante',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: company?.phoneNumber,
      contactType: 'customer service',
      email: company?.contactEmail,
      areaServed: 'ES',
      availableLanguage: ['es', 'en'],
    },
    sameAs: [
      company?.linkedin,
      company?.github,
      company?.twitter,
    ].filter(Boolean), // Filtra los que estén vacíos
    priceRange: '$$$',
  }

  return (
    <>
      {/* Script invisible para Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Contenido Visual */}
      <Hero />
      <ProductsSection />
      <FeaturesSection />
      <ContactSection />
    </>
  )
}

// ========== Fin de src/app/(frontend)/page.tsx ========== //