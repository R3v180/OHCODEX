import { Client } from 'pg';

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_nzlLWyOAp1j8@ep-orange-cherry-agt0euoy-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'
});

async function check() {
  await client.connect();
  
  const res = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'posts' 
    ORDER BY ordinal_position
  `);
  
  console.log('Posts table columns:');
  res.rows.forEach(r => console.log(`  ${r.column_name}: ${r.data_type}`));
  
  await client.end();
}

check();
