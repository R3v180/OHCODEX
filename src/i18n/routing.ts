// =============== INICIO ARCHIVO: src/i18n/routing.ts =============== //
import { defineRouting } from 'next-intl/routing';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // Lista de idiomas soportados
  locales: ['es', 'en', 'fr', 'de', 'it', 'pt'],
  
  // Idioma por defecto si no se detecta otro
  defaultLocale: 'es',
  
  // Siempre mostrar el prefijo del idioma en la URL (ej: /es/blog) para consistencia SEO
  localePrefix: 'always',

  // 👇 MAPA DE RUTAS TRADUCIDAS (Pathnames)
  // Define cómo se ve la URL en el navegador para cada idioma
  pathnames: {
    '/': '/',
    
    // --- BLOG ---
    '/blog': {
      es: '/blog',
      en: '/blog',
      fr: '/blog',
      de: '/blog',
      it: '/blog',
      pt: '/blog'
    },
    '/blog/[slug]': {
      es: '/blog/[slug]',
      en: '/blog/[slug]',
      fr: '/blog/[slug]',
      de: '/blog/[slug]',
      it: '/blog/[slug]',
      pt: '/blog/[slug]'
    },

    // --- HERRAMIENTAS (TOOLS) ---
    // Índice de herramientas
    '/tools': {
      es: '/herramientas',
      en: '/tools',
      fr: '/outils',
      de: '/werkzeuge',
      it: '/strumenti',
      pt: '/ferramentas'
    },
    // Detalle de herramienta
    '/tools/[slug]': {
      es: '/herramientas/[slug]',
      en: '/tools/[slug]',
      fr: '/outils/[slug]',
      de: '/werkzeuge/[slug]',
      it: '/strumenti/[slug]',
      pt: '/ferramentas/[slug]'
    },

    // --- PRODUCTOS ---
    // Nota: No tienes un índice de productos (/products), solo detalles.
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

// Exportamos los componentes de navegación que usan esta configuración
export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation(routing);

// Exportamos constantes para compatibilidad con otros archivos
export const locales = routing.locales;
export const defaultLocale = routing.defaultLocale;
// =============== FIN ARCHIVO: src/i18n/routing.ts =============== //