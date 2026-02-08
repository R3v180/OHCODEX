import { Client } from 'pg';

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_nzlLWyOAp1j8@ep-orange-cherry-agt0euoy-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'
});

// SEO Content para todas las herramientas en todos los idiomas
const seoData: Record<string, Record<string, { metaTitle: string; metaDescription: string; content: any }>> = {
  vault: {
    es: {
      metaTitle: 'Encriptar Texto y Archivos Online Gratis | OHCodex Vault',
      metaDescription: 'Encripta textos y archivos con AES-256 directamente en tu navegador. Seguridad militar sin subir datos a la nube. Comparte contraseñas y documentos confidenciales de forma segura.',
      content: generateContent('es', 'vault')
    },
    en: {
      metaTitle: 'Encrypt Text & Files Online Free | OHCodex Vault',
      metaDescription: 'Encrypt texts and files with AES-256 directly in your browser. Military-grade security without uploading data to the cloud. Share passwords and confidential documents securely.',
      content: generateContent('en', 'vault')
    },
    fr: {
      metaTitle: 'Chiffrer Texte et Fichiers En Ligne Gratuit | OHCodex Vault',
      metaDescription: 'Chiffrez textes et fichiers avec AES-256 directement dans votre navigateur. Sécurité militaire sans télécharger de données dans le cloud. Partagez mots de passe et documents confidentiels en toute sécurité.',
      content: generateContent('fr', 'vault')
    },
    de: {
      metaTitle: 'Text & Dateien Online Verschlüsseln Kostenlos | OHCodex Vault',
      metaDescription: 'Verschlüsseln Sie Texte und Dateien mit AES-256 direkt in Ihrem Browser. Militärische Sicherheit ohne Daten in die Cloud hochzuladen. Teilen Sie Passwörter und vertrauliche Dokumente sicher.',
      content: generateContent('de', 'vault')
    },
    it: {
      metaTitle: 'Crittografare Testo e File Online Gratis | OHCodex Vault',
      metaDescription: 'Crittografa testi e file con AES-256 direttamente nel tuo browser. Sicurezza militare senza caricare dati sul cloud. Condividi password e documenti confidenziali in modo sicuro.',
      content: generateContent('it', 'vault')
    },
    pt: {
      metaTitle: 'Encriptar Texto e Arquivos Online Grátis | OHCodex Vault',
      metaDescription: 'Encripte textos e arquivos com AES-256 diretamente no seu navegador. Segurança militar sem enviar dados para a nuvem. Compartilhe senhas e documentos confidenciais de forma segura.',
      content: generateContent('pt', 'vault')
    }
  },
  'image-optimizer': {
    es: {
      metaTitle: 'Comprimir Imágenes Online Gratis | Optimizador WebP, JPG, PNG',
      metaDescription: 'Reduce el tamaño de tus imágenes hasta 90% sin perder calidad. Convierte a WebP, JPG o PNG. Optimiza fotos para web y mejora la velocidad de carga de tu sitio. 100% privado.',
      content: generateContent('es', 'image-optimizer')
    },
    en: {
      metaTitle: 'Compress Images Online Free | WebP, JPG, PNG Optimizer',
      metaDescription: 'Reduce image size up to 90% without quality loss. Convert to WebP, JPG or PNG. Optimize photos for web and improve your site loading speed. 100% private.',
      content: generateContent('en', 'image-optimizer')
    },
    fr: {
      metaTitle: 'Compresser Images En Ligne Gratuit | Optimiseur WebP, JPG, PNG',
      metaDescription: 'Réduisez la taille de vos images jusqu\'à 90% sans perte de qualité. Convertissez en WebP, JPG ou PNG. Optimisez photos pour le web et améliorez la vitesse de chargement. 100% privé.',
      content: generateContent('fr', 'image-optimizer')
    },
    de: {
      metaTitle: 'Bilder Online Komprimieren Kostenlos | WebP, JPG, PNG Optimierer',
      metaDescription: 'Reduzieren Sie Bildgrößen um bis zu 90% ohne Qualitätsverlust. Konvertieren Sie zu WebP, JPG oder PNG. Optimieren Sie Fotos für Web und verbessern Sie Ladegeschwindigkeit. 100% privat.',
      content: generateContent('de', 'image-optimizer')
    },
    it: {
      metaTitle: 'Comprimere Immagini Online Gratis | Ottimizzatore WebP, JPG, PNG',
      metaDescription: 'Riduci dimensioni immagini fino al 90% senza perdita di qualità. Converti in WebP, JPG o PNG. Ottimizza foto per web e migliora velocità di caricamento. 100% privato.',
      content: generateContent('it', 'image-optimizer')
    },
    pt: {
      metaTitle: 'Comprimir Imagens Online Grátis | Otimizador WebP, JPG, PNG',
      metaDescription: 'Reduza o tamanho das imagens até 90% sem perda de qualidade. Converta para WebP, JPG ou PNG. Otimize fotos para web e melhore a velocidade de carregamento. 100% privado.',
      content: generateContent('pt', 'image-optimizer')
    }
  },
  'pdf-studio': {
    es: {
      metaTitle: 'Editor PDF Online Gratis | Unir, Rotar y Firmar PDF',
      metaDescription: 'Edita PDFs sin instalar nada: une documentos, rota páginas y añade firmas digitales. 100% gratuito y privado. Tus archivos nunca salen de tu navegador.',
      content: generateContent('es', 'pdf-studio')
    },
    en: {
      metaTitle: 'Free PDF Editor Online | Merge, Rotate & Sign PDF',
      metaDescription: 'Edit PDFs without installation: merge documents, rotate pages and add digital signatures. 100% free and private. Your files never leave your browser.',
      content: generateContent('en', 'pdf-studio')
    },
    fr: {
      metaTitle: 'Éditeur PDF En Ligne Gratuit | Fusionner, Pivoter et Signer',
      metaDescription: 'Éditez PDFs sans installation : fusionnez documents, pivotez pages et ajoutez signatures numériques. 100% gratuit et privé. Vos fichiers ne quittent jamais votre navigateur.',
      content: generateContent('fr', 'pdf-studio')
    },
    de: {
      metaTitle: 'Kostenloser PDF Editor Online | Zusammenfügen, Drehen & Signieren',
      metaDescription: 'Bearbeiten Sie PDFs ohne Installation: fügen Sie Dokumente zusammen, drehen Sie Seiten und fügen Sie digitale Signaturen hinzu. 100% kostenlos und privat.',
      content: generateContent('de', 'pdf-studio')
    },
    it: {
      metaTitle: 'Editor PDF Online Gratis | Unire, Ruotare e Firmare PDF',
      metaDescription: 'Modifica PDF senza installazione: unisci documenti, ruota pagine e aggiungi firme digitali. 100% gratuito e privato. I tuoi file non lasciano mai il browser.',
      content: generateContent('it', 'pdf-studio')
    },
    pt: {
      metaTitle: 'Editor PDF Online Grátis | Juntar, Girar e Assinar PDF',
      metaDescription: 'Edite PDFs sem instalação: junte documentos, gire páginas e adicione assinaturas digitais. 100% gratuito e privado. Seus arquivos nunca saem do navegador.',
      content: generateContent('pt', 'pdf-studio')
    }
  },
  'data-station': {
    es: {
      metaTitle: 'Formatear JSON y SQL Online | Validador y Convertidor',
      metaDescription: 'Valida, formatea y convierte JSON, SQL y CSV. Herramienta gratuita para desarrolladores. Minifica, beautify y convierte entre formatos sin salir del navegador.',
      content: generateContent('es', 'data-station')
    },
    en: {
      metaTitle: 'Format JSON & SQL Online | Validator & Converter',
      metaDescription: 'Validate, format and convert JSON, SQL and CSV. Free tool for developers. Minify, beautify and convert between formats without leaving your browser.',
      content: generateContent('en', 'data-station')
    },
    fr: {
      metaTitle: 'Formater JSON et SQL En Ligne | Validateur et Convertisseur',
      metaDescription: 'Validez, formatez et convertissez JSON, SQL et CSV. Outil gratuit pour développeurs. Minifiez, beautify et convertissez entre formats sans quitter le navigateur.',
      content: generateContent('fr', 'data-station')
    },
    de: {
      metaTitle: 'JSON & SQL Online Formatieren | Validator & Konverter',
      metaDescription: 'Validieren, formatieren und konvertieren Sie JSON, SQL und CSV. Kostenloses Tool für Entwickler. Minify, beautify und konvertieren zwischen Formaten ohne Browser zu verlassen.',
      content: generateContent('de', 'data-station')
    },
    it: {
      metaTitle: 'Formattare JSON e SQL Online | Validatore e Convertitore',
      metaDescription: 'Valida, formatta e converti JSON, SQL e CSV. Strumento gratuito per sviluppatori. Minifica, beautify e converti tra formati senza uscire dal browser.',
      content: generateContent('it', 'data-station')
    },
    pt: {
      metaTitle: 'Formatar JSON e SQL Online | Validador e Conversor',
      metaDescription: 'Valide, formate e converta JSON, SQL e CSV. Ferramenta gratuita para desenvolvedores. Minifique, beautify e converta entre formatos sem sair do navegador.',
      content: generateContent('pt', 'data-station')
    }
  },
  'qr-factory': {
    es: {
      metaTitle: 'Generador QR Online Gratis | Códigos QR con Logo y SVG',
      metaDescription: 'Crea códigos QR profesionales con tu logo. WiFi, WhatsApp, URL, vCard y códigos de barras. Exporta en PNG o SVG vectorial. Gratis y sin registro.',
      content: generateContent('es', 'qr-factory')
    },
    en: {
      metaTitle: 'Free QR Code Generator Online | QR with Logo & SVG',
      metaDescription: 'Create professional QR codes with your logo. WiFi, WhatsApp, URL, vCard and barcodes. Export in PNG or vector SVG. Free and no registration required.',
      content: generateContent('en', 'qr-factory')
    },
    fr: {
      metaTitle: 'Générateur QR Code Gratuit En Ligne | QR avec Logo et SVG',
      metaDescription: 'Créez codes QR professionnels avec votre logo. WiFi, WhatsApp, URL, vCard et codes-barres. Exportez en PNG ou SVG vectoriel. Gratuit et sans inscription.',
      content: generateContent('fr', 'qr-factory')
    },
    de: {
      metaTitle: 'Kostenloser QR Code Generator Online | QR mit Logo & SVG',
      metaDescription: 'Erstellen Sie professionelle QR-Codes mit Ihrem Logo. WiFi, WhatsApp, URL, vCard und Strichcodes. Exportieren Sie in PNG oder Vektor-SVG. Kostenlos und ohne Registrierung.',
      content: generateContent('de', 'qr-factory')
    },
    it: {
      metaTitle: 'Generatore QR Code Online Gratis | QR con Logo e SVG',
      metaDescription: 'Crea codici QR professionali con il tuo logo. WiFi, WhatsApp, URL, vCard e codici a barre. Esporta in PNG o SVG vettoriale. Gratuito e senza registrazione.',
      content: generateContent('it', 'qr-factory')
    },
    pt: {
      metaTitle: 'Gerador QR Code Online Grátis | QR com Logo e SVG',
      metaDescription: 'Crie códigos QR profissionais com seu logo. WiFi, WhatsApp, URL, vCard e códigos de barras. Exporte em PNG ou SVG vetorial. Grátis e sem registro.',
      content: generateContent('pt', 'qr-factory')
    }
  },
  'ocr-vision': {
    es: {
      metaTitle: 'Extraer Texto de Imágenes Online Gratis | OCR en Español',
      metaDescription: 'Convierte imágenes y PDFs a texto editable con OCR. Reconoce español, inglés y más idiomas. 100% privado - el procesamiento ocurre en tu navegador.',
      content: generateContent('es', 'ocr-vision')
    },
    en: {
      metaTitle: 'Extract Text from Images Free Online | OCR Multi-Language',
      metaDescription: 'Convert images and PDFs to editable text with OCR. Recognizes English, Spanish and more languages. 100% private - processing happens in your browser.',
      content: generateContent('en', 'ocr-vision')
    },
    fr: {
      metaTitle: 'Extraire Texte d\'Images En Ligne Gratuit | OCR Multilingue',
      metaDescription: 'Convertissez images et PDFs en texte éditable avec OCR. Reconnaît français, anglais et plus de langues. 100% privé - le traitement se fait dans votre navigateur.',
      content: generateContent('fr', 'ocr-vision')
    },
    de: {
      metaTitle: 'Text aus Bildern Extrahieren Kostenlos | OCR Mehrsprachig',
      metaDescription: 'Konvertieren Sie Bilder und PDFs in bearbeitbaren Text mit OCR. Erkennt Deutsch, Englisch und weitere Sprachen. 100% privat - Verarbeitung im Browser.',
      content: generateContent('de', 'ocr-vision')
    },
    it: {
      metaTitle: 'Estrarre Testo dalle Immagini Gratis | OCR Multilingua',
      metaDescription: 'Converti immagini e PDF in testo modificabile con OCR. Riconosce italiano, inglese e altre lingue. 100% privato - l\'elaborazione avviene nel browser.',
      content: generateContent('it', 'ocr-vision')
    },
    pt: {
      metaTitle: 'Extrair Texto de Imagens Online Grátis | OCR Multilíngue',
      metaDescription: 'Converta imagens e PDFs em texto editável com OCR. Reconhece português, inglês e mais idiomas. 100% privado - o processamento acontece no navegador.',
      content: generateContent('pt', 'ocr-vision')
    }
  }
};

