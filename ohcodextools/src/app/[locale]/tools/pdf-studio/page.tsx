import { Metadata } from 'next'
import { PDFStudioTool } from '@/components/tools/pdf-studio/PDFStudioTool'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { AdSlot } from '@/components/shared/AdSlot'
import { CrossSellBanner } from '@/components/shared/CrossSellBanner'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'

  return {
    title: isEn ? 'Online PDF Editor: Merge, Sign and Compress - OHCodex PDF Studio' : 'Editor PDF Online: Unir, Firmar y Comprimir - OHCodex PDF Studio',
    description: isEn ? 'Free tool to manage PDFs. Organize pages, sign documents digitally and reduce file size. No registration and secure.' : 'Herramienta gratuita para gestionar PDFs. Organiza páginas, firma documentos digitalmente y reduce el tamaño de archivo. Sin registro y seguro.',
    keywords: ['unir pdf online', 'firmar pdf gratis', 'organizar paginas pdf', 'comprimir pdf', 'rotar pdf', 'merge pdf'],
    openGraph: {
      title: isEn ? 'Online PDF Editor - OHCodex PDF Studio' : 'Editor PDF Online - OHCodex PDF Studio',
      description: isEn ? 'Manage PDFs in the browser. Merge, rotate and organize pages.' : 'Gestiona PDFs en el navegador. Unir, rotar y organizar páginas.',
      type: 'website',
    },
  }
}

export default async function PDFStudioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  return (
    <>
      <Breadcrumbs
        items={[
          { label: locale === 'en' ? 'Tools' : 'Herramientas', href: '/' },
          { label: locale === 'en' ? 'PDF Studio' : 'PDF Studio' }
        ]}
      />

      <AdSlot position="top" className="mb-8" />

      <PDFStudioTool />

      <AdSlot position="bottom" className="mt-8" />

      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <CrossSellBanner />
      </div>
    </>
  )
}
