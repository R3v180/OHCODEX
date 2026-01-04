import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

export const Landing: GlobalConfig = {
  slug: 'landing-page',
  label: 'Contenido Home',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async () => {
        revalidatePath('/')
        console.log('🔄 Home regenerada bajo demanda')
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Sección Hero',
          fields: [
            {
              name: 'heroBadge',
              type: 'text',
              label: 'Etiqueta Superior (Badge)',
              localized: true, // ✅
              defaultValue: 'Nuevo: Pool-Control Beta Disponible',
            },
            {
              name: 'heroTitle',
              type: 'text',
              label: 'Título Principal',
              required: true,
              localized: true, // ✅
              defaultValue: 'Arquitectos de Ecosistemas Digitales',
            },
            {
              name: 'heroSubtitle',
              type: 'textarea',
              label: 'Subtítulo',
              required: true,
              localized: true, // ✅
              defaultValue: 'Transformamos negocios con software a medida de alto rendimiento. Desde PWAs ultra-rápidas hasta infraestructuras SaaS complejas.',
            },
          ],
        },
        {
          label: 'Barra de Confianza',
          fields: [
            {
              name: 'trustBarTitle',
              type: 'text',
              label: 'Título pequeño (sobre los logos)',
              localized: true, // ✅
              defaultValue: 'Tecnologías que impulsan nuestros productos',
            },
            {
              name: 'trustLogos',
              type: 'relationship',
              relationTo: 'media',
              hasMany: true,
              label: 'Logos Tecnológicos o Clientes',
            },
          ],
        },
        {
          label: 'Sección Productos',
          fields: [
            {
              name: 'productsTitle',
              type: 'text',
              label: 'Título Sección Productos',
              localized: true, // ✅
              defaultValue: 'Soluciones OHCodex',
            },
            {
              name: 'productsDescription',
              type: 'textarea',
              label: 'Descripción Sección Productos',
              localized: true, // ✅
              defaultValue: 'Software diseñado para resolver problemas reales. Desde la automatización de infraestructura hasta la gestión comercial.',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'productsGridCols',
                  type: 'select',
                  label: 'Columnas en PC',
                  defaultValue: '3',
                  options: [
                    { label: '2 Columnas', value: '2' },
                    { label: '3 Columnas', value: '3' },
                    { label: '4 Columnas', value: '4' },
                  ],
                  admin: { width: '50%' },
                },
                {
                  name: 'productsAlign',
                  type: 'select',
                  label: 'Alineación de Texto',
                  defaultValue: 'center',
                  options: [
                    { label: 'Centrado', value: 'center' },
                    { label: 'Izquierda', value: 'left' },
                  ],
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
        {
          label: 'Sección Metodología',
          fields: [
            {
              name: 'featuresTitle',
              type: 'text',
              label: 'Título Metodología',
              localized: true, // ✅
              defaultValue: 'Más allá del código: Ingeniería de Producto',
            },
            {
              name: 'featuresDescription',
              type: 'textarea',
              label: 'Descripción Metodología',
              localized: true, // ✅
              defaultValue: 'En OHCodex no somos una factoría de software al peso. Actuamos como tu socio tecnológico.',
            },
            {
              name: 'featuresAlign',
              type: 'select',
              label: 'Diseño de la Sección',
              defaultValue: 'left',
              options: [
                { label: 'Izquierda (Texto Izq + Grid Der)', value: 'left' },
                { label: 'Centro (Texto Arriba + Grid Abajo)', value: 'center' },
              ],
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
                    { label: 'Escudo (Seguridad)', value: 'shield' },
                    { label: 'Código (Desarrollo)', value: 'code' },
                    { label: 'Usuarios (Equipo)', value: 'users' },
                    { label: 'Cohete (Lanzamiento)', value: 'rocket' },
                  ],
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Título',
                  localized: true, // ✅
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Descripción',
                  localized: true, // ✅
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Testimonios',
          fields: [
            {
              name: 'testimonialsTitle',
              type: 'text',
              label: 'Título Sección Testimonios',
              localized: true, // ✅
              defaultValue: 'Confianza que se construye con código',
            },
            {
              name: 'testimonialsSubtitle',
              type: 'textarea',
              label: 'Subtítulo',
              localized: true, // ✅
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
                      localized: true, // ✅
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
                  localized: true, // ✅
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
        {
          label: 'FAQs',
          fields: [
            {
              name: 'faqTitle',
              type: 'text',
              label: 'Título Sección FAQ',
              localized: true, // ✅
              defaultValue: 'Preguntas Frecuentes',
            },
            {
              name: 'faqSubtitle',
              type: 'textarea',
              label: 'Subtítulo',
              localized: true, // ✅
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
                  localized: true, // ✅
                  required: true,
                },
                {
                  name: 'answer',
                  type: 'textarea',
                  label: 'Respuesta',
                  localized: true, // ✅
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