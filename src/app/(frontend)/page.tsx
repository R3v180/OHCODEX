// ========== src/app/(frontend)/page.tsx ========== //

import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Hero } from '@/components/sections/Hero'
import { TrustBar } from '@/components/sections/TrustBar'
import { ProductsSection } from '@/components/sections/Products'
import { FeaturesSection } from '@/components/sections/Features'
import { Testimonials } from '@/components/sections/Testimonials'
import { FAQ } from '@/components/sections/FAQ'
import { ContactSection } from '@/components/sections/Contact'
import type { CompanyInfo, LandingPage } from '@/payload-types'

// Revalidación rápida (10 min) para mantener el SEO fresco pero rápido
export const revalidate = 600 

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })
  
  // 1. Carga de datos (Paralela para mayor velocidad)
  const [company, landing] = await Promise.all([
    payload.findGlobal({
      slug: 'company-info' as any,
    }) as unknown as CompanyInfo,
    payload.findGlobal({
      slug: 'landing-page' as any,
    }) as unknown as LandingPage
  ])

  // URL base para metadatos
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://ohcodex.com'
  
  // Gestión del Logo para JSON-LD
  const logoUrl = typeof company?.logo === 'object' && company.logo?.url 
    ? company.logo.url 
    : `${baseUrl}/logo.png`

  // 2. DATOS ESTRUCTURADOS (JSON-LD - Organization)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
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
    sameAs: [
      company?.linkedin,
      company?.github,
      company?.twitter,
    ].filter(Boolean),
    priceRange: '$$$',
  }

  // Preparar datos para los componentes (Mapeo seguro)
  // Convertimos los datos de Payload al formato que esperan nuestros componentes
  
  const testimonialData = landing.testimonials?.map(t => ({
    id: t.id,
    authorName: t.authorName,
    authorRole: t.authorRole,
    companyName: t.companyName,
    quote: t.quote,
    authorImage: t.authorImage
  })) || []

  const faqData = landing.faqs?.map(f => ({
    id: f.id,
    question: f.question,
    answer: f.answer
  })) || []

  return (
    <>
      {/* Script JSON-LD Principal */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. HERO (Portada) */}
      <Hero />

      {/* 2. TRUST BAR (Logos Tecnológicos) - NUEVO */}
      <TrustBar 
        logos={landing.trustLogos as any} 
        title={landing.trustBarTitle || undefined}
      />

      {/* 3. PRODUCTOS (Portfolio) */}
      <ProductsSection />

      {/* 4. METODOLOGÍA (Features) */}
      <FeaturesSection />
      
      {/* 5. TESTIMONIOS (Prueba Social) - NUEVO */}
      <Testimonials 
        testimonials={testimonialData}
        title={landing.testimonialsTitle || undefined}
        subtitle={landing.testimonialsSubtitle || undefined}
      />

      {/* 6. FAQ (Preguntas Frecuentes) - NUEVO */}
      <FAQ 
        faqs={faqData}
        title={landing.faqTitle || undefined}
        subtitle={landing.faqSubtitle || undefined}
      />

      {/* 7. CONTACTO (Formulario) */}
      <ContactSection email={company?.contactEmail || 'info@ohcodex.com'} />
    </>
  )
}