import { getPayload } from 'payload'
import configPromise from '../src/payload.config'

// Builds proper Lexical RichText content compatible with Payload v3
type LexicalFormat = '' | 'left' | 'start' | 'center' | 'right' | 'end' | 'justify'

function makeContent(intro1: string, intro2: string, h2: string, bullets: string[], h3: string, paras: string[]) {
    return {
        root: {
            type: 'root' as const,
            format: '' as LexicalFormat,
            indent: 0,
            version: 1,
            direction: 'ltr' as const,
            children: [
                {
                    type: 'paragraph',
                    version: 1,
                    direction: 'ltr' as const,
                    format: '' as LexicalFormat,
                    indent: 0,
                    children: [{ type: 'text', version: 1, text: intro1, format: 0, mode: 'normal' as const, style: '', detail: 0 }]
                },
                {
                    type: 'paragraph',
                    version: 1,
                    direction: 'ltr' as const,
                    format: '' as LexicalFormat,
                    indent: 0,
                    children: [{ type: 'text', version: 1, text: intro2, format: 0, mode: 'normal' as const, style: '', detail: 0 }]
                },
                {
                    type: 'heading',
                    tag: 'h2',
                    version: 1,
                    direction: 'ltr' as const,
                    format: '' as LexicalFormat,
                    indent: 0,
                    children: [{ type: 'text', version: 1, text: h2, format: 0, mode: 'normal' as const, style: '', detail: 0 }]
                },
                {
                    type: 'list',
                    listType: 'bullet' as const,
                    start: 1,
                    version: 1,
                    direction: 'ltr' as const,
                    format: '' as LexicalFormat,
                    indent: 0,
                    children: bullets.map((text, i) => ({
                        type: 'listitem',
                        version: 1,
                        value: i + 1,
                        direction: 'ltr' as const,
                        format: '' as LexicalFormat,
                        indent: 0,
                        children: [{ type: 'text', version: 1, text, format: 0, mode: 'normal' as const, style: '', detail: 0 }]
                    }))
                },
                {
                    type: 'heading',
                    tag: 'h3',
                    version: 1,
                    direction: 'ltr' as const,
                    format: '' as LexicalFormat,
                    indent: 0,
                    children: [{ type: 'text', version: 1, text: h3, format: 0, mode: 'normal' as const, style: '', detail: 0 }]
                },
                ...paras.map(text => ({
                    type: 'paragraph',
                    version: 1,
                    direction: 'ltr' as const,
                    format: '' as LexicalFormat,
                    indent: 0,
                    children: [{ type: 'text', version: 1, text, format: 0, mode: 'normal' as const, style: '', detail: 0 }]
                }))
            ]
        }
    }
}

// ─── FILE CARVER CONTENT ───────────────────────────────────────────────────

