// ========== src/fix-db.js ========== //

// Este script conecta directamente a NeonDB y crea la columna que falta
// para desbloquear el despliegue en Heroku.

const { Client } = require('pg');

// 1. PEGA AQUÍ TU DATABASE_URI (La que empieza por postgresql://neondb_owner...)
const connectionString = "postgresql://neondb_owner:npg_nzlLWyOAp1j8@ep-orange-cherry-agt0euoy-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require";

const client = new Client({
  connectionString,
  ssl: true,
});

async function fixDatabase() {
  console.log('🔌 Conectando a NeonDB...');
  try {
    await client.connect();
    
    console.log('🛠️ Intentando crear la columna "external_url"...');
    
    // Comando SQL directo para crear la columna
    await client.query('ALTER TABLE "media" ADD COLUMN "external_url" varchar;');
    
    console.log('✅ ¡ÉXITO! Columna creada. Ahora Heroku debería funcionar.');
  } catch (err) {
    if (err.message.includes('already exists')) {
      console.log('⚠️ La columna ya existía. El problema debe ser otro, pero la DB está bien.');
    } else {
      console.error('❌ Error ejecutando el script:', err);
    }
  } finally {
    await client.end();
  }
}

fixDatabase();

// ========== Fin de src/fix-db.js ========== //