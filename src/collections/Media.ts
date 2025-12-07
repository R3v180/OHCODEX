// ========== src/collections/Media.ts ========== //
import type { CollectionConfig } from 'payload'
// Importamos los hooks de nuestro adaptador personalizado
import { uploadToCloudinary, deleteFromCloudinary } from '../lib/cloudinaryAdapter'
export const Media: CollectionConfig = {
slug: 'media',
labels: {
singular: 'Archivo Multimedia',
plural: 'Archivos Multimedia',
},
access: {
read: () => true,
},
// AQUÍ ESTÁ LA MAGIA: Conectamos los eventos
hooks: {
beforeChange: [uploadToCloudinary], // Antes de guardar, sube a Cloudinary
afterDelete: [deleteFromCloudinary], // Al borrar en Payload, borra en Cloudinary
},
fields: [
{
name: 'alt',
type: 'text',
required: true,
label: 'Texto Alternativo (Alt)',
},
// Añadimos un campo oculto para guardar el ID de Cloudinary (necesario para borrar)
{
name: 'publicId',
type: 'text',
admin: {
hidden: true,
},
},
],
upload: {
staticDir: 'media', // Payload necesita esto por defecto, pero Cloudinary lo ignorará al sobreescribir la URL
adminThumbnail: 'thumbnail',
mimeTypes: ['image/*', 'application/pdf'],
},
}
// ========== Fin de src/collections/Media.ts ========== // 