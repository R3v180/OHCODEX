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

    const userAgent = req.headers.get('user-agent') || undefined
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined

    await payload.create({
      collection: 'ads-events' as any,
      data: {
        slotPosition,
        network,
        variantId,
        variantLabel,
        eventType,
        toolSlug,
        locale,
        userAgent,
        ipHash: ip, // En el futuro se puede hash-ear; de momento guardamos tal cual o se puede dejar vacío
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error registrando evento de anuncio:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

