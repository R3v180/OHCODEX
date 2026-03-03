// Seed para la herramienta "Self-Signed SSL Certificate Generator" en todos los idiomas.
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
    title: 'Generador de Certificados SSL Autofirmados Gratis',
    badge: 'SSL Gratis en tu Navegador',
    shortDescription:
      'Genera certificados SSL autofirmados y CSR completos con clave privada directamente en tu navegador. Gratis, sin servidor y 100% privado.',
    metaTitle: 'Generador de Certificados SSL Autofirmados Gratis - CSR y Clave Privada 100% Privado',
    metaDescription:
      'Generador de certificados SSL autofirmados online gratis. Crea CSR, certificado y clave privada en tu navegador, sin subir datos a servidores. Ideal para entornos de desarrollo y lab.',
    steps: [
      {
        id: 'ssl-step-1-es',
        title: 'Completa los datos del certificado',
        description:
          'Introduce CN, Organización, País y resto de campos del Subject (DN) de tu certificado SSL.',
        icon: 'edit',
      },
      {
        id: 'ssl-step-2-es',
        title: 'Define algoritmo y validez',
        description:
          'Elige entre RSA o ECDSA y configura la validez del certificado entre 1 y 10 años.',
        icon: 'settings',
      },
      {
        id: 'ssl-step-3-es',
        title: 'Descarga CSR, Certificado y Clave',
        description:
          'Obtén el CSR, certificado autofirmado y la clave privada en formato PEM para instalar en tus servidores.',
        icon: 'download',
      },
    ],
    faqs: [
      {
        id: 'ssl-faq-1-es',
        question: '¿Para qué sirve un certificado SSL autofirmado?',
        answer:
          'Es ideal para entornos de desarrollo, pruebas internas, lab de DevOps o túneles seguros donde no necesitas un CA público. Permite cifrar el tráfico aunque el navegador muestre un aviso de confianza.',
      },
      {
        id: 'ssl-faq-2-es',
        question: '¿Mis claves privadas se suben a algún servidor?',
        answer:
          'No. Toda la generación de claves, CSR y certificados ocurre 100% en tu navegador. Nada se envía a la nube ni se almacena en servidores externos.',
      },
      {
        id: 'ssl-faq-3-es',
        question: '¿Puedo usar este certificado SSL para producción?',
        answer:
          'No es recomendable. Los certificados autofirmados no son confiados por los navegadores. Para producción utiliza una autoridad de certificación pública (Let’s Encrypt, etc.).',
      },
    ],
  },
  en: {
    title: 'Self-Signed SSL Certificate Generator Free',
    badge: 'Free SSL in Your Browser',
    shortDescription:
      'Generate self-signed SSL certificates and full CSRs with private key directly in your browser. Free, serverless and 100% private.',
    metaTitle: 'Self-Signed SSL Certificate Generator Free - CSR & Private Key 100% Private',
    metaDescription:
      'Free online self-signed SSL certificate generator. Create CSR, certificate and private key in your browser with no data leaving your device. Perfect for dev, lab and internal environments.',
    steps: [
      {
        id: 'ssl-step-1-en',
        title: 'Fill in certificate details',
        description:
          'Enter CN, Organization, Country and the rest of the Subject (DN) fields for your SSL certificate.',
        icon: 'edit',
      },
      {
        id: 'ssl-step-2-en',
        title: 'Choose algorithm and validity',
        description:
          'Select RSA or ECDSA and configure certificate validity between 1 and 10 years.',
        icon: 'settings',
      },
      {
        id: 'ssl-step-3-en',
        title: 'Download CSR, Certificate and Key',
        description:
          'Get the CSR, self-signed certificate and private key in PEM format ready to install on your servers.',
        icon: 'download',
      },
    ],
    faqs: [
      {
        id: 'ssl-faq-1-en',
        question: 'What is a self-signed SSL certificate used for?',
        answer:
          'It is ideal for development, internal testing, DevOps labs or secure tunnels where you do not require a public CA. It encrypts traffic even if browsers show a trust warning.',
      },
      {
        id: 'ssl-faq-2-en',
        question: 'Are my private keys uploaded to any server?',
        answer:
          'No. All key, CSR and certificate generation runs 100% in your browser. Nothing is sent to the cloud or stored on external servers.',
      },
      {
        id: 'ssl-faq-3-en',
        question: 'Can I use this SSL certificate in production?',
        answer:
          'It is not recommended. Self-signed certificates are not trusted by browsers. For production, use a public CA such as Let’s Encrypt.',
      },
    ],
  },
  fr: {
    title: 'Générateur de Certificats SSL Auto-signés Gratuit',
    badge: 'SSL Gratuit dans le Navigateur',
    shortDescription:
      'Générez des certificats SSL auto-signés et des CSR complets avec clé privée directement dans votre navigateur. Gratuit, sans serveur et 100% privé.',
    metaTitle:
      'Générateur de Certificats SSL Auto-signés Gratuit - CSR et Clé Privée 100% Privé',
    metaDescription:
      'Outil gratuit en ligne pour générer des certificats SSL auto-signés. Créez CSR, certificat et clé privée dans votre navigateur sans envoyer de données vers un serveur. Idéal pour dev et environnements internes.',
    steps: [
      {
        id: 'ssl-step-1-fr',
        title: 'Renseignez les informations du certificat',
        description:
          'Saisissez CN, Organisation, Pays et les autres champs du Subject (DN) de votre certificat SSL.',
        icon: 'edit',
      },
      {
        id: 'ssl-step-2-fr',
        title: "Choisissez l'algorithme et la durée",
        description:
          'Sélectionnez RSA ou ECDSA et configurez la durée de validité du certificat entre 1 et 10 ans.',
        icon: 'settings',
      },
      {
        id: 'ssl-step-3-fr',
        title: 'Téléchargez CSR, Certificat et Clé',
        description:
          'Récupérez le CSR, le certificat auto-signé et la clé privée en format PEM, prêts à être installés.',
        icon: 'download',
      },
    ],
    faqs: [
      {
        id: 'ssl-faq-1-fr',
        question: 'À quoi sert un certificat SSL auto-signé ?',
        answer:
          'Idéal pour les environnements de développement, tests internes, lab DevOps ou tunnels sécurisés où un CA public n’est pas requis. Le trafic est chiffré même si le navigateur affiche un avertissement.',
      },
      {
        id: 'ssl-faq-2-fr',
        question: "Mes clés privées sont-elles envoyées sur un serveur ?",
        answer:
          'Non. Toute la génération de clés, CSR et certificats se fait 100% dans votre navigateur. Aucune donnée n’est envoyée vers nos serveurs.',
      },
      {
        id: 'ssl-faq-3-fr',
        question: 'Puis-je utiliser ce certificat SSL en production ?',
        answer:
          'Ce n’est pas recommandé. Les certificats auto-signés ne sont pas considérés comme fiables par les navigateurs. En production, utilisez une autorité de certification publique.',
      },
    ],
  },
  de: {
    title: 'Generator für Selbstsignierte SSL-Zertifikate Kostenlos',
    badge: 'Kostenloses SSL im Browser',
    shortDescription:
      'Erzeugen Sie selbstsignierte SSL-Zertifikate und vollständige CSRs mit privatem Schlüssel direkt im Browser. Kostenlos, serverlos und 100% privat.',
    metaTitle:
      'Generator für Selbstsignierte SSL-Zertifikate Kostenlos - CSR & Privater Schlüssel 100% Privat',
    metaDescription:
      'Kostenloses Online-Tool zum Erzeugen selbstsignierter SSL-Zertifikate. CSR, Zertifikat und privaten Schlüssel im Browser generieren, ohne Daten an Server zu senden. Ideal für Dev- und Testumgebungen.',
    steps: [
      {
        id: 'ssl-step-1-de',
        title: 'Zertifikatsdaten ausfüllen',
        description:
          'Geben Sie CN, Organisation, Land und die restlichen Subject-(DN)-Felder für Ihr SSL-Zertifikat ein.',
        icon: 'edit',
      },
      {
        id: 'ssl-step-2-de',
        title: 'Algorithmus und Gültigkeit wählen',
        description:
          'Wählen Sie RSA oder ECDSA und konfigurieren Sie die Gültigkeit zwischen 1 und 10 Jahren.',
        icon: 'settings',
      },
      {
        id: 'ssl-step-3-de',
        title: 'CSR, Zertifikat und Schlüssel herunterladen',
        description:
          'Laden Sie CSR, selbstsigniertes Zertifikat und privaten Schlüssel im PEM-Format herunter, bereit für Ihre Server.',
        icon: 'download',
      },
    ],
    faqs: [
      {
        id: 'ssl-faq-1-de',
        question: 'Wofür eignet sich ein selbstsigniertes SSL-Zertifikat?',
        answer:
          'Ideal für Entwicklungs-, Test- und Lab-Umgebungen oder interne Tunnel, in denen kein öffentliches CA benötigt wird. Der Traffic ist verschlüsselt, auch wenn der Browser eine Warnung anzeigt.',
      },
      {
        id: 'ssl-faq-2-de',
        question: 'Werden meine privaten Schlüssel auf Server hochgeladen?',
        answer:
          'Nein. Die gesamte Generierung von Schlüsseln, CSR und Zertifikaten findet 100% in Ihrem Browser statt. Es werden keine Daten an unsere Server gesendet.',
      },
      {
        id: 'ssl-faq-3-de',
        question: 'Kann ich dieses SSL-Zertifikat in Produktion verwenden?',
        answer:
          'Nicht empfehlenswert. Selbstsignierte Zertifikate werden von Browsern nicht vertraut. Für Produktion sollten Sie eine öffentliche CA (z.B. Let’s Encrypt) verwenden.',
      },
    ],
  },
  it: {
    title: 'Generatore di Certificati SSL Autofirmati Gratis',
    badge: 'SSL Gratis nel Browser',
    shortDescription:
      'Genera certificati SSL autofirmati e CSR completi con chiave privata direttamente nel browser. Gratis, senza server e 100% privato.',
    metaTitle:
      'Generatore di Certificati SSL Autofirmati Gratis - CSR e Chiave Privata 100% Privato',
    metaDescription:
      'Strumento online gratuito per generare certificati SSL autofirmati. Crea CSR, certificato e chiave privata nel browser senza inviare dati a server. Ideale per sviluppo e ambienti interni.',
    steps: [
      {
        id: 'ssl-step-1-it',
        title: 'Compila i dati del certificato',
        description:
          'Inserisci CN, Organizzazione, Paese e gli altri campi del Subject (DN) del certificato SSL.',
        icon: 'edit',
      },
      {
        id: 'ssl-step-2-it',
        title: 'Scegli algoritmo e validità',
        description:
          'Seleziona RSA o ECDSA e imposta la validità del certificato tra 1 e 10 anni.',
        icon: 'settings',
      },
      {
        id: 'ssl-step-3-it',
        title: 'Scarica CSR, Certificato e Chiave',
        description:
          'Ottieni CSR, certificato autofirmato e chiave privata in formato PEM, pronti per l’installazione.',
        icon: 'download',
      },
    ],
    faqs: [
      {
        id: 'ssl-faq-1-it',
        question: 'A cosa serve un certificato SSL autofirmato?',
        answer:
          'È ideale per ambienti di sviluppo, test interni, lab DevOps o tunnel sicuri dove non serve un CA pubblico. Cifra il traffico anche se il browser mostra un avviso.',
      },
      {
        id: 'ssl-faq-2-it',
        question: 'Le mie chiavi private vengono caricate su qualche server?',
        answer:
          'No. Tutta la generazione di chiavi, CSR e certificati avviene al 100% nel browser. Nessun dato viene inviato ai nostri server.',
      },
      {
        id: 'ssl-faq-3-it',
        question: 'Posso usare questo certificato SSL in produzione?',
        answer:
          'Non è raccomandato. I certificati autofirmati non sono ritenuti affidabili dai browser. Per la produzione usa un’autorità di certificazione pubblica.',
      },
    ],
  },
  pt: {
    title: 'Gerador de Certificados SSL Autofirmados Grátis',
    badge: 'SSL Grátis no Navegador',
    shortDescription:
      'Gere certificados SSL autofirmados e CSRs completos com chave privada diretamente no navegador. Grátis, sem servidor e 100% privado.',
    metaTitle:
      'Gerador de Certificados SSL Autofirmados Grátis - CSR e Chave Privada 100% Privado',
    metaDescription:
      'Ferramenta online grátis para gerar certificados SSL autofirmados. Crie CSR, certificado e chave privada no navegador sem enviar dados a servidores. Ideal para desenvolvimento e ambientes internos.',
    steps: [
      {
        id: 'ssl-step-1-pt',
        title: 'Preencha os dados do certificado',
        description:
          'Informe CN, Organização, País e os demais campos do Subject (DN) do certificado SSL.',
        icon: 'edit',
      },
      {
        id: 'ssl-step-2-pt',
        title: 'Escolha algoritmo e validade',
        description:
          'Selecione RSA ou ECDSA e configure a validade do certificado entre 1 e 10 anos.',
        icon: 'settings',
      },
      {
        id: 'ssl-step-3-pt',
        title: 'Baixe CSR, Certificado e Chave',
        description:
          'Obtenha CSR, certificado autofirmado e chave privada em formato PEM, prontos para instalar.',
        icon: 'download',
      },
    ],
    faqs: [
      {
        id: 'ssl-faq-1-pt',
        question: 'Para que serve um certificado SSL autofirmado?',
        answer:
          'É ideal para ambientes de desenvolvimento, testes internos, lab DevOps ou túneis seguros em que não é necessário um CA público. Criptografa o tráfego mesmo que o navegador exiba um aviso.',
      },
      {
        id: 'ssl-faq-2-pt',
        question: 'Minhas chaves privadas são enviadas para algum servidor?',
        answer:
          'Não. Toda a geração de chaves, CSR e certificados acontece 100% no navegador. Nenhum dado é enviado aos nossos servidores.',
      },
      {
        id: 'ssl-faq-3-pt',
        question: 'Posso usar este certificado SSL em produção?',
        answer:
          'Não é recomendado. Certificados autofirmados não são confiáveis para os navegadores. Em produção, use uma autoridade certificadora pública.',
      },
    ],
  },
}

async function upsertTool() {
  const slug = 'ssl-certificate-generator'
  const codeKey = 'ssl-certificate-generator'
  const icon = 'shield'
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
  console.log('🔧 Tool ID for ssl-certificate-generator =>', toolId)
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
    console.log('\n🎉 Seed completado para SSL Certificate Generator en todos los idiomas.')
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    await client.end()
  }
}

run()