const carverContent = {
    es: makeContent(
        'El Data Carving (o File Carving) es una técnica forense que extrae archivos y datos de medios de almacenamiento sin depender del sistema de archivos.',
        'Esta herramienta lee tu archivo a nivel binario en tu navegador buscando "Magic Bytes" (firmas hexadecimales que identifican el inicio de cada tipo de archivo). Cuando encuentra una firma conocida, extrae el fragmento y te lo permite descargar.',
        'Tipos de Archivos Detectados por sus Firmas Hexadecimales',
        ['JPEG (FF D8 FF) — Imágenes fotográficas', 'PNG (89 50 4E 47) — Gráficos y transparencias', 'GIF (47 49 46 38) — Animaciones', 'PDF (%PDF-) — Documentos', 'ZIP / Office (PK) — Archivos comprimidos', 'MP3 / WAV — Audio'],
        '¿Por qué es más seguro que otras soluciones online?',
        ['Todo el procesamiento ocurre en tu memoria RAM local. Tus bytes nunca viajan por la red, lo que es esencial cuando el volcado de memoria puede contener contraseñas en texto claro o datos sensibles de red.', 'A diferencia de herramientas de escritorio como Foremost o Photorec, no necesitas instalar nada ni abrir una terminal.']
    ),
    en: makeContent(
        'Data Carving (or File Carving) is a forensic technique that extracts files and data from storage media without relying on the file system.',
        'This tool reads your file at the binary level inside your browser, searching for "Magic Bytes" (hexadecimal signatures identifying the start of each file type). When a known signature is found, it extracts the fragment and lets you download it.',
        'Detected File Types and Their Hex Signatures',
        ['JPEG (FF D8 FF) — Photographic images', 'PNG (89 50 4E 47) — Graphics and transparency', 'GIF (47 49 46 38) — Animations', 'PDF (%PDF-) — Documents', 'ZIP / Office (PK) — Compressed archives', 'MP3 / WAV — Audio'],
        'Why is it safer than other online solutions?',
        ['All processing happens in your local RAM. Your bytes never travel over the network — essential when a memory dump may contain cleartext passwords or sensitive network data.', 'Unlike desktop tools like Foremost or Photorec, no installation or terminal required.']
    ),
    fr: makeContent(
        'Le Data Carving est une technique forensique qui extrait des fichiers depuis des supports de stockage sans dépendre du système de fichiers.',
        'Cet outil lit votre fichier au niveau binaire dans votre navigateur, cherchant des "Magic Bytes" (signatures hexadécimales identifiant le début de chaque type de fichier).',
        'Types de fichiers détectés',
        ['JPEG (FF D8 FF) — Images photographiques', 'PNG (89 50 4E 47) — Graphiques', 'PDF (%PDF-) — Documents', 'ZIP / Office (PK) — Archives compressées', 'MP3 / WAV — Audio'],
        'Pourquoi est-ce plus sûr?',
        ['Tout le traitement se fait dans votre RAM locale. Vos données ne voyagent jamais sur le réseau.']
    ),
    de: makeContent(
        'Data Carving ist eine forensische Technik, die Dateien aus Speichermedien extrahiert, ohne auf das Dateisystem angewiesen zu sein.',
        'Dieses Werkzeug liest Ihre Datei auf binärer Ebene in Ihrem Browser und sucht nach "Magic Bytes" (hexadezimale Signaturen, die den Anfang jeden Dateityps kennzeichnen).',
        'Unterstützte Dateitypen',
        ['JPEG (FF D8 FF) — Fotos', 'PNG (89 50 4E 47) — Grafiken', 'PDF (%PDF-) — Dokumente', 'ZIP (PK) — Archive', 'MP3 / WAV — Audio'],
        'Warum ist das sicherer?',
        ['Die gesamte Verarbeitung erfolgt im lokalen RAM. Ihre Bytes reisen nie über das Netzwerk.']
    ),
    it: makeContent(
        'Il Data Carving è una tecnica forensica che estrae file da supporti di archiviazione senza dipendere dal file system.',
        'Questo strumento legge il tuo file a livello binario nel tuo browser, cercando "Magic Bytes" (firme esadecimali che identificano l\'inizio di ogni tipo di file).',
        'Tipi di File Rilevati',
        ['JPEG (FF D8 FF) — Immagini', 'PNG (89 50 4E 47) — Grafica', 'PDF (%PDF-) — Documenti', 'ZIP (PK) — Archivi', 'MP3 / WAV — Audio'],
        'Perché è più sicuro?',
        ['Tutta l\'elaborazione avviene nella RAM locale. I tuoi byte non viaggiano mai sulla rete.']
    ),
    pt: makeContent(
        'Data Carving é uma técnica forense que extrai arquivos de mídias de armazenamento sem depender do sistema de arquivos.',
        'Esta ferramenta lê seu arquivo em nível binário no seu navegador, procurando "Magic Bytes" (assinaturas hexadecimais que identificam o início de cada tipo de arquivo).',
        'Tipos de Arquivos Detectados',
        ['JPEG (FF D8 FF) — Imagens fotográficas', 'PNG (89 50 4E 47) — Gráficos', 'PDF (%PDF-) — Documentos', 'ZIP (PK) — Arquivos comprimidos', 'MP3 / WAV — Áudio'],
        'Por que é mais seguro?',
        ['Todo o processamento ocorre na RAM local. Seus bytes nunca viajam pela rede.']
    )
}

// ─── HEX DIFF CONTENT ─────────────────────────────────────────────────────

