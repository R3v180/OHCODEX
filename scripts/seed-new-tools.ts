import { Client } from 'pg';

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_nzlLWyOAp1j8@ep-orange-cherry-agt0euoy-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'
});

// Funciones para crear contenido Lexical
function p(text: string) {
  return {
    type: "paragraph",
    format: "start",
    indent: 0,
    version: 1,
    children: [{ mode: "normal", text, type: "text", style: "", detail: 0, format: 0, version: 1 }],
    direction: "ltr"
  };
}

function h2(text: string) {
  return {
    tag: "h2",
    type: "heading",
    format: "start",
    indent: 0,
    version: 1,
    children: [{ text, type: "text", version: 1 }],
    direction: "ltr"
  };
}

function h3(text: string) {
  return {
    tag: "h3",
    type: "heading",
    format: "start",
    indent: 0,
    version: 1,
    children: [{ text, type: "text", version: 1 }],
    direction: "ltr"
  };
}

// Contenidos SEO por herramienta e idioma
const toolsData = [
  {
    slug: 'base64',
    codeKey: 'base64',
    icon: 'code',
    badge: 'Nuevo',
    translations: {
      es: {
        title: 'Base64 Encoder/Decoder',
        shortDescription: 'Codifica y decodifica texto y archivos a Base64. Convierte imágenes a Base64 para embed en CSS/HTML o decodifica datos codificados de forma instantánea.',
        metaTitle: 'Base64 Encode Decode Online Gratis | Imágenes a Base64',
        metaDescription: 'Codifica texto y archivos a Base64 o decodifica Base64 a texto/imagen. Convierte imágenes a código Base64 para HTML/CSS. Herramienta gratuita y privada.'
      },
      en: {
        title: 'Base64 Encoder/Decoder',
        shortDescription: 'Encode and decode text and files to Base64. Convert images to Base64 for embedding in CSS/HTML or decode encoded data instantly.',
        metaTitle: 'Base64 Encode Decode Online Free | Images to Base64',
        metaDescription: 'Encode text and files to Base64 or decode Base64 to text/image. Convert images to Base64 code for HTML/CSS. Free and private tool.'
      },
      fr: {
        title: 'Base64 Encodeur/Décodeur',
        shortDescription: 'Encodez et décodez du texte et des fichiers en Base64. Convertissez des images en Base64 pour intégration CSS/HTML ou décodez des données instantanément.',
        metaTitle: 'Base64 Encode Decode En Ligne Gratuit | Images en Base64',
        metaDescription: 'Encodez texte et fichiers en Base64 ou décodez Base64 en texte/image. Convertissez images en code Base64 pour HTML/CSS. Outil gratuit et privé.'
      },
      de: {
        title: 'Base64 Encoder/Decoder',
        shortDescription: 'Texte und Dateien in Base64 kodieren und dekodieren. Konvertieren Sie Bilder in Base64 für Einbettung in CSS/HTML oder dekodieren Sie kodierte Daten sofort.',
        metaTitle: 'Base64 Encode Decode Online Kostenlos | Bilder zu Base64',
        metaDescription: 'Kodieren Sie Text und Dateien in Base64 oder dekodieren Sie Base64 zu Text/Bild. Konvertieren Sie Bilder in Base64-Code für HTML/CSS. Kostenloses privates Tool.'
      },
      it: {
        title: 'Base64 Encoder/Decoder',
        shortDescription: 'Codifica e decodifica testo e file in Base64. Converti immagini in Base64 per embedding in CSS/HTML o decodifica dati codificati istantaneamente.',
        metaTitle: 'Base64 Encode Decode Online Gratis | Immagini in Base64',
        metaDescription: 'Codifica testo e file in Base64 o decodifica Base64 in testo/immagine. Converti immagini in codice Base64 per HTML/CSS. Strumento gratuito e privato.'
      },
      pt: {
        title: 'Base64 Encoder/Decoder',
        shortDescription: 'Codifique e decodifique texto e arquivos para Base64. Converta imagens para Base64 para incorporar em CSS/HTML ou decodifique dados codificados instantaneamente.',
        metaTitle: 'Base64 Encode Decode Online Grátis | Imagens para Base64',
        metaDescription: 'Codifique texto e arquivos para Base64 ou decodifique Base64 para texto/imagem. Converta imagens para código Base64 para HTML/CSS. Ferramenta gratuita e privada.'
      }
    },
    content: {
      es: { root: { type: "root", format: "", indent: 0, version: 1, children: [h2("¿Qué es Base64?"), p("Base64 es un sistema de codificación que convierte datos binarios en texto ASCII. Se utiliza ampliamente para transmitir datos que de otro modo podrían corromperse, como imágenes incrustadas en HTML, datos en URLs, o para almacenar contraseñas y tokens de forma segura."), h3("Codificación de Imágenes"), p("Uno de los usos más comunes de Base64 es convertir imágenes a código texto que puede incrustarse directamente en archivos CSS o HTML. Esto elimina la necesidad de peticiones HTTP adicionales, mejorando la velocidad de carga de la página."), h3("100% Privado y Seguro"), p("A diferencia de servicios online que procesan tus datos en sus servidores, nuestra herramienta funciona completamente en tu navegador. Tus archivos y datos sensibles nunca abandonan tu dispositivo.")] } },
      en: { root: { type: "root", format: "", indent: 0, version: 1, children: [h2("What is Base64?"), p("Base64 is an encoding system that converts binary data into ASCII text. It's widely used to transmit data that might otherwise be corrupted, such as images embedded in HTML, data in URLs, or for securely storing passwords and tokens."), h3("Image Encoding"), p("One of the most common uses of Base64 is converting images to text code that can be embedded directly in CSS or HTML files. This eliminates the need for additional HTTP requests."), h3("100% Private and Secure"), p("Unlike online services that process your data on their servers, our tool works entirely in your browser. Your files and sensitive data never leave your device.")] } },
      fr: { root: { type: "root", format: "", indent: 0, version: 1, children: [h2("Qu'est-ce que Base64 ?"), p("Base64 est un système de codage qui convertit des données binaires en texte ASCII. Il est largement utilisé pour transmettre des données qui pourraient autrement être corrompues."), h3("Encodage d'Images"), p("L'un des usages les plus courants de Base64 est la conversion d'images en code texte pouvant être intégré directement dans des fichiers CSS ou HTML.")] } },
      de: { root: { type: "root", format: "", indent: 0, version: 1, children: [h2("Was ist Base64?"), p("Base64 ist ein Kodierungssystem, das Binärdaten in ASCII-Text umwandelt. Es wird häufig verwendet, um Daten zu übertragen, die sonst beschädigt werden könnten.")] } },
      it: { root: { type: "root", format: "", indent: 0, version: 1, children: [h2("Cos'è Base64?"), p("Base64 è un sistema di codifica che converte dati binari in testo ASCII. È ampiamente utilizzato per trasmettere dati che altrimenti potrebbero corrompersi.")] } },
      pt: { root: { type: "root", format: "", indent: 0, version: 1, children: [h2("O que é Base64?"), p("Base64 é um sistema de codificação que converte dados binários em texto ASCII. É amplamente usado para transmitir dados que de outra forma poderiam ser corrompidos.")] } }
    }
  },
  {
    slug: 'css-minifier',
    codeKey: 'css-minifier',
    icon: 'palette',
    badge: 'Nuevo',
    translations: {
      es: {
        title: 'CSS Minifier & Beautifier',
        shortDescription: 'Minifica CSS para producción o formatea para desarrollo. Comprime estilos eliminando espacios innecesarios y optimizando selectores.',
        metaTitle: 'Minificar CSS Online | CSS Beautifier y Formateador',
        metaDescription: 'Minifica CSS para producción comprimiendo código. Formatea CSS/SCSS con sangrado perfecto. Herramienta gratuita para desarrolladores web.'
      },
      en: {
        title: 'CSS Minifier & Beautifier',
        shortDescription: 'Minify CSS for production or format for development. Compress styles by removing unnecessary spaces and optimizing selectors.',
        metaTitle: 'Minify CSS Online | CSS Beautifier & Formatter',
        metaDescription: 'Minify CSS for production by compressing code. Format CSS/SCSS with perfect indentation. Free tool for web developers.'
      },
      fr: {
        title: 'CSS Minifier & Beautifier',
        shortDescription: 'Minifiez CSS pour production ou formatez pour développement. Compressez styles en éliminant espaces inutiles et optimisant sélecteurs.',
        metaTitle: 'Minifier CSS En Ligne | CSS Beautifier et Formateur',
        metaDescription: 'Minifiez CSS pour production en compressant code. Formatez CSS/SCSS avec indentation parfaite. Outil gratuit pour développeurs web.'
      },
      de: {
        title: 'CSS Minifier & Beautifier',
        shortDescription: 'Minifizieren Sie CSS für Produktion oder formatieren Sie für Entwicklung. Komprimieren Sie Styles durch Entfernen unnötiger Leerzeichen.',
        metaTitle: 'CSS Minify Online | CSS Beautifier & Formatierer',
        metaDescription: 'Minifizieren Sie CSS für Produktion durch Code-Komprimierung. Formatieren Sie CSS/SCSS mit perfekter Einrückung. Kostenloses Tool für Webentwickler.'
      },
      it: {
        title: 'CSS Minifier & Beautifier',
        shortDescription: 'Minifica CSS per produzione o formatta per sviluppo. Comprimi stili eliminando spazi non necessari e ottimizzando selettori.',
        metaTitle: 'Minify CSS Online | CSS Beautifier e Formattatore',
        metaDescription: 'Minifica CSS per produzione comprimendo codice. Formatta CSS/SCSS con indentazione perfetta. Strumento gratuito per sviluppatori web.'
      },
      pt: {
        title: 'CSS Minifier & Beautifier',
        shortDescription: 'Minifique CSS para produção ou formate para desenvolvimento. Comprima estilos removendo espaços desnecessários e otimizando seletores.',
        metaTitle: 'Minificar CSS Online | CSS Beautifier e Formatador',
        metaDescription: 'Minifique CSS para produção comprimindo código. Formate CSS/SCSS com indentação perfeita. Ferramenta gratuita para desenvolvedores web.'
      }
    },
    content: {
      es: { root: { type: "root", format: "", indent: 0, version: 1, children: [h2("Optimiza tu CSS para Producción"), p("El CSS minificado reduce el tamaño de los archivos hasta un 60-80%, mejorando drásticamente los tiempos de carga de tu sitio web. Nuestra herramienta elimina comentarios, espacios en blanco innecesarios y optimiza la sintaxis."), h3("Beautifier para Desarrollo"), p("Durante el desarrollo, el código CSS bien formateado es esencial para el mantenimiento. Nuestro formateador organiza automáticamente tu código con sangrado consistente y estructura clara.")] } },
      en: { root: { type: "root", format: "", indent: 0, version: 1, children: [h2("Optimize Your CSS for Production"), p("Minified CSS reduces file sizes by 60-80%, dramatically improving your website loading times. Our tool removes comments, unnecessary whitespace and optimizes syntax."), h3("Beautifier for Development"), p("During development, well-formatted CSS code is essential for maintenance. Our formatter automatically organizes your code with consistent indentation and clear structure.")] } },
      fr: { root: { type: "root", format: "", indent: 0, version: 1, children: [h2("Optimisez votre CSS pour la Production"), p("Le CSS minifié réduit les tailles de fichiers de 60-80%, améliorant considérablement les temps de chargement.")] } },
      de: { root: { type: "root", format: "", indent: 0, version: 1, children: [h2("Optimieren Sie CSS für Produktion"), p("Minifiziertes CSS reduziert Dateigrößen um 60-80% und verbessert Ladezeiten drastisch.")] } },
      it: { root: { type: "root", format: "", indent: 0, version: 1, children: [h2("Ottimizza il CSS per la Produzione"), p("Il CSS minificato riduce le dimensioni dei file del 60-80%, migliorando drasticamente i tempi di caricamento.")] } },
      pt: { root: { type: "root", format: "", indent: 0, version: 1, children: [h2("Otimize seu CSS para Produção"), p("CSS minificado reduz tamanhos de arquivo em 60-80%, melhorando drasticamente os tempos de carregamento.")] } }
    }
  },
  {
    slug: 'password-gen',
    codeKey: 'password-gen',
    icon: 'key',
    badge: 'Nuevo',
    translations: {
      es: {
        title: 'Generador de Contraseñas Seguras',
        shortDescription: 'Crea contraseñas fuertes y seguras al instante. Generador de contraseñas aleatorias con indicador de fortaleza y opciones personalizables.',
        metaTitle: 'Generador de Contraseñas Online | Password Generator Seguro',
        metaDescription: 'Genera contraseñas seguras y fuertes gratis. Personaliza longitud, símbolos y números. Indicador de fortaleza y entropía. Herramienta privada sin enviar datos.'
      },
      en: {
        title: 'Secure Password Generator',
        shortDescription: 'Create strong and secure passwords instantly. Random password generator with strength indicator and customizable options.',
        metaTitle: 'Password Generator Online | Strong Secure Passwords',
        metaDescription: 'Generate strong secure passwords free. Customize length, symbols and numbers. Strength indicator and entropy. Private tool without sending data.'
      },
      fr: {
        title: 'Générateur de Mots de Passe',
        shortDescription: 'Créez mots de passe forts et sécurisés instantanément. Générateur aléatoire avec indicateur de force et options personnalisables.',
        metaTitle: 'Générateur Mots de Passe | Mots de Passe Forts Sécurisés',
        metaDescription: 'Générez mots de passe forts gratuits. Personnalisez longueur, symboles et chiffres. Indicateur de force et entropie. Outil privé sans envoi de données.'
      },
      de: {
        title: 'Sicherer Passwort Generator',
        shortDescription: 'Erstellen Sie starke und sichere Passwörter sofort. Zufälliger Passwort-Generator mit Stärkeanzeige und anpassbaren Optionen.',
        metaTitle: 'Passwort Generator Online | Starke Sichere Passwörter',
        metaDescription: 'Generieren Sie starke sichere Passwörter kostenlos. Passen Sie Länge, Symbole und Zahlen an. Stärkeanzeige und Entropie. Privates Tool ohne Datenversand.'
      },
      it: {
        title: 'Generatore Password Sicure',
        shortDescription: 'Crea password forti e sicure istantaneamente. Generatore casuale con indicatore di forza e opzioni personalizzabili.',
        metaTitle: 'Generatore Password Online | Password Forti Sicure',
        metaDescription: 'Genera password forti sicure gratis. Personalizza lunghezza, simboli e numeri. Indicatore di forza e entropia. Strumento privato senza invio dati.'
      },
      pt: {
        title: 'Gerador de Senhas Seguras',
        shortDescription: 'Crie senhas fortes e seguras instantaneamente. Gerador aleatório com indicador de força e opções personalizáveis.',
        metaTitle: 'Gerador de Senhas Online | Senhas Fortes Seguras',
        metaDescription: 'Gere senhas fortes seguras grátis. Personalize comprimento, símbolos e números. Indicador de força e entropia. Ferramenta privada sem enviar dados.'
      }
    },
    content: {
      es: { root: { type: "root", format: "", indent: 0, version: 1, children: [h2("Genera Contraseñas Inviolables"), p("Las contraseñas débiles son la principal causa de hackeos de cuentas. Nuestro generador crea contraseñas con entropía criptográfica real usando el API Web Crypto del navegador."), h3("Indicador de Fortaleza en Tiempo Real"), p("Cada contraseña generada incluye un análisis de fortaleza basado en la entropía. Contraseñas de 80+ bits se consideran fuertes, mientras que 120+ bits ofrecen seguridad casi inquebrantable."), h3("Generación de Passphrases Diceware"), p("Además de contraseñas aleatorias, puedes generar passphrases estilo Diceware: combinaciones de palabras comunes fáciles de recordar para humanos pero extremadamente difíciles de crackear.")] } },
      en: { root: { type: "root", format: "", indent: 0, version: 1, children: [h2("Generate Unbreakable Passwords"), p("Weak passwords are the main cause of account hacks. Our generator creates passwords with real cryptographic entropy using the browser's Web Crypto API."), h3("Real-Time Strength Indicator"), p("Each generated password includes a strength analysis based on entropy. Passwords with 80+ bits are considered strong, while 120+ bits provide nearly unbreakable security."), h3("Diceware Passphrase Generation"), p("Besides random passwords, you can generate Diceware-style passphrases: combinations of common words easy for humans to remember but extremely difficult for computers to crack.")] } },
      fr: { root: { type: "root", format: "", indent: 0, version: 1, children: [h2("Générez Mots de Passe Incassables"), p("Mots de passe faibles sont principale cause de piratage comptes. Notre générateur crée mots de passe avec entropie cryptographique réelle.")] } },
      de: { root: { type: "root", format: "", indent: 0, version: 1, children: [h2("Generieren Sie Unbrechbare Passwörter"), p("Schwache Passwörter sind Hauptursache für Kontohacks. Unser Generator erstellt Passwörter mit echter kryptographischer Entropie.")] } },
      it: { root: { type: "root", format: "", indent: 0, version: 1, children: [h2("Genera Password Inviolabili"), p("Password deboli sono causa principale di hack account. Il nostro generatore crea password con entropia crittografica reale.")] } },
      pt: { root: { type: "root", format: "", indent: 0, version: 1, children: [h2("Gere Senhas Invioláveis"), p("Senhas fracas são principal causa de hackeamento contas. Nosso gerador cria senhas com entropia criptográfica real.")] } }
    }
  },
  {
    slug: 'jwt-decoder',
    codeKey: 'jwt-decoder',
    icon: 'key-round',
    badge: 'Nuevo',
    translations: {
      es: {
        title: 'JWT Decoder / Inspector',
        shortDescription: 'Decodifica y analiza tokens JWT. Visualiza header, payload y verifica firma. Herramienta para desarrolladores que trabajan con autenticación.',
        metaTitle: 'JWT Decoder Online | Decodificar Token JWT Gratis',
        metaDescription: 'Decodifica tokens JWT online. Inspecciona header, payload y claims. Verifica expiración y firma. Herramienta gratuita para debug de autenticación.'
      },
      en: {
        title: 'JWT Decoder / Inspector',
        shortDescription: 'Decode and analyze JWT tokens. View header, payload and verify signature. Tool for developers working with authentication.',
        metaTitle: 'JWT Decoder Online | Decode JWT Token Free',
        metaDescription: 'Decode JWT tokens online. Inspect header, payload and claims. Verify expiration and signature. Free tool for authentication debugging.'
      },
      fr: {
        title: 'JWT Décodeur / Inspecteur',
        shortDescription: 'Décodez et analysez tokens JWT. Visualisez header, payload et vérifiez signature. Outil pour développeurs travaillant avec authentification.',
        metaTitle: 'JWT Décodeur En Ligne | Décoder Token JWT Gratuit',
        metaDescription: 'Décodez tokens JWT en ligne. Inspectez header, payload et claims. Vérifiez expiration et signature. Outil gratuit pour debug authentification.'
      },
      de: {
        title: 'JWT Decoder / Inspektor',
        shortDescription: 'Dekodieren und analysieren Sie JWT-Tokens. Zeigen Sie Header, Payload an und verifizieren Sie Signatur. Tool für Entwickler mit Authentifizierung.',
        metaTitle: 'JWT Decoder Online | JWT Token Dekodieren Kostenlos',
        metaDescription: 'Dekodieren Sie JWT-Tokens online. Inspizieren Sie Header, Payload und Claims. Verifizieren Sie Ablauf und Signatur. Kostenloses Tool für Auth-Debugging.'
      },
      it: {
        title: 'JWT Decoder / Ispettore',
        shortDescription: 'Decodifica e analizza token JWT. Visualizza header, payload e verifica firma. Strumento per sviluppatori che lavorano con autenticazione.',
        metaTitle: 'JWT Decoder Online | Decodifica Token JWT Gratis',
        metaDescription: 'Decodifica token JWT online. Ispeziona header, payload e claims. Verifica scadenza e firma. Strumento gratuito per debug autenticazione.'
      },
      pt: {
        title: 'JWT Decoder / Inspetor',
        shortDescription: 'Decodifique e analise tokens JWT. Visualize header, payload e verifique assinatura. Ferramenta para desenvolvedores trabalhando com autenticação.',
        metaTitle: 'JWT Decoder Online | Decodificar Token JWT Grátis',
        metaDescription: 'Decodifique tokens JWT online. Inspecione header, payload e claims. Verifique expiração e assinatura. Ferramenta gratuita para debug autenticação.'
      }
    },
    content: {
      es: { root: { type: "root", format: "", indent: 0, version: 1, children: [h2("¿Qué son los Tokens JWT?"), p("JSON Web Tokens (JWT) son un estándar abierto (RFC 7519) para transmitir información de forma segura entre partes como un objeto JSON. Se usan ampliamente para autenticación y autorización en aplicaciones web modernas."), h3("Estructura de un JWT"), p("Un token JWT consta de tres partes separadas por puntos: Header (algoritmo y tipo), Payload (claims como usuario, roles, expiración) y Signature (verificación criptográfica)."), h3("Verificación de Expiración"), p("Los tokens JWT incluyen una claim 'exp' que indica cuándo expira el token. Nuestra herramienta verifica automáticamente esta fecha y te muestra visualmente si el token está vigente o ha caducado.")] } },
      en: { root: { type: "root", format: "", indent: 0, version: 1, children: [h2("What are JWT Tokens?"), p("JSON Web Tokens (JWT) are an open standard (RFC 7519) for securely transmitting information between parties as a JSON object. They are widely used for authentication and authorization in modern web applications."), h3("JWT Structure"), p("A JWT token consists of three parts separated by dots: Header (algorithm and type), Payload (claims like user, roles, expiration) and Signature (cryptographic verification)."), h3("Expiration Verification"), p("JWT tokens include an 'exp' claim indicating when the token expires. Our tool automatically verifies this date and visually shows you if the token is valid or expired.")] } },
      fr: { root: { type: "root", format: "", indent: 0, version: 1, children: [h2("Que sont les Tokens JWT ?"), p("JSON Web Tokens (JWT) sont un standard ouvert (RFC 7519) pour transmettre informations sécurisément entre parties comme objet JSON.")] } },
      de: { root: { type: "root", format: "", indent: 0, version: 1, children: [h2("Was sind JWT-Tokens?"), p("JSON Web Tokens (JWT) sind ein offener Standard (RFC 7519) zum sicheren Übertragen von Informationen zwischen Parteien als JSON-Objekt.")] } },
      it: { root: { type: "root", format: "", indent: 0, version: 1, children: [h2("Cosa sono i Token JWT?"), p("JSON Web Tokens (JWT) sono uno standard aperto (RFC 7519) per trasmettere informazioni in modo sicuro tra parti come oggetto JSON.")] } },
      pt: { root: { type: "root", format: "", indent: 0, version: 1, children: [h2("O que são Tokens JWT?"), p("JSON Web Tokens (JWT) são um padrão aberto (RFC 7519) para transmitir informações com segurança entre partes como objeto JSON.")] } }
    }
  },
  {
    slug: 'regex-tester',
    codeKey: 'regex-tester',
    icon: 'regex',
    badge: 'Nuevo',
    translations: {
      es: {
        title: 'Regex Tester Online',
        shortDescription: 'Prueba y depura expresiones regulares en tiempo real. Visualiza coincidencias, grupos capturados y prueba con diferentes patrones.',
        metaTitle: 'Regex Tester Online | Probar Expresiones Regulares',
        metaDescription: 'Testea expresiones regulares online con resultado en tiempo real. Visualiza matches y grupos. Incluye patrones comunes y cheat sheet. Gratis y privado.'
      },
      en: {
        title: 'Regex Tester Online',
        shortDescription: 'Test and debug regular expressions in real-time. Visualize matches, captured groups and test with different patterns.',
        metaTitle: 'Regex Tester Online | Test Regular Expressions',
        metaDescription: 'Test regular expressions online with real-time results. Visualize matches and groups. Includes common patterns and cheat sheet. Free and private.'
      },
      fr: {
        title: 'Regex Testeur En Ligne',
        shortDescription: 'Testez et déboguez expressions régulières en temps réel. Visualisez correspondances, groupes capturés et testez avec différents motifs.',
        metaTitle: 'Regex Testeur En Ligne | Tester Expressions Régulières',
        metaDescription: 'Testez expressions régulières en ligne avec résultats temps réel. Visualisez correspondances et groupes. Inclut motifs communs et cheat sheet. Gratuit.'
      },
      de: {
        title: 'Regex Tester Online',
        shortDescription: 'Testen und debuggen Sie reguläre Ausdrücke in Echtzeit. Visualisieren Sie Treffer, erfasste Gruppen und testen Sie mit verschiedenen Mustern.',
        metaTitle: 'Regex Tester Online | Reguläre Ausdrücke Testen',
        metaDescription: 'Testen Sie reguläre Ausdrücke online mit Echtzeit-Ergebnissen. Visualisieren Sie Treffer und Gruppen. Enthält gemeinsame Muster und Cheat Sheet. Kostenlos.'
      },
      it: {
        title: 'Regex Tester Online',
        shortDescription: 'Testa e debugga espressioni regolari in tempo reale. Visualizza corrispondenze, gruppi catturati e testa con diversi pattern.',
        metaTitle: 'Regex Tester Online | Testare Espressioni Regolari',
        metaDescription: 'Testa espressioni regolari online con risultati in tempo reale. Visualizza corrispondenze e gruppi. Include pattern comuni e cheat sheet. Gratuito.'
      },
      pt: {
        title: 'Regex Tester Online',
        shortDescription: 'Teste e depure expressões regulares em tempo real. Visualize correspondências, grupos capturados e teste com diferentes padrões.',
        metaTitle: 'Regex Tester Online | Testar Expressões Regulares',
        metaDescription: 'Teste expressões regulares online com resultados em tempo real. Visualize correspondências e grupos. Inclui padrões comuns e cheat sheet. Grátis.'
      }
    },
    content: {
      es: { root: { type: "root", format: "", indent: 0, version: 1, children: [h2("Domina las Expresiones Regulares"), p("Las expresiones regulares (regex) son patrones de búsqueda potentísimos usados para validación de formularios, extracción de datos y manipulación de texto. Nuestro tester te permite experimentar y aprender regex de forma visual."), h3("Patrones Comunes Incluidos"), p("¿No sabes por dónde empezar? Incluimos patrones predefinidos para emails, URLs, teléfonos, direcciones IP, colores hexadecimales, tarjetas de crédito, UUIDs y más."), h3("Cheat Sheet Integrada"), p("Nuestra herramienta incluye una referencia rápida de sintaxis regex: anclas, clases de caracteres, cuantificadores, grupos y lookarounds.")] } },
      en: { root: { type: "root", format: "", indent: 0, version: 1, children: [h2("Master Regular Expressions"), p("Regular expressions (regex) are powerful search patterns used for form validation, data extraction, and text manipulation. Our tester lets you experiment and learn regex visually."), h3("Common Patterns Included"), p("Don't know where to start? We include predefined patterns for emails, URLs, phones, IP addresses, hex colors, credit cards, UUIDs and more."), h3("Integrated Cheat Sheet"), p("Our tool includes a quick reference for regex syntax: anchors, character classes, quantifiers, groups and lookarounds.")] } },
      fr: { root: { type: "root", format: "", indent: 0, version: 1, children: [h2("Maîtrisez Expressions Régulières"), p("Expressions régulières (regex) sont motifs de recherche puissants utilisés pour validation formulaires, extraction données et manipulation texte.")] } },
      de: { root: { type: "root", format: "", indent: 0, version: 1, children: [h2("Beherrschen Sie Reguläre Ausdrücke"), p("Reguläre Ausdrücke (regex) sind leistungsstarke Suchmuster für Formularvalidierung, Datenextraktion und Textmanipulation.")] } },
      it: { root: { type: "root", format: "", indent: 0, version: 1, children: [h2("Padroneggia Espressioni Regolari"), p("Espressioni regolari (regex) sono pattern di ricerca potenti usati per validazione form, estrazione dati e manipolazione testo.")] } },
      pt: { root: { type: "root", format: "", indent: 0, version: 1, children: [h2("Domine Expressões Regulares"), p("Expressões regulares (regex) são padrões de busca poderosos usados para validação formulários, extração dados e manipulação texto.")] } }
    }
  },
  {
    slug: 'color-palette',
    codeKey: 'color-palette',
    icon: 'palette',
    badge: 'Nuevo',
    translations: {
      es: {
        title: 'Generador de Paletas de Color',
        shortDescription: 'Crea paletas de colores armoniosas para tus diseños. Genera combinaciones complementarias, triádicas, análogas y más. Exporta en CSS, SCSS o JSON.',
        metaTitle: 'Generador Paletas de Color Online | Paletas Armónicas',
        metaDescription: 'Crea paletas de colores profesionales online. Complementarios, triádicos, análogos. Exporta CSS, SCSS, JSON. Gratis para diseñadores y desarrolladores.'
      },
      en: {
        title: 'Color Palette Generator',
        shortDescription: 'Create harmonious color palettes for your designs. Generate complementary, triadic, analogous combinations and more. Export to CSS, SCSS or JSON.',
        metaTitle: 'Color Palette Generator Online | Harmonic Palettes',
        metaDescription: 'Create professional color palettes online. Complementary, triadic, analogous. Export CSS, SCSS, JSON. Free for designers and developers.'
      },
      fr: {
        title: 'Générateur Palettes Couleurs',
        shortDescription: 'Créez palettes couleurs harmonieuses pour vos designs. Générez combinaisons complémentaires, triadiques, analogues et plus. Exportez CSS, SCSS ou JSON.',
        metaTitle: 'Générateur Palettes Couleurs | Palettes Harmoniques',
        metaDescription: 'Créez palettes couleurs professionnelles en ligne. Complémentaires, triadiques, analogues. Exportez CSS, SCSS, JSON. Gratuit pour designers et développeurs.'
      },
      de: {
        title: 'Farbpalette Generator',
        shortDescription: 'Erstellen Sie harmonische Farbpaletten für Ihre Designs. Generieren Sie komplementäre, triadische, analoge Kombinationen und mehr. Exportieren Sie CSS, SCSS oder JSON.',
        metaTitle: 'Farbpalette Generator Online | Harmonische Paletten',
        metaDescription: 'Erstellen Sie professionelle Farbpaletten online. Komplementär, triadisch, analog. Exportieren Sie CSS, SCSS, JSON. Kostenlos für Designer und Entwickler.'
      },
      it: {
        title: 'Generatore Palette Colori',
        shortDescription: 'Crea palette colori armoniose per i tuoi design. Genera combinazioni complementari, triadiche, analoghe e altro. Esporta in CSS, SCSS o JSON.',
        metaTitle: 'Generatore Palette Colori | Palette Armoniche',
        metaDescription: 'Crea palette colori professionali online. Complementari, triadiche, analoghe. Esporta CSS, SCSS, JSON. Gratuito per designer e sviluppatori.'
      },
      pt: {
        title: 'Gerador Paletas de Cores',
        shortDescription: 'Crie paletas de cores harmoniosas para seus designs. Gere combinações complementares, triádicas, análogas e mais. Exporte para CSS, SCSS ou JSON.',
        metaTitle: 'Gerador Paletas Cores Online | Paletas Harmônicas',
        metaDescription: 'Crie paletas de cores profissionais online. Complementares, triádicas, análogas. Exporte CSS, SCSS, JSON. Grátis para designers e desenvolvedores.'
      }
    },
    content: {
      es: { root: { type: "root", format: "", indent: 0, version: 1, children: [h2("Teoría del Color para Diseñadores"), p("La armonía del color es fundamental en el diseño visual. Nuestra herramienta implementa las reglas clásicas de la teoría del color: complementarios, triádicos, análogos y más."), h3("Exportación para Desarrolladores"), p("Además de diseñadores, esta herramienta es perfecta para desarrolladores frontend. Exporta directamente variables CSS custom properties, SCSS variables o un objeto JSON para usar en JavaScript."), h3("Preview de Componentes"), p("Visualiza cómo se verían tus colores aplicados a botones, tarjetas y texto. Esto te ayuda a verificar que haya suficiente contraste entre colores.")] } },
      en: { root: { type: "root", format: "", indent: 0, version: 1, children: [h2("Color Theory for Designers"), p("Color harmony is fundamental in visual design. Our tool implements classical color theory rules: complementary, triadic, analogous and more."), h3("Export for Developers"), p("Besides designers, this tool is perfect for frontend developers. Export directly CSS custom properties, SCSS variables or a JSON object to use in JavaScript."), h3("Component Preview"), p("Visualize how your colors would look applied to buttons, cards and text. This helps you verify there's enough contrast between colors.")] } },
      fr: { root: { type: "root", format: "", indent: 0, version: 1, children: [h2("Théorie Couleur pour Designers"), p("Harmonie couleur est fondamentale en design visuel. Notre outil implémente règles classiques théorie couleur.")] } },
      de: { root: { type: "root", format: "", indent: 0, version: 1, children: [h2("Farbtheorie für Designer"), p("Farbharmonie ist fundamental im visuellen Design. Unser Tool implementiert klassische Farbtheorie-Regeln.")] } },
      it: { root: { type: "root", format: "", indent: 0, version: 1, children: [h2("Teoria del Colore per Designer"), p("Armonia colore è fondamentale nel design visivo. Il nostro strumento implementa regole classiche teoria colore.")] } },
      pt: { root: { type: "root", format: "", indent: 0, version: 1, children: [h2("Teoria Cor para Designers"), p("Harmonia cor é fundamental no design visual. Nossa ferramenta implementa regras clássicas teoria cor.")] } }
    }
  }
];

