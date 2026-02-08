import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { toolSlug, reporterEmail, reporterName, description } = body
    
    // Validaciones básicas
    if (!toolSlug || !reporterEmail || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(reporterEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }
    
    // Crear reporte en Payload CMS
    const payload = await getPayload({ config: configPromise })
    
    await payload.create({
      collection: 'tool-reports' as any,
      data: {
        toolSlug,
        reporterEmail,
        reporterName: reporterName || null,
        description,
        status: 'pending',
      },
    })
    
    // Aquí podrías enviar email de notificación
    // Por ahora solo logueamos
    console.log(`🐛 Nuevo reporte recibido para ${toolSlug} desde ${reporterEmail}`)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error creating report:', error)
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    )
  }
}
