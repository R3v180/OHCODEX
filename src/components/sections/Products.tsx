// ========== src/components/sections/Products.tsx ========== //

// -----------------------------------------------------------------------------
// Archivo: src/components/sections/Products.tsx
// Versión: 2.0.0 - Cabecera Dinámica + Lista de Productos
// Descripción: Obtiene el título/descripción de la sección desde el Global 'landing-page'
// y la lista de tarjetas desde la Colección 'products'.
// -----------------------------------------------------------------------------

import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { ArrowUpRight, CheckCircle2, FlaskConical, Rocket, Timer } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { LandingPage } from '@/payload-types'

// Función auxiliar para obtener el icono según el estado
const getStatusConfig = (status: string) => {
  switch (status) {
    case 'live':
      return { label: 'En Producción', color: 'bg-green-500/10 text-green-400 border-green-500/20', icon: CheckCircle2 }
    case 'beta':
      return { label: 'Beta Pública', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20', icon: Rocket }
    case 'development':
      return { label: 'En Desarrollo', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', icon: Timer }
    default:
      return { label: 'Concepto', color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20', icon: FlaskConical }
  }
}

export async function ProductsSection() {
  const payload = await getPayload({ config: configPromise })
  
  // 1. OBTENER CONFIGURACIÓN GLOBAL (Textos de cabecera)
  const landing = (await payload.findGlobal({
    slug: 'landing-page' as any,
  })) as unknown as LandingPage

  // 2. OBTENER LISTA DE PRODUCTOS (Datos de tarjetas)
  const { docs: products } = await payload.find({
    collection: 'products',
    depth: 1, 
    sort: '-isFeatured',
  })

  // Textos con fallback
  const title = landing?.productsTitle || 'Soluciones OHCodex'
  const description = landing?.productsDescription || 'Software diseñado para resolver problemas reales. Desde la automatización de infraestructura hasta la gestión comercial.'

  // Si no hay productos, no mostramos la sección
  if (!products || products.length === 0) {
    return null 
  }

  return (
    <section id="productos" className="bg-zinc-950 py-24 border-b border-white/5">
      <div className="container px-4 mx-auto">
        
        {/* CABECERA DE SECCIÓN DINÁMICA */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {/* Lógica simple para colorear la última palabra del título */}
            {title.split(' ').slice(0, -1).join(' ')} <span className="text-cyan-500">{title.split(' ').slice(-1)}</span>
          </h2>
          <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* GRILLA DE TARJETAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => {
            const status = getStatusConfig(product.status)
            const StatusIcon = status.icon
            
            const iconUrl = typeof product.logo === 'object' && product.logo?.url 
              ? product.logo.url 
              : null
            
            const detailUrl = `/products/${product.slug}`

            return (
              <div 
                key={product.id} 
                className="group relative flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm transition-all hover:border-cyan-500/50 hover:bg-zinc-900 hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.15)]"
              >
                {/* Cabecera Card */}
                <div className="flex items-start justify-between mb-6">
                  {/* Icono con Enlace */}
                  <Link href={detailUrl} className="block">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 border border-zinc-700 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/10 transition-colors cursor-pointer">
                       {iconUrl ? (
                          <img src={iconUrl} alt={product.name} className="h-8 w-8 object-contain" />
                       ) : (
                          <Rocket className="h-6 w-6 text-zinc-400 group-hover:text-cyan-400" />
                       )}
                    </div>
                  </Link>

                  {/* Badge Estado */}
                  <Badge variant="outline" className={`${status.color} capitalize flex gap-1.5`}>
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </Badge>
                </div>

                {/* Título con Enlace */}
                <Link href={detailUrl} className="block mb-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors cursor-pointer">
                    {product.name}
                  </h3>
                </Link>

                <p className="text-zinc-400 text-sm leading-relaxed mb-6 flex-1">
                  {product.shortDescription}
                </p>

                {/* Footer Card */}
                <div className="mt-auto pt-6 border-t border-zinc-800/50 flex items-center justify-between">
                  <div className="flex gap-2 flex-wrap">
                    {product.technologies?.slice(0,3).map((tech, i) => (
                      <span key={i} className="text-xs font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                        {tech.name}
                      </span>
                    ))}
                  </div>
                  
                  {product.projectUrl && (
                    <Button asChild size="sm" variant="ghost" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950 p-0 h-auto font-semibold ml-2">
                      <a href={product.projectUrl} target="_blank" rel="noopener noreferrer">
                        Visitar Web <ArrowUpRight className="ml-1 w-4 h-4" />
                      </a>
                    </Button>
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

// ========== Fin de src/components/sections/Products.tsx ========== //