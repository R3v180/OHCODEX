const { Client } = require('pg');
require('dotenv').config();

const client = new Client({ connectionString: process.env.DATABASE_URI });

async function check() {
  await client.connect();
  
  // Ver slugs y badges actuales
  const result = await client.query(`
    SELECT t.slug, tl.badge, tl._locale 
    FROM tools t 
    JOIN tools_locales tl ON t.id = tl._parent_id 
    WHERE tl._locale = 'es'
    ORDER BY t.slug
  `);
  
  console.log('Herramientas (locale=es):');
  for (const row of result.rows) {
    console.log(`  ${row.slug}: "${row.badge}"`);
  }
  
  await client.end();
}
check();
