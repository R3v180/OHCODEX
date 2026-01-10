import { ToolSeedData, createRichText } from './utils'

export const pdfStudioData: ToolSeedData = {
  slug: 'pdf-studio',
  codeKey: 'pdf-studio',
  icon: 'file-text',
  title: { 
    es: 'PDF Studio', 
    en: 'PDF Studio' 
  },
  badge: { 
    es: 'Sin Límites de Peso', 
    en: 'No Size Limits' 
  },
  shortDescription: { 
    es: 'La navaja suiza para tus documentos: Une, rota y firma PDFs. Gestión documental privada sin marcas de agua.', 
    en: 'The Swiss Army knife for your docs: Merge, rotate, and sign PDFs. Private document management without watermarks.' 
  },
  steps: {
    es: [
      { stepTitle: 'Sube tus PDFs', stepDescription: 'Arrastra contratos, facturas o informes. Sin límite de cantidad.', stepIcon: 'upload' },
      { stepTitle: 'Edita y Firma', stepDescription: 'Rota páginas incorrectas o dibuja tu firma digitalmente.', stepIcon: 'edit' },
      { stepTitle: 'Combina', stepDescription: 'Fusiona todo en un único archivo PDF maestro listo para enviar.', stepIcon: 'download' }
    ],
    en: [
      { stepTitle: 'Upload PDFs', stepDescription: 'Drag contracts, invoices, or reports. No quantity limits.', stepIcon: 'upload' },
      { stepTitle: 'Edit & Sign', stepDescription: 'Rotate wrong pages or draw your signature digitally.', stepIcon: 'edit' },
      { stepTitle: 'Merge', stepDescription: 'Combine everything into a single master PDF ready to send.', stepIcon: 'download' }
    ]
  },
  cta: {
    es: { 
      title: '¿Necesitas digitalizar tu negocio?', 
      desc: 'Desarrollamos gestores documentales a medida y sistemas de firma electrónica integrados en tu ERP.' 
    },
    en: { 
      title: 'Need to digitize your business?', 
      desc: 'We develop custom document management systems and electronic signature solutions integrated into your ERP.' 
    }
  },
  faqs: {
    es: [
      { 
        question: '¿Es seguro subir documentos legales o contratos?', 
        answer: 'Absolutamente. A diferencia de otras herramientas gratuitas online, PDF Studio NO sube tus archivos a ningún servidor. Todo el procesamiento se realiza en la memoria de tu dispositivo usando WebAssembly. Es 100% privado.' 
      },
      { 
        question: '¿Tiene validez legal la firma?', 
        answer: 'La herramienta añade una firma gráfica (digitalización de firma manuscrita). Es válida para acuerdos comerciales, recepciones de material y trámites internos. Para trámites gubernamentales estrictos, consulta la normativa local sobre eIDAS o certificados cualificados.' 
      }, 
      { 
        question: '¿Cuántos archivos puedo unir a la vez?', 
        answer: 'No ponemos límites artificiales. Puedes unir 50 o 100 archivos si quieres, siempre que tu ordenador tenga memoria RAM suficiente para procesarlos.' 
      }
    ],
    en: [
      { 
        question: 'Is it safe to upload legal documents or contracts?', 
        answer: 'Absolutely. Unlike other free online tools, PDF Studio does NOT upload your files to any server. All processing is done in your device\'s memory using WebAssembly. It is 100% private.' 
      },
      { 
        question: 'Is the signature legally binding?', 
        answer: 'The tool adds a graphical signature (digitized handwritten signature). It is valid for commercial agreements, delivery receipts, and internal procedures. For strict government procedures, check local regulations regarding eIDAS or qualified certificates.' 
      }, 
      { 
        question: 'How many files can I merge at once?', 
        answer: 'We do not set artificial limits. You can merge 50 or 100 files if you want, as long as your computer has enough RAM to process them.' 
      }
    ]
  },
  content: {
    es: createRichText(
      'Gestión Documental Soberana y Segura', 
      'En el entorno empresarial actual, la agilidad no puede estar reñida con la confidencialidad. Muchos empleados recurren a webs de terceros para unir PDFs, exponiendo información sensible de la empresa. PDF Studio resuelve este dilema:', 
      [
        'Privacidad por Diseño: El motor de PDF funciona desconectado. Tus balances financieros nunca salen de tu red.',
        'Herramientas Esenciales: Unir (Merge) para informes mensuales, Rotar para escaneos torcidos y Firmar para aprobaciones rápidas.',
        'UX Profesional: Sin anuncios invasivos, sin marcas de agua y sin tiempos de espera.'
      ], 
      'La herramienta ideal para departamentos de RRHH, Finanzas y Legal que necesitan manipular documentación sensible sin riesgos de fuga de datos.'
    ),
    en: createRichText(
      'Sovereign and Secure Document Management', 
      'In today\'s business environment, agility cannot come at the expense of confidentiality. Many employees turn to third-party websites to merge PDFs, exposing sensitive company information. PDF Studio solves this dilemma:', 
      [
        'Privacy by Design: The PDF engine works offline. Your financial balance sheets never leave your network.',
        'Essential Tools: Merge for monthly reports, Rotate for crooked scans, and Sign for quick approvals.',
        'Professional UX: No invasive ads, no watermarks, and no waiting times.'
      ], 
      'The ideal tool for HR, Finance, and Legal departments that need to handle sensitive documentation without data leakage risks.'
    )
  }
}