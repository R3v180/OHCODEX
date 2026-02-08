const { Client } = require('pg');
require('dotenv').config();

const client = new Client({ connectionString: process.env.DATABASE_URI });

async function createTable() {
  try {
    await client.connect();
    console.log('✓ Conectado a la base de datos');

    // Crear tabla de logs de uso
    await client.query(`
      CREATE TABLE IF NOT EXISTS tool_usage_logs (
        id SERIAL PRIMARY KEY,
        tool_slug TEXT NOT NULL,
        ip_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Tabla tool_usage_logs creada');

    // Crear índices para consultas rápidas
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_tool_usage_slug ON tool_usage_logs(tool_slug)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_tool_usage_created ON tool_usage_logs(created_at)
    `);
    console.log('✓ Índices creados');

    // Verificar
    const result = await client.query(`
      SELECT COUNT(*) FROM tool_usage_logs
    `);
    console.log(`✅ Tabla lista. Registros actuales: ${result.rows[0].count}`);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

createTable();
