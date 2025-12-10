// ========== src/app/(frontend)/blog/page.tsx ========== //

import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, User } from 'lucide-react'
import { Metadata } from 'next'
import type { Post } from '@/payload-types'

// CAMBIO: Ponemos 0 para forzar la actualización inmediata y ver los posts
export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Blog de Ingeniería y Software | OHCodex',
  description: 'Artículos sobre desarrollo PWA, arquitecturas SaaS, escalabilidad y transformación digital.',
}

export default async function BlogPage() {
  const payload = await getPayload({ config: configPromise })

  // 1. Obtener los posts publicados
  const { docs: posts } = await payload.find({
    collection: 'posts',
    sort: '-publishedDate', // El más reciente primero
    depth: 1, // Traer datos de autor y categoría
    limit: 12,
  })

  // Formateador de fecha simple
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="bg-black min-h-screen pt-24 pb-20">
      <div className="container px-4 mx-auto">
        
        {/* CABECERA */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-6">
            Ingeniería & <span className="text-cyan-500">Pensamiento</span>
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed">
            Exploramos las tecnologías que impulsan nuestros productos. 
            Desde arquitecturas PWA offline-first hasta estrategias de escalabilidad en la nube.
          </p>
        </div>

        {/* LISTADO DE POSTS */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              // Manejo seguro de la imagen
              const coverUrl = typeof post.coverImage === 'object' && post.coverImage?.url 
                ? post.coverImage.url 
                : null
              
              // Manejo seguro de la categoría
              const categoryName = typeof post.category === 'object' && post.category?.name 
                ? post.category.name 
                : 'General'

              // Manejo seguro del autor
              const authorName = typeof post.author === 'object' && post.author?.email 
                ? 'Equipo OHCodex' 
                : 'OHCodex'

              return (
                <article key={post.id} className="group flex flex-col h-full bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all">
                  
                  {/* Imagen */}
                  <Link href={`/blog/${post.slug}`} className="relative h-56 w-full overflow-hidden block">
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
                        Sin imagen
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-black/70 backdrop-blur-sm text-white border-white/10 hover:bg-black/90">
                        {categoryName}
                      </Badge>
                    </div>
                  </Link>

                  {/* Contenido */}
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

                    <Link href={`/blog/${post.slug}`} className="block">
                      <h2 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                    </Link>

                    <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                      {post.excerpt}
                    </p>

                    <div className="mt-auto pt-4 border-t border-zinc-800">
                      <Link href={`/blog/${post.slug}`} className="text-sm font-medium text-cyan-500 hover:text-cyan-400 flex items-center gap-2">
                        Leer artículo completo <span aria-hidden="true">&rarr;</span>
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-zinc-800 border-dashed">
            <p className="text-zinc-500">No hay artículos publicados todavía.</p>
          </div>
        )}

      </div>
    </div>
  )
}