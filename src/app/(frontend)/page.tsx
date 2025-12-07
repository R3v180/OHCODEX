// -----------------------------------------------------------------------------
// Archivo: src/app/(frontend)/page.tsx
// Versión: 1.3.0 - Integración de FeaturesSection
// Descripción: Página de inicio pública. Orquesta las secciones: Hero, Productos y Metodología.
// -----------------------------------------------------------------------------

import React from 'react'
import { Hero } from '@/components/sections/Hero'
import { ProductsSection } from '@/components/sections/Products'
import { FeaturesSection } from '@/components/sections/Features'

export default function HomePage() {
  return (
    <>
      {/* 1. HERO SECTION: Bienvenida y propuesta de valor */}
      <Hero />

      {/* 2. PRODUCTOS: Listado dinámico desde Payload CMS */}
      <ProductsSection />

      {/* 3. METODOLOGÍA: Explicación de servicios PWA/SaaS */}
      <FeaturesSection />
      
      {/* Próximamente: <ContactForm /> */}
    </>
  )
}

// -----------------------------------------------------------------------------
// Fin archivo: src/app/(frontend)/page.tsx
// -----------------------------------------------------------------------------