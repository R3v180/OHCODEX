'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Code2, Layers } from 'lucide-react'

export function Hero() {
  const badge = 'Nuevo: Tools Section Disponible'
  const title = 'Arquitectos de Ecosistemas Digitales'
  const subtitle = 'Transformamos negocios con software a medida de alto rendimiento. Desde PWAs ultra-rápidas hasta infraestructuras SaaS complejas.'

  return (
    <section id="hero" className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden border-b border-border bg-background pt-20 pb-16">

      {/* 1. FONDO TECNOLÓGICO */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-20 blur-[100px]" />
      </div>

      <div className="container relative z-10 px-4 text-center">

        {/* 2. BADGE SUPERIOR DINÁMICO */}
        {badge && (
          <div className="mb-6 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary backdrop-blur-sm">
            <span className="mr-2 flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            {badge}
          </div>
        )}

        {/* 3. TÍTULO PRINCIPAL DINÁMICO */}
        <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-foreground md:text-7xl lg:text-8xl">
          {title.split(' ').slice(0, -2).join(' ')} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-teal-400">
            {title.split(' ').slice(-2).join(' ')}
          </span>
        </h1>

        {/* 4. SUBTÍTULO DINÁMICO */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
          {subtitle}
        </p>

        {/* 5. CTA */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="h-12 min-w-[160px] bg-primary text-lg font-semibold text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all"
            asChild
          >
            <Link href="#contact">
              Empezar Proyecto <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="h-12 min-w-[160px] border-border bg-background/50 text-lg text-muted-foreground backdrop-blur-sm hover:bg-accent hover:text-foreground"
            asChild
          >
            <Link href="#products">
              Ver Portfolio
            </Link>
          </Button>
        </div>

        {/* 6. TECH STACK (Responsive) */}
        <div className="mt-16 sm:mt-20 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-muted-foreground opacity-70 grayscale transition-all hover:grayscale-0">
          <div className="flex items-center gap-2">
            <Code2 className="h-6 w-6" />
            <span className="font-mono text-sm">Next.js 15</span>
          </div>

          {/* Separador: oculto en móvil (hidden), visible en sm (sm:block) */}
          <div className="hidden sm:block h-4 w-[1px] bg-border" />

          <div className="flex items-center gap-2">
            <Layers className="h-6 w-6" />
            <span className="font-mono text-sm">Tailwind CSS</span>
          </div>

          {/* Separador: oculto en móvil (hidden), visible en sm (sm:block) */}
          <div className="hidden sm:block h-4 w-[1px] bg-border" />

          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold">Prisma</span>
            <span className="font-mono text-sm">ORM</span>
          </div>
        </div>

      </div>
    </section>
  )
}
