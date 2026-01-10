import { ToolSeedData, createRichText } from './utils'

export const qrFactoryData: ToolSeedData = {
  slug: 'qr-factory',
  codeKey: 'qr-factory',
  icon: 'qr-code',
  title: { 
    es: 'QR Factory', 
    en: 'QR Factory' 
  },
  badge: { 
    es: 'Vectores SVG & Barras', 
    en: 'Vector SVG & Barcodes' 
  },
  shortDescription: { 
    es: 'Generador profesional de códigos QR con logo y códigos de barras EAN-13 para retail. Exportación vectorial para imprenta.', 
    en: 'Professional QR generator with logo and EAN-13 barcodes for retail. Vector export for high-quality printing.' 
  },
  steps: {
    es: [
      { stepTitle: 'Elige el Tipo', stepDescription: 'Enlace Web, WiFi, Contacto (VCard) o Código de Barras (EAN-13).', stepIcon: 'settings' },
      { stepTitle: 'Personaliza', stepDescription: 'Ajusta colores corporativos, añade tu logo y define el tamaño.', stepIcon: 'edit' },
      { stepTitle: 'Exporta Vectorial', stepDescription: 'Descarga en SVG (Imprenta) o PNG (Web) al instante.', stepIcon: 'download' }
    ],
    en: [
      { stepTitle: 'Select Type', stepDescription: 'Website Link, WiFi, Contact (VCard), or Barcode (EAN-13).', stepIcon: 'settings' },
      { stepTitle: 'Customize', stepDescription: 'Adjust brand colors, add your logo, and define size.', stepIcon: 'edit' },
      { stepTitle: 'Vector Export', stepDescription: 'Download as SVG (Print) or PNG (Web) instantly.', stepIcon: 'download' }
    ]
  },
  cta: {
    es: { 
      title: 'Conecta el mundo físico con el digital', 
      desc: 'Desarrollamos soluciones IoT, sistemas de trazabilidad y aplicaciones de escaneo para logística y retail.' 
    },
    en: { 
      title: 'Bridge the physical and digital worlds', 
      desc: 'We develop IoT solutions, traceability systems, and scanning applications for logistics and retail.' 
    }
  },
  faqs: {
    es: [
      { 
        question: '¿Los códigos QR caducan?', 
        answer: 'No. Generamos códigos estáticos que contienen la información directamente. A diferencia de los códigos dinámicos de pago, estos funcionarán para siempre y no dependen de nuestros servidores.' 
      },
      { 
        question: '¿Por qué debería usar SVG?', 
        answer: 'SVG es un formato vectorial. Significa que puedes ampliar el código al tamaño de un edificio sin que se pixele ni pierda calidad. Es el formato obligatorio para imprenta y diseño gráfico profesional.' 
      }, 
      { 
        question: '¿Sirve para productos de supermercado?', 
        answer: 'Sí. Incluimos un generador de códigos de barras EAN-13 (Europa) y UPC (EEUU), así como CODE-128 para logística interna y gestión de inventario.' 
      }
    ],
    en: [
      { 
        question: 'Do the QR codes expire?', 
        answer: 'No. We generate static codes that contain the information directly. Unlike paid dynamic codes, these will work forever and do not depend on our servers.' 
      },
      { 
        question: 'Why should I use SVG?', 
        answer: 'SVG is a vector format. This means you can scale the code to the size of a building without pixelation or quality loss. It is the mandatory format for printing and professional graphic design.' 
      }, 
      { 
        question: 'Does it work for supermarket products?', 
        answer: 'Yes. We include an EAN-13 (Europe) and UPC (USA) barcode generator, as well as CODE-128 for internal logistics and inventory management.' 
      }
    ]
  },
  content: {
    es: createRichText(
      'Códigos QR Profesionales con Identidad de Marca', 
      'Un código QR no tiene por qué ser un cuadrado blanco y negro aburrido. Para que tus clientes escaneen, necesitas inspirar confianza y reconocimiento de marca. QR Factory está diseñado para departamentos de marketing y diseño:', 
      [
        'Branding Total: Incrusta tu logo en el centro y usa tus colores HEX corporativos.',
        'Formatos Universales: WiFi (para conectar sin contraseña), VCard (para tarjetas de visita) y WhatsApp (para soporte directo).',
        'Estándares Industriales: Generación precisa de códigos de barras para packaging y etiquetado de productos.'
      ], 
      'La herramienta definitiva para diseñadores gráficos, organizadores de eventos y gestores de tiendas que necesitan códigos de alta resolución.'
    ),
    en: createRichText(
      'Professional QR Codes with Brand Identity', 
      'A QR code doesn\'t have to be a boring black and white square. To get customers to scan, you need to inspire trust and brand recognition. QR Factory is designed for marketing and design departments:', 
      [
        'Total Branding: Embed your logo in the center and use your corporate HEX colors.',
        'Universal Formats: WiFi (connect without password), VCard (business cards), and WhatsApp (direct support).',
        'Industrial Standards: Precise barcode generation for packaging and product labeling.'
      ], 
      'The ultimate tool for graphic designers, event organizers, and store managers who need high-resolution codes.'
    )
  }
}