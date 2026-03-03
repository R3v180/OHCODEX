const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({ connectionString: process.env.DATABASE_URI })

async function main() {
  const client = await pool.connect()
  try {
    console.log('🔧 Creando tablas para AdsSettings (solo ADD, sin tocar nada existente)...\n')

    await client.query(`BEGIN`)

    // 1. Enum types
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE "public"."enum_ads_settings_slots_position" AS ENUM('top', 'sidebar', 'bottom');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `)
    console.log('  ✅ enum_ads_settings_slots_position')

    await client.query(`
      DO $$ BEGIN
        CREATE TYPE "public"."enum_ads_settings_positions_position" AS ENUM('top', 'sidebar', 'bottom');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `)
    console.log('  ✅ enum_ads_settings_positions_position')

    await client.query(`
      DO $$ BEGIN
        CREATE TYPE "public"."enum_ads_settings_positions_variants_network" AS ENUM('adsense', 'ezoic', 'house');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `)
    console.log('  ✅ enum_ads_settings_positions_variants_network')

    // 2. Main table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "ads_settings" (
        "id" serial PRIMARY KEY NOT NULL,
        "enabled" boolean DEFAULT false,
        "adsense_client_id" varchar,
        "adsense_script_src" varchar DEFAULT 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
        "ezoic_site_id" varchar,
        "ezoic_script_src" varchar,
        "updated_at" timestamp(3) with time zone,
        "created_at" timestamp(3) with time zone
      );
    `)
    console.log('  ✅ ads_settings')

    // 3. Slots array table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "ads_settings_slots" (
        "_order" integer NOT NULL,
        "_parent_id" integer NOT NULL,
        "id" varchar PRIMARY KEY NOT NULL,
        "position" "enum_ads_settings_slots_position" NOT NULL,
        "ad_slot_id" varchar
      );
    `)
    console.log('  ✅ ads_settings_slots')

    // 4. Positions array table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "ads_settings_positions" (
        "_order" integer NOT NULL,
        "_parent_id" integer NOT NULL,
        "id" varchar PRIMARY KEY NOT NULL,
        "position" "enum_ads_settings_positions_position" NOT NULL
      );
    `)
    console.log('  ✅ ads_settings_positions')

    // 5. Variants nested array table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "ads_settings_positions_variants" (
        "_order" integer NOT NULL,
        "_parent_id" varchar NOT NULL,
        "id" varchar PRIMARY KEY NOT NULL,
        "label" varchar,
        "network" "enum_ads_settings_positions_variants_network" NOT NULL,
        "weight" numeric DEFAULT 1,
        "enabled" boolean DEFAULT true,
        "adsense_slot_id" varchar,
        "ezoic_placeholder_id" varchar,
        "house_image_url" varchar,
        "house_href" varchar,
        "house_alt" varchar,
        "house_html" varchar
      );
    `)
    console.log('  ✅ ads_settings_positions_variants')

    // 6. Foreign keys
    await client.query(`
      DO $$ BEGIN
        ALTER TABLE "ads_settings_slots" ADD CONSTRAINT "ads_settings_slots_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."ads_settings"("id") ON DELETE cascade ON UPDATE no action;
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `)

    await client.query(`
      DO $$ BEGIN
        ALTER TABLE "ads_settings_positions" ADD CONSTRAINT "ads_settings_positions_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."ads_settings"("id") ON DELETE cascade ON UPDATE no action;
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `)

    await client.query(`
      DO $$ BEGIN
        ALTER TABLE "ads_settings_positions_variants" ADD CONSTRAINT "ads_settings_positions_variants_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."ads_settings_positions"("id") ON DELETE cascade ON UPDATE no action;
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `)
    console.log('  ✅ Foreign keys')

    // 7. Indexes
    await client.query(`CREATE INDEX IF NOT EXISTS "ads_settings_slots_order_idx" ON "ads_settings_slots" USING btree ("_order")`)
    await client.query(`CREATE INDEX IF NOT EXISTS "ads_settings_slots_parent_id_idx" ON "ads_settings_slots" USING btree ("_parent_id")`)
    await client.query(`CREATE INDEX IF NOT EXISTS "ads_settings_positions_order_idx" ON "ads_settings_positions" USING btree ("_order")`)
    await client.query(`CREATE INDEX IF NOT EXISTS "ads_settings_positions_parent_id_idx" ON "ads_settings_positions" USING btree ("_parent_id")`)
    await client.query(`CREATE INDEX IF NOT EXISTS "ads_settings_positions_variants_order_idx" ON "ads_settings_positions_variants" USING btree ("_order")`)
    await client.query(`CREATE INDEX IF NOT EXISTS "ads_settings_positions_variants_parent_id_idx" ON "ads_settings_positions_variants" USING btree ("_parent_id")`)
    console.log('  ✅ Indexes')

    // 8. Register migration in payload_migrations so Payload knows it was applied
    await client.query(`
      INSERT INTO payload_migrations (name, batch, updated_at, created_at)
      VALUES ('20260303_161202_ads_settings_global', 1, now(), now())
    `)
    console.log('  ✅ Migración registrada en payload_migrations')

    await client.query(`COMMIT`)
    console.log('\n🎉 ¡Todas las tablas de AdsSettings creadas correctamente!')

  } catch (err) {
    await client.query(`ROLLBACK`)
    console.error('\n❌ Error (ROLLBACK ejecutado, nada se modificó):', err.message)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

main()
