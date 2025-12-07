// ========== src/components/layout/Header.tsx ========== //

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* LOGO - Siempre lleva a la home */}
        <Link href="/" className="flex items-center gap-2">
           <span className="text-2xl font-bold tracking-tighter text-white">
            OH<span className="text-cyan-500">CODEX</span>
           </span>
        </Link>

        {/* NAVEGACIÓN DESKTOP */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
          {/* CORRECCIÓN: Añadida la barra '/' antes de '#' para navegar desde cualquier página */}
          <Link href="/#productos" className="hover:text-cyan-400 transition-colors">
            Productos
          </Link>
          {/* Apuntamos Servicios a Metodología si no hay sección específica, o a /#servicios si la creaste */}
          <Link href="/#metodologia" className="hover:text-cyan-400 transition-colors">
            Servicios
          </Link>
          <Link href="/#metodologia" className="hover:text-cyan-400 transition-colors">
            Metodología
          </Link>
        </nav>

        {/* BOTÓN CONTACTO */}
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" className="border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300">
            {/* CORRECCIÓN: Añadida la barra '/' */}
            <Link href="/#contacto">
              Contactar
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

// ========== Fin de src/components/layout/Header.tsx ========== //