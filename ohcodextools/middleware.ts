import createMiddleware from 'next-intl/middleware'
import { locales } from './src/i18n'

export default createMiddleware({
  defaultLocale: 'es',
  locales
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
