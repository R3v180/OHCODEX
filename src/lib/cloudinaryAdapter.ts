// ========== src/lib/cloudinaryAdapter.ts ========== //

import { v2 as cloudinary } from 'cloudinary'
import type { CollectionBeforeChangeHook, CollectionAfterDeleteHook, CollectionAfterReadHook } from 'payload'

// 1. Configuración
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// 2. Hook de Subida (BeforeChange)
export const uploadToCloudinary: CollectionBeforeChangeHook = async ({ data, req }) => {
  if (req.file) {
    try {
      const file = req.file
      
      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'ohcodex-media',
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary Error:', error)
              reject(error)
            } else {
              resolve(result)
            }
          }
        )
        uploadStream.end(file.data)
      })

      // Guardamos metadatos básicos
      data.width = result.width
      data.height = result.height
      data.filesize = result.bytes
      data.mimeType = result.resource_type === 'image' ? `image/${result.format}` : 'application/pdf'
      data.publicId = result.public_id 
      
      // IMPORTANTE: Guardamos la URL real en un campo persistente propio
      // Payload sobreescribirá 'url', así que necesitamos esta copia de seguridad
      data.cloudinaryURL = result.secure_url

    } catch (error) {
      console.error('Error fatal subiendo a Cloudinary:', error)
      throw new Error('Fallo en la subida de imagen externa.')
    }
  }
  
  return data
}

// 3. Hook de Lectura (AfterRead) - NUEVO
// Este hook se ejecuta cuando el frontend o el admin piden los datos.
// Aquí "engañamos" a Payload y le decimos que la URL es la de Cloudinary.
export const useCloudinaryUrl: CollectionAfterReadHook = ({ doc }) => {
  if (doc.cloudinaryURL) {
    doc.url = doc.cloudinaryURL
    
    // Si la imagen tiene tamaños generados (thumbnails), también arreglamos sus URLs
    // (Truco simple: Cloudinary permite redimensionar via URL, pero por ahora apuntamos al original para evitar errores 404)
    if (doc.sizes) {
      Object.keys(doc.sizes).forEach((key) => {
        if (doc.sizes[key]) {
          doc.sizes[key].url = doc.cloudinaryURL
        }
      })
    }
  }
  return doc
}

// 4. Hook de Borrado (AfterDelete)
export const deleteFromCloudinary: CollectionAfterDeleteHook = async ({ doc }) => {
  try {
    if (doc.publicId) {
      await cloudinary.uploader.destroy(doc.publicId)
      console.log(`Imagen borrada de Cloudinary: ${doc.publicId}`)
    }
  } catch (error) {
    console.error('Error borrando imagen de Cloudinary:', error)
  }
}

// ========== Fin de src/lib/cloudinaryAdapter.ts ========== //
