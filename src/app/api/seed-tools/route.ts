import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

// Helper
const getQRFactoryContent = (lang: 'es' | 'en'): any => {
  if (lang === 'es') {
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
            children: [{ type: 'text', text: 'Crea QRs profesionales con tu marca', mode: 'normal', style: '', detail: 0, format: 0, version: 1 }]
          },
          {
            type: 'paragraph',
            format: '',
            indent: 0,
            version: 1,
            direction: 'ltr',
            children: [{ type: 'text', text: 'QR Factory no es el típico generador básico. Aquí puedes personalizar cada aspecto del código para que coincida con tu identidad corporativa:', mode: 'normal', style: '', detail: 0, format: 0, version: 1 }]
          },
          {
            type: 'list',
            listType: 'bullet',
            format: '',
            indent: 0,
            version: 1,
            children: [
              { type: 'listitem', format: '', indent: 0, version: 1, children: [{ type: 'text', text: 'Añade tu logo en el centro.', mode: 'normal', style: '', detail: 0, format: 0, version: 1 }] },
              { type: 'listitem', format: '', indent: 0, version: 1, children: [{ type: 'text', text: 'Cambia los colores (Fondo y Frente).', mode: 'normal', style: '', detail: 0, format: 0, version: 1 }] },
              { type: 'listitem', format: '', indent: 0, version: 1, children: [{ type: 'text', text: 'Exporta en ', mode: 'normal', style: '', detail: 0, format: 0, version: 1 }, { type: 'text', text: 'SVG vectorial', mode: 'normal', style: '', detail: 0, format: 1, version: 1 }, { type: 'text', text: ' para impresión de alta calidad.', mode: 'normal', style: '', detail: 0, format: 0, version: 1 }] }
            ]
          },
          {
            type: 'paragraph',
            format: '',
            indent: 0,
            version: 1,
            direction: 'ltr',
            children: [{ type: 'text', text: 'Además, incluye un generador de códigos de barras industriales (EAN-13, UPC) para la gestión de inventario.', mode: 'normal', style: '', detail: 0, format: 0, version: 1 }]
          }
        ],
      },
    }
  } else {
    // English
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
            children: [{ type: 'text', text: 'Professional Branded QR Codes', mode: 'normal', style: '', detail: 0, format: 0, version: 1 }]
          },
          {
            type: 'paragraph',
            format: '',
            indent: 0,
            version: 1,
            direction: 'ltr',
            children: [{ type: 'text', text: 'Customize every aspect of your QR code to match your brand identity:', mode: 'normal', style: '', detail: 0, format: 0, version: 1 }]
          },
          {
            type: 'list',
            listType: 'bullet',
            format: '',
            indent: 0,
            version: 1,
            children: [
              { type: 'listitem', format: '', indent: 0, version: 1, children: [{ type: 'text', text: 'Add your custom logo.', mode: 'normal', style: '', detail: 0, format: 0, version: 1 }] },
              { type: 'listitem', format: '', indent: 0, version: 1, children: [{ type: 'text', text: 'Export as SVG for print.', mode: 'normal', style: '', detail: 0, format: 0, version: 1 }] },
              { type: 'listitem', format: '', indent: 0, version: 1, children: [{ type: 'text', text: 'Industrial barcode generator included.', mode: 'normal', style: '', detail: 0, format: 0, version: 1 }] }
            ]
          }
        ],
      },
    }
  }
}

const QR_FAQS = {
  es: [
    { question: '¿Los códigos QR caducan?', answer: 'No. Los códigos generados aquí son estáticos. Contienen la información directamente (la URL, el texto, etc.) y funcionarán para siempre.' },
    { question: '¿Guardáis los datos que introduzco?', answer: 'Nunca. El código se genera en tu navegador usando librerías de JavaScript. Nosotros no vemos ni almacenamos tus URLs o claves WiFi.' },
    { question: '¿Para qué sirve el formato SVG?', answer: 'El SVG es un formato vectorial que permite ampliar el código infinitamente sin que se pixele. Es el formato obligatorio si vas a imprimir el QR en carteles grandes o lonas.' }
  ],
  en: [
    { question: 'Do QR codes expire?', answer: 'No. These are static codes and will work forever.' },
    { question: 'Is SVG format important?', answer: 'Yes, SVG allows for infinite scaling without pixelation, ideal for printing.' }
  ]
}

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })
    console.log('🔄 Iniciando actualización de QR Factory...')

    const existing = await payload.find({
      collection: 'tools',
      where: { slug: { equals: 'qr-factory' } },
    })

    if (existing.docs.length === 0) {
      return NextResponse.json({ success: false, error: 'No se encontró la herramienta.' })
    }

    const toolID = existing.docs[0].id

    await payload.update({
      collection: 'tools',
      id: toolID,
      data: {
        content: getQRFactoryContent('es'),
        faqs: QR_FAQS.es,
        ctaTitle: 'Conecta el mundo físico',
        ctaDescription: 'Desde etiquetas inteligentes hasta sistemas de inventario. Creamos soluciones IoT y de trazabilidad.'
      },
      locale: 'es',
    })

    await payload.update({
      collection: 'tools',
      id: toolID,
      data: {
        content: getQRFactoryContent('en'),
        faqs: QR_FAQS.en,
        ctaTitle: 'Connect the physical world',
        ctaDescription: 'From smart tags to inventory systems. We create IoT solutions.'
      },
      locale: 'en',
    })

    return NextResponse.json({ 
      success: true, 
      message: '✅ QR Factory actualizado correctamente.' 
    })

  } catch (error: any) {
    console.error('Update error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}