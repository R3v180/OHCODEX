// =============== INICIO ARCHIVO: src/app/actions/get-translated-slug.ts =============== //
'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function getTranslatedSlug(
  collection: 'products' | 'posts' | 'tools',
  currentSlug: string,
  targetLocale: string
): Promise<string | null> {
  const payload = await getPayload({ config: configPromise })

  try {
    // 1. Buscamos el documento original usando el slug actual (en cualquier idioma)
    // Payload no tiene una forma directa de buscar "por cualquier locale", así que buscamos en 'es' primero
    // o iteramos. Pero la forma más eficiente es buscar por ID si lo tuviéramos.
    // Como solo tenemos slug, haremos una búsqueda en la colección.
    
    const result = await payload.find({
      collection,
      where: {
        slug: {
          equals: currentSlug
        }
      },
      limit: 1,
      depth: 0,
      locale: 'all' as any // Truco para traer todos los idiomas
    })

    if (!result.docs[0]) return null

    const doc = result.docs[0] as any

    // 2. Extraemos el slug del idioma objetivo
    // Al pedir locale='all', los campos localizados vienen como objetos { es: '...', en: '...' }
    const targetSlug = doc.slug[targetLocale]

    return targetSlug || null

  } catch (error) {
    console.error('Error resolving translated slug:', error)
    return null
  }
}
// =============== FIN ARCHIVO: src/app/actions/get-translated-slug.ts =============== //