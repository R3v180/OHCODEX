// ========== src/app/(frontend)/products/[slug]/page.tsx ========== //

import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ExternalLink, Layers } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image' // ✅ Importamos el componente optimizado
import { Metadata } from 'next'

// --- ISR: Actualización en segundo plano cada 10 min ---
export const revalidate = 600

// --- HELPER: Serializador Básico para Rich Text ---
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

// --- GENERACIÓN DE RUTAS ESTÁTICAS (Súper Velocidad) ---
export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { docs: products } = await payload.find({
    collection: 'products',
    depth: 0,
    limit: 100,
  })

  return products.map((product) => ({
    slug: product.slug,
  }))
}

// --- LÓGICA DE PÁGINA ---

interface Args {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
  })

  if (!docs[0]) return { title: 'Producto no encontrado' }

  return {
    title: `${docs[0].name} | OHCodex Software`,
    description: docs[0].shortDescription,
    openGraph: {
      title: `${docs[0].name} - Solución de Software OHCodex`,
      description: docs[0].shortDescription,
      // Usamos la imagen hero si existe, o la default
      images: typeof docs[0].heroImage === 'object' && docs[0].heroImage?.url 
        ? [{ url: docs[0].heroImage.url }]
        : undefined,
    }
  }
}

export default async function ProductPage({ params }: Args) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    depth: 1,
  })

  const product = docs[0]

  if (!product) return notFound()

  // Manejo seguro de URLs
  const heroUrl = typeof product.heroImage === 'object' && product.heroImage?.url ? product.heroImage.url : null
  const logoUrl = typeof product.logo === 'object' && product.logo?.url ? product.logo.url : null

  // ✅ DATOS ESTRUCTURADOS (JSON-LD) para Aplicación de Software
  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: product.name,
    description: product.shortDescription,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, Cloud', // Ajustar según el caso
    offers: {
      '@type': 'Offer',
      price: '0', // 0 si es a consultar o demo
      priceCurrency: 'EUR',
      availability: product.status === 'live' ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
    },
    author: {
        '@type': 'Organization',
        name: 'OHCodex'
    },
    ...(heroUrl && { image: heroUrl }),
  }

  return (
    <article className="min-h-screen bg-black pt-24 pb-16">
      
      {/* Inyectamos los datos para Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />

      <div className="container px-4 mx-auto">
        <div className="mb-8">
          <Link href="/#productos" className="inline-flex items-center text-sm text-zinc-500 hover:text-cyan-400 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Portfolio
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* COLUMNA IZQUIERDA: Info Principal */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              {logoUrl && (
                <div className="relative h-16 w-16 shrink-0 rounded-xl bg-zinc-900/50 border border-white/10 overflow-hidden p-2">
                    <Image 
                        src={logoUrl} 
                        alt={`Logo de ${product.name}`}
                        fill
                        className="object-contain p-1"
                        sizes="64px"
                    />
                </div>
              )}
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-2">
                  {product.name}
                </h1>
                <div className="flex flex-wrap gap-2">
                  {product.status === 'live' && <Badge className="bg-green-500/10 text-green-400 border-green-500/20">En Producción</Badge>}
                  {product.status === 'beta' && <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20">Beta Pública</Badge>}
                  {product.status === 'development' && <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">En Desarrollo</Badge>}
                </div>
              </div>
            </div>

            {/* ✅ HERO IMAGE OPTIMIZADA CON NEXT/IMAGE */}
            {heroUrl ? (
              <div className="relative w-full aspect-video rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden shadow-2xl shadow-cyan-900/10 mb-10 group">
                <Image 
                  src={heroUrl} 
                  alt={`Interfaz o captura de ${product.name}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
                  priority // Carga prioritaria para mejorar LCP
                />
              </div>
            ) : (
              <div className="w-full h-64 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-center mb-10">
                <p className="text-zinc-600">Sin imagen de portada</p>
              </div>
            )}

            {/* DESCRIPCIÓN RICA (LEXICAL) */}
            <div className="prose prose-invert max-w-none prose-p:text-zinc-400 prose-headings:text-white prose-a:text-cyan-400">
              <h2 className="text-2xl font-bold text-white mb-4">Sobre el Proyecto</h2>
              {product.description && 'root' in product.description && (
                <SerializeLexical nodes={(product.description.root as any).children} />
              )}
            </div>
          </div>

          {/* COLUMNA DERECHA: Sidebar / Metadatos */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* CTA / Enlace */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 backdrop-blur-sm">
              <h3 className="text-white font-semibold mb-4">Ficha Técnica</h3>
              
              {product.projectUrl ? (
                <Button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white mb-4" asChild>
                  <a href={product.projectUrl} target="_blank" rel="noopener noreferrer">
                    Visitar Sitio Web <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              ) : (
                <Button disabled className="w-full bg-zinc-800 text-zinc-500 border border-zinc-700">
                  Acceso Privado / En Desarrollo
                </Button>
              )}
            </div>

            {/* Tecnologías */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4 text-white font-semibold">
                <Layers className="h-5 w-5 text-cyan-500" /> Stack Tecnológico
              </div>
              <div className="flex flex-wrap gap-2">
                {product.technologies?.map((tech, i) => (
                  <span key={i} className="px-3 py-1 rounded-md bg-zinc-950 border border-zinc-800 text-sm text-zinc-400 font-mono">
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </article>
  )
}