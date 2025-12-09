import React from 'react'
import { Plus } from 'lucide-react'

// Definimos la estructura de una pregunta (coincidirá con el Backend)
export interface FAQItem {
  id?: string | null
  question: string
  answer: string
}

interface FAQProps {
  faqs?: FAQItem[] | null
  title?: string
  subtitle?: string
}

export function FAQ({ 
  faqs, 
  title = "Preguntas Frecuentes",
  subtitle = "Todo lo que necesitas saber sobre nuestra forma de trabajar."
}: FAQProps) {
  
  if (!faqs || faqs.length === 0) return null

  // Generamos el Schema.org para Google (FAQPage)
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <section className="bg-black py-24 relative overflow-hidden border-b border-white/5">
      {/* Inyección de datos para Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="container px-4 mx-auto max-w-3xl">
        <div className="text-center mb-16">
          {/* TÍTULO CON ÚLTIMA PALABRA EN CYAN */}
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
            {title.split(' ').slice(0, -1).join(' ')}{' '}
            <span className="text-cyan-500">
              {title.split(' ').slice(-1)}
            </span>
          </h2>
          <p className="text-lg text-zinc-400">
            {subtitle}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={faq.id || i} 
              className="rounded-2xl border border-zinc-800 bg-zinc-900/20 overflow-hidden transition-all hover:border-zinc-700"
            >
              {/* Usamos el elemento nativo <details> para máxima accesibilidad y SEO */}
              <details className="group [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-6 text-white font-medium hover:bg-zinc-900/40 transition-colors">
                  <span className="text-lg">{faq.question}</span>
                  <span className="shrink-0 rounded-full border border-zinc-700 bg-zinc-800 p-1.5 text-zinc-400 transition duration-300 group-open:-rotate-45 group-open:text-cyan-500 group-open:border-cyan-500/50">
                    <Plus className="h-5 w-5" />
                  </span>
                </summary>

                <div className="px-6 pb-6 pt-2 leading-relaxed text-zinc-400 animate-in slide-in-from-top-2 fade-in duration-200">
                  {faq.answer}
                </div>
              </details>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}