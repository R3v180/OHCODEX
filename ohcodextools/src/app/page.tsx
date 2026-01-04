import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lock, Image, FileText, Database, QrCode, ArrowRight, Shield, Zap } from 'lucide-react'

const tools = [
  {
    slug: 'vault',
    title: 'Vault',
    description: 'Encriptación AES-256 para texto y archivos. Zero-Knowledge, todo en tu navegador.',
    icon: Lock,
    badge: 'Popular',
    badgeColor: 'bg-cyan-600'
  },
  {
    slug: 'image-optimizer',
    title: 'Pixel Optimizer',
    description: 'Comprime, redimensiona, añade marca de agua y convierte a WebP por lotes.',
    icon: Image,
    badge: 'Nuevo',
    badgeColor: 'bg-green-600'
  },
  {
    slug: 'pdf-studio',
    title: 'PDF Studio',
    description: 'Unir, dividir, firmar y comprimir PDFs en una interfaz profesional.',
    icon: FileText,
    badge: 'Pro',
    badgeColor: 'bg-purple-600'
  },
  {
    slug: 'data-station',
    title: 'Data Station',
    description: 'Formatea JSON, convierte CSV/XML, valida SQL y compara código diff.',
    icon: Database,
    badge: null,
    badgeColor: ''
  },
  {
    slug: 'qr-factory',
    title: 'QR Factory',
    description: 'Genera QRs personalizados con logo y códigos de barras EAN-13, UPC.',
    icon: QrCode,
    badge: null,
    badgeColor: ''
  },
]

export default function HomePage() {
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
            100% Client-Side Processing
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-foreground">
            Herramientas de Desarrollo y{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Productividad Gratuitas
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Suite de herramientas profesionales que se ejecutan 100% en tu navegador.
            Máxima privacidad, cero costes de servidor, sin límites.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-cyan-600 hover:bg-cyan-500 text-white text-lg px-8" asChild>
              <Link href="#tools">
                Explorar Herramientas <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <a href="https://ohcodex.com" target="_blank" rel="noopener noreferrer">
                Visitar Studio
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
              Nuestras Herramientas
            </h2>
            <p className="text-muted-foreground text-lg">
              Todo el procesamiento ocurre en tu navegador. Tus datos nunca salen de tu dispositivo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => {
              const Icon = tool.icon
              return (
                <Link key={tool.slug} href={`/tools/${tool.slug}`}>
                  <Card className="h-full transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 hover:border-cyan-500/50 hover:-translate-y-1 bg-card border-border">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400">
                          <Icon className="w-6 h-6" />
                        </div>
                        {tool.badge && (
                          <Badge className={tool.badgeColor}>
                            {tool.badge}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl">{tool.title}</CardTitle>
                      <CardDescription className="text-base">
                        {tool.description}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="text-sm text-cyan-400 flex items-center font-medium">
                      Usar herramienta <ArrowRight className="ml-2 w-4 h-4" />
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
                  ¿Por qué OHCodex Tools?
                </h3>
                <p className="text-muted-foreground">
                  Nuestras herramientas se ejecutan completamente en el cliente usando APIs modernas del navegador.
                  Esto significa privacidad absoluta, carga instantánea y cero costes de infraestructura.
                </p>
              </div>
              <Button size="lg" variant="outline" className="shrink-0" asChild>
                <a href="https://ohcodex.com" target="_blank" rel="noopener noreferrer">
                  Conoce OHCodex
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
