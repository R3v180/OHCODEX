// src/app/[locale]/blog/category/[category]/[pageNumber]/page.tsx
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import { BlogList } from '@/components/sections/BlogList'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ locale: string; category: string; pageNumber: string }>
}

// 1. Generación de Metadatos Dinámicos (SEO: Categoría + Número de Página)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category: categorySlug, pageNumber } = await params
  const payload = await getPayload({ config: configPromise })
  const t = await getTranslations({ locale, namespace: 'blog' })

  // Buscamos la categoría para el título de la pestaña
  const categoryRes = await payload.find({
    collection: 'categories',
    where: { slug: { equals: categorySlug } },
    locale: locale as any,
    limit: 1,
  })

  const category = categoryRes.docs[0]
  if (!category) return { title: 'Category Not Found' }

  return {
    // Ejemplo: "Artículos sobre Ingeniería de Software - Página 2 | OHCodex"
    title: `${t('categoryArticles', { category: category.name })} - ${t('pagination.page')} ${pageNumber} | OHCodex`,
    description: `${t('subtitle')} - ${category.name} (${t('pagination.page')} ${pageNumber})`,
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function CategoryPaginationPage({ params }: Props) {
  // En Next.js 15 los params se deben esperar (await)
  const { locale, category: categorySlug, pageNumber } = await params
  const payload = await getPayload({ config: configPromise })
  const t = await getTranslations('blog')

  const pageNum = parseInt(pageNumber)

  // Validación de seguridad: si no es un número o es menor a 1, error 404
  if (isNaN(pageNum) || pageNum < 1) {
    notFound()
  }

  // Buscamos la categoría para validar su existencia y obtener el nombre real para el H1
  const categoryRes = await payload.find({
    collection: 'categories',
    where: { slug: { equals: categorySlug } },
    locale: locale as any,
    limit: 1,
  })

  const category = categoryRes.docs[0]

  if (!category) {
    notFound()
  }

  // Lógica de diseño para el título (cian en la última palabra)
  const titleText = t('categoryArticles', { category: category.name })
  const titleWords = titleText.split(' ')
  const titleMain = titleWords.slice(0, -1).join(' ')
  const titleLast = titleWords.slice(-1)

  return (
    <div className="bg-black min-h-screen pt-24 pb-20">
      
      {/* Fondo decorativo */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-50" />

      <div className="container px-4 mx-auto">
        
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-6 uppercase">
            {titleMain} <span className="text-cyan-500">{titleLast}</span>
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed italic">
            {t('subtitle')} — {t('pagination.page')} {pageNumber}
          </p>
        </div>

        {/* LISTADO FILTRADO Y PAGINADO */}
        {/* CORRECCIÓN: Cambiado 'categorySlug' a 'categorySlugs' (plural) para cumplir con la interfaz de BlogList */}
        <BlogList 
          locale={locale} 
          page={pageNum} 
          categorySlugs={categorySlug} 
        />

      </div>
    </div>
  )
}