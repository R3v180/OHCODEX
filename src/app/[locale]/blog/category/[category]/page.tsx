// src/app/[locale]/blog/category/[category]/page.tsx
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import { BlogList } from '@/components/sections/BlogList'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ locale: string; category: string }>
}

// 1. Generación de Metadatos Dinámicos (SEO por Categoría)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category: categorySlug } = await params
  const payload = await getPayload({ config: configPromise })
  const t = await getTranslations({ locale, namespace: 'blog' })

  // Buscamos la categoría para obtener su nombre traducido para el meta-title
  const categoryRes = await payload.find({
    collection: 'categories',
    where: { slug: { equals: categorySlug } },
    locale: locale as any,
    limit: 1,
  })

  const category = categoryRes.docs[0]

  if (!category) return { title: 'Category Not Found' }

  return {
    // Ejemplo: "Artículos sobre Ingeniería de Software | OHCodex"
    title: `${t('categoryArticles', { category: category.name })} | OHCodex`,
    description: `${t('subtitle')} - ${category.name}`,
    alternates: {
      canonical: `https://ohcodex.com/${locale}/blog/category/${categorySlug}`,
    },
  }
}

export default async function CategoryPage({ params }: Props) {
  // En Next.js 15, params es una promesa
  const { locale, category: categorySlug } = await params
  const payload = await getPayload({ config: configPromise })
  const t = await getTranslations('blog')

  // Validamos que la categoría existe en la base de datos
  const categoryRes = await payload.find({
    collection: 'categories',
    where: { slug: { equals: categorySlug } },
    locale: locale as any,
    limit: 1,
  })

  const category = categoryRes.docs[0]

  // Si la categoría no existe, devolvemos 404
  if (!category) {
    notFound()
  }

  // Lógica para el estilo del título (Última palabra en cian)
  const titleText = t('categoryArticles', { category: category.name })
  const titleWords = titleText.split(' ')
  const titleMain = titleWords.slice(0, -1).join(' ')
  const titleLast = titleWords.slice(-1)

  return (
    <div className="bg-black min-h-screen pt-24 pb-20">
      
      {/* Fondo decorativo consistente con el resto del blog */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-50" />

      <div className="container px-4 mx-auto">
        
        {/* CABECERA DE LA CATEGORÍA */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-6 uppercase">
            {titleMain} <span className="text-cyan-500">{titleLast}</span>
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed italic">
            {t('subtitle')}
          </p>
        </div>

        {/* LISTADO FILTRADO */}
        {/* CORRECCIÓN: Usamos categorySlugs (plural) para coincidir con la nueva interfaz de BlogList */}
        <BlogList 
          locale={locale} 
          page={1} 
          categorySlugs={categorySlug} 
        />

      </div>
    </div>
  )
}