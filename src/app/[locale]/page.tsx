import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getTranslations } from 'next-intl/server'
import type { LandingPage, CompanyInfo } from '@/payload-types'

// Componentes Corporativos
import { Hero } from '@/components/sections/Hero'
import { ProductsSection } from '@/components/sections/Products'
import { FeaturesSection } from '@/components/sections/Features'
import { Testimonials } from '@/components/sections/Testimonials'
import { TrustBar } from '@/components/sections/TrustBar'
import { FAQ } from '@/components/sections/FAQ'
import { ContactSection } from '@/components/sections/Contact'

// Componentes de Tools (Para la sección específica)
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lock, Image as ImageIcon, FileText, Database, QrCode, ArrowRight, Shield } from 'lucide-react'

// Metadatos Dinámicos
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const payload = await getPayload({ config: configPromise })
  
  const landing = (await payload.findGlobal({
    slug: 'landing-page' as any,
    locale: locale as any,
  })) as unknown as LandingPage
  
  const company = (await payload.findGlobal({
    slug: 'company-info' as any,
    locale: locale as any,
  })) as unknown as CompanyInfo

  return {
    title: landing?.heroTitle || company?.defaultTitle,
    description: landing?.heroSubtitle || company?.defaultDescription,
  }
}

// Configuración de Tools
const toolIcons = {
  vault: Lock,
  'image-optimizer': ImageIcon,
  'pdf-studio': FileText,
  'data-station': Database,
  'qr-factory': QrCode,
}

const toolBadges = {
  vault: { label: 'Popular', color: 'bg-cyan-900/50 text-cyan-400 border-cyan-800' },
  'image-optimizer': { label: 'New', color: 'bg-green-900/50 text-green-400 border-green-800' },
  'pdf-studio': { label: 'Pro', color: 'bg-purple-900/50 text-purple-400 border-purple-800' },
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const payload = await getPayload({ config: configPromise })
  
  // Cargar Textos de Traducción (Botones, etiquetas estáticas)
  const tHome = await getTranslations({ locale, namespace: 'home' })
  const tTools = await getTranslations({ locale, namespace: 'tools' })

  // Cargar Datos de la BD (Landing y Empresa) en el idioma actual
  const landing = (await payload.findGlobal({
    slug: 'landing-page' as any,
    locale: locale as any,
  })) as unknown as LandingPage

  const company = (await payload.findGlobal({
    slug: 'company-info' as any,
    locale: locale as any,
  })) as unknown as CompanyInfo

  const toolsList = ['vault', 'image-optimizer', 'pdf-studio', 'data-station', 'qr-factory']

  return (
    <>
      {/* 1. HERO Corporativo (Dinámico) */}
      <Hero 
        badge={landing?.heroBadge}
        title={landing?.heroTitle || "OHCodex Software Studio"}
        subtitle={landing?.heroSubtitle || "Engineering the future."}
      />

      {/* 2. Barra de Confianza (Logos) */}
      <TrustBar 
        logos={landing?.trustLogos} 
        title={landing?.trustBarTitle || undefined} 
      />

      {/* 3. Sección de Productos (SaaS Portfolio) */}
      {/* CORRECCIÓN: Pasamos el locale para que se traduzcan los estados y contenido de la BD */}
      <ProductsSection locale={locale} />

      {/* 4. SECCIÓN: Tools Suite */}
      <section id="tools" className="py-24 bg-zinc-900/30 border-y border-white/5">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-cyan-950 text-cyan-400 border-cyan-900/50">
              <Shield className="w-3 h-3 mr-2" />
              {tHome('hero.badge')}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">
              {tHome('ourTools.title')}
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              {tHome('ourTools.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {toolsList.map((toolSlug) => {
              // @ts-ignore
              const Icon = toolIcons[toolSlug] || Database
              // @ts-ignore
              const badge = toolBadges[toolSlug]
              
              return (
                <Link key={toolSlug} href={`/${locale}/tools/${toolSlug}`} className="group block h-full">
                  <Card className="h-full border-zinc-800 bg-black/40 transition-all duration-300 hover:border-cyan-500/50 hover:bg-zinc-900/80 hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-lg bg-zinc-800 text-zinc-400 group-hover:text-cyan-400 group-hover:bg-cyan-950/30 transition-colors">
                          <Icon className="w-6 h-6" />
                        </div>
                        {badge && (
                          <Badge className={`${badge.color} border`}>
                            {badge.label}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl text-white group-hover:text-cyan-400 transition-colors">
                        {/* @ts-ignore */}
                        {tTools(`${toolSlug}.title`)}
                      </CardTitle>
                      <CardDescription className="text-base text-zinc-400 line-clamp-2">
                         {/* @ts-ignore */}
                        {tTools(`${toolSlug}.description`)}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="text-sm text-zinc-500 font-medium mt-auto group-hover:text-cyan-500 transition-colors">
                      {tHome('ourTools.useTool')} <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </CardFooter>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* 5. Metodología (Features) */}
      {/* CORRECCIÓN: Pasamos el locale para traducir la sección "Qué Hacemos" */}
      <FeaturesSection locale={locale} />

      {/* 6. Testimonios */}
      <Testimonials 
        testimonials={landing?.testimonials}
        title={landing?.testimonialsTitle || undefined}
        subtitle={landing?.testimonialsSubtitle || undefined}
      />

      {/* 7. FAQ */}
      <FAQ 
        faqs={landing?.faqs}
        title={landing?.faqTitle || undefined}
        subtitle={landing?.faqSubtitle || undefined}
      />

      {/* 8. Contacto */}
      <ContactSection email={company?.contactEmail || 'info@ohcodex.com'} />
    </>
  )
}