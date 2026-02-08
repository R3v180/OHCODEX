const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_nzlLWyOAp1j8@ep-orange-cherry-agt0euoy-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'
});

async function revert() {
  await client.connect();
  console.log('🔌 Conectado a Neon\n');

  try {
    // Revertir icon a text
    console.log('Revirtiendo icon a text...');
    await client.query(`ALTER TABLE tools ADD COLUMN icon_text text`);
    await client.query(`UPDATE tools SET icon_text = icon::text`);
    await client.query(`ALTER TABLE tools DROP COLUMN icon`);
    await client.query(`ALTER TABLE tools RENAME COLUMN icon_text TO icon`);
    console.log('✅ icon revertido a text');

    // Revertir code_key a text  
    console.log('Revirtiendo code_key a text...');
    await client.query(`ALTER TABLE tools ADD COLUMN code_key_text text`);
    await client.query(`UPDATE tools SET code_key_text = code_key::text`);
    await client.query(`ALTER TABLE tools DROP COLUMN code_key`);
    await client.query(`ALTER TABLE tools RENAME COLUMN code_key_text TO code_key`);
    console.log('✅ code_key revertido a text');

    console.log('\n🎉 Columnas revertidas a text');

  } catch (err) {
    console.error('❌ Error:', err.message);
  }

  await client.end();
}

revert();