async function seedTools() {
  await client.connect();
  
  for (const tool of toolsData) {
    // Verificar si ya existe
    const existing = await client.query('SELECT id FROM tools WHERE slug = $1', [tool.slug]);
    let toolId;
    
    if (existing.rows.length > 0) {
      toolId = existing.rows[0].id;
      console.log(`⚠️ ${tool.slug}: Ya existe (ID: ${toolId}), actualizando...`);
      // Actualizar icon
      await client.query('UPDATE tools SET icon = $1, code_key = $2 WHERE id = $3', [tool.icon, tool.codeKey, toolId]);
    } else {
      // Insertar tool base (sin badge que va en locales)
      const result = await client.query(
        'INSERT INTO tools (slug, code_key, icon) VALUES ($1, $2, $3) RETURNING id',
        [tool.slug, tool.codeKey, tool.icon]
      );
      toolId = result.rows[0].id;
      console.log(`✅ ${tool.slug}: Creado (ID: ${toolId})`);
    }
    
    // Insertar/Actualizar traducciones
    for (const [locale, data] of Object.entries(tool.translations)) {
      const content = tool.content[locale as keyof typeof tool.content];
      
      // Verificar si existe traducción
      const existingTrans = await client.query(
        'SELECT id FROM tools_locales WHERE _parent_id = $1 AND _locale = $2',
        [toolId, locale]
      );
      
      if (existingTrans.rows.length > 0) {
        // Actualizar
        await client.query(
          `UPDATE tools_locales 
           SET title = $1, short_description = $2, meta_title = $3, meta_description = $4,
               content = $5, badge = $6
           WHERE _parent_id = $7 AND _locale = $8`,
          [
            data.title,
            data.shortDescription,
            data.metaTitle,
            data.metaDescription,
            JSON.stringify(content),
            tool.badge,
            toolId,
            locale
          ]
        );
      } else {
        // Insertar nueva
        await client.query(
          `INSERT INTO tools_locales 
           (_parent_id, _locale, title, short_description, meta_title, meta_description, content, badge)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            toolId,
            locale,
            data.title,
            data.shortDescription,
            data.metaTitle,
            data.metaDescription,
            JSON.stringify(content),
            tool.badge
          ]
        );
      }
      
      console.log(`   ✅ ${locale.toUpperCase()}: ${data.title}`);
    }
  }
  
  await client.end();
  console.log('\n🎉 Todas las herramientas registradas correctamente');
}

seedTools().catch(err => {
  console.error('Error:', err);
  client.end();
});
