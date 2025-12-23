import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // El tracking ahora se hace desde el cliente (AnalyticsTracker.tsx) para evitar problemas de caché.
  // Dejamos el middleware limpio para no duplicar lógica ni gastar CPU innecesaria.
  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}