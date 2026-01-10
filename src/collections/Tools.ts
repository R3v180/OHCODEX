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
        // 1. Regenerar el Hub de herramientas
        revalidatePath(`/${req.locale}/tools`)
        revalidatePath('/tools')
        
        // 2. Regenerar la página individual de la herramienta
        if (doc.slug) {
          revalidatePath(`/${req.locale}/tools/${doc.slug}`)
        }

        console.log(`🔄 Herramienta regenerada: ${doc.title}`)
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
                  // No localizado para mantener consistencia técnica en la URL si prefieres
                  // O localized: true si quieres /es/tools/cifrado y /en/tools/encryption
                  // Por simplicidad en la V3.0, lo dejaremos global (ej: /tools/vault en ambos)
                  label: 'Slug URL', 
                  admin: {
                    description: 'Identificador en la URL (ej: vault, pdf-studio).',
                  },
                },
                {
                  name: 'codeKey',
                  type: 'select',
                  required: true,
                  label: 'Motor Técnico (Componente React)',
                  admin: {
                    description: 'Selecciona qué herramienta funcional cargar aquí.',
                  },
                  options: [
                    { label: 'Vault (Encriptación)', value: 'vault' },
                    { label: 'Image Optimizer', value: 'image-optimizer' },
                    { label: 'PDF Studio', value: 'pdf-studio' },
                    { label: 'Data Station (JSON/SQL)', value: 'data-station' },
                    { label: 'QR Factory', value: 'qr-factory' },
                  ],
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
                  type: 'select',
                  label: 'Icono Visual',
                  defaultValue: 'box',
                  options: [
                    { label: 'Candado (Vault)', value: 'lock' },
                    { label: 'Imagen/Foto', value: 'image' },
                    { label: 'Documento PDF', value: 'file-text' },
                    { label: 'Base de Datos', value: 'database' },
                    { label: 'Código QR', value: 'qr-code' },
                    { label: 'Caja Genérica', value: 'box' },
                  ],
                  admin: { width: '50%' },
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

        // --- PESTAÑA 2: CONTENIDO SEO (Below the fold) ---
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

        // --- PESTAÑA 3: MARKETING (Cross-Selling) ---
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

        // --- PESTAÑA 4: META TAGS ---
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