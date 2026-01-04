import type { CollectionConfig } from 'payload'
import { revalidatePath } from 'next/cache'

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
  // --- MAGIA: Revalidación bajo demanda ---
  hooks: {
    afterChange: [
      async ({ doc }) => {
        // 1. Regenerar el índice del blog
        revalidatePath('/blog')
        
        // 2. Regenerar el artículo específico
        if (doc.slug) {
          revalidatePath(`/blog/${doc.slug}`)
        }

        // 3. Regenerar la home (por si mostramos "Últimos posts" allí)
        revalidatePath('/')

        console.log(`🔄 Blog actualizado: ${doc.title}`)
      },
    ],
  },
  // ----------------------------------------
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
              localized: true, // ✅ AHORA TRADUCIBLE
              label: 'Título del Artículo',
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              localized: true, // ✅ URL DIFERENTE POR IDIOMA
              admin: {
                position: 'sidebar',
                description: 'URL amigable (ej: arquitectura-saas / saas-architecture)',
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
              relationTo: 'users' as any,
              required: true,
              label: 'Autor',
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'category',
              type: 'relationship',
              relationTo: 'categories' as any,
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
              localized: true, // ✅ AHORA TRADUCIBLE
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
              localized: true, // ✅ AHORA TRADUCIBLE
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
              localized: true, // ✅ AHORA TRADUCIBLE
              label: 'Meta Título (Opcional)',
              admin: {
                description: 'Si se deja vacío, se usará el título del artículo.',
              },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              localized: true, // ✅ AHORA TRADUCIBLE
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