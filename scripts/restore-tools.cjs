const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const connectionString = process.env.DATABASE_URI;

async function restoreTools() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log('✓ Conectado a la base de datos');

    // Leer backup
    const backupDir = path.join(__dirname, '..', 'backups');
    const files = fs.readdirSync(backupDir).filter(f => f.startsWith('neon-backup-') && f.endsWith('.json'));
    const latest = files.sort().reverse()[0];
    const backupPath = path.join(backupDir, latest);
    
    console.log(`Usando backup: ${latest}`);
    const data = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

    // Verificar si hay datos en tools
    const checkResult = await client.query('SELECT COUNT(*) FROM tools');
    const currentCount = parseInt(checkResult.rows[0].count);
    console.log(`Registros actuales en tools: ${currentCount}`);

    if (currentCount > 0) {
      console.log('⚠️ La tabla tools ya tiene datos. No se restaurará nada.');
      return;
    }

    // Restaurar tools
    console.log('\nRestaurando tools...');
    for (const tool of data.tools) {
      const columns = Object.keys(tool).join(', ');
      const placeholders = Object.keys(tool).map((_, i) => `$${i + 1}`).join(', ');
      const values = Object.values(tool);
      
      await client.query(
        `INSERT INTO tools (${columns}) VALUES (${placeholders})`,
        values
      );
    }
    console.log(`✓ Restauradas ${data.tools.length} tools`);

    // Restaurar tools_locales
    console.log('\nRestaurando tools_locales...');
    for (const locale of data.tools_locales) {
      const columns = Object.keys(locale).join(', ');
      const placeholders = Object.keys(locale).map((_, i) => `$${i + 1}`).join(', ');
      const values = Object.values(locale);
      
      await client.query(
        `INSERT INTO tools_locales (${columns}) VALUES (${placeholders})`,
        values
      );
    }
    console.log(`✓ Restauradas ${data.tools_locales.length} traducciones`);

    // Verificar
    const verifyResult = await client.query('SELECT COUNT(*) FROM tools');
    console.log(`\n✅ Restauración completa. Total tools: ${verifyResult.rows[0].count}`);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

restoreTools();
