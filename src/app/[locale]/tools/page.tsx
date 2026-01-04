// =============== INICIO ARCHIVO: src/app/[locale]/tools/page.tsx =============== //
import React from 'react'
import { Link } from '@/i18n/routing'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lock, Image, FileText, Database, QrCode, ArrowRight, Shield } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home.hero' })

  return {
    title: t('title'),
    description: t('subtitle'),
  }
}

const toolIcons = {
  vault: Lock,
  'image-optimizer': Image,
  'pdf-studio': FileText,
  'data-station': Database,
  'qr-factory': QrCode,
}

const toolBadges = {
  vault: { label: 'Popular', color: 'bg-cyan-900/50 text-cyan-400 border-cyan-800' },
  'image-optimizer': { label: 'New', color: 'bg-green-900/50 text-green-400 border-green-800' },
  'pdf-studio': { label: 'Pro', color: 'bg-purple-900/50 text-purple-400 border-purple-800' },
  'data-station': { label: 'Dev', color: 'bg-orange-900/50 text-orange-400 border-orange-800' },
  'qr-factory': { label: 'Biz', color: 'bg-blue-900/50 text-blue-400 border-blue-800' },
}

export default async function ToolsIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('tools')
  const tHome = await getTranslations('home')

  const tools = [
    'vault',
    'image-optimizer',
    'pdf-studio',
    'data-station',
    'qr-factory',
  ]

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="container px-4 mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-cyan-950 text-cyan-400 border-cyan-900/50">
            <Shield className="w-3 h-3 mr-2" />
            {tHome('hero.badge')}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            {tHome('ourTools.title')}
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            {tHome('ourTools.subtitle')}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((toolSlug) => {
            // @ts-ignore
            const Icon = toolIcons[toolSlug]
            // @ts-ignore
            const badge = toolBadges[toolSlug]
            
            return (
              <Link key={toolSlug} href={`/tools/${toolSlug}`} className="group block h-full">
                <Card className="h-full border-zinc-800 bg-zinc-900/30 transition-all duration-300 hover:border-cyan-500/50 hover:bg-zinc-900/80 hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-lg bg-zinc-800 text-zinc-400 group-hover:text-cyan-400 group-hover:bg-cyan-950/30 transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      {badge && (
                        <Badge className={`${badge.color} border`}>
                          {badge.label}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl text-white group-hover:text-cyan-400 transition-colors">
                      {/* @ts-ignore - Dynamic key access */}
                      {t(`${toolSlug}.title`)}
                    </CardTitle>
                    <CardDescription className="text-base text-zinc-400 line-clamp-2">
                      {/* @ts-ignore - Dynamic key access */}
                      {t(`${toolSlug}.description`)}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="text-sm text-zinc-500 font-medium mt-auto group-hover:text-cyan-500 transition-colors">
                    {tHome('ourTools.useTool')} <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </CardFooter>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
// =============== FIN ARCHIVO: src/app/[locale]/tools/page.tsx =============== //