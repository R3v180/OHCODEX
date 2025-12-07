// -----------------------------------------------------------------------------
// Archivo: src/components/sections/Features.tsx
// Versión: 1.0.0
// Descripción: Explica los servicios principales (PWA, SaaS, Integraciones).
// -----------------------------------------------------------------------------

import React from 'react'
import { Smartphone, Zap, Database, ShieldCheck } from 'lucide-react'

const features = [
  {
    icon: Smartphone,
    title: 'Expertos en PWA',
    description: 'Creamos aplicaciones web que se instalan como nativas. Sin Apple Store ni Play Store. Actualizaciones instantáneas y funcionamiento offline (como en Pool-Control).',
  },
  {
    icon: Zap,
    title: 'Rendimiento Extremo',
    description: 'Optimizamos cada milisegundo. Usamos Next.js y arquitecturas modernas para que tu software vuele, vital para herramientas de uso diario como Crono-Job.',
  },
  {
    icon: Database,
    title: 'Integración Total',
    description: 'No creamos islas de datos. Conectamos tu software con ERPs existentes (Sage, A3), pasarelas de pago y hardware IoT.',
  },
  {
    icon: ShieldCheck,
    title: 'Escalabilidad Real',
    description: 'Arquitecturas preparadas para crecer. Desde un MVP para validar ideas hasta sistemas SaaS complejos con miles de usuarios concurrentes.',
  },
]

export function FeaturesSection() {
  return (
    <section id="metodologia" className="bg-black py-24 relative overflow-hidden">
      
      {/* Círculo de fondo decorativo */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[100px]" />

      <div className="container px-4 mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* COLUMNA IZQUIERDA: Texto */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
              Más allá del código: <br />
              <span className="text-cyan-500">Ingeniería de Producto</span>
            </h2>
            <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
              En OHCodex no somos una factoría de software al peso. Actuamos como tu socio tecnológico. 
              Analizamos tu modelo de negocio (como el sistema de puntos de LoyalPyme) y diseñamos la arquitectura técnica perfecta para soportarlo.
            </p>
            
            <div className="flex flex-col gap-4">
               {/* Lista de ventajas con diseño visual */}
               {['Metodología Ágil Real', 'Código Propio (Sin plantillas)', 'Soporte Directo de Ingenieros'].map((item, i) => (
                 <div key={i} className="flex items-center gap-3">
                   <div className="h-2 w-2 rounded-full bg-cyan-500" />
                   <span className="text-zinc-300 font-medium">{item}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* COLUMNA DERECHA: Grid de Iconos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div 
                  key={index} 
                  className="group rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-sm transition-all hover:bg-zinc-800 hover:border-cyan-500/30"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                    <Icon className="h-6 w-6" />
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