import fs from 'fs'
import path from 'path'

const dir = './src/messages'
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'))

const additions = {
    fileCarver: {
        scanAnother: {
            es: 'Escanear otro archivo',
            en: 'Scan Another File',
            fr: 'Scanner un autre fichier',
            de: 'Eine andere Datei scannen',
            it: 'Scansiona un altro file',
            pt: 'Verificar outro arquivo'
        }
    },
    hexDiff: {
        remove: {
            es: 'Eliminar',
            en: 'Remove',
            fr: 'Supprimer',
            de: 'Entfernen',
            it: 'Rimuovi',
            pt: 'Remover'
        }
    }
}

for (const file of files) {
    const lang = file.replace('.json', '')
    const filePath = path.join(dir, file)
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'))

    if (!content.tools) content.tools = {}
    if (!content.tools.fileCarver) content.tools.fileCarver = {}
    if (!content.tools.hexDiff) content.tools.hexDiff = {}

    content.tools.fileCarver.scanAnother = additions.fileCarver.scanAnother[lang] || additions.fileCarver.scanAnother.en
    content.tools.hexDiff.remove = additions.hexDiff.remove[lang] || additions.hexDiff.remove.en

    fs.writeFileSync(filePath, JSON.stringify(content, null, 2))
    console.log(`Updated ${lang}`)
}
