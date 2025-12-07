// ========== src/lib/cloudinaryAdapter.ts ========== //

import { v2 as cloudinary } from 'cloudinary'
import type { CollectionBeforeChangeHook, CollectionAfterDeleteHook, CollectionAfterReadHook } from 'payload'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

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

      data.width = result.width
      data.height = result.height
      data.filesize = result.bytes
      data.mimeType = result.resource_type === 'image' ? `image/${result.format}` : 'application/pdf'
      data.publicId = result.public_id 
      
      // CAMBIO: Usamos 'externalUrl'
      data.externalUrl = result.secure_url

    } catch (error) {
      console.error('Error fatal subiendo a Cloudinary:', error)
      throw new Error('Fallo en la subida de imagen externa.')
    }
  }
  
  return data
}

export const useCloudinaryUrl: CollectionAfterReadHook = ({ doc }) => {
  // CAMBIO: Usamos 'externalUrl'
  if (doc.externalUrl) {
    doc.url = doc.externalUrl
    
    if (doc.sizes) {
      Object.keys(doc.sizes).forEach((key) => {
        if (doc.sizes[key]) {
          doc.sizes[key].url = doc.externalUrl
        }
      })
    }
  }
  return doc
}

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