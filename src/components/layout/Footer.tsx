// =============== INICIO ARCHIVO: src/components/layout/Footer.tsx =============== //
import React from 'react'
// 👇 CAMBIO IMPORTANTE: Usamos el Link de nuestra configuración i18n
import { Link } from '@/i18n/routing'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Github, Linkedin, Twitter, ExternalLink } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import type { CompanyInfo } from '@/payload-types'

interface FooterProps {
  locale: string
}

export async function Footer({ locale }: FooterProps) {
  const payload = await getPayload({ config: configPromise })
  
  // Cargar traducciones
  const t = await getTranslations('common')
  const tFooter = await getTranslations('footer')
  const tTools = await getTranslations('tools')
  
  // Obtener datos de la empresa desde Payload CMS
  const company = (await payload.findGlobal({
    slug: 'company-info' as any,
    locale: locale as any,
  })) as unknown as CompanyInfo

  const currentYear = new Date().getFullYear()

  // Datos con fallback
  const email = company?.contactEmail || 'info@ohcodex.com'
  const schedule = company?.schedule || 'L-V: 09:00 - 18:00' 
  const description = company?.description || tFooter('description')

  // Lista de herramientas (Rutas base sin locale, el componente Link lo añade)
  const toolsLinks = [
    { name: tTools('vault.title'), href: '/tools/vault' },
    { name: tTools('image-optimizer.title'), href: '/tools/image-optimizer' },
    { name: tTools('pdf-studio.title'), href: '/tools/pdf-studio' },
    { name: tTools('data-station.title'), href: '/tools/data-station' },
    { name: tTools('qr-factory.title'), href: '/tools/qr-factory' },
  ]

  return (
    <footer className="border-t border-white/10 bg-black pt-16 pb-8">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* 1. BRANDING & SOCIAL */}
          <div className="md:col-span-1 lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <span className="text-2xl font-bold tracking-tighter text-white">
                OH<span className="text-cyan-500">CODEX</span>
              </span>
            </Link>
            <p className="text-zinc-400 leading-relaxed text-sm mb-6">
              {description}
            </p>
            
            <div className="flex gap-4">
              {company?.linkedin && (
                <a href={company.linkedin} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {company?.github && (
                <a href={company.github} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
                  <Github className="h-5 w-5" />
                </a>
              )}
              {company?.twitter && (
                <a href={company.twitter} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* 2. HERRAMIENTAS (TOOLS) */}
          <div>
            <h3 className="text-white font-semibold mb-6">{t('tools')}</h3>
            <ul className="space-y-3 text-sm">
              {toolsLinks.map((tool) => (
                <li key={tool.href}>
                  <Link href={tool.href} className="text-zinc-400 hover:text-cyan-400 transition-colors">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. NAVEGACIÓN CORPORATIVA */}
          <div>
            <h3 className="text-white font-semibold mb-6">{tFooter('navigation')}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/#productos" className="text-zinc-400 hover:text-cyan-400 transition-colors">
                  {t('products')}
                </Link>
              </li>
              <li>
                <Link href="/#metodologia" className="text-zinc-400 hover:text-cyan-400 transition-colors">
                  {t('methodology')}
                </Link>
              </li>
              <li>
                <a href="/admin" target="_blank" className="text-zinc-400 hover:text-cyan-400 transition-colors flex items-center gap-1">
                  Admin Panel <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* 4. CONTACTO */}
          <div>
            <h3 className="text-white font-semibold mb-6">{tFooter('contact')}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={`mailto:${email}`} className="text-zinc-400 hover:text-cyan-400 transition-colors">
                  {email}
                </a>
              </li>
              <li className="text-zinc-500 whitespace-pre-line">
                <span className="block text-zinc-300 mb-1">{tFooter('support')}</span>
                {schedule}
              </li>
              {company?.phoneNumber && (
                 <li className="text-zinc-400">
                    {company.phoneNumber}
                 </li>
              )}
            </ul>
          </div>
        </div>

        {/* COPYRIGHT & LEGAL */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-sm text-center md:text-left">
            &copy; {currentYear} OHCodex. {t('copyright')}.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-zinc-500">
            {/* 
               👇 MAGIA AQUÍ: Usamos las claves definidas en routing.ts 
               Next-intl traducirá '/aviso-legal' a '/fr/mentions-legales' automáticamente.
            */}
            <Link href="/aviso-legal" className="hover:text-zinc-300 transition-colors">
              {t('legal.legalNotice')}
            </Link>
            <Link href="/privacidad" className="hover:text-zinc-300 transition-colors">
              {t('legal.privacy')}
            </Link>
            <Link href="/terminos" className="hover:text-zinc-300 transition-colors">
              {t('legal.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
// =============== FIN ARCHIVO: src/components/layout/Footer.tsx =============== //