import type { CollectionConfig } from 'payload'
import nodemailer from 'nodemailer'

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
        // Solo enviamos email si se está CREANDO un mensaje nuevo
        if (operation === 'create') {
          try {
            // 1. Leemos la configuración de correo desde el Global que creamos
            const emailSettings = await req.payload.findGlobal({
              slug: 'email-settings' as any,
            }) as any // Casting simple para evitar errores si los tipos no están regenerados aún

            // Validamos que haya configuración
            if (!emailSettings?.smtpHost || !emailSettings?.smtpUser || !emailSettings?.toEmail) {
              console.warn('⚠️ No se ha configurado el SMTP en el panel. No se envió el correo.')
              return
            }

            // 2. Configuramos el transporte (Nodemailer) con tus datos de Zoho
            const transporter = nodemailer.createTransport({
              host: emailSettings.smtpHost,
              port: emailSettings.smtpPort,
              secure: emailSettings.smtpPort === 465, // True para puerto 465 (SSL)
              auth: {
                user: emailSettings.smtpUser,
                pass: emailSettings.smtpPass,
              },
            })

            // 3. Preparamos el contenido del email
            const mailOptions = {
              from: `"${emailSettings.fromName}" <${emailSettings.fromEmail}>`,
              to: emailSettings.toEmail, // Te llega a ti (admin@crono-job.com)
              replyTo: doc.email, // Si le das a responder, responde al cliente
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

            // 4. Enviamos el correo
            await transporter.sendMail(mailOptions)
            console.log(`✅ Notificación enviada a ${emailSettings.toEmail}`)

          } catch (error) {
            console.error('❌ Error enviando notificación de correo:', error)
            // No lanzamos error para no bloquear el guardado en base de datos
          }
        }
      },
    ],
  },
  fields: [
    // --- CAMPO NUEVO: ESTADO DE LECTURA (Para la campanita futura) ---
    {
      name: 'isRead',
      type: 'checkbox',
      label: 'Leído',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Marca esto cuando hayas gestionado el lead.',
      },
    },
    // ------------------------------------------------------------------
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
        readOnly: true, // No se debería poder desmarcar esto legalmente
      },
    },
  ],
}