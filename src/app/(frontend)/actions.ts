'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'

// Definimos el tipo de estado de retorno para el cliente
type FormState = {
  success: boolean
  message: string
}

export async function submitContactForm(prevState: any, formData: FormData): Promise<FormState> {
  // Inicializamos Payload para poder hablar con la base de datos
  const payload = await getPayload({ config: configPromise })

  // Extraemos los datos del formulario HTML
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const serviceType = formData.get('serviceType') as string
  const message = formData.get('message') as string
  // Los checkboxes envían "on" si están marcados, o null si no
  const privacyAccepted = formData.get('privacyAccepted') === 'on'

  // Validación de seguridad en el servidor
  // (Aunque el frontend valide, nunca hay que confiar en lo que viene del cliente)
  if (!name || !email || !message || !privacyAccepted) {
    return {
      success: false,
      message: 'Faltan campos obligatorios o no se ha aceptado la privacidad.',
    }
  }

  try {
    // Insertamos el dato en la colección 'contact-submissions'
    await payload.create({
      collection: 'contact-submissions',
      data: {
        name,
        email,
        // Hacemos casting al tipo esperado por Payload según definimos en la colección
        serviceType: serviceType as 'pwa' | 'saas' | 'api' | 'other',
        message,
        privacyAccepted,
      },
    })

    // Si todo va bien, devolvemos éxito
    return {
      success: true,
      message: '¡Recibido! Tu mensaje ha entrado en nuestro sistema. Te contactaremos pronto.',
    }
  } catch (error) {
    console.error('Error al procesar el formulario de contacto:', error)
    
    // Si falla la base de datos, devolvemos un error amigable
    return {
      success: false,
      message: 'Hubo un problema técnico al enviar tu mensaje. Por favor, intenta de nuevo más tarde.',
    }
  }
}