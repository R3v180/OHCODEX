// src/app/[locale]/blog/category/[category]/[pageNumber]/page.tsx
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import { BlogList } from '@/components/sections/BlogList'
import { CategoryFilter } from '@/components/sections/CategoryFilter'
import { notFound } from 'next/navigation'

export const revalidate = 600

type Props = {
  params: Promise<{ locale: string; category: string; pageNumber: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category: categorySlug, pageNumber } = await params
  const payload = await getPayload({ config: configPromise })
  const t = await getTranslations({ locale, namespace: 'blog' })

  const categoryRes = await payload.find({
    collection: 'categories',
    where: { slug: { equals: categorySlug } },
    locale: locale as any,
    limit: 1,
  })

  const category = categoryRes.docs[0]
  if (!category) return { title: 'Category Not Found' }

  return {
    title: `${t('categoryArticles', { category: category.name })} - ${t('pagination.page')} ${pageNumber} | OHCodex`,
    description: `${t('subtitle')} - ${category.name} (${t('pagination.page')} ${pageNumber})`,
  }
}

export default async function CategoryPaginationPage({ params }: Props) {
  const { locale, category: categorySlug, pageNumber } = await params
  const payload = await getPayload({ config: configPromise })
  const t = await getTranslations('blog')
  const pageNum = parseInt(pageNumber)

  if (isNaN(pageNum) || pageNum < 1) notFound()

  // 1. Cargamos categorías para el filtro
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

  const currentCategory = allCategories.find(c => c.slug === categorySlug)
  if (!currentCategory) notFound()

  const titleText = t('categoryArticles', { category: currentCategory.name })
  const titleWords = titleText.split(' ')
  const titleMain = titleWords.slice(0, -1).join(' ')
  const titleLast = titleWords.slice(-1)

  return (
    <div className="bg-black min-h-screen pt-24 pb-20">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-50" />

      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-6 uppercase">
            {titleMain} <span className="text-cyan-500">{titleLast}</span>
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed mb-8 italic">
            {t('subtitle')} — {t('pagination.page')} {pageNumber}
          </p>
        </div>

        {/* 💡 FILTRO SIEMPRE VISIBLE */}
        <CategoryFilter categories={allCategories} locale={locale} />

        <BlogList 
          locale={locale} 
          page={pageNum} 
          categorySlugs={categorySlug} 
        />
      </div>
    </div>
  )
}