import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   CREATE TYPE "public"."enum_ads_settings_slots_position" AS ENUM('top', 'sidebar', 'bottom');
  CREATE TYPE "public"."enum_ads_settings_positions_position" AS ENUM('top', 'sidebar', 'bottom');
  CREATE TYPE "public"."enum_ads_settings_positions_variants_network" AS ENUM('adsense', 'ezoic', 'house');
  CREATE TABLE IF NOT EXISTS "ads_settings_slots" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"position" "enum_ads_settings_slots_position" NOT NULL,
  	"ad_slot_id" varchar
  );
  
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
  
  CREATE TABLE IF NOT EXISTS "ads_settings_positions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"position" "enum_ads_settings_positions_position" NOT NULL
  );
  
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
  
  DO $$ BEGIN
   ALTER TABLE "ads_settings_slots" ADD CONSTRAINT "ads_settings_slots_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ads_settings"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "ads_settings_positions_variants" ADD CONSTRAINT "ads_settings_positions_variants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ads_settings_positions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "ads_settings_positions" ADD CONSTRAINT "ads_settings_positions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ads_settings"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "ads_settings_slots_order_idx" ON "ads_settings_slots" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "ads_settings_slots_parent_id_idx" ON "ads_settings_slots" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "ads_settings_positions_variants_order_idx" ON "ads_settings_positions_variants" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "ads_settings_positions_variants_parent_id_idx" ON "ads_settings_positions_variants" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "ads_settings_positions_order_idx" ON "ads_settings_positions" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "ads_settings_positions_parent_id_idx" ON "ads_settings_positions" USING btree ("_parent_id");`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   DROP TABLE "ads_settings_slots" CASCADE;
  DROP TABLE "ads_settings_positions_variants" CASCADE;
  DROP TABLE "ads_settings_positions" CASCADE;
  DROP TABLE "ads_settings" CASCADE;
  DROP TYPE "public"."enum_ads_settings_slots_position";
  DROP TYPE "public"."enum_ads_settings_positions_position";
  DROP TYPE "public"."enum_ads_settings_positions_variants_network";`)
}
