import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "collection_gallery_images" ADD COLUMN "product_id" integer;
  ALTER TABLE "collection_gallery_images" ADD CONSTRAINT "collection_gallery_images_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "collection_gallery_images_product_idx" ON "collection_gallery_images" USING btree ("product_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "collection_gallery_images" DROP CONSTRAINT "collection_gallery_images_product_id_products_id_fk";
  
  DROP INDEX "collection_gallery_images_product_idx";
  ALTER TABLE "collection_gallery_images" DROP COLUMN "product_id";`)
}
