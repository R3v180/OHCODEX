import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  
  try {
    const payload = await getPayload({ config: configPromise })
    
    // Contar usos totales
    const totalResult = await payload.count({
      collection: 'tool-usage-logs',
      where: {
        toolSlug: {
          equals: slug
        }
      }
    })
    
    // Contar personas únicas (por IP hash)
    const uniqueResult = await payload.find({
      collection: 'tool-usage-logs',
      where: {
        toolSlug: {
          equals: slug
        }
      },
      pagination: false,
      depth: 0,
    })
    
    // Extraer IPs únicas
    const uniqueIps = new Set(uniqueResult.docs.map((doc: any) => doc.ipHash))
    
    return NextResponse.json({
      totalUses: totalResult.totalDocs,
      uniqueUsers: uniqueIps.size,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { totalUses: 0, uniqueUsers: 0 },
      { status: 500 }
    )
  }
}
