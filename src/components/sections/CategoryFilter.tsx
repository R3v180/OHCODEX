'use client'

import React, { useTransition } from 'react'
import { useRouter, usePathname } from '@/i18n/routing'
import { useSearchParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Loader2, X } from 'lucide-react'

interface Category {
  id: string | number
  name: string
  slug: string
}

interface CategoryFilterProps {
  categories: Category[]
  locale: string
}

export function CategoryFilter({ categories, locale }: CategoryFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // 1. Obtener las categorías seleccionadas actualmente desde la URL
  // Soportamos tanto la ruta SEO /category/[slug] como el query param ?cats=...
  const currentCatsParam = searchParams.get('cats')
  const pathSegments = pathname.split('/')
  const isCategoryPage = pathSegments.includes('category') || pathSegments.includes('categoria') || pathSegments.includes('categorie') || pathSegments.includes('kategorie')
  
  let selectedSlugs: string[] = []
  
  if (currentCatsParam) {
    selectedSlugs = currentCatsParam.split(',')
  } else if (isCategoryPage) {
    // Extraer el slug de la URL si estamos en /blog/category/[slug]
    const slugFromUrl = pathSegments[pathSegments.length - 1]
    if (slugFromUrl && slugFromUrl !== 'blog') {
        selectedSlugs = [slugFromUrl]
    }
  }

  const toggleCategory = (slug: string) => {
    let newSelected: string[]
    
    if (selectedSlugs.includes(slug)) {
      newSelected = selectedSlugs.filter(s => s !== slug)
    } else {
      newSelected = [...selectedSlugs, slug]
    }

    // 2. Lógica de navegación inteligente
    startTransition(() => {
      if (newSelected.length === 0) {
        // Si no hay nada seleccionado, volver al índice general
        router.push('/blog')
      } else if (newSelected.length === 1) {
        // Si hay solo una, usamos la ruta SEO limpia
        router.push(`/blog/category/${newSelected[0]}`)
      } else {
        // Si hay varias, usamos la ruta general con query params
        const params = new URLSearchParams()
        params.set('cats', newSelected.join(','))
        router.push(`/blog?${params.toString()}`)
      }
    })
  }

  const clearFilters = () => {
    startTransition(() => {
      router.push('/blog')
    })
  }

  return (
    <div className="flex flex-col gap-4 mb-12">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* BOTÓN "TODOS" */}
        <button
          onClick={clearFilters}
          disabled={isPending}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium transition-all border",
            selectedSlugs.length === 0
              ? "bg-cyan-500 border-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white"
          )}
        >
          {locale === 'es' ? 'Todos' : locale === 'en' ? 'All' : 'All'}
        </button>

        {/* LISTA DE CATEGORÍAS DINÁMICAS */}
        {categories.map((cat) => {
          const isSelected = selectedSlugs.includes(cat.slug)
          
          return (
            <button
              key={cat.id}
              onClick={() => toggleCategory(cat.slug)}
              disabled={isPending}
              className={cn(
                "group relative px-4 py-1.5 rounded-full text-sm font-medium transition-all border flex items-center gap-2",
                isSelected
                  ? "bg-white border-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-cyan-500/50 hover:text-cyan-400"
              )}
            >
              {cat.name}
              {isSelected && <X className="w-3 h-3 ml-1 opacity-60 group-hover:opacity-100" />}
            </button>
          )
        })}

        {/* INDICADOR DE CARGA */}
        {isPending && (
          <div className="ml-2 animate-spin text-cyan-500">
            <Loader2 className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* RESUMEN DE FILTROS ACTIVOS (Solo si hay varios) */}
      {selectedSlugs.length > 1 && (
        <div className="text-center animate-in fade-in slide-in-from-top-1">
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-mono">
            {locale === 'es' ? 'Filtrando por varias categorías' : 'Filtering by multiple categories'}
          </p>
        </div>
      )}
    </div>
  )
}