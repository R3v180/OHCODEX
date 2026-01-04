import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, User, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Metadata } from 'next'
import type { Post, CompanyInfo } from '@/payload-types'
import { getTranslations } from 'next-intl/server'

export const revalidate = 600

// --- Serializador Lexical (Convierte el JSON de la BD en HTML/JSX) ---
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
            const sizes: Record<string, string> = { 
              h1: 'text-3xl sm:text-4xl mt-12 mb-6 text-white font-bold tracking-tight', 
              h2: 'text-2xl sm:text-3xl mt-10 mb-5 text-white font-bold tracking-tight', 
              h3: 'text-xl sm:text-2xl mt-8 mb-4 text-white font-semibold'
            }
            return <Tag key={i} className={sizes[node.tag] || ''}><SerializeLexical nodes={node.children} /></Tag>
          case 'paragraph':
            return <p key={i} className="mb-6 leading-7 text-zinc-300 text-lg"><SerializeLexical nodes={node.children} /></p>
          case 'quote':
            return (
              <blockquote key={i} className="border-l-4 border-cyan-500 pl-4 italic text-zinc-400 my-8 py-2 bg-zinc-900/30 rounded-r-lg">
                <SerializeLexical nodes={node.children} />
              </blockquote>
            )
          case 'list':
            const ListTag = node.listType === 'number' ? 'ol' : 'ul'
            return <ListTag key={i} className={`mb-6 pl-6 ${node.listType === 'number' ? 'list-decimal' : 'list-disc'} text-zinc-300 marker:text-cyan-500`}><SerializeLexical nodes={node.children} /></ListTag>
          case 'listitem':
            return <li key={i} className="mb-2 pl-2"><SerializeLexical nodes={node.children} /></li>
          case 'link':
            return <a key={i} href={node.fields.url} target={node.fields.newTab ? '_blank' : '_self'} className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4"><SerializeLexical nodes={node.children} /></a>
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

// --- METADATOS DINÁMICOS ---
export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug, locale } = await params
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    locale: locale as any,
  })

  if (!docs[0]) return { title: 'Not Found' }
  const post = docs[0]

  return {
    title: `${post.metaTitle || post.title} | Blog OHCodex`,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedDate,
      images: typeof post.coverImage === 'object' && (post.coverImage as any)?.url ? [{ url: (post.coverImage as any).url }] : undefined,
    }
  }
}

// --- COMPONENTE PRINCIPAL ---
export default async function BlogPostPage({ params }: Args) {
  const { slug, locale } = await params
  const payload = await getPayload({ config: configPromise })
  const t = await getTranslations('blog')

  // Buscamos el post y la info de empresa (para el logo del JSON-LD)
  const [postResult, companyResult] = await Promise.all([
    payload.find({
      collection: 'posts',
      where: { slug: { equals: slug } },
      depth: 2, 
      locale: locale as any,
    }),
    payload.findGlobal({
      slug: 'company-info' as any,
      locale: locale as any,
    }) as unknown as CompanyInfo
  ])

  const post = postResult.docs[0] as Post
  if (!post) return notFound()

  const coverUrl = typeof post.coverImage === 'object' ? (post.coverImage as any)?.url : null
  const categoryName = typeof post.category === 'object' ? (post.category as any)?.name : 'General'
  const authorName = typeof post.author === 'object' ? (post.author as any)?.name || 'OHCodex Team' : 'OHCodex'
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  // --- SCHEMA.ORG (JSON-LD) para SEO ---
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: coverUrl ? [coverUrl] : [],
    datePublished: post.publishedDate,
    dateModified: post.updatedAt,
    author: { '@type': 'Person', name: authorName },
    description: post.excerpt,
  }

  return (
    <article className="min-h-screen bg-black pt-24 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container px-4 mx-auto max-w-4xl">
        {/* Enlace de vuelta */}
        <Link href={`/${locale}/blog`} className="inline-flex items-center text-sm text-zinc-500 hover:text-cyan-400 transition-colors mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" /> {t('backToBlog')}
        </Link>

        <div className="mb-6">
          <Badge className="bg-cyan-950 text-cyan-400 border-cyan-900 hover:bg-cyan-900">
            {categoryName}
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-zinc-500 text-sm border-b border-zinc-800 pb-8 mb-8 font-mono">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            {t('publishedOn')} {formatDate(post.publishedDate)}
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            {authorName}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            5 {t('minRead')}
          </div>
        </div>
      </div>

      {/* Imagen de Portada */}
      {coverUrl && (
        <div className="container px-4 mx-auto max-w-5xl mb-12">
          <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
            <Image src={coverUrl} alt={post.title} fill className="object-cover" priority />
          </div>
        </div>
      )}

      {/* Cuerpo del Artículo */}
      <div className="container px-4 mx-auto max-w-3xl">
        <div className="prose prose-invert prose-lg max-w-none">
          {post.content && (post.content as any).root && (
            <SerializeLexical nodes={(post.content as any).root.children} />
          )}
        </div>

        {/* Caja de contacto final */}
        <div className="mt-16 p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-center">
          <h3 className="text-xl font-bold text-white mb-2">{t('interested')}</h3>
          <p className="text-zinc-400 mb-6">{t('helpText')}</p>
          <Link href={`/${locale}/#contacto`} className="inline-flex h-10 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-black transition-colors hover:bg-zinc-200">
            {t('letsTalk')}
          </Link>
        </div>
      </div>
    </article>
  )
}