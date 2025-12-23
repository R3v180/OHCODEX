import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

// ⚠️ No importamos geoip-lite aquí arriba para evitar el error de build

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { page, referrer, device, browser } = body

    // 1. Obtener la IP real
    const forwardedFor = req.headers.get('x-forwarded-for')
    let ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1'

    // 2. Geolocalización (Lazy Loading / Importación Dinámica)
    let country = 'Unknown'
    let city = 'Unknown'

    try {
      // 👇 Importamos la librería SOLO cuando se ejecuta esta función
      // Esto evita que rompa el build si faltan archivos .dat en tiempo de construcción
      const geoipModule = await import('geoip-lite')
      // Soporte para CommonJS/ESM interop
      const geoip = geoipModule.default || geoipModule
      
      const geo = geoip.lookup(ip)
      
      if (geo) {
        country = geo.country || 'Unknown'
        city = geo.city || 'Unknown'
      }
    } catch (e) {
      console.warn('GeoIP lookup failed:', e)
      // Si falla, seguimos con "Unknown" pero no rompemos la petición
    }

    // 3. Anonimizar IP
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex')

    // 4. Inicializar Payload
    const payload = await getPayload({ config: configPromise })

    // 5. Guardar
    await payload.create({
      collection: 'analytics', 
      data: {
        timestamp: new Date().toISOString(),
        page: page || '/',
        country,
        city,
        device: device || 'Desktop',
        browser: browser || 'Chrome',
        source: referrer || 'Direct',
        ipHash,
        companyName: null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking visit:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}