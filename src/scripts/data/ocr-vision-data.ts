import { ToolSeedData, createRichText } from './utils'

export const ocrVisionData: ToolSeedData = {
  slug: 'ocr-vision',
  codeKey: 'ocr-vision',
  icon: 'scan', // Icono nuevo que añadimos al CMS
  title: { 
    es: 'OCR Vision', 
    en: 'OCR Vision' 
  },
  badge: { 
    es: 'IA Local Privada', 
    en: 'Private Local AI' 
  },
  shortDescription: { 
    es: 'Extrae texto editable de imágenes, escaneos y documentos (JPG, PNG, HEIC) usando Inteligencia Artificial directamente en tu navegador.', 
    en: 'Extract editable text from images, scans, and documents (JPG, PNG, HEIC) using Artificial Intelligence directly in your browser.' 
  },
  steps: {
    es: [
      { stepTitle: 'Sube la Imagen', stepDescription: 'Aceptamos fotos, capturas de pantalla o escaneos (incluso de iPhone).', stepIcon: 'upload' },
      { stepTitle: 'Selecciona Idioma', stepDescription: 'Elige el idioma del texto para optimizar la precisión de la IA.', stepIcon: 'settings' },
      { stepTitle: 'Extrae el Texto', stepDescription: 'Copia el resultado o descarga un archivo .txt limpio.', stepIcon: 'zap' }
    ],
    en: [
      { stepTitle: 'Upload Image', stepDescription: 'We accept photos, screenshots, or scans (even from iPhone).', stepIcon: 'upload' },
      { stepTitle: 'Select Language', stepDescription: 'Choose the text language to optimize AI accuracy.', stepIcon: 'settings' },
      { stepTitle: 'Extract Text', stepDescription: 'Copy the result or download a clean .txt file.', stepIcon: 'zap' }
    ]
  },
  cta: {
    es: { 
      title: '¿Procesas miles de documentos?', 
      desc: 'Automatizamos la lectura de facturas, albaranes y formularios con IA para integrarlos en tu ERP sin intervención humana.' 
    },
    en: { 
      title: 'Processing thousands of documents?', 
      desc: 'We automate invoice, delivery note, and form reading with AI to integrate them into your ERP without human intervention.' 
    }
  },
  faqs: {
    es: [
      { 
        question: '¿Es seguro escanear mi DNI o documentos confidenciales?', 
        answer: 'Sí, es la opción más segura del mercado gratuito. Usamos Tesseract.js, un motor de OCR que se ejecuta dentro de tu navegador mediante WebAssembly. La imagen nunca se envía a través de internet a ningún servidor.' 
      },
      { 
        question: '¿Soporta texto manuscrito?', 
        answer: 'La tecnología actual funciona de maravilla con texto impreso (libros, documentos, capturas). El reconocimiento de letra manual depende mucho de la caligrafía y puede no ser perfecto.' 
      },
      { 
        question: '¿Qué idiomas soporta?', 
        answer: 'Soportamos los principales idiomas globales: Español, Inglés, Francés, Alemán, Italiano y Portugués. El modelo de IA específico se descarga al momento bajo demanda.' 
      }
    ],
    en: [
      { 
        question: 'Is it safe to scan my ID or confidential documents?', 
        answer: 'Yes, it is the safest free option on the market. We use Tesseract.js, an OCR engine that runs inside your browser via WebAssembly. The image is never sent over the internet to any server.' 
      },
      { 
        question: 'Does it support handwriting?', 
        answer: 'Current technology works wonderfully with printed text (books, documents, screenshots). Handwriting recognition depends heavily on calligraphy and may not be perfect.' 
      },
      { 
        question: 'Which languages are supported?', 
        answer: 'We support major global languages: Spanish, English, French, German, Italian, and Portuguese. The specific AI model is downloaded on-demand.' 
      }
    ]
  },
  content: {
    es: createRichText(
      'Digitalización Inteligente sin Nubes Inseguras', 
      'La mayoría de conversores "Imagen a Texto" gratuitos tienen un coste oculto: tus datos. Subir un contrato confidencial o una identificación personal a un servidor desconocido para extraer el texto es un riesgo de seguridad grave. OCR Vision cambia el paradigma:', 
      [
        'Privacidad Absoluta: El motor de IA (Red Neuronal LSTM) se descarga y corre en tu CPU. Tus archivos nunca salen de tu ordenador.',
        'Soporte HEIC Nativo: Convierte directamente las fotos tomadas con iPhone/iPad sin pasos intermedios.',
        'Multilenguaje Dinámico: Cambia entre Español, Inglés o Francés al instante para mejorar la precisión del reconocimiento.'
      ], 
      'Herramienta esencial para estudiantes que digitalizan apuntes, administrativos que procesan facturas escaneadas y desarrolladores que necesitan extraer texto de interfaces.'
    ),
    en: createRichText(
      'Smart Digitization without Insecure Clouds', 
      'Most free "Image to Text" converters have a hidden cost: your data. Uploading a confidential contract or personal ID to an unknown server just to extract text is a serious security risk. OCR Vision changes the paradigm:', 
      [
        'Absolute Privacy: The AI engine (LSTM Neural Network) downloads and runs on your CPU. Your files never leave your computer.',
        'Native HEIC Support: Directly convert photos taken with iPhone/iPad without intermediate steps.',
        'Dynamic Multilanguage: Switch between Spanish, English, or French instantly to improve recognition accuracy.'
      ], 
      'Essential tool for students digitizing notes, administrators processing scanned invoices, and developers needing to extract text from interfaces.'
    )
  }
}