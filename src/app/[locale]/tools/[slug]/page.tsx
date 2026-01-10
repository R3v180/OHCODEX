import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

// Importamos los componentes funcionales
import { VaultTool } from '@/components/tools/vault/VaultTool'
import { ImageOptimizerTool } from '@/components/tools/image-optimizer/ImageOptimizerTool'
import { PDFStudioTool } from '@/components/tools/pdf-studio/PDFStudioTool'
import { DataStationTool } from '@/components/tools/data-station/DataStationTool'
import { QRFactoryTool } from '@/components/tools/qr-factory/QRFactoryTool'

// Componentes de UI
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { AdSlot } from '@/components/shared/AdSlot'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

// Tipos generados
import type { Tool } from '@/payload-types'

// --- MAPA DE HERRAMIENTAS ---
// Conecta el "codeKey" del CMS con el Componente React real
const TOOL_COMPONENTS: Record<string, React.ComponentType<any>> = {
  'vault': VaultTool,
  'image-optimizer': ImageOptimizerTool,
  'pdf-studio': PDFStudioTool,
  'data-station': DataStationTool,
  'qr-factory': QRFactoryTool,
}

// --- SERIALIZADOR LEXICAL (Para el texto enriquecido del CMS) ---
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

// 1. GENERACIÓN DE METADATOS SEO
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

// 2. PÁGINA PRINCIPAL
export default async function ToolPage({ params }: Props) {
  const { slug, locale } = await params
  const payload = await getPayload({ config: configPromise })
  const t = await getTranslations('common')

  // Buscar datos en el CMS
  const { docs } = await payload.find({
    collection: 'tools',
    where: { slug: { equals: slug } },
    locale: locale as any,
  })

  const tool = docs[0] as Tool

  // Si no existe en el CMS, 404
  if (!tool) return notFound()

  // Seleccionar el componente correcto
  const ToolComponent = TOOL_COMPONENTS[tool.codeKey] || null

  // Preparar Schema.org (SoftwareApplication + FAQ)
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
    <div className="min-h-screen bg-black pt-20 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}

      <div className="container px-4 mx-auto max-w-6xl">
        
        {/* NAVEGACIÓN */}
        <Breadcrumbs
          items={[
            { label: t('tools'), href: '/tools' },
            { label: tool.title }
          ]}
          className="mb-8"
        />

        {/* HERO HEADER */}
        <div className="text-center mb-10">
          {tool.badge && (
            <span className="inline-block py-1 px-3 rounded-full bg-cyan-950/50 border border-cyan-900 text-cyan-400 text-xs font-medium mb-4">
              {tool.badge}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            {tool.title}
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            {tool.shortDescription}
          </p>
        </div>

        {/* ANUNCIO SUPERIOR */}
        <div className="mb-8 flex justify-center">
          <AdSlot position="top" />
        </div>

        {/* --- LA HERRAMIENTA REAL --- */}
        <div className="mb-16">
          {ToolComponent ? (
            <ToolComponent />
          ) : (
            <div className="p-8 text-center bg-red-900/20 border border-red-900 rounded-lg text-red-200">
              Error de configuración: No se encontró el componente &quot;{tool.codeKey}&quot;.
            </div>
          )}
        </div>

        {/* CTA DE VENTA (CROSS-SELLING) */}
        {tool.ctaTitle && (
          <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/30 to-black p-8 md:p-12 text-center mb-16">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-cyan-500/10 blur-[80px]" />
            
            <Sparkles className="h-8 w-8 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              {tool.ctaTitle}
            </h2>
            <p className="text-zinc-300 max-w-2xl mx-auto mb-8 text-lg">
              {tool.ctaDescription}
            </p>
            <Button size="lg" asChild className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold">
              <a href={tool.ctaLink || "/#contact"}>
                Hablemos de tu Proyecto <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        )}

        {/* CONTENIDO SEO (Rich Text) */}
        {tool.content && (
          <div className="prose prose-invert prose-lg max-w-4xl mx-auto mb-16">
             {/* @ts-ignore - Lexical types are tricky */}
            <SerializeLexical nodes={tool.content.root.children} />
          </div>
        )}

        {/* FAQ SECTION */}
        {tool.faqs && tool.faqs.length > 0 && (
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Preguntas Frecuentes</h3>
            <Accordion type="single" collapsible className="w-full">
              {tool.faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-zinc-800">
                  <AccordionTrigger className="text-zinc-200 hover:text-cyan-400 text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}

        {/* ANUNCIO INFERIOR */}
        <div className="mt-16 flex justify-center">
          <AdSlot position="bottom" />
        </div>

      </div>
    </div>
  )
}