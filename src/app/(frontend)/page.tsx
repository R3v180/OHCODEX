// ========== src/app/(frontend)/page.tsx ========== //

import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Hero } from '@/components/sections/Hero'
import { ProductsSection } from '@/components/sections/Products'
import { FeaturesSection } from '@/components/sections/Features'
import { ContactSection } from '@/components/sections/Contact'
import type { CompanyInfo } from '@/payload-types'

// --- CAMBIO IMPORTANTE PARA SEO Y VELOCIDAD ---
// Antes: export const dynamic = 'force-dynamic' (Lento 🐢)
// Ahora: Revalidación cada 600 segundos (10 minutos). (Rápido 🚀)
// Google recibirá una respuesta instantánea (HTML estático) y tus datos se actualizarán solos.
export const revalidate = 600 

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })
  
  // 1. Recuperamos los datos de la empresa para el JSON-LD y el contacto
  // Usamos 'as any' en el slug para evitar conflictos de tipado estricto si el tipo global no coincide perfectamente
  const company = (await payload.findGlobal({
    slug: 'company-info' as any,
  })) as unknown as CompanyInfo

  // URL base para los metadatos
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://ohcodex.com'
  
  // Gestión segura del logo para los datos estructurados
  const logoUrl = typeof company?.logo === 'object' && company.logo?.url 
    ? company.logo.url 
    : `${baseUrl}/logo.png` // Asegúrate de tener un logo.png en /public también si quieres que esto funcione perfecto

  // 2. DATOS ESTRUCTURADOS (JSON-LD)
  // Esto es lo que lee Google para mostrar "fichas ricas" a la derecha en los resultados
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService', // O 'SoftwareHouse'
    name: 'OHCodex',
    url: baseUrl,
    logo: logoUrl,
    image: logoUrl,
    description: company?.description || 'Ingeniería de software avanzada y desarrollo de productos digitales.',
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
    // Enlaces a redes sociales para que Google conecte tu entidad
    sameAs: [
      company?.linkedin,
      company?.github,
      company?.twitter,
    ].filter(Boolean), // Elimina los que estén vacíos
    priceRange: '$$$', // Indica rango de precios (opcional)
  }

  return (
    <>
      {/* Inyección del Script JSON-LD para Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Secciones Visuales */}
      <Hero />
      <ProductsSection />
      <FeaturesSection />
      
      {/* Pasamos el email real recuperado de la BD */}
      <ContactSection email={company?.contactEmail || 'info@ohcodex.com'} />
    </>
  )
}