// Función para generar contenido SEO en formato Lexical
function generateContent(locale: string, tool: string): any {
  const p = (text: string) => ({
    type: "paragraph",
    format: "start",
    indent: 0,
    version: 1,
    children: [{ mode: "normal", text, type: "text", style: "", detail: 0, format: 0, version: 1 }],
    direction: "ltr"
  });
  
  const h2 = (text: string) => ({
    tag: "h2",
    type: "heading",
    format: "start",
    indent: 0,
    version: 1,
    children: [{ text, type: "text", version: 1 }],
    direction: "ltr"
  });

  const h3 = (text: string) => ({
    tag: "h3",
    type: "heading",
    format: "start",
    indent: 0,
    version: 1,
    children: [{ text, type: "text", version: 1 }],
    direction: "ltr"
  });

  const contents: Record<string, Record<string, any>> = {
    es: {
      vault: {
        root: {
          type: "root", format: "", indent: 0, version: 1,
          children: [
            h2("¿Por qué usar OHCodex Vault?"),
            p("En un mundo donde la privacidad digital está constantemente amenazada, necesitas herramientas que garanticen la seguridad de tu información sensible. OHCodex Vault utiliza el algoritmo AES-256, el mismo estándar de encriptación que usan los bancos y el gobierno de Estados Unidos para proteger información clasificada."),
            h3("Encriptación 100% Client-Side"),
            p("A diferencia de otros servicios que procesan tus datos en sus servidores, Vault realiza toda la encriptación directamente en tu navegador. Tus archivos y contraseñas nunca viajan por internet sin protección, garantizando una privacidad absoluta."),
            h3("Comparte Contraseñas de Forma Segura"),
            p("¿Necesitas enviar una contraseña a un cliente o compañero? Encríptala con Vault, copia el resultado y envíalo por cualquier canal (email, WhatsApp, Slack). Solo quien tenga la contraseña de desencriptación podrá acceder al contenido."),
            h3("Compatible con Todos los Dispositivos"),
            p("Vault funciona en cualquier navegador moderno: Chrome, Firefox, Safari, Edge. No necesitas instalar aplicaciones ni crear cuentas. Accede a la herramienta desde tu ordenador, tablet o smartphone."),
            h2("¿Cómo funciona la encriptación AES-256?"),
            p("AES (Advanced Encryption Standard) es un algoritmo de encriptación simétrica que transforma tus datos en un código ilegible usando una clave de 256 bits. Esto significa que existen 2^256 combinaciones posibles, haciendo prácticamente imposible descifrar la información sin la clave correcta, incluso con supercomputadores.")
          ]
        }
      },
      'image-optimizer': {
        root: {
          type: "root", format: "", indent: 0, version: 1,
          children: [
            h2("Optimización de Imágenes para Web"),
            p("Las imágenes pesadas son una de las principales causas de lentitud en los sitios web. Con Pixel Optimizer puedes reducir el tamaño de tus fotos hasta un 90% manteniendo una calidad visual excelente, mejorando drásticamente la velocidad de carga de tu página."),
            h3("Formato WebP: El Estándar Moderno"),
            p("WebP es el formato de imagen desarrollado por Google que ofrece una compresión superior a JPG y PNG sin pérdida de calidad. Las imágenes WebP son típicamente un 25-35% más pequeñas que JPEG y un 26% más pequeñas que PNG, manteniendo la misma calidad visual."),
            h3("Procesamiento por Lotes"),
            p("¿Tienes cientos de imágenes para optimizar? Nuestro procesamiento por lotes te permite subir y comprimir múltiples archivos simultáneamente, ahorrándote horas de trabajo manual. Descarga todas las imágenes optimizadas en un solo archivo ZIP."),
            h3("100% Privado y Seguro"),
            p("Tus fotos nunca salen de tu dispositivo. Todo el procesamiento ocurre localmente en tu navegador usando JavaScript. No almacenamos ni tenemos acceso a ninguna de tus imágenes, garantizando total privacidad."),
            h2("Mejora tu SEO con Imágenes Optimizadas"),
            p("Google considera la velocidad de carga como un factor crucial para el posicionamiento. Las imágenes optimizadas no solo mejoran tu ranking en buscadores, sino que también reducen la tasa de rebote y mejoran la experiencia del usuario en dispositivos móviles.")
          ]
        }
      },
      'pdf-studio': {
        root: {
          type: "root", format: "", indent: 0, version: 1,
          children: [
            h2("Gestión de PDFs sin Complicaciones"),
            p("Los documentos PDF son el estándar universal para compartir documentos oficiales, pero editarlos suele requerir software costoso. PDF Studio te permite realizar las operaciones más comunes de forma gratuita y desde cualquier dispositivo con navegador."),
            h3("Une Varios PDF en uno Solo"),
            p("¿Tienes varios documentos dispersos que necesitas consolidar? Sube múltiples archivos PDF, arrástralos para ordenarlos según prefieras y descarga un único documento combinado. Ideal para crear dossieres, presentaciones o expedientes."),
            h3("Firma Documentos Digitalmente"),
            p("Añade tu firma manuscrita a cualquier documento PDF. Dibuja tu firma con el ratón o touchpad, posiciónala donde necesites y descarga el documento firmado. Perfecto para contratos, autorizaciones y documentos legales."),
            h3("Rota Páginas Incorrectamente Orientadas"),
            p("¿Alguna página del PDF está girada? Con un solo clic puedes rotar páginas individuales 90°, 180° o 270° para corregir la orientación antes de guardar el documento final."),
            h2("Sin Marcas de Agua ni Límites"),
            p("A diferencia de otros servicios online, PDF Studio no añade marcas de agua a tus documentos ni impone límites diarios de uso. Procesa tantos PDFs como necesites, siempre gratis y sin registro.")
          ]
        }
      },
      'data-station': {
        root: {
          type: "root", format: "", indent: 0, version: 1,
          children: [
            h2("Herramientas Esenciales para Desarrolladores"),
            p("Data Station es tu kit de utilidades para trabajar con datos estructurados. Valida la sintaxis de tu JSON antes de enviarlo a producción, formatea consultas SQL para mejorar su legibilidad, o convierte entre diferentes formatos de datos."),
            h3("Validador JSON en Tiempo Real"),
            p("Evita errores costosos validando tu JSON antes de usarlo en tu aplicación. Nuestro validador detecta errores de sintaxis, comillas faltantes, comas sobrantes y problemas de estructura, mostrándote exactamente dónde está el problema."),
            h3("Conversor JSON ↔ CSV"),
            p("¿Necesitas importar datos de una API a Excel? ¿O convertir una hoja de cálculo a formato JSON para tu aplicación? Nuestro conversor maneja ambas direcciones preservando la estructura de los datos y generando archivos listos para usar."),
            h3("Formateador SQL Profesional"),
            p("Las consultas SQL largas y desordenadas son difíciles de mantener. Pega tu SQL y obtén código perfectamente indentado con colores de sintaxis, palabras clave en mayúsculas y estructura clara. Compatible con MySQL, PostgreSQL y SQL Server."),
            h2("Privacidad Garantizada"),
            p("Data Station procesa todos los datos localmente en tu navegador. Tus JSONs, consultas SQL y datos sensibles nunca se transmiten a nuestros servidores, haciendo esta herramienta segura incluso para datos de producción.")
          ]
        }
      },
      'qr-factory': {
        root: {
          type: "root", format: "", indent: 0, version: 1,
          children: [
            h2("Códigos QR Profesionales para tu Negocio"),
            p("Los códigos QR han dejado de ser una curiosidad tecnológica para convertirse en una herramienta esencial de marketing y operaciones. QR Factory te permite crear códigos QR personalizados de alta calidad para cualquier propósito."),
            h3("Múltiples Tipos de Contenido"),
            p("Crea códigos QR para URLs de tu web, redes WiFi (los usuarios se conectan escaneando), tarjetas de contacto vCard, mensajes de WhatsApp predefinidos, o simplemente texto plano. Cada tipo está optimizado para su propósito específico."),
            h3("Personalización con tu Logo"),
            p("Diferencia tus códigos QR añadiendo tu logo o imagen central. El código seguirá siendo escaneable mientras refuerza la identidad de tu marca. Ajusta los colores para que coincidan con tu branding corporativo."),
            h3("Exportación Vectorial SVG"),
            p("Para uso profesional e impresión, exporta tus códigos QR en formato SVG vectorial. Esto garantiza que el código se vea nítido a cualquier tamaño, desde tarjetas de visita hasta lonas publicitarias."),
            h3("Escáner de Códigos Integrado"),
            p("¿Necesitas verificar qué contiene un código QR? Nuestro escáner te permite subir una imagen con código QR y leer su contenido al instante, útil para auditorías de seguridad o depuración."),
            h2("Códigos de Barras para Retail"),
            p("Además de QR, genera códigos de barras estándar EAN-13, UPC y CODE128 para etiquetado de productos, inventario y punto de venta.")
          ]
        }
      },
      'ocr-vision': {
        root: {
          type: "root", format: "", indent: 0, version: 1,
          children: [
            h2("Convierte Imágenes a Texto Editable"),
            p("OCR Vision utiliza tecnología de reconocimiento óptico de caracteres (OCR) de última generación para extraer texto de imágenes, escaneos, fotos de documentos y capturas de pantalla. Convierte PDFs escaneados en documentos editables en segundos."),
            h3("Reconocimiento Multilingüe"),
            p("Nuestro motor OCR reconoce texto en español, inglés, francés, alemán, italiano y portugués con alta precisión. Ideal para documentos internacionales, traducciones o trabajar con material en diferentes idiomas."),
            h3("Procesamiento 100% Local"),
            p("A diferencia de servicios que suben tus imágenes a la nube para procesarlas, OCR Vision ejecuta todo el reconocimiento de texto directamente en tu navegador. Tus documentos confidenciales nunca abandonan tu dispositivo."),
            h3("Múltiples Formatos Soportados"),
            p("Procesa imágenes JPG, PNG, WebP e incluso archivos HEIC de iPhone. Extrae texto desde fotos de documentos, capturas de pantalla, escaneos de libros o incluso letreros y carteles fotografiados con tu móvil."),
            h2("Casos de Uso Prácticos"),
            p("Digitaliza facturas y recibos para tu contabilidad, extrae texto de libros escaneados para investigación, convierte capturas de pantalla en texto copiable, o transcríbe documentos históricos. OCR Vision es una herramienta versátil para estudiantes, profesionales y empresas.")
          ]
        }
      }
    },
    en: {
      vault: {
        root: {
          type: "root", format: "", indent: 0, version: 1,
          children: [
            h2("Why Use OHCodex Vault?"),
            p("In a world where digital privacy is constantly under threat, you need tools that guarantee the security of your sensitive information. OHCodex Vault uses the AES-256 encryption algorithm, the same standard that banks and the US government use to protect classified information."),
            h3("100% Client-Side Encryption"),
            p("Unlike other services that process your data on their servers, Vault performs all encryption directly in your browser. Your files and passwords never travel over the internet unprotected, ensuring absolute privacy."),
            h3("Share Passwords Securely"),
            p("Need to send a password to a client or colleague? Encrypt it with Vault, copy the result, and send it through any channel (email, WhatsApp, Slack). Only those with the decryption password can access the content."),
            h3("Compatible with All Devices"),
            p("Vault works in any modern browser: Chrome, Firefox, Safari, Edge. No need to install apps or create accounts. Access the tool from your computer, tablet, or smartphone."),
            h2("How Does AES-256 Encryption Work?"),
            p("AES (Advanced Encryption Standard) is a symmetric encryption algorithm that transforms your data into unreadable code using a 256-bit key. This means there are 2^256 possible combinations, making it virtually impossible to decrypt the information without the correct key, even with supercomputers.")
          ]
        }
      },
      'image-optimizer': {
        root: {
          type: "root", format: "", indent: 0, version: 1,
          children: [
            h2("Web Image Optimization"),
            p("Heavy images are one of the main causes of slow websites. With Pixel Optimizer, you can reduce your photo sizes by up to 90% while maintaining excellent visual quality, dramatically improving your page loading speed."),
            h3("WebP Format: The Modern Standard"),
            p("WebP is the image format developed by Google that offers superior compression compared to JPG and PNG without quality loss. WebP images are typically 25-35% smaller than JPEG and 26% smaller than PNG, maintaining the same visual quality."),
            h3("Batch Processing"),
            p("Have hundreds of images to optimize? Our batch processing allows you to upload and compress multiple files simultaneously, saving you hours of manual work. Download all optimized images in a single ZIP file."),
            h3("100% Private and Secure"),
            p("Your photos never leave your device. All processing happens locally in your browser using JavaScript. We don't store or have access to any of your images, guaranteeing total privacy."),
            h2("Improve Your SEO with Optimized Images"),
            p("Google considers loading speed a crucial ranking factor. Optimized images not only improve your search engine ranking but also reduce bounce rates and enhance user experience on mobile devices.")
          ]
        }
      },
      'pdf-studio': {
        root: {
          type: "root", format: "", indent: 0, version: 1,
          children: [
            h2("PDF Management Without Complications"),
            p("PDF documents are the universal standard for sharing official documents, but editing them usually requires expensive software. PDF Studio allows you to perform the most common operations for free and from any device with a browser."),
            h3("Merge Multiple PDFs into One"),
            p("Have several scattered documents that need consolidating? Upload multiple PDF files, drag them to arrange as you prefer, and download a single combined document. Ideal for creating dossiers, presentations, or files."),
            h3("Digitally Sign Documents"),
            p("Add your handwritten signature to any PDF document. Draw your signature with your mouse or touchpad, position it where you need it, and download the signed document. Perfect for contracts, authorizations, and legal documents."),
            h3("Rotate Incorrectly Oriented Pages"),
            p("Is any PDF page rotated? With a single click, you can rotate individual pages 90°, 180°, or 270° to correct the orientation before saving the final document."),
            h2("No Watermarks or Limits"),
            p("Unlike other online services, PDF Studio doesn't add watermarks to your documents or impose daily usage limits. Process as many PDFs as you need, always free and without registration.")
          ]
        }
      },
      'data-station': {
        root: {
          type: "root", format: "", indent: 0, version: 1,
          children: [
            h2("Essential Tools for Developers"),
            p("Data Station is your utility kit for working with structured data. Validate your JSON syntax before sending it to production, format SQL queries to improve readability, or convert between different data formats."),
            h3("Real-Time JSON Validator"),
            p("Avoid costly errors by validating your JSON before using it in your application. Our validator detects syntax errors, missing quotes, extra commas, and structure issues, showing you exactly where the problem is."),
            h3("JSON ↔ CSV Converter"),
            p("Need to import data from an API to Excel? Or convert a spreadsheet to JSON format for your application? Our converter handles both directions while preserving data structure and generating ready-to-use files."),
            h3("Professional SQL Formatter"),
            p("Long and messy SQL queries are hard to maintain. Paste your SQL and get perfectly indented code with syntax highlighting, uppercase keywords, and clear structure. Compatible with MySQL, PostgreSQL, and SQL Server."),
            h2("Privacy Guaranteed"),
            p("Data Station processes all data locally in your browser. Your JSONs, SQL queries, and sensitive data are never transmitted to our servers, making this tool safe even for production data.")
          ]
        }
      },
      'qr-factory': {
        root: {
          type: "root", format: "", indent: 0, version: 1,
          children: [
            h2("Professional QR Codes for Your Business"),
            p("QR codes have evolved from a technological curiosity to an essential marketing and operations tool. QR Factory allows you to create high-quality custom QR codes for any purpose."),
            h3("Multiple Content Types"),
            p("Create QR codes for your website URLs, WiFi networks (users connect by scanning), vCard contact cards, predefined WhatsApp messages, or plain text. Each type is optimized for its specific purpose."),
            h3("Customization with Your Logo"),
            p("Differentiate your QR codes by adding your logo or central image. The code will remain scannable while reinforcing your brand identity. Adjust colors to match your corporate branding."),
            h3("Vector SVG Export"),
            p("For professional use and printing, export your QR codes in SVG vector format. This ensures the code looks sharp at any size, from business cards to advertising banners."),
            h3("Integrated Code Scanner"),
            p("Need to verify what a QR code contains? Our scanner allows you to upload an image with a QR code and read its content instantly, useful for security audits or debugging."),
            h2("Barcodes for Retail"),
            p("In addition to QR, generate standard EAN-13, UPC, and CODE128 barcodes for product labeling, inventory, and point of sale.")
          ]
        }
      },
      'ocr-vision': {
        root: {
          type: "root", format: "", indent: 0, version: 1,
          children: [
            h2("Convert Images to Editable Text"),
            p("OCR Vision uses state-of-the-art optical character recognition (OCR) technology to extract text from images, scans, document photos, and screenshots. Convert scanned PDFs into editable documents in seconds."),
            h3("Multilingual Recognition"),
            p("Our OCR engine recognizes text in English, Spanish, French, German, Italian, and Portuguese with high accuracy. Ideal for international documents, translations, or working with material in different languages."),
            h3("100% Local Processing"),
            p("Unlike services that upload your images to the cloud for processing, OCR Vision executes all text recognition directly in your browser. Your confidential documents never leave your device."),
            h3("Multiple Supported Formats"),
            p("Process JPG, PNG, WebP images, and even HEIC files from iPhone. Extract text from document photos, screenshots, book scans, or even signs and posters photographed with your mobile phone."),
            h2("Practical Use Cases"),
            p("Digitize invoices and receipts for your accounting, extract text from scanned books for research, convert screenshots into copyable text, or transcribe historical documents. OCR Vision is a versatile tool for students, professionals, and businesses.")
          ]
        }
      }
    },
    fr: {
      vault: {
        root: {
          type: "root", format: "", indent: 0, version: 1,
          children: [
            h2("Pourquoi utiliser OHCodex Vault ?"),
            p("Dans un monde où la confidentialité numérique est constamment menacée, vous avez besoin d'outils qui garantissent la sécurité de vos informations sensibles. OHCodex Vault utilise l'algorithme de chiffrement AES-256, le même standard que les banques et le gouvernement américain utilisent pour protéger les informations classifiées."),
            h3("Chiffrement 100% Côté Client"),
            p("Contrairement à d'autres services qui traitent vos données sur leurs serveurs, Vault effectue tout le chiffrement directement dans votre navigateur. Vos fichiers et mots de passe ne voyagent jamais sur Internet sans protection, assurant une confidentialité absolue."),
            h3("Partagez les Mots de Passe en Toute Sécurité"),
            p("Besoin d'envoyer un mot de passe à un client ou collègue ? Chiffrez-le avec Vault, copiez le résultat et envoyez-le via n'importe quel canal (email, WhatsApp, Slack). Seuls ceux qui ont le mot de passe de déchiffrement pourront accéder au contenu."),
            h2("Comment fonctionne le chiffrement AES-256 ?"),
            p("AES (Advanced Encryption Standard) est un algorithme de chiffrement symétrique qui transforme vos données en code illisible en utilisant une clé de 256 bits. Cela signifie qu'il existe 2^256 combinaisons possibles, rendant pratiquement impossible de déchiffrer les informations sans la clé correcte.")
          ]
        }
      },
      'image-optimizer': {
        root: {
          type: "root", format: "", indent: 0, version: 1,
          children: [
            h2("Optimisation d'Images pour le Web"),
            p("Les images lourdes sont l'une des principales causes de lenteur des sites web. Avec Pixel Optimizer, vous pouvez réduire la taille de vos photos jusqu'à 90% tout en maintenant une excellente qualité visuelle, améliorant considérablement la vitesse de chargement de votre page."),
            h3("Format WebP : Le Standard Moderne"),
            p("WebP est le format d'image développé par Google qui offre une compression supérieure au JPG et PNG sans perte de qualité. Les images WebP sont généralement 25-35% plus petites que JPEG et 26% plus petites que PNG."),
            h3("Traitement par Lots"),
            p("Vous avez des centaines d'images à optimiser ? Notre traitement par lots vous permet de télécharger et compresser plusieurs fichiers simultanément, vous faisant gagner des heures de travail manuel."),
            h2("Améliorez votre SEO avec des Images Optimisées"),
            p("Google considère la vitesse de chargement comme un facteur crucial pour le positionnement. Les images optimisées améliorent non seulement votre classement dans les moteurs de recherche, mais réduisent également le taux de rebond.")
          ]
        }
      },
      'pdf-studio': {
        root: {
          type: "root", format: "", indent: 0, version: 1,
          children: [
            h2("Gestion de PDFs sans Complications"),
            p("Les documents PDF sont le standard universel pour partager des documents officiels, mais les éditer nécessite généralement des logiciels coûteux. PDF Studio vous permet d'effectuer les opérations les plus courantes gratuitement et depuis n'importe quel appareil."),
            h3("Fusionner Plusieurs PDF en un Seul"),
            p("Vous avez plusieurs documents épars à consolider ? Téléchargez plusieurs fichiers PDF, faites-les glisser pour les arranger selon vos préférences, et téléchargez un document combiné unique."),
            h3("Signer des Documents Numériquement"),
            p("Ajoutez votre signature manuscrite à n'importe quel document PDF. Dessinez votre signature avec votre souris ou touchpad, positionnez-la où vous en avez besoin, et téléchargez le document signé."),
            h2("Sans Filigrane ni Limites"),
            p("Contrairement à d'autres services en ligne, PDF Studio n'ajoute pas de filigrane à vos documents et n'impose pas de limites d'utilisation quotidiennes. Traitez autant de PDFs que nécessaire, toujours gratuitement.")
          ]
        }
      },
      'data-station': {
        root: {
          type: "root", format: "", indent: 0, version: 1,
          children: [
            h2("Outils Essentiels pour Développeurs"),
            p("Data Station est votre kit d'utilitaires pour travailler avec des données structurées. Validez la syntaxe de votre JSON avant de l'envoyer en production, formatez les requêtes SQL pour améliorer leur lisibilité."),
            h3("Validateur JSON en Temps Réel"),
            p("Évitez les erreurs coûteuses en validant votre JSON avant de l'utiliser dans votre application. Notre validateur détecte les erreurs de syntaxe, guillemets manquants, virgules superflues et problèmes de structure."),
            h3("Convertisseur JSON ↔ CSV"),
            p("Besoin d'importer des données d'une API vers Excel ? Ou convertir une feuille de calcul au format JSON pour votre application ? Notre convertisseur gère les deux directions tout en préservant la structure des données."),
            h2("Confidentialité Garantie"),
            p("Data Station traite toutes les données localement dans votre navigateur. Vos JSON, requêtes SQL et données sensibles ne sont jamais transmis à nos serveurs.")
          ]
        }
      },
      'qr-factory': {
        root: {
          type: "root", format: "", indent: 0, version: 1,
          children: [
            h2("Codes QR Professionnels pour Votre Entreprise"),
            p("Les codes QR sont passés d'une curiosité technologique à un outil essentiel de marketing et d'opérations. QR Factory vous permet de créer des codes QR personnalisés de haute qualité pour n'importe quel usage."),
            h3("Personnalisation avec Votre Logo"),
            p("Différenciez vos codes QR en ajoutant votre logo ou image centrale. Le code restera lisible tout en renforçant l'identité de votre marque. Ajustez les couleurs pour correspondre à votre image de marque."),
            h3("Exportation Vectorielle SVG"),
            p("Pour un usage professionnel et l'impression, exportez vos codes QR au format vectoriel SVG. Cela garantit que le code reste net à n'importe quelle taille, des cartes de visite aux bannières publicitaires."),
            h2("Codes-Barres pour le Commerce"),
            p("En plus du QR, générez des codes-barres standard EAN-13, UPC et CODE128 pour l'étiquetage de produits, l'inventaire et le point de vente.")
          ]
        }
      },
      'ocr-vision': {
        root: {
          type: "root", format: "", indent: 0, version: 1,
          children: [
            h2("Convertissez les Images en Texte Éditable"),
            p("OCR Vision utilise la technologie de reconnaissance optique de caractères (OCR) de dernière génération pour extraire le texte des images, scans, photos de documents et captures d'écran. Convertissez des PDFs scannés en documents éditables en quelques secondes."),
            h3("Reconnaissance Multilingue"),
            p("Notre moteur OCR reconnaît le texte en français, anglais, espagnol, allemand, italien et portugais avec une haute précision. Idéal pour les documents internationaux et les traductions."),
            h3("Traitement 100% Local"),
            p("Contrairement aux services qui téléchargent vos images dans le cloud pour les traiter, OCR Vision exécute toute la reconnaissance de texte directement dans votre navigateur. Vos documents confidentiels ne quittent jamais votre appareil."),
            h2("Cas d'Usage Pratiques"),
            p("Numérisez les factures et reçus pour votre comptabilité, extrayez le texte de livres scannés pour la recherche, convertissez les captures d'écran en texte copiable. OCR Vision est un outil polyvalent pour étudiants, professionnels et entreprises.")
          ]
        }
      }
    },
    de: {
      vault: {
        root: {
          type: "root", format: "", indent: 0, version: 1,
          children: [
            h2("Warum OHCodex Vault verwenden?"),
            p("In einer Welt, in der die digitale Privatsphäre ständig bedroht ist, brauchen Sie Tools, die die Sicherheit Ihrer sensiblen Informationen garantieren. OHCodex Vault verwendet den AES-256-Verschlüsselungsalgorithmus, denselben Standard, den Banken und die US-Regierung zum Schutz klassifizierter Informationen verwenden."),
            h3("100% Client-Seitige Verschlüsselung"),
            p("Im Gegensatz zu anderen Diensten, die Ihre Daten auf ihren Servern verarbeiten, führt Vault die gesamte Verschlüsselung direkt in Ihrem Browser durch. Ihre Dateien und Passwörter reisen nie ungeschützt über das Internet."),
            h3("Passwörter Sicher Teilen"),
            p("Müssen Sie einem Kunden oder Kollegen ein Passwort senden? Verschlüsseln Sie es mit Vault, kopieren Sie das Ergebnis und senden Sie es über jeden Kanal (E-Mail, WhatsApp, Slack). Nur wer das Entschlüsselungspasswort hat, kann auf den Inhalt zugreifen."),
            h2("Wie funktioniert AES-256-Verschlüsselung?"),
            p("AES (Advanced Encryption Standard) ist ein symmetrischer Verschlüsselungsalgorithmus, der Ihre Daten mit einem 256-Bit-Schlüssel in unlesbaren Code transformiert. Das bedeutet, dass es 2^256 mögliche Kombinationen gibt.")
          ]
        }
      },
      'image-optimizer': {
        root: {
          type: "root", format: "", indent: 0, version: 1,
          children: [
            h2("Web-Bildoptimierung"),
            p("Schwere Bilder sind eine der Hauptursachen für langsame Websites. Mit Pixel Optimizer können Sie Ihre Fotogrößen um bis zu 90% reduzieren und dabei eine ausgezeichnete Bildqualität beibehalten."),
            h3("WebP-Format: Der moderne Standard"),
            p("WebP ist das von Google entwickelte Bildformat, das eine bessere Kompression als JPG und PNG ohne Qualitätsverlust bietet. WebP-Bilder sind typischerweise 25-35% kleiner als JPEG."),
            h3("Stapelverarbeitung"),
            p("Haben Sie Hunderte von Bildern zu optimieren? Unsere Stapelverarbeitung ermöglicht es Ihnen, mehrere Dateien gleichzeitig hochzuladen und zu komprimieren."),
            h2("Verbessern Sie Ihr SEO mit optimierten Bildern"),
            p("Google betrachtet die Ladegeschwindigkeit als entscheidenden Ranking-Faktor. Optimierte Bilder verbessern nicht nur Ihr Suchmaschinen-Ranking, sondern reduzieren auch die Absprungrate.")
          ]
        }
      },
      'pdf-studio': {
        root: {
          type: "root", format: "", indent: 0, version: 1,
          children: [
            h2("PDF-Verwaltung ohne Komplikationen"),
            p("PDF-Dokumente sind der universelle Standard für den Austausch offizieller Dokumente, aber ihre Bearbeitung erfordert normalerweise teure Software. PDF Studio ermöglicht Ihnen die häufigsten Operationen kostenlos."),
            h3("Mehrere PDFs zu einem Zusammenführen"),
            p("Haben Sie mehrere verstreute Dokumente, die konsolidiert werden müssen? Laden Sie mehrere PDF-Dateien hoch, ziehen Sie sie per Drag & Drop, um sie zu ordnen, und laden Sie ein einziges kombiniertes Dokument herunter."),
            h3("Dokumente digital signieren"),
            p("Fügen Sie Ihre handschriftliche Unterschrift zu jedem PDF-Dokument hinzu. Zeichnen Sie Ihre Unterschrift mit Maus oder Touchpad, positionieren Sie sie nach Bedarf und laden Sie das signierte Dokument herunter."),
            h2("Ohne Wasserzeichen oder Limits"),
            p("Anders als andere Online-Dienste fügt PDF Studio Ihren Dokumenten keine Wasserzeichen hinzu und setzt keine täglichen Nutzungslimits. Verarbeiten Sie so viele PDFs wie nötig, immer kostenlos.")
          ]
        }
      },
      'data-station': {
        root: {
          type: "root", format: "", indent: 0, version: 1,
          children: [
            h2("Wichtige Tools für Entwickler"),
            p("Data Station ist Ihr Dienstprogramm-Kit für die Arbeit mit strukturierten Daten. Validieren Sie Ihre JSON-Syntax, bevor Sie sie in die Produktion senden, formatieren Sie SQL-Abfragen zur Verbesserung der Lesbarkeit."),
            h3("Echtzeit-JSON-Validator"),
            p("Vermeiden Sie kostspielige Fehler, indem Sie Ihr JSON validieren, bevor Sie es in Ihrer Anwendung verwenden. Unser Validator erkennt Syntaxfehler, fehlende Anführungszeichen und Strukturprobleme."),
            h3("JSON ↔ CSV Konverter"),
            p("Müssen Sie Daten von einer API nach Excel importieren? Oder eine Tabelle in JSON-Format für Ihre Anwendung konvertieren? Unser Konverter unterstützt beide Richtungen."),
            h2("Datenschutz Garantiert"),
            p("Data Station verarbeitet alle Daten lokal in Ihrem Browser. Ihre JSONs, SQL-Abfragen und sensiblen Daten werden niemals an unsere Server übertragen.")
          ]
        }
      },
      'qr-factory': {
        root: {
          type: "root", format: "", indent: 0, version: 1,
          children: [
            h2("Professionelle QR-Codes für Ihr Unternehmen"),
            p("QR-Codes haben sich von einer technologischen Kuriosität zu einem unverzichtbaren Marketing- und Betriebswerkzeug entwickelt. QR Factory ermöglicht Ihnen die Erstellung hochwertiger benutzerdefinierter QR-Codes."),
            h3("Anpassung mit Ihrem Logo"),
            p("Heben Sie sich von anderen ab, indem Sie Ihr Logo oder ein zentrales Bild hinzufügen. Der Code bleibt lesbar und verstärkt gleichzeitig Ihre Markenidentität."),
            h3("Vektor-SVG-Export"),
            p("Für den professionellen Einsatz und den Druck exportieren Sie Ihre QR-Codes im SVG-Vektorformat. Dies stellt sicher, dass der Code in jeder Größe scharf aussieht."),
            h2("Strichcodes für den Einzelhandel"),
            p("Zusätzlich zu QR generieren Sie Standard-EAN-13-, UPC- und CODE128-Strichcodes für Produktkennzeichnung, Inventar und Point of Sale.")
          ]
        }
      },
      'ocr-vision': {
        root: {
          type: "root", format: "", indent: 0, version: 1,
          children: [
            h2("Bilder in bearbeitbaren Text umwandeln"),
            p("OCR Vision verwendet modernste Technologie zur optischen Zeichenerkennung (OCR), um Text aus Bildern, Scans, Dokumentenfotos und Screenshots zu extrahieren. Konvertieren Sie gescannte PDFs in Sekundenschnelle in bearbeitbare Dokumente."),
            h3("Mehrsprachige Erkennung"),
            p("Unsere OCR-Engine erkennt Text in Deutsch, Englisch, Spanisch, Französisch, Italienisch und Portugiesisch mit hoher Genauigkeit. Ideal für internationale Dokumente und Übersetzungen."),
            h3("100% Lokale Verarbeitung"),
            p("Im Gegensatz zu Diensten, die Ihre Bilder zur Verarbeitung in die Cloud hochladen, führt OCR Vision die gesamte Texterkennung direkt in Ihrem Browser durch. Ihre vertraulichen Dokumente verlassen nie Ihr Gerät."),
            h2("Praktische Anwendungsfälle"),
            p("Digitalisieren Sie Rechnungen und Belege für Ihre Buchhaltung, extrahieren Sie Text aus gescannten Büchern für Forschungszwecke, konvertieren Sie Screenshots in kopierbaren Text. OCR Vision ist ein vielseitiges Werkzeug.")
          ]
        }
      }
    },
    it: {
      vault: {
        root: {
          type: "root", format: "", indent: 0, version: 1,
          children: [
            h2("Perché usare OHCodex Vault?"),
            p("In un mondo dove la privacy digitale è costantemente minacciata, hai bisogno di strumenti che garantiscano la sicurezza delle tue informazioni sensibili. OHCodex Vault utilizza l'algoritmo di crittografia AES-256, lo stesso standard che banche e governo USA usano per proteggere informazioni classificate."),
            h3("Crittografia 100% Lato Client"),
            p("A differenza di altri servizi che elaborano i tuoi dati sui loro server, Vault esegue tutta la crittografia direttamente nel tuo browser. I tuoi file e password non viaggiano mai su Internet senza protezione."),
            h3("Condividi Password in Modo Sicuro"),
            p("Devi inviare una password a un cliente o collega? Crittala con Vault, copia il risultato e invialo tramite qualsiasi canale (email, WhatsApp, Slack). Solo chi ha la password di decrittazione potrà accedere al contenuto."),
            h2("Come funziona la crittografia AES-256?"),
            p("AES (Advanced Encryption Standard) è un algoritmo di crittografia simmetrica che trasforma i tuoi dati in codice illeggibile usando una chiave a 256 bit. Ciò significa che esistono 2^256 combinazioni possibili.")
          ]
        }
      },
      'image-optimizer': {
        root: {
          type: "root", format: "", indent: 0, version: 1,
          children: [
            h2("Ottimizzazione Immagini per il Web"),
            p("Le immagini pesanti sono una delle principali cause di lentezza nei siti web. Con Pixel Optimizer puoi ridurre le dimensioni delle tue foto fino al 90% mantenendo un'eccellente qualità visiva."),
            h3("Formato WebP: Lo Standard Moderno"),
            p("WebP è il formato immagine sviluppato da Google che offre una compressione superiore a JPG e PNG senza perdita di qualità. Le immagini WebP sono tipicamente 25-35% più piccole di JPEG."),
            h3("Elaborazione Batch"),
            p("Hai centinaia di immagini da ottimizzare? La nostra elaborazione batch ti permette di caricare e comprimere più file simultaneamente, risparmiandoti ore di lavoro manuale."),
            h2("Migliora il tuo SEO con Immagini Ottimizzate"),
            p("Google considera la velocità di caricamento un fattore cruciale per il posizionamento. Le immagini ottimizzate non solo migliorano il tuo ranking nei motori di ricerca, ma riducono anche il tasso di rimbalzo.")
          ]
        }
      },
      'pdf-studio': {
        root: {
          type: "root", format: "", indent: 0, version: 1,
          children: [
            h2("Gestione PDF senza Complicazioni"),
            p("I documenti PDF sono lo standard universale per condividere documenti ufficiali, ma modificarli richiede solitamente software costosi. PDF Studio ti permette di eseguire le operazioni più comuni gratuitamente."),
            h3("Unisci Più PDF in Uno"),
            p("Hai diversi documenti sparsi da consolidare? Carica più file PDF, trascinali per ordinarli come preferisci e scarica un unico documento combinato."),
            h3("Firma Documenti Digitalmente"),
            p("Aggiungi la tua firma manoscritta a qualsiasi documento PDF. Disegna la tua firma con mouse o touchpad, posizionala dove necessiti e scarica il documento firmato."),
            h2("Senza Filigrane o Limiti"),
            p("A differenza di altri servizi online, PDF Studio non aggiunge filigrane ai tuoi documenti né impone limiti di utilizzo giornalieri. Elabora tutti i PDF di cui hai bisogno, sempre gratis.")
          ]
        }
      },
      'data-station': {
        root: {
          type: "root", format: "", indent: 0, version: 1,
          children: [
            h2("Strumenti Essenziali per Sviluppatori"),
            p("Data Station è il tuo kit di utilità per lavorare con dati strutturati. Valida la sintassi del tuo JSON prima di inviarlo in produzione, formatta le query SQL per migliorarne la leggibilità."),
            h3("Validatore JSON in Tempo Reale"),
            p("Evita errori costosi validando il tuo JSON prima di usarlo nella tua applicazione. Il nostro validatore rileva errori di sintassi, virgolette mancanti e problemi di struttura."),
            h3("Convertitore JSON ↔ CSV"),
            p("Hai bisogno di importare dati da un'API in Excel? O convertire un foglio di calcolo in formato JSON per la tua applicazione? Il nostro convertitore gestisce entrambe le direzioni."),
            h2("Privacy Garantita"),
            p("Data Station elabora tutti i dati localmente nel tuo browser. I tuoi JSON, query SQL e dati sensibili non vengono mai trasmessi ai nostri server.")
          ]
        }
      },
      'qr-factory': {
        root: {
          type: "root", format: "", indent: 0, version: 1,
          children: [
            h2("Codici QR Professionali per il Tuo Business"),
            p("I codici QR sono passati da una curiosità tecnologica a uno strumento essenziale di marketing e operazioni. QR Factory ti permette di creare codici QR personalizzati di alta qualità."),
            h3("Personalizzazione con il Tuo Logo"),
            p("Differenzia i tuoi codici QR aggiungendo il tuo logo o un'immagine centrale. Il codice rimarrà scansionabile mentre rafforza l'identità del tuo brand."),
            h3("Esportazione Vettoriale SVG"),
            p("Per uso professionale e stampa, esporta i tuoi codici QR in formato vettoriale SVG. Questo garantisce che il codice appaia nitido a qualsiasi dimensione."),
            h2("Codici a Barre per il Retail"),
            p("Oltre ai QR, genera codici a barre standard EAN-13, UPC e CODE128 per etichettatura prodotti, inventario e punto vendita.")
          ]
        }
      },
      'ocr-vision': {
        root: {
          type: "root", format: "", indent: 0, version: 1,
          children: [
            h2("Converti Immagini in Testo Modificabile"),
            p("OCR Vision utilizza la tecnologia OCR (Riconoscimento Ottico dei Caratteri) all'avanguardia per estrarre testo da immagini, scansioni, foto di documenti e screenshot. Converti PDF scansionati in documenti modificabili in pochi secondi."),
            h3("Riconoscimento Multilingue"),
            p("Il nostro motore OCR riconosce testo in italiano, inglese, spagnolo, francese, tedesco e portoghese con alta precisione. Ideale per documenti internazionali e traduzioni."),
            h3("Elaborazione 100% Locale"),
            p("A differenza dei servizi che caricano le tue immagini sul cloud per elaborarle, OCR Vision esegue tutto il riconoscimento testo direttamente nel tuo browser. I tuoi documenti confidenziali non lasciano mai il tuo dispositivo."),
            h2("Casi d'Uso Pratici"),
            p("Digitalizza fatture e ricevute per la tua contabilità, estrai testo da libri scansionati per ricerca, converti screenshot in testo copiabile. OCR Vision è uno strumento versatile per studenti, professionisti e aziende.")
          ]
        }
      }
    },
    pt: {
      vault: {
        root: {
          type: "root", format: "", indent: 0, version: 1,
          children: [
            h2("Por que usar OHCodex Vault?"),
            p("Em um mundo onde a privacidade digital está constantemente ameaçada, você precisa de ferramentas que garantam a segurança de suas informações sensíveis. OHCodex Vault usa o algoritmo de criptografia AES-256, o mesmo padrão que bancos e o governo dos EUA usam para proteger informações classificadas."),
            h3("Criptografia 100% Client-Side"),
            p("Diferente de outros serviços que processam seus dados em seus servidores, Vault realiza toda a criptografia diretamente no seu navegador. Seus arquivos e senhas nunca viajam pela internet sem proteção."),
            h3("Compartilhe Senhas de Forma Segura"),
            p("Precisa enviar uma senha para um cliente ou colega? Criptografe com Vault, copie o resultado e envie por qualquer canal (email, WhatsApp, Slack). Somente quem tiver a senha de descriptografia poderá acessar o conteúdo."),
            h2("Como funciona a criptografia AES-256?"),
            p("AES (Advanced Encryption Standard) é um algoritmo de criptografia simétrica que transforma seus dados em um código ilegível usando uma chave de 256 bits. Isso significa que existem 2^256 combinações possíveis.")
          ]
        }
      },
      'image-optimizer': {
        root: {
          type: "root", format: "", indent: 0, version: 1,
          children: [
            h2("Otimização de Imagens para Web"),
            p("Imagens pesadas são uma das principais causas de lentidão em sites. Com Pixel Optimizer, você pode reduzir o tamanho das suas fotos em até 90% mantendo excelente qualidade visual."),
            h3("Formato WebP: O Padrão Moderno"),
            p("WebP é o formato de imagem desenvolvido pelo Google que oferece compressão superior ao JPG e PNG sem perda de qualidade. Imagens WebP são tipicamente 25-35% menores que JPEG."),
            h3("Processamento em Lote"),
            p("Tem centenas de imagens para otimizar? Nosso processamento em lote permite carregar e comprimir vários arquivos simultaneamente, economizando horas de trabalho manual."),
            h2("Melhore seu SEO com Imagens Otimizadas"),
            p("O Google considera a velocidade de carregamento um fator crucial para posicionamento. Imagens otimizadas não apenas melhoram seu ranking nos mecanismos de busca, mas também reduzem a taxa de rejeição.")
          ]
        }
      },
      'pdf-studio': {
        root: {
          type: "root", format: "", indent: 0, version: 1,
          children: [
            h2("Gestão de PDFs sem Complicações"),
            p("Documentos PDF são o padrão universal para compartilhar documentos oficiais, mas editá-los geralmente requer software caro. PDF Studio permite realizar as operações mais comuns gratuitamente."),
            h3("Unir Vários PDFs em Um"),
            p("Tem vários documentos dispersos que precisam ser consolidados? Carregue múltiplos arquivos PDF, arraste para ordenar conforme preferir e baixe um único documento combinado."),
            h3("Assinar Documentos Digitalmente"),
            p("Adicione sua assinatura manuscrita a qualquer documento PDF. Desenhe sua assinatura com mouse ou touchpad, posicione onde necessitar e baixe o documento assinado."),
            h2("Sem Marcas d'Água ou Limites"),
            p("Diferente de outros serviços online, PDF Studio não adiciona marcas d'água aos seus documentos nem impõe limites diários de uso. Processe quantos PDFs precisar, sempre grátis.")
          ]
        }
      },
      'data-station': {
        root: {
          type: "root", format: "", indent: 0, version: 1,
          children: [
            h2("Ferramentas Essenciais para Desenvolvedores"),
            p("Data Station é seu kit de utilitários para trabalhar com dados estruturados. Valide a sintaxe do seu JSON antes de enviá-lo para produção, formate consultas SQL para melhorar legibilidade."),
            h3("Validador JSON em Tempo Real"),
            p("Evite erros custosos validando seu JSON antes de usá-lo em sua aplicação. Nosso validador detecta erros de sintaxe, aspas faltantes e problemas de estrutura."),
            h3("Conversor JSON ↔ CSV"),
            p("Precisa importar dados de uma API para Excel? Ou converter uma planilha para formato JSON para sua aplicação? Nosso conversor lida com ambas as direções."),
            h2("Privacidade Garantida"),
            p("Data Station processa todos os dados localmente no seu navegador. Seus JSONs, consultas SQL e dados sensíveis nunca são transmitidos para nossos servidores.")
          ]
        }
      },
      'qr-factory': {
        root: {
          type: "root", format: "", indent: 0, version: 1,
          children: [
            h2("Códigos QR Profissionais para seu Negócio"),
            p("Códigos QR evoluíram de uma curiosidade tecnológica para uma ferramenta essencial de marketing e operações. QR Factory permite criar códigos QR personalizados de alta qualidade."),
            h3("Personalização com seu Logo"),
            p("Diferencie seus códigos QR adicionando seu logo ou imagem central. O código continuará escaneável enquanto reforça a identidade da sua marca."),
            h3("Exportação Vetorial SVG"),
            p("Para uso profissional e impressão, exporte seus códigos QR em formato vetorial SVG. Isso garante que o código fique nítido em qualquer tamanho."),
            h2("Códigos de Barras para Varejo"),
            p("Além de QR, gere códigos de barras padrão EAN-13, UPC e CODE128 para etiquetagem de produtos, inventário e ponto de venda.")
          ]
        }
      },
      'ocr-vision': {
        root: {
          type: "root", format: "", indent: 0, version: 1,
          children: [
            h2("Converter Imagens em Texto Editável"),
            p("OCR Vision usa tecnologia OCR (Reconhecimento Óptico de Caracteres) de última geração para extrair texto de imagens, scans, fotos de documentos e screenshots. Converta PDFs escaneados em documentos editáveis em segundos."),
            h3("Reconhecimento Multilíngue"),
            p("Nosso motor OCR reconhece texto em português, inglês, espanhol, francês, italiano e alemão com alta precisão. Ideal para documentos internacionais e traduções."),
            h3("Processamento 100% Local"),
            p("Diferente de serviços que fazem upload de suas imagens para a nuvem, OCR Vision executa todo o reconhecimento de texto diretamente no seu navegador. Seus documentos confidenciais nunca saem do seu dispositivo."),
            h2("Casos de Uso Práticos"),
            p("Digitalize faturas e recibos para sua contabilidade, extraia texto de livros escaneados para pesquisa, converta screenshots em texto copiável. OCR Vision é uma ferramenta versátil para estudantes, profissionais e empresas.")
          ]
        }
      }
    }
  };

  return contents[locale]?.[tool] || contents['en'][tool];
}

async function updateSEO() {
  await client.connect();
  
  for (const [slug, locales] of Object.entries(seoData)) {
    for (const [locale, data] of Object.entries(locales)) {
      await client.query(`
        UPDATE tools_locales 
        SET meta_title = $1, meta_description = $2, content = $3
        WHERE _parent_id = (SELECT id FROM tools WHERE slug = $4) AND _locale = $5
      `, [data.metaTitle, data.metaDescription, JSON.stringify(data.content), slug, locale]);
      
      console.log(`✅ ${slug} - ${locale.toUpperCase()}: SEO actualizado`);
    }
  }
  
  await client.end();
  console.log('\n🎉 SEO actualizado para todas las herramientas en todos los idiomas');
}

updateSEO().catch(console.error);
