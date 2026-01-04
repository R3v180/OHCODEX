// =============== INICIO ARCHIVO: src/app/(frontend)/actions.ts =============== //
'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getTranslations, getLocale } from 'next-intl/server'

// Definimos el tipo de estado de retorno para el cliente
type FormState = {
  success: boolean
  message: string
}

export async function submitContactForm(prevState: any, formData: FormData): Promise<FormState> {
  // 1. Detectar el idioma actual de la petición
  const locale = await getLocale()
  
  // 2. Cargar traducciones para ese idioma
  const t = await getTranslations({ locale, namespace: 'contactSection.form' })

  // Inicializamos Payload
  const payload = await getPayload({ config: configPromise })

  // Extraemos los datos del formulario HTML
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const serviceType = formData.get('serviceType') as string
  const message = formData.get('message') as string
  const privacyAccepted = formData.get('privacyAccepted') === 'on'

  // Validación básica
  if (!name || !email || !message || !privacyAccepted) {
    return {
      success: false,
      // 👇 Mensaje de error traducido (definido en en.json/es.json)
      message: t('errors.required'), 
    }
  }

  try {
    // Insertamos el dato en la colección 'contact-submissions'
    await payload.create({
      collection: 'contact-submissions',
      data: {
        name,
        email,
        serviceType: serviceType as 'pwa' | 'saas' | 'api' | 'other',
        message,
        privacyAccepted,
      },
    })

    return {
      success: true,
      // 👇 Mensaje de éxito traducido
      message: t('successMessage'), 
    }
  } catch (error) {
    console.error('Error al procesar el formulario de contacto:', error)
    
    return {
      success: false,
      // 👇 Mensaje de error genérico traducido
      message: t('errors.generic'),
    }
  }
}
// =============== FIN ARCHIVO: src/app/(frontend)/actions.ts =============== //