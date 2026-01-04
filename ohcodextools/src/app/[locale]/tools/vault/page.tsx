import { Metadata } from 'next'
import { VaultTool } from '@/components/tools/vault/VaultTool'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { AdSlot } from '@/components/shared/AdSlot'
import { CrossSellBanner } from '@/components/shared/CrossSellBanner'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'

  return {
    title: isEn ? 'Encrypt Text and Files Online - OHCodex Vault' : 'Encriptar Texto y Archivos Online - OHCodex Vault',
    description: isEn ? 'Free AES-256 encryption tool in the browser. Protect your documents, photos, and videos before sending. Total privacy, no servers.' : 'Herramienta gratuita de encriptación AES-256 en el navegador. Protege tus documentos, fotos y vídeos antes de enviarlos. Privacidad total, sin servidores.',
    keywords: ['encrypt files online', 'aes encryption online', 'protect pdf', 'encrypt text', 'zero-knowledge encryption', 'client-side encryption'],
    openGraph: {
      title: isEn ? 'Encrypt Text and Files Online - OHCodex Vault' : 'Encriptar Texto y Archivos Online - OHCodex Vault',
      description: isEn ? 'Military-grade AES-256 encryption. Zero-Knowledge - Your data never leaves your browser.' : 'Encriptación AES-256 de grado militar. Zero-Knowledge - Tus datos nunca salen de tu navegador.',
      type: 'website',
    },
  }
}

export default async function VaultPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  return (
    <>
      <Breadcrumbs
        items={[
          { label: locale === 'en' ? 'Tools' : 'Herramientas', href: '/' },
          { label: locale === 'en' ? 'Vault' : 'Vault' }
        ]}
      />

      <AdSlot position="top" className="mb-8" />

      <VaultTool />

      <AdSlot position="bottom" className="mt-8" />

      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <CrossSellBanner />
      </div>
    </>
  )
}
