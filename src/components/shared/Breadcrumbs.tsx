// =============== INICIO ARCHIVO: src/components/shared/Breadcrumbs.tsx =============== //
"use client"

import React from 'react'
// 👇 CAMBIO: Usamos el Link inteligente
import { Link } from '@/i18n/routing'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'
// Ya no necesitamos usePathname para extraer el locale manualmente

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      className={cn('flex items-center space-x-2 text-sm text-muted-foreground py-4', className)}
      aria-label="Breadcrumb"
    >
      <Link
        href="/"
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
              // 👇 CAMBIO CRÍTICO: Pasamos la ruta base (ej: '/tools') directamente.
              // El componente Link se encarga de añadir el idioma y traducir la ruta (ej: '/fr/outils').
              href={item.href}
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
// =============== FIN ARCHIVO: src/components/shared/Breadcrumbs.tsx =============== //