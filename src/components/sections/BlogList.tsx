// src/components/sections/BlogList.tsx
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, User, ChevronLeft, ChevronRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui/button'

interface BlogListProps {
  locale: string
  page?: number
  // Cambiamos a plural y permitimos string o array para soportar multi-filtro
  categorySlugs?: string | string[] 
}

export async function BlogList({ locale, page = 1, categorySlugs }: BlogListProps) {
  const payload = await getPayload({ config: configPromise })
  const t = await getTranslations('blog')
  const tCommon = await getTranslations('common.buttons')

  // 1. Normalizar los slugs a un array
  const slugs = Array.isArray(categorySlugs) 
    ? categorySlugs 
    : categorySlugs ? [categorySlugs] : []

  // 2. Configuración de filtros
  const limit = 6
  const whereClause: any = {}
  
  if (slugs.length > 0) {
    // Buscamos los IDs de todas las categorías seleccionadas
    const categoriesRes = await payload.find({
      collection: 'categories',
      where: {
        slug: { in: slugs } // Operador 'in' para múltiples valores
      },
      limit: 100,
    })
    
    const categoryIds = categoriesRes.docs.map(cat => cat.id)
    
    if (categoryIds.length > 0) {
      whereClause.category = { in: categoryIds }
    }
  }

  // 3. Consulta a Payload CMS
  const { docs: posts, totalPages, prevPage, nextPage, hasPrevPage, hasNextPage } = await payload.find({
    collection: 'posts',
    sort: '-publishedDate',
    depth: 1,
    limit: limit,
    page: page,
    locale: locale as any,
    where: whereClause,
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  // 4. Helper para generar URLs de paginación
  const getPageUrl = (pageNumber: number) => {
    // Si hay una sola categoría, usamos la ruta limpia de i18n
    if (slugs.length === 1) {
      return `/blog/category/${slugs[0]}/${pageNumber}`
    }
    // Si hay varias, usamos la ruta general con Query Params para los filtros
    const params = new URLSearchParams()
    if (slugs.length > 0) params.set('cats', slugs.join(','))
    return `/blog/page/${pageNumber}${slugs.length > 0 ? `?${params.toString()}` : ''}`
  }

  return (
    <div className="space-y-12">
      {posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const coverUrl = typeof post.coverImage === 'object' && post.coverImage?.url 
                ? post.coverImage.url 
                : null
              
              const categoryName = typeof post.category === 'object' && post.category?.name 
                ? (post.category as any).name 
                : 'General'

              const authorName = typeof post.author === 'object' 
                ? (post.author as any).name || 'OHCodex Team' 
                : 'OHCodex'

              return (
                <article key={post.id} className="group flex flex-col h-full bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all">
                  <Link href={`/blog/${post.slug}`} className="relative h-56 w-full overflow-hidden block">
                    {coverUrl ? (
                      <Image 
                        src={coverUrl} 
                        alt={post.title} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-600">No image</div>
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-black/70 backdrop-blur-sm text-white border-white/10">{categoryName}</Badge>
                    </div>
                  </Link>

                  <div className="flex flex-col flex-1 p-6">
                    <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4 font-mono">
                      <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" />{formatDate(post.publishedDate)}</span>
                      <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{authorName}</span>
                    </div>

                    <Link href={`/blog/${post.slug}`} className="block">
                      <h2 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2">{post.title}</h2>
                    </Link>
                    <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">{post.excerpt}</p>
                    <div className="mt-auto pt-4 border-t border-zinc-800">
                      <Link href={`/blog/${post.slug}`} className="text-sm font-medium text-cyan-500 hover:text-cyan-400 flex items-center gap-2">
                        {tCommon('readArticle')} <span aria-hidden="true">&rarr;</span>
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 border-t border-white/5">
              <Button 
                variant="outline" 
                className="w-full sm:w-auto border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white"
                disabled={!hasPrevPage}
                asChild={hasPrevPage}
              >
                {hasPrevPage ? (
                  <Link href={getPageUrl(prevPage!)}>
                    <ChevronLeft className="w-4 h-4 mr-2" /> {t('pagination.previous')}
                  </Link>
                ) : (
                  <span><ChevronLeft className="w-4 h-4 mr-2" /> {t('pagination.previous')}</span>
                )}
              </Button>

              <div className="text-sm text-zinc-500 font-mono">
                {t('pagination.page')} <span className="text-white">{page}</span> / {totalPages}
              </div>

              <Button 
                variant="outline" 
                className="w-full sm:w-auto border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white"
                disabled={!hasNextPage}
                asChild={hasNextPage}
              >
                {hasNextPage ? (
                  <Link href={getPageUrl(nextPage!)}>
                    {t('pagination.next')} <ChevronRight className="w-4 h-4 ml-2" />
                  </Link>
                ) : (
                  <span>{t('pagination.next')} <ChevronRight className="w-4 h-4 ml-2" /></span>
                )}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-zinc-800 border-dashed">
          <p className="text-zinc-500">{t('noArticles')}</p>
        </div>
      )}
    </div>
  )
}