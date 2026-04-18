import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_contact_methods" ALTER COLUMN "type" SET DATA TYPE text;
  DROP TYPE "public"."enum_pages_blocks_contact_methods_type";
  CREATE TYPE "public"."enum_pages_blocks_contact_methods_type" AS ENUM('Email', 'Phone', 'Chat');
  ALTER TABLE "pages_blocks_contact_methods" ALTER COLUMN "type" SET DATA TYPE "public"."enum_pages_blocks_contact_methods_type" USING "type"::"public"."enum_pages_blocks_contact_methods_type";
  ALTER TABLE "pages_blocks_contact" ADD COLUMN "cta_label" varchar DEFAULT 'Subscribe' NOT NULL;
  ALTER TABLE "pages_blocks_contact" ADD COLUMN "cta_href" varchar DEFAULT '#subscribe' NOT NULL;
  ALTER TABLE "pages_blocks_contact" DROP COLUMN "newsletter_title";
  ALTER TABLE "pages_blocks_contact" DROP COLUMN "newsletter_description";
  ALTER TABLE "pages_blocks_contact" DROP COLUMN "newsletter_button_text";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_contact_methods" ALTER COLUMN "type" SET DATA TYPE text;
  DROP TYPE "public"."enum_pages_blocks_contact_methods_type";
  CREATE TYPE "public"."enum_pages_blocks_contact_methods_type" AS ENUM('Email', 'Phone', 'Live Chat', 'Support Hours');
  ALTER TABLE "pages_blocks_contact_methods" ALTER COLUMN "type" SET DATA TYPE "public"."enum_pages_blocks_contact_methods_type" USING "type"::"public"."enum_pages_blocks_contact_methods_type";
  ALTER TABLE "pages_blocks_contact" ADD COLUMN "newsletter_title" varchar DEFAULT 'Join Our Community' NOT NULL;
  ALTER TABLE "pages_blocks_contact" ADD COLUMN "newsletter_description" varchar DEFAULT 'Subscribe for exclusive offers, early access, and styling inspiration.' NOT NULL;
  ALTER TABLE "pages_blocks_contact" ADD COLUMN "newsletter_button_text" varchar DEFAULT 'Subscribe' NOT NULL;
  ALTER TABLE "pages_blocks_contact" DROP COLUMN "cta_label";
  ALTER TABLE "pages_blocks_contact" DROP COLUMN "cta_href";`)
}
