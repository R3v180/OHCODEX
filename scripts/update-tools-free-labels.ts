import { Client } from 'pg'

// Script NO destructivo para reforzar la palabra "gratis/free"
// en títulos (H1) y descripciones cortas de TODAS las herramientas
// en TODOS los idiomas soportados.
//
// - Actualiza únicamente la tabla tools_locales (title, short_description, badge)
// - No toca slugs, ni código, ni contenido largo.

const client = new Client({
  // Se reutiliza la misma cadena que en update-tools-seo.ts
  connectionString: 'postgresql://neondb_owner:npg_nzlLWyOAp1j8@ep-orange-cherry-agt0euoy-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'
})

type Locale = 'es' | 'en' | 'fr' | 'de' | 'it' | 'pt'

const locales: Locale[] = ['es', 'en', 'fr', 'de', 'it', 'pt']

const freeWord: Record<Locale, string> = {
  es: 'Gratis',
  en: 'Free',
  fr: 'Gratuit',
  de: 'Kostenlos',
  it: 'Gratis',
  pt: 'Grátis',
}

const extraSentence: Record<Locale, string> = {
  es: ' Herramienta gratis en tu navegador, 100% privada.',
  en: ' Free tool in your browser, 100% private.',
  fr: ' Outil gratuit dans votre navigateur, 100% privé.',
  de: ' Kostenloses Tool im Browser, 100% privat.',
  it: ' Strumento gratis nel tuo browser, 100% privato.',
  pt: ' Ferramenta grátis no seu navegador, 100% privada.',
}

function ensureFreeInTitle(locale: Locale, title: string): string {
  const word = freeWord[locale]
  const lower = title.toLowerCase()
  if (lower.includes(word.toLowerCase())) return title
  // Añadimos la palabra al final para no romper el branding
  return `${title} ${word}`.trim()
}

function ensureFreeInShortDescription(locale: Locale, short: string): string {
  const word = freeWord[locale]
  const lower = short.toLowerCase()
  if (lower.includes(word.toLowerCase())) return short
  // Añadimos una frase corta al final para mantener el texto original
  return `${short}${extraSentence[locale]}`
}

function ensureBadge(badge: string | null, locale: Locale): string | null {
  if (!badge) return freeWord[locale]
  const word = freeWord[locale]
  const lower = badge.toLowerCase()
  if (lower.includes(word.toLowerCase())) return badge
  // Si ya hay un badge tipo "Military Grade", lo respetamos
  return badge
}

async function run() {
  await client.connect()

  console.log('🔎 Cargando herramientas desde tools...')
  const toolsRes = await client.query<{ id: number; slug: string }>(
    'select id, slug from tools order by id asc',
  )

  for (const tool of toolsRes.rows) {
    for (const locale of locales) {
      const rowRes = await client.query<{
        id: number
        title: string
        short_description: string
        badge: string | null
      }>(
        `
        select id, title, short_description, badge
        from tools_locales
        where _parent_id = $1 and _locale = $2
        limit 1
      `,
        [tool.id, locale],
      )

      if (rowRes.rows.length === 0) {
        continue
      }

      const row = rowRes.rows[0]
      const newTitle = ensureFreeInTitle(locale, row.title)
      const newShort = ensureFreeInShortDescription(locale, row.short_description)
      const newBadge = ensureBadge(row.badge, locale)

      const changed =
        newTitle !== row.title ||
        newShort !== row.short_description ||
        newBadge !== row.badge

      if (!changed) continue

      await client.query(
        `
        update tools_locales
        set title = $1,
            short_description = $2,
            badge = $3
        where id = $4
      `,
        [newTitle, newShort, newBadge, row.id],
      )

      console.log(
        `✅ ${tool.slug} [${locale}] => title="${newTitle}" | badge="${newBadge ?? ''}"`,
      )
    }
  }

  await client.end()
  console.log('\n🎉 Títulos, descripciones cortas y badges actualizados con "gratis/free" en todos los idiomas.')
}

run().catch((err) => {
  console.error('❌ Error actualizando labels gratis/free:', err)
  process.exit(1)
})

