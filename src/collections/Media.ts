// ========== src/collections/Media.ts ========== //

import type { CollectionConfig } from 'payload'
import { uploadToCloudinary, deleteFromCloudinary, useCloudinaryUrl } from '../lib/cloudinaryAdapter'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Archivo Multimedia',
    plural: 'Archivos Multimedia',
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [uploadToCloudinary],
    afterRead: [useCloudinaryUrl],
    afterDelete: [deleteFromCloudinary],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Texto Alternativo (Alt)',
    },
    {
      name: 'publicId',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    // CAMBIO: Usamos 'externalUrl'
    {
      name: 'externalUrl',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
  ],
  upload: {
    staticDir: 'media',
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'application/pdf'],
    disableLocalStorage: true,
  },
}

// ========== Fin de src/collections/Media.ts ========== //