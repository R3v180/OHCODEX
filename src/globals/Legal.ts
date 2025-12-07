// ========== src/globals/Legal.ts ========== //

import type { GlobalConfig } from 'payload'

export const Legal: GlobalConfig = {
  slug: 'legal-texts',
  label: 'Textos Legales',
  access: {
    read: () => true, // Acceso público para que la web pueda leerlos
  },
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
            },
          ],
        },
      ],
    },
  ],
}

// ========== Fin de src/globals/Legal.ts ========== //