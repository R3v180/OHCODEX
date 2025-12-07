// ========== src/components/sections/Hero.tsx ========== //

// -----------------------------------------------------------------------------
// Archivo: src/components/sections/Hero.tsx
// Versión: 2.0.0 - Dinámico (CMS)
// Descripción: Sección Hero conectada a la configuración global 'landing-page'.
// Permite editar el título, subtítulo y badge desde el panel de administración.
// -----------------------------------------------------------------------------

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Code2, Layers } from 'lucide-react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { LandingPage } from '@/payload-types'

export async function Hero() {
  const payload = await getPayload({ config: configPromise })
  
  // 1. Obtener datos de la Landing Page
  const landing = (await payload.findGlobal({
    slug: 'landing-page' as any,
  })) as unknown as LandingPage

  // 2. Definir valores (con fallback por si el panel está vacío)
  const badge = landing?.heroBadge || 'Nuevo: Pool-Control Beta Disponible'
  const title = landing?.heroTitle || 'Arquitectos de Ecosistemas Digitales'
  const subtitle = landing?.heroSubtitle || 'Transformamos negocios con software a medida de alto rendimiento. Desde PWAs ultra-rápidas hasta infraestructuras SaaS complejas.'

  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden border-b border-white/10 bg-black pt-20">
      
      {/* 1. FONDO TECNOLÓGICO */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-cyan-500 opacity-20 blur-[100px]" />
      </div>

      <div className="container relative z-10 px-4 text-center">
        
        {/* 2. BADGE SUPERIOR DINÁMICO */}
        {badge && (
          <div className="mb-6 inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300 backdrop-blur-sm">
            <span className="mr-2 flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            {badge}
          </div>
        )}

        {/* 3. TÍTULO PRINCIPAL DINÁMICO */}
        <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-white md:text-7xl lg:text-8xl">
          {title.split(' ').slice(0, -2).join(' ')} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-300">
            {title.split(' ').slice(-2).join(' ')}
          </span>
        </h1>

        {/* 4. SUBTÍTULO DINÁMICO */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400 md:text-xl">
          {subtitle}
        </p>

        {/* 5. CTA */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button 
            size="lg" 
            className="h-12 min-w-[160px] bg-cyan-600 text-lg font-semibold text-white hover:bg-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all"
            asChild
          >
            <Link href="/#contacto">
              Empezar Proyecto <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="h-12 min-w-[160px] border-zinc-700 bg-black/50 text-lg text-zinc-300 backdrop-blur-sm hover:bg-white/10 hover:text-white"
            asChild
          >
            <Link href="/#productos">
              Ver Portfolio
            </Link>
          </Button>
        </div>

        {/* 6. TECH STACK (ESTÁTICO - Diseño) */}
        <div className="mt-20 flex items-center justify-center gap-8 text-zinc-500 opacity-70 grayscale transition-all hover:grayscale-0">
            <div className="flex items-center gap-2">
                <Code2 className="h-6 w-6" />
                <span className="font-mono text-sm">Next.js 15</span>
            </div>
            <div className="h-4 w-[1px] bg-zinc-800" />
            <div className="flex items-center gap-2">
                <Layers className="h-6 w-6" />
                <span className="font-mono text-sm">Payload CMS</span>
            </div>
            <div className="h-4 w-[1px] bg-zinc-800" />
            <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold">NEON</span>
                <span className="font-mono text-sm">Postgres</span>
            </div>
        </div>

      </div>
    </section>
  )
}

// ========== Fin de src/components/sections/Hero.tsx ========== //