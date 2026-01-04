import React from 'react'
import Image from 'next/image'
import type { Media } from '@/payload-types'

interface TrustBarProps {
  logos?: (Media | number)[] | null
  title?: string
}

export function TrustBar({ logos, title = "Tecnologías que impulsan nuestros productos" }: TrustBarProps) {
  // Si no hay logos, no renderizamos nada para no dejar un hueco vacío
  if (!logos || logos.length === 0) return null

  return (
    <section className="border-b border-white/5 bg-black py-10">
      <div className="container px-4 mx-auto">
        <p className="text-center text-sm font-mono text-zinc-600 mb-8 uppercase tracking-widest">
          {title}
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-60 hover:opacity-100 transition-opacity duration-500">
          {logos.map((logo, index) => {
            // Verificación de tipo segura para Payload
            if (typeof logo === 'number') return null
            const url = logo.url
            const alt = logo.alt || 'Logo tecnológico'

            if (!url) return null

            return (
              <div key={index} className="relative h-8 w-auto min-w-[100px] grayscale hover:grayscale-0 transition-all duration-300">
                <Image
                  src={url}
                  alt={alt}
                  height={40}
                  width={120}
                  className="h-full w-auto object-contain object-center brightness-200 invert-0" // Efecto para que se vean bien sobre negro
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}