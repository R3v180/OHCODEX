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
      localized: true, // 👈 ¡ESTA ES LA CLAVE! Añadido para habilitar traducción
      label: 'Nombre',
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug URL (Opcional)',
      // El slug suele ser mejor no traducirlo si queremos mantener IDs consistentes, 
      // pero si quieres URLs traducidas tipo /es/noticias y /en/news, añádelo aquí también.
      // Por simplicidad, lo dejaré común, pero el nombre sí cambia.
      admin: {
        description: 'Identificador para la URL (ej: tecnologia).',
      },
    },
  ],
}