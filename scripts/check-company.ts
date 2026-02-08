import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URI || 'postgresql://neondb_owner:npg_nzlLWyOAp1j8@ep-orange-cherry-agt0euoy-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'
});

async function check() {
  await client.connect();
  
  console.log('🔍 Verificando estructura de company_info...\n');
  
  // Ver columnas de company_info
  const columns = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'company_info'
    ORDER BY ordinal_position
  `);
  
  console.log('📋 Columnas en company_info:');
  columns.rows.forEach(c => {
    console.log(`   ${c.column_name}: ${c.data_type}`);
  });
  
  // Ver datos actuales
  const data = await client.query(`SELECT * FROM company_info LIMIT 1`);
  console.log('\n📄 Datos actuales:');
  console.log(data.rows[0]);
  
  await client.end();
}

check().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
