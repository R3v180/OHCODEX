// =============== INICIO ARCHIVO: src/i18n.ts =============== //
import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

// Actualizamos la lista con todos los nuevos idiomas
const locales = ['es', 'en', 'fr', 'de', 'it', 'pt'] as const
export type Locale = (typeof locales)[number]

export default getRequestConfig(async ({ locale }) => {
  // Validamos que el idioma solicitado esté en nuestra lista
  if (!locales.includes(locale as Locale)) notFound()

  return {
    // Usamos importación dinámica. 
    // Esto permite compilar el proyecto aunque los archivos JSON 
    // de los nuevos idiomas aún no existan físicamente.
    messages: (await import(`./messages/${locale}.json`)).default
  }
})
// =============== FIN ARCHIVO: src/i18n.ts =============== //