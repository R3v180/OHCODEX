import { Client } from 'pg';

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_nzlLWyOAp1j8@ep-orange-cherry-agt0euoy-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'
});

async function fix() {
  await client.connect();
  
  // Agregar nuevos valores al enum
  const newValues = ['base64', 'css-minifier', 'password-gen', 'jwt-decoder', 'regex-tester', 'color-palette'];
  
  for (const value of newValues) {
    try {
      await client.query(`ALTER TYPE enum_tools_code_key ADD VALUE '${value}'`);
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
  console.log('\nEnum actualizado');
}

fix();
