// ========== src/app/(frontend)/layout.tsx ========== //

// -----------------------------------------------------------------------------
// Archivo: src/app/(frontend)/layout.tsx
// Versión: 1.2.0 - SEO & Open Graph
// Descripción: Layout principal con configuración de metadatos robusta para
// indexación en Google y tarjetas sociales (LinkedIn/WhatsApp).
// -----------------------------------------------------------------------------

import React from 'react'
import '../globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

// Configuración SEO Global
export const metadata: Metadata = {
  // IMPORTANTE: Cambia esta URL por tu dominio real cuando lo tengas (o la URL de Render)
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://ohcodex.com'),
  title: {
    default: 'OHCodex | Arquitectos de Ecosistemas Digitales',
    template: '%s | OHCodex', // Esto hace que las subpáginas sean "AquaClean | OHCodex"
  },
  description: 'Desarrollo de software a medida, PWAs y sistemas SaaS. Especialistas en React, Next.js y arquitecturas escalables.',
  keywords: ['Software Development', 'SaaS', 'PWA', 'Next.js', 'React', 'Payload CMS', 'Consultoría Tecnológica'],
  authors: [{ name: 'OHCodex Team' }],
  openGraph: {
    title: 'OHCodex | Software Development',
    description: 'Transformamos negocios con software a medida de alto rendimiento.',
    url: '/',
    siteName: 'OHCodex',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OHCodex',
    description: 'Arquitectos de Ecosistemas Digitales.',
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

// ========== Fin de src/app/(frontend)/layout.tsx ========== //