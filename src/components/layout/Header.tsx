'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher'

export function Header() {
  const t = useTranslations('common')
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Extraer el locale actual de la URL (ej: /es/blog -> 'es')
  const locale = pathname.split('/')[1] || 'es'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { 
      name: t('home'), 
      href: `/${locale}`,
      external: false 
    },
    { 
      name: t('tools'), 
      href: `/${locale}/tools`, // <--- CAMBIO: Ahora lleva a la página dedicada
      external: false 
    },
    { 
      name: t('blog'), 
      href: `/${locale}/blog`, 
      external: false 
    },
    { 
      name: t('buttons.readArticle').replace('Leer artículo', 'Portfolio'), 
      href: `/${locale}/#productos`, 
      external: false 
    }
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-white/5 bg-black/50 backdrop-blur-xl transition-all duration-300 ${
        isScrolled ? 'shadow-lg shadow-cyan-900/10' : ''
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={`/${locale}`} className="flex items-center space-x-2 group">
              <span className="text-2xl font-bold tracking-tighter text-white group-hover:text-cyan-500 transition-colors">
                OH<span className="text-cyan-500 group-hover:text-white transition-colors">CODEX</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-zinc-400 hover:text-cyan-400 transition-colors"
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Separador */}
            <div className="h-4 w-[1px] bg-zinc-800 mx-2"></div>
            
            {/* Selector de Idioma */}
            <LanguageSwitcher />

            <Button className="bg-white text-black hover:bg-zinc-200 font-semibold ml-2" asChild>
              <Link href={`/${locale}/#contacto`}>
                {t('contact')}
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-zinc-800 bg-black absolute left-0 right-0 px-4 shadow-xl">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-3 text-base font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
                target={item.external ? "_blank" : undefined}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4">
              <Button className="w-full bg-white text-black hover:bg-zinc-200" asChild>
                <Link href={`/${locale}/#contacto`} onClick={() => setMobileMenuOpen(false)}>
                  {t('contact')}
                </Link>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}