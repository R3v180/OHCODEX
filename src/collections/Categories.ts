    // ========== src/collections/Categories.ts ========== //

import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Categoría',
    plural: 'Categorías',
  },
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true, // Lectura pública para la web
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nombre',
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug URL (Opcional)',
      admin: {
        description: 'Identificador para la URL (ej: tecnologia, noticias). Si se deja vacío, se puede usar el nombre.',
      },
    },
  ],
}