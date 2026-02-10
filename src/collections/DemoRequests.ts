import type { CollectionConfig } from 'payload'
import nodemailer from 'nodemailer'
import { SignJWT } from 'jose'

// JWT Secret compartido con PoolControl (debe estar en variables de entorno)
const DEMO_JWT_SECRET = new TextEncoder().encode(
  process.env.DEMO_JWT_SECRET || 'demo-secret-change-in-production'
)
const POOLCONTROL_URL = process.env.POOLCONTROL_URL || 'https://pool-control-app.onrender.com'

export const DemoRequests: CollectionConfig = {
  slug: 'demo-requests',
  labels: {
    singular: 'Solicitud Demo PoolControl',
    plural: 'Solicitudes Demo PoolControl',
  },
  admin: {
    defaultColumns: ['email', 'name', 'company', 'status', 'createdAt'],
    description: 'Leads interesados en probar PoolControl Professional',
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create') {
          try {
            // Generar token JWT para acceso directo
            const token = await new SignJWT({
              email: doc.email,
              name: doc.name,
              company: doc.company,
              demoRequestId: doc.id,
            })
              .setProtectedHeader({ alg: 'HS256' })
              .setIssuedAt()
              .setExpirationTime('7d')
              .sign(DEMO_JWT_SECRET)

            // Guardar el token en el documento
            await req.payload.update({
              collection: 'demo-requests',
              id: doc.id,
              data: {
                accessToken: token,
              },
            })

            // Obtener configuración de email
            const emailSettings = await req.payload.findGlobal({
              slug: 'email-settings' as any,
            }) as any

            if (!emailSettings?.smtpHost || !emailSettings?.smtpUser) {
              console.warn('⚠️ No se ha configurado el SMTP. No se envió el correo.')
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

            // Link mágico para acceso directo
            const magicLink = `${POOLCONTROL_URL}/demo-access?token=${token}`

            const mailOptions = {
              from: `"${emailSettings.fromName || 'OHCodex'}" <${emailSettings.fromEmail || emailSettings.smtpUser}>`,
              to: doc.email,
              subject: '🚀 Tu acceso a PoolControl Professional está listo',
              html: `
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Acceso a PoolControl</title>
                  <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; margin: 0; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #0ea5e9, #06b6d4); padding: 40px 30px; text-align: center; }
                    .header h1 { color: white; margin: 0; font-size: 28px; }
                    .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0; }
                    .content { padding: 40px 30px; }
                    .button { display: inline-block; background: linear-gradient(135deg, #0ea5e9, #06b6d4); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; margin: 20px 0; }
                    .button:hover { opacity: 0.9; }
                    .info-box { background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 20px 0; border-radius: 4px; }
                    .footer { background: #f8fafc; padding: 20px 30px; text-align: center; font-size: 12px; color: #64748b; }
                    .roles { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin: 20px 0; }
                    .role { background: #f1f5f9; padding: 12px; border-radius: 6px; text-align: center; font-size: 14px; }
                    .role-icon { font-size: 24px; margin-bottom: 5px; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <h1>🌊 PoolControl Professional</h1>
                      <p>La herramienta definitiva para gestión de piscinas</p>
                    </div>
                    <div class="content">
                      <h2>¡Hola ${doc.name || 'there'}! 👋</h2>
                      <p>Gracias por tu interés en <strong>PoolControl Professional</strong>. Tu acceso a la demo está listo.</p>
                      
                      <div style="text-align: center;">
                        <a href="${magicLink}" class="button">🔐 Acceder a la Demo</a>
                      </div>
                      
                      <div class="info-box">
                        <strong>📋 Detalles de tu acceso:</strong>
                        <ul style="margin: 10px 0; padding-left: 20px;">
                          <li>Email registrado: ${doc.email}</li>
                          <li>Empresa: ${doc.company || 'No especificada'}</li>
                          <li>Validez: 7 días</li>
                          <li>Usos ilimitados durante el período</li>
                        </ul>
                      </div>
                      
                      <h3>🎭 Elige tu perfil al entrar:</h3>
                      <div class="roles">
                        <div class="role">
                          <div class="role-icon">📊</div>
                          <strong>Gerente</strong>
                          <div style="font-size: 12px; color: #64748b;">Dashboard completo</div>
                        </div>
                        <div class="role">
                          <div class="role-icon">🔧</div>
                          <strong>Técnico</strong>
                          <div style="font-size: 12px; color: #64748b;">App móvil, rutas</div>
                        </div>
                        <div class="role">
                          <div class="role-icon">⚙️</div>
                          <strong>Admin</strong>
                          <div style="font-size: 12px; color: #64748b;">Facturación, gestión</div>
                        </div>
                      </div>
                      
                      <p style="font-size: 14px; color: #64748b; margin-top: 30px;">
                        Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
                        <a href="${magicLink}" style="color: #0ea5e9; word-break: break-all;">${magicLink}</a>
                      </p>
                    </div>
                    <div class="footer">
                      <p>Este email fue enviado desde OHCodex por una solicitud de demo.</p>
                      <p>© ${new Date().getFullYear()} OHCodex. Todos los derechos reservados.</p>
                    </div>
                  </div>
                </body>
                </html>
              `,
            }

            await transporter.sendMail(mailOptions)
            console.log(`✅ Email de demo enviado a ${doc.email}`)

            // También notificar al admin
            if (emailSettings.toEmail) {
              await transporter.sendMail({
                from: `"${emailSettings.fromName || 'OHCodex'}" <${emailSettings.fromEmail || emailSettings.smtpUser}>`,
                to: emailSettings.toEmail,
                subject: `🔔 Nueva demo request: ${doc.company || doc.name}`,
                html: `
                  <div style="font-family: sans-serif; max-width: 600px;">
                    <h2 style="color: #0ea5e9;">Nueva solicitud de demo PoolControl</h2>
                    <div style="background: #f4f4f5; padding: 20px; border-radius: 8px;">
                      <p><strong>Nombre:</strong> ${doc.name}</p>
                      <p><strong>Email:</strong> ${doc.email}</p>
                      <p><strong>Empresa:</strong> ${doc.company || 'No especificada'}</p>
                      <p><strong>Teléfono:</strong> ${doc.phone || 'No especificado'}</p>
                      <p><strong>Mensaje:</strong> ${doc.message || 'Sin mensaje'}</p>
                    </div>
                    <p style="font-size: 12px; color: #71717a;">Ver en el panel: ${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/demo-requests/${doc.id}</p>
                  </div>
                `,
              })
            }
          } catch (error) {
            console.error('❌ Error enviando email de demo:', error)
          }
        }
      },
    ],
  },
  fields: [
    {
      name: 'status',
      type: 'select',
      label: 'Estado',
      defaultValue: 'pending',
      options: [
        { label: '⏳ Pendiente', value: 'pending' },
        { label: '📧 Email Enviado', value: 'sent' },
        { label: '✅ Accedió', value: 'accessed' },
        { label: '❌ Convertido', value: 'converted' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'accessToken',
      type: 'text',
      label: 'Token de Acceso',
      admin: {
        readOnly: true,
        description: 'JWT generado automáticamente para acceso directo',
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
      name: 'company',
      type: 'text',
      label: 'Empresa / Piscina',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Teléfono',
    },
    {
      name: 'poolCount',
      type: 'select',
      label: 'Cantidad de Piscinas',
      options: [
        { label: '1-5 piscinas', value: '1-5' },
        { label: '6-20 piscinas', value: '6-20' },
        { label: '21-50 piscinas', value: '21-50' },
        { label: 'Más de 50', value: '50+' },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Mensaje / Consulta',
    },
    {
      name: 'utmSource',
      type: 'text',
      label: 'UTM Source',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'utmMedium',
      type: 'text',
      label: 'UTM Medium',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'ipAddress',
      type: 'text',
      label: 'IP Address',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'accessedAt',
      type: 'date',
      label: 'Fecha de Acceso',
      admin: {
        readOnly: true,
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
}
