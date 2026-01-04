import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, User } from 'lucide-react'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

// Revalidación cada 10 minutos
export const revalidate = 600

type Args = {
  params: Promise<{ locale: string }>
}

// Generación dinámica de metadatos traducidos
export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })

  return {
    title: `${t('title')} | OHCodex`,
    description: t('subtitle'),
  }
}

export default async function BlogPage({ params }: Args) {
  // 1. Esperar los params (Obligatorio en Next.js 15)
  const { locale } = await params
  const payload = await getPayload({ config: configPromise })

  // 2. Cargar traducciones
  const t = await getTranslations('blog')
  const tCommon = await getTranslations('common.buttons')

  // 3. Obtener los posts publicados en el idioma actual
  const { docs: posts } = await payload.find({
    collection: 'posts',
    sort: '-publishedDate',
    depth: 1,
    limit: 12,
    locale: locale as any, // 👈 Pide el contenido traducido
  })

  // Formateador de fecha localizado
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  // Lógica para el título: separar la última palabra para el color Cian
  const titleText = t('title')
  const titleWords = titleText.split(' ')
  const titleMain = titleWords.slice(0, -1).join(' ')
  const titleLast = titleWords.slice(-1)

  return (
    <div className="bg-black min-h-screen pt-24 pb-20">
      <div className="container px-4 mx-auto">
        
        {/* CABECERA */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-6">
            {titleMain} <span className="text-cyan-500">{titleLast}</span>
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* LISTADO DE ARTÍCULOS */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const coverUrl = typeof post.coverImage === 'object' && post.coverImage?.url 
                ? post.coverImage.url 
                : null
              
              // Nombre de categoría traducido (viene del depth 1)
              const categoryName = typeof post.category === 'object' && post.category?.name 
                ? post.category.name 
                : 'General'

              // Nombre del autor (fallback si no tiene nombre público)
              const authorName = typeof post.author === 'object' 
                ? (post.author as any).name || 'OHCodex Team' 
                : 'OHCodex'

              // Construimos la URL localizada
              const postUrl = `/${locale}/blog/${post.slug}`

              return (
                <article key={post.id} className="group flex flex-col h-full bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all">
                  
                  {/* Imagen */}
                  <Link href={postUrl} className="relative h-56 w-full overflow-hidden block">
                    {coverUrl ? (
                      <Image 
                        src={coverUrl} 
                        alt={post.title} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-600">
                        No image
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-black/70 backdrop-blur-sm text-white border-white/10">
                        {categoryName}
                      </Badge>
                    </div>
                  </Link>

                  {/* Contenido de la Card */}
                  <div className="flex flex-col flex-1 p-6">
                    <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4 font-mono">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {formatDate(post.publishedDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {authorName}
                      </span>
                    </div>

                    <Link href={postUrl} className="block">
                      <h2 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                    </Link>

                    <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                      {post.excerpt}
                    </p>

                    <div className="mt-auto pt-4 border-t border-zinc-800">
                      <Link href={postUrl} className="text-sm font-medium text-cyan-500 hover:text-cyan-400 flex items-center gap-2">
                        {tCommon('readArticle')} <span aria-hidden="true">&rarr;</span>
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-zinc-800 border-dashed">
            <p className="text-zinc-500">
              {t('noArticles')}
            </p>
          </div>
        )}

      </div>
    </div>
  )
}