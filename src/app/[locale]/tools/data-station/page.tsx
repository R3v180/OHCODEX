import React from 'react'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { DataStationTool } from '@/components/tools/data-station/DataStationTool'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { AdSlot } from '@/components/shared/AdSlot'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  // CORRECCIÓN: 'data-station' con guion
  const t = await getTranslations({ locale, namespace: 'tools.data-station.seo' })

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `https://ohcodex.com/${locale}/tools/data-station`,
    }
  }
}

export default async function DataStationPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations('common')
  // CORRECCIÓN: 'data-station' con guion
  const tTool = await getTranslations('tools.data-station')

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
        <DataStationTool />

        {/* Ad Space Bottom */}
        <div className="mt-16 flex justify-center">
          <AdSlot position="bottom" />
        </div>

      </div>
    </div>
  )
}