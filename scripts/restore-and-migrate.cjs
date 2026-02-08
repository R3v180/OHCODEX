const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_nzlLWyOAp1j8@ep-orange-cherry-agt0euoy-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'
});

async function migrate() {
  await client.connect();
  console.log('🔌 Conectado a Neon\n');

  try {
    // 1. Verificar estado actual
    const columnInfo = await client.query(`
      SELECT column_name, data_type, udt_name 
      FROM information_schema.columns 
      WHERE table_name = 'tools' AND column_name IN ('icon', 'code_key')
    `);
    
    console.log('Estado actual de tools:');
    for (const col of columnInfo.rows) {
      console.log(`  ${col.column_name}: ${col.data_type} (${col.udt_name})`);
    }

    // 2. Si icon es text, convertirlo a enum
    const iconCol = columnInfo.rows.find(r => r.column_name === 'icon');
    if (iconCol && iconCol.data_type === 'text') {
      console.log('\n⚠️ Convirtiendo icon de text a enum...');
      
      // Verificar que todos los valores existan en el enum
      const iconValues = await client.query(`SELECT DISTINCT icon FROM tools WHERE icon IS NOT NULL`);
      console.log('Valores actuales en icon:', iconValues.rows.map(r => r.icon));
      
      // Crear columna enum y copiar
      await client.query(`ALTER TABLE tools ADD COLUMN IF NOT EXISTS icon_enum enum_tools_icon`);
      await client.query(`UPDATE tools SET icon_enum = icon::text::enum_tools_icon WHERE icon IS NOT NULL`);
      await client.query(`ALTER TABLE tools DROP COLUMN icon`);
      await client.query(`ALTER TABLE tools RENAME COLUMN icon_enum TO icon`);
      console.log('✅ icon convertido a enum');
    }

    // 3. Limpiar migraciones de Payload para forzar re-sincronización
    console.log('\n🧹 Limpiando metadata de migraciones...');
    await client.query(`
      UPDATE payload_migrations 
      SET created_at = NOW() 
      WHERE name LIKE '%tools%'
    `);
    
    // 4. Verificar enums
    console.log('\n✅ Verificación final:');
    const finalCheck = await client.query(`
      SELECT column_name, udt_name 
      FROM information_schema.columns 
      WHERE table_name = 'tools' AND column_name IN ('icon', 'code_key')
    `);
    
    for (const col of finalCheck.rows) {
      console.log(`  ${col.column_name}: ${col.udt_name}`);
    }

    console.log('\n🎉 Migración completada');

  } catch (err) {
    console.error('❌ Error:', err.message);
  }

  await client.end();
}

migrate();
