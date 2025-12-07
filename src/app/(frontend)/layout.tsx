// -----------------------------------------------------------------------------
// Archivo: src/app/(frontend)/layout.tsx
// Versión: 1.1.0 - Integración del Footer Global
// Descripción: Layout principal del Frontend. Define fuentes, metadatos y estructura (Header + Main + Footer).
// -----------------------------------------------------------------------------

import React from 'react'
import '../globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer' // <--- 1. Importar Footer

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OHCodex | Arquitectos de Ecosistemas Digitales',
  description: 'Desarrollo de software a medida, PWAs y sistemas SaaS. Creadores de Crono-Job.com.',
}

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} min-h-screen bg-black font-sans antialiased text-foreground selection:bg-cyan-500/30 flex flex-col`}>
        
        {/* NAVEGACIÓN SUPERIOR */}
        <Header />
        
        {/* CONTENIDO PRINCIPAL (Hero, Productos, etc.) */}
        <main className="flex-1">
            {children}
        </main>
        
        {/* PIE DE PÁGINA GLOBAL */}
        <Footer /> {/* <--- 2. Añadir aquí */}
        
      </body>
    </html>
  )
}

// -----------------------------------------------------------------------------
// Fin archivo: src/app/(frontend)/layout.tsx
// -----------------------------------------------------------------------------