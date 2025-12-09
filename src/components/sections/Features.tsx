import React from 'react'
import { Smartphone, Zap, Database, ShieldCheck, LucideIcon, Code2, Users, Rocket } from 'lucide-react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { LandingPage } from '@/payload-types'

// Mapa para traducir el texto del CMS al componente Icono real
const iconMap: Record<string, LucideIcon> = {
  smartphone: Smartphone,
  zap: Zap,
  database: Database,
  shield: ShieldCheck,
  code: Code2,
  users: Users,
  rocket: Rocket
}

export async function FeaturesSection() {
  const payload = await getPayload({ config: configPromise })
  
  // 1. Obtener datos globales con tipado seguro
  const landing = (await payload.findGlobal({
    slug: 'landing-page' as any,
  })) as unknown as LandingPage

  // 2. Configuración Visual
  const align = landing.featuresAlign || 'left' // 'left' | 'center'
  
  // Textos con Fallback
  const title = landing?.featuresTitle || 'Más allá del código: Ingeniería de Producto'
  const description = landing?.featuresDescription || 'En OHCodex no somos una factoría de software al peso. Actuamos como tu socio tecnológico.'
  
  // Lista de Características (Fallback si está vacío)
  const featuresList = landing?.featuresList || [
    {
      icon: 'smartphone',
      title: 'Expertos en PWA',
      description: 'Creamos aplicaciones web que se instalan como nativas. Sin Apple Store ni Play Store.',
    },
    {
      icon: 'zap',
      title: 'Rendimiento Extremo',
      description: 'Optimizamos cada milisegundo. Usamos Next.js y arquitecturas modernas.',
    },
    {
      icon: 'database',
      title: 'Integración Total',
      description: 'Conectamos tu software con ERPs existentes, pasarelas de pago y hardware IoT.',
    },
    {
      icon: 'shield',
      title: 'Escalabilidad Real',
      description: 'Arquitecturas preparadas para crecer. Desde un MVP hasta sistemas SaaS complejos.',
    },
  ]

  // Lógica para el Título (Última palabra en Cyan)
  const titleWords = title.split(' ')
  const titleMain = titleWords.slice(0, -1).join(' ')
  const titleLast = titleWords.slice(-1)

  return (
    <section id="metodologia" className="bg-black py-24 relative overflow-hidden border-b border-white/5">
      
      {/* Decoración de fondo */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />

      <div className="container px-4 mx-auto relative z-10">
        
        {/* --- LAYOUT CONDICIONAL --- */}
        <div className={align === 'center' ? 'flex flex-col items-center' : 'grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'}>
          
          {/* BLOQUE DE TEXTO */}
          <div className={align === 'center' ? 'text-center max-w-3xl mb-16 mx-auto' : 'text-left'}>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
              {titleMain} <span className="text-cyan-500">{titleLast}</span>
            </h2>
            <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
              {description}
            </p>
            
            {/* --- LISTA DE VENTAJAS ADAPTATIVA --- */}
            {/* Se muestra siempre, pero cambia de forma según la alineación */}
            <div className={`flex mt-8 ${align === 'center' ? 'flex-wrap justify-center gap-3' : 'flex-col gap-4'}`}>
               {['Metodología Ágil Real', 'Código Propio (Sin plantillas)', 'Soporte Directo de Ingenieros'].map((item, i) => (
                 <div 
                   key={i} 
                   className={`flex items-center gap-3 ${
                     align === 'center' 
                       ? 'bg-zinc-900/50 border border-zinc-800 px-4 py-2 rounded-full backdrop-blur-sm hover:border-cyan-500/30 transition-colors' 
                       : ''
                   }`}
                 >
                   <div className="h-2 w-2 rounded-full bg-cyan-500 shrink-0" />
                   <span className="text-zinc-300 font-medium text-sm">{item}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* GRID DE ICONOS */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${align === 'center' ? 'w-full lg:grid-cols-4' : ''}`}>
            {featuresList.map((feature, index) => {
              // Resolver el icono desde el mapa (Tipado seguro)
              const iconKey = (feature.icon as string) || 'zap'
              const IconComponent = iconMap[iconKey] || Zap
              
              return (
                <div 
                  key={index} 
                  className="group rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-sm transition-all hover:bg-zinc-800 hover:border-cyan-500/30 h-full"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </section>
  )
}