// =============== INICIO ARCHIVO: src/app/[locale]/tools/[slug]/page.tsx =============== //
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
// 👇 CAMBIO: Importamos Link inteligente
import { Link } from '@/i18n/routing'

// Importamos los componentes funcionales de las herramientas
import { VaultTool } from '@/components/tools/vault/VaultTool'
import { ImageOptimizerTool } from '@/components/tools/image-optimizer/ImageOptimizerTool'
import { PDFStudioTool } from '@/components/tools/pdf-studio/PDFStudioTool'
import { DataStationTool } from '@/components/tools/data-station/DataStationTool'
import { QRFactoryTool } from '@/components/tools/qr-factory/QRFactoryTool'
import { OCRTool } from '@/components/tools/ocr/OCRTool'
import { Base64Tool } from '@/components/tools/base64/Base64Tool'
import { CSSMinifierTool } from '@/components/tools/css-minifier/CSSMinifierTool'
import { PasswordGeneratorTool } from '@/components/tools/password-gen/PasswordGeneratorTool'
import { JWTDecoderTool } from '@/components/tools/jwt-decoder/JWTDecoderTool'
import { RegexTesterTool } from '@/components/tools/regex-tester/RegexTesterTool'
import { ColorPaletteTool } from '@/components/tools/color-palette/ColorPaletteTool'

// Componentes de UI
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { AdSlot } from '@/components/shared/AdSlot'
import { ToolPageFooter } from '@/components/tool-ui'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { 
  ArrowRight, 
  Sparkles, 
  Upload, 
  Settings, 
  Zap, 
  Download, 
  Lock, 
  PenLine,
  LucideIcon,
  ScanLine 
} from 'lucide-react'

// Tipos generados
import type { Tool } from '@/payload-types'

const TOOL_COMPONENTS: Record<string, React.ComponentType<any>> = {
  'vault': VaultTool,
  'image-optimizer': ImageOptimizerTool,
  'pdf-studio': PDFStudioTool,
  'data-station': DataStationTool,
  'qr-factory': QRFactoryTool,
  'ocr-vision': OCRTool,
  'base64': Base64Tool,
  'css-minifier': CSSMinifierTool,
  'password-gen': PasswordGeneratorTool,
  'jwt-decoder': JWTDecoderTool,
  'regex-tester': RegexTesterTool,
  'color-palette': ColorPaletteTool,
}

const STEP_ICONS: Record<string, LucideIcon> = {
  upload: Upload,
  settings: Settings,
  zap: Zap,
  download: Download,
  lock: Lock,
  edit: PenLine,
  scan: ScanLine
}

const SerializeLexical = ({ nodes }: { nodes: any[] }) => {
  if (!nodes || !Array.isArray(nodes)) return null
  return (
    <>
      {nodes.map((node, i) => {
        if (node.type === 'text') {
          let text = <span key={i}>{node.text}</span>
          if (node.format & 1) text = <strong key={i} className="font-bold text-white">{text}</strong>
          if (node.format & 2) text = <em key={i} className="italic">{text}</em>
          if (node.format & 8) text = <u key={i} className="underline">{text}</u>
          if (node.format & 16) text = <code key={i} className="bg-zinc-800 text-cyan-400 px-1 rounded font-mono text-sm">{text}</code>
          return text
        }
        if (!node) return null
        switch (node.type) {
          case 'heading':
            const Tag = node.tag as any
            return <Tag key={i} className="text-2xl font-bold text-white mt-8 mb-4">{<SerializeLexical nodes={node.children} />}</Tag>
          case 'paragraph':
            return <p key={i} className="mb-4 leading-relaxed text-zinc-400"><SerializeLexical nodes={node.children} /></p>
          case 'list':
            const ListTag = node.listType === 'number' ? 'ol' : 'ul'
            return <ListTag key={i} className={`mb-4 pl-6 ${node.listType === 'number' ? 'list-decimal' : 'list-disc'} text-zinc-400 marker:text-cyan-500`}><SerializeLexical nodes={node.children} /></ListTag>
          case 'listitem':
            return <li key={i} className="mb-1"><SerializeLexical nodes={node.children} /></li>
          case 'link':
            return <a key={i} href={node.fields.url} target="_blank" className="text-cyan-400 hover:underline"><SerializeLexical nodes={node.children} /></a>
          default:
            return <SerializeLexical key={i} nodes={node.children} />
        }
      })}
    </>
  )
}

