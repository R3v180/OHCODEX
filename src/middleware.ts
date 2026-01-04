import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Ignorar rutas internas de Payload (api, admin), Next.js (_next) y archivos estáticos
    '/((?!api|admin|_next|static|.*\\..*).*)'
  ]
};