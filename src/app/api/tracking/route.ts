import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    // 1. Leer los datos que nos envía el "Sensor" (Middleware/Cliente)
    const body = await req.json()
    const { page, referrer, country, city, device, browser, ip } = body

    // 2. Anonimizar IP (Hash SHA-256) - Cumplimiento RGPD
    const ipHash = ip
      ? crypto.createHash('sha256').update(ip).digest('hex')
      : 'unknown'

    // 3. (Futuro) Detección de Empresa B2B
    const companyName = null

    // 4. Inicializar Payload
    const payload = await getPayload({ config: configPromise })

    // 5. Guardar la visita en la base de datos
    await payload.create({
      collection: 'analytics', 
      data: {
        timestamp: new Date().toISOString(),
        page: page || '/',
        country: country || 'Unknown',
        city: city || 'Unknown',
        device: device || 'Desktop',
        browser: browser || 'Chrome',
        source: referrer || 'Direct',
        ipHash,
        companyName,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking visit:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}