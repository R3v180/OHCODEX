/**
 * Image Engine - Image processing and optimization using Canvas API
 * Client-side only, no server dependencies
 */

export interface ImageProcessingOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number // 0 to 1
  format?: 'image/jpeg' | 'image/png' | 'image/webp'
  watermark?: {
    image?: File | string
    text?: string
    opacity?: number
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
    scale?: number // 0 to 1, relative to image size
  }
  stripExif?: boolean // Default true for privacy
}

export interface ProcessedImage {
  blob: Blob
  originalSize: number
  processedSize: number
  width: number
  height: number
}

/**
 * Process a single image according to options
 */
export async function processImage(
  file: File,
  options: ImageProcessingOptions = {}
): Promise<ProcessedImage> {
  const {
    maxWidth = Infinity,
    maxHeight = Infinity,
    quality = 0.8,
    format = 'image/webp',
    watermark,
    stripExif = true
  } = options

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          throw new Error('Failed to get canvas context')
        }

        // Calculate new dimensions
        let { width, height } = img

        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height

          if (width > maxWidth) {
            width = maxWidth
            height = width / aspectRatio
          }

          if (height > maxHeight) {
            height = maxHeight
            width = height * aspectRatio
          }

          width = Math.round(width)
          height = Math.round(height)
        }

        canvas.width = width
        canvas.height = height

        // Draw image (this strips EXIF metadata)
        ctx.drawImage(img, 0, 0, width, height)

        // Apply watermark if specified
        if (watermark) {
          applyWatermark(ctx, watermark, width, height)
        }

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({
                blob,
                originalSize: file.size,
                processedSize: blob.size,
                width,
                height
              })
            } else {
              reject(new Error('Failed to process image'))
            }
          },
          format,
          quality
        )
      } catch (error) {
        reject(error)
      }
    }

    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Process multiple images in batch
 */
export async function processBatch(
  files: File[],
  options: ImageProcessingOptions = {},
  onProgress?: (index: number, total: number, result: ProcessedImage) => void
): Promise<ProcessedImage[]> {
  const results: ProcessedImage[] = []

  for (let i = 0; i < files.length; i++) {
    try {
      const result = await processImage(files[i], options)
      results.push(result)

      if (onProgress) {
        onProgress(i + 1, files.length, result)
      }
    } catch (error) {
      console.error(`Failed to process image ${i + 1}:`, error)
      throw error
    }
  }

  return results
}

/**
 * Apply watermark to canvas
 */
function applyWatermark(
  ctx: CanvasRenderingContext2D,
  watermark: NonNullable<ImageProcessingOptions['watermark']>,
  canvasWidth: number,
  canvasHeight: number
): void {
  const {
    image,
    text,
    opacity = 0.5,
    position = 'bottom-right',
    scale = 0.15
  } = watermark

  ctx.save()
  ctx.globalAlpha = opacity

  if (image && typeof image === 'string') {
    // Image watermark
    const watermarkImg = new Image()
    watermarkImg.onload = () => {
      const wmWidth = canvasWidth * scale
      const wmHeight = (watermarkImg.height / watermarkImg.width) * wmWidth

      const { x, y } = getPosition(
        position,
        wmWidth,
        wmHeight,
        canvasWidth,
        canvasHeight
      )

      ctx.drawImage(watermarkImg, x, y, wmWidth, wmHeight)
      ctx.restore()
    }
    watermarkImg.src = image
  } else if (text) {
    // Text watermark
    const fontSize = Math.max(canvasWidth * 0.05, 24)
    ctx.font = `bold ${fontSize}px sans-serif`
    ctx.fillStyle = 'rgba(255, 255, 255, 1)'

    const metrics = ctx.measureText(text)
    const textWidth = metrics.width
    const textHeight = fontSize

    const { x, y } = getPosition(
      position,
      textWidth,
      textHeight,
      canvasWidth,
      canvasHeight,
      true
    )

    ctx.fillText(text, x, y)
    ctx.restore()
  }
}

/**
 * Get watermark position
 */
function getPosition(
  position: string,
  width: number,
  height: number,
  canvasWidth: number,
  canvasHeight: number,
  isText = false
): { x: number; y: number } {
  const padding = 20

  switch (position) {
    case 'top-left':
      return {
        x: padding,
        y: padding + (isText ? height : 0)
      }
    case 'top-right':
      return {
        x: canvasWidth - width - padding,
        y: padding + (isText ? height : 0)
      }
    case 'bottom-left':
      return {
        x: padding,
        y: canvasHeight - height - padding + (isText ? height : 0)
      }
    case 'bottom-right':
      return {
        x: canvasWidth - width - padding,
        y: canvasHeight - height - padding + (isText ? height : 0)
      }
    case 'center':
      return {
        x: (canvasWidth - width) / 2,
        y: (canvasHeight - height) / 2 + (isText ? height : 0)
      }
    default:
      return {
        x: canvasWidth - width - padding,
        y: canvasHeight - height - padding + (isText ? height : 0)
      }
  }
}

/**
 * Get image dimensions without loading the full image
 */
export async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
      URL.revokeObjectURL(img.src)
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Create a thumbnail preview
 */
export async function createThumbnail(
  file: File,
  maxSize: number = 200
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }

      let { width, height } = img

      if (width > height) {
        if (width > maxSize) {
          height = (height / width) * maxSize
          width = maxSize
        }
      } else {
        if (height > maxSize) {
          width = (width / height) * maxSize
          height = maxSize
        }
      }

      canvas.width = width
      canvas.height = height

      ctx.drawImage(img, 0, 0, width, height)

      resolve(canvas.toDataURL('image/jpeg', 0.7))
      URL.revokeObjectURL(img.src)
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Calculate size reduction percentage
 */
export function calculateReduction(original: number, compressed: number): number {
  if (original === 0) return 0
  return Math.round(((original - compressed) / original) * 100)
}
