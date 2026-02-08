import { Client } from 'pg';

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_nzlLWyOAp1j8@ep-orange-cherry-agt0euoy-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'
});

async function check() {
  await client.connect();
  
  const tools = await client.query(`
    SELECT t.id, t.slug, t.code_key, tl.title, tl.short_description, tl.meta_title, tl.meta_description
    FROM tools t
    JOIN tools_locales tl ON t.id = tl._parent_id
    WHERE tl._locale = 'es'
    ORDER BY t.id
  `);
  
  console.log('=== HERRAMIENTAS ACTUALES ===\n');
  for (const tool of tools.rows) {
    console.log(`\n📌 ${tool.title} (${tool.slug})`);
    console.log(`   Code Key: ${tool.code_key}`);
    console.log(`   Meta Title: ${tool.meta_title || '❌ No definido'}`);
    console.log(`   Meta Desc: ${tool.meta_description ? tool.meta_description.substring(0, 60) + '...' : '❌ No definido'}`);
    console.log(`   Short Desc: ${tool.short_description?.substring(0, 80)}...`);
  }
  
  await client.end();
}

check();
