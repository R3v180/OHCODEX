import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher'
import { getTranslations } from 'next-intl/server'

export async function Header() {
  const t = await getTranslations('common')

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
           <span className="text-2xl font-bold tracking-tighter text-white">
            OH<span className="text-cyan-500">CODEX</span>
           </span>
        </Link>

        {/* NAVEGACIÓN DESKTOP */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
          <Link href="/#productos" className="hover:text-cyan-400 transition-colors">
            {t('products')}
          </Link>
          
          <Link href="/#metodologia" className="hover:text-cyan-400 transition-colors">
            {t('methodology')}
          </Link>

          <Link href="/blog" className="hover:text-cyan-400 transition-colors font-semibold text-zinc-100">
            {t('blog')}
          </Link>
        </nav>

        {/* ZONA DERECHA: Selector + Contacto */}
        <div className="flex items-center gap-4">
          
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          <Button asChild variant="outline" className="border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300">
            <Link href="/#contacto">
              {t('contact')}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}