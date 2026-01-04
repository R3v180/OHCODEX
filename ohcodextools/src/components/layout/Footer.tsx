'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Github, Linkedin, Twitter, ExternalLink } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Locale } from '@/i18n'

export function Footer() {
  const t = useTranslations('footer')
  const tCommon = useTranslations('common')
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'es' as Locale

  const currentYear = new Date().getFullYear()

  const tools = [
    { name: t('tools.vault'), href: `/${locale}/tools/vault` },
    { name: t('tools.imageOptimizer.title'), href: `/${locale}/tools/image-optimizer` },
    { name: t('tools.pdfStudio.title'), href: `/${locale}/tools/pdf-studio` },
    { name: t('tools.dataStation.title'), href: `/${locale}/tools/data-station` },
    { name: t('tools.qrFactory.title'), href: `/${locale}/tools/qr-factory` },
  ]

  return (
    <footer className="border-t border-border bg-background pt-16 pb-8">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          {/* BRANDING */}
          <div className="md:col-span-2">
            <Link href={`/${locale}`} className="inline-block mb-6">
              <span className="text-2xl font-bold tracking-tighter text-foreground">
                OHCodex<span className="text-cyan-500">Tools</span>
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              {t('description')}
            </p>

            {/* Redes Sociales */}
            <div className="flex gap-4 mt-6">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* HERRAMIENTAS POPULARES */}
          <div>
            <h3 className="text-foreground font-semibold mb-6">{t('tools')}</h3>
            <ul className="space-y-3">
              {tools.map((tool) => (
                <li key={tool.href}>
                  <Link href={tool.href} className="text-muted-foreground hover:text-cyan-400 transition-colors">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ENLACES EXTERNOS */}
          <div>
            <h3 className="text-foreground font-semibold mb-6">{t('more')}</h3>
            <ul className="space-y-3">
              <li>
                <a href="https://ohcodex.com/blog" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-cyan-400 transition-colors flex items-center gap-1">
                  {tCommon('blog')} <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="https://ohcodex.com/sobre-nosotros" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-cyan-400 transition-colors flex items-center gap-1">
                  {tCommon('aboutUs')} <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <Link href={`/${locale}/aviso-legal`} className="text-muted-foreground hover:text-foreground transition-colors">
                  {tCommon('legal.legalNotice')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/privacidad`} className="text-muted-foreground hover:text-foreground transition-colors">
                  {tCommon('legal.privacy')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/terminos`} className="text-muted-foreground hover:text-foreground transition-colors">
                  {tCommon('legal.terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {currentYear} OHCodex. {tCommon('copyright')}
          </p>
          <p className="text-muted-foreground text-sm">
            {tCommon('madeWith')}
          </p>
        </div>
      </div>
    </footer>
  )
}
