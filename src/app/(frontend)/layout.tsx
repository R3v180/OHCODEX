// ========== src/app/(frontend)/layout.tsx ========== //

import React from 'react'
import '../globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import type { CompanyInfo } from '@/payload-types'

const inter = Inter({ subsets: ['latin'] })

// URL base para producción
const getServerUrl = () => process.env.NEXT_PUBLIC_SERVER_URL || 'https://ohcodex.com'

// Imagen Social por defecto (Fallback)
const SOCIAL_IMAGE_URL = 'https://res.cloudinary.com/dpp6gyfao/image/upload/w_1200,h_630,c_fill,q_auto/v1765156811/ohcodex-media/jz9fdr3w83as6gxi40fq.jpg'

// ✅ CAMBIO: Ahora es una función asíncrona que lee de la BD
export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config: configPromise })
  
  // Obtenemos la configuración global
  const company = (await payload.findGlobal({
    slug: 'company-info' as any,
  })) as unknown as CompanyInfo

  // Valores dinámicos con fallback
  const title = company?.defaultTitle || 'OHCodex | Desarrollo de Software a Medida'
  const titleTemplate = company?.titleTemplate || '%s | OHCodex'
  const description = company?.defaultDescription || 'Empresa de desarrollo de software especializada en PWAs y arquitecturas SaaS.'
  
  // Mapeamos las keywords del array de objetos a un array de strings
  const keywords = company?.keywords?.map(k => k.keyword).filter((k): k is string => !!k) || [
    'Desarrollo de Software', 'SaaS', 'PWA', 'Next.js'
  ]

  return {
    metadataBase: new URL(getServerUrl()),
    
    title: {
      default: title,
      template: titleTemplate,
    },
    
    description,
    
    keywords,
    
    authors: [{ name: 'OHCodex Team', url: getServerUrl() }],
    creator: 'OHCodex',
    
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    alternates: {
      canonical: './',
    },

    openGraph: {
      type: 'website',
      locale: 'es_ES',
      url: '/',
      siteName: 'OHCodex',
      title: title,
      description: description,
      images: [
        {
          url: SOCIAL_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      creator: '@ohcodex',
      images: [SOCIAL_IMAGE_URL],
    },
    
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
  }
}

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-black font-sans antialiased text-foreground selection:bg-cyan-500/30 flex flex-col`}>
        
        {/* NAVEGACIÓN SUPERIOR */}
        <Header />
        
        {/* CONTENIDO PRINCIPAL */}
        <main className="flex-1">
            {children}
        </main>
        
        {/* PIE DE PÁGINA GLOBAL */}
        <Footer />
        
      </body>
    </html>
  )
}