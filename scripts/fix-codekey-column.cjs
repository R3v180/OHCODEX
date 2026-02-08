const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_nzlLWyOAp1j8@ep-orange-cherry-agt0euoy-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'
});

async function fix() {
  await client.connect();

  try {
    // Verificar code_key
    const columnInfo = await client.query(`
      SELECT data_type, udt_name 
      FROM information_schema.columns 
      WHERE table_name = 'tools' AND column_name = 'code_key'
    `);
    
    console.log('Tipo de code_key:', columnInfo.rows[0]);

    if (columnInfo.rows[0].data_type === 'USER-DEFINED') {
      console.log('✅ code_key YA es enum');
    } else {
      console.log('⚠️ Convirtiendo code_key...');
      await client.query(`ALTER TABLE tools ADD COLUMN code_key_new enum_tools_code_key`);
      await client.query(`UPDATE tools SET code_key_new = code_key::text::enum_tools_code_key WHERE code_key IS NOT NULL`);
      await client.query(`ALTER TABLE tools DROP COLUMN code_key`);
      await client.query(`ALTER TABLE tools RENAME COLUMN code_key_new TO code_key`);
      console.log('✅ code_key convertido');
    }

    // Verificar otros campos que puedan dar problemas
    const columns = await client.query(`
      SELECT column_name, data_type, udt_name 
      FROM information_schema.columns 
      WHERE table_name = 'tools'
    `);
    
    console.log('\n--- Columnas de tools ---');
    for (const col of columns.rows) {
      console.log(`${col.column_name}: ${col.data_type === 'USER-DEFINED' ? col.udt_name : col.data_type}`);
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  }

  await client.end();
}

fix();
