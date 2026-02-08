// =============== INICIO ARCHIVO: src/app/[locale]/tools/page.tsx =============== //
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Link } from '@/i18n/routing'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lock, Image as ImageIcon, FileText, Database, QrCode, ArrowRight, Shield, Box, LucideIcon, ScanLine, Code, Palette, Key, KeyRound } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import type { Tool } from '@/payload-types'

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home.ourTools' })

  return {
    title: t('title'),
    description: t('subtitle'),
  }
}

// Mapa de Iconos
const ICON_MAP: Record<string, LucideIcon> = {
  'lock': Lock,
  'image': ImageIcon,
  'file-text': FileText,
  'database': Database,
  'qr-code': QrCode,
  'scan': ScanLine,
  'code': Code,
  'palette': Palette,
  'key': Key,
  'key-round': KeyRound,
  'box': Box
}

// Estilos de Badges (Copiados de la Landing Page para consistencia)
const BADGE_STYLES: Record<string, string> = {
  // Herramientas originales
  'vault': 'bg-cyan-900/50 text-cyan-400 border-cyan-800',
  'image-optimizer': 'bg-green-900/50 text-green-400 border-green-800',
  'pdf-studio': 'bg-purple-900/50 text-purple-400 border-purple-800',
  'data-station': 'bg-blue-900/50 text-blue-400 border-blue-800',
  'qr-factory': 'bg-pink-900/50 text-pink-400 border-pink-800',
  'ocr-vision': 'bg-amber-900/50 text-amber-400 border-amber-800',
  // Nuevas herramientas
  'password-gen': 'bg-rose-900/50 text-rose-400 border-rose-800',       // Rojo - Seguridad
  'base64': 'bg-orange-900/50 text-orange-400 border-orange-800',              // Naranja - Codificación
  'jwt-decoder': 'bg-indigo-900/50 text-indigo-400 border-indigo-800',         // Índigo - Web/Token
  'css-minifier': 'bg-emerald-900/50 text-emerald-400 border-emerald-800',     // Esmeralda - CSS
  'regex-tester': 'bg-fuchsia-900/50 text-fuchsia-400 border-fuchsia-800',     // Fucsia - Regex
  'color-palette': 'bg-violet-900/50 text-violet-400 border-violet-800',       // Violeta - Colores
  'default': 'bg-zinc-800 text-zinc-400 border-zinc-700'
}

export default async function ToolsIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const payload = await getPayload({ config: configPromise })
  
  // Traducciones
  const t = await getTranslations({ locale, namespace: 'home.ourTools' }) 

  // Consultar todas las herramientas
  const { docs: tools } = await payload.find({
    collection: 'tools',
    sort: 'title',
    limit: 100,
    locale: locale as any,
  }) as unknown as { docs: Tool[] }

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      
      {/* Fondo sutil idéntico a la Home */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-50" />

      <div className="container px-4 mx-auto max-w-6xl">
        
        {/* Cabecera */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-cyan-950/50 text-cyan-400 border-cyan-900/50 px-4 py-1.5 text-sm backdrop-blur-sm">
            <Shield className="w-3.5 h-3.5 mr-2" />
            {t('title')} 
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-white">
            {t('title')}
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Grid de Herramientas (Estilo Landing Page) */}
        {tools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => {
              const iconKey = (tool.icon as string) || 'box'
              const Icon = ICON_MAP[iconKey] || Box
              const badgeStyle = BADGE_STYLES[tool.slug] || BADGE_STYLES['default']
              
              return (
                <Link 
                  key={tool.id} 
                  href={`/tools/${tool.slug}`} 
                  className="group block h-full"
                >
                  <Card className="h-full border-zinc-800 bg-black/40 transition-all duration-300 hover:border-cyan-500/50 hover:bg-zinc-900/80 hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        {/* Icono: Gris por defecto -> Cyan al hover */}
                        <div className="p-3 rounded-lg bg-zinc-800 text-zinc-400 group-hover:text-cyan-400 group-hover:bg-cyan-950/30 transition-colors">
                          <Icon className="w-6 h-6" />
                        </div>
                        {/* Badge de color específico */}
                        {tool.badge && (
                          <Badge className={`${badgeStyle} border`}>
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
          <div className="text-center py-24 bg-zinc-900/20 rounded-3xl border border-zinc-800 border-dashed">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 mb-4">
               <Box className="h-8 w-8 text-zinc-600" />
            </div>
            <p className="text-zinc-500 text-lg">No tools found available.</p>
          </div>
        )}
      </div>
    </div>
  )
}
// =============== FIN ARCHIVO: src/app/[locale]/tools/page.tsx =============== //