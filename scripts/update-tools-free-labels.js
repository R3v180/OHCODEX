// CommonJS versión del script para actualizar títulos / descripciones
// con la palabra "gratis/free" en todos los idiomas.

require('dotenv').config()
const { Client } = require('pg')

const client = new Client({
  connectionString: process.env.DATABASE_URI,
  ssl: { rejectUnauthorized: false },
})

const locales = ['es', 'en', 'fr', 'de', 'it', 'pt']

const freeWord = {
  es: 'Gratis',
  en: 'Free',
  fr: 'Gratuit',
  de: 'Kostenlos',
  it: 'Gratis',
  pt: 'Grátis',
}

const extraSentence = {
  es: ' Herramienta gratis en tu navegador, 100% privada.',
  en: ' Free tool in your browser, 100% private.',
  fr: ' Outil gratuit dans votre navigateur, 100% privé.',
  de: ' Kostenloses Tool im Browser, 100% privat.',
  it: ' Strumento gratis nel tuo browser, 100% privato.',
  pt: ' Ferramenta grátis no seu navegador, 100% privada.',
}

function ensureFreeInTitle(locale, title) {
  const w = freeWord[locale]
  if (!w) return title
  const lower = title.toLowerCase()
  return lower.includes(w.toLowerCase()) ? title : `${title} ${w}`.trim()
}

function ensureFreeInShort(locale, short) {
  const w = freeWord[locale]
  if (!w) return short
  const lower = short.toLowerCase()
  return lower.includes(w.toLowerCase()) ? short : `${short}${extraSentence[locale]}`
}

function ensureBadge(locale, badge) {
  const w = freeWord[locale]
  if (!w) return badge
  if (!badge) return w
  const lower = String(badge).toLowerCase()
  return lower.includes(w.toLowerCase()) ? badge : badge
}

async function run() {
  await client.connect()
  console.log('🔎 Leyendo herramientas desde tools...')
  const toolsRes = await client.query('select id, slug from tools order by id asc')

  for (const tool of toolsRes.rows) {
    for (const locale of locales) {
      const rowRes = await client.query(
        'select id, title, short_description, badge from tools_locales where _parent_id = $1 and _locale = $2 limit 1',
        [tool.id, locale],
      )

      if (rowRes.rows.length === 0) continue

      const row = rowRes.rows[0]
      const newTitle = ensureFreeInTitle(locale, row.title)
      const newShort = ensureFreeInShort(locale, row.short_description)
      const newBadge = ensureBadge(locale, row.badge)

      const changed =
        newTitle !== row.title ||
        newShort !== row.short_description ||
        newBadge !== row.badge

      if (!changed) continue

      await client.query(
        'update tools_locales set title = $1, short_description = $2, badge = $3 where id = $4',
        [newTitle, newShort, newBadge, row.id],
      )

      console.log(
        `UPDATED ${tool.slug} [${locale}] => title="${newTitle}" | badge="${newBadge ?? ''}"`,
      )
    }
  }

  await client.end()
  console.log('\n🎉 Títulos, descripciones cortas y badges ahora incluyen gratis/free en todos los idiomas.')
}

run().catch((err) => {
  console.error('❌ Error actualizando labels gratis/free:', err)
  process.exit(1)
})

