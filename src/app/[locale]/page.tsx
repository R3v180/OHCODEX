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

// Revalidación rápida para mantener el contenido fresco
export const revalidate = 600

type Args = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Args) {
  const { locale } = await params
  const payload = await getPayload({ config: configPromise })
  
  // 1. Carga de datos con Localización
  const [company, landing] = await Promise.all([
    payload.findGlobal({
      slug: 'company-info' as any,
      locale: locale as any, // 👈 Pedimos datos en el idioma actual
    }) as unknown as CompanyInfo,
    payload.findGlobal({
      slug: 'landing-page' as any,
      locale: locale as any,
    }) as unknown as LandingPage
  ])

  // URL base para metadatos
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://ohcodex.com'
  
  // Gestión del Logo
  const logoUrl = typeof company?.logo === 'object' && company.logo?.url 
    ? company.logo.url 
    : `${baseUrl}/logo.png`

  // 2. DATOS ESTRUCTURADOS (JSON-LD)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'OHCodex',
    url: `${baseUrl}/${locale}`,
    logo: logoUrl,
    image: logoUrl,
    description: company?.description,
    telephone: company?.phoneNumber,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Jávea',
      addressRegion: 'Alicante',
      postalCode: '03730',
      addressCountry: 'ES',
      streetAddress: company?.address,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: company?.phoneNumber,
      contactType: 'customer service',
      email: company?.contactEmail,
      areaServed: 'Global',
      availableLanguage: ['es', 'en'],
    },
    priceRange: '$$$',
  }

  // Mapeo de datos para componentes "tontos" (que reciben datos por props)
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Componentes que buscan sus propios datos (necesitarán actualización de props) */}
      {/* @ts-ignore: Arreglaremos los tipos en el siguiente paso */}
      <Hero locale={locale} />

      <TrustBar 
        logos={landing.trustLogos as any} 
        title={landing.trustBarTitle || undefined}
      />

      {/* @ts-ignore */}
      <ProductsSection locale={locale} />

      {/* @ts-ignore */}
      <FeaturesSection locale={locale} />
      
      {/* Componentes que reciben datos directamente */}
      <Testimonials 
        testimonials={testimonialData}
        title={landing.testimonialsTitle || undefined}
        subtitle={landing.testimonialsSubtitle || undefined}
      />

      <FAQ 
        faqs={faqData}
        title={landing.faqTitle || undefined}
        subtitle={landing.faqSubtitle || undefined}
      />

      <ContactSection email={company?.contactEmail || 'info@ohcodex.com'} />
    </>
  )
}