type Props = {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params
  const payload = await getPayload({ config: configPromise })
  
  const { docs } = await payload.find({
    collection: 'tools',
    where: { slug: { equals: slug } },
    locale: locale as any,
  })

  const tool = docs[0] as Tool
  if (!tool) return { title: 'Tool Not Found' }

  return {
    title: tool.metaTitle || `${tool.title} | OHCodex Tools`,
    description: tool.metaDescription || tool.shortDescription,
    alternates: {
      canonical: `https://ohcodex.com/${locale}/tools/${slug}`,
    }
  }
}

export default async function ToolPage({ params }: Props) {
  const { slug, locale } = await params
  const payload = await getPayload({ config: configPromise })
  const t = await getTranslations('common')
  const tToolUI = await getTranslations('tools.ui') 

  const { docs } = await payload.find({
    collection: 'tools',
    where: { slug: { equals: slug } },
    locale: locale as any,
  })

  const tool = docs[0] as Tool

  if (!tool) return notFound()

  const ToolComponent = TOOL_COMPONENTS[tool.codeKey] || null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.title,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR'
    },
    description: tool.metaDescription || tool.shortDescription,
  }

  const faqJsonLd = tool.faqs && tool.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: tool.faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer
      }
    }))
  } : null

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}

      <div className="container px-4 mx-auto max-w-6xl">
        
        {/* 👇 CORRECCIÓN: Breadcrumbs con rutas base limpias */}
        <Breadcrumbs
          items={[
            { label: t('tools'), href: '/tools' },
            { label: tool.title }
          ]}
          className="mb-8"
        />

        <div className="text-center mb-12">
          {tool.badge && (
            <span className="inline-block py-1 px-3 rounded-full bg-cyan-950/50 border border-cyan-900 text-cyan-400 text-xs font-medium mb-6">
              {tool.badge}
            </span>
          )}
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            {tool.title}
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            {tool.shortDescription}
          </p>
        </div>

        {tool.steps && tool.steps.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent -z-10" />
            
            {tool.steps.map((step, index) => {
              const Icon = STEP_ICONS[step.stepIcon || 'zap'] || Zap
              return (
                <div key={step.id || index} className="relative flex flex-col items-center text-center group">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_20px_-5px_rgba(6,182,212,0.3)] transition-all duration-300 z-10">
                    <Icon className="w-7 h-7 text-zinc-400 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-xl">
                    <h3 className="text-white font-semibold mb-1">{index + 1}. {step.stepTitle}</h3>
                    <p className="text-sm text-zinc-500">{step.stepDescription}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="mb-8 flex justify-center">
          <AdSlot position="top" />
        </div>

        <div className="mb-20 scroll-mt-24" id="app">
          {ToolComponent ? (
            <ToolComponent />
          ) : (
            <div className="p-8 text-center bg-red-900/20 border border-red-900 rounded-lg text-red-200">
              Error: Componente &quot;{tool.codeKey}&quot; no encontrado.
            </div>
          )}
        </div>

        {tool.ctaTitle && (
          <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 to-black p-8 md:p-12 text-center mb-20 group">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-[100px] transition-all duration-500 group-hover:bg-cyan-500/20" />
            
            <Sparkles className="h-10 w-10 text-cyan-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              {tool.ctaTitle}
            </h2>
            <p className="text-zinc-300 max-w-2xl mx-auto mb-8 text-lg leading-relaxed">
              {tool.ctaDescription}
            </p>
            {/* 👇 CORRECCIÓN: Botón usando Link inteligente para la redirección de contacto */}
            <Button size="lg" asChild className="h-12 px-8 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-base shadow-[0_0_20px_-5px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.6)] transition-all">
              <Link href={tool.ctaLink || "/#contacto"}>
                {tToolUI('ctaButton') || "Hablemos de tu Proyecto"} 
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        )}

        {tool.content && (
          <div className="prose prose-invert prose-lg max-w-4xl mx-auto mb-20">
             {/* @ts-ignore */}
            <SerializeLexical nodes={tool.content.root.children} />
          </div>
        )}

        {tool.faqs && tool.faqs.length > 0 && (
          <div className="max-w-3xl mx-auto mb-16">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">{tToolUI('faqTitle')}</h3>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {tool.faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border border-zinc-800 bg-zinc-900/20 rounded-xl px-4">
                  <AccordionTrigger className="text-zinc-200 hover:text-cyan-400 text-left hover:no-underline py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400 leading-relaxed pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}

        <div className="flex justify-center">
          <AdSlot position="bottom" />
        </div>

        {/* Footer con estadísticas y reporte de bugs */}
        <ToolPageFooter toolSlug={slug} toolName={tool.title} />

      </div>
    </div>
  )
}
// =============== FIN ARCHIVO: src/app/[locale]/tools/[slug]/page.tsx =============== //