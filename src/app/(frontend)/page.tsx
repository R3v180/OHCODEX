// ========== src/app/(frontend)/page.tsx ========== //

// -----------------------------------------------------------------------------
// Archivo: src/app/(frontend)/page.tsx
// Versión: 1.4.0 - Integración Final (Hero + Productos + Features + Contacto)
// Descripción: Página de inicio completa. Orquesta todas las secciones del sitio.
// -----------------------------------------------------------------------------

import React from 'react'
import { Hero } from '@/components/sections/Hero'
import { ProductsSection } from '@/components/sections/Products'
import { FeaturesSection } from '@/components/sections/Features'
import { ContactSection } from '@/components/sections/Contact'

export default function HomePage() {
  return (
    <>
      {/* 1. HERO SECTION: Bienvenida y propuesta de valor */}
      <Hero />

      {/* 2. PRODUCTOS: Listado dinámico desde Payload CMS */}
      <ProductsSection />

      {/* 3. METODOLOGÍA: Explicación de servicios PWA/SaaS */}
      <FeaturesSection />
      
      {/* 4. CONTACTO: Formulario de captación de leads */}
      <ContactSection />
    </>
  )
}

// -----------------------------------------------------------------------------
// Fin archivo: src/app/(frontend)/page.tsx
// -----------------------------------------------------------------------------

// ========== Fin de src/app/(frontend)/page.tsx ========== //