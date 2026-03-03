// Seed para la herramienta "Image Steganography" en todos los idiomas.
// Solo AÑADE o ACTUALIZA filas, nunca hace DROP/DELETE/TRUNCATE/RESET.

require('dotenv').config()
const { Client } = require('pg')

const client = new Client({
  connectionString: process.env.DATABASE_URI,
  ssl: { rejectUnauthorized: false },
})

const LOCALES = ['es', 'en', 'fr', 'de', 'it', 'pt']

const localeData = {
  es: {
    title: 'Esteganografía en Imágenes Gratis',
    badge: 'Herramienta Esteganografía Gratis',
    shortDescription:
      'Oculta texto o archivos dentro de imágenes PNG/JPG sin subir nada a servidores. Esteganografía gratis en tu navegador, 100% privada.',
    metaTitle: 'Esteganografía en Imágenes Gratis - Oculta Mensajes en Fotos 100% Privado',
    metaDescription:
      'Herramienta de esteganografía online gratis para ocultar mensajes o archivos en imágenes PNG/JPG. Procesamiento privado en tu navegador, sin subir datos a servidores.',
    steps: [
      {
        id: 'stego-step-1-es',
        title: 'Sube tu imagen original',
        description: 'Arrastra una imagen PNG/JPG o selecciónala desde tu dispositivo. Todo se procesa localmente.',
        icon: 'upload',
      },
      {
        id: 'stego-step-2-es',
        title: 'Escribe el mensaje o adjunta el archivo',
        description:
          'Introduce el texto secreto o selecciona un archivo para incrustarlo usando técnica LSB dentro de los píxeles.',
        icon: 'settings',
      },
      {
        id: 'stego-step-3-es',
        title: 'Descarga la imagen esteganografiada',
        description:
          'Genera una nueva imagen visualmente idéntica pero con tu información oculta. Lista para compartir.',
        icon: 'download',
      },
    ],
    faqs: [
      {
        id: 'stego-faq-1-es',
        question: '¿Mis imágenes o mensajes se suben a algún servidor?',
        answer:
          'No. Toda la esteganografía ocurre directamente en tu navegador usando JavaScript y Canvas API. Las imágenes y datos nunca abandonan tu dispositivo.',
      },
      {
        id: 'stego-faq-2-es',
        question: '¿Qué tamaño máximo de mensaje o archivo puedo ocultar?',
        answer:
          'Depende de la resolución de la imagen. Cuantos más píxeles tenga, mayor capacidad. La herramienta calcula y muestra la capacidad máxima disponible antes de incrustar.',
      },
      {
        id: 'stego-faq-3-es',
        question: '¿La calidad visual de la imagen cambia al ocultar datos?',
        answer:
          'Utilizamos esteganografía por bits menos significativos (LSB) sobre los canales RGB. El ojo humano no percibe la diferencia, por lo que la imagen resultante se ve igual.',
      },
    ],
  },
  en: {
    title: 'Image Steganography Free',
    badge: 'Free Steganography Tool',
    shortDescription:
      'Hide text or files inside PNG/JPG images without uploading anything. Free steganography in your browser, 100% private.',
    metaTitle: 'Image Steganography Free - Hide Messages in Photos 100% Private',
    metaDescription:
      'Free online image steganography tool to hide messages or files inside PNG/JPG images. Private processing in your browser, without uploading data to any server.',
    steps: [
      {
        id: 'stego-step-1-en',
        title: 'Upload your original image',
        description: 'Drag and drop a PNG/JPG or select it from your device. Everything stays in your browser.',
        icon: 'upload',
      },
      {
        id: 'stego-step-2-en',
        title: 'Write the message or attach a file',
        description:
          'Enter the secret text or select a file to embed using LSB steganography directly into the image pixels.',
        icon: 'settings',
      },
      {
        id: 'stego-step-3-en',
        title: 'Download the stego image',
        description:
          'Generate a new image visually identical to the original but with your hidden payload. Ready to share safely.',
        icon: 'download',
      },
    ],
    faqs: [
      {
        id: 'stego-faq-1-en',
        question: 'Are my images or messages uploaded to any server?',
        answer:
          'No. All steganography runs directly in your browser using JavaScript and the Canvas API. Images and data never leave your device.',
      },
      {
        id: 'stego-faq-2-en',
        question: 'How much data can I hide inside an image?',
        answer:
          'It depends on the image resolution. More pixels means more capacity. The tool calculates and shows the maximum capacity before embedding.',
      },
      {
        id: 'stego-faq-3-en',
        question: 'Does image quality change when hiding data?',
        answer:
          'We use Least Significant Bit (LSB) steganography over RGB channels. The human eye cannot perceive the difference, so the resulting image looks the same.',
      },
    ],
  },
  fr: {
    title: "Stéganographie d'Images Gratuite",
    badge: 'Outil de Stéganographie Gratuit',
    shortDescription:
      "Cachez du texte ou des fichiers dans des images PNG/JPG sans téléversement. Stéganographie gratuite dans votre navigateur, 100% privée.",
    metaTitle: "Stéganographie d'Images Gratuite - Cacher des Messages dans des Photos 100% Privé",
    metaDescription:
      "Outil de stéganographie d'images en ligne gratuit pour cacher des messages ou fichiers dans des images PNG/JPG. Traitement privé dans votre navigateur, sans envoi vers un serveur.",
    steps: [
      {
        id: 'stego-step-1-fr',
        title: "Téléversez l'image originale",
        description:
          'Glissez-déposez une image PNG/JPG ou sélectionnez-la depuis votre appareil. Le traitement reste local.',
        icon: 'upload',
      },
      {
        id: 'stego-step-2-fr',
        title: 'Saisissez le message ou ajoutez un fichier',
        description:
          'Entrez le texte secret ou sélectionnez un fichier à intégrer via stéganographie LSB directement dans les pixels.',
        icon: 'settings',
      },
      {
        id: 'stego-step-3-fr',
        title: 'Téléchargez l’image stéganographiée',
        description:
          "Générez une nouvelle image visuellement identique contenant vos données cachées. Prête à être partagée en toute sécurité.",
        icon: 'download',
      },
    ],
    faqs: [
      {
        id: 'stego-faq-1-fr',
        question: 'Mes images ou messages sont-ils envoyés sur un serveur ?',
        answer:
          "Non. Toute la stéganographie s’exécute dans votre navigateur via JavaScript et Canvas. Vos images et données ne quittent jamais votre appareil.",
      },
      {
        id: 'stego-faq-2-fr',
        question: 'Quelle quantité de données puis-je cacher dans une image ?',
        answer:
          "Cela dépend de la résolution de l’image. Plus il y a de pixels, plus la capacité est grande. L’outil calcule et affiche la capacité maximale avant l’intégration.",
      },
      {
        id: 'stego-faq-3-fr',
        question: "La qualité visuelle de l'image change-t-elle ?",
        answer:
          'Nous utilisons la stéganographie par bits de poids faible (LSB) sur les canaux RGB. La différence est imperceptible pour l’œil humain.',
      },
    ],
  },
  de: {
    title: 'Bild-Steganografie Kostenlos',
    badge: 'Kostenloses Steganografie-Tool',
    shortDescription:
      'Verstecken Sie Text oder Dateien in PNG/JPG-Bildern, ohne etwas hochzuladen. Kostenlose Steganografie im Browser, 100% privat.',
    metaTitle: 'Bild-Steganografie Kostenlos - Nachrichten in Fotos Verstecken 100% Privat',
    metaDescription:
      'Kostenloses Online-Tool für Bild-Steganografie, um Nachrichten oder Dateien in PNG/JPG-Bildern zu verstecken. Lokale Verarbeitung im Browser, ohne Daten an Server zu senden.',
    steps: [
      {
        id: 'stego-step-1-de',
        title: 'Originalbild hochladen',
        description:
          'Ziehen Sie ein PNG/JPG per Drag & Drop oder wählen Sie es von Ihrem Gerät. Alles bleibt lokal im Browser.',
        icon: 'upload',
      },
      {
        id: 'stego-step-2-de',
        title: 'Nachricht eingeben oder Datei anhängen',
        description:
          'Geben Sie den geheimen Text ein oder wählen Sie eine Datei, die per LSB-Steganografie in die Bildpixel eingebettet wird.',
        icon: 'settings',
      },
      {
        id: 'stego-step-3-de',
        title: 'Stego-Bild herunterladen',
        description:
          'Erzeugen Sie ein neues Bild, das optisch identisch ist, aber Ihre versteckten Daten enthält. Sicher teilbar.',
        icon: 'download',
      },
    ],
    faqs: [
      {
        id: 'stego-faq-1-de',
        question: 'Werden meine Bilder oder Nachrichten auf Server hochgeladen?',
        answer:
          'Nein. Die gesamte Steganografie läuft direkt in Ihrem Browser mit JavaScript und Canvas. Bilder und Daten verlassen Ihr Gerät nicht.',
      },
      {
        id: 'stego-faq-2-de',
        question: 'Wie viele Daten kann ich in einem Bild verstecken?',
        answer:
          'Das hängt von der Auflösung des Bildes ab. Mehr Pixel bedeuten mehr Kapazität. Das Tool berechnet und zeigt die maximale Kapazität vor dem Einbetten an.',
      },
      {
        id: 'stego-faq-3-de',
        question: 'Ändert sich die Bildqualität beim Verstecken von Daten?',
        answer:
          'Wir verwenden LSB-Steganografie über die RGB-Kanäle. Für das menschliche Auge bleibt das resultierende Bild unverändert.',
      },
    ],
  },
  it: {
    title: 'Steganografia su Immagini Gratis',
    badge: 'Strumento di Steganografia Gratis',
    shortDescription:
      'Nascondi testo o file dentro immagini PNG/JPG senza caricare nulla. Steganografia gratuita nel tuo browser, 100% privata.',
    metaTitle: 'Steganografia su Immagini Gratis - Nascondi Messaggi nelle Foto 100% Privato',
    metaDescription:
      'Strumento di steganografia immagini online gratis per nascondere messaggi o file in immagini PNG/JPG. Elaborazione privata nel browser, senza inviare dati a server.',
    steps: [
      {
        id: 'stego-step-1-it',
        title: "Carica l'immagine originale",
        description:
          'Trascina un PNG/JPG o selezionalo dal tuo dispositivo. Tutto viene elaborato localmente nel browser.',
        icon: 'upload',
      },
      {
        id: 'stego-step-2-it',
        title: 'Scrivi il messaggio o aggiungi un file',
        description:
          'Inserisci il testo segreto o seleziona un file da incorporare tramite steganografia LSB direttamente nei pixel.',
        icon: 'settings',
      },
      {
        id: 'stego-step-3-it',
        title: "Scarica l'immagine steganografata",
        description:
          'Genera una nuova immagine visivamente identica che contiene i tuoi dati nascosti. Pronta per essere condivisa.',
        icon: 'download',
      },
    ],
    faqs: [
      {
        id: 'stego-faq-1-it',
        question: 'Le mie immagini o i miei messaggi vengono caricati su un server?',
        answer:
          'No. Tutta la steganografia viene eseguita nel tuo browser con JavaScript e Canvas. Immagini e dati non lasciano mai il tuo dispositivo.',
      },
      {
        id: 'stego-faq-2-it',
        question: 'Quanti dati posso nascondere in un’immagine?',
        answer:
          'Dipende dalla risoluzione dell’immagine. Più pixel significano maggiore capacità. Lo strumento calcola e mostra la capacità massima prima dell’inserimento.',
      },
      {
        id: 'stego-faq-3-it',
        question: "La qualità visiva dell'immagine cambia?",
        answer:
          'Utilizziamo steganografia LSB sui canali RGB. La differenza è impercettibile per l’occhio umano, quindi l’immagine appare invariata.',
      },
    ],
  },
  pt: {
    title: 'Esteganografia em Imagens Grátis',
    badge: 'Ferramenta de Esteganografia Grátis',
    shortDescription:
      'Oculte texto ou arquivos dentro de imagens PNG/JPG sem enviar nada. Esteganografia grátis no navegador, 100% privada.',
    metaTitle: 'Esteganografia em Imagens Grátis - Esconder Mensagens em Fotos 100% Privado',
    metaDescription:
      'Ferramenta de esteganografia de imagens online grátis para ocultar mensagens ou arquivos em imagens PNG/JPG. Processamento privado no navegador, sem envio de dados a servidores.',
    steps: [
      {
        id: 'stego-step-1-pt',
        title: 'Carregue a imagem original',
        description:
          'Arraste uma imagem PNG/JPG ou selecione-a do seu dispositivo. Todo o processamento ocorre localmente.',
        icon: 'upload',
      },
      {
        id: 'stego-step-2-pt',
        title: 'Escreva a mensagem ou anexe um arquivo',
        description:
          'Digite o texto secreto ou selecione um arquivo para embutir usando esteganografia LSB diretamente nos pixels.',
        icon: 'settings',
      },
      {
        id: 'stego-step-3-pt',
        title: 'Baixe a imagem esteganografada',
        description:
          'Gere uma nova imagem visualmente idêntica com seus dados ocultos. Pronta para compartilhar com segurança.',
        icon: 'download',
      },
    ],
    faqs: [
      {
        id: 'stego-faq-1-pt',
        question: 'Minhas imagens ou mensagens são enviadas para algum servidor?',
        answer:
          'Não. Toda a esteganografia é executada diretamente no seu navegador usando JavaScript e Canvas. Imagens e dados nunca saem do seu dispositivo.',
      },
      {
        id: 'stego-faq-2-pt',
        question: 'Quanto dado posso esconder em uma imagem?',
        answer:
          'Depende da resolução da imagem. Quanto mais pixels, maior a capacidade. A ferramenta calcula e mostra a capacidade máxima antes de embutir.',
      },
      {
        id: 'stego-faq-3-pt',
        question: 'A qualidade visual da imagem muda ao esconder dados?',
        answer:
          'Usamos esteganografia por bits menos significativos (LSB) nos canais RGB. A diferença é imperceptível ao olho humano.',
      },
    ],
  },
}

