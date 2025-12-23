import type { CollectionConfig } from 'payload'
import nodemailer from 'nodemailer'
// ⚠️ COMENTADO TEMPORALMENTE PARA ARREGLAR EL BUILD
// import ReadStatusHandler from '../components/admin/ReadStatusHandler'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: {
    singular: 'Mensaje de Contacto',
    plural: 'Bandeja de Entrada',
  },
  admin: {
    defaultColumns: ['name', 'email', 'serviceType', 'createdAt', 'isRead'],
  },
  access: {
    create: () => true,
    read: () => true, 
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create') {
          try {
            const emailSettings = await req.payload.findGlobal({
              slug: 'email-settings' as any,
            }) as any

            if (!emailSettings?.smtpHost || !emailSettings?.smtpUser || !emailSettings?.toEmail) {
              console.warn('⚠️ No se ha configurado el SMTP en el panel. No se envió el correo.')
              return
            }

            const transporter = nodemailer.createTransport({
              host: emailSettings.smtpHost,
              port: emailSettings.smtpPort,
              secure: emailSettings.smtpPort === 465,
              auth: {
                user: emailSettings.smtpUser,
                pass: emailSettings.smtpPass,
              },
            })

            const mailOptions = {
              from: `"${emailSettings.fromName}" <${emailSettings.fromEmail}>`,
              to: emailSettings.toEmail,
              replyTo: doc.email,
              subject: `🔔 Nuevo Lead OHCodex: ${doc.name}`,
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #06b6d4;">Nuevo mensaje recibido</h2>
                  <p>Has recibido una nueva solicitud de contacto desde la web.</p>
                  
                  <div style="background: #f4f4f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Nombre:</strong> ${doc.name}</p>
                    <p><strong>Email:</strong> ${doc.email}</p>
                    <p><strong>Interés:</strong> ${doc.serviceType}</p>
                    <p><strong>Mensaje:</strong></p>
                    <p style="white-space: pre-wrap;">${doc.message}</p>
                  </div>

                  <p style="font-size: 12px; color: #71717a;">
                    Este mensaje se ha guardado en la base de datos de Payload CMS.
                  </p>
                </div>
              `,
            }

            await transporter.sendMail(mailOptions)
            console.log(`✅ Notificación enviada a ${emailSettings.toEmail}`)

          } catch (error) {
            console.error('❌ Error enviando notificación de correo:', error)
          }
        }
      },
    ],
  },
  fields: [
    // ⚠️ COMENTADO: Este campo UI es el que rompe el generador en la versión Beta actual
    /*
    {
      name: 'autoReadLogic',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: ReadStatusHandler as any,
        },
      },
    },
    */

    {
      name: 'isRead',
      type: 'checkbox',
      label: 'Leído',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Desmárcalo si quieres revisarlo más tarde (aparecerá de nuevo en la campana).',
      },
    },
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
      admin: {
        readOnly: true, // No editable por el admin para preservar registro legal
      },
    },
  ],
}