import { Metadata } from 'next'
import { ImageOptimizerTool } from '@/components/tools/image-optimizer/ImageOptimizerTool'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { AdSlot } from '@/components/shared/AdSlot'
import { CrossSellBanner } from '@/components/shared/CrossSellBanner'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'

  return {
    title: isEn ? 'Compress and Optimize Images Online (WebP, JPG) - OHCodex' : 'Comprimir y Optimizar Imágenes Online (WebP, JPG) - OHCodex',
    description: isEn ? 'Reduce photo weight, add watermark and convert to WebP for free. Batch processing in your browser. Private and no limits.' : 'Reducir peso de fotos, añadir marca de agua y convertir a WebP gratis. Procesamiento por lotes en tu navegador. Privado y sin límites.',
    keywords: ['comprimir imagen online', 'convertir a webp', 'marca de agua fotos', 'optimizar imagenes seo', 'redimensionar imagenes', 'compress image online', 'convert to webp'],
    openGraph: {
      title: isEn ? 'Compress and Optimize Images Online - OHCodex' : 'Comprimir y Optimizar Imágenes Online - OHCodex',
      description: isEn ? 'Suite complete of image manipulation in the browser. Compress, resize and convert in batches.' : 'Suite completa de manipulación de imágenes en el navegador. Comprime, redimensiona y convierte por lotes.',
      type: 'website',
    },
  }
}

export default async function ImageOptimizerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  return (
    <>
      <Breadcrumbs
        items={[
          { label: locale === 'en' ? 'Tools' : 'Herramientas', href: '/' },
          { label: locale === 'en' ? 'Pixel Optimizer' : 'Pixel Optimizer' }
        ]}
      />

      <AdSlot position="top" className="mb-8" />

      <ImageOptimizerTool />

      <AdSlot position="bottom" className="mt-8" />

      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <CrossSellBanner />
      </div>
    </>
  )
}
