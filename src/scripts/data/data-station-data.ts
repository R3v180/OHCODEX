import { ToolSeedData, createRichText } from './utils'

export const dataStationData: ToolSeedData = {
  slug: 'data-station',
  codeKey: 'data-station',
  icon: 'database',
  title: { 
    es: 'Data Station', 
    en: 'Data Station' 
  },
  badge: { 
    es: 'Para Desarrolladores', 
    en: 'Developer Essential' 
  },
  shortDescription: { 
    es: 'Validador, formateador y conversor de datos (JSON, SQL, CSV). Manipula datos sensibles de producción sin que salgan de tu red.', 
    en: 'Data validator, formatter, and converter (JSON, SQL, CSV). Handle sensitive production data without it leaving your network.' 
  },
  steps: {
    es: [
      { stepTitle: 'Pega tu Código', stepDescription: 'Aceptamos JSON sucio, CSV de Excel o consultas SQL complejas.', stepIcon: 'edit' },
      { stepTitle: 'Procesa', stepDescription: 'Formatea, minifica, valida o convierte entre formatos al instante.', stepIcon: 'zap' },
      { stepTitle: 'Copia el Resultado', stepDescription: 'Obtén código limpio y libre de errores listo para producción.', stepIcon: 'download' }
    ],
    en: [
      { stepTitle: 'Paste your Code', stepDescription: 'We accept messy JSON, Excel CSVs, or complex SQL queries.', stepIcon: 'edit' },
      { stepTitle: 'Process', stepDescription: 'Format, minify, validate, or convert between formats instantly.', stepIcon: 'zap' },
      { stepTitle: 'Copy Result', stepDescription: 'Get clean, error-free code ready for production.', stepIcon: 'download' }
    ]
  },
  cta: {
    es: { 
      title: '¿Problemas de integración de datos?', 
      desc: 'Diseñamos APIs robustas, pipelines ETL y sistemas de migración de bases de datos para empresas.' 
    },
    en: { 
      title: 'Data integration issues?', 
      desc: 'We design robust APIs, ETL pipelines, and database migration systems for enterprises.' 
    }
  },
  faqs: {
    es: [
      { 
        question: '¿Es seguro pegar API Keys o datos de clientes?', 
        answer: 'Sí, es 100% seguro. A diferencia de otros formateadores online, Data Station no tiene backend para procesar los datos. Todo ocurre en el JavaScript de tu navegador. Puedes auditar el tráfico de red para comprobarlo.' 
      },
      { 
        question: '¿Qué formatos soportáis?', 
        answer: 'Actualmente soportamos validación y formateo de JSON y SQL (estándar ANSI). También ofrecemos conversión bidireccional entre JSON y CSV, ideal para importar/exportar datos de Excel.' 
      }, 
      { 
        question: '¿Funciona con archivos grandes?', 
        answer: 'Sí, al no haber subida de archivos, el límite lo marca la capacidad de tu navegador para manejar texto en memoria. Hemos probado con JSONs de varios megabytes sin problemas.' 
      }
    ],
    en: [
      { 
        question: 'Is it safe to paste API Keys or customer data?', 
        answer: 'Yes, it is 100% safe. Unlike other online formatters, Data Station has no backend to process data. Everything happens in your browser\'s JavaScript. You can audit the network traffic to verify.' 
      },
      { 
        question: 'Which formats are supported?', 
        answer: 'We currently support JSON and SQL (ANSI standard) validation and formatting. We also offer bidirectional conversion between JSON and CSV, perfect for Excel data import/export.' 
      }, 
      { 
        question: 'Does it work with large files?', 
        answer: 'Yes, since there is no file upload, the limit is set by your browser\'s ability to handle text in memory. We have tested with multi-megabyte JSONs without issues.' 
      }
    ]
  },
  content: {
    es: createRichText(
      'Manipulación de Datos sin Riesgos', 
      'La mayoría de herramientas online de formateo envían tu código a un servidor para procesarlo. Esto representa un riesgo de seguridad inaceptable cuando manejas credenciales, configuraciones de entorno o datos personales (GDPR). Data Station cambia las reglas:', 
      [
        'Editor Profesional: Utilizamos el motor Monaco (el mismo de VS Code) para ofrecerte resaltado de sintaxis y detección de errores real.',
        'Conversiones Útiles: Transforma rápidamente un CSV enviado por el departamento de marketing en un JSON listo para tu API.',
        'Depuración SQL: Ordena consultas SQL ilegibles extraídas de logs para entender qué está pasando en tu base de datos.'
      ], 
      'Una utilidad indispensable en el día a día de Desarrolladores Backend, Data Scientists y DevOps.'
    ),
    en: createRichText(
      'Risk-Free Data Manipulation', 
      'Most online formatting tools send your code to a server for processing. This represents an unacceptable security risk when handling credentials, environment configs, or personal data (GDPR). Data Station changes the rules:', 
      [
        'Professional Editor: We use the Monaco engine (the same as VS Code) to provide syntax highlighting and real error detection.',
        'Useful Conversions: Quickly transform a CSV sent by the marketing department into a JSON ready for your API.',
        'SQL Debugging: Tidy up unreadable SQL queries extracted from logs to understand what is happening in your database.'
      ], 
      'An indispensable utility for the daily work of Backend Developers, Data Scientists, and DevOps.'
    )
  }
}