async function upsertTool() {
  // Crear herramienta base en `tools`
  const slug = 'image-steganography'
  const codeKey = 'image-steganography'
  const icon = 'image'
  const ctaLink = '/#contacto'

  const res = await client.query(
    `
      insert into tools (slug, code_key, icon, cta_link)
      values ($1, $2, $3, $4)
      on conflict (slug) do update
      set code_key = excluded.code_key,
          icon = excluded.icon,
          cta_link = excluded.cta_link
      returning id
    `,
    [slug, codeKey, icon, ctaLink],
  )

  const toolId = res.rows[0].id
  console.log('🔧 Tool ID for image-steganography =>', toolId)
  return toolId
}

async function upsertLocales(toolId) {
  for (const locale of LOCALES) {
    const data = localeData[locale]
    // Comprobar si ya existe fila
    const existing = await client.query(
      `select id from tools_locales where _parent_id = $1 and _locale = $2 limit 1`,
      [toolId, locale],
    )

    if (existing.rows.length === 0) {
      await client.query(
        `
          insert into tools_locales 
            (title, badge, short_description, content, cta_title, cta_description, meta_title, meta_description, _locale, _parent_id)
          values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        `,
        [
          data.title,
          data.badge,
          data.shortDescription,
          null,
          null,
          null,
          data.metaTitle,
          data.metaDescription,
          locale,
          toolId,
        ],
      )
      console.log(`✅ tools_locales INSERT ${locale}`)
    } else {
      await client.query(
        `
          update tools_locales
          set title = $1,
              badge = $2,
              short_description = $3,
              meta_title = $4,
              meta_description = $5
          where id = $6
        `,
        [
          data.title,
          data.badge,
          data.shortDescription,
          data.metaTitle,
          data.metaDescription,
          existing.rows[0].id,
        ],
      )
      console.log(`🔁 tools_locales UPDATE ${locale}`)
    }
  }
}

async function upsertSteps(toolId) {
  for (const locale of LOCALES) {
    const data = localeData[locale]
    data.steps.forEach(async (step, index) => {
      await client.query(
        `
          insert into tools_steps (_order, _parent_id, _locale, id, step_title, step_description, step_icon)
          values ($1,$2,$3,$4,$5,$6,$7)
          on conflict (id) do update
          set step_title = excluded.step_title,
              step_description = excluded.step_description,
              step_icon = excluded.step_icon
        `,
        [index + 1, toolId, locale, step.id, step.title, step.description, step.icon],
      )
    })
    console.log(`✅ tools_steps UPSERT for locale ${locale}`)
  }
}

async function upsertFaqs(toolId) {
  for (const locale of LOCALES) {
    const data = localeData[locale]
    data.faqs.forEach(async (faq, index) => {
      await client.query(
        `
          insert into tools_faqs (_order, _parent_id, _locale, id, question, answer)
          values ($1,$2,$3,$4,$5,$6)
          on conflict (id) do update
          set question = excluded.question,
              answer = excluded.answer
        `,
        [index + 1, toolId, locale, faq.id, faq.question, faq.answer],
      )
    })
    console.log(`✅ tools_faqs UPSERT for locale ${locale}`)
  }
}

async function run() {
  await client.connect()
  try {
    const toolId = await upsertTool()
    await upsertLocales(toolId)
    await upsertSteps(toolId)
    await upsertFaqs(toolId)
    console.log('\n🎉 Seed completado para Image Steganography en todos los idiomas.')
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    await client.end()
  }
}

run()

