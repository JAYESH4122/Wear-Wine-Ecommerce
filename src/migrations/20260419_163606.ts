import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  BEGIN;

  -- STEP 1: Normalize existing data
  UPDATE "orders"
  SET "status" = 'placed'
  WHERE "status" NOT IN ('placed', 'shipped');

  -- STEP 2: Convert to text temporarily
  ALTER TABLE "orders"
  ALTER COLUMN "status" DROP DEFAULT;

  ALTER TABLE "orders"
  ALTER COLUMN "status" SET DATA TYPE text;

  -- STEP 3: Drop old enum safely
  DO $$ BEGIN
    DROP TYPE "public"."enum_orders_status";
  EXCEPTION
    WHEN undefined_object THEN null;
  END $$;

  -- STEP 4: Create new enum
  DO $$ BEGIN
    CREATE TYPE "public"."enum_orders_status" AS ENUM ('placed', 'shipped');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  -- STEP 5: Convert column to new enum
  ALTER TABLE "orders"
  ALTER COLUMN "status"
  SET DATA TYPE "public"."enum_orders_status"
  USING "status"::"public"."enum_orders_status";

  -- STEP 6: Set default
  ALTER TABLE "orders"
  ALTER COLUMN "status"
  SET DEFAULT 'placed';

  -- STEP 7: Other schema changes
  ALTER TABLE "orders"
  ALTER COLUMN "phone" DROP NOT NULL;

  ALTER TABLE "orders"
  ADD COLUMN IF NOT EXISTS "tracking_id" varchar;

  ALTER TABLE "orders"
  DROP COLUMN IF EXISTS "awb_number";

  ALTER TABLE "orders"
  DROP COLUMN IF EXISTS "tracking_url";

  COMMIT;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  BEGIN;

  -- Recreate old enum values
  DO $$ BEGIN
    CREATE TYPE "public"."enum_orders_status_old" AS ENUM (
      'placed',
      'packed',
      'shipped',
      'out_for_delivery',
      'delivered',
      'cancelled',
      'failed'
    );
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  -- Convert back to text
  ALTER TABLE "orders"
  ALTER COLUMN "status" DROP DEFAULT;

  ALTER TABLE "orders"
  ALTER COLUMN "status" SET DATA TYPE text;

  -- Convert to old enum
  ALTER TABLE "orders"
  ALTER COLUMN "status"
  SET DATA TYPE "public"."enum_orders_status_old"
  USING "status"::text::"public"."enum_orders_status_old";

  -- Restore default
  ALTER TABLE "orders"
  ALTER COLUMN "status"
  SET DEFAULT 'placed';

  -- Restore columns
  ALTER TABLE "orders"
  ALTER COLUMN "phone" SET NOT NULL;

  ALTER TABLE "orders"
  ADD COLUMN IF NOT EXISTS "awb_number" varchar;

  ALTER TABLE "orders"
  ADD COLUMN IF NOT EXISTS "tracking_url" varchar;

  ALTER TABLE "orders"
  DROP COLUMN IF EXISTS "tracking_id";

  COMMIT;
  `)
}