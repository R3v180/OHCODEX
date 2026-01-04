import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lock, Image, FileText, Database, QrCode, ArrowRight, Shield, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'

const toolIcons = {
  vault: Lock,
  'image-optimizer': Image,
  'pdf-studio': FileText,
  'data-station': Database,
  'qr-factory': QrCode,
}

const toolBadges = {
  vault: { label: 'Popular', color: 'bg-cyan-600' },
  'image-optimizer': { label: 'New', color: 'bg-green-600' },
  'pdf-studio': { label: 'Pro', color: 'bg-purple-600' },
}

export default function HomePage() {
  const t = useTranslations()

  const tools = [
    'vault',
    'image-optimizer',
    'pdf-studio',
    'data-station',
    'qr-factory',
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[60vh] py-20 px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent" />
          <div className="absolute left-0 right-0 top-0 m-auto h-[310px] w-[310px] rounded-full bg-cyan-500 opacity-20 blur-[100px]" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <Badge className="mb-6 bg-cyan-600/20 text-cyan-400 border-cyan-500/30 hover:bg-cyan-600/30">
            <Shield className="w-3 h-3 mr-2" />
            {t('home.hero.badge')}
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-foreground">
            {t('home.hero.title')}
          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            {t('home.hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-cyan-600 hover:bg-cyan-500 text-white text-lg px-8" asChild>
              <Link href="#tools">
                {t('home.hero.exploreTools')} <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <a href="https://ohcodex.com" target="_blank" rel="noopener noreferrer">
                {t('home.hero.visitStudio')}
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              {t('home.ourTools.title')}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t('home.ourTools.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((toolSlug) => {
              const Icon = toolIcons[toolSlug as keyof typeof toolIcons]
              const badge = toolBadges[toolSlug as keyof typeof toolBadges]
              return (
                <Link key={toolSlug} href={`/tools/${toolSlug}`}>
                  <Card className="h-full transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 hover:border-cyan-500/50 hover:-translate-y-1 bg-card border-border">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400">
                          <Icon className="w-6 h-6" />
                        </div>
                        {badge && (
                          <Badge className={badge.color}>
                            {badge.label}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl">
                        {t(`tools.${toolSlug}.title`)}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {t(`tools.${toolSlug}.description`)}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="text-sm text-cyan-400 flex items-center font-medium">
                      {t('home.ourTools.useTool')} <ArrowRight className="ml-2 w-4 h-4" />
                    </CardFooter>
                  </Card>
                </Link>
              )
            })}
          </div>

          {/* Feature Highlight */}
          <div className="mt-16 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl p-8 border border-cyan-500/20">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="p-4 rounded-full bg-cyan-500/20 text-cyan-400">
                <Zap className="w-8 h-8" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2 text-foreground">
                  {t('home.features.whyOhcodex')}
                </h3>
                <p className="text-muted-foreground">
                  {t('home.features.description')}
                </p>
              </div>
              <Button size="lg" variant="outline" className="shrink-0" asChild>
                <a href="https://ohcodex.com" target="_blank" rel="noopener noreferrer">
                  {t('home.features.knowOhcodex')}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
