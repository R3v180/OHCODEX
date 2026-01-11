// =============== INICIO ARCHIVO: src/i18n/routing.ts =============== //
import { defineRouting } from 'next-intl/routing';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // Añadimos: fr (Francés), de (Alemán), it (Italiano), pt (Portugués)
  locales: ['es', 'en', 'fr', 'de', 'it', 'pt'],
  defaultLocale: 'es',
  localePrefix: 'always'
});

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation(routing);

// Exportamos también las constantes sueltas para compatibilidad
export const locales = routing.locales;
export const defaultLocale = routing.defaultLocale;
// =============== FIN ARCHIVO: src/i18n/routing.ts =============== //