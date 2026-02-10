import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const DEMO_JWT_SECRET = new TextEncoder().encode(
  process.env.DEMO_JWT_SECRET || 'demo-secret-change-in-production'
)

/**
 * Endpoint para verificar tokens de demo desde PoolControl
 * GET /api/poolcontrol/verify-token?token=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token requerido' },
        { status: 400 }
      )
    }

    try {
      // Verificar el token
      const { payload } = await jwtVerify(token, DEMO_JWT_SECRET)

      // Token válido
      return NextResponse.json({
        success: true,
        data: {
          email: payload.email,
          name: payload.name,
          company: payload.company,
          demoRequestId: payload.demoRequestId,
          exp: payload.exp,
        },
      })
    } catch (jwtError) {
      return NextResponse.json(
        { success: false, message: 'Token inválido o expirado' },
        { status: 401 }
      )
    }

  } catch (error) {
    console.error('Error verificando token:', error)
    return NextResponse.json(
      { success: false, message: 'Error al verificar token' },
      { status: 500 }
    )
  }
}

/**
 * Endpoint POST para verificar tokens (alternativa al GET)
 * POST /api/poolcontrol/verify-token
 * Body: { token: "xxx" }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token requerido' },
        { status: 400 }
      )
    }

    try {
      // Verificar el token
      const { payload } = await jwtVerify(token, DEMO_JWT_SECRET)

      // Token válido
      return NextResponse.json({
        success: true,
        data: {
          email: payload.email,
          name: payload.name,
          company: payload.company,
          demoRequestId: payload.demoRequestId,
          exp: payload.exp,
        },
      })
    } catch (jwtError) {
      return NextResponse.json(
        { success: false, message: 'Token inválido o expirado' },
        { status: 401 }
      )
    }

  } catch (error) {
    console.error('Error verificando token:', error)
    return NextResponse.json(
      { success: false, message: 'Error al verificar token' },
      { status: 500 }
    )
  }
}
