import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Producto',
    plural: 'Productos',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'isFeatured'],
  },
  access: {
    read: () => true, // Importante: acceso público para que la web pueda leerlos
  },
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
        position: 'sidebar',
        description: 'Identificador URL (ej: pool-control)',
      },
    },
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
        position: 'sidebar',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: '¿Producto Destacado?',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Si se marca, saldrá más grande en la home',
      },
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
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo o Icono',
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen de Fondo (Card)',
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
}