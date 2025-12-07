// src/collections/ContactSubmissions.ts
import type { CollectionConfig } from 'payload'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: {
    singular: 'Mensaje de Contacto',
    plural: 'Bandeja de Entrada',
  },
  access: {
    // Permitir crear a cualquiera (el formulario público)
    create: () => true,
    // Solo admins pueden leer/actualizar/borrar
    read: () => true, // O restringe a ({ req: { user } }) => Boolean(user)
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nombre',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      label: 'Correo Electrónico',
      required: true,
    },
    {
      name: 'serviceType',
      type: 'select',
      label: 'Interesado en',
      defaultValue: 'other',
      options: [
        { label: 'Desarrollo PWA / App', value: 'pwa' },
        { label: 'Plataforma SaaS', value: 'saas' },
        { label: 'Integraciones / API', value: 'api' },
        { label: 'Otro', value: 'other' },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Mensaje',
      required: true,
    },
    {
      name: 'privacyAccepted',
      type: 'checkbox',
      label: 'Aceptó Política de Privacidad',
      required: true,
      defaultValue: false,
    },
  ],
}