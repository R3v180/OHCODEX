import { Client } from 'pg';

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_nzlLWyOAp1j8@ep-orange-cherry-agt0euoy-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'
});

async function check() {
  await client.connect();
  
  // Ver el formato de un post antiguo
  const oldPost = await client.query(`
    SELECT content FROM posts_locales 
    WHERE _parent_id = 16 AND _locale = 'es'
    LIMIT 1
  `);
  
  if (oldPost.rows[0]) {
    console.log('Formato de post antiguo:');
    console.log(JSON.stringify(oldPost.rows[0].content, null, 2));
  }
  
  await client.end();
}

check();
