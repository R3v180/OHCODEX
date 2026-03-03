import { getPayload } from 'payload'
import configPromise from '../src/payload.config'
import * as dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env') })

async function run() {
    const logFile = 'standardize-locales.log'
    fs.writeFileSync(logFile, `--- STANDARDIZATION START --- ${new Date().toISOString()}\n`)

    try {
        const payload = await getPayload({ config: configPromise })
        const q = await payload.find({ collection: 'tools', where: { slug: { equals: 'hex-diff' } } })

        if (q.totalDocs === 0) {
            fs.appendFileSync(logFile, 'ERROR: hex-diff not found\n')
            process.exit(1)
        }

        const toolId = q.docs[0].id
        fs.appendFileSync(logFile, `Found tool ID: ${toolId}\n`)

        const sharedContent = (title: string, h2_1: string, p1: string, h2_2: string, li1: string, li2: string, li3: string) => ({
            root: {
                children: [
                    { type: 'heading', tag: 'h2', version: 1, children: [{ text: h2_1, version: 1 }] },
                    { type: 'paragraph', version: 1, children: [{ text: p1, version: 1 }] },
                    { type: 'heading', tag: 'h2', version: 1, children: [{ text: h2_2, version: 1 }] },
                    {
                        type: 'list', listType: 'bullet', version: 1, children: [
                            { type: 'listitem', value: 1, children: [{ text: li1, version: 1 }] },
                            { type: 'listitem', value: 2, children: [{ text: li2, version: 1 }] },
                            { type: 'listitem', value: 3, children: [{ text: li3, version: 1 }] }
                        ]
                    }
                ],
                direction: 'ltr', format: '', indent: 0, type: 'root', version: 1
            }
        })

        const data: Record<string, any> = {
            es: {
                title: 'Hex Binary Diff',
                badge: 'Análisis Binario',
                shortDescription: 'Compara dos archivos byte a byte para detectar diferencias exactas en formato hexadecimal y ASCII de forma instantánea.',
                metaTitle: 'Herramienta Hex Binary Diff Online - Comparador Binario Gratis - OHCodex',
                metaDescription: 'Compara dos archivos binarios en tiempo real desde tu navegador. Visualización HEX y ASCII con resaltado profesional. 100% privado y seguro.',
                steps: [
                    { stepTitle: 'Cargar Archivo A', stepDescription: 'Sube la versión original o el primer archivo binario.', stepIcon: 'upload' },
                    { stepTitle: 'Cargar Archivo B', stepDescription: 'Sube la versión modificada para detectar cambios.', stepIcon: 'upload' },
                    { stepTitle: 'Analizar Diffs', stepDescription: 'Observa las diferencias resaltadas en hexadecimal y ASCII.', stepIcon: 'zap' }
                ],
                faqs: [
                    { question: '¿Es seguro analizar archivos confidenciales?', answer: 'Sí. El proceso es 100% local en tu navegador. Tus archivos nunca se suben a ningún servidor.' },
                    { question: '¿Para qué sirve un comparador hexadecimal?', answer: 'Para detectar cambios mínimos en binarios, realizar ingeniería inversa o depurar archivos dañados.' },
                    { question: '¿Qué significan los colores?', answer: 'El rojo indica datos del Archivo A, mientras que el cian resalta los cambios en el Archivo B.' },
                    { question: '¿Existe un límite de tamaño de archivo?', answer: 'Actualmente analizamos los primeros 16KB para garantizar una respuesta instantánea en el navegador.' }
                ],
                content: sharedContent(
                    'Hex Binary Diff',
                    '¿Qué es la Comparación Binaria (Hex Diff)?',
                    'Es el análisis de diferencias entre dos archivos a nivel de bytes. Permite ver cambios en formatos no legibles por humanos.',
                    'Casos de Uso Principales',
                    'Ingeniería Inversa: Identificar parches en binarios.',
                    'Análisis Forense: Detectar metadatos ocultos.',
                    'Depuración: Comparar bases de datos dañadas.'
                )
            },
            en: {
                title: 'Hex Binary Diff',
                badge: 'Binary Analysis',
                shortDescription: 'Compare two files byte by byte to detect exact differences in hexadecimal and ASCII formats instantly.',
                metaTitle: 'Online Hex Binary Diff Tool - Free Binary Comparator - OHCodex',
                metaDescription: 'Compare two binary files in real-time from your browser. Professional HEX and ASCII visualization. 100% private and secure.',
                steps: [
                    { stepTitle: 'Load File A', stepDescription: 'Upload the original version or the first binary file.', stepIcon: 'upload' },
                    { stepTitle: 'Load File B', stepDescription: 'Upload the modified version to detect changes.', stepIcon: 'upload' },
                    { stepTitle: 'Analyze Diffs', stepDescription: 'Observe highlighted differences in hex and ASCII.', stepIcon: 'zap' }
                ],
                faqs: [
                    { question: 'Is it safe to analyze confidential files?', answer: 'Yes. Process is 100% local in your browser. No files are uploaded to our servers.' },
                    { question: 'What is a hex comparator used for?', answer: 'Detecting changes in binaries, forensic analysis, or debugging corrupted files.' },
                    { question: 'What do the colors mean?', answer: 'Red indicates data from File A, while cyan highlights changes in File B.' },
                    { question: 'Is there a file size limit?', answer: 'We currently analyze the first 16KB to ensure an instant response in the browser.' }
                ],
                content: sharedContent(
                    'Hex Binary Diff',
                    'What is Binary Comparison (Hex Diff)?',
                    'It is the byte-level analysis of differences between two files. It allows seeing changes in non-human-readable formats.',
                    'Main Use Cases',
                    'Reverse Engineering: Identify patches in compiled binaries.',
                    'Forensic Analysis: Detect hidden metadata.',
                    'Debugging: Compare corrupted binary databases.'
                )
            },
            fr: {
                title: 'Hex Binary Diff',
                badge: 'Analyse Binaire',
                shortDescription: 'Comparez deux fichiers octet par octet pour détecter instantanément les différences exactes au format hexadécimal et ASCII.',
                metaTitle: 'Outil Hex Binary Diff en ligne - Comparateur Binaire Gratuit - OHCodex',
                metaDescription: 'Comparez deux fichiers binaires en temps réel. Visualisation HEX et ASCII avec surbrillance professionnelle. 100% privé.',
                steps: [
                    { stepTitle: 'Charger Fichier A', stepDescription: 'Téléchargez la version originale ou le premier fichier.', stepIcon: 'upload' },
                    { stepTitle: 'Charger Fichier B', stepDescription: 'Téléchargez la version modifiée pour voir les changements.', stepIcon: 'upload' },
                    { stepTitle: 'Analyser les Diffs', stepDescription: 'Observez les différences en hexadécimal et ASCII.', stepIcon: 'zap' }
                ],
                faqs: [
                    { question: 'Est-il sûr d\'analyser des fichiers confidentiels ?', answer: 'Oui. Le processus est 100% local. Aucun fichier n\'est envoyé à nos serveurs.' },
                    { question: 'À quoi sert un comparateur hexadécimal ?', answer: 'Détecter des changements minimes, analyse forensique ou débogage.' },
                    { question: 'Que signifient les couleurs ?', answer: 'Le rouge indique le Fichier A, le cyan surligne les modifications dans le Fichier B.' },
                    { question: 'Y a-t-il une limite de taille ?', answer: 'Nous analysons les premiers 16 Ko pour assurer une réponse instantanée.' }
                ],
                content: sharedContent(
                    'Hex Binary Diff',
                    'Qu\'est-ce que la comparaison binaire (Hex Diff) ?',
                    'Analyse des différences au niveau des octets entre deux fichiers. Voir les changements dans les formats non lisibles.',
                    'Principaux cas d\'utilisation',
                    'Rétro-ingénierie : Identifier les correctifs.',
                    'Analyse forensique : Détecter les métadonnées cachées.',
                    'Débogage : Comparer des fichiers corrompus.'
                )
            },
            de: {
                title: 'Hex Binary Diff',
                badge: 'Binär-Analyse',
                shortDescription: 'Vergleichen Sie zwei Dateien Byte für Byte, um exakte Unterschiede sofort zu erkennen.',
                metaTitle: 'Online Hex Binary Diff Tool - Kostenloser Binär-Vergleich - OHCodex',
                metaDescription: 'Vergleichen Sie Binärdateien in Echtzeit im Browser. HEX- und ASCII-Visualisierung. 100% privat.',
                steps: [
                    { stepTitle: 'Datei A laden', stepDescription: 'Hochladen der Originalversion.', stepIcon: 'upload' },
                    { stepTitle: 'Datei B laden', stepDescription: 'Hochladen der geänderten Version.', stepIcon: 'upload' },
                    { stepTitle: 'Dateien vergleichen', stepDescription: 'Unterschiede in Hex und ASCII betrachten.', stepIcon: 'zap' }
                ],
                faqs: [
                    { question: 'Ist die Analyse sicher?', answer: 'Ja. 100% lokal im Browser. Keine Dateien werden hochgeladen.' },
                    { question: 'Wofür wird es verwendet?', answer: 'Minimale Änderungen aufspüren, Forensik oder Debugging.' },
                    { question: 'Was bedeuten die Farben?', answer: 'Rot für Datei A, Cyan für Datei B.' },
                    { question: 'Gibt es eine Größenbeschränkung?', answer: 'Analyse der ersten 16KB für sofortige Ergebnisse.' }
                ],
                content: sharedContent(
                    'Hex Binary Diff',
                    'Was ist ein Binärvergleich (Hex Diff)?',
                    'Analyse auf Byte-Ebene. Macht Änderungen in nicht-lesbaren Formaten sichtbar.',
                    'Hauptanwendungsfälle',
                    'Reverse Engineering: Patches identifizieren.',
                    'Forensik: Metadaten aufspüren.',
                    'Debugging: Beschädigte Dateien vergleichen.'
                )
            },
            it: {
                title: 'Hex Binary Diff',
                badge: 'Analisi Binaria',
                shortDescription: 'Confronta due file byte per byte per rilevare istantaneamente le differenze esatte in esadecimale e ASCII.',
                metaTitle: 'Strumento Hex Binary Diff Online - OHCodex',
                metaDescription: 'Confronta file binari in tempo reale dal browser. Visualizzazione HEX e ASCII. 100% privato.',
                steps: [
                    { stepTitle: 'Carica File A', stepDescription: 'Carica la versione originale.', stepIcon: 'upload' },
                    { stepTitle: 'Carica File B', stepDescription: 'Carica la versione modificata.', stepIcon: 'upload' },
                    { stepTitle: 'Analizza Diff', stepDescription: 'Osserva le differenze in esadecimale e ASCII.', stepIcon: 'zap' }
                ],
                faqs: [
                    { question: 'È sicuro analizzare file riservati?', answer: 'Sì. 100% locale nel browser. Nessun file viene inviato ai server.' },
                    { question: 'A cosa serve?', answer: 'Rilevare modifiche, analisi forense o debug.' },
                    { question: 'Cosa significano i colori?', answer: 'Rosso per il File A, ciano per il File B.' },
                    { question: 'C\'è un limite di dimensione?', answer: 'Analisi dei primi 16KB per risposta istantanea.' }
                ],
                content: sharedContent(
                    'Hex Binary Diff',
                    'Cos\'è il confronto binario?',
                    'Analisi tecnica a livello di byte. Fondamentale per vedere modifiche in file complessi.',
                    'Casi d\'uso principali',
                    'Reverse Engineering: Identificare patch.',
                    'Analisi Forense: Metadati nascosti.',
                    'Debug: Confrontare database corrotti.'
                )
            },
            pt: {
                title: 'Hex Binary Diff',
                badge: 'Análise Binária',
                shortDescription: 'Compare dois arquivos byte a byte para detetar diferenças exatas instantaneamente.',
                metaTitle: 'Ferramenta Hex Binary Diff Online - OHCodex',
                metaDescription: 'Compare arquivos binários em tempo real no seu navegador. 100% privado e seguro.',
                steps: [
                    { stepTitle: 'Carregar Arquivo A', stepDescription: 'Carregue a versão original.', stepIcon: 'upload' },
                    { stepTitle: 'Carregar Arquivo B', stepDescription: 'Carregue a versão modificada.', stepIcon: 'upload' },
                    { stepTitle: 'Analisar Diffs', stepDescription: 'Veja as diferenças em hexadecimal e ASCII.', stepIcon: 'zap' }
                ],
                faqs: [
                    { question: 'É seguro analisar arquivos?', answer: 'Sim. 100% local no navegador. Nenhum arquivo sai do seu PC.' },
                    { question: 'Para que serve?', answer: 'Detetar mudanças mínimas, análise forense ou depuração.' },
                    { question: 'Significado das cores?', answer: 'Vermelho para o Arquivo A, ciano para o Arquivo B.' },
                    { question: 'Existe limite de tamanho?', answer: 'Analisamos os primeiros 16KB para garantir velocidade.' }
                ],
                content: sharedContent(
                    'Hex Binary Diff',
                    'O que é a comparação binária?',
                    'Análise técnica ao nível de bytes. Essencial para programadores e analistas.',
                    'Principais casos de uso',
                    'Engenharia Reversa: Identificar patches.',
                    'Análise Forense: Metadados ocultos.',
                    'Depuração: Comparar bases de dados.'
                )
            }
        }

        const locales = ['es', 'en', 'fr', 'de', 'it', 'pt']
        for (const locale of locales) {
            fs.appendFileSync(logFile, `Updating locale: ${locale}...\n`)
            await payload.update({
                collection: 'tools',
                id: toolId,
                locale: locale as any,
                data: data[locale]
            })
        }

        fs.appendFileSync(logFile, '--- VERIFICATION ---\n')
        for (const locale of locales) {
            const res = await payload.findByID({
                collection: 'tools',
                id: toolId,
                locale: locale as any
            })
            fs.appendFileSync(logFile, `${locale.toUpperCase()}: Title="${res.title}", FAQs=${res.faqs?.length}, Content=${res.content ? 'YES' : 'NO'}\n`)
        }

        fs.appendFileSync(logFile, '--- STANDARDIZATION COMPLETE ---\n')
        console.log('Standardization complete. See standardize-locales.log')
    } catch (err: any) {
        fs.appendFileSync(logFile, `ERROR: ${err.message}\n${err.stack}\n`)
        console.error(err)
    }
    process.exit(0)
}
run()