const hexContent = {
    es: makeContent(
        'En ciberseguridad, análisis de malware e ingeniería inversa, comparar dos archivos binarios para ver los "deltas" o cambios es algo del día a día.',
        'Los desarrolladores parchean ejecutables cambiando un simple salto condicional (JZ por JNZ) y necesitan verificar que ningún otro byte fue modificado. Esta herramienta miniaturiza esa capacidad en el navegador.',
        'Casos de Uso Comunes',
        ['Análisis estático de Malware — Comparar binario limpio vs infectado', 'Ingeniería inversa de protocolos propietarios', 'Validación de parches de software', 'Comparar archivos de guardado de videojuegos', 'Validación de corrupción por ransomware'],
        '¿Cómo interpretar los colores?',
        ['Gris indica bytes idénticos entre ambos archivos.', 'Rojo en la columna A resalta bytes que difieren en ese offset.', 'Cian en la columna B muestra el nuevo byte que sobreescribe al original.']
    ),
    en: makeContent(
        'In cybersecurity, malware analysis, and reverse engineering, comparing two binary files to spot "deltas" or changes is a daily task.',
        'Developers patch executables by changing a simple conditional jump (JZ to JNZ) and need to verify no other byte was accidentally modified. This tool miniaturizes that capability into the browser.',
        'Common Use Cases',
        ['Static Malware Analysis — Clean vs Infected binary comparison', 'Reverse engineering proprietary protocols', 'Software patch validation', 'Comparing video game save files', 'Ransomware corruption validation'],
        'How to interpret the colors?',
        ['Grey indicates identical bytes between both files.', 'Red in column A highlights bytes that differ at that offset.', 'Cyan in column B shows the new byte overwriting the original.']
    ),
    fr: makeContent(
        'En cybersécurité, analyse de malware et rétro-ingénierie, comparer deux fichiers binaires pour repérer des "deltas" est une tâche quotidienne.',
        'Cet outil miniaturise cette capacité dans le navigateur, sans installation nécessaire.',
        'Cas d\'usage courants',
        ['Analyse statique de Malware', 'Rétro-ingénierie de protocoles', 'Validation de correctifs logiciels', 'Comparaison de sauvegardes de jeux'],
        'Comment interpréter les couleurs?',
        ['Gris = octets identiques. Rouge = différence dans fichier A. Cyan = nouvelle valeur dans fichier B.']
    ),
    de: makeContent(
        'In der Cybersicherheit, Malware-Analyse und Reverse Engineering ist der Vergleich zweier Binärdateien zur Erkennung von Deltas eine tägliche Aufgabe.',
        'Dieses Tool minimiert diese Fähigkeit im Browser ohne Installation.',
        'Häufige Anwendungsfälle',
        ['Statische Malware-Analyse', 'Reverse Engineering von Protokollen', 'Software-Patch-Validierung', 'Vergleich von Spielständen'],
        'Wie werden die Farben interpretiert?',
        ['Grau = identische Bytes. Rot = Unterschied in Datei A. Cyan = neuer Wert in Datei B.']
    ),
    it: makeContent(
        'In cybersecurity, analisi malware e reverse engineering, confrontare due file binari per individuare i "delta" è un\'attività quotidiana.',
        'Questo strumento miniaturizza questa capacità nel browser senza installazione.',
        'Casi d\'uso comuni',
        ['Analisi statica di Malware', 'Reverse engineering di protocolli', 'Validazione di patch software', 'Confronto di salvataggi di giochi'],
        'Come interpretare i colori?',
        ['Grigio = byte identici. Rosso = differenza nel file A. Ciano = nuovo valore nel file B.']
    ),
    pt: makeContent(
        'Em cibersegurança, análise de malware e engenharia reversa, comparar dois arquivos binários para encontrar os "deltas" é uma tarefa diária.',
        'Esta ferramenta miniaturiza essa capacidade no navegador sem instalação.',
        'Casos de uso comuns',
        ['Análise estática de Malware', 'Engenharia reversa de protocolos', 'Validação de patches de software', 'Comparação de arquivos de salvamento de jogos'],
        'Como interpretar as cores?',
        ['Cinza = bytes idênticos. Vermelho = diferença no arquivo A. Ciano = novo valor no arquivo B.']
    )
}

// ─── PER-LOCALE DATA ──────────────────────────────────────────────────────

