import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 1. FILTRADO: No rastrear lo que no nos interesa
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/admin') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // 2. EXTRACCIÓN DE DATOS (Estándar HTTP compatible con Heroku)
  
  // IP: En Heroku/Proxies, la IP real viene en la cabecera 'x-forwarded-for'
  const xForwardedFor = request.headers.get('x-forwarded-for')
  // Si hay varias IPs (proxies encadenados), la primera es la del cliente
  const ip = xForwardedFor ? xForwardedFor.split(',')[0] : '127.0.0.1'
  
  // Geo: Intentamos leer cabeceras de CDNs comunes (Vercel, Cloudflare)
  const country = request.headers.get('x-vercel-ip-country') || request.headers.get('cf-ipcountry') || 'Unknown'
  const city = request.headers.get('x-vercel-ip-city') || request.headers.get('cf-ipcity') || 'Unknown'
  
  const userAgent = request.headers.get('user-agent') || 'Unknown'
  const referrer = request.headers.get('referer') || 'Direct'

  // Detección simple de dispositivo
  const isMobile = /mobile/i.test(userAgent)
  const device = isMobile ? 'Mobile' : 'Desktop'

  // 3. ENVÍO DE DATOS (Fire & Forget)
  const trackingUrl = `${request.nextUrl.origin}/api/tracking`

  fetch(trackingUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      page: request.nextUrl.pathname,
      referrer,
      country,
      city,
      device,
      browser: userAgent,
      ip
    })
  }).catch(err => {
    console.error('Tracking Error (Silent):', err)
  })

  // 4. Continuar
  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}