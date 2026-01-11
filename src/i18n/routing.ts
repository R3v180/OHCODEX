// =============== INICIO ARCHIVO: src/i18n/routing.ts =============== //
import { defineRouting } from 'next-intl/routing';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // Lista de idiomas soportados
  locales: ['es', 'en', 'fr', 'de', 'it', 'pt'],
  
  // Idioma por defecto si no se detecta otro
  defaultLocale: 'es',
  
  // Siempre mostrar el prefijo del idioma en la URL (ej: /es/blog)
  localePrefix: 'always',

  // 👇 MAPA DE RUTAS TRADUCIDAS (Pathnames)
  // Esto permite que /aviso-legal sea /legal-notice en inglés o /mentions-legales en francés
  pathnames: {
    '/': '/',
    
    '/blog': {
      es: '/blog',
      en: '/blog',
      fr: '/blog',
      de: '/blog',
      it: '/blog',
      pt: '/blog'
    },

    // Opcional: Traducir la base de herramientas
    '/tools': {
      es: '/herramientas',
      en: '/tools',
      fr: '/outils',
      de: '/werkzeuge',
      it: '/strumenti',
      pt: '/ferramentas'
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

// Exportamos constantes para compatibilidad
export const locales = routing.locales;
export const defaultLocale = routing.defaultLocale;
// =============== FIN ARCHIVO: src/i18n/routing.ts =============== //