import { Client } from 'pg';

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_nzlLWyOAp1j8@ep-orange-cherry-agt0euoy-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'
});

async function check() {
  await client.connect();
  
  const res = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'posts_locales'
  `);
  
  console.log('posts_locales columns:');
  res.rows.forEach(r => console.log(`  ${r.column_name}: ${r.data_type}`));
  
  // Ver un ejemplo de content
  const ex = await client.query('SELECT content FROM posts_locales LIMIT 1');
  if (ex.rows[0]) {
    console.log('\nEjemplo de content:');
    console.log(JSON.stringify(ex.rows[0].content, null, 2).substring(0, 500));
  }
  
  await client.end();
}

check();
