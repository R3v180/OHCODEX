'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Locale } from '@/i18n'

export function Header() {
  const t = useTranslations('common')
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Extract locale from pathname
  const locale = pathname.split('/')[1] || 'es' as Locale

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: t('tools'), href: `/${locale}` },
    { name: t('blog'), href: 'https://ohcodex.com/blog', external: true },
    { name: t('aboutUs'), href: 'https://ohcodex.com/sobre-nosotros', external: true },
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-border bg-background/50 backdrop-blur-xl supports-[backdrop-filter]:bg-background/20 transition-all duration-300 ${
        isScrolled ? 'shadow-lg' : ''
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={`/${locale}`} className="flex items-center space-x-2">
              <span className="text-2xl font-bold tracking-tighter text-foreground">
                OHCodex<span className="text-cyan-500">Tools</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              item.external ? (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
                >
                  {item.name}
                </Link>
              )
            ))}
            <Button className="ml-4 bg-cyan-600 hover:bg-cyan-500 text-white" asChild>
              <a href="https://ohcodex.com" target="_blank" rel="noopener noreferrer">
                {t('visitStudio')}
              </a>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-foreground hover:bg-accent"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-border">
            {navItems.map((item) => (
              item.external ? (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )
            ))}
            <div className="pt-2">
              <Button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white" asChild>
                <a href="https://ohcodex.com" target="_blank" rel="noopener noreferrer">
                  {t('visitStudio')}
                </a>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
