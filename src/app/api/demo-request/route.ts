import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '../../../payload.config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const body = await request.json()
    
    const { name, email, company, phone, poolCount, message, utmSource, utmMedium } = body

    // Validaciones básicas
    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: 'Nombre y email son requeridos' },
        { status: 400 }
      )
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Email inválido' },
        { status: 400 }
      )
    }

    // Obtener IP del usuario
    const forwardedFor = request.headers.get('x-forwarded-for')
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'

    // Crear el registro de demo request
    const demoRequest = await payload.create({
      collection: 'demo-requests',
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        company: company?.trim() || null,
        phone: phone?.trim() || null,
        poolCount: poolCount || null,
        message: message?.trim() || null,
        utmSource: utmSource || null,
        utmMedium: utmMedium || null,
        ipAddress: ipAddress || null,
        status: 'pending',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Solicitud recibida correctamente. Revisa tu email para acceder a la demo.',
      data: {
        id: demoRequest.id,
        email: demoRequest.email,
      },
    })

  } catch (error) {
    console.error('Error en demo-request:', error)
    
    // Si es error de duplicado (email ya existe)
    if (error instanceof Error && error.message.includes('duplicate')) {
      return NextResponse.json(
        { success: false, message: 'Ya existe una solicitud con este email' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}
