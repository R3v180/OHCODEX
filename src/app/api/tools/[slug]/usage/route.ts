import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { createHash } from 'crypto'

// Función para obtener IP del request
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}

// Función para hashear IP (anonimizar)
function hashIP(ip: string): string {
  return createHash('sha256').update(ip).digest('hex')
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  
  try {
    const payload = await getPayload({ config: configPromise })
    
    // Obtener y hashear IP
    const ip = getClientIP(request)
    const ipHash = hashIP(ip)
    
    // Crear log de uso mediante Payload
    await payload.create({
      collection: 'tool-usage-logs',
      data: {
        toolSlug: slug,
        ipHash: ipHash,
      },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error logging usage:', error)
    return NextResponse.json(
      { error: 'Failed to log usage' },
      { status: 500 }
    )
  }
}
