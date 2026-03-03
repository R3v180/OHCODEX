import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URI,
})

export async function POST(req: Request) {
  try {
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

    // Guardamos el evento en la tabla externa ad_events (solo si hay DATABASE_URI)
    if (process.env.DATABASE_URI) {
      const userAgent = req.headers.get('user-agent') || null
      const ip =
        req.headers.get('x-forwarded-for') ||
        req.headers.get('x-real-ip') ||
        req.headers.get('cf-connecting-ip') ||
        null

      await pool.query(
        `
        INSERT INTO ad_events
          (slot_position, network, event_type, variant_label, tool_slug, locale, user_agent, ip_hash)
        VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8)
      `,
        [slotPosition, network, eventType, variantLabel || null, toolSlug || null, locale || null, userAgent, ip],
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error registrando evento de anuncio:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

