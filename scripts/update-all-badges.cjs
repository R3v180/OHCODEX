const { Client } = require('pg');
require('dotenv').config();

const client = new Client({ connectionString: process.env.DATABASE_URI });

async function updateBadges() {
  await client.connect();
  console.log('✓ Conectado a la base de datos');

  // Definir traducciones para cada badge en cada idioma
  const badgeTranslations = {
    'base64': {
      es: 'Multi-Formato',
      en: 'Multi-Format',
      fr: 'Multi-Format',
      de: 'Multi-Format',
      it: 'Multi-Formato',
      pt: 'Multi-Formato'
    },
    'css-minifier': {
      es: 'Clean Code',
      en: 'Clean Code',
      fr: 'Clean Code',
      de: 'Clean Code',
      it: 'Clean Code',
      pt: 'Clean Code'
    },
    'password-gen': {  // el slug es password-gen no password-generator
      es: 'Military Grade',
      en: 'Military Grade',
      fr: 'Grade Militaire',
      de: 'Military Grade',
      it: 'Grado Militare',
      pt: 'Grau Militar'
    },
    'color-palette': {
      es: 'Design Pro',
      en: 'Design Pro',
      fr: 'Design Pro',
      de: 'Design Pro',
      it: 'Design Pro',
      pt: 'Design Pro'
    },
    'jwt-decoder': {
      es: 'Dev Essential',
      en: 'Dev Essential',
      fr: 'Dev Essential',
      de: 'Dev Essential',
      it: 'Dev Essential',
      pt: 'Dev Essential'
    },
    'regex-tester': {
      es: 'Pattern Master',
      en: 'Pattern Master',
      fr: 'Pattern Master',
      de: 'Pattern Master',
      it: 'Pattern Master',
      pt: 'Pattern Master'
    }
  };

  // Obtener todas las herramientas con sus IDs
  const toolsResult = await client.query('SELECT id, slug FROM tools');
  const toolIds = {};
  for (const row of toolsResult.rows) {
    toolIds[row.slug] = row.id;
  }

  // Actualizar cada herramienta en cada idioma
  for (const [slug, translations] of Object.entries(badgeTranslations)) {
    const toolId = toolIds[slug];
    if (!toolId) {
      console.log(`⚠️ No encontrado: ${slug}`);
      continue;
    }

    for (const [locale, badge] of Object.entries(translations)) {
      const result = await client.query(
        'UPDATE tools_locales SET badge = $1 WHERE _parent_id = $2 AND _locale = $3 RETURNING id',
        [badge, toolId, locale]
      );
      
      if (result.rowCount > 0) {
        console.log(`✓ ${slug} [${locale}]: "${badge}"`);
      }
    }
  }

  console.log('\n✅ Todos los badges actualizados');
  await client.end();
}

updateBadges().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
