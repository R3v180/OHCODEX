import { Client } from 'pg';

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_nzlLWyOAp1j8@ep-orange-cherry-agt0euoy-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'
});

async function fix() {
  await client.connect();
  
  // Agregar nuevos valores al enum de iconos
  const newValues = ['code', 'key', 'key-round', 'regex'];
  
  for (const value of newValues) {
    try {
      await client.query(`ALTER TYPE enum_tools_icon ADD VALUE '${value}'`);
      console.log(`✅ Valor '${value}' agregado al enum`);
    } catch (e: any) {
      if (e.message.includes('already exists')) {
        console.log(`⚠️ Valor '${value}' ya existe`);
      } else {
        console.log(`❌ Error con '${value}': ${e.message}`);
      }
    }
  }
  
  await client.end();
  console.log('\nEnum de iconos actualizado');
}

fix();
