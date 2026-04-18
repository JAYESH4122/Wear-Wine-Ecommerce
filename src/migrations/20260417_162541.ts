import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_header_nav_items_type" AS ENUM('page', 'section');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    CREATE TYPE "public"."enum_header_nav_items_section" AS ENUM('hero', 'collectionGallery', 'depthDeckCarousel', 'productListSection', 'contact');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  ALTER TABLE "header_nav_items"
  ADD COLUMN IF NOT EXISTS "type" "enum_header_nav_items_type" DEFAULT 'page';

  ALTER TABLE "header_nav_items"
  ADD COLUMN IF NOT EXISTS "section" "enum_header_nav_items_section";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "header_nav_items" DROP COLUMN IF EXISTS "type";
  ALTER TABLE "header_nav_items" DROP COLUMN IF EXISTS "section";

  DROP TYPE IF EXISTS "public"."enum_header_nav_items_type";
  DROP TYPE IF EXISTS "public"."enum_header_nav_items_section";
  `)
}