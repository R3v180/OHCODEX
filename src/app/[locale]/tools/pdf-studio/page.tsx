// =============== INICIO ARCHIVO: src/app/[locale]/tools/pdf-studio/page.tsx =============== //
import React from 'react'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { PDFStudioTool } from '@/components/tools/pdf-studio/PDFStudioTool'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { AdSlot } from '@/components/shared/AdSlot'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'tools.pdfStudio.seo' })

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `https://ohcodex.com/${locale}/tools/pdf-studio`,
    }
  }
}

export default async function PDFStudioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('common')
  const tTool = await getTranslations('tools.pdfStudio')

  return (
    <div className="min-h-screen bg-black pt-20 pb-20">
      <div className="container px-4 mx-auto max-w-6xl">
        
        {/* Navigation */}
        <Breadcrumbs
          items={[
            { label: t('tools'), href: '/tools' },
            { label: tTool('title') }
          ]}
          className="mb-8"
        />

        {/* Ad Space Top */}
        <div className="mb-12 flex justify-center">
          <AdSlot position="top" />
        </div>

        {/* Main Tool Component */}
        <PDFStudioTool />

        {/* Ad Space Bottom */}
        <div className="mt-16 flex justify-center">
          <AdSlot position="bottom" />
        </div>

      </div>
    </div>
  )
}
// =============== FIN ARCHIVO: src/app/[locale]/tools/pdf-studio/page.tsx =============== //