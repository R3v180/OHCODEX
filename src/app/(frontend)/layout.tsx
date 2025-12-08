import React from 'react'
import '../globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

// URL base para producción
const getServerUrl = () => process.env.NEXT_PUBLIC_SERVER_URL || 'https://ohcodex.com'

// ✅ NUEVA IMAGEN (Optimizada para WhatsApp/LinkedIn)
// Hemos añadido 'w_1200,h_630,c_fill,q_auto' para asegurar que pese poco y tenga el tamaño perfecto.
const SOCIAL_IMAGE_URL = 'https://res.cloudinary.com/dpp6gyfao/image/upload/w_1200,h_630,c_fill,q_auto/v1765156811/ohcodex-media/jz9fdr3w83as6gxi40fq.jpg'

// Configuración SEO Global
export const metadata: Metadata = {
  metadataBase: new URL(getServerUrl()),
  
  title: {
    default: 'OHCodex | Desarrollo de Software a Medida y Sistemas SaaS',
    template: '%s | OHCodex - Ingeniería de Software',
  },
  
  description: 'Empresa de desarrollo de software especializada en PWAs, arquitecturas SaaS escalables y transformación digital. Expertos en React, Next.js y Cloud Native.',
  
  keywords: [
    'Desarrollo de Software España',
    'Agencia Desarrollo SaaS',
    'Consultoría Tecnológica Alicante',
    'Aplicaciones Web Progresivas (PWA)',
    'Next.js Experts',
    'Payload CMS Developers',
    'Arquitectura de Software Escalable',
    'Desarrollo Web a Medida',
    'React',
    'PostgreSQL'
  ],
  
  authors: [{ name: 'OHCodex Team', url: 'https://ohcodex.com' }],
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

  // Canonical URL (Importante para Google)
  alternates: {
    canonical: './',
  },

  // Open Graph (Facebook, LinkedIn, WhatsApp)
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: '/',
    siteName: 'OHCodex',
    title: 'OHCodex | Arquitectos de Ecosistemas Digitales',
    description: 'Transformamos negocios con software a medida de alto rendimiento.',
    images: [
      {
        url: SOCIAL_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: 'OHCodex Software Development',
      },
    ],
  },

  // Twitter Cards (X)
  twitter: {
    card: 'summary_large_image',
    title: 'OHCodex | Desarrollo de Software Avanzado',
    description: 'Ingeniería de software para empresas ambiciosas. PWA, SaaS y APIs.',
    creator: '@ohcodex',
    images: [SOCIAL_IMAGE_URL],
  },
  
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
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