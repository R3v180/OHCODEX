import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import crypto from 'crypto'
// 👇 Importamos la librería de geoip
import geoip from 'geoip-lite'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { page, referrer, device, browser } = body

    // 1. Obtener la IP real en Heroku (vía cabecera x-forwarded-for)
    // Si estamos en local, usamos una IP ficticia
    const forwardedFor = req.headers.get('x-forwarded-for')
    let ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1'

    // 2. Geolocalizar la IP usando la librería
    const geo = geoip.lookup(ip)
    
    // Si geo existe, usamos sus datos. Si no (ej: localhost), ponemos Unknown.
    const country = geo ? geo.country : 'Unknown'
    const city = geo ? geo.city : 'Unknown'

    // 3. Anonimizar IP (Hash SHA-256) - Cumplimiento RGPD
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex')

    // 4. Inicializar Payload
    const payload = await getPayload({ config: configPromise })

    // 5. Guardar la visita con los datos reales
    await payload.create({
      collection: 'analytics', 
      data: {
        timestamp: new Date().toISOString(),
        page: page || '/',
        country, // Ahora guardamos ES, US, MX, etc.
        city,    // Madrid, Barcelona, etc.
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