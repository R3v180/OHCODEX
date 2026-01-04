import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

export const Legal: GlobalConfig = {
  slug: 'legal-texts',
  label: 'Textos Legales',
  access: {
    read: () => true, // Acceso público para que la web pueda leerlos
  },
  // --- AQUI ESTÁ LA ACTUALIZACIÓN AUTOMÁTICA ---
  hooks: {
    afterChange: [
      async () => {
        // Regeneramos las 3 páginas legales al mismo tiempo
        // Nota: Al introducir locales, Next.js revalidará las rutas específicas por idioma
        revalidatePath('/aviso-legal')
        revalidatePath('/privacidad')
        revalidatePath('/terminos')
        console.log('🔄 Textos legales regenerados bajo demanda')
      },
    ],
  },
  // ---------------------------------------------
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Aviso Legal',
          fields: [
            {
              name: 'legalNotice',
              type: 'richText',
              label: 'Contenido del Aviso Legal',
              required: true,
              localized: true, // ✅ AHORA TRADUCIBLE
            },
          ],
        },
        {
          label: 'Privacidad',
          fields: [
            {
              name: 'privacyPolicy',
              type: 'richText',
              label: 'Contenido de Política de Privacidad',
              required: true,
              localized: true, // ✅ AHORA TRADUCIBLE
            },
          ],
        },
        {
          label: 'Términos',
          fields: [
            {
              name: 'termsConditions',
              type: 'richText',
              label: 'Contenido de Términos y Condiciones',
              required: true,
              localized: true, // ✅ AHORA TRADUCIBLE
            },
          ],
        },
      ],
    },
  ],
}