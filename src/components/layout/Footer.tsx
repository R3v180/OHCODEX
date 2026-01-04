import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Github, Linkedin, Twitter } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import type { CompanyInfo } from '@/payload-types'

interface FooterProps {
  locale?: string
}

export async function Footer({ locale = 'es' }: FooterProps) {
  const payload = await getPayload({ config: configPromise })
  const t = await getTranslations('common')
  const tFooter = await getTranslations('footer')
  
  // Obtenemos datos de la empresa en el idioma correcto
  const company = (await payload.findGlobal({
    slug: 'company-info' as any,
    locale: locale as any,
  })) as unknown as CompanyInfo

  const currentYear = new Date().getFullYear()

  // Valores por defecto
  const email = company?.contactEmail || 'info@ohcodex.com'
  const schedule = company?.schedule || 'L-V: 09:00 - 18:00'
  const description = company?.description || tFooter('description')

  return (
    <footer className="border-t border-white/10 bg-black pt-16 pb-8">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* BRANDING */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <span className="text-2xl font-bold tracking-tighter text-white">
                OH<span className="text-cyan-500">CODEX</span>
              </span>
            </Link>
            <p className="text-zinc-400 leading-relaxed max-w-sm">
              {description}
            </p>
            
            {/* Redes Sociales */}
            <div className="flex gap-4 mt-6">
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

          {/* ENLACES RÁPIDOS */}
          <div>
            <h3 className="text-white font-semibold mb-6">{tFooter('navigation')}</h3>
            <ul className="space-y-4">
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
                <Link href="/admin" className="text-zinc-400 hover:text-cyan-400 transition-colors">
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACTO */}
          <div>
            <h3 className="text-white font-semibold mb-6">{tFooter('contact')}</h3>
            <ul className="space-y-4">
              <li>
                <a href={`mailto:${email}`} className="text-zinc-400 hover:text-cyan-400 transition-colors">
                  {email}
                </a>
              </li>
              <li className="text-zinc-500 text-sm whitespace-pre-line">
                {tFooter('support')}<br />
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
          <p className="text-zinc-500 text-sm">
            &copy; {currentYear} OHCodex. {t('copyright')}.
          </p>
          <div className="flex gap-6 text-sm text-zinc-500">
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