import React from 'react'
import Image from 'next/image'
import { Quote } from 'lucide-react'
import type { Media } from '@/payload-types'

// Definimos la estructura de un testimonio (coincidirá con el Backend luego)
export interface TestimonialItem {
  id?: string | null
  authorName: string
  authorRole: string
  companyName: string
  quote: string
  authorImage?: (Media | number) | null
}

interface TestimonialsProps {
  testimonials?: TestimonialItem[] | null
  title?: string
  subtitle?: string
}

export function Testimonials({ 
  testimonials, 
  title = "Confianza que se construye con código",
  subtitle = "Lo que dicen los líderes técnicos que ya escalan con nuestra arquitectura."
}: TestimonialsProps) {
  
  if (!testimonials || testimonials.length === 0) return null

  // Generamos el Schema.org para Google (Review Snippet)
  const reviewsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'OHCodex',
    review: testimonials.map((t) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: t.authorName,
      },
      reviewBody: t.quote,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5', // Asumimos 5 estrellas para testimonios destacados
        bestRating: '5',
      },
    })),
  }

  return (
    <section className="bg-black py-24 border-b border-white/5 relative overflow-hidden">
      {/* Inyección de datos para Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsJsonLd) }}
      />

      {/* Decoración de fondo */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-20 h-[400px] w-[400px] rounded-full bg-cyan-900/10 blur-[100px] pointer-events-none" />

      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
            {title}
          </h2>
          <p className="text-lg text-zinc-400">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item, i) => {
            const imageUrl = typeof item.authorImage === 'object' && item.authorImage?.url 
              ? item.authorImage.url 
              : null

            return (
              <div 
                key={item.id || i} 
                className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 hover:border-cyan-500/20 transition-colors"
              >
                <div>
                  <Quote className="h-8 w-8 text-cyan-500/50 mb-6" />
                  {/* CORRECCIÓN AQUÍ: Usamos &quot; en lugar de " */}
                  <p className="text-zinc-300 text-lg leading-relaxed italic mb-8">
                    &quot;{item.quote}&quot;
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 shrink-0 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700">
                    {imageUrl ? (
                      <Image 
                        src={imageUrl} 
                        alt={item.authorName} 
                        fill 
                        className="object-cover" 
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-zinc-500 font-bold text-xl">
                        {item.authorName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      {item.authorName}
                    </h4>
                    <p className="text-zinc-500 text-xs">
                      {item.authorRole} en <span className="text-cyan-500">{item.companyName}</span>
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}