import type { GlobalConfig } from 'payload'

export const EmailSettings: GlobalConfig = {
  slug: 'email-settings',
  label: 'Configuración de Correo (SMTP)',
  access: {
    // Solo los admins pueden ver o editar esto por seguridad
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'smtpHost',
          type: 'text',
          label: 'Servidor SMTP',
          required: true,
          defaultValue: 'smtp.zoho.eu', // Valor por defecto para Zoho Europa
          admin: { width: '50%' },
        },
        {
          name: 'smtpPort',
          type: 'number',
          label: 'Puerto SMTP',
          required: true,
          defaultValue: 465, // Puerto SSL estándar
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'smtpUser',
          type: 'text',
          label: 'Usuario SMTP (Login)',
          required: true,
          admin: {
            width: '50%',
            description: 'Tu email principal de Zoho (admin@crono-job.com)',
          },
        },
        {
          name: 'smtpPass',
          type: 'text', 
          label: 'Contraseña de Aplicación',
          required: true,
          admin: {
            width: '50%',
            description: 'Pega aquí la clave que generaste (rRc6...)',
          },
        },
      ],
    },
    // CORRECCIÓN: Usamos 'collapsible' en lugar de 'section'
    {
      type: 'collapsible',
      label: 'Configuración de Envío',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'fromName',
              type: 'text',
              label: 'Nombre del Remitente',
              defaultValue: 'Web OHCodex',
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'fromEmail',
              type: 'email',
              label: 'Email del Remitente (De parte de)',
              defaultValue: 'info@ohcodex.com',
              required: true,
              admin: {
                width: '50%',
                description: 'Debe ser un alias válido de tu cuenta.',
              },
            },
          ],
        },
        {
          name: 'toEmail',
          type: 'email',
          label: 'Recibir notificaciones en',
          defaultValue: 'admin@crono-job.com', // O donde quieras recibir los leads
          required: true,
          admin: {
            description: 'A este correo llegarán los avisos cuando alguien rellene el formulario.',
          },
        },
      ],
    },
  ],
}