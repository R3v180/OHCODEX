// Seed para la herramienta "SSH Key Generator" en todos los idiomas.
// Solo INSERT/UPDATE, nunca operaciones destructivas.

require('dotenv').config()
const { Client } = require('pg')

const client = new Client({
  connectionString: process.env.DATABASE_URI,
  ssl: { rejectUnauthorized: false },
})

const LOCALES = ['es', 'en', 'fr', 'de', 'it', 'pt']

const localeData = {
  es: {
    title: 'Generador de Claves SSH Gratis',
    badge: 'Herramienta SSH Gratis',
    shortDescription:
      'Genera claves SSH RSA 4096, Ed25519 y ECDSA con passphrase y fingerprint SHA256 directamente en tu navegador. Gratis y 100% privado.',
    metaTitle: 'Generador de Claves SSH Gratis - RSA 4096, Ed25519, ECDSA 100% Privado',
    metaDescription:
      'Generador de claves SSH online gratis para RSA 4096, Ed25519 y ECDSA. Crea llaves SSH seguras con passphrase y fingerprint SHA256 sin que nada salga de tu navegador.',
    steps: [
      {
        id: 'ssh-step-1-es',
        title: 'Elige el tipo de clave',
        description:
          'Selecciona entre RSA 4096, Ed25519 o ECDSA según las políticas de tu servidor o proveedor.',
        icon: 'settings',
      },
      {
        id: 'ssh-step-2-es',
        title: 'Configura bits y passphrase',
        description:
          'Ajusta el tamaño (para RSA) y define una passphrase fuerte para proteger tu clave privada.',
        icon: 'lock',
      },
      {
        id: 'ssh-step-3-es',
        title: 'Copia clave y fingerprint',
        description:
          'Copia la clave pública en formato OpenSSH y la clave privada PEM. Usa el fingerprint SHA256 para verificar.',
        icon: 'download',
      },
    ],
    faqs: [
      {
        id: 'ssh-faq-1-es',
        question: '¿Las claves SSH se generan en el servidor o en mi navegador?',
        answer:
          'Toda la generación ocurre 100% en tu navegador usando APIs criptográficas. Las claves nunca se envían a nuestros servidores.',
      },
      {
        id: 'ssh-faq-2-es',
        question: '¿Qué tipo de clave SSH debo elegir: RSA, Ed25519 o ECDSA?',
        answer:
          'Ed25519 es una opción moderna y compacta con alta seguridad. RSA 4096 sigue siendo el estándar más compatible. ECDSA es útil cuando tu infraestructura ya estandariza curvas específicas.',
      },
      {
        id: 'ssh-faq-3-es',
        question: '¿Qué es el fingerprint SHA256 y para qué sirve?',
        answer:
          'El fingerprint SHA256 es una huella corta de tu clave pública. Se utiliza para comparar y verificar que la clave cargada en un servidor es exactamente la misma que generaste.',
      },
    ],
  },
  en: {
    title: 'SSH Key Generator Free',
    badge: 'Free SSH Tool',
    shortDescription:
      'Generate SSH keys (RSA 4096, Ed25519, ECDSA) with passphrase and SHA256 fingerprint directly in your browser. Free and 100% private.',
    metaTitle: 'SSH Key Generator Free - RSA 4096, Ed25519, ECDSA 100% Private',
    metaDescription:
      'Free online SSH key generator for RSA 4096, Ed25519 and ECDSA. Create secure SSH keys with passphrase and SHA256 fingerprint without any data leaving your browser.',
    steps: [
      {
        id: 'ssh-step-1-en',
        title: 'Choose key type',
        description:
          'Select between RSA 4096, Ed25519 or ECDSA according to your server or provider requirements.',
        icon: 'settings',
      },
      {
        id: 'ssh-step-2-en',
        title: 'Configure bits and passphrase',
        description:
          'Adjust the key size (for RSA) and define a strong passphrase to protect your private key.',
        icon: 'lock',
      },
      {
        id: 'ssh-step-3-en',
        title: 'Copy key and fingerprint',
        description:
          'Copy the public key in OpenSSH format and the private key in PEM format. Use the SHA256 fingerprint for verification.',
        icon: 'download',
      },
    ],
    faqs: [
      {
        id: 'ssh-faq-1-en',
        question: 'Are SSH keys generated on the server or in my browser?',
        answer:
          'All key generation happens 100% in your browser using cryptographic APIs. Keys are never sent to our servers.',
      },
      {
        id: 'ssh-faq-2-en',
        question: 'Which SSH key type should I choose: RSA, Ed25519 or ECDSA?',
        answer:
          'Ed25519 is a modern, compact option with strong security. RSA 4096 remains the most compatible standard. ECDSA is useful when your infrastructure is standardized on specific curves.',
      },
      {
        id: 'ssh-faq-3-en',
        question: 'What is the SHA256 fingerprint used for?',
        answer:
          'The SHA256 fingerprint is a short hash of your public key. It is used to compare and verify that the key installed on a server matches the one you generated.',
      },
    ],
  },
  fr: {
    title: 'Générateur de Clés SSH Gratuit',
    badge: 'Outil SSH Gratuit',
    shortDescription:
      'Générez des clés SSH RSA 4096, Ed25519 et ECDSA avec passphrase et empreinte SHA256 directement dans votre navigateur. Gratuit et 100% privé.',
    metaTitle: 'Générateur de Clés SSH Gratuit - RSA 4096, Ed25519, ECDSA 100% Privé',
    metaDescription:
      'Générateur de clés SSH en ligne gratuit pour RSA 4096, Ed25519 et ECDSA. Créez des clés SSH sécurisées avec passphrase et empreinte SHA256 sans que vos données quittent le navigateur.',
    steps: [
      {
        id: 'ssh-step-1-fr',
        title: 'Choisissez le type de clé',
        description:
          'Sélectionnez RSA 4096, Ed25519 ou ECDSA selon les exigences de votre serveur ou fournisseur.',
        icon: 'settings',
      },
      {
        id: 'ssh-step-2-fr',
        title: 'Configurez bits et passphrase',
        description:
          'Ajustez la taille (pour RSA) et définissez une passphrase forte pour protéger votre clé privée.',
        icon: 'lock',
      },
      {
        id: 'ssh-step-3-fr',
        title: 'Copiez clé et empreinte',
        description:
          'Copiez la clé publique au format OpenSSH et la clé privée en PEM. Utilisez l’empreinte SHA256 pour vérifier l’authenticité.',
        icon: 'download',
      },
    ],
    faqs: [
      {
        id: 'ssh-faq-1-fr',
        question: 'Les clés SSH sont-elles générées sur le serveur ou dans mon navigateur ?',
        answer:
          'Toute la génération se fait 100% dans votre navigateur via des APIs cryptographiques. Les clés ne sont jamais envoyées à nos serveurs.',
      },
      {
        id: 'ssh-faq-2-fr',
        question: 'Quel type de clé SSH choisir : RSA, Ed25519 ou ECDSA ?',
        answer:
          'Ed25519 est une option moderne et compacte avec une forte sécurité. RSA 4096 reste le standard le plus compatible. ECDSA est utile si votre infrastructure impose des courbes spécifiques.',
      },
      {
        id: 'ssh-faq-3-fr',
        question: 'À quoi sert l’empreinte SHA256 ?',
        answer:
          'L’empreinte SHA256 est un résumé court de votre clé publique, utilisée pour vérifier que la clé installée sur un serveur est bien celle que vous avez générée.',
      },
    ],
  },
  de: {
    title: 'SSH-Schlüssel Generator Kostenlos',
    badge: 'Kostenloses SSH-Tool',
    shortDescription:
      'Erzeugen Sie SSH-Schlüssel (RSA 4096, Ed25519, ECDSA) mit Passphrase und SHA256-Fingerprint direkt in Ihrem Browser. Kostenlos und 100% privat.',
    metaTitle: 'SSH-Schlüssel Generator Kostenlos - RSA 4096, Ed25519, ECDSA 100% Privat',
    metaDescription:
      'Kostenloser SSH-Schlüssel-Generator online für RSA 4096, Ed25519 und ECDSA. Erstellen Sie sichere SSH-Schlüssel mit Passphrase und SHA256-Fingerprint, ohne dass Daten Ihren Browser verlassen.',
    steps: [
      {
        id: 'ssh-step-1-de',
        title: 'Schlüsseltyp wählen',
        description:
          'Wählen Sie zwischen RSA 4096, Ed25519 oder ECDSA entsprechend den Anforderungen Ihres Servers.',
        icon: 'settings',
      },
      {
        id: 'ssh-step-2-de',
        title: 'Bits und Passphrase konfigurieren',
        description:
          'Passen Sie die Schlüssellänge (für RSA) an und definieren Sie eine starke Passphrase zum Schutz des privaten Schlüssels.',
        icon: 'lock',
      },
      {
        id: 'ssh-step-3-de',
        title: 'Schlüssel und Fingerprint kopieren',
        description:
          'Kopieren Sie den öffentlichen Schlüssel im OpenSSH-Format und den privaten Schlüssel als PEM. Nutzen Sie den SHA256-Fingerprint zur Verifikation.',
        icon: 'download',
      },
    ],
    faqs: [
      {
        id: 'ssh-faq-1-de',
        question: 'Werden SSH-Schlüssel auf dem Server oder im Browser generiert?',
        answer:
          'Die Schlüsselgenerierung erfolgt vollständig im Browser über Kryptografie-APIs. Schlüssel werden niemals an unsere Server gesendet.',
      },
      {
        id: 'ssh-faq-2-de',
        question: 'Welchen SSH-Schlüsseltyp sollte ich wählen: RSA, Ed25519 oder ECDSA?',
        answer:
          'Ed25519 ist eine moderne und kompakte Option mit hoher Sicherheit. RSA 4096 bleibt der kompatibelste Standard. ECDSA ist sinnvoll, wenn Ihre Infrastruktur bestimmte Kurven vorschreibt.',
      },
      {
        id: 'ssh-faq-3-de',
        question: 'Wozu dient der SHA256-Fingerprint?',
        answer:
          'Der SHA256-Fingerprint ist ein kurzer Hash Ihres öffentlichen Schlüssels, mit dem Sie prüfen können, ob der auf einem Server installierte Schlüssel exakt übereinstimmt.',
      },
    ],
  },
  it: {
    title: 'Generatore di Chiavi SSH Gratis',
    badge: 'Strumento SSH Gratis',
    shortDescription:
      'Genera chiavi SSH RSA 4096, Ed25519 ed ECDSA con passphrase e fingerprint SHA256 direttamente nel browser. Gratis e 100% privato.',
    metaTitle: 'Generatore di Chiavi SSH Gratis - RSA 4096, Ed25519, ECDSA 100% Privato',
    metaDescription:
      'Generatore di chiavi SSH online gratis per RSA 4096, Ed25519 ed ECDSA. Crea chiavi SSH sicure con passphrase e fingerprint SHA256 senza uscire dal browser.',
    steps: [
      {
        id: 'ssh-step-1-it',
        title: 'Scegli il tipo di chiave',
        description:
          'Seleziona tra RSA 4096, Ed25519 o ECDSA in base alle policy del tuo server o provider.',
        icon: 'settings',
      },
      {
        id: 'ssh-step-2-it',
        title: 'Configura bit e passphrase',
        description:
          'Imposta la lunghezza (per RSA) e definisci una passphrase robusta per proteggere la chiave privata.',
        icon: 'lock',
      },
      {
        id: 'ssh-step-3-it',
        title: 'Copia chiave e fingerprint',
        description:
          'Copia la chiave pubblica in formato OpenSSH e la chiave privata PEM. Usa il fingerprint SHA256 per verificare.',
        icon: 'download',
      },
    ],
    faqs: [
      {
        id: 'ssh-faq-1-it',
        question: 'Le chiavi SSH vengono generate sul server o nel browser?',
        answer:
          'Tutta la generazione avviene al 100% nel tuo browser tramite API crittografiche. Le chiavi non vengono inviate ai nostri server.',
      },
      {
        id: 'ssh-faq-2-it',
        question: 'Quale tipo di chiave SSH scegliere: RSA, Ed25519 o ECDSA?',
        answer:
          'Ed25519 è una scelta moderna e compatta con elevata sicurezza. RSA 4096 resta lo standard più compatibile. ECDSA è utile se la tua infrastruttura usa curve specifiche.',
      },
      {
        id: 'ssh-faq-3-it',
        question: 'A cosa serve il fingerprint SHA256?',
        answer:
          'Il fingerprint SHA256 è una breve impronta della tua chiave pubblica. Serve a verificare che la chiave installata su un server coincida con quella che hai generato.',
      },
    ],
  },
  pt: {
    title: 'Gerador de Chaves SSH Grátis',
    badge: 'Ferramenta SSH Grátis',
    shortDescription:
      'Gere chaves SSH RSA 4096, Ed25519 e ECDSA com passphrase e fingerprint SHA256 diretamente no navegador. Grátis e 100% privado.',
    metaTitle: 'Gerador de Chaves SSH Grátis - RSA 4096, Ed25519, ECDSA 100% Privado',
    metaDescription:
      'Gerador de chaves SSH online grátis para RSA 4096, Ed25519 e ECDSA. Crie chaves SSH seguras com passphrase e fingerprint SHA256 sem que nada saia do navegador.',
    steps: [
      {
        id: 'ssh-step-1-pt',
        title: 'Escolha o tipo de chave',
        description:
          'Selecione entre RSA 4096, Ed25519 ou ECDSA de acordo com as políticas do servidor ou provedor.',
        icon: 'settings',
      },
      {
        id: 'ssh-step-2-pt',
        title: 'Configure bits e passphrase',
        description:
          'Ajuste o tamanho (para RSA) e defina uma passphrase forte para proteger sua chave privada.',
        icon: 'lock',
      },
      {
        id: 'ssh-step-3-pt',
        title: 'Copie chave e fingerprint',
        description:
          'Copie a chave pública em formato OpenSSH e a chave privada PEM. Use o fingerprint SHA256 para verificação.',
        icon: 'download',
      },
    ],
    faqs: [
      {
        id: 'ssh-faq-1-pt',
        question: 'As chaves SSH são geradas no servidor ou no navegador?',
        answer:
          'Toda a geração ocorre 100% no seu navegador usando APIs criptográficas. As chaves nunca são enviadas para nossos servidores.',
      },
      {
        id: 'ssh-faq-2-pt',
        question: 'Qual tipo de chave SSH devo escolher: RSA, Ed25519 ou ECDSA?',
        answer:
          'Ed25519 é uma opção moderna e compacta com alta segurança. RSA 4096 continua sendo o padrão mais compatível. ECDSA é útil quando sua infraestrutura utiliza curvas específicas.',
      },
      {
        id: 'ssh-faq-3-pt',
        question: 'Para que serve o fingerprint SHA256?',
        answer:
          'O fingerprint SHA256 é uma impressão curta da sua chave pública, usada para verificar se a chave instalada em um servidor é exatamente a mesma que você gerou.',
      },
    ],
  },
}

async function upsertTool() {
  const slug = 'ssh-key-generator'
  const codeKey = 'ssh-key-generator'
  const icon = 'key-round'
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
  console.log('🔧 Tool ID for ssh-key-generator =>', toolId)
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
    console.log('\n🎉 Seed completado para SSH Key Generator en todos los idiomas.')
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    await client.end()
  }
}

run()

