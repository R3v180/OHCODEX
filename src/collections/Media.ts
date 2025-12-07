// ========== src/collections/Media.ts ========== //
import type { CollectionConfig } from 'payload'
// Importamos los 3 hooks del adaptador (incluido el nuevo useCloudinaryUrl)
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
beforeChange: [uploadToCloudinary], // Sube a Cloudinary y guarda la URL segura
afterRead: [useCloudinaryUrl], // "Engaña" al frontend para usar la URL de Cloudinary
afterDelete: [deleteFromCloudinary], // Limpia basura en Cloudinary
},
fields: [
{
name: 'alt',
type: 'text',
required: true,
label: 'Texto Alternativo (Alt)',
},
// Campo técnico para borrar la imagen
{
name: 'publicId',
type: 'text',
admin: {
hidden: true,
},
},
// NUEVO CAMPO: Guardamos aquí la URL real de Cloudinary
{
name: 'cloudinaryURL',
type: 'text',
admin: {
hidden: true,
},
},
],
upload: {
staticDir: 'media', // Carpeta "falsa" para cumplir con Payload
adminThumbnail: 'thumbnail',
mimeTypes: ['image/*', 'application/pdf'],
disableLocalStorage: true, // Le decimos a Payload que no intente guardar en disco
},
}
// ========== Fin de src/collections/Media.ts ========== //