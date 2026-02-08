import { Client } from 'pg';

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_nzlLWyOAp1j8@ep-orange-cherry-agt0euoy-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'
});

async function check() {
  await client.connect();
  
  const cols = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'tools'");
  console.log('tools columns:', cols.rows.map(r => r.column_name).join(', '));
  
  const cols2 = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'tools_locales'");
  console.log('tools_locales columns:', cols2.rows.map(r => r.column_name).join(', '));
  
  await client.end();
}

check();
