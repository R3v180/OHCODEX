import type { CollectionConfig } from 'payload'
import { revalidatePath } from 'next/cache'

export const Tools: CollectionConfig = {
  slug: 'tools',
  labels: {
    singular: 'Herramienta',
    plural: 'Suite de Herramientas',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'codeKey', 'status'],
    description: 'Gestiona las Landing Pages de las herramientas (SEO, Textos y Marketing).',
  },
  access: {
    read: () => true, // Lectura pública para la web
  },
  // --- REVALIDACIÓN AUTOMÁTICA ---
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        try {
          if (req.locale) {
            revalidatePath(`/${req.locale}/tools`)
          }
          revalidatePath('/tools')

          if (doc.slug && req.locale) {
            revalidatePath(`/${req.locale}/tools/${doc.slug}`)
          }

          console.log(`🔄 Herramienta regenerada: ${doc.title}`)
        } catch (error) {
          console.log(`⚠️ Skip revalidate: Contexto externo detectado para ${doc.title}`)
        }
      },
    ],
  },
  // -------------------------------
  fields: [
    {
      type: 'tabs',
      tabs: [
        // --- PESTAÑA 1: CONFIGURACIÓN ---
        {
          label: 'Configuración General',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              localized: true,
              label: 'Nombre Público (H1)',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'slug',
                  type: 'text',
                  required: true,
                  unique: true,
                  label: 'Slug URL',
                  admin: {
                    description: 'Identificador en la URL (ej: vault, pdf-studio).',
                  },
                },
                {
                  name: 'codeKey',
                  type: 'text',
                  required: true,
                  label: 'Motor Técnico (Componente React)',
                  admin: {
                    description: 'Valores: vault, image-optimizer, pdf-studio, data-station, qr-factory, ocr-vision, base64, css-minifier, password-gen, jwt-decoder, regex-tester, color-palette, file-carver, hex-diff',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'badge',
                  type: 'text',
                  localized: true,
                  label: 'Etiqueta (Badge)',
                  admin: {
                    description: 'Ej: Nuevo, Beta, Popular, Privado.',
                    width: '50%',
                  },
                },
                {
                  name: 'icon',
                  type: 'text',
                  label: 'Icono Visual',
                  defaultValue: 'box',
                  admin: {
                    width: '50%',
                    description: 'Valores: lock, image, file-text, database, qr-code, scan, code, palette, key, key-round, regex, box, dna, split-square-horizontal'
                  },
                },
              ],
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              localized: true,
              label: 'Descripción Corta (Card)',
              required: true,
              maxLength: 180,
              admin: {
                description: 'Aparece en la tarjeta del Hub de herramientas.',
              },
            },
          ],
        },

        // --- PESTAÑA 2: GUÍA DE USO (3 PASOS) ---
        // Nuevo campo para mejorar UX
        {
          label: 'Guía de Uso (Pasos)',
          fields: [
            {
              name: 'steps',
              type: 'array',
              label: 'Pasos (Exactamente 3)',
              minRows: 3,
              maxRows: 3,
              required: true,
              localized: true,
              labels: {
                singular: 'Paso',
                plural: 'Pasos',
              },
              fields: [
                {
                  name: 'stepTitle',
                  type: 'text',
                  label: 'Título del Paso',
                  required: true,
                },
                {
                  name: 'stepDescription',
                  type: 'textarea',
                  label: 'Breve explicación',
                },
                {
                  name: 'stepIcon',
                  type: 'select',
                  label: 'Icono del Paso',
                  defaultValue: 'upload',
                  options: [
                    { label: 'Subir / Cargar', value: 'upload' },
                    { label: 'Ajustes / Config', value: 'settings' },
                    { label: 'Procesar / Rayo', value: 'zap' },
                    { label: 'Descargar', value: 'download' },
                    { label: 'Candado / Seguridad', value: 'lock' },
                    { label: 'Escribir / Editar', value: 'edit' },
                  ],
                },
              ],
            },
          ],
        },

        // --- PESTAÑA 3: CONTENIDO SEO (Below the fold) ---
        {
          label: 'Contenido SEO',
          fields: [
            {
              name: 'content',
              type: 'richText',
              localized: true,
              label: 'Explicación Larga (Debajo de la herramienta)',
              admin: {
                description: 'Usa esto para explicar cómo funciona, ventajas, tutorial, etc.',
              },
            },
            {
              name: 'faqs',
              type: 'array',
              label: 'Preguntas Frecuentes (Schema FAQ)',
              localized: true,
              fields: [
                {
                  name: 'question',
                  type: 'text',
                  label: 'Pregunta',
                },
                {
                  name: 'answer',
                  type: 'textarea',
                  label: 'Respuesta',
                },
              ],
            },
          ],
        },

        // --- PESTAÑA 4: MARKETING (Cross-Selling) ---
        {
          label: 'Marketing & Venta',
          fields: [
            {
              name: 'ctaTitle',
              type: 'text',
              localized: true,
              label: 'Título del Banner de Venta',
              defaultValue: '¿Necesitas una solución a medida?',
            },
            {
              name: 'ctaDescription',
              type: 'textarea',
              localized: true,
              label: 'Texto del Banner',
              defaultValue: 'Nuestro equipo de ingeniería puede integrar esta tecnología en tu empresa.',
            },
            {
              name: 'ctaLink',
              type: 'text',
              label: 'Enlace del Botón (Opcional)',
              admin: {
                description: 'Por defecto lleva al formulario de contacto (#contact).',
              },
            },
          ],
        },

        // --- PESTAÑA 5: META TAGS ---
        {
          label: 'Metadatos',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              localized: true,
              label: 'Meta Title',
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              localized: true,
              label: 'Meta Description',
              minLength: 50,
              maxLength: 160,
            },
          ],
        },
      ],
    },
  ],
}