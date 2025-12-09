// ========== src/app/(frontend)/blog/[slug]/page.tsx ========== //

import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, User, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Metadata } from 'next'
import type { Post } from '@/payload-types'

// ISR: Actualizar contenido cada 10 minutos
export const revalidate = 600

// --- MODO DEPURACIÓN VISUAL ---
// Cámbialo a 'false' cuando termines de arreglar el contenido para ocultar las etiquetas rojas.
const DEBUG_MODE = true

// --- Serializador de Texto Rico (Rich Text) ---
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
          if (node.format & 16) text = <code key={i} className="bg-zinc-800 text-cyan-400 px-1 py-0.5 rounded text-sm font-mono">{text}</code>
          return text
        }

        if (!node) return null

        switch (node.type) {
          case 'heading':
            const Tag = node.tag as any
            // He ajustado ligeramente los tamaños para que no sean tan gigantes
            const sizes: Record<string, string> = { 
              h1: 'text-3xl sm:text-4xl mt-12 mb-6 text-white font-bold tracking-tight', 
              h2: 'text-2xl sm:text-3xl mt-10 mb-5 text-white font-bold tracking-tight', 
              h3: 'text-xl sm:text-2xl mt-8 mb-4 text-white font-semibold', 
              h4: 'text-lg sm:text-xl mt-6 mb-3 text-white font-semibold'
            }
            
            return (
              <div key={i} className="relative group">
                {/* Chivato visual para Títulos */}
                {DEBUG_MODE && (
                  <span className="absolute -left-14 top-1 text-[10px] font-mono bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/30 select-none">
                    &lt;{node.tag.toUpperCase()}&gt;
                  </span>
                )}
                <Tag className={sizes[node.tag] || ''}>
                  <SerializeLexical nodes={node.children} />
                </Tag>
              </div>
            )
          
          case 'paragraph':
            return (
              <div key={i} className="relative group">
                {/* Chivato visual para Párrafos (se ve al pasar el mouse o si está activo el debug) */}
                {DEBUG_MODE && (
                  <span className="absolute -left-10 top-1 text-[10px] font-mono text-zinc-700 select-none">
                    ¶ p
                  </span>
                )}
                <p className="mb-6 leading-7 text-zinc-300 text-lg">
                  <SerializeLexical nodes={node.children} />
                </p>
              </div>
            )
          
          case 'quote':
            return (
              <div key={i} className="relative">
                {DEBUG_MODE && <span className="absolute -left-10 top-2 text-[10px] text-zinc-700">“qt”</span>}
                <blockquote className="border-l-4 border-cyan-500 pl-4 italic text-zinc-400 my-8 py-2 bg-zinc-900/30 rounded-r-lg">
                  <SerializeLexical nodes={node.children} />
                </blockquote>
              </div>
            )

          case 'list':
            const ListTag = node.listType === 'number' ? 'ol' : 'ul'
            return (
              <div key={i} className="relative">
                 {DEBUG_MODE && <span className="absolute -left-10 top-0 text-[10px] text-zinc-700">list</span>}
                 <ListTag className={`mb-6 pl-6 ${node.listType === 'number' ? 'list-decimal' : 'list-disc'} text-zinc-300 marker:text-cyan-500`}>
                    <SerializeLexical nodes={node.children} />
                 </ListTag>
              </div>
            )
          
          case 'listitem':
            return <li key={i} className="mb-2 pl-2"><SerializeLexical nodes={node.children} /></li>
          
          case 'link':
            return (
              <a key={i} href={node.fields.url} target={node.fields.newTab ? '_blank' : '_self'} className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 decoration-cyan-500/30 hover:decoration-cyan-300">
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

// --- Generación de Rutas Estáticas ---
export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { docs: posts } = await payload.find({
    collection: 'posts',
    depth: 0,
    limit: 100,
  })
  return posts.map((post) => ({ slug: post.slug }))
}

interface Args {
  params: Promise<{ slug: string }>
}

// --- SEO Dinámico ---
export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
  })

  if (!docs[0]) return { title: 'Artículo no encontrado' }
  const post = docs[0]

  const title = post.metaTitle || post.title
  const description = post.metaDescription || post.excerpt

  return {
    title: `${title} | Blog OHCodex`,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.publishedDate,
      authors: ['OHCodex Team'],
      images: typeof post.coverImage === 'object' && post.coverImage?.url ? [{ url: post.coverImage.url }] : undefined,
    }
  }
}

export default async function BlogPostPage({ params }: Args) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    depth: 2, 
  })

  const post = docs[0] as Post

  if (!post) return notFound()

  // Helpers de datos seguros
  const coverUrl = typeof post.coverImage === 'object' && post.coverImage?.url ? post.coverImage.url : null
  const categoryName = typeof post.category === 'object' && post.category?.name ? post.category.name : 'General'
  const authorName = typeof post.author === 'object' && post.author?.email ? 'Equipo OHCodex' : 'OHCodex'
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: coverUrl ? [coverUrl] : [],
    datePublished: post.publishedDate,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Organization',
      name: authorName,
    },
    description: post.excerpt,
  }

  return (
    <article className="min-h-screen bg-black pt-24 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      {/* Cabecera del Artículo */}
      <div className="container px-4 mx-auto max-w-4xl">
        <Link href="/blog" className="inline-flex items-center text-sm text-zinc-500 hover:text-cyan-400 transition-colors mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Blog
        </Link>

        <div className="mb-6 flex gap-2">
          <Badge className="bg-cyan-950 text-cyan-400 border-cyan-900 hover:bg-cyan-900">
            {categoryName}
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-6 text-zinc-500 text-sm border-b border-zinc-800 pb-8 mb-8 font-mono">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            {formatDate(post.publishedDate)}
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            {authorName}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Lectura de 5 min
          </div>
        </div>
      </div>

      {/* Imagen Principal */}
      {coverUrl && (
        <div className="container px-4 mx-auto max-w-5xl mb-12">
          <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
            <Image 
              src={coverUrl} 
              alt={post.title} 
              fill 
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
            />
          </div>
        </div>
      )}

      {/* Cuerpo del Artículo */}
      <div className="container px-4 mx-auto max-w-3xl">
        <div className="prose prose-invert prose-lg max-w-none">
          {/* Renderizado de contenido rico */}
          {post.content && 'root' in post.content && (
            <SerializeLexical nodes={(post.content.root as any).children} />
          )}
        </div>

        {/* CTA Final */}
        <div className="mt-16 p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-center">
          <h3 className="text-xl font-bold text-white mb-2">¿Te interesa este tema?</h3>
          <p className="text-zinc-400 mb-6">Ayudamos a empresas a implementar estas tecnologías en sus procesos.</p>
          <Link href="/#contacto" className="inline-flex h-10 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-black transition-colors hover:bg-zinc-200">
            Hablemos
          </Link>
        </div>
      </div>
    </article>
  )
}