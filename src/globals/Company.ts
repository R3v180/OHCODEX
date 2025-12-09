// ========== src/globals/Company.ts ========== //

import type { GlobalConfig } from 'payload'

export const Company: GlobalConfig = {
  slug: 'company-info',
  label: 'Configuración Empresa',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Identidad',
          fields: [
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              required: false,
              label: 'Logo Principal (Imagen Opcional)',
              admin: {
                description: 'Sube una imagen solo si quieres reemplazar el texto OHCODEX del header.',
              },
            },
            {
              name: 'logoDark',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo Secundario/Oscuro (Opcional)',
            },
            {
              name: 'tagline',
              type: 'text',
              label: 'Eslogan Corto (Footer)',
              defaultValue: 'Arquitectos de Ecosistemas Digitales',
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Descripción Breve (Footer)',
              defaultValue: 'Ingeniería de software avanzada para empresas que buscan escalabilidad.',
            },
          ],
        },
        {
          label: 'SEO Global',
          description: 'Configuración por defecto para buscadores (Google)',
          fields: [
            {
              name: 'defaultTitle',
              type: 'text',
              required: true,
              label: 'Título por defecto (Home)',
              defaultValue: 'OHCodex | Desarrollo de Software a Medida y Sistemas SaaS',
              admin: {
                description: 'Se usará en la página principal y como fallback.',
              },
            },
            {
              name: 'titleTemplate',
              type: 'text',
              required: true,
              label: 'Plantilla de Título',
              defaultValue: '%s | OHCodex',
              admin: {
                description: 'El %s se reemplazará por el título de la página actual (ej: "Aviso Legal | OHCodex").',
              },
            },
            {
              name: 'defaultDescription',
              type: 'textarea',
              required: true,
              label: 'Meta Descripción Global',
              defaultValue: 'Empresa de desarrollo de software especializada en PWAs, arquitecturas SaaS escalables y transformación digital.',
              minLength: 50,
              maxLength: 160,
            },
            {
              name: 'keywords',
              type: 'array',
              label: 'Palabras Clave Globales',
              labels: {
                singular: 'Keyword',
                plural: 'Keywords',
              },
              fields: [
                {
                  name: 'keyword',
                  type: 'text',
                  label: 'Palabra clave',
                },
              ],
            },
          ],
        },
        {
          label: 'Contacto',
          fields: [
            {
              name: 'contactEmail',
              type: 'email',
              required: true,
              label: 'Email de Contacto (Visible en Web)',
              defaultValue: 'info@ohcodex.com',
            },
            {
              name: 'phoneNumber',
              type: 'text',
              label: 'Teléfono',
            },
            {
              name: 'address',
              type: 'textarea',
              label: 'Dirección Física',
              defaultValue: 'Jávea, Alicante, España',
            },
            {
              name: 'schedule',
              type: 'text',
              label: 'Horario de Atención',
              defaultValue: 'L-V: 09:00 - 18:00',
            },
          ],
        },
        {
          label: 'Redes Sociales',
          fields: [
            {
              name: 'linkedin',
              type: 'text',
              label: 'URL LinkedIn',
            },
            {
              name: 'github',
              type: 'text',
              label: 'URL GitHub',
            },
            {
              name: 'twitter',
              type: 'text',
              label: 'URL Twitter/X',
            },
          ],
        },
      ],
    },
  ],
}