const carverLocales: Record<string, any> = {
    es: {
        title: 'File Carver',
        badge: 'Herramienta Forense',
        shortDescription: 'Extrae archivos ocultos (JPEG, PNG, PDF, ZIP) de volcados corruptos. 100% privado, sin servidores, funciona en tu navegador.',
        steps: [
            { stepTitle: 'Sube tu Archivo Corrupto', stepDescription: 'Arrastra o selecciona un volcado RAW, ZIP roto o imagen de disco.', stepIcon: 'upload' },
            { stepTitle: 'Extracción por Magic Bytes', stepDescription: 'El motor escanea localmente buscando firmas hexadecimales conocidas.', stepIcon: 'zap' },
            { stepTitle: 'Descarga Inmediata', stepDescription: 'Revisa los archivos recuperados y descárgalos con un clic.', stepIcon: 'download' }
        ],
        content: carverContent.es,
        faqs: [
            { question: '¿Hay límite de tamaño de archivo?', answer: 'El límite práctico es la memoria RAM de tu navegador (aprox. 2 GB por pestaña). Es ideal para volcados de tamaño medio.' },
            { question: '¿Mis archivos se suben a algún servidor?', answer: 'No. El análisis ocurre 100% de forma local en tu RAM. Puedes incluso desconectar internet después de cargar la página.' },
            { question: '¿Qué pasa si el archivo está muy fragmentado?', answer: 'Esta herramienta aplica Linear Carving asumiendo contigüidad binaria. Si el archivo original estaba muy fragmentado en el disco, el resultado puede mostrar corrupción visual.' },
            { question: '¿Puedo añadir mis propias firmas HEX personalizadas?', answer: 'Actualmente detectamos los formatos más comunes. Para motores personalizados con expresiones regulares binarias, contacta con nuestro equipo de ingeniería.' }
        ],
        ctaTitle: '¿Desarrollamos Software Forense a Medida?',
        ctaDescription: 'En OHCodex Ingeniería somos expertos en el cruce entre la web y el bajo nivel. Si tu empresa de ciberseguridad necesita software interno o arquitecturas Cloud, podemos ayudarte.',
        metaTitle: 'Herramienta File Carver Gratis (Client-Side) | Forense Digital - OHCodex',
        metaDescription: 'Recupera archivos de discos corruptos o volcados RAW directamente en tu navegador. Herramienta forense gratuita, sin límites y totalmente privada.'
    },
    en: {
        title: 'File Carver',
        badge: 'Forensic Tool',
        shortDescription: 'Extract hidden files (JPEG, PNG, PDF, ZIP) from corrupted disk dumps. 100% private, serverless, runs entirely in your browser.',
        steps: [
            { stepTitle: 'Upload Corrupted File', stepDescription: 'Drag or select a RAW dump, broken ZIP, or disk image.', stepIcon: 'upload' },
            { stepTitle: 'Magic Bytes Extraction', stepDescription: 'The engine scans locally for known hexadecimal file signatures.', stepIcon: 'zap' },
            { stepTitle: 'Instant Download', stepDescription: 'Review recovered files and download them with one click.', stepIcon: 'download' }
        ],
        content: carverContent.en,
        faqs: [
            { question: 'Is there a file size limit?', answer: 'Practical limit is your browser RAM (~2 GB per tab). Ideal for medium-sized dumps.' },
            { question: 'Are my files uploaded to any server?', answer: 'No. Analysis is 100% local in your RAM. You can even disconnect the internet after loading the page.' },
            { question: 'What if the file is heavily fragmented?', answer: 'This tool uses Linear Carving, assuming binary contiguity. If the original file was fragmented across many disc sectors, the extracted output may show partial corruption.' },
            { question: 'Can I add custom HEX signatures?', answer: 'We currently detect the most common formats. For custom binary regex engines, contact our engineering team.' }
        ],
        ctaTitle: 'Need Custom Forensic Software?',
        ctaDescription: 'At OHCodex Engineering we specialize at the intersection of web and low-level. If your cybersecurity company needs internal software or Cloud architectures, we can help.',
        metaTitle: 'Free Client-Side File Carver Tool | Digital Forensics - OHCodex',
        metaDescription: 'Recover files from corrupted disks or RAW dumps directly in your browser. Free forensic tool, no limits, totally private and serverless.'
    },
    fr: {
        title: 'File Carver',
        badge: 'Outil Forensique',
        shortDescription: 'Extrayez des fichiers cachés (JPEG, PNG, PDF, ZIP) depuis des dumps de disques corrompus. 100% privé, sans serveur, dans votre navigateur.',
        steps: [
            { stepTitle: 'Téléversez votre fichier corrompu', stepDescription: 'Glissez ou sélectionnez un dump RAW, ZIP cassé ou image disque.', stepIcon: 'upload' },
            { stepTitle: 'Extraction Magic Bytes', stepDescription: 'Le moteur scanne localement les signatures hexadécimales connues.', stepIcon: 'zap' },
            { stepTitle: 'Téléchargement immédiat', stepDescription: 'Consultez les fichiers récupérés et téléchargez-les en un clic.', stepIcon: 'download' }
        ],
        content: carverContent.fr,
        faqs: [
            { question: 'Y a-t-il une limite de taille de fichier?', answer: 'La limite pratique est la RAM de votre navigateur (~2 Go par onglet).' },
            { question: 'Mes fichiers sont-ils téléversés sur un serveur?', answer: 'Non. L\'analyse est 100% locale dans votre RAM.' },
            { question: 'Et si le fichier est très fragmenté?', answer: 'Cet outil utilise le Linear Carving en supposant une contiguïté binaire.' }
        ],
        ctaTitle: 'Besoin d\'un logiciel forensique sur mesure?',
        ctaDescription: 'Chez OHCodex Engineering, nous sommes experts à l\'intersection du web et du bas niveau. Contactez-nous pour votre prochain projet.',
        metaTitle: 'Outil File Carver Gratuit (Client-Side) | Forensique Numérique - OHCodex',
        metaDescription: 'Récupérez des fichiers depuis des disques corrompus ou dumps RAW dans votre navigateur. Outil forensique gratuit, sans limites et totalement privé.'
    },
    de: {
        title: 'File Carver',
        badge: 'Forensisches Werkzeug',
        shortDescription: 'Extrahieren Sie versteckte Dateien (JPEG, PNG, PDF, ZIP) aus beschädigten Speicherabbildern. 100% privat, ohne Server, direkt im Browser.',
        steps: [
            { stepTitle: 'Laden Sie Ihre beschädigte Datei hoch', stepDescription: 'Ziehen oder wählen Sie ein RAW-Abbild, defektes ZIP oder Disk-Image.', stepIcon: 'upload' },
            { stepTitle: 'Magic Bytes Extraktion', stepDescription: 'Die Engine sucht lokal nach bekannten hexadezimalen Dateisignaturen.', stepIcon: 'zap' },
            { stepTitle: 'Sofortiger Download', stepDescription: 'Überprüfen Sie wiederhergestellte Dateien und laden Sie sie herunter.', stepIcon: 'download' }
        ],
        content: carverContent.de,
        faqs: [
            { question: 'Gibt es eine Dateigrößenbeschränkung?', answer: 'Die praktische Grenze ist der RAM Ihres Browsers (~2 GB pro Tab).' },
            { question: 'Werden meine Dateien auf einen Server hochgeladen?', answer: 'Nein. Die Analyse erfolgt zu 100% lokal in Ihrem RAM.' },
            { question: 'Was passiert bei stark fragmentierten Dateien?', answer: 'Dieses Tool verwendet Linear Carving und geht von binärer Kontinuität aus.' }
        ],
        ctaTitle: 'Maßgeschneiderte forensische Software?',
        ctaDescription: 'Bei OHCodex Engineering sind wir Experten an der Schnittstelle von Web und Low-Level. Kontaktieren Sie uns für Ihr nächstes Projekt.',
        metaTitle: 'Kostenloses Client-Side File Carver Tool | Digitale Forensik - OHCodex',
        metaDescription: 'Dateien aus beschädigten Datenträgern oder RAW-Abbildern direkt im Browser wiederherstellen. Kostenloses forensisches Tool, ohne Limits und vollständig privat.'
    },
    it: {
        title: 'File Carver',
        badge: 'Strumento Forense',
        shortDescription: 'Estrai file nascosti (JPEG, PNG, PDF, ZIP) da dump di dischi corrotti. 100% privato, senza server, direttamente nel tuo browser.',
        steps: [
            { stepTitle: 'Carica il tuo file corrotto', stepDescription: 'Trascina o seleziona un dump RAW, ZIP rotto o immagine disco.', stepIcon: 'upload' },
            { stepTitle: 'Estrazione Magic Bytes', stepDescription: 'Il motore scansiona localmente le firme esadecimali note.', stepIcon: 'zap' },
            { stepTitle: 'Download immediato', stepDescription: 'Esamina i file recuperati e scaricali con un click.', stepIcon: 'download' }
        ],
        content: carverContent.it,
        faqs: [
            { question: 'Esiste un limite di dimensione del file?', answer: 'Il limite pratico è la RAM del tuo browser (~2 GB per scheda).' },
            { question: 'I miei file vengono caricati su un server?', answer: 'No. L\'analisi è al 100% locale nella tua RAM.' },
            { question: 'Cosa succede se il file è molto frammentato?', answer: 'Questo strumento usa il Linear Carving assumendo contiguità binaria.' }
        ],
        ctaTitle: 'Software forensico su misura?',
        ctaDescription: 'In OHCodex Engineering siamo esperti all\'incrocio tra web e basso livello. Contattaci per il tuo prossimo progetto.',
        metaTitle: 'Strumento File Carver Gratuito (Client-Side) | Forense Digitale - OHCodex',
        metaDescription: 'Recupera file da dischi corrotti o dump RAW direttamente nel tuo browser. Strumento forense gratuito, senza limiti e totalmente privato.'
    },
    pt: {
        title: 'File Carver',
        badge: 'Ferramenta Forense',
        shortDescription: 'Extraia arquivos ocultos (JPEG, PNG, PDF, ZIP) de dumps de discos corrompidos. 100% privado, sem servidores, direto no seu navegador.',
        steps: [
            { stepTitle: 'Carregue seu arquivo corrompido', stepDescription: 'Arraste ou selecione um dump RAW, ZIP corrompido ou imagem de disco.', stepIcon: 'upload' },
            { stepTitle: 'Extração Magic Bytes', stepDescription: 'O motor varre localmente as assinaturas hexadecimais conhecidas.', stepIcon: 'zap' },
            { stepTitle: 'Download Imediato', stepDescription: 'Verifique os arquivos recuperados e baixe-os com um clique.', stepIcon: 'download' }
        ],
        content: carverContent.pt,
        faqs: [
            { question: 'Há um limite de tamanho de arquivo?', answer: 'O limite prático é a RAM do seu navegador (~2 GB por aba).' },
            { question: 'Meus arquivos são enviados para um servidor?', answer: 'Não. A análise é 100% local na sua RAM.' },
            { question: 'O que acontece se o arquivo estiver muito fragmentado?', answer: 'Esta ferramenta usa Linear Carving, assumindo contiguidade binária.' }
        ],
        ctaTitle: 'Software forense personalizado?',
        ctaDescription: 'Na OHCodex Engineering somos especialistas na interseção entre web e baixo nível. Entre em contato para seu próximo projeto.',
        metaTitle: 'Ferramenta File Carver Gratuita (Client-Side) | Forense Digital - OHCodex',
        metaDescription: 'Recupere arquivos de discos corrompidos ou dumps RAW diretamente no seu navegador. Ferramenta forense gratuita, sem limites e totalmente privada.'
    }
}

