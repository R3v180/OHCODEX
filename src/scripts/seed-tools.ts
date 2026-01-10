import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

// Helper para Rich Text (Bypass de tipos para velocidad)
const createLexicalContent = (text: string): any => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: [
      {
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        children: [
          {
            mode: 'normal',
            text: text,
            type: 'text',
            style: '',
            detail: 0,
            format: 0,
            version: 1,
          },
        ],
      },
    ],
  },
})

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })
    console.log('🔄 Iniciando actualización forzada de PDF Studio...')

    // 1. Buscar la herramienta existente
    const existing = await payload.find({
      collection: 'tools',
      where: { slug: { equals: 'pdf-studio' } },
    })

    if (existing.docs.length === 0) {
      return NextResponse.json({ success: false, error: 'No se encontró la herramienta pdf-studio para actualizar.' })
    }

    const toolID = existing.docs[0].id

    // 2. Definir los datos nuevos (FAQs y Contenido)
    const faqsData = [
      { 
        question: '¿Es seguro subir mis documentos confidenciales?', 
        answer: 'Absolutamente. OHCodex PDF Studio utiliza tecnología WebAssembly para procesar los archivos directamente en la memoria de tu navegador. Tus documentos NUNCA se envían a ningún servidor ni nube. Es privacidad por diseño.' 
      },
      { 
        question: '¿Puedo unir archivos PDF de diferentes tamaños?', 
        answer: 'Sí, la herramienta ajusta automáticamente las páginas. Puedes combinar A4 con cartas o diapositivas sin problemas.' 
      },
      { 
        question: '¿La firma digital tiene validez legal?', 
        answer: 'Esta herramienta añade una firma gráfica. Para validez legal estricta (eIDAS), necesitarías un certificado digital cualificado, pero es perfecta para acuerdos internos y comerciales.' 
      }
    ]

    const contentText = "Gestiona tus documentos legales o contratos con privacidad total. Puedes unir múltiples archivos, rotar páginas escaneadas incorrectamente y añadir tu firma digital sin que el archivo salga de tu ordenador."

    // 3. Ejecutar la actualización en Español
    await payload.update({
      collection: 'tools',
      id: toolID,
      data: {
        faqs: faqsData,
        content: createLexicalContent(contentText),
        // Nos aseguramos de que el CTA también esté
        ctaTitle: 'Digitaliza tu negocio',
        ctaDescription: 'Desarrollamos plataformas de gestión documental y aplicaciones web progresivas (PWA).',
      },
      locale: 'es',
    })

    // 4. Ejecutar la actualización en Inglés (copiamos lo mismo traducido o similar para que no quede vacío)
    await payload.update({
      collection: 'tools',
      id: toolID,
      data: {
        faqs: [
          { question: 'Is it secure?', answer: 'Yes, files are processed locally in your browser via WebAssembly.' },
          { question: 'Can I merge mixed sizes?', answer: 'Yes, the tool handles different page sizes automatically.' }
        ],
        content: createLexicalContent("Manage your legal documents with total privacy. Merge files, rotate pages, and sign documents without them ever leaving your computer."),
      },
      locale: 'en',
    })

    return NextResponse.json({ 
      success: true, 
      message: '✅ PDF Studio actualizado con FAQs y Contenido SEO' 
    })

  } catch (error: any) {
    console.error('Update error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}