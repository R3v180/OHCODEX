import type { GlobalConfig } from 'payload'

export const AdsSettings: GlobalConfig = {
  slug: 'ads-settings',
  label: 'Ads & Monetización',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Activar anuncios en la web',
      defaultValue: false,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'AdSense',
          fields: [
            {
              name: 'adsenseClientId',
              type: 'text',
              label: 'AdSense Client ID (ca-pub-XXXX)',
              admin: {
                description:
                  'ID de cuenta AdSense. Ejemplo: ca-pub-1234567890123456. Se usa para todos los bloques.',
              },
            },
            {
              name: 'slots',
              type: 'array',
              label: 'Slots por posición',
              labels: {
                singular: 'Slot',
                plural: 'Slots',
              },
              admin: {
                description:
                  'Configura los IDs de bloque (data-ad-slot) por posición para que coincidan con AdSense.',
              },
              fields: [
                {
                  name: 'position',
                  type: 'select',
                  label: 'Posición',
                  required: true,
                  options: [
                    { label: 'Top (Leaderboard 728x90)', value: 'top' },
                    { label: 'Sidebar (Rectangle 300x250)', value: 'sidebar' },
                    { label: 'Bottom (Leaderboard 728x90)', value: 'bottom' },
                  ],
                },
                {
                  name: 'adSlotId',
                  type: 'text',
                  label: 'AdSense data-ad-slot',
                  admin: {
                    description:
                      'ID numérico del bloque en AdSense. Ejemplo: 1234567890.',
                  },
                },
              ],
            },
            {
              name: 'adsenseScriptSrc',
              type: 'text',
              label: 'URL script AdSense (opcional)',
              defaultValue: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
              admin: {
                description:
                  'Normalmente no es necesario cambiarlo. Se añadirá ?client=ca-pub-XXXX automáticamente.',
              },
            },
          ],
        },
        {
          label: 'Ezoic',
          fields: [
            {
              name: 'ezoicSiteId',
              type: 'text',
              label: 'Site ID / Key de Ezoic',
              admin: {
                description: 'Identificador de sitio que te proporciona Ezoic.',
              },
            },
            {
              name: 'ezoicScriptSrc',
              type: 'text',
              label: 'URL script principal de Ezoic',
              admin: {
                description:
                  'Pega aquí la URL oficial del script de Ezoic para este sitio (si es necesaria en frontend).',
              },
            },
          ],
        },
        {
          label: 'Slots & Rotación',
          fields: [
            {
              name: 'positions',
              type: 'array',
              label: 'Configuración por posición',
              labels: {
                singular: 'Posición',
                plural: 'Posiciones',
              },
              fields: [
                {
                  name: 'position',
                  type: 'select',
                  label: 'Posición',
                  required: true,
                  options: [
                    { label: 'Top (Leaderboard 728x90)', value: 'top' },
                    { label: 'Sidebar (Rectangle 300x250)', value: 'sidebar' },
                    { label: 'Bottom (Leaderboard 728x90)', value: 'bottom' },
                  ],
                },
                {
                  name: 'variants',
                  type: 'array',
                  label: 'Variantes / Creatividades',
                  labels: {
                    singular: 'Variante',
                    plural: 'Variantes',
                  },
                  admin: {
                    description:
                      'Puedes mezclar AdSense, Ezoic y campañas propias. La rotación se hará según el peso configurado.',
                  },
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      label: 'Nombre interno de la variante',
                    },
                    {
                      name: 'network',
                      type: 'select',
                      label: 'Red / Tipo',
                      required: true,
                      options: [
                        { label: 'AdSense', value: 'adsense' },
                        { label: 'Ezoic', value: 'ezoic' },
                        { label: 'Campaña propia / House', value: 'house' },
                      ],
                    },
                    {
                      name: 'weight',
                      type: 'number',
                      label: 'Peso (para rotación)',
                      defaultValue: 1,
                      admin: {
                        description:
                          'Cuanto mayor el peso, más probabilidad de que salga esta variante frente a las demás.',
                      },
                    },
                    {
                      name: 'enabled',
                      type: 'checkbox',
                      label: 'Variante activa',
                      defaultValue: true,
                    },
                    // Config específica AdSense
                    {
                      name: 'adsenseSlotId',
                      type: 'text',
                      label: 'AdSense data-ad-slot (solo si network = AdSense)',
                    },
                    // Config específica Ezoic
                    {
                      name: 'ezoicPlaceholderId',
                      type: 'text',
                      label: 'ID placeholder Ezoic (solo si network = Ezoic)',
                    },
                    // Campañas propias
                    {
                      name: 'houseImageUrl',
                      type: 'text',
                      label: 'URL imagen banner (House)',
                    },
                    {
                      name: 'houseHref',
                      type: 'text',
                      label: 'URL destino (House)',
                    },
                    {
                      name: 'houseAlt',
                      type: 'text',
                      label: 'Alt / título (House)',
                    },
                    {
                      name: 'houseHtml',
                      type: 'textarea',
                      label: 'HTML personalizado (override)',
                      admin: {
                        description:
                          'Opcional: si rellenas este campo, se usará el HTML tal cual (útil para códigos de afiliado).',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

