// ========== src/lib/cloudinaryAdapter.ts ========== //

import { v2 as cloudinary } from 'cloudinary'
import type { CollectionBeforeChangeHook, CollectionAfterDeleteHook } from 'payload'

// 1. Configuración inicial con las credenciales del .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// 2. Hook de Subida (BeforeChange)
export const uploadToCloudinary: CollectionBeforeChangeHook = async ({ data, req }) => {
  // Solo procesamos si hay un archivo adjunto en la petición
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

      // 3. Sobreescribimos los datos con la respuesta de Cloudinary
      data.url = result.secure_url
      data.width = result.width
      data.height = result.height
      data.filesize = result.bytes
      data.mimeType = result.resource_type === 'image' ? `image/${result.format}` : 'application/pdf'
      
      // CAMBIO IMPORTANTE: Guardamos el ID de Cloudinary en su campo específico
      data.publicId = result.public_id 

    } catch (error) {
      console.error('Error fatal subiendo a Cloudinary:', error)
      throw new Error('Fallo en la subida de imagen externa.')
    }
  }
  
  return data
}

// 3. Hook de Borrado (AfterDelete)
export const deleteFromCloudinary: CollectionAfterDeleteHook = async ({ doc }) => {
  try {
    // CAMBIO IMPORTANTE: Usamos publicId para borrar, es más seguro
    if (doc.publicId) {
      await cloudinary.uploader.destroy(doc.publicId)
      console.log(`Imagen borrada de Cloudinary: ${doc.publicId}`)
    }
  } catch (error) {
    console.error('Error borrando imagen de Cloudinary:', error)
  }
}

// ========== Fin de src/lib/cloudinaryAdapter.ts ========== //
