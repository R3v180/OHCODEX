import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Archivo Multimedia',
    plural: 'Archivos Multimedia',
  },
  access: {
    // Por ahora, cualquiera puede ver las imágenes (para que la web cargue)
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Texto Alternativo (Alt)',
    },
  ],
  upload: {
    staticDir: 'media', // Guardará los archivos en la carpeta /media del proyecto
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'hero', // Para fondos grandes
        width: 1920,
        height: 1080,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'application/pdf'], // Aceptamos imágenes y PDFs
  },
}