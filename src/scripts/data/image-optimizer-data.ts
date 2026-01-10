import { ToolSeedData, createRichText } from './utils'

export const imageOptimizerData: ToolSeedData = {
  slug: 'image-optimizer',
  codeKey: 'image-optimizer',
  icon: 'image',
  title: { 
    es: 'Pixel Optimizer', 
    en: 'Pixel Optimizer' 
  },
  badge: { 
    es: 'Soporte HEIC/iPhone', 
    en: 'HEIC/iPhone Support' 
  },
  shortDescription: { 
    es: 'Comprime, redimensiona y convierte imágenes (JPG, PNG, HEIC) a WebP ultraligero. Mejora tu SEO sin subir tus fotos a la nube.', 
    en: 'Compress, resize, and convert images (JPG, PNG, HEIC) to ultra-light WebP. Boost your SEO without uploading photos to the cloud.' 
  },
  steps: {
    es: [
      { stepTitle: 'Arrastra tus Fotos', stepDescription: 'Soporta lotes masivos de JPG, PNG o HEIC (Apple).', stepIcon: 'upload' },
      { stepTitle: 'Define Objetivos', stepDescription: 'Elige calidad, tamaño máximo y formato de salida (WebP/JPG).', stepIcon: 'settings' },
      { stepTitle: 'Procesamiento Local', stepDescription: 'Tu navegador hace el trabajo. Descarga un ZIP al instante.', stepIcon: 'download' }
    ],
    en: [
      { stepTitle: 'Drag your Photos', stepDescription: 'Supports massive batches of JPG, PNG, or HEIC (Apple).', stepIcon: 'upload' },
      { stepTitle: 'Set Targets', stepDescription: 'Choose quality, max width, and output format (WebP/JPG).', stepIcon: 'settings' },
      { stepTitle: 'Local Processing', stepDescription: 'Your browser does the work. Download a ZIP instantly.', stepIcon: 'download' }
    ]
  },
  cta: {
    es: { 
      title: '¿Tu web carga lenta y pierdes clientes?', 
      desc: 'Optimizamos infraestructuras de alto tráfico y e-commerce para superar las Core Web Vitals de Google.' 
    },
    en: { 
      title: 'Is your site slow and losing customers?', 
      desc: 'We optimize high-traffic infrastructures and e-commerce sites to pass Google Core Web Vitals.' 
    }
  },
  faqs: {
    es: [
      { 
        question: '¿Mis fotos se suben a algún servidor?', 
        answer: 'No. Absolutamente todo el proceso (compresión, redimensión, conversión) ocurre dentro de tu navegador. Es ideal para fotógrafos o empresas que manejan imágenes con derechos de autor o datos sensibles.' 
      }, 
      { 
        question: '¿Por qué debería usar WebP?', 
        answer: 'WebP es el formato moderno estándar. Reduce el peso del archivo un 30-50% comparado con JPG sin pérdida visible de calidad, lo que hace que tu web cargue mucho más rápido.' 
      },
      {
        question: '¿Qué hago con los archivos .HEIC de mi iPhone?',
        answer: 'Solo arrástralos aquí. Pixel Optimizer detecta automáticamente el formato de Apple y lo convierte a JPG o WebP compatible con cualquier web o Windows.'
      }
    ],
    en: [
      { 
        question: 'Are my photos uploaded to a server?', 
        answer: 'No. The entire process (compression, resizing, conversion) happens inside your browser. Ideally suited for photographers or businesses handling copyrighted or sensitive images.' 
      }, 
      { 
        question: 'Why should I use WebP?', 
        answer: 'WebP is the modern standard format. It reduces file size by 30-50% compared to JPG with no visible quality loss, making your website load much faster.' 
      },
      {
        question: 'What do I do with .HEIC files from my iPhone?',
        answer: 'Just drag them here. Pixel Optimizer automatically detects the Apple format and converts it to universal JPG or WebP compatible with Windows and the web.'
      }
    ]
  },
  content: {
    es: createRichText(
      'Acelera tu web y domina las Core Web Vitals', 
      'Las imágenes pesadas son la causa número 1 del abandono de usuarios en sitios web. Google penaliza severamente el LCP (Largest Contentful Paint) alto. Pixel Optimizer es tu navaja suiza para preparar assets digitales:', 
      [
        'Conversión HEIC a JPG/WebP: Olvídate de herramientas de pago para convertir las fotos de tu iPhone.',
        'Compresión Inteligente: Reduce el peso hasta un 90% eliminando datos invisibles al ojo humano.',
        'Privacidad Total: Eliminación automática de metadatos EXIF (GPS, modelo de cámara) para proteger la ubicación de la toma.'
      ], 
      'Una herramienta imprescindible para Gestores de E-commerce, Bloggers y Desarrolladores Frontend que buscan la máxima velocidad de carga.'
    ),
    en: createRichText(
      'Speed up your web and master Core Web Vitals', 
      'Heavy images are the #1 cause of user abandonment on websites. Google severely penalizes high LCP (Largest Contentful Paint). Pixel Optimizer is your Swiss Army knife for preparing digital assets:', 
      [
        'HEIC to JPG/WebP Conversion: Forget paid tools to convert your iPhone photos.',
        'Smart Compression: Reduce size by up to 90% by removing data invisible to the human eye.',
        'Total Privacy: Automatic removal of EXIF metadata (GPS, camera model) to protect the location of the shot.'
      ], 
      'A must-have tool for E-commerce Managers, Bloggers, and Frontend Developers looking for maximum loading speed.'
    )
  }
}