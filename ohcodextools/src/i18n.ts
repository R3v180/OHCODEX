import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'
import esMessages from './messages/es.json'
import enMessages from './messages/en.json'

const locales = ['en', 'es'] as const
export type Locale = (typeof locales)[number]

const messages = {
  en: enMessages,
  es: esMessages,
}

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound()

  return {
    messages: messages[locale as Locale]
  }
})
