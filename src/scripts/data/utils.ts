// Define la estructura exacta que deben tener los datos de cada herramienta
export interface ToolSeedData {
  slug: string
  codeKey: 'vault' | 'image-optimizer' | 'pdf-studio' | 'data-station' | 'qr-factory' | 'ocr-vision'
  icon: 'lock' | 'image' | 'file-text' | 'database' | 'qr-code' | 'box' | 'scan'
  title: { es: string; en: string }
  badge: { es: string; en: string }
  shortDescription: { es: string; en: string }
  steps: {
    es: Array<{ stepTitle: string; stepDescription: string; stepIcon: 'upload' | 'settings' | 'zap' | 'download' | 'lock' | 'edit' }>
    en: Array<{ stepTitle: string; stepDescription: string; stepIcon: 'upload' | 'settings' | 'zap' | 'download' | 'lock' | 'edit' }>
  }
  cta: {
    es: { title: string; desc: string }
    en: { title: string; desc: string }
  }
  faqs: {
    es: Array<{ question: string; answer: string }>
    en: Array<{ question: string; answer: string }>
  }
  // El contenido ya vendrá formateado como RichText Lexical
  content: {
    es: any
    en: any
  }
}

// Helper para generar el Rich Text de Payload (Lexical) de forma sencilla
// Esto nos ahorra escribir 50 líneas de JSON por cada herramienta
export const createRichText = (title: string, intro: string, points: string[], conclusion: string): any => {
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