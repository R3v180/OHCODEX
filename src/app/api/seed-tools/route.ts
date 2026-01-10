import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

// Helper para Rich Text Complejo (H3 + Listas + Negritas)
const createRichText = (title: string, intro: string, points: string[], conclusion: string): any => {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: [
        {
          type: 'heading',
          tag: 'h3',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          children: [{ type: 'text', text: title, mode: 'normal', style: '', detail: 0, format: 0, version: 1 }]
        },
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          children: [{ type: 'text', text: intro, mode: 'normal', style: '', detail: 0, format: 0, version: 1 }]
        },
        {
          type: 'list',
          listType: 'bullet',
          format: '',
          indent: 0,
          version: 1,
          children: points.map(point => ({
            type: 'listitem',
            format: '',
            indent: 0,
            version: 1,
            children: [{ type: 'text', text: point, mode: 'normal', style: '', detail: 0, format: 0, version: 1 }]
          }))
        },
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          children: [{ type: 'text', text: conclusion, mode: 'normal', style: '', detail: 0, format: 0, version: 1 }]
        }
      ]
    }
  }
}

// --- DATOS MAESTROS DE LAS 5 HERRAMIENTAS (V3) ---
const ALL_TOOLS_DATA = [
  {
    slug: 'vault',
    codeKey: 'vault',
    icon: 'lock',
    title: { es: 'OHCodex Vault', en: 'OHCodex Vault' },
    badge: { es: 'Privacidad Total', en: 'Total Privacy' },
    shortDescription: { es: 'Encriptación AES-256 militar. Zero-Knowledge: tus datos nunca salen de tu navegador.', en: 'Military-grade AES-256. Zero-Knowledge: data never leaves your browser.' },
    steps: {
      es: [
        { stepTitle: 'Escribe o Sube', stepDescription: 'Pega tu texto sensible o selecciona un archivo.', stepIcon: 'edit' },
        { stepTitle: 'Protege', stepDescription: 'Elige una contraseña fuerte para cifrar.', stepIcon: 'lock' },
        { stepTitle: 'Comparte Seguro', stepDescription: 'Copia el código encriptado o descarga el archivo .ohc.', stepIcon: 'zap' }
      ],
      en: [
        { stepTitle: 'Write or Upload', stepDescription: 'Paste sensitive text or select a file.', stepIcon: 'edit' },
        { stepTitle: 'Protect', stepDescription: 'Choose a strong password for encryption.', stepIcon: 'lock' },
        { stepTitle: 'Share Safely', stepDescription: 'Copy the encrypted code or download the .ohc file.', stepIcon: 'zap' }
      ]
    },
    cta: { 
      es: { title: 'La seguridad no es un plugin', desc: 'Diseñamos arquitecturas corporativas Zero-Trust donde la privacidad es la base.' },
      en: { title: 'Security is not a plugin', desc: 'We design Zero-Trust corporate architectures where privacy is the foundation.' }
    },
    faqs: {
      es: [{ question: '¿Es seguro?', answer: 'Sí, usamos AES-GCM 256 bits localmente.' }, { question: '¿Se guarda algo?', answer: 'Nada. Al recargar la página, todo desaparece.' }],
      en: [{ question: 'Is it secure?', answer: 'Yes, we use local AES-GCM 256 bits.' }, { question: 'Is data saved?', answer: 'No. Everything is wiped on refresh.' }]
    },
    content: {
      es: createRichText('Encriptación soberana', 'En la era de la vigilancia digital, la privacidad no es un lujo, es una necesidad. Vault te permite proteger secretos antes de enviarlos por canales inseguros (Email, Slack, WhatsApp).', ['Algoritmo AES-GCM 256 bits (Estándar bancario).', 'Derivación de clave PBKDF2 para evitar ataques de fuerza bruta.', 'Vectores de inicialización aleatorios únicos por cada encriptación.'], 'Herramienta esencial para abogados, periodistas, directivos y desarrolladores que manejan credenciales.'),
      en: createRichText('Sovereign Encryption', 'In the age of digital surveillance, privacy is not a luxury, it is a necessity. Vault allows you to protect secrets before sending them via insecure channels.', ['AES-GCM 256-bit algorithm (Banking standard).', 'PBKDF2 key derivation to prevent brute force attacks.', 'Random initialization vectors unique to each encryption.'], 'Essential tool for lawyers, journalists, executives, and developers handling credentials.')
    }
  },
  {
    slug: 'image-optimizer',
    codeKey: 'image-optimizer',
    icon: 'image',
    title: { es: 'Pixel Optimizer', en: 'Pixel Optimizer' },
    badge: { es: 'Procesamiento Local', en: 'Local Processing' },
    shortDescription: { es: 'Comprime, redimensiona y convierte a WebP. Mejora tu SEO sin subir fotos a la nube.', en: 'Compress, resize and convert to WebP. Boost SEO without uploading photos.' },
    steps: {
      es: [
        { stepTitle: 'Arrastra Fotos', stepDescription: 'Soporta JPG, PNG y WebP en lotes.', stepIcon: 'upload' },
        { stepTitle: 'Ajusta', stepDescription: 'Define calidad y tamaño máximo.', stepIcon: 'settings' },
        { stepTitle: 'Descarga', stepDescription: 'Obtén un ZIP con todo optimizado.', stepIcon: 'download' }
      ],
      en: [
        { stepTitle: 'Drag Photos', stepDescription: 'Supports JPG, PNG and WebP batches.', stepIcon: 'upload' },
        { stepTitle: 'Adjust', stepDescription: 'Define quality and max width.', stepIcon: 'settings' },
        { stepTitle: 'Download', stepDescription: 'Get a ZIP with everything optimized.', stepIcon: 'download' }
      ]
    },
    cta: {
      es: { title: '¿Tu web carga lenta?', desc: 'Optimizamos infraestructuras de alto tráfico para pasar las Core Web Vitals.' },
      en: { title: 'Is your site slow?', desc: 'We optimize high-traffic infrastructures to pass Core Web Vitals.' }
    },
    faqs: {
      es: [{ question: '¿Sube mis fotos?', answer: 'No, usa WebAssembly en tu CPU.' }, { question: '¿Qué es WebP?', answer: 'Un formato de Google que reduce un 30% el peso frente a JPG.' }],
      en: [{ question: 'Does it upload photos?', answer: 'No, it uses WebAssembly on your CPU.' }, { question: 'What is WebP?', answer: 'A Google format that reduces size by 30% vs JPG.' }]
    },
    content: {
      es: createRichText('Acelera tu web y mejora tu SEO', 'Las imágenes pesadas son la causa número 1 del abandono de usuarios en sitios web. Google penaliza severamente el LCP (Largest Contentful Paint) alto. Con Pixel Optimizer obtienes:', ['Conversión masiva a WebP (El estándar moderno de la web).', 'Reducción del 90% de peso sin pérdida visual perceptible.', 'Eliminación automática de metadatos EXIF (GPS, Cámara) para privacidad.'], 'Todo procesado en tu ordenador. Ideal para e-commerce y blogs de alto tráfico.'),
      en: createRichText('Speed up your web & SEO', 'Heavy images are the #1 cause of user abandonment. Google severely penalizes high LCP. With Pixel Optimizer you get:', ['Batch convert to WebP (The modern web standard).', '90% weight reduction without visual loss.', 'Auto-strip EXIF metadata (GPS, Camera) for privacy.'], 'All processed on your computer. Ideal for e-commerce and high-traffic blogs.')
    }
  },
  {
    slug: 'pdf-studio',
    codeKey: 'pdf-studio',
    icon: 'file-text',
    title: { es: 'PDF Studio', en: 'PDF Studio' },
    badge: { es: 'Sin Límites', en: 'Unlimited' },
    shortDescription: { es: 'Une, rota y firma documentos PDF. Gestión documental sin marcas de agua ni registros.', en: 'Merge, rotate and sign PDFs. Document management without watermarks.' },
    steps: {
      es: [
        { stepTitle: 'Sube PDFs', stepDescription: 'Arrastra múltiples documentos.', stepIcon: 'upload' },
        { stepTitle: 'Edita', stepDescription: 'Rota páginas o añade tu firma.', stepIcon: 'edit' },
        { stepTitle: 'Combina', stepDescription: 'Une todo en un solo archivo final.', stepIcon: 'download' }
      ],
      en: [
        { stepTitle: 'Upload PDFs', stepDescription: 'Drag multiple documents.', stepIcon: 'upload' },
        { stepTitle: 'Edit', stepDescription: 'Rotate pages or add signature.', stepIcon: 'edit' },
        { stepTitle: 'Merge', stepDescription: 'Combine everything into one file.', stepIcon: 'download' }
      ]
    },
    cta: {
      es: { title: 'Digitaliza tu negocio', desc: 'Creamos plataformas de gestión documental y PWAs a medida.' },
      en: { title: 'Digitize your business', desc: 'We build custom document management platforms and PWAs.' }
    },
    faqs: {
      es: [{ question: '¿Tiene validez legal?', answer: 'Es una firma simple. Para contratos oficiales usa certificado digital.' }, { question: '¿Límite de archivos?', answer: 'Solo tu memoria RAM. Hemos probado con 50+ archivos.' }],
      en: [{ question: 'Is it legally binding?', answer: 'It is a simple signature. Use digital certs for official contracts.' }, { question: 'File limits?', answer: 'Only your RAM. Tested with 50+ files.' }]
    },
    content: {
      es: createRichText('Gestión Documental Privada', 'No subas contratos confidenciales a nubes públicas de terceros para tareas sencillas. PDF Studio es tu navaja suiza local:', ['Unión (Merge) de múltiples PDFs en el orden que quieras.', 'Rotación de páginas escaneadas incorrectamente.', 'Firma digital manuscrita para agilizar trámites internos.'], 'Cumple con la privacidad de tu empresa al procesar todo en local mediante WebAssembly.'),
      en: createRichText('Private Document Management', 'Do not upload confidential contracts to public clouds for simple tasks. PDF Studio is your local Swiss Army Knife:', ['Merge multiple PDFs in any order.', 'Rotate incorrectly scanned pages.', 'Handwritten digital signature to speed up internal paperwork.'], 'Comply with corporate privacy by processing everything locally via WebAssembly.')
    }
  },
  {
    slug: 'data-station',
    codeKey: 'data-station',
    icon: 'database',
    title: { es: 'Data Station', en: 'Data Station' },
    badge: { es: 'Para Devs', en: 'For Devs' },
    shortDescription: { es: 'Navaja suiza JSON/SQL. Formatea, valida y convierte datos sensibles offline.', en: 'JSON/SQL Swiss Army Knife. Format, validate and convert sensitive data offline.' },
    steps: {
      es: [
        { stepTitle: 'Pega Datos', stepDescription: 'JSON, CSV o SQL sucio.', stepIcon: 'edit' },
        { stepTitle: 'Procesa', stepDescription: 'Formatea, Valida o Convierte.', stepIcon: 'zap' },
        { stepTitle: 'Copia', stepDescription: 'Código limpio listo para usar.', stepIcon: 'download' }
      ],
      en: [
        { stepTitle: 'Paste Data', stepDescription: 'Dirty JSON, CSV or SQL.', stepIcon: 'edit' },
        { stepTitle: 'Process', stepDescription: 'Format, Validate or Convert.', stepIcon: 'zap' },
        { stepTitle: 'Copy', stepDescription: 'Clean code ready to use.', stepIcon: 'download' }
      ]
    },
    cta: {
      es: { title: '¿Integraciones complejas?', desc: 'Automatizamos flujos de datos y conectamos sistemas legacy vía API.' },
      en: { title: 'Complex integrations?', desc: 'We automate data flows and connect legacy systems via API.' }
    },
    faqs: {
      es: [{ question: '¿Es seguro para API Keys?', answer: 'Sí, no hay backend. Nada sale de tu PC.' }, { question: '¿Formatos soportados?', answer: 'JSON, CSV, SQL (Estándar ANSI).' }],
      en: [{ question: 'Safe for API Keys?', answer: 'Yes, no backend. Nothing leaves your PC.' }, { question: 'Formats?', answer: 'JSON, CSV, SQL (ANSI Standard).' }]
    },
    content: {
      es: createRichText('Manipulación de datos segura', 'La mayoría de formateadores online envían tu código a un servidor, exponiendo claves API o datos de clientes. Data Station es diferente:', ['Validación JSON/SQL en tiempo real.', 'Conversión instantánea CSV <-> JSON para migraciones.', 'Minificación para entornos de producción.'], 'Herramienta de uso diario imprescindible para desarrolladores Backend y Frontend.'),
      en: createRichText('Secure Data Manipulation', 'Most online formatters send your code to a server, exposing API keys or customer data. Data Station is different:', ['Real-time JSON/SQL validation.', 'Instant CSV <-> JSON conversion for migrations.', 'Minification for production environments.'], 'Essential daily tool for Backend and Frontend developers.')
    }
  },
  {
    slug: 'qr-factory',
    codeKey: 'qr-factory',
    icon: 'qr-code',
    title: { es: 'QR Factory', en: 'QR Factory' },
    badge: { es: 'Vectorial SVG', en: 'Vector SVG' },
    shortDescription: { es: 'Generador de QRs con logo y códigos de barras EAN-13 para productos.', en: 'QR generator with logo and EAN-13 barcodes for products.' },
    steps: {
      es: [
        { stepTitle: 'Elige Tipo', stepDescription: 'WiFi, Web, Contacto o Barras.', stepIcon: 'settings' },
        { stepTitle: 'Personaliza', stepDescription: 'Colores, Logo y Tamaño.', stepIcon: 'edit' },
        { stepTitle: 'Exporta', stepDescription: 'Descarga en SVG vectorial o PNG.', stepIcon: 'download' }
      ],
      en: [
        { stepTitle: 'Select Type', stepDescription: 'WiFi, Web, Contact or Barcode.', stepIcon: 'settings' },
        { stepTitle: 'Customize', stepDescription: 'Colors, Logo and Size.', stepIcon: 'edit' },
        { stepTitle: 'Export', stepDescription: 'Download as Vector SVG or PNG.', stepIcon: 'download' }
      ]
    },
    cta: {
      es: { title: 'Conecta el mundo físico', desc: 'Soluciones IoT, trazabilidad y sistemas de inventario inteligentes.' },
      en: { title: 'Connect the physical world', desc: 'IoT solutions, traceability and smart inventory systems.' }
    },
    faqs: {
      es: [{ question: '¿Caducan?', answer: 'No, son estáticos y funcionan para siempre.' }, { question: '¿Por qué SVG?', answer: 'Para imprimir en gran formato sin pixelarse.' }],
      en: [{ question: 'Do they expire?', answer: 'No, they are static and work forever.' }, { question: 'Why SVG?', answer: 'For large format printing without pixelation.' }]
    },
    content: {
      es: createRichText('QRs Profesionales con Marca', 'QR Factory no es el típico generador básico. Diseñado para imprenta y marketing:', ['Incrusta tu logo corporativo en el centro.', 'Colores personalizados (HEX) para coincidir con tu branding.', 'Códigos de barras industriales (EAN-13, UPC, Code128) para retail.'], 'Perfecto para packaging, tarjetas de visita y cartelería de eventos.'),
      en: createRichText('Professional Branded QRs', 'QR Factory is not your typical basic generator. Designed for print and marketing:', ['Embed your corporate logo in the center.', 'Custom colors (HEX) to match your branding.', 'Industrial barcodes (EAN-13, UPC, Code128) for retail.'], 'Perfect for packaging, business cards, and event signage.')
    }
  }
]

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })
    console.log('🌱 UPDATE V3: Actualizando Tools con Steps y SEO...')
    const results = []

    for (const tool of ALL_TOOLS_DATA) {
      // 1. Buscar si existe (debería existir tras restaurar)
      const existing = await payload.find({
        collection: 'tools',
        where: { slug: { equals: tool.slug } },
      })

      if (existing.docs.length > 0) {
        const id = existing.docs[0].id
        
        // Update ES
        await payload.update({
          collection: 'tools',
          id,
          data: {
            codeKey: tool.codeKey as any,
            icon: tool.icon as any,
            title: tool.title.es,
            badge: tool.badge.es,
            shortDescription: tool.shortDescription.es,
            steps: tool.steps.es.map(s => ({ ...s, stepIcon: s.stepIcon as any })), // Map steps
            ctaTitle: tool.cta.es.title,
            ctaDescription: tool.cta.es.desc,
            content: tool.content.es,
            faqs: tool.faqs.es
          },
          locale: 'es'
        })

        // Update EN
        await payload.update({
          collection: 'tools',
          id,
          data: {
            title: tool.title.en,
            badge: tool.badge.en,
            shortDescription: tool.shortDescription.en,
            steps: tool.steps.en.map(s => ({ ...s, stepIcon: s.stepIcon as any })),
            ctaTitle: tool.cta.en.title,
            ctaDescription: tool.cta.en.desc,
            content: tool.content.en,
            faqs: tool.faqs.en
          },
          locale: 'en'
        })
        results.push({ slug: tool.slug, status: 'updated_v3' })

      } else {
        // Fallback Create (Si por lo que sea no existe)
        await payload.create({
          collection: 'tools',
          data: {
            slug: tool.slug,
            codeKey: tool.codeKey as any,
            icon: tool.icon as any,
            title: tool.title.es,
            badge: tool.badge.es,
            shortDescription: tool.shortDescription.es,
            steps: tool.steps.es.map(s => ({ ...s, stepIcon: s.stepIcon as any })),
            content: tool.content.es,
            ctaTitle: tool.cta.es.title,
            ctaDescription: tool.cta.es.desc,
            faqs: tool.faqs.es
          },
          locale: 'es'
        })
        results.push({ slug: tool.slug, status: 'created_v3' })
      }
    }

    return NextResponse.json({ success: true, results })
  } catch (error: any) {
    console.error('Seed error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}