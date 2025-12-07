// -----------------------------------------------------------------------------
// Archivo: src/components/layout/Footer.tsx
// Versión: 1.0.0 - Diseño inicial Dark Mode
// Descripción: Pie de página global con enlaces de navegación y copyright.
// -----------------------------------------------------------------------------

import React from 'react'
import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 bg-black pt-16 pb-8">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* 1. BRANDING Y DESCRIPCIÓN */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <span className="text-2xl font-bold tracking-tighter text-white">
                OH<span className="text-cyan-500">CODEX</span>
              </span>
            </Link>
            <p className="text-zinc-400 leading-relaxed max-w-sm">
              Ingeniería de software avanzada para empresas que buscan escalabilidad. 
              Especialistas en ecosistemas digitales, SaaS y PWAs de alto rendimiento.
            </p>
          </div>

          {/* 2. ENLACES RÁPIDOS */}
          <div>
            <h3 className="text-white font-semibold mb-6">Navegación</h3>
            <ul className="space-y-4">
              <li>
                <Link href="#productos" className="text-zinc-400 hover:text-cyan-400 transition-colors">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="#metodologia" className="text-zinc-400 hover:text-cyan-400 transition-colors">
                  Metodología
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-zinc-400 hover:text-cyan-400 transition-colors">
                  Área Clientes (Admin)
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. CONTACTO */}
          <div>
            <h3 className="text-white font-semibold mb-6">Contacto</h3>
            <ul className="space-y-4">
              <li>
                <a href="mailto:info@ohcodex.com" className="text-zinc-400 hover:text-cyan-400 transition-colors">
                  info@ohcodex.com
                </a>
              </li>
              <li className="text-zinc-500 text-sm">
                Soporte disponible L-V<br />
                09:00 - 18:00
              </li>
            </ul>
          </div>
        </div>

        {/* 4. BARRA COPYRIGHT */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-sm">
            &copy; {currentYear} OHCodex Software Development. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-sm text-zinc-500">
            <Link href="#" className="hover:text-zinc-300">Aviso Legal</Link>
            <Link href="#" className="hover:text-zinc-300">Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

// -----------------------------------------------------------------------------
// Fin archivo: src/components/layout/Footer.tsx
// -----------------------------------------------------------------------------