// src/app/[locale]/blog/page/[pageNumber]/page.tsx
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import { BlogList } from '@/components/sections/BlogList'
import { CategoryFilter } from '@/components/sections/CategoryFilter'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ locale: string; pageNumber: string }>
  searchParams: Promise<{ cats?: string }>
}

// 1. Generación de Metadatos Dinámicos para SEO
export async function generateMetadata({ params }: { params: Promise<{ locale: string; pageNumber: string }> }): Promise<Metadata> {
  const { locale, pageNumber } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })

  return {
    title: `${t('title')} - ${t('pagination.page')} ${pageNumber} | OHCodex`,
    description: t('subtitle'),
    robots: {
      index: true,
      follow: true,
    },
  }
}

// 2. Generación de rutas estáticas iniciales
export async function generateStaticParams() {
  const locales = routing.locales
  const pages = ['2', '3', '4', '5'] 
  
  const params = []
  for (const locale of locales) {
    for (const pageNumber of pages) {
      params.push({ locale, pageNumber })
    }
  }
  return params
}

export default async function BlogPaginationPage({ params, searchParams }: Props) {
  // En Next.js 15, tanto params como searchParams son Promesas
  const { locale, pageNumber } = await params
  const { cats } = await searchParams
  
  const payload = await getPayload({ config: configPromise })
  const t = await getTranslations('blog')
  
  const pageNum = parseInt(pageNumber)

  // Validación de seguridad
  if (isNaN(pageNum) || pageNum < 1) {
    notFound()
  }

  // 3. Cargar categorías para el filtro
  const categoriesRes = await payload.find({
    collection: 'categories',
    locale: locale as any,
    limit: 100,
    sort: 'name',
  })

  const allCategories = categoriesRes.docs.map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug || '',
  }))

  const selectedSlugs = cats ? cats.split(',') : []

  // Estilo visual del título
  const titleText = t('title')
  const titleWords = titleText.split(' ')
  const titleMain = titleWords.slice(0, -1).join(' ')
  const titleLast = titleWords.slice(-1)

  return (
    <div className="bg-black min-h-screen pt-24 pb-20">
      
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-50" />

      <div className="container px-4 mx-auto">
        
        {/* CABECERA */}
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-6">
            {titleMain} <span className="text-cyan-500">{titleLast}</span>
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed mb-8">
            {t('subtitle')} — {t('pagination.page')} {pageNumber}
          </p>
        </div>

        {/* FILTRO DE CATEGORÍAS */}
        <CategoryFilter 
          categories={allCategories} 
          locale={locale} 
        />

        {/* LISTADO DE POSTS CON SOPORTE PARA FILTROS */}
        <BlogList 
          locale={locale} 
          page={pageNum} 
          categorySlugs={selectedSlugs} 
        />

      </div>
    </div>
  )
}