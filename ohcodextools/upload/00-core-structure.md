# Especificación Técnica: Core Application Structure (OhCodex Tools)

## 1. Visión General

Esta es la estructura base ("Shell") que alojará todas las micro-herramientas. Debe actuar como un contenedor rápido, SEO-friendly y con una navegación fluida entre utilidades.

## 2. Layout Global (`src/app/layout.tsx`)

- **Estilo:** Dark Mode mandatorio (`bg-zinc-950`).
- **Header:**
  - Logo: "OHCodex Tools" (Texto negrita + acento Cyan-500).
  - Nav: Enlaces a "Herramientas", "Blog" (externo), "Sobre Nosotros" (externo).
  - CTA: Botón "Hire Us" o "Visit Studio" que lleva a `ohcodex.com`.
- **Footer:**
  - Links legales (dummy por ahora).
  - Lista de herramientas populares.
  - "Hecho con ❤️ por el equipo de ingeniería de OhCodex".

## 3. Página de Inicio (`src/app/page.tsx`)

- **Hero Section:** Título H1 potente: "Herramientas de Desarrollo y Productividad Gratuitas". Subtítulo centrado en privacidad ("Client-side processing").
- **Tools Grid:** Un grid responsive (1 col móvil, 2 tablet, 3 desktop) mostrando tarjetas (`Card` de shadcn) para cada herramienta definida:
  1.  Vault (Encriptación).
  2.  Pixel Optimizer (Imágenes).
  3.  PDF Studio.
  4.  Data Station.
  5.  QR Factory.
- Cada tarjeta debe tener: Icono Lucide, Título, Descripción breve y Badge (ej: "Popular", "Nuevo").

## 4. Componentes Compartidos (`src/components/shared/`)

- **`AdSlot.tsx`:** Un contenedor `div` con `bg-zinc-900/50`, borde discontinuo y dimensiones estándar (Leaderboard 728x90 o Rectangle 300x250). Debe tener una prop `position` (top, sidebar, bottom). Por ahora muestra un placeholder "Publicidad".
- **`CrossSellBanner.tsx`:** Un componente visualmente atractivo que promueva los servicios de desarrollo de software de OhCodex.

## 5. Navegación

- Estructura de carpetas ya definida: `/tools/[tool-slug]`.
- Implementar `Breadcrumbs` (Migas de pan) en la parte superior de cada herramienta para SEO y UX.

## 6. Stack Base (Recordatorio)

- Next.js 15, Tailwind 4, Shadcn UI, Lucide React.
- Fuente: `Inter` o `Geist Sans`.
