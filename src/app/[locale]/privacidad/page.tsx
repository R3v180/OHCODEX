import React from 'react'
import { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { LegalText } from '@/payload-types'
import { getTranslations } from 'next-intl/server'

export const revalidate = 86400

type Args = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common.legal' })

  return {
    title: t('privacy'),
    description: locale === 'en' 
      ? 'Privacy Policy and data protection at OHCodex.' 
      : 'Política de Privacidad y protección de datos de OHCodex.',
    robots: {
      index: false,
      follow: true,
    },
  }
}

// --- Helper para renderizar texto enriquecido (Lexical) ---
const SerializeLexical = ({ nodes }: { nodes: any[] }) => {
  if (!nodes || !Array.isArray(nodes)) return null
  return (
    <>
      {nodes.map((node, i) => {
        if (node.type === 'text') {
          let text = <span key={i}>{node.text}</span>
          if (node.format & 1) text = <strong key={i} className="font-bold text-white">{text}</strong>
          if (node.format & 2) text = <em key={i} className="italic">{text}</em>
          if (node.format & 8) text = <u key={i} className="underline">{text}</u>
          return text
        }
        if (!node) return null
        switch (node.type) {
          case 'heading':
            const Tag = node.tag as any
            return (
              <Tag key={i} className="text-xl font-semibold text-white mt-8 mb-4 block">
                <SerializeLexical nodes={node.children} />
              </Tag>
            )
          case 'paragraph':
            return <p key={i} className="mb-4 leading-relaxed text-zinc-400"><SerializeLexical nodes={node.children} /></p>
          case 'list':
            const ListTag = node.listType === 'number' ? 'ol' : 'ul'
            return <ListTag key={i} className={`mb-4 pl-6 ${node.listType === 'number' ? 'list-decimal' : 'list-disc'} text-zinc-400`}><SerializeLexical nodes={node.children} /></ListTag>
          case 'listitem':
            return <li key={i} className="mb-1"><SerializeLexical nodes={node.children} /></li>
          case 'link':
            return <a key={i} href={node.fields.url} className="text-cyan-400 hover:underline"><SerializeLexical nodes={node.children} /></a>
          default:
            return <SerializeLexical key={i} nodes={node.children} />
        }
      })}
    </>
  )
}

export default async function PrivacidadPage({ params }: Args) {
  const { locale } = await params
  const payload = await getPayload({ config: configPromise })
  
  // 1. Cargar traducciones para elementos estáticos
  const t = await getTranslations('common.legal')
  
  // 2. Consultar la global pasando el locale para obtener el contenido de la BD
  const legal = (await payload.findGlobal({
    slug: 'legal-texts' as any,
    locale: locale as any, 
  })) as unknown as LegalText

  return (
    <div className="bg-black min-h-screen py-24">
      <div className="container px-4 mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-white mb-8">
          {t('privacy')}
        </h1>
        <div className="prose prose-invert prose-zinc max-w-none">
          {/* CORRECCIÓN: Usamos camelCase 'privacyPolicy' según payload-types.ts */}
          {legal?.privacyPolicy && (legal.privacyPolicy as any).root ? (
            <SerializeLexical nodes={(legal.privacyPolicy as any).root.children} />
          ) : (
            <p className="text-zinc-500 italic">
              {locale === 'en' ? 'Privacy Policy content pending translation...' : 'Política de Privacidad pendiente de traducción...'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}