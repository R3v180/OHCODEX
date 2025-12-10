import React from 'react'
import { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { LegalText } from '@/payload-types'

// ✅ CAMBIO: De 'force-dynamic' a ISR (mucho más rápido)
export const revalidate = 86400 // 1 hora (el legal cambia poco)

export const metadata: Metadata = {
  title: 'Aviso Legal',
  description: 'Información legal y titularidad del sitio web OHCodex.',
  robots: {
    index: false, // Opcional: A veces no interesa que Google indexe el texto legal para no "diluir" las keywords importantes, pero puedes dejarlo en true si prefieres.
    follow: true,
  },
}

// ... (El resto del componente SerializeLexical y AvisoLegalPage se queda igual)
// Solo asegúrate de copiar el componente completo si no quieres editar solo la cabecera.
// Aquí te dejo el componente completo para copiar/pegar y no fallar:

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
            return <Tag key={i} className="text-xl font-semibold text-white mt-8 mb-4 block"><SerializeLexical nodes={node.children} /></Tag>
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

export default async function AvisoLegalPage() {
  const payload = await getPayload({ config: configPromise })
  const legal = (await payload.findGlobal({
    slug: 'legal-texts' as any,
  })) as unknown as LegalText

  return (
    <div className="bg-black min-h-screen py-24">
      <div className="container px-4 mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-white mb-8">Aviso Legal</h1>
        <div className="prose prose-invert prose-zinc max-w-none">
          {legal?.legalNotice && 'root' in legal.legalNotice ? (
            <SerializeLexical nodes={(legal.legalNotice.root as any).children} />
          ) : (
            <p className="text-zinc-500 italic">Contenido pendiente...</p>
          )}
        </div>
      </div>
    </div>
  )
}