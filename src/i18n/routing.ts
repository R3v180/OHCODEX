// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // Lista de idiomas soportados
  locales: ['es', 'en', 'fr', 'de', 'it', 'pt'],
  
  // Idioma por defecto si no se detecta otro
  defaultLocale: 'es',
  
  // Siempre mostrar el prefijo del idioma en la URL para consistencia SEO
  localePrefix: 'always',

  // MAPA DE RUTAS TRADUCIDAS (Pathnames)
  pathnames: {
    '/': '/',
    
    // --- BLOG ---
    // 1. Índice principal
    '/blog': {
      es: '/blog',
      en: '/blog',
      fr: '/blog',
      de: '/blog',
      it: '/blog',
      pt: '/blog'
    },
    
    // 2. Paginación del índice general (SEO: permite que Google rastree todo el histórico)
    '/blog/page/[pageNumber]': {
      es: '/blog/pagina/[pageNumber]',
      en: '/blog/page/[pageNumber]',
      fr: '/blog/page/[pageNumber]',
      de: '/blog/seite/[pageNumber]',
      it: '/blog/pagina/[pageNumber]',
      pt: '/blog/pagina/[pageNumber]'
    },

    // 3. Listado por Categoría (SEO Semántico: Silos de contenido)
    '/blog/category/[category]': {
      es: '/blog/categoria/[category]',
      en: '/blog/category/[category]',
      fr: '/blog/categorie/[category]',
      de: '/blog/kategorie/[category]',
      it: '/blog/categoria/[category]',
      pt: '/blog/categoria/[category]'
    },

    // 4. Paginación dentro de una categoría
    '/blog/category/[category]/[pageNumber]': {
      es: '/blog/categoria/[category]/[pageNumber]',
      en: '/blog/category/[category]/[pageNumber]',
      fr: '/blog/categorie/[category]/[pageNumber]',
      de: '/blog/kategorie/[category]/[pageNumber]',
      it: '/blog/categoria/[category]/[pageNumber]',
      pt: '/blog/categoria/[category]/[pageNumber]'
    },

    // 5. Detalle del artículo (Ya usa el slug del título)
    '/blog/[slug]': {
      es: '/blog/[slug]',
      en: '/blog/[slug]',
      fr: '/blog/[slug]',
      de: '/blog/[slug]',
      it: '/blog/[slug]',
      pt: '/blog/[slug]'
    },

    // --- HERRAMIENTAS (TOOLS) ---
    '/tools': {
      es: '/herramientas',
      en: '/tools',
      fr: '/outils',
      de: '/werkzeuge',
      it: '/strumenti',
      pt: '/ferramentas'
    },
    '/tools/[slug]': {
      es: '/herramientas/[slug]',
      en: '/tools/[slug]',
      fr: '/outils/[slug]',
      de: '/werkzeuge/[slug]',
      it: '/strumenti/[slug]',
      pt: '/ferramentas/[slug]'
    },

    // --- PRODUCTOS ---
    '/products/[slug]': {
      es: '/productos/[slug]',
      en: '/products/[slug]',
      fr: '/produits/[slug]',
      de: '/produkte/[slug]',
      it: '/prodotti/[slug]',
      pt: '/produtos/[slug]'
    },

    // --- PÁGINAS LEGALES ---
    '/aviso-legal': {
      es: '/aviso-legal',
      en: '/legal-notice',
      fr: '/mentions-legales',
      de: '/impressum',
      it: '/note-legali',
      pt: '/aviso-legal'
    },
    '/privacidad': {
      es: '/privacidad',
      en: '/privacy',
      fr: '/confidentialite',
      de: '/datenschutz',
      it: '/privacy',
      pt: '/privacidade'
    },
    '/terminos': {
      es: '/terminos',
      en: '/terms',
      fr: '/conditions',
      de: '/agb',
      it: '/termini',
      pt: '/termos'
    }
  }
});

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation(routing);
export const locales = routing.locales;
export const defaultLocale = routing.defaultLocale;