import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Producto',
    plural: 'Productos',
  },
  // CORRECCIÓN: defaultSort va aquí, en la raíz
  defaultSort: 'order',
  
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'order', 'status', 'isFeatured'],
  },
  access: {
    read: () => true, // Acceso público para la web
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // --- PESTAÑA 1: INFORMACIÓN PRINCIPAL ---
        {
          label: 'Información General',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              label: 'Nombre del Producto',
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              admin: {
                description: 'Identificador URL (ej: pool-control)',
              },
            },
            // --- NUEVO CAMPO DE ORDEN ---
            {
              name: 'order',
              type: 'number',
              label: 'Orden de Aparición',
              required: true,
              defaultValue: 10, // Valor alto por defecto
              admin: {
                position: 'sidebar',
                description: '1 aparece primero, 2 segundo, etc.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'status',
                  type: 'select',
                  required: true,
                  defaultValue: 'development',
                  options: [
                    { label: 'Concepto', value: 'concept' },
                    { label: 'En Desarrollo', value: 'development' },
                    { label: 'Beta Pública', value: 'beta' },
                    { label: 'En Producción (Live)', value: 'live' },
                  ],
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'isFeatured',
                  type: 'checkbox',
                  label: '¿Producto Destacado?',
                  defaultValue: false,
                  admin: {
                    width: '50%',
                    description: 'Si se marca, saldrá más grande en la home (dependiendo del diseño).',
                  },
                },
              ],
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              required: true,
              label: 'Descripción Corta (Tarjeta)',
              maxLength: 250,
            },
            {
              name: 'description',
              type: 'richText', // Editor visual completo
              label: 'Caso de Éxito / Detalle',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'logo',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Logo o Icono',
                  admin: { width: '50%' },
                },
                {
                  name: 'heroImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Imagen de Fondo (Card)',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'projectUrl',
              type: 'text',
              label: 'Enlace externo (si existe)',
            },
            {
              name: 'technologies',
              type: 'array',
              label: 'Tecnologías Usadas',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  label: 'Tecnología (ej: React, IoT)',
                },
              ],
            },
          ],
        },
        
        // --- PESTAÑA 2: SEO ESPECÍFICO ---
        {
          label: 'SEO',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              label: 'Meta Título (Opcional)',
              admin: {
                description: 'Si se deja vacío, se usará el nombre del producto.',
              },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              label: 'Meta Descripción (Opcional)',
              admin: {
                description: 'Si se deja vacío, se usará la descripción corta.',
              },
              minLength: 50,
              maxLength: 160,
            },
          ],
        },

        // --- PESTAÑA 3: RELACIONADOS ---
        {
          label: 'Relacionados',
          fields: [
            {
              name: 'relatedProducts',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              label: 'Productos Relacionados',
              admin: {
                description: 'Selecciona otros productos para mostrar al final de la página y mejorar el enlazado interno.',
              },
            },
          ],
        },
      ],
    },
  ],
}