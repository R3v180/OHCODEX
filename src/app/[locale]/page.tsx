// =============== INICIO ARCHIVO: src/app/[locale]/page.tsx =============== //
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getTranslations } from 'next-intl/server'
import type { LandingPage, CompanyInfo, Tool } from '@/payload-types'

// 👇 CAMBIO IMPORTANTE: Usamos el Link inteligente
import { Link } from '@/i18n/routing'

// Componentes Corporativos
import { Hero } from '@/components/sections/Hero'
import { ProductsSection } from '@/components/sections/Products'
import { FeaturesSection } from '@/components/sections/Features'
import { Testimonials } from '@/components/sections/Testimonials'
import { TrustBar } from '@/components/sections/TrustBar'
import { FAQ } from '@/components/sections/FAQ'
import { ContactSection } from '@/components/sections/Contact'

// Componentes de UI
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Lock, 
  Image as ImageIcon, 
  FileText, 
  Database, 
  QrCode, 
  ArrowRight, 
  Shield,
  ScanLine,
  Box,
  LucideIcon
} from 'lucide-react'

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

  const title = landing?.heroTitle || company?.defaultTitle || 'OHCodex - Software Architecture & Development'
  const description = landing?.heroSubtitle || company?.defaultDescription || 'Ingeniería para el futuro de los ecosistemas digitales. Desarrollo de PWA, SaaS y arquitectura cloud-native.'
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://ohcodex.com'
  const ogImage = `${siteUrl}/og-image.jpg`

  return {
    title,
    description,
    keywords: ['desarrollo software', 'PWA', 'SaaS', 'Next.js', 'TypeScript', 'arquitectura cloud', 'ingeniería software'],
    authors: [{ name: 'OHCodex' }],
    creator: 'OHCodex',
    publisher: 'OHCodex',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'es' ? 'es_ES' : locale === 'en' ? 'en_US' : `${locale}_${locale.toUpperCase()}`,
      url: `${siteUrl}/${locale}`,
      siteName: 'OHCodex',
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: '@ohcodex',
      site: '@ohcodex',
    },
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        'es-ES': `${siteUrl}/es`,
        'en-US': `${siteUrl}/en`,
        'fr-FR': `${siteUrl}/fr`,
        'de-DE': `${siteUrl}/de`,
        'it-IT': `${siteUrl}/it`,
        'pt-PT': `${siteUrl}/pt`,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  }
}

// Mapa de Iconos
const ICON_MAP: Record<string, LucideIcon> = {
  'lock': Lock,
  'image': ImageIcon,
  'file-text': FileText,
  'database': Database,
  'qr-code': QrCode,
  'scan': ScanLine,
  'box': Box
}

const BADGE_STYLES: Record<string, string> = {
  // Herramientas originales
  'vault': 'bg-cyan-900/50 text-cyan-400 border-cyan-800',
  'image-optimizer': 'bg-green-900/50 text-green-400 border-green-800',
  'pdf-studio': 'bg-purple-900/50 text-purple-400 border-purple-800',
  'data-station': 'bg-blue-900/50 text-blue-400 border-blue-800',
  'qr-factory': 'bg-pink-900/50 text-pink-400 border-pink-800',
  'ocr-vision': 'bg-amber-900/50 text-amber-400 border-amber-800',
  // Nuevas herramientas
  'password-gen': 'bg-rose-900/50 text-rose-400 border-rose-800',       // Rojo - Seguridad
  'base64': 'bg-orange-900/50 text-orange-400 border-orange-800',              // Naranja - Codificación
  'jwt-decoder': 'bg-indigo-900/50 text-indigo-400 border-indigo-800',         // Índigo - Web/Token
  'css-minifier': 'bg-emerald-900/50 text-emerald-400 border-emerald-800',     // Esmeralda - CSS
  'regex-tester': 'bg-fuchsia-900/50 text-fuchsia-400 border-fuchsia-800',     // Fucsia - Regex
  'color-palette': 'bg-violet-900/50 text-violet-400 border-violet-800',       // Violeta - Colores
  'default': 'bg-zinc-800 text-zinc-400 border-zinc-700'
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const payload = await getPayload({ config: configPromise })
  
  const tHome = await getTranslations({ locale, namespace: 'home' })

  // 1. Cargar Datos Globales
  const landing = (await payload.findGlobal({
    slug: 'landing-page' as any,
    locale: locale as any,
  })) as unknown as LandingPage

  const company = (await payload.findGlobal({
    slug: 'company-info' as any,
    locale: locale as any,
  })) as unknown as CompanyInfo

  // 2. Cargar HERRAMIENTAS
  const { docs: tools } = await payload.find({
    collection: 'tools',
    sort: 'createdAt', 
    limit: 6, 
    locale: locale as any
  }) as unknown as { docs: Tool[] }

  return (
    <>
      {/* 1. HERO Corporativo */}
      <Hero 
        locale={locale}
        badge={landing?.heroBadge}
        title={landing?.heroTitle || "OHCodex Software Studio"}
        subtitle={landing?.heroSubtitle || "Engineering the future."}
      />

      {/* 2. Barra de Confianza */}
      <TrustBar 
        logos={landing?.trustLogos} 
        title={landing?.trustBarTitle || undefined} 
      />

      {/* 3. Sección de Productos (Portfolio) */}
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
            {tools.map((tool) => {
              const iconKey = (tool.icon as string) || 'box'
              const Icon = ICON_MAP[iconKey] || Box
              const badgeStyle = BADGE_STYLES[tool.slug] || BADGE_STYLES['default']
              
              return (
                <Link 
                  key={tool.id} 
                  href={`/tools/${tool.slug}`} 
                  className="group block h-full"
                >
                  <Card className="h-full border-zinc-800 bg-black/40 transition-all duration-300 hover:border-cyan-500/50 hover:bg-zinc-900/80 hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-lg bg-zinc-800 text-zinc-400 group-hover:text-cyan-400 group-hover:bg-cyan-950/30 transition-colors">
                          <Icon className="w-6 h-6" />
                        </div>
                        {tool.badge && (
                          <Badge className={`${badgeStyle} border`}>
                            {tool.badge}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl text-white group-hover:text-cyan-400 transition-colors">
                        {tool.title}
                      </CardTitle>
                      <CardDescription className="text-base text-zinc-400 line-clamp-2">
                        {tool.shortDescription}
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

          {/* Botón Ver Más */}
          <div className="mt-12 text-center">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800/50 hover:bg-cyan-950/30 border border-zinc-700 hover:border-cyan-500/50 rounded-lg text-zinc-300 hover:text-cyan-400 transition-all duration-300 group"
            >
              <span className="font-medium">{tHome('ourTools.viewAll') || 'Ver todas las herramientas'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Metodología */}
      <FeaturesSection locale={locale} />

      {/* 6. Testimonios */}
      <Testimonials 
        testimonials={landing?.testimonials}
        title={landing?.testimonialsTitle || undefined}
        subtitle={landing?.testimonialsSubtitle || undefined}
      />

      {/* 7. Contacto */}
      <ContactSection email={company?.contactEmail || 'info@ohcodex.com'} />

      {/* 8. FAQ */}
      <FAQ 
        faqs={landing?.faqs}
        title={landing?.faqTitle || undefined}
        subtitle={landing?.faqSubtitle || undefined}
      />
    </>
  )
}
// =============== FIN ARCHIVO: src/app/[locale]/page.tsx =============== //