// ========== src/globals/Landing.ts ========== //

import type { GlobalConfig } from 'payload'

export const Landing: GlobalConfig = {
  slug: 'landing-page',
  label: 'Contenido Home',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // --- TAB 1: HERO (Ya existía) ---
        {
          label: 'Sección Hero',
          fields: [
            {
              name: 'heroBadge',
              type: 'text',
              label: 'Etiqueta Superior (Badge)',
              defaultValue: 'Nuevo: Pool-Control Beta Disponible',
            },
            {
              name: 'heroTitle',
              type: 'text',
              label: 'Título Principal',
              required: true,
              defaultValue: 'Arquitectos de Ecosistemas Digitales',
            },
            {
              name: 'heroSubtitle',
              type: 'textarea',
              label: 'Subtítulo',
              required: true,
              defaultValue: 'Transformamos negocios con software a medida de alto rendimiento. Desde PWAs ultra-rápidas hasta infraestructuras SaaS complejas.',
            },
          ],
        },

        // --- TAB 2: BARRA DE CONFIANZA (NUEVO) ---
        {
          label: 'Barra de Confianza',
          fields: [
            {
              name: 'trustBarTitle',
              type: 'text',
              label: 'Título pequeño (sobre los logos)',
              defaultValue: 'Tecnologías que impulsan nuestros productos',
            },
            {
              name: 'trustLogos',
              type: 'relationship',
              relationTo: 'media',
              hasMany: true,
              label: 'Logos Tecnológicos o Clientes',
              admin: {
                description: 'Selecciona los logos que aparecerán en la barra gris (se mostrarán en escala de grises automáticamente).',
              },
            },
          ],
        },

        // --- TAB 3: PRODUCTOS (Ya existía) ---
        {
          label: 'Sección Productos',
          fields: [
            {
              name: 'productsTitle',
              type: 'text',
              label: 'Título Sección Productos',
              defaultValue: 'Soluciones OHCodex',
            },
            {
              name: 'productsDescription',
              type: 'textarea',
              label: 'Descripción Sección Productos',
              defaultValue: 'Software diseñado para resolver problemas reales. Desde la automatización de infraestructura hasta la gestión comercial.',
            },
          ],
        },

        // --- TAB 4: METODOLOGÍA (Ya existía) ---
        {
          label: 'Sección Metodología',
          fields: [
            {
              name: 'featuresTitle',
              type: 'text',
              label: 'Título Metodología',
              defaultValue: 'Más allá del código: Ingeniería de Producto',
            },
            {
              name: 'featuresDescription',
              type: 'textarea',
              label: 'Descripción Metodología',
              defaultValue: 'En OHCodex no somos una factoría de software al peso. Actuamos como tu socio tecnológico.',
            },
            {
              name: 'featuresList',
              type: 'array',
              label: 'Lista de Características',
              minRows: 3,
              maxRows: 4,
              labels: {
                singular: 'Característica',
                plural: 'Características',
              },
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  label: 'Icono',
                  defaultValue: 'zap',
                  options: [
                    { label: 'Smartphone (PWA)', value: 'smartphone' },
                    { label: 'Rayo (Rendimiento)', value: 'zap' },
                    { label: 'Base de Datos (Integración)', value: 'database' },
                    { label: 'Escudo (Seguridad/Escalabilidad)', value: 'shield' },
                  ],
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Título',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Descripción',
                  required: true,
                },
              ],
            },
          ],
        },

        // --- TAB 5: TESTIMONIOS (NUEVO) ---
        {
          label: 'Testimonios',
          fields: [
            {
              name: 'testimonialsTitle',
              type: 'text',
              label: 'Título Sección Testimonios',
              defaultValue: 'Confianza que se construye con código',
            },
            {
              name: 'testimonialsSubtitle',
              type: 'textarea',
              label: 'Subtítulo',
              defaultValue: 'Lo que dicen los líderes técnicos que ya escalan con nuestra arquitectura.',
            },
            {
              name: 'testimonials',
              type: 'array',
              label: 'Lista de Reseñas',
              labels: {
                singular: 'Testimonio',
                plural: 'Testimonios',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'authorName',
                      type: 'text',
                      label: 'Nombre Autor',
                      required: true,
                      admin: { width: '50%' },
                    },
                    {
                      name: 'authorRole',
                      type: 'text',
                      label: 'Cargo (ej: CTO)',
                      required: true,
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  name: 'companyName',
                  type: 'text',
                  label: 'Empresa',
                  required: true,
                },
                {
                  name: 'quote',
                  type: 'textarea',
                  label: 'La Cita / Opinión',
                  required: true,
                },
                {
                  name: 'authorImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Foto del Autor',
                },
              ],
            },
          ],
        },

        // --- TAB 6: FAQ (NUEVO) ---
        {
          label: 'FAQs',
          fields: [
            {
              name: 'faqTitle',
              type: 'text',
              label: 'Título Sección FAQ',
              defaultValue: 'Preguntas Frecuentes',
            },
            {
              name: 'faqSubtitle',
              type: 'textarea',
              label: 'Subtítulo',
              defaultValue: 'Todo lo que necesitas saber sobre nuestra forma de trabajar.',
            },
            {
              name: 'faqs',
              type: 'array',
              label: 'Lista de Preguntas',
              labels: {
                singular: 'Pregunta',
                plural: 'Preguntas',
              },
              fields: [
                {
                  name: 'question',
                  type: 'text',
                  label: 'Pregunta',
                  required: true,
                },
                {
                  name: 'answer',
                  type: 'textarea',
                  label: 'Respuesta',
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}