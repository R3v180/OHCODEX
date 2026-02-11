import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('es', 'en', 'fr', 'de', 'it', 'pt');
  CREATE TYPE "public"."enum_products_status" AS ENUM('concept', 'development', 'beta', 'live');
  CREATE TYPE "public"."enum_contact_submissions_service_type" AS ENUM('pwa', 'saas', 'api', 'other');
  CREATE TYPE "public"."enum_tools_steps_step_icon" AS ENUM('upload', 'settings', 'zap', 'download', 'lock', 'edit');
  CREATE TYPE "public"."enum_tool_reports_status" AS ENUM('pending', 'in_progress', 'fixed', 'dismissed');
  CREATE TYPE "public"."enum_demo_requests_status" AS ENUM('pending', 'sent', 'accessed', 'converted');
  CREATE TYPE "public"."enum_demo_requests_pool_count" AS ENUM('1-5', '6-20', '21-50', '50+');
  CREATE TYPE "public"."enum_landing_page_products_grid_cols" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_landing_page_products_align" AS ENUM('center', 'left');
  CREATE TYPE "public"."enum_landing_page_features_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_landing_page_features_list_icon" AS ENUM('smartphone', 'zap', 'database', 'shield', 'code', 'users', 'rocket');
  CREATE TABLE IF NOT EXISTS "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"public_id" varchar,
  	"external_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE IF NOT EXISTS "products_technologies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" numeric DEFAULT 10 NOT NULL,
  	"status" "enum_products_status" DEFAULT 'development' NOT NULL,
  	"is_featured" boolean DEFAULT false,
  	"logo_id" integer,
  	"hero_image_id" integer,
  	"project_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "products_locales" (
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"short_description" varchar NOT NULL,
  	"description" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL,
  	CONSTRAINT "products_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id")
  );
  
  CREATE TABLE IF NOT EXISTS "products_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "contact_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"is_read" boolean DEFAULT false,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"service_type" "enum_contact_submissions_service_type" DEFAULT 'other',
  	"message" varchar NOT NULL,
  	"privacy_accepted" boolean DEFAULT false NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"published_date" timestamp(3) with time zone NOT NULL,
  	"author_id" integer NOT NULL,
  	"category_id" integer NOT NULL,
  	"cover_image_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "posts_locales" (
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"excerpt" varchar NOT NULL,
  	"content" jsonb NOT NULL,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL,
  	CONSTRAINT "posts_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id")
  );
  
  CREATE TABLE IF NOT EXISTS "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "categories_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL,
  	CONSTRAINT "categories_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id")
  );
  
  CREATE TABLE IF NOT EXISTS "analytics" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"timestamp" timestamp(3) with time zone NOT NULL,
  	"page" varchar,
  	"country" varchar,
  	"city" varchar,
  	"device" varchar,
  	"browser" varchar,
  	"source" varchar,
  	"company_name" varchar,
  	"ip_hash" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "tools_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"step_title" varchar NOT NULL,
  	"step_description" varchar,
  	"step_icon" "enum_tools_steps_step_icon" DEFAULT 'upload'
  );
  
  CREATE TABLE IF NOT EXISTS "tools_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "tools" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"code_key" varchar NOT NULL,
  	"icon" varchar DEFAULT 'box',
  	"cta_link" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "tools_locales" (
  	"title" varchar NOT NULL,
  	"badge" varchar,
  	"short_description" varchar NOT NULL,
  	"content" jsonb,
  	"cta_title" varchar DEFAULT '¿Necesitas una solución a medida?',
  	"cta_description" varchar DEFAULT 'Nuestro equipo de ingeniería puede integrar esta tecnología en tu empresa.',
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL,
  	CONSTRAINT "tools_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id")
  );
  
  CREATE TABLE IF NOT EXISTS "tool_reports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tool_slug" varchar NOT NULL,
  	"reporter_email" varchar NOT NULL,
  	"reporter_name" varchar,
  	"description" varchar NOT NULL,
  	"status" "enum_tool_reports_status" DEFAULT 'pending' NOT NULL,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "tool_usage_logs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tool_slug" varchar NOT NULL,
  	"ip_hash" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "demo_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"status" "enum_demo_requests_status" DEFAULT 'pending',
  	"access_token" varchar,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"company" varchar,
  	"phone" varchar,
  	"pool_count" "enum_demo_requests_pool_count",
  	"message" varchar,
  	"utm_source" varchar,
  	"utm_medium" varchar,
  	"ip_address" varchar,
  	"accessed_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"products_id" integer,
  	"contact_submissions_id" integer,
  	"posts_id" integer,
  	"categories_id" integer,
  	"analytics_id" integer,
  	"tools_id" integer,
  	"tool_reports_id" integer,
  	"tool_usage_logs_id" integer,
  	"demo_requests_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "company_info_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "company_info_keywords_locales" (
  	"keyword" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	CONSTRAINT "company_info_keywords_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id")
  );
  
  CREATE TABLE IF NOT EXISTS "company_info" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"logo_dark_id" integer,
  	"contact_email" varchar DEFAULT 'info@ohcodex.com' NOT NULL,
  	"phone_number" varchar,
  	"facebook" varchar,
  	"linkedin" varchar,
  	"github" varchar,
  	"twitter" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "company_info_locales" (
  	"tagline" varchar DEFAULT 'Arquitectos de Ecosistemas Digitales',
  	"description" varchar DEFAULT 'Ingeniería de software avanzada para empresas que buscan escalabilidad.',
  	"default_title" varchar DEFAULT 'OHCodex | Desarrollo de Software a Medida y Sistemas SaaS' NOT NULL,
  	"title_template" varchar DEFAULT '%s | OHCodex' NOT NULL,
  	"default_description" varchar DEFAULT 'Empresa de desarrollo de software especializada en PWAs, arquitecturas SaaS escalables y transformación digital.' NOT NULL,
  	"address" varchar DEFAULT 'Jávea, Alicante, España',
  	"schedule" varchar DEFAULT 'L-V: 09:00 - 18:00',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL,
  	CONSTRAINT "company_info_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id")
  );
  
  CREATE TABLE IF NOT EXISTS "legal_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "legal_texts_locales" (
  	"legal_notice" jsonb NOT NULL,
  	"privacy_policy" jsonb NOT NULL,
  	"terms_conditions" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL,
  	CONSTRAINT "legal_texts_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id")
  );
  
  CREATE TABLE IF NOT EXISTS "landing_page_features_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_landing_page_features_list_icon" DEFAULT 'zap'
  );
  
  CREATE TABLE IF NOT EXISTS "landing_page_features_list_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	CONSTRAINT "landing_page_features_list_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id")
  );
  
  CREATE TABLE IF NOT EXISTS "landing_page_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"author_name" varchar NOT NULL,
  	"company_name" varchar NOT NULL,
  	"author_image_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "landing_page_testimonials_locales" (
  	"author_role" varchar NOT NULL,
  	"quote" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	CONSTRAINT "landing_page_testimonials_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id")
  );
  
  CREATE TABLE IF NOT EXISTS "landing_page_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "landing_page_faqs_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	CONSTRAINT "landing_page_faqs_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id")
  );
  
  CREATE TABLE IF NOT EXISTS "landing_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"products_grid_cols" "enum_landing_page_products_grid_cols" DEFAULT '3',
  	"products_align" "enum_landing_page_products_align" DEFAULT 'center',
  	"features_align" "enum_landing_page_features_align" DEFAULT 'left',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "landing_page_locales" (
  	"hero_badge" varchar DEFAULT 'Nuevo: Pool-Control Beta Disponible',
  	"hero_title" varchar DEFAULT 'Arquitectos de Ecosistemas Digitales' NOT NULL,
  	"hero_subtitle" varchar DEFAULT 'Transformamos negocios con software a medida de alto rendimiento. Desde PWAs ultra-rápidas hasta infraestructuras SaaS complejas.' NOT NULL,
  	"trust_bar_title" varchar DEFAULT 'Tecnologías que impulsan nuestros productos',
  	"products_title" varchar DEFAULT 'Soluciones OHCodex',
  	"products_description" varchar DEFAULT 'Software diseñado para resolver problemas reales. Desde la automatización de infraestructura hasta la gestión comercial.',
  	"features_title" varchar DEFAULT 'Más allá del código: Ingeniería de Producto',
  	"features_description" varchar DEFAULT 'En OHCodex no somos una factoría de software al peso. Actuamos como tu socio tecnológico.',
  	"testimonials_title" varchar DEFAULT 'Confianza que se construye con código',
  	"testimonials_subtitle" varchar DEFAULT 'Lo que dicen los líderes técnicos que ya escalan con nuestra arquitectura.',
  	"faq_title" varchar DEFAULT 'Preguntas Frecuentes',
  	"faq_subtitle" varchar DEFAULT 'Todo lo que necesitas saber sobre nuestra forma de trabajar.',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL,
  	CONSTRAINT "landing_page_locales_locale_parent_id_unique" UNIQUE("_locale","_parent_id")
  );
  
  CREATE TABLE IF NOT EXISTS "landing_page_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "email_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"smtp_host" varchar DEFAULT 'smtp.zoho.eu' NOT NULL,
  	"smtp_port" numeric DEFAULT 465 NOT NULL,
  	"smtp_user" varchar NOT NULL,
  	"smtp_pass" varchar NOT NULL,
  	"from_name" varchar DEFAULT 'Web OHCodex' NOT NULL,
  	"from_email" varchar DEFAULT 'info@ohcodex.com' NOT NULL,
  	"to_email" varchar DEFAULT 'admin@crono-job.com' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  DO $$ BEGIN
   ALTER TABLE "products_technologies" ADD CONSTRAINT "products_technologies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "products" ADD CONSTRAINT "products_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "products" ADD CONSTRAINT "products_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "categories_locales" ADD CONSTRAINT "categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "tools_steps" ADD CONSTRAINT "tools_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tools"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "tools_faqs" ADD CONSTRAINT "tools_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tools"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "tools_locales" ADD CONSTRAINT "tools_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tools"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_submissions_fk" FOREIGN KEY ("contact_submissions_id") REFERENCES "public"."contact_submissions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_analytics_fk" FOREIGN KEY ("analytics_id") REFERENCES "public"."analytics"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tools_fk" FOREIGN KEY ("tools_id") REFERENCES "public"."tools"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tool_reports_fk" FOREIGN KEY ("tool_reports_id") REFERENCES "public"."tool_reports"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tool_usage_logs_fk" FOREIGN KEY ("tool_usage_logs_id") REFERENCES "public"."tool_usage_logs"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_demo_requests_fk" FOREIGN KEY ("demo_requests_id") REFERENCES "public"."demo_requests"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "company_info_keywords" ADD CONSTRAINT "company_info_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."company_info"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "company_info_keywords_locales" ADD CONSTRAINT "company_info_keywords_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."company_info_keywords"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "company_info" ADD CONSTRAINT "company_info_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "company_info" ADD CONSTRAINT "company_info_logo_dark_id_media_id_fk" FOREIGN KEY ("logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "company_info_locales" ADD CONSTRAINT "company_info_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."company_info"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "legal_texts_locales" ADD CONSTRAINT "legal_texts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."legal_texts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "landing_page_features_list" ADD CONSTRAINT "landing_page_features_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_page"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "landing_page_features_list_locales" ADD CONSTRAINT "landing_page_features_list_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_page_features_list"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "landing_page_testimonials" ADD CONSTRAINT "landing_page_testimonials_author_image_id_media_id_fk" FOREIGN KEY ("author_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "landing_page_testimonials" ADD CONSTRAINT "landing_page_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_page"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "landing_page_testimonials_locales" ADD CONSTRAINT "landing_page_testimonials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_page_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "landing_page_faqs" ADD CONSTRAINT "landing_page_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_page"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "landing_page_faqs_locales" ADD CONSTRAINT "landing_page_faqs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_page_faqs"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "landing_page_locales" ADD CONSTRAINT "landing_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_page"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "landing_page_rels" ADD CONSTRAINT "landing_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."landing_page"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "landing_page_rels" ADD CONSTRAINT "landing_page_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX IF NOT EXISTS "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "products_technologies_order_idx" ON "products_technologies" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "products_technologies_parent_id_idx" ON "products_technologies" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "products_logo_idx" ON "products" USING btree ("logo_id");
  CREATE INDEX IF NOT EXISTS "products_hero_image_idx" ON "products" USING btree ("hero_image_id");
  CREATE INDEX IF NOT EXISTS "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "products_slug_idx" ON "products_locales" USING btree ("slug","_locale");
  CREATE INDEX IF NOT EXISTS "products_rels_order_idx" ON "products_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "products_rels_parent_idx" ON "products_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "products_rels_path_idx" ON "products_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "products_rels_products_id_idx" ON "products_rels" USING btree ("products_id");
  CREATE INDEX IF NOT EXISTS "contact_submissions_updated_at_idx" ON "contact_submissions" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "contact_submissions_created_at_idx" ON "contact_submissions" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "posts_author_idx" ON "posts" USING btree ("author_id");
  CREATE INDEX IF NOT EXISTS "posts_category_idx" ON "posts" USING btree ("category_id");
  CREATE INDEX IF NOT EXISTS "posts_cover_image_idx" ON "posts" USING btree ("cover_image_id");
  CREATE INDEX IF NOT EXISTS "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "posts_slug_idx" ON "posts_locales" USING btree ("slug","_locale");
  CREATE INDEX IF NOT EXISTS "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "analytics_timestamp_idx" ON "analytics" USING btree ("timestamp");
  CREATE INDEX IF NOT EXISTS "analytics_page_idx" ON "analytics" USING btree ("page");
  CREATE INDEX IF NOT EXISTS "analytics_country_idx" ON "analytics" USING btree ("country");
  CREATE INDEX IF NOT EXISTS "analytics_company_name_idx" ON "analytics" USING btree ("company_name");
  CREATE INDEX IF NOT EXISTS "analytics_updated_at_idx" ON "analytics" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "analytics_created_at_idx" ON "analytics" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "tools_steps_order_idx" ON "tools_steps" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "tools_steps_parent_id_idx" ON "tools_steps" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "tools_steps_locale_idx" ON "tools_steps" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "tools_faqs_order_idx" ON "tools_faqs" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "tools_faqs_parent_id_idx" ON "tools_faqs" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "tools_faqs_locale_idx" ON "tools_faqs" USING btree ("_locale");
  CREATE UNIQUE INDEX IF NOT EXISTS "tools_slug_idx" ON "tools" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "tools_updated_at_idx" ON "tools" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "tools_created_at_idx" ON "tools" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "tool_reports_updated_at_idx" ON "tool_reports" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "tool_reports_created_at_idx" ON "tool_reports" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "tool_usage_logs_updated_at_idx" ON "tool_usage_logs" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "tool_usage_logs_created_at_idx" ON "tool_usage_logs" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "demo_requests_updated_at_idx" ON "demo_requests" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "demo_requests_created_at_idx" ON "demo_requests" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_contact_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_submissions_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_analytics_id_idx" ON "payload_locked_documents_rels" USING btree ("analytics_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_tools_id_idx" ON "payload_locked_documents_rels" USING btree ("tools_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_tool_reports_id_idx" ON "payload_locked_documents_rels" USING btree ("tool_reports_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_tool_usage_logs_id_idx" ON "payload_locked_documents_rels" USING btree ("tool_usage_logs_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_demo_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("demo_requests_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX IF NOT EXISTS "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "company_info_keywords_order_idx" ON "company_info_keywords" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "company_info_keywords_parent_id_idx" ON "company_info_keywords" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "company_info_logo_idx" ON "company_info" USING btree ("logo_id");
  CREATE INDEX IF NOT EXISTS "company_info_logo_dark_idx" ON "company_info" USING btree ("logo_dark_id");
  CREATE INDEX IF NOT EXISTS "landing_page_features_list_order_idx" ON "landing_page_features_list" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "landing_page_features_list_parent_id_idx" ON "landing_page_features_list" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "landing_page_testimonials_order_idx" ON "landing_page_testimonials" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "landing_page_testimonials_parent_id_idx" ON "landing_page_testimonials" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "landing_page_testimonials_author_image_idx" ON "landing_page_testimonials" USING btree ("author_image_id");
  CREATE INDEX IF NOT EXISTS "landing_page_faqs_order_idx" ON "landing_page_faqs" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "landing_page_faqs_parent_id_idx" ON "landing_page_faqs" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "landing_page_rels_order_idx" ON "landing_page_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "landing_page_rels_parent_idx" ON "landing_page_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "landing_page_rels_path_idx" ON "landing_page_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "landing_page_rels_media_id_idx" ON "landing_page_rels" USING btree ("media_id");`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "products_technologies" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_locales" CASCADE;
  DROP TABLE "products_rels" CASCADE;
  DROP TABLE "contact_submissions" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_locales" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "categories_locales" CASCADE;
  DROP TABLE "analytics" CASCADE;
  DROP TABLE "tools_steps" CASCADE;
  DROP TABLE "tools_faqs" CASCADE;
  DROP TABLE "tools" CASCADE;
  DROP TABLE "tools_locales" CASCADE;
  DROP TABLE "tool_reports" CASCADE;
  DROP TABLE "tool_usage_logs" CASCADE;
  DROP TABLE "demo_requests" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "company_info_keywords" CASCADE;
  DROP TABLE "company_info_keywords_locales" CASCADE;
  DROP TABLE "company_info" CASCADE;
  DROP TABLE "company_info_locales" CASCADE;
  DROP TABLE "legal_texts" CASCADE;
  DROP TABLE "legal_texts_locales" CASCADE;
  DROP TABLE "landing_page_features_list" CASCADE;
  DROP TABLE "landing_page_features_list_locales" CASCADE;
  DROP TABLE "landing_page_testimonials" CASCADE;
  DROP TABLE "landing_page_testimonials_locales" CASCADE;
  DROP TABLE "landing_page_faqs" CASCADE;
  DROP TABLE "landing_page_faqs_locales" CASCADE;
  DROP TABLE "landing_page" CASCADE;
  DROP TABLE "landing_page_locales" CASCADE;
  DROP TABLE "landing_page_rels" CASCADE;
  DROP TABLE "email_settings" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_products_status";
  DROP TYPE "public"."enum_contact_submissions_service_type";
  DROP TYPE "public"."enum_tools_steps_step_icon";
  DROP TYPE "public"."enum_tool_reports_status";
  DROP TYPE "public"."enum_demo_requests_status";
  DROP TYPE "public"."enum_demo_requests_pool_count";
  DROP TYPE "public"."enum_landing_page_products_grid_cols";
  DROP TYPE "public"."enum_landing_page_products_align";
  DROP TYPE "public"."enum_landing_page_features_align";
  DROP TYPE "public"."enum_landing_page_features_list_icon";`)
}