const hexLocales: Record<string, any> = {
    es: {
        title: 'Hex Binary Diff',
        badge: 'Reversing Tool',
        shortDescription: 'Compara dos archivos binarios byte a byte en tu navegador. Visualización HEX/ASCII en dos columnas. Ideal para análisis de malware e ingeniería inversa.',
        steps: [
            { stepTitle: 'Selecciona Archivo Base', stepDescription: 'Sube el archivo original que servirá de referencia.', stepIcon: 'upload' },
            { stepTitle: 'Selecciona Archivo Modificado', stepDescription: 'Sube el archivo parcheado, infectado o editado.', stepIcon: 'upload' },
            { stepTitle: 'Compara Byte a Byte', stepDescription: 'Inspecciona las diferencias marcadas en rojo y cian alineadas en columnas.', stepIcon: 'zap' }
        ],
        content: hexContent.es,
        faqs: [
            { question: '¿Es seguro analizar malware o ejecutables reales con esta herramienta?', answer: 'Sí, completamente seguro. El navegador usa Sandboxing. Solo lees el archivo como un ArrayBuffer estático para pintarlo en pantalla; el malware no puede ejecutarse, y los datos nunca salen de tu ordenador.' },
            { question: '¿Por qué no puedo comparar archivos de 500 MB?', answer: 'Esta herramienta está diseñada para diffs rápidos de secciones localizadas (análisis de parches, archivos de configuración, guardados de juegos). Para binarios enteros de OS, usa soluciones especializadas de consola.' },
            { question: '¿Qué significan exactamente los colores?', answer: 'Gris = bytes idénticos. Rojo en la columna A = byte diferente en ese offset. Cian en la columna B = nuevo byte que sobreescribe al original.' },
            { question: '¿Puedo comparar archivos de texto además de binarios?', answer: 'Sí. Cualquier archivo (texto, binario, ejecutable) puede subirse. El visor mostrará tanto su codificación HEX como la representación ASCII correspondiente.' }
        ],
        ctaTitle: 'Construimos Software de Alto Nivel',
        ctaDescription: 'En OHCodex Ingeniería desarrollamos plataformas SaaS interactivas y arquitecturas Cloud avanzadas. Confía en la excelencia técnica para tu próximo proyecto Enterprise.',
        metaTitle: 'Comparador Hex/Binary Diff Tool Gratis - Análisis de Binarios - OHCodex',
        metaDescription: 'Compara dos archivos binarios byte a byte en el navegador. Visualización HEX/ASCII alineada. Ideal para ingeniería inversa y análisis de malware.'
    },
    en: {
        title: 'Hex Binary Diff',
        badge: 'Reversing Tool',
        shortDescription: 'Compare two binary files byte by byte in your browser. Dual HEX/ASCII pane visualization. Ideal for malware analysis and reverse engineering.',
        steps: [
            { stepTitle: 'Select Base File', stepDescription: 'Upload the original file as reference.', stepIcon: 'upload' },
            { stepTitle: 'Select Modified File', stepDescription: 'Upload the patched, infected or edited file.', stepIcon: 'upload' },
            { stepTitle: 'Byte-Level Compare', stepDescription: 'Inspect differences highlighted in red and cyan, aligned in columns.', stepIcon: 'zap' }
        ],
        content: hexContent.en,
        faqs: [
            { question: 'Is it safe to analyze actual malware or executables?', answer: 'Yes, completely safe. The browser uses Sandboxing. You only read the file as a static ArrayBuffer to paint pixels; malware cannot execute, and data never leaves your computer.' },
            { question: 'Why can\'t I compare 500 MB files?', answer: 'This tool is designed for rapid diffs of localized sections (patch analysis, config files, game saves). For full OS binaries, use specialized CLI solutions.' },
            { question: 'What exactly do the colors mean?', answer: 'Grey = identical bytes. Red in column A = differing byte at that offset. Cyan in column B = the new byte overwriting the original.' },
            { question: 'Can I compare text files as well as binaries?', answer: 'Yes. Any file (text, binary, executable) can be uploaded. The viewer shows both HEX encoding and ASCII representation.' }
        ],
        ctaTitle: 'We Build High-End Software',
        ctaDescription: 'At OHCodex Engineering we develop interactive SaaS platforms and advanced Cloud architectures. Trust technical excellence for your next Enterprise project.',
        metaTitle: 'Free Hex/Binary Diff Compare Tool - Binary Analysis - OHCodex',
        metaDescription: 'Compare two binary files byte by byte in the browser. Aligned HEX/ASCII visualization. Ideal for reverse engineering and malware analysis.'
    },
    fr: {
        title: 'Hex Binary Diff',
        badge: 'Outil de Reversing',
        shortDescription: 'Comparez deux fichiers binaires octet par octet dans votre navigateur. Visualisation HEX/ASCII sur deux colonnes.',
        steps: [
            { stepTitle: 'Sélectionnez le fichier de base', stepDescription: 'Chargez le fichier original comme référence.', stepIcon: 'upload' },
            { stepTitle: 'Sélectionnez le fichier modifié', stepDescription: 'Chargez le fichier patché, infecté ou édité.', stepIcon: 'upload' },
            { stepTitle: 'Comparez octet par octet', stepDescription: 'Inspectez les différences en rouge et cyan.', stepIcon: 'zap' }
        ],
        content: hexContent.fr,
        faqs: [
            { question: 'Est-il sûr d\'analyser des malwares?', answer: 'Oui, le navigateur utilise un Sandboxing. Les données ne quittent jamais votre ordinateur.' },
            { question: 'Pourquoi ne puis-je pas comparer des fichiers de 500 Mo?', answer: 'Cet outil est conçu pour des diffs rapides de sections localisées.' }
        ],
        ctaTitle: 'Nous développons des logiciels de haut niveau',
        ctaDescription: 'Chez OHCodex Engineering, nous développons des plateformes SaaS interactives. Faites confiance à l\'excellence technique.',
        metaTitle: 'Outil Hex Diff Gratuit - Comparaison de Binaires - OHCodex',
        metaDescription: 'Comparez deux fichiers binaires octet par octet dans le navigateur. Visualisation HEX/ASCII alignée pour l\'analyse de malware et la rétro-ingénierie.'
    },
    de: {
        title: 'Hexadezimal Binary Diff',
        badge: 'Reversing-Werkzeug',
        shortDescription: 'Vergleichen Sie zwei Binärdateien byteweise in Ihrem Browser. Dual HEX/ASCII-Fenstervisualisierung. Ideal für Malware-Analyse und Reverse Engineering.',
        steps: [
            { stepTitle: 'Basis-Datei auswählen', stepDescription: 'Laden Sie die Originaldatei als Referenz hoch.', stepIcon: 'upload' },
            { stepTitle: 'Geänderte Datei auswählen', stepDescription: 'Laden Sie die gepatchte, infizierte oder bearbeitete Datei hoch.', stepIcon: 'upload' },
            { stepTitle: 'Byteweiser Vergleich', stepDescription: 'Inspizieren Sie in Rot und Cyan hervorgehobene Unterschiede.', stepIcon: 'zap' }
        ],
        content: hexContent.de,
        faqs: [
            { question: 'Ist die Analyse von Malware sicher?', answer: 'Ja, der Browser verwendet Sandboxing. Die Daten verlassen Ihren Computer nicht.' },
            { question: 'Warum kann ich keine 500-MB-Dateien vergleichen?', answer: 'Das Tool ist für schnelle Diffs lokalisierter Abschnitte konzipiert.' }
        ],
        ctaTitle: 'Wir entwickeln hochwertige Software',
        ctaDescription: 'Bei OHCodex Engineering entwickeln wir interaktive SaaS-Plattformen und fortschrittliche Cloud-Architekturen.',
        metaTitle: 'Kostenloses Hex/Binary Diff Tool - Binäranalyse - OHCodex',
        metaDescription: 'Zwei Binärdateien byteweise im Browser vergleichen. Ausgerichtete HEX/ASCII-Visualisierung für Reverse Engineering und Malware-Analyse.'
    },
    it: {
        title: 'Hex Binary Diff',
        badge: 'Strumento di Reversing',
        shortDescription: 'Confronta due file binari byte per byte nel tuo browser. Visualizzazione HEX/ASCII su due colonne. Ideale per analisi malware e reverse engineering.',
        steps: [
            { stepTitle: 'Seleziona il file base', stepDescription: 'Carica il file originale come riferimento.', stepIcon: 'upload' },
            { stepTitle: 'Seleziona il file modificato', stepDescription: 'Carica il file patchato, infetto o modificato.', stepIcon: 'upload' },
            { stepTitle: 'Confronto byte per byte', stepDescription: 'Esamina le differenze evidenziate in rosso e ciano.', stepIcon: 'zap' }
        ],
        content: hexContent.it,
        faqs: [
            { question: 'È sicuro analizzare malware reali?', answer: 'Sì, il browser usa Sandboxing. I dati non lasciano mai il tuo computer.' },
            { question: 'Perché non posso confrontare file da 500 MB?', answer: 'Lo strumento è progettato per diff rapidi di sezioni localizzate.' }
        ],
        ctaTitle: 'Costruiamo software di alto livello',
        ctaDescription: 'In OHCodex Engineering sviluppiamo piattaforme SaaS interattive e architetture Cloud avanzate.',
        metaTitle: 'Strumento Hex Diff Gratuito - Analisi Binaria - OHCodex',
        metaDescription: 'Confronta due file binari byte per byte nel browser. Visualizzazione HEX/ASCII allineata. Ideale per reverse engineering e analisi malware.'
    },
    pt: {
        title: 'Hex Binary Diff',
        badge: 'Ferramenta de Reversing',
        shortDescription: 'Compare dois arquivos binários byte a byte no seu navegador. Visualização HEX/ASCII em dois painéis. Ideal para análise de malware e engenharia reversa.',
        steps: [
            { stepTitle: 'Selecione o arquivo base', stepDescription: 'Carregue o arquivo original como referência.', stepIcon: 'upload' },
            { stepTitle: 'Selecione o arquivo modificado', stepDescription: 'Carregue o arquivo corrigido, infectado ou editado.', stepIcon: 'upload' },
            { stepTitle: 'Compare byte a byte', stepDescription: 'Inspecione as diferenças destacadas em vermelho e ciano.', stepIcon: 'zap' }
        ],
        content: hexContent.pt,
        faqs: [
            { question: 'É seguro analisar malware real?', answer: 'Sim, o navegador usa Sandboxing. Os dados nunca saem do seu computador.' },
            { question: 'Por que não posso comparar arquivos de 500 MB?', answer: 'A ferramenta é projetada para diffs rápidos de seções localizadas.' }
        ],
        ctaTitle: 'Desenvolvemos software de alto nível',
        ctaDescription: 'Na OHCodex Engineering desenvolvemos plataformas SaaS interativas e arquiteturas Cloud avançadas.',
        metaTitle: 'Ferramenta Hex Diff Gratuita - Análise de Binários - OHCodex',
        metaDescription: 'Compare dois arquivos binários byte a byte no navegador. Visualização HEX/ASCII alinhada. Ideal para engenharia reversa e análise de malware.'
    }
}

