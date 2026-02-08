const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_nzlLWyOAp1j8@ep-orange-cherry-agt0euoy-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'
});

async function backup() {
  await client.connect();
  console.log('🔌 Conectado a Neon PostgreSQL\n');

  // 1. OBTENER TODAS LAS TABLAS
  const tablesResult = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `);

  const tables = tablesResult.rows.map(r => r.table_name);
  console.log(`📋 Encontradas ${tables.length} tablas\n`);

  const backupDir = path.join(__dirname, '..', 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(backupDir, `neon-backup-${timestamp}.json`);

  const fullBackup = {};

  // 2. BACKUP DE CADA TABLA
  for (const table of tables) {
    try {
      const result = await client.query(`SELECT * FROM "${table}"`);
      fullBackup[table] = result.rows;
      console.log(`✅ ${table}: ${result.rows.length} registros`);
    } catch (err) {
      console.log(`❌ ${table}: ERROR - ${err.message}`);
    }
  }

  // 3. GUARDAR BACKUP
  fs.writeFileSync(backupFile, JSON.stringify(fullBackup, null, 2));
  console.log(`\n💾 Backup guardado en: ${backupFile}`);
  console.log(`📦 Tamaño: ${(fs.statSync(backupFile).size / 1024 / 1024).toFixed(2)} MB\n`);

  // 4. INFORMACIÓN ESPECÍFICA DE HERRAMIENTAS
  console.log('--- HERRAMIENTAS ACTUALES ---');
  const tools = await client.query(`
    SELECT t.id, t.slug, t.code_key, t.icon, tl.title, tl._locale
    FROM tools t
    LEFT JOIN tools_locales tl ON t.id = tl._parent_id
    ORDER BY t.id, tl._locale
  `);

  for (const tool of tools.rows) {
    console.log(`ID:${tool.id} | slug:${tool.slug} | code:${tool.code_key} | icon:${tool.icon} | ${tool._locale}:${tool.title?.substring(0, 40)}`);
  }

  // 5. VERIFICAR ICONOS ÚNICOS
  const icons = await client.query(`SELECT DISTINCT icon FROM tools`);
  console.log('\n--- ICONOS ÚNICOS EN TOOLS ---');
  console.log('Valores actuales:', icons.rows.map(r => r.icon).join(', '));

  // 6. VERIFICAR ENUMS
  console.log('\n--- ENUMS EXISTENTES ---');
  const enums = await client.query(`
    SELECT typname, enumlabel 
    FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE typname LIKE '%tools%'
    ORDER BY typname, enumlabel
  `);
  
  const enumGroups = {};
  for (const row of enums.rows) {
    if (!enumGroups[row.typname]) enumGroups[row.typname] = [];
    enumGroups[row.typname].push(row.enumlabel);
  }
  
  for (const [name, values] of Object.entries(enumGroups)) {
    console.log(`${name}: ${values.join(', ')}`);
  }

  // 7. RESUMEN DE CONTENIDO
  const counts = await client.query(`
    SELECT 
      (SELECT COUNT(*) FROM posts) as posts,
      (SELECT COUNT(*) FROM posts_locales) as post_locales,
      (SELECT COUNT(*) FROM products) as products,
      (SELECT COUNT(*) FROM categories) as categories,
      (SELECT COUNT(*) FROM tools) as tools,
      (SELECT COUNT(*) FROM tools_locales) as tool_locales
  `);

  console.log('\n--- RESUMEN DE CONTENIDO ---');
  console.log(`📄 Posts: ${counts.rows[0].posts} (${counts.rows[0].post_locales} traducciones)`);
  console.log(`📦 Productos: ${counts.rows[0].products}`);
  console.log(`🏷️ Categorías: ${counts.rows[0].categories}`);
  console.log(`🛠️ Herramientas: ${counts.rows[0].tools} (${counts.rows[0].tool_locales} traducciones)`);

  await client.end();
  console.log('\n✅ Backup completado sin errores');
  console.log(`📁 Archivo: ${backupFile}`);
}

backup().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
