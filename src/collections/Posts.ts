// ========== src/collections/Posts.ts ========== //

import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Artículo',
    plural: 'Artículos del Blog',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedDate', 'category', 'status'],
  },
  access: {
    read: () => true, // Lectura pública
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // --- PESTAÑA 1: CONTENIDO ---
        {
          label: 'Contenido',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Título del Artículo',
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              admin: {
                position: 'sidebar',
                description: 'URL amigable (ej: arquitectura-saas-escalable)',
              },
            },
            {
              name: 'publishedDate',
              type: 'date',
              required: true,
              label: 'Fecha de Publicación',
              defaultValue: () => new Date(),
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'author',
              type: 'relationship',
              relationTo: 'users' as any, // 'as any' para evitar error circular inicial
              required: true,
              label: 'Autor',
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'category',
              type: 'relationship',
              relationTo: 'categories' as any, // 'as any' para evitar error circular inicial
              required: true,
              label: 'Categoría',
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Imagen Principal (Cover)',
            },
            {
              name: 'excerpt',
              type: 'textarea',
              required: true,
              label: 'Extracto / Resumen',
              maxLength: 300,
              admin: {
                description: 'Texto breve que aparecerá en la tarjeta del blog.',
              },
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
              label: 'Cuerpo del Artículo',
            },
          ],
        },

        // --- PESTAÑA 2: SEO ---
        {
          label: 'SEO',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              label: 'Meta Título (Opcional)',
              admin: {
                description: 'Si se deja vacío, se usará el título del artículo.',
              },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              label: 'Meta Descripción (Opcional)',
              minLength: 50,
              maxLength: 160,
              admin: {
                description: 'Si se deja vacío, se usará el extracto.',
              },
            },
          ],
        },
      ],
    },
  ],
}