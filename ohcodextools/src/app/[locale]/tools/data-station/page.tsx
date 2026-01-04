import { Metadata } from 'next'
import { DataStationTool } from '@/components/tools/data-station/DataStationTool'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { AdSlot } from '@/components/shared/AdSlot'
import { CrossSellBanner } from '@/components/shared/CrossSellBanner'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'

  return {
    title: isEn ? 'JSON Formatter, CSV Converter and SQL Online - OHCodex Data Station' : 'Formateador JSON, Conversor CSV y SQL Online - OHCodex Data Station',
    description: isEn ? 'Validate JSON, convert CSV to JSON, format SQL and compare code. Free, private and serverless developer tools.' : 'Valida JSON, convierte CSV a JSON, formatea SQL y compara código. Herramientas para desarrolladores gratuitas, privadas y sin servidor.',
    keywords: ['json formatter online', 'csv to json converter', 'sql beautifier', 'diff checker online', 'yaml validator', 'format sql', 'validate json'],
    openGraph: {
      title: isEn ? 'Data Station - JSON, SQL & Data Tools' : 'Data Station - Herramientas de Datos',
      description: isEn ? 'Professional data formatting tools in your browser.' : 'Herramientas profesionales de formateo de datos en tu navegador.',
      type: 'website',
    },
  }
}

export default async function DataStationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  return (
    <>
      <Breadcrumbs
        items={[
          { label: locale === 'en' ? 'Tools' : 'Herramientas', href: '/' },
          { label: locale === 'en' ? 'Data Station' : 'Data Station' }
        ]}
      />

      <AdSlot position="top" className="mb-8" />

      <DataStationTool />

      <AdSlot position="bottom" className="mt-8" />

      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <CrossSellBanner />
      </div>
    </>
  )
}
