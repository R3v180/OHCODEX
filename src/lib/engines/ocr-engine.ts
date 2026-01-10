import { createWorker } from 'tesseract.js'

// Idiomas soportados (puedes añadir más buscando sus códigos ISO 639-2)
export type OCRLanguage = 'eng' | 'spa' | 'fra' | 'deu' | 'ita' | 'por'

export interface OCRResult {
  text: string
  confidence: number
}

// Variables globales para mantener el worker activo en memoria (Singleton)
let worker: any = null
let currentLang: OCRLanguage | null = null

/**
 * Función principal para reconocer texto
 * @param image - Archivo File, Blob o URL string
 * @param lang - Idioma del texto a reconocer
 * @param onProgress - Callback para la barra de progreso (0-100)
 */
export const recognizeText = async (
  image: File | string | Blob, 
  lang: OCRLanguage = 'eng',
  onProgress?: (progress: number) => void
): Promise<OCRResult> => {
  
  // 1. Inicialización o Cambio de Idioma
  // Si no hay worker o el idioma ha cambiado, recreamos el worker
  if (!worker || currentLang !== lang) {
    // Si ya existía uno en otro idioma, lo matamos para liberar memoria
    if (worker) {
      await worker.terminate()
    }
    
    // Creamos el nuevo worker con el idioma seleccionado
    worker = await createWorker(lang, 1, {
      logger: (m: any) => {
        // Filtramos solo el estado de reconocimiento para la barra de progreso
        if (m.status === 'recognizing text' && onProgress) {
          onProgress(m.progress * 100)
        }
      },
      // Cacheamos los datos entrenados en el navegador para que la próxima vez sea instantáneo
      cacheMethod: 'write',
      cachePath: '.', 
    })
    
    currentLang = lang
  }

  // 2. Reconocimiento
  const { data } = await worker.recognize(image)
  
  return {
    text: data.text,
    confidence: data.confidence
  }
}

/**
 * Limpieza de memoria
 * Útil para desmontar el componente si el usuario sale de la página
 */
export const terminateOCR = async () => {
  if (worker) {
    await worker.terminate()
    worker = null
    currentLang = null
  }
}