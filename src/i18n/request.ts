import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // 👇 LOG DE DEPURACIÓN
  console.log("🔥 [DEBUG i18n] Cargando configuración. Locale solicitado:", await requestLocale);

  let locale = await requestLocale;

  // Validación de seguridad usando la config centralizada
  if (!locale || !routing.locales.includes(locale as any)) {
    console.log("⚠️ [DEBUG i18n] Locale inválido. Usando fallback:", routing.defaultLocale);
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});