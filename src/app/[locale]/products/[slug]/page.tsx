// =============== INICIO ARCHIVO: src/app/[locale]/products/[slug]/page.tsx =============== //
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, ExternalLink, Layers, Rocket, CheckCircle2, Timer, FlaskConical } from 'lucide-react'
import { DemoRequestForm } from '@/components/poolcontrol/DemoRequestForm'
// 👇 CAMBIO: Usamos Link inteligente
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import { Metadata } from 'next'
import type { Product } from '@/payload-types'
import { getTranslations } from 'next-intl/server'

export const revalidate = 600

const STATUS_VISUALS = {
  live: { color: 'bg-green-500/10 text-green-400 border-green-500/20', icon: CheckCircle2 },
  beta: { color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20', icon: Rocket },
  development: { color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', icon: Timer },
  concept: { color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20', icon: FlaskConical }
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
          return text
        }

        if (!node) return null

        switch (node.type) {
          case 'heading':
            const Tag = node.tag as any
            const sizes: Record<string, string> = { 
              h1: 'text-3xl mt-8 mb-4 text-white', 
              h2: 'text-2xl mt-8 mb-4 text-white', 
              h3: 'text-xl mt-6 mb-3 text-white', 
              h4: 'text-lg mt-4 mb-2 text-white', 
              h5: 'font-bold mt-4 text-white', 
              h6: 'font-bold mt-4 text-white' 
            }
            return (
              <Tag key={i} className={`font-bold tracking-tight ${sizes[node.tag] || ''}`}>
                <SerializeLexical nodes={node.children} />
              </Tag>
            )
          case 'paragraph':
            return <p key={i} className="mb-4 leading-relaxed text-zinc-400"><SerializeLexical nodes={node.children} /></p>
          case 'list':
            const ListTag = node.listType === 'number' ? 'ol' : 'ul'
            return <ListTag key={i} className={`mb-4 pl-6 ${node.listType === 'number' ? 'list-decimal' : 'list-disc'} text-zinc-400`}><SerializeLexical nodes={node.children} /></ListTag>
          case 'listitem':
            return <li key={i} className="mb-1"><SerializeLexical nodes={node.children} /></li>
          case 'link':
            return (
              <a key={i} href={node.fields.url} target={node.fields.newTab ? '_blank' : '_self'} rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                <SerializeLexical nodes={node.children} />
              </a>
            )
          default:
            return <SerializeLexical key={i} nodes={node.children} />
        }
      })}
    </>
  )
}

interface Args {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug, locale } = await params
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    locale: locale as any,
  })

  if (!docs[0]) return { title: 'Product Not Found' }
  const product = docs[0]

  const title = product.metaTitle || `${product.name} | OHCodex`
  const description = product.metaDescription || product.shortDescription

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: typeof product.heroImage === 'object' && product.heroImage?.url 
        ? [{ url: product.heroImage.url }]
        : undefined,
    }
  }
}

