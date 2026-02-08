import { Client } from 'pg';

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_nzlLWyOAp1j8@ep-orange-cherry-agt0euoy-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'
});

async function fix() {
  await client.connect();
  
  try {
    await client.query(`ALTER TYPE enum_tools_icon ADD VALUE 'palette'`);
    console.log(`✅ Valor 'palette' agregado al enum`);
  } catch (e: any) {
    if (e.message.includes('already exists')) {
      console.log(`⚠️ Valor 'palette' ya existe`);
    } else {
      console.log(`❌ Error: ${e.message}`);
    }
  }
  
  await client.end();
}

fix();