// ─── MAIN ─────────────────────────────────────────────────────────────────

async function run() {
    try {
        const payload = await getPayload({ config: configPromise })
        const langs = ['es', 'en', 'fr', 'de', 'it', 'pt']

        // ── FILE CARVER ──────────────────────────
        console.log('=== Seeding FILE CARVER ===')
        const carverQ = await payload.find({ collection: 'tools', where: { slug: { equals: 'file-carver' } } })
        if (carverQ.totalDocs === 0) { console.error('file-carver not found in DB'); process.exit(1) }
        const carverId = carverQ.docs[0].id

        // Non-localized fields first (only need one update)
        await payload.update({ collection: 'tools', id: carverId, data: { slug: 'file-carver', codeKey: 'file-carver', icon: 'dna', ctaLink: '/#contacto' } as any })

        for (const lang of langs) {
            const d = carverLocales[lang]
            console.log(`  > Updating locale: ${lang}`)
            await payload.update({ collection: 'tools', id: carverId, locale: lang as any, data: d as any })
        }

        // ── HEX DIFF ─────────────────────────────
        console.log('=== Seeding HEX DIFF ===')
        const hexQ = await payload.find({ collection: 'tools', where: { slug: { equals: 'hex-diff' } } })
        if (hexQ.totalDocs === 0) { console.error('hex-diff not found in DB'); process.exit(1) }
        const hexId = hexQ.docs[0].id

        await payload.update({ collection: 'tools', id: hexId, data: { slug: 'hex-diff', codeKey: 'hex-diff', icon: 'split-square-horizontal', ctaLink: '/#contacto' } as any })

        for (const lang of langs) {
            const d = hexLocales[lang]
            console.log(`  > Updating locale: ${lang}`)
            await payload.update({ collection: 'tools', id: hexId, locale: lang as any, data: d as any })
        }

        console.log('=== Seed COMPLETE ===')
        process.exit(0)
    } catch (error: any) {
        console.error('Error:')
        if (error?.data?.errors) {
            console.error(JSON.stringify(error.data.errors, null, 2))
        } else {
            console.error(error)
        }
        process.exit(1)
    }
}

run()