export default async function ProductPage({ params }: Args) {
  const { slug, locale } = await params
  const payload = await getPayload({ config: configPromise })
  const t = await getTranslations('products')

  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    depth: 2,
    locale: locale as any,
  })

  const product = docs[0] as Product

  if (!product) return notFound()

  const heroUrl = typeof product.heroImage === 'object' && product.heroImage?.url ? product.heroImage.url : null
  const logoUrl = typeof product.logo === 'object' && product.logo?.url ? product.logo.url : null
  
  // HACK: PoolControl siempre muestra Beta hasta que se actualice en BD
  const productStatus = slug === 'pool-control-erp' ? 'beta' : product.status
  const statusKey = productStatus as keyof typeof STATUS_VISUALS
  const visuals = STATUS_VISUALS[statusKey] || STATUS_VISUALS.concept
  const StatusIcon = visuals.icon
  const statusLabel = t(`status.${productStatus}`)

  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: product.name,
    description: product.shortDescription,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, Cloud', 
    offers: {
      '@type': 'Offer',
      price: '0', 
      priceCurrency: 'EUR',
      availability: product.status === 'live' ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
    },
    author: { '@type': 'Organization', name: 'OHCodex' },
    ...(heroUrl && { image: heroUrl }),
  }

  return (
    <article className="min-h-screen bg-black pt-24 pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />

      <div className="container px-4 mx-auto">
        <div className="mb-8">
          {/* 👇 CORRECCIÓN: Link inteligente sin locale manual */}
          <Link href="/#productos" className="inline-flex items-center text-sm text-zinc-500 hover:text-cyan-400 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> 
            {t('backToPortfolio')}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              {logoUrl && (
                <div className="relative h-16 w-16 shrink-0 rounded-xl bg-zinc-900/50 border border-white/10 overflow-hidden p-2">
                    <Image src={logoUrl} alt={`Logo ${product.name}`} fill className="object-contain p-1" sizes="64px" />
                </div>
              )}
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-2">
                  {product.name}
                </h1>
                <div className="flex flex-wrap gap-2">
                  <Badge className={`${visuals.color} flex items-center gap-1`}>
                    <StatusIcon className="w-3 h-3" />
                    {statusLabel}
                  </Badge>
                </div>
              </div>
            </div>

            {heroUrl ? (
              <div className="relative w-full aspect-video rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden shadow-2xl shadow-cyan-900/10 mb-10 group">
                <Image 
                  src={heroUrl} 
                  alt={`Interfaz de ${product.name}`} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority 
                />
              </div>
            ) : (
              <div className="w-full h-64 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-center mb-10">
                <p className="text-zinc-600">
                  {t('noCover')}
                </p>
              </div>
            )}

            <div className="prose prose-invert max-w-none prose-p:text-zinc-400 prose-headings:text-white prose-a:text-cyan-400">
              <h2 className="text-2xl font-bold text-white mb-4">
                {t('aboutProject')}
              </h2>
              {product.description && 'root' in product.description && (
                <SerializeLexical nodes={(product.description.root as any).children} />
              )}
            </div>

            {product.relatedProducts && product.relatedProducts.length > 0 && (
              <div className="mt-20 pt-10 border-t border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6">
                  {t('related')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {product.relatedProducts.map((related) => {
                    if (typeof related !== 'object' || related === null) return null
                    if (!('slug' in related)) return null

                    const relLogo = typeof related.logo === 'object' && related.logo?.url ? related.logo.url : null

                    return (
                      <Link 
                        key={related.id} 
                        // 👇 CORRECCIÓN: Link inteligente para relacionados
                        href={`/products/${related.slug}`}
                        className="group flex items-start gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900 hover:border-cyan-500/30 transition-all"
                      >
                        <div className="h-12 w-12 shrink-0 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden p-2">
                           {relLogo ? (
                             <Image src={relLogo} alt={related.name} width={32} height={32} className="object-contain" />
                           ) : (
                             <Rocket className="h-6 w-6 text-zinc-500" />
                           )}
                        </div>
                        <div>
                          <h4 className="text-white font-semibold group-hover:text-cyan-400 transition-colors">
                            {related.name}
                          </h4>
                          <p className="text-sm text-zinc-500 line-clamp-2 mt-1">
                            {related.shortDescription}
                          </p>
                        </div>
                        <ArrowRight className="ml-auto h-5 w-5 text-zinc-600 group-hover:text-cyan-500 opacity-0 group-hover:opacity-100 transition-all self-center" />
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

          </div>

          <div className="lg:col-span-1 space-y-8">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 backdrop-blur-sm sticky top-24">
              <h3 className="text-white font-semibold mb-4">
                {t('technicalSheet')}
              </h3>
              
              {/* Formulario Demo para PoolControl */}
              {slug === 'pool-control-erp' && (
                <div className="mb-6">
                  <DemoRequestForm 
                    utmSource="ohcodex-portfolio" 
                    utmMedium="pool-control-page"
                  />
                </div>
              )}
              
              {product.projectUrl && (
                <Button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white mb-6 shadow-lg shadow-cyan-900/20" asChild>
                  <a href={product.projectUrl} target="_blank" rel="noopener noreferrer">
                    {t('visitWebsite')} 
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}
              
              {!product.projectUrl && (
                <Button disabled className="w-full bg-zinc-800 text-zinc-500 border border-zinc-700 mb-6">
                  {t('inDevelopment')}
                </Button>
              )}

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-white font-medium mb-3">
                    <Layers className="h-4 w-4 text-cyan-500" /> 
                    {t('techStack')}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.technologies?.map((tech, i) => (
                      <span key={i} className="px-2.5 py-1 rounded text-xs bg-zinc-950 border border-zinc-800 text-zinc-400 font-mono">
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </article>
  )
}
// =============== FIN ARCHIVO: src/app/[locale]/products/[slug]/page.tsx =============== //