"use client" // 👈 ESTA ES LA LÍNEA QUE FALTA

import React from 'react'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const pathname = usePathname()
  // Extraer el idioma de la URL (ej: /es/tools -> 'es')
  const locale = pathname.split('/')[1] || 'es'

  return (
    <nav
      className={cn('flex items-center space-x-2 text-sm text-muted-foreground py-4', className)}
      aria-label="Breadcrumb"
    >
      <Link
        href={`/${locale}`}
        className="hover:text-foreground transition-colors flex items-center"
        aria-label="Home"
      >
        <Home className="w-4 h-4" />
      </Link>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
          {item.href ? (
            <Link
              href={`/${locale}${item.href}`}
              className={cn(
                'hover:text-foreground transition-colors',
                index === items.length - 1 && 'text-foreground font-medium'
              )}
            >
              {item.label}
            </Link>
          ) : (
            <span className={cn(index === items.length - 1 && 'text-foreground font-medium')}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}