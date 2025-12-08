import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Hero } from '@/components/sections/Hero'
import { ProductsSection } from '@/components/sections/Products'
import { FeaturesSection } from '@/components/sections/Features'
import { ContactSection } from '@/components/sections/Contact'
import type { CompanyInfo } from '@/payload-types'

// Forzamos que la página se regenere en cada visita para tener datos frescos
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })
  
  // 1. Recuperamos los datos de la empresa
  const company = (await payload.findGlobal({
    slug: 'company-info' as any,
  })) as unknown as CompanyInfo

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://ohcodex.com'
  
  // Gestión segura del logo
  const logoUrl = typeof company?.logo === 'object' && company.logo?.url 
    ? company.logo.url 
    : `${baseUrl}/logo.png`

  // Metadatos para Google
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'OHCodex',
    url: baseUrl,
    logo: logoUrl,
    image: logoUrl,
    description: company?.description || 'Ingeniería de software avanzada.',
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
      email: company?.contactEmail, // Email para SEO
      areaServed: 'ES',
      availableLanguage: ['es', 'en'],
    },
    sameAs: [
      company?.linkedin,
      company?.github,
      company?.twitter,
    ].filter(Boolean),
    priceRange: '$$$',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Hero />
      <ProductsSection />
      <FeaturesSection />
      
      {/* --- AQUÍ ESTÁ LA CLAVE --- */}
      {/* Pasamos el email recuperado de la BD al componente visual */}
      <ContactSection email={company?.contactEmail || 'info@ohcodex.com'} />
    </>
  )
}