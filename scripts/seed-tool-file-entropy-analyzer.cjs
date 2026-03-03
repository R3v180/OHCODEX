// Seed para la herramienta "File Entropy Analyzer" en todos los idiomas.
// Solo INSERT/UPDATE, sin operaciones destructivas.

require('dotenv').config()
const { Client } = require('pg')

const client = new Client({
  connectionString: process.env.DATABASE_URI,
  ssl: { rejectUnauthorized: false },
})

const LOCALES = ['es', 'en', 'fr', 'de', 'it', 'pt']

const localeData = {
  es: {
    title: 'Analizador de Entropía de Archivos Gratis',
    badge: 'Análisis de Entropía Gratis',
    shortDescription:
      'Sube un archivo y calcula su entropía de Shannon, histograma de bytes y porcentaje de aleatoriedad directamente en tu navegador. Gratis y 100% privado.',
    metaTitle:
      'Analizador de Entropía de Archivos Gratis - Detectar Archivo Cifrado o Comprimido',
    metaDescription:
      'Analizador de entropía de archivos online gratis. Calcula entropía de Shannon, histograma y nivel de aleatoriedad para detectar si un archivo está cifrado, comprimido o es texto plano. Procesamiento local en tu navegador.',
    steps: [
      {
        id: 'entropy-step-1-es',
        title: 'Sube el archivo a analizar',
        description:
          'Arrastra un archivo binario (logs, dumps, ejecutables, ZIP, etc.) o selecciónalo desde tu dispositivo.',
        icon: 'upload',
      },
      {
        id: 'entropy-step-2-es',
        title: 'Calcula la entropía de Shannon',
        description:
          'La herramienta lee todos los bytes en tu navegador y calcula entropía, histograma y distribución.',
        icon: 'zap',
      },
      {
        id: 'entropy-step-3-es',
        title: 'Interpreta el resultado',
        description:
          'Con base en la entropía, clasifica si parece texto plano, comprimido o cifrado y muestra un informe.',
        icon: 'download',
      },
    ],
    faqs: [
      {
        id: 'entropy-faq-1-es',
        question: '¿Qué es la entropía de un archivo?',
        answer:
          'Es una medida de cuán impredecible o aleatoria es la distribución de bytes en un archivo. Valores cercanos a 8 bits por byte indican alta aleatoriedad (típico de archivos cifrados o muy comprimidos).',
      },
      {
        id: 'entropy-faq-2-es',
        question: '¿Sirve para detectar cifrado o compresión?',
        answer:
          'Sí, la entropía elevada suele indicar que el contenido ha sido comprimido o cifrado. Sin embargo, no es una prueba absoluta; es una señal estadística para orientar el análisis forense.',
      },
      {
        id: 'entropy-faq-3-es',
        question: '¿Mis archivos se suben a internet?',
        answer:
          'No. El archivo se procesa completamente en tu navegador mediante JavaScript. Los bytes nunca se envían ni se almacenan en servidores externos.',
      },
    ],
  },
  en: {
    title: 'File Entropy Analyzer Free',
    badge: 'Free Entropy Analysis',
    shortDescription:
      'Upload a file and compute Shannon entropy, byte histogram and randomness percentage directly in your browser. Free and 100% private.',
    metaTitle:
      'File Entropy Analyzer Free Online - Detect Encrypted or Compressed Files',
    metaDescription:
      'Free online file entropy analyzer. Calculate Shannon entropy, histogram and randomness level to detect whether a file is encrypted, compressed or plain text. All processing runs locally in your browser.',
    steps: [
      {
        id: 'entropy-step-1-en',
        title: 'Upload the file to analyze',
        description:
          'Drag and drop any binary file (logs, dumps, executables, ZIP, etc.) or select it from your device.',
        icon: 'upload',
      },
      {
        id: 'entropy-step-2-en',
        title: 'Compute Shannon entropy',
        description:
          'The tool reads all bytes in your browser and computes entropy, histogram and byte distribution.',
        icon: 'zap',
      },
      {
        id: 'entropy-step-3-en',
        title: 'Interpret the result',
        description:
          'Based on the entropy, it classifies whether the file looks like plain text, compressed or encrypted and shows a short report.',
        icon: 'download',
      },
    ],
    faqs: [
      {
        id: 'entropy-faq-1-en',
        question: 'What is file entropy?',
        answer:
          'It is a measure of how unpredictable or random the byte distribution of a file is. Values close to 8 bits per byte indicate high randomness, typical of encrypted or heavily compressed data.',
      },
      {
        id: 'entropy-faq-2-en',
        question: 'Can this detect encrypted or compressed files?',
        answer:
          'High entropy usually indicates that data has been compressed or encrypted. It is not a definitive proof but a statistical signal that helps guide forensic analysis.',
      },
      {
        id: 'entropy-faq-3-en',
        question: 'Are my files uploaded anywhere?',
        answer:
          'No. The file is processed entirely in your browser using JavaScript. Bytes never leave your device or get stored on external servers.',
      },
    ],
  },
  fr: {
    title: "Analyseur d'Entropie de Fichiers Gratuit",
    badge: "Analyse d'Entropie Gratuite",
    shortDescription:
      "Téléversez un fichier et calculez son entropie de Shannon, l'histogramme des octets et le pourcentage d'aléatoire directement dans votre navigateur. Gratuit et 100% privé.",
    metaTitle:
      "Analyseur d'Entropie de Fichiers Gratuit - Détecter Fichier Chiffré ou Compressé",
    metaDescription:
      "Outil gratuit en ligne pour analyser l'entropie des fichiers. Calcule entropie de Shannon, histogramme et niveau d'aléatoire pour détecter si un fichier est chiffré, compressé ou en texte brut. Traitement local dans le navigateur.",
    steps: [
      {
        id: 'entropy-step-1-fr',
        title: "Téléversez le fichier à analyser",
        description:
          'Glissez-déposez un fichier binaire (logs, dumps, exécutables, ZIP, etc.) ou sélectionnez-le depuis votre appareil.',
        icon: 'upload',
      },
      {
        id: 'entropy-step-2-fr',
        title: "Calculez l'entropie de Shannon",
        description:
          "L'outil lit tous les octets dans votre navigateur et calcule entropie, histogramme et distribution.",
        icon: 'zap',
      },
      {
        id: 'entropy-step-3-fr',
        title: 'Interprétez le résultat',
        description:
          "En fonction de l'entropie, le fichier est classé comme texte brut, compressé ou chiffré et un court rapport est affiché.",
        icon: 'download',
      },
    ],
    faqs: [
      {
        id: 'entropy-faq-1-fr',
        question: "Qu'est-ce que l'entropie d'un fichier ?",
        answer:
          "C'est une mesure du caractère imprévisible ou aléatoire de la distribution des octets d'un fichier. Des valeurs proches de 8 bits par octet indiquent une forte aléatoire, typique des données chiffrées ou très compressées.",
      },
      {
        id: 'entropy-faq-2-fr',
        question: 'Permet-elle de détecter le chiffrement ou la compression ?',
        answer:
          "Oui, une entropie élevée suggère que le contenu a été compressé ou chiffré. Ce n'est pas une preuve absolue mais un indicateur statistique utile pour les analyses forensiques.",
      },
      {
        id: 'entropy-faq-3-fr',
        question: 'Mes fichiers sont-ils envoyés sur un serveur ?',
        answer:
          "Non. Le fichier est traité entièrement dans votre navigateur via JavaScript. Vos octets ne quittent jamais votre appareil.",
      },
    ],
  },
  de: {
    title: 'Datei-Entropie-Analyzer Kostenlos',
    badge: 'Kostenlose Entropieanalyse',
    shortDescription:
      'Laden Sie eine Datei hoch und berechnen Sie Shannon-Entropie, Byte-Histogramm und Zufälligkeit direkt in Ihrem Browser. Kostenlos und 100% privat.',
    metaTitle:
      'Datei-Entropie-Analyzer Kostenlos Online - Verschlüsselte oder Komprimierte Dateien Erkennen',
    metaDescription:
      'Kostenloses Online-Tool zur Analyse der Dateientropie. Berechnet Shannon-Entropie, Histogramm und Zufälligkeitsgrad, um zu erkennen, ob eine Datei verschlüsselt, komprimiert oder Klartext ist. Verarbeitung lokal im Browser.',
    steps: [
      {
        id: 'entropy-step-1-de',
        title: 'Datei zum Analysieren hochladen',
        description:
          'Ziehen Sie eine Binärdatei (Logs, Dumps, Executables, ZIP usw.) per Drag & Drop oder wählen Sie sie von Ihrem Gerät.',
        icon: 'upload',
      },
      {
        id: 'entropy-step-2-de',
        title: 'Shannon-Entropie berechnen',
        description:
          'Das Tool liest alle Bytes in Ihrem Browser und berechnet Entropie, Histogramm und Verteilung.',
        icon: 'zap',
      },
      {
        id: 'entropy-step-3-de',
        title: 'Ergebnis interpretieren',
        description:
          'Basierend auf der Entropie wird die Datei als Klartext, komprimiert oder verschlüsselt klassifiziert und ein kurzes Ergebnis angezeigt.',
        icon: 'download',
      },
    ],
    faqs: [
      {
        id: 'entropy-faq-1-de',
        question: 'Was ist die Entropie einer Datei?',
        answer:
          'Sie misst, wie unvorhersehbar oder zufällig die Byteverteilung in einer Datei ist. Werte nahe 8 Bits pro Byte deuten auf hohe Zufälligkeit hin, typisch für verschlüsselte oder stark komprimierte Daten.',
      },
      {
        id: 'entropy-faq-2-de',
        question: 'Kann man damit Verschlüsselung oder Kompression erkennen?',
        answer:
          'Hohe Entropie deutet meist auf komprimierte oder verschlüsselte Daten hin. Sie ist kein absoluter Beweis, aber ein wichtiges statistisches Signal für die forensische Analyse.',
      },
      {
        id: 'entropy-faq-3-de',
        question: 'Werden meine Dateien irgendwohin hochgeladen?',
        answer:
          'Nein. Die Datei wird vollständig in Ihrem Browser mit JavaScript verarbeitet. Bytes verlassen Ihr Gerät nicht.',
      },
    ],
  },
  it: {
    title: 'Analizzatore di Entropia dei File Gratis',
    badge: 'Analisi Entropia Gratis',
    shortDescription:
      'Carica un file e calcola entropia di Shannon, istogramma dei byte e percentuale di casualità direttamente nel browser. Gratis e 100% privato.',
    metaTitle:
      'Analizzatore di Entropia dei File Gratis - Rilevare File Cifrato o Compresso',
    metaDescription:
      'Strumento online gratuito per analizzare l’entropia dei file. Calcola entropia di Shannon, istogramma e livello di casualità per capire se un file è cifrato, compresso o testo in chiaro. Tutto avviene nel browser.',
    steps: [
      {
        id: 'entropy-step-1-it',
        title: 'Carica il file da analizzare',
        description:
          'Trascina un file binario (log, dump, eseguibili, ZIP, ecc.) o selezionalo dal dispositivo.',
        icon: 'upload',
      },
      {
        id: 'entropy-step-2-it',
        title: 'Calcola entropia di Shannon',
        description:
          'Lo strumento legge tutti i byte nel browser e calcola entropia, istogramma e distribuzione.',
        icon: 'zap',
      },
      {
        id: 'entropy-step-3-it',
        title: 'Interpreta il risultato',
        description:
          'In base all’entropia, classifica il file come testo in chiaro, compresso o cifrato e mostra un breve report.',
        icon: 'download',
      },
    ],
    faqs: [
      {
        id: 'entropy-faq-1-it',
        question: "Cos'è l'entropia di un file?",
        answer:
          'È una misura di quanto sia imprevedibile o casuale la distribuzione dei byte in un file. Valori vicini a 8 bit per byte indicano elevata casualità, tipica di dati cifrati o molto compressi.',
      },
      {
        id: 'entropy-faq-2-it',
        question: 'Serve per rilevare cifratura o compressione?',
        answer:
          'Sì, entropia elevata suggerisce che il contenuto sia stato compresso o cifrato. Non è una prova assoluta, ma un segnale statistico per guidare l’analisi forense.',
      },
      {
        id: 'entropy-faq-3-it',
        question: 'I miei file vengono caricati su server?',
        answer:
          'No. Il file viene elaborato interamente nel browser tramite JavaScript. I byte non lasciano mai il tuo dispositivo.',
      },
    ],
  },
  pt: {
    title: 'Analisador de Entropia de Arquivos Grátis',
    badge: 'Análise de Entropia Grátis',
    shortDescription:
      'Envie um arquivo e calcule entropia de Shannon, histograma de bytes e porcentagem de aleatoriedade diretamente no navegador. Grátis e 100% privado.',
    metaTitle:
      'Analisador de Entropia de Arquivos Grátis - Detectar Arquivo Criptografado ou Compactado',
    metaDescription:
      'Ferramenta online grátis para analisar a entropia de arquivos. Calcula entropia de Shannon, histograma e nível de aleatoriedade para indicar se um arquivo é criptografado, compactado ou texto plano. Processamento local no navegador.',
    steps: [
      {
        id: 'entropy-step-1-pt',
        title: 'Envie o arquivo para análise',
        description:
          'Arraste um arquivo binário (logs, dumps, executáveis, ZIP, etc.) ou selecione-o do dispositivo.',
        icon: 'upload',
      },
      {
        id: 'entropy-step-2-pt',
        title: 'Calcule a entropia de Shannon',
        description:
          'A ferramenta lê todos os bytes no navegador e calcula entropia, histograma e distribuição.',
        icon: 'zap',
      },
      {
        id: 'entropy-step-3-pt',
        title: 'Interprete o resultado',
        description:
          'Com base na entropia, classifica se o arquivo se parece com texto plano, compactado ou criptografado e mostra um relatório curto.',
        icon: 'download',
      },
    ],
    faqs: [
      {
        id: 'entropy-faq-1-pt',
        question: 'O que é a entropia de um arquivo?',
        answer:
          'É uma medida de quão imprevisível ou aleatória é a distribuição de bytes em um arquivo. Valores próximos de 8 bits por byte indicam alta aleatoriedade, típica de dados criptografados ou muito compactados.',
      },
      {
        id: 'entropy-faq-2-pt',
        question: 'Serve para detectar criptografia ou compactação?',
        answer:
          'Sim, entropia elevada normalmente indica que o conteúdo foi compactado ou criptografado. Não é prova absoluta, mas um sinal estatístico útil para análise forense.',
      },
      {
        id: 'entropy-faq-3-pt',
        question: 'Meus arquivos são enviados para algum servidor?',
        answer:
          'Não. O arquivo é processado totalmente no navegador usando JavaScript. Os bytes nunca saem do seu dispositivo.',
      },
    ],
  },
}

async function upsertTool() {
  const slug = 'file-entropy-analyzer'
  const codeKey = 'file-entropy-analyzer'
  const icon = 'dna'
  const ctaLink = '/#contacto'

  const res = await client.query(
    `
      insert into tools (slug, code_key, icon, cta_link)
      values ($1,$2,$3,$4)
      on conflict (slug) do update
      set code_key = excluded.code_key,
          icon = excluded.icon,
          cta_link = excluded.cta_link
      returning id
    `,
    [slug, codeKey, icon, ctaLink],
  )

  const toolId = res.rows[0].id
  console.log('🔧 Tool ID for file-entropy-analyzer =>', toolId)
  return toolId
}

async function upsertLocales(toolId) {
  for (const locale of LOCALES) {
    const data = localeData[locale]
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
    for (const [index, step] of data.steps.entries()) {
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
    }
    console.log(`✅ tools_steps UPSERT for locale ${locale}`)
  }
}

async function upsertFaqs(toolId) {
  for (const locale of LOCALES) {
    const data = localeData[locale]
    for (const [index, faq] of data.faqs.entries()) {
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
    }
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
    console.log('\n🎉 Seed completado para File Entropy Analyzer en todos los idiomas.')
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    await client.end()
  }
}

run()

