import { getPayload } from 'payload'
import configPromise from '../src/payload.config'
import * as dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env') })

async function run() {
    console.log('--- START FINAL REFINEMENT ---')
    try {
        const payload = await getPayload({ config: configPromise })

        // Rich content for Spanish
        const hexDiffES = {
            title: 'Hex Binary Diff',
            badge: 'Análisis Binario',
            shortDescription: 'Compara dos archivos byte a byte para detectar diferencias exactas en formato hexadecimal y ASCII de forma instantánea.',
            metaTitle: 'Herramienta Hex Binary Diff Online - Comparador Binario Gratis - OHCodex',
            metaDescription: 'Compara dos archivos binarios en tiempo real desde tu navegador. Visualización HEX y ASCII con resaltado profesional. 100% privado y seguro.',
            steps: [
                { stepTitle: 'Cargar Archivo A', stepDescription: 'Sube la versión original o el primer archivo binario que deseas comparar.', stepIcon: 'upload' },
                { stepTitle: 'Cargar Archivo B', stepDescription: 'Sube la versión modificada para detectar los cambios exactos.', stepIcon: 'upload' },
                { stepTitle: 'Analizar Diffs', stepDescription: 'Observa las diferencias resaltadas en hexadecimal y su representación ASCII.', stepIcon: 'zap' }
            ],
            faqs: [
                { question: '¿Es seguro analizar archivos confidenciales?', answer: 'Sí. El proceso es 100% local en tu navegador. Tus archivos nunca se suben a ningún servidor.' },
                { question: '¿Para qué sirve un comparador hexadecimal?', answer: 'Para detectar cambios en binarios, realizar ingeniería inversa u optimizar archivos de datos.' },
                { question: '¿Qué significan los colores?', answer: 'Rojo indica datos originales (A) y cian indica datos modificados (B).' },
                { question: '¿Hay un límite de tamaño?', answer: 'Se analizan los primeros 16KB para garantizar velocidad de respuesta instantánea.' }
            ],
            content: {
                root: {
                    children: [
                        { type: 'heading', tag: 'h2', version: 1, children: [{ text: '¿Qué es la Comparación Binaria (Hex Diff)?', version: 1 }] },
                        { type: 'paragraph', version: 1, children: [{ text: 'Es el análisis técnico de las diferencias entre dos archivos a nivel de bytes. Ideal para desarrolladores y analistas forenses.', version: 1 }] }
                    ],
                    direction: 'ltr', format: '', indent: 0, type: 'root', version: 1
                }
            }
        }

        // Rich content for English
        const hexDiffEN = {
            title: 'Hex Binary Diff',
            badge: 'Binary Analysis',
            shortDescription: 'Compare two files byte by byte to detect exact differences in hexadecimal and ASCII formats instantly.',
            metaTitle: 'Online Hex Binary Diff Tool - Free Binary Comparator - OHCodex',
            metaDescription: 'Compare two binary files in real-time from your browser. Visualize hex and ASCII differences with professional highlighting. 100% private and secure.',
            steps: [
                { stepTitle: 'Load File A', stepDescription: 'Upload the original version or the first binary file you want to compare.', stepIcon: 'upload' },
                { stepTitle: 'Load File B', stepDescription: 'Upload the modified version to detect exact changes.', stepIcon: 'upload' },
                { stepTitle: 'Analyze Diffs', stepDescription: 'Observe highlighted differences in hexadecimal and their ASCII representation.', stepIcon: 'zap' }
            ],
            faqs: [
                { question: 'Is it safe?', answer: 'Yes, 100% client-side. Your files never leave your computer.' },
                { question: 'What is it for?', answer: 'Detecting changes in binaries, reverse engineering, and debugging.' },
                { question: 'Color meaning?', answer: 'Red for differences in A, cyan for changes in B.' }
            ],
            content: {
                root: {
                    children: [
                        { type: 'heading', tag: 'h2', version: 1, children: [{ text: 'What is Hex Binary Diff?', version: 1 }] },
                        { type: 'paragraph', version: 1, children: [{ text: 'A tool for technical analysis of byte-level differences between two files.', version: 1 }] }
                    ],
                    direction: 'ltr', format: '', indent: 0, type: 'root', version: 1
                }
            }
        }

        const q = await payload.find({ collection: 'tools', where: { slug: { equals: 'hex-diff' } } })
        if (q.totalDocs > 0) {
            const id = q.docs[0].id
            await payload.update({ collection: 'tools', id, locale: 'es', data: hexDiffES as any })
            await payload.update({ collection: 'tools', id, locale: 'en', data: hexDiffEN as any })
            console.log('ES and EN updated.')
        } else {
            console.log('Tool not found.')
        }
    } catch (err: any) {
        console.error('Error:', err.message)
    }
    process.exit(0)
}
run()
