// =============== INICIO ARCHIVO: src/app/[locale]/tools/page.tsx =============== //
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Link } from '@/i18n/routing'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lock, Image as ImageIcon, FileText, Database, QrCode, ArrowRight, Shield, Box, LucideIcon, ScanLine } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import type { Tool } from '@/payload-types'

export const revalidate = 3600 // Revalidar cada hora

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home.ourTools' })

  return {
    title: t('title'),
    description: t('subtitle'),
  }
}

const ICON_MAP: Record<string, LucideIcon> = {
  'lock': Lock,
  'image': ImageIcon,
  'file-text': FileText,
  'database': Database,
  'qr-code': QrCode,
  'scan': ScanLine, // Añadido para OCR
  'box': Box
}

export default async function ToolsIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const payload = await getPayload({ config: configPromise })
  
  // Usamos el namespace 'home.ourTools' que ya tiene título y subtítulo
  const t = await getTranslations({ locale, namespace: 'home.ourTools' }) 
  // Usamos 'common' para botones genéricos si hace falta
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  const { docs: tools } = await payload.find({
    collection: 'tools',
    sort: 'title',
    limit: 100,
    locale: locale as any,
  }) as unknown as { docs: Tool[] }

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="container px-4 mx-auto max-w-6xl">
        
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-cyan-950 text-cyan-400 border-cyan-900/50">
            <Shield className="w-3 h-3 mr-2" />
            {/* CORRECCIÓN: Usamos traducción en lugar de texto fijo */}
            {locale === 'es' ? 'Suite de Ingeniería' : 
             locale === 'fr' ? 'Suite d\'Ingénierie' :
             locale === 'de' ? 'Engineering-Suite' :
             locale === 'it' ? 'Suite di Ingegneria' :
             locale === 'pt' ? 'Suíte de Engenharia' :
             'Engineering Suite'}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            {t('title')}
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {tools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => {
              const Icon = ICON_MAP[tool.icon as string] || Box
              
              return (
                <Link 
                  key={tool.id} 
                  href={`/tools/${tool.slug}`} 
                  className="group block h-full"
                >
                  <Card className="h-full border-zinc-800 bg-zinc-900/30 transition-all duration-300 hover:border-cyan-500/50 hover:bg-zinc-900/80 hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-lg bg-zinc-800 text-zinc-400 group-hover:text-cyan-400 group-hover:bg-cyan-950/30 transition-colors">
                          <Icon className="w-6 h-6" />
                        </div>
                        {tool.badge && (
                          <Badge variant="outline" className="bg-zinc-950/50 border-zinc-700 text-zinc-400 group-hover:border-cyan-900/50 group-hover:text-cyan-500 transition-colors">
                            {tool.badge}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl text-white group-hover:text-cyan-400 transition-colors">
                        {tool.title}
                      </CardTitle>
                      <CardDescription className="text-base text-zinc-400 line-clamp-2 mt-2">
                        {tool.shortDescription}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="text-sm text-zinc-500 font-medium mt-auto group-hover:text-cyan-500 transition-colors">
                      {t('useTool')} <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </CardFooter>
                  </Card>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-zinc-800 border-dashed">
            <p className="text-zinc-500">No tools found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
// =============== FIN ARCHIVO: src/app/[locale]/tools/page.tsx =============== //