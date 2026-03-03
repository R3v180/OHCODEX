import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config: configPromise })
    const body = await req.json().catch(() => null)

    if (!body) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const {
      slotPosition,
      network,
      variantId,
      variantLabel,
      eventType,
      toolSlug,
      locale,
    } = body as {
      slotPosition?: 'top' | 'sidebar' | 'bottom'
      network?: 'adsense' | 'ezoic' | 'house'
      variantId?: string
      variantLabel?: string
      eventType?: 'impression' | 'click'
      toolSlug?: string
      locale?: string
    }

    if (!slotPosition || !network || !eventType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Por ahora dejamos el endpoint como no-op para no depender de migraciones ni nuevas tablas
    // En el futuro podremos registrar estos eventos en una colección dedicada.
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error registrando evento de anuncio:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

