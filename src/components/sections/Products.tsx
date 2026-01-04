import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { ArrowUpRight, CheckCircle2, FlaskConical, Rocket, Timer, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { LandingPage } from '@/payload-types'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

// Configuración visual estática (Iconos y Colores no cambian por idioma)
const STATUS_VISUALS = {
  live: { color: 'bg-green-500/10 text-green-400 border-green-500/20', icon: CheckCircle2 },
  beta: { color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20', icon: Rocket },
  development: { color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', icon: Timer },
  concept: { color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20', icon: FlaskConical }
}

interface ProductsSectionProps {
  locale?: string
}

export async function ProductsSection({ locale = 'es' }: ProductsSectionProps) {
  const payload = await getPayload({ config: configPromise })
  
  // 1. Cargar traducciones de interfaz (Botones, Estados)
  const t = await getTranslations('products')

  // 2. Cargar datos de contenido (Títulos, Descripciones) desde Payload
  const landing = (await payload.findGlobal({
    slug: 'landing-page' as any,
    locale: locale as any,
  })) as unknown as LandingPage

  const { docs: products } = await payload.find({
    collection: 'products',
    depth: 1, 
    sort: 'order', 
    locale: locale as any,
  })

  // Textos de cabecera (con fallback)
  const title = landing?.productsTitle || 'Soluciones OHCodex'
  const description = landing?.productsDescription || 'Software diseñado para resolver problemas reales.'
  
  // Configuración de Grid/Alineación
  const gridColsOption = landing.productsGridCols || '3'
  const gridClass = {
    '2': 'lg:grid-cols-2',
    '3': 'lg:grid-cols-3',
    '4': 'lg:grid-cols-4',
  }[gridColsOption]

  const headerAlignClass = landing.productsAlign === 'center' ? 'text-center mx-auto' : 'text-left mr-auto'

  if (!products || products.length === 0) return null 

  return (
    <section id="productos" className="bg-zinc-950 py-24 border-b border-white/5">
      <div className="container px-4 mx-auto">
        
        {/* Cabecera de Sección */}
        <div className={`mb-16 max-w-3xl ${headerAlignClass}`}>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {title.split(' ').slice(0, -1).join(' ')} <span className="text-cyan-500">{title.split(' ').slice(-1)}</span>
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            {description}
          </p>
        </div>

        {/* Grid de Productos */}
        <div className={`grid grid-cols-1 md:grid-cols-2 ${gridClass} gap-8`}>
          {products.map((product) => {
            // Resolver estilos y texto del estado
            const statusKey = product.status as keyof typeof STATUS_VISUALS
            const visuals = STATUS_VISUALS[statusKey] || STATUS_VISUALS.concept
            const StatusIcon = visuals.icon
            const statusLabel = t(`status.${statusKey}`) // Traducción dinámica: "En Producción" / "Live"

            const iconUrl = typeof product.logo === 'object' && product.logo?.url ? product.logo.url : null
            const detailUrl = `/${locale}/products/${product.slug}`

            return (
              <div 
                key={product.id} 
                className="group relative flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm transition-all hover:border-cyan-500/50 hover:bg-zinc-900 hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.15)]"
              >
                {/* Link Maestro */}
                <Link 
                    href={detailUrl} 
                    className="absolute inset-0 z-10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-black"
                    aria-label={`${t('aboutProject')} ${product.name}`}
                />

                <div className="flex items-start justify-between mb-6 pointer-events-none">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 border border-zinc-700 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/10 transition-colors">
                      {iconUrl ? (
                        <div className="relative w-8 h-8">
                            <Image src={iconUrl} alt="logo" fill className="object-contain" />
                        </div>
                      ) : (
                        <Rocket className="h-6 w-6 text-zinc-400 group-hover:text-cyan-400" />
                      )}
                  </div>

                  <Badge variant="outline" className={`${visuals.color} capitalize flex gap-1.5`}>
                    <StatusIcon className="w-3 h-3" />
                    {statusLabel}
                  </Badge>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors mb-2 pointer-events-none">
                  {product.name}
                </h3>

                <p className="text-zinc-400 text-sm leading-relaxed mb-6 flex-1 pointer-events-none">
                  {product.shortDescription}
                </p>

                <div className="mt-auto pt-6 border-t border-zinc-800/50 flex items-center justify-between">
                  <div className="flex gap-2 flex-wrap pointer-events-none">
                    {product.technologies?.slice(0,3).map((tech, i) => (
                      <span key={i} className="text-xs font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                        {tech.name}
                      </span>
                    ))}
                  </div>
                  
                  {product.projectUrl && (
                    <div className="relative z-20">
                        <Button asChild size="sm" variant="ghost" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950 p-0 h-auto font-semibold ml-2">
                        <a href={product.projectUrl} target="_blank" rel="noopener noreferrer">
                            {t('visitWebsite')} <ArrowUpRight className="ml-1 w-4 h-4" />
                        </a>
                        </Button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}