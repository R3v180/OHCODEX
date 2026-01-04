import { defineRouting } from 'next-intl/routing';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'always'
});

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation(routing);

// Exportamos también las constantes sueltas para compatibilidad
export const locales = routing.locales;
export const defaultLocale = routing.defaultLocale;