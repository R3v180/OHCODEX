// scripts/create-ad-events-table.cjs
// Crea una tabla externa "ad_events" para registrar impresiones/clicks de anuncios.
// Solo usa CREATE TABLE IF NOT EXISTS (no toca tablas existentes).

const { Client } = require('pg')
const path = require('path')
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') })

const uri = process.env.DATABASE_URI

if (!uri) {
  console.error('❌ DATABASE_URI no está definido en .env')
  process.exit(1)
}

const sql = `
CREATE TABLE IF NOT EXISTS ad_events (
  id          BIGSERIAL PRIMARY KEY,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  slot_position TEXT NOT NULL,
  network       TEXT NOT NULL,
  event_type    TEXT NOT NULL,
  variant_label TEXT,
  tool_slug     TEXT,
  locale        TEXT,
  user_agent    TEXT,
  ip_hash       TEXT
);
`

async function main() {
  console.log('🗄  Conectando a Neon para crear tabla ad_events...')
  const client = new Client({ connectionString: uri })
  try {
    await client.connect()
    await client.query(sql)
    console.log('✅ Tabla ad_events creada (o ya existía).')
  } catch (err) {
    console.error('❌ Error creando tabla ad_events:')
    console.error(err.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()

