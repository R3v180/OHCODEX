const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_nzlLWyOAp1j8@ep-orange-cherry-agt0euoy-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'
});

async function fix() {
  await client.connect();
  console.log('🔌 Conectado a Neon\n');

  try {
    // Verificar el tipo actual de la columna icon
    const columnInfo = await client.query(`
      SELECT data_type, udt_name 
      FROM information_schema.columns 
      WHERE table_name = 'tools' AND column_name = 'icon'
    `);
    
    console.log('Tipo actual de icon:', columnInfo.rows[0]);

    if (columnInfo.rows[0].data_type === 'USER-DEFINED') {
      console.log('✅ La columna icon YA es enum');
      await client.end();
      return;
    }

    // La columna es text, necesitamos convertirla
    console.log('⚠️ Convirtiendo columna icon de text a enum...\n');

    // 1. Crear columna temporal
    await client.query(`ALTER TABLE tools ADD COLUMN icon_new enum_tools_icon`);
    console.log('✅ Columna temporal creada');

    // 2. Copiar datos - los valores text deben coincidir con los valores del enum
    await client.query(`
      UPDATE tools 
      SET icon_new = icon::text::enum_tools_icon 
      WHERE icon IS NOT NULL
    `);
    console.log('✅ Datos copiados');

    // 3. Eliminar columna antigua
    await client.query(`ALTER TABLE tools DROP COLUMN icon`);
    console.log('✅ Columna antigua eliminada');

    // 4. Renombrar columna nueva
    await client.query(`ALTER TABLE tools RENAME COLUMN icon_new TO icon`);
    console.log('✅ Columna renombrada');

    console.log('\n🎉 Conversión completada');

  } catch (err) {
    console.error('❌ Error:', err.message);
    
    // Si falló, intentar rollback
    try {
      await client.query(`ALTER TABLE tools DROP COLUMN IF EXISTS icon_new`);
      console.log('Rollback: columna temporal eliminada');
    } catch (e) {}
  }

  await client.end();
}

fix();
