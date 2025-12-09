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
        // --- TAB 1: HERO ---
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

        // --- TAB 2: BARRA DE CONFIANZA ---
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
            },
          ],
        },

        // --- TAB 3: PRODUCTOS (CONFIGURABLE) ---
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
            // --- NUEVO: CONFIGURACIÓN DE DISEÑO ---
            {
              type: 'row',
              fields: [
                {
                  name: 'productsGridCols',
                  type: 'select',
                  label: 'Columnas en PC',
                  defaultValue: '3',
                  options: [
                    { label: '2 Columnas (Ideal para 2 o 4 items)', value: '2' },
                    { label: '3 Columnas (Estándar)', value: '3' },
                    { label: '4 Columnas (Compacto)', value: '4' },
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

        // --- TAB 4: METODOLOGÍA (CONFIGURABLE) ---
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
            // --- NUEVO: CONFIGURACIÓN DE DISEÑO ---
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

        // --- TAB 5: TESTIMONIOS ---
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

        // --- TAB 6: FAQ ---
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