// ========== src/globals/Landing.ts ========== //

// -----------------------------------------------------------------------------
// Archivo: src/globals/Landing.ts
// Versión: 1.0.0
// Descripción: Configuración global para los textos y contenidos de la página de inicio.
// Permite al administrador cambiar el marketing sin tocar código.
// -----------------------------------------------------------------------------

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
      ],
    },
  ],
}

// ========== Fin de src/globals/Landing.ts ========== //