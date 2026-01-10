import { ToolSeedData, createRichText } from './utils'

export const vaultData: ToolSeedData = {
  slug: 'vault',
  codeKey: 'vault',
  icon: 'lock',
  title: { 
    es: 'OHCodex Vault', 
    en: 'OHCodex Vault' 
  },
  badge: { 
    es: 'Privacidad Militar', 
    en: 'Military Grade' 
  },
  shortDescription: { 
    es: 'La forma más segura de enviar contraseñas y archivos confidenciales. Encriptación AES-256 que ocurre solo en tu dispositivo.', 
    en: 'The safest way to share passwords and confidential files. AES-256 encryption happens strictly on your device.' 
  },
  steps: {
    es: [
      { stepTitle: 'Escribe tu Secreto', stepDescription: 'Pega el texto, claves o arrastra el archivo confidencial.', stepIcon: 'edit' },
      { stepTitle: 'Cifra con Clave', stepDescription: 'Elige una contraseña maestra. Sin ella, los datos son irrecuperables.', stepIcon: 'lock' },
      { stepTitle: 'Comparte Seguro', stepDescription: 'Envía el código cifrado por email o WhatsApp sin miedo a espías.', stepIcon: 'zap' }
    ],
    en: [
      { stepTitle: 'Write your Secret', stepDescription: 'Paste text, keys or drag your confidential file.', stepIcon: 'edit' },
      { stepTitle: 'Encrypt with Key', stepDescription: 'Choose a master password. Without it, data is unrecoverable.', stepIcon: 'lock' },
      { stepTitle: 'Share Safely', stepDescription: 'Send the encrypted code via email or WhatsApp without fear of spies.', stepIcon: 'zap' }
    ]
  },
  cta: { 
    es: { 
      title: '¿La seguridad es crítica para tu empresa?', 
      desc: 'Implementamos arquitecturas "Zero-Trust" y sistemas de gestión de secretos para corporaciones y fintechs.' 
    },
    en: { 
      title: 'Is security critical for your business?', 
      desc: 'We implement "Zero-Trust" architectures and secret management systems for corporations and fintechs.' 
    }
  },
  faqs: {
    es: [
      { 
        question: '¿Es realmente seguro? ¿Cómo sé que no guardáis mis datos?', 
        answer: 'Es matemáticamente imposible que leamos tus datos. Usamos la Web Crypto API de tu navegador. El proceso de cifrado ocurre en tu CPU, y el resultado nunca se envía a nuestros servidores. Puedes desconectar internet y la herramienta seguirá funcionando.' 
      }, 
      { 
        question: '¿Qué pasa si olvido la contraseña?', 
        answer: 'Tus datos se perderán para siempre. Al ser un sistema de "Conocimiento Cero" (Zero-Knowledge), nosotros no guardamos copias de las contraseñas ni tenemos "puertas traseras" para recuperarlas.' 
      },
      {
        question: '¿Qué tipo de archivos puedo proteger?',
        answer: 'Cualquier tipo: PDFs legales, fotos privadas, backups de bases de datos o documentos de Excel. El límite lo pone la memoria RAM de tu dispositivo.'
      }
    ],
    en: [
      { 
        question: 'Is it really safe? How do I know you don\'t save my data?', 
        answer: 'It is mathematically impossible for us to read your data. We use your browser\'s Web Crypto API. Encryption happens on your CPU, and the result is never sent to our servers. You can disconnect the internet and it will still work.' 
      }, 
      { 
        question: 'What if I forget the password?', 
        answer: 'Your data will be lost forever. As a Zero-Knowledge system, we do not store password copies nor do we have "backdoors" to recover them.' 
      },
      {
        question: 'What types of files can I protect?',
        answer: 'Any type: Legal PDFs, private photos, database backups, or Excel documents. The limit is only your device\'s RAM.'
      }
    ]
  },
  content: {
    es: createRichText(
      '¿Por qué no deberías enviar contraseñas por WhatsApp o Email?', 
      'Vivimos en una era de vigilancia digital masiva. Enviar una contraseña, un número de tarjeta o un contrato confidencial por canales habituales (Slack, Email, WhatsApp) es un riesgo enorme: esos mensajes se guardan en servidores de terceros y pueden ser interceptados o filtrados en brechas de datos.', 
      [
        'Algoritmo AES-GCM de 256 bits: El mismo estándar usado por bancos y agencias militares.',
        'Derivación de clave PBKDF2: Protege contra ataques de fuerza bruta ralentizando los intentos de hackeo.',
        'Vectores de Inicialización (IV) únicos: Incluso si encriptas el mismo mensaje dos veces, el resultado será totalmente diferente cada vez.'
      ], 
      'OHCodex Vault es la herramienta esencial para abogados, periodistas, directivos y desarrolladores que necesitan garantizar que sus secretos viajan seguros a través de canales inseguros.'
    ),
    en: createRichText(
      'Why you shouldn\'t send passwords via WhatsApp or Email', 
      'We live in an age of mass digital surveillance. Sending a password, credit card number, or confidential contract through standard channels (Slack, Email, WhatsApp) is a huge risk: those messages are stored on third-party servers and can be intercepted or leaked in data breaches.', 
      [
        '256-bit AES-GCM Algorithm: The same standard used by banks and military agencies.',
        'PBKDF2 Key Derivation: Protects against brute-force attacks by slowing down hacking attempts.',
        'Unique Initialization Vectors (IV): Even if you encrypt the same message twice, the result will be totally different each time.'
      ], 
      'OHCodex Vault is the essential tool for lawyers, journalists, executives, and developers who need to ensure their secrets travel safely through insecure channels.'
    )
  }
}