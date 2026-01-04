import { Metadata } from 'next'
import { QRFactoryTool } from '@/components/tools/qr-factory/QRFactoryTool'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { AdSlot } from '@/components/shared/AdSlot'
import { CrossSellBanner } from '@/components/shared/CrossSellBanner'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'

  return {
    title: isEn ? 'QR Code and Barcode Generator with Logo (SVG/PNG) - OHCodex' : 'Generador de Códigos QR y Barras con Logo (SVG/PNG) - OHCodex',
    description: isEn ? 'Create custom QRs for WiFi, VCard and WhatsApp. EAN-13 and Code-128 barcode generator for inventory. Free vector download.' : 'Crea QRs personalizados para WiFi, VCard y WhatsApp. Generador de códigos de barras EAN-13 y Code-128 para inventario. Descarga vectorial gratuita.',
    keywords: ['generador qr con logo', 'wifi qr code', 'codigo barras ean13', 'barcode generator svg', 'vcard qr online', 'qr code generator', 'barcode generator'],
    openGraph: {
      title: isEn ? 'QR Code and Barcode Generator - OHCodex' : 'Generador de QR y Barras - OHCodex',
      description: isEn ? 'Generate custom QR codes and barcodes professionally. Download in SVG and PNG formats.' : 'Genera QRs personalizados y códigos de barras profesionalmente.',
      type: 'website',
    },
  }
}

export default async function QRFactoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  return (
    <>
      <Breadcrumbs
        items={[
          { label: locale === 'en' ? 'Tools' : 'Herramientas', href: '/' },
          { label: locale === 'en' ? 'QR Factory' : 'QR Factory' }
        ]}
      />

      <AdSlot position="top" className="mb-8" />

      <QRFactoryTool />

      <AdSlot position="bottom" className="mt-8" />

      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <CrossSellBanner />
      </div>
    </>
  )
}
