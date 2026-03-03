// Seed para la herramienta "Advanced Hash Generator" en todos los idiomas.
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
    title: 'Generador de Hashes Avanzados Gratis',
    badge: 'Hashing Avanzado Gratis',
    shortDescription:
      'Genera hashes SHA-256, SHA-512 y derivados PBKDF2 con salt configurable e iteraciones directamente en tu navegador. Gratis y 100% privado.',
    metaTitle:
      'Generador de Hashes Avanzados Gratis - SHA-256, SHA-512 y PBKDF2 Online',
    metaDescription:
      'Generador de hashes avanzado online gratis. Calcula SHA-256/SHA-512 y derivados PBKDF2 con salt, longitud e iteraciones configurables. Ideal para comparar con Argon2, bcrypt o scrypt. Procesamiento local en tu navegador.',
    steps: [
      {
        id: 'hash-step-1-es',
        title: 'Introduce el texto o contraseña',
        description:
          'Escribe el texto plano o contraseña que quieres convertir a hash para pruebas o análisis.',
        icon: 'edit',
      },
      {
        id: 'hash-step-2-es',
        title: 'Elige algoritmo y parámetros',
        description:
          'Selecciona SHA-256, SHA-512 o PBKDF2 y ajusta salt, longitud e iteraciones en tiempo real.',
        icon: 'settings',
      },
      {
        id: 'hash-step-3-es',
        title: 'Copia el hash resultante',
        description:
          'Copia el hash hexadecimal generado y úsalo en tus sistemas, comparaciones o auditorías de seguridad.',
        icon: 'download',
      },
    ],
    faqs: [
      {
        id: 'hash-faq-1-es',
        question: '¿Este generador sirve para auditorías de seguridad?',
        answer:
          'Sí, es útil para comparar hashes, probar políticas de contraseñas y entender el impacto de parámetros como el salt o las iteraciones en PBKDF2. No almacena nada en servidores.',
      },
      {
        id: 'hash-faq-2-es',
        question: '¿En qué se diferencia PBKDF2 de Argon2 o bcrypt?',
        answer:
          'PBKDF2 es un estándar ampliamente soportado, basado en iteraciones. Argon2 y bcrypt añaden controles de memoria y están diseñados para resistir hardware especializado. Este generador te permite experimentar con PBKDF2 y comparar conceptos.',
      },
      {
        id: 'hash-faq-3-es',
        question: '¿Mis textos o contraseñas se envían a algún servidor?',
        answer:
          'No. Todo el cálculo de hashes ocurre 100% en tu navegador usando Web Crypto API. Tus datos nunca salen de tu dispositivo.',
      },
    ],
  },
  en: {
    title: 'Advanced Hash Generator Free',
    badge: 'Advanced Hashing Free',
    shortDescription:
      'Generate SHA-256, SHA-512 and PBKDF2-derived hashes with configurable salt and iterations directly in your browser. Free and 100% private.',
    metaTitle:
      'Advanced Hash Generator Free - SHA-256, SHA-512 & PBKDF2 Online',
    metaDescription:
      'Free online advanced hash generator. Compute SHA-256/SHA-512 and PBKDF2-derived hashes with custom salt, length and iterations. Ideal to compare concepts with Argon2, bcrypt or scrypt. All processing is local in your browser.',
    steps: [
      {
        id: 'hash-step-1-en',
        title: 'Enter text or password',
        description:
          'Type the plaintext or password you want to convert into a hash for testing or analysis.',
        icon: 'edit',
      },
      {
        id: 'hash-step-2-en',
        title: 'Choose algorithm and parameters',
        description:
          'Select SHA-256, SHA-512 or PBKDF2 and tune salt, length and iterations interactively.',
        icon: 'settings',
      },
      {
        id: 'hash-step-3-en',
        title: 'Copy the resulting hash',
        description:
          'Copy the generated hexadecimal hash and use it in your systems, comparisons or security audits.',
        icon: 'download',
      },
    ],
    faqs: [
      {
        id: 'hash-faq-1-en',
        question: 'Is this generator suitable for security audits?',
        answer:
          'Yes. It helps compare hashes, test password policies, and understand how salt and iteration counts affect PBKDF2. Nothing is stored on any server.',
      },
      {
        id: 'hash-faq-2-en',
        question: 'How does PBKDF2 differ from Argon2 or bcrypt?',
        answer:
          'PBKDF2 is a widely supported standard based on iterations. Argon2 and bcrypt add memory-hard controls and are designed to resist specialized hardware. This generator lets you experiment with PBKDF2 and compare the concepts.',
      },
      {
        id: 'hash-faq-3-en',
        question: 'Are my texts or passwords sent anywhere?',
        answer:
          'No. All hash computation happens 100% in your browser using the Web Crypto API. Your data never leaves your device.',
      },
    ],
  },
  fr: {
    title: 'Générateur de Hash Avancé Gratuit',
    badge: 'Hashing Avancé Gratuit',
    shortDescription:
      'Générez des hashes SHA-256, SHA-512 et PBKDF2 avec salt et itérations configurables directement dans votre navigateur. Gratuit et 100% privé.',
    metaTitle:
      'Générateur de Hash Avancé Gratuit - SHA-256, SHA-512 & PBKDF2 En Ligne',
    metaDescription:
      "Outil gratuit en ligne pour générer des hashes avancés. Calculez SHA-256/SHA-512 et PBKDF2 avec salt, longueur et itérations personnalisables. Idéal pour comparer les concepts avec Argon2, bcrypt ou scrypt. Traitement local dans le navigateur.",
    steps: [
      {
        id: 'hash-step-1-fr',
        title: 'Entrez le texte ou mot de passe',
        description:
          'Saisissez le texte brut ou mot de passe à transformer en hash pour tests ou analyses.',
        icon: 'edit',
      },
      {
        id: 'hash-step-2-fr',
        title: "Choisissez l'algorithme et les paramètres",
        description:
          "Sélectionnez SHA-256, SHA-512 ou PBKDF2 et ajustez salt, longueur et nombre d'itérations.",
        icon: 'settings',
      },
      {
        id: 'hash-step-3-fr',
        title: 'Copiez le hash généré',
        description:
          'Copiez le hash hexadécimal généré et utilisez-le dans vos systèmes, comparaisons ou audits de sécurité.',
        icon: 'download',
      },
    ],
    faqs: [
      {
        id: 'hash-faq-1-fr',
        question: 'Cet outil est-il adapté aux audits de sécurité ?',
        answer:
          "Oui, il permet de comparer des hashes, tester des politiques de mots de passe et comprendre l'effet du salt et des itérations sur PBKDF2. Aucune donnée n'est stockée sur nos serveurs.",
      },
      {
        id: 'hash-faq-2-fr',
        question: 'En quoi PBKDF2 diffère-t-il de Argon2 ou bcrypt ?',
        answer:
          "PBKDF2 est un standard largement supporté basé sur le nombre d'itérations. Argon2 et bcrypt ajoutent des contraintes mémoire et sont conçus pour résister au matériel spécialisé. Ce générateur vous permet d'expérimenter PBKDF2 et de comparer les concepts.",
      },
      {
        id: 'hash-faq-3-fr',
        question: 'Mes textes ou mots de passe sont-ils envoyés sur un serveur ?',
        answer:
          "Non. Tous les calculs de hash se font 100% dans votre navigateur via Web Crypto. Vos données ne quittent jamais votre appareil.",
      },
    ],
  },
  de: {
    title: 'Erweiterter Hash-Generator Kostenlos',
    badge: 'Erweitertes Hashing Kostenlos',
    shortDescription:
      'Erzeugen Sie SHA-256-, SHA-512- und PBKDF2-Hashes mit konfigurierbarem Salt und Iterationen direkt im Browser. Kostenlos und 100% privat.',
    metaTitle:
      'Erweiterter Hash-Generator Kostenlos - SHA-256, SHA-512 & PBKDF2 Online',
    metaDescription:
      'Kostenloses Online-Tool für erweitertes Hashing. Berechnen Sie SHA-256/SHA-512 und PBKDF2-Hashes mit anpassbarem Salt, Länge und Iterationen. Ideal zum Vergleich von Konzepten mit Argon2, bcrypt oder scrypt. Verarbeitung lokal im Browser.',
    steps: [
      {
        id: 'hash-step-1-de',
        title: 'Text oder Passwort eingeben',
        description:
          'Geben Sie Klartext oder Passwort ein, das in einen Hash umgewandelt werden soll, z.B. für Tests oder Analysen.',
        icon: 'edit',
      },
      {
        id: 'hash-step-2-de',
        title: 'Algorithmus und Parameter wählen',
        description:
          'Wählen Sie SHA-256, SHA-512 oder PBKDF2 und passen Sie Salt, Länge und Iterationen nach Bedarf an.',
        icon: 'settings',
      },
      {
        id: 'hash-step-3-de',
        title: 'Erzeugten Hash kopieren',
        description:
          'Kopieren Sie den erzeugten hexadezimalen Hash und verwenden Sie ihn in Ihren Systemen, Vergleichen oder Sicherheits-Audits.',
        icon: 'download',
      },
    ],
    faqs: [
      {
        id: 'hash-faq-1-de',
        question: 'Ist dieses Tool für Sicherheits-Audits geeignet?',
        answer:
          'Ja, es hilft beim Vergleichen von Hashes, Testen von Passwort-Richtlinien und Verstehen des Einflusses von Salt und Iterationen auf PBKDF2. Es werden keine Daten gespeichert.',
      },
      {
        id: 'hash-faq-2-de',
        question: 'Worin unterscheidet sich PBKDF2 von Argon2 oder bcrypt?',
        answer:
          'PBKDF2 ist ein weit verbreiteter Standard auf Basis von Iterationen. Argon2 und bcrypt sind speicherintensiver und auf Widerstand gegen spezialisierte Hardware ausgelegt. Dieses Tool ermöglicht Experimente mit PBKDF2 und konzeptionelle Vergleiche.',
      },
      {
        id: 'hash-faq-3-de',
        question: 'Werden meine Texte oder Passwörter an einen Server gesendet?',
        answer:
          'Nein. Die Hash-Berechnung erfolgt vollständig im Browser über die Web Crypto API. Ihre Daten verlassen Ihr Gerät nicht.',
      },
    ],
  },
  it: {
    title: 'Generatore di Hash Avanzato Gratis',
    badge: 'Hashing Avanzato Gratis',
    shortDescription:
      'Genera hash SHA-256, SHA-512 e PBKDF2 con salt e iterazioni configurabili direttamente nel browser. Gratis e 100% privato.',
    metaTitle:
      'Generatore di Hash Avanzato Gratis - SHA-256, SHA-512 & PBKDF2 Online',
    metaDescription:
      'Strumento online gratuito per generare hash avanzati. Calcola SHA-256/SHA-512 e PBKDF2 con salt, lunghezza e iterazioni configurabili. Ideale per confrontare i concetti con Argon2, bcrypt o scrypt. Elaborazione locale nel browser.',
    steps: [
      {
        id: 'hash-step-1-it',
        title: 'Inserisci testo o password',
        description:
          'Digita il testo in chiaro o la password che vuoi trasformare in hash per test o analisi.',
        icon: 'edit',
      },
      {
        id: 'hash-step-2-it',
        title: 'Scegli algoritmo e parametri',
        description:
          'Seleziona SHA-256, SHA-512 o PBKDF2 e regola salt, lunghezza e iterazioni in modo interattivo.',
        icon: 'settings',
      },
      {
        id: 'hash-step-3-it',
        title: 'Copia l’hash risultante',
        description:
          'Copia l’hash esadecimale generato e usalo nei tuoi sistemi, confronti o audit di sicurezza.',
        icon: 'download',
      },
    ],
    faqs: [
      {
        id: 'hash-faq-1-it',
        question: 'Questo generatore è adatto per audit di sicurezza?',
        answer:
          'Sì, è utile per confrontare hash, testare policy di password e capire l’effetto di salt e iterazioni su PBKDF2. Nessun dato viene memorizzato sui nostri server.',
      },
      {
        id: 'hash-faq-2-it',
        question: 'In cosa PBKDF2 differisce da Argon2 o bcrypt?',
        answer:
          'PBKDF2 è uno standard ampiamente supportato basato sulle iterazioni. Argon2 e bcrypt sono più memory-hard e progettati per resistere ad hardware specializzato. Questo generatore permette di sperimentare PBKDF2 e confrontare i concetti.',
      },
      {
        id: 'hash-faq-3-it',
        question: 'I miei testi o password vengono inviati a un server?',
        answer:
          'No. Tutto il calcolo degli hash avviene al 100% nel browser tramite Web Crypto. I tuoi dati non lasciano il dispositivo.',
      },
    ],
  },
  pt: {
    title: 'Gerador de Hashes Avançados Grátis',
    badge: 'Hashing Avançado Grátis',
    shortDescription:
      'Gere hashes SHA-256, SHA-512 e PBKDF2 com salt e iterações configuráveis diretamente no navegador. Grátis e 100% privado.',
    metaTitle:
      'Gerador de Hashes Avançados Grátis - SHA-256, SHA-512 & PBKDF2 Online',
    metaDescription:
      'Ferramenta online grátis para gerar hashes avançados. Calcula SHA-256/SHA-512 e PBKDF2 com salt, comprimento e iterações configuráveis. Ideal para comparar conceitos com Argon2, bcrypt ou scrypt. Processamento local no navegador.',
    steps: [
      {
        id: 'hash-step-1-pt',
        title: 'Digite texto ou senha',
        description:
          'Informe o texto em claro ou senha que deseja converter em hash para testes ou análises.',
        icon: 'edit',
      },
      {
        id: 'hash-step-2-pt',
        title: 'Escolha algoritmo e parâmetros',
        description:
          'Selecione SHA-256, SHA-512 ou PBKDF2 e ajuste salt, comprimento e iterações em tempo real.',
        icon: 'settings',
      },
      {
        id: 'hash-step-3-pt',
        title: 'Copie o hash gerado',
        description:
          'Copie o hash hexadecimal gerado e use em seus sistemas, comparações ou auditorias de segurança.',
        icon: 'download',
      },
    ],
    faqs: [
      {
        id: 'hash-faq-1-pt',
        question: 'Este gerador é adequado para auditorias de segurança?',
        answer:
          'Sim, ele ajuda a comparar hashes, testar políticas de senha e entender o impacto de salt e iterações em PBKDF2. Nenhum dado é armazenado em servidores.',
      },
      {
        id: 'hash-faq-2-pt',
        question: 'Qual a diferença de PBKDF2 para Argon2 ou bcrypt?',
        answer:
          'PBKDF2 é um padrão amplamente suportado baseado em iterações. Argon2 e bcrypt adicionam requisitos de memória e são projetados para resistir a hardware especializado. Este gerador permite experimentar PBKDF2 e comparar os conceitos.',
      },
      {
        id: 'hash-faq-3-pt',
        question: 'Meus textos ou senhas são enviados a algum servidor?',
        answer:
          'Não. Todo o cálculo de hashes acontece 100% no navegador usando a Web Crypto API. Seus dados nunca saem do dispositivo.',
      },
    ],
  },
}

async function upsertTool() {
  const slug = 'advanced-hash-generator'
  const codeKey = 'advanced-hash-generator'
  const icon = 'code'
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
  console.log('🔧 Tool ID for advanced-hash-generator =>', toolId)
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
    console.log('\n🎉 Seed completado para Advanced Hash Generator en todos los idiomas.')
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    await client.end()
  }
}

run()

