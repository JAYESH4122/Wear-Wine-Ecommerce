import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_card_url" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_card_width" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_card_height" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_card_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_card_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_card_filename" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_pdp_url" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_pdp_width" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_pdp_height" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_pdp_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_pdp_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizes_pdp_filename" varchar;
  ALTER TABLE "footer" ADD COLUMN IF NOT EXISTS "tagline" varchar;
  ALTER TABLE "footer" ADD COLUMN IF NOT EXISTS "description" varchar;
  CREATE INDEX IF NOT EXISTS "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX IF NOT EXISTS "media_sizes_pdp_sizes_pdp_filename_idx" ON "media" USING btree ("sizes_pdp_filename");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX IF EXISTS "media_sizes_card_sizes_card_filename_idx";
  DROP INDEX IF EXISTS "media_sizes_pdp_sizes_pdp_filename_idx";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_card_url";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_card_width";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_card_height";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_card_mime_type";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_card_filesize";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_card_filename";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_pdp_url";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_pdp_width";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_pdp_height";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_pdp_mime_type";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_pdp_filesize";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "sizes_pdp_filename";
  ALTER TABLE "footer" DROP COLUMN IF EXISTS "tagline";
  ALTER TABLE "footer" DROP COLUMN IF EXISTS "description";`)
}
