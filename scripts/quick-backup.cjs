const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const connectionString = process.env.DATABASE_URI;

async function backup() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log('✓ Conectado a la base de datos');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(__dirname, '..', 'backups');
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    const backupFile = path.join(backupDir, `pre-migration-backup-${timestamp}.json`);
    
    // Tablas importantes
    const tables = [
      'tools', 'tools_locales',
      'posts', 'posts_locales', 
      'products', 'products_locales',
      'landing_page', 'landing_page_locales',
      'company_info', 'company_info_locales',
      'tool_usage_logs',
      'tool_reports'
    ];
    
    const backup = {};
    
    for (const table of tables) {
      try {
        const result = await client.query(`SELECT * FROM ${table}`);
        backup[table] = result.rows;
        console.log(`✓ ${table}: ${result.rows.length} registros`);
      } catch (err) {
        console.log(`⚠️ ${table}: ${err.message}`);
      }
    }
    
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
    console.log(`\n✅ Backup creado: ${backupFile}`);
    console.log(`📦 Total tablas respaldadas: ${Object.keys(backup).length}`);
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

backup();
