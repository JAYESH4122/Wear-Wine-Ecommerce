import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$
  DECLARE
    currency_labels text[];
    status_labels text[];
  BEGIN
    IF NOT EXISTS (
      SELECT 1
      FROM "pg_type" AS type
      INNER JOIN "pg_namespace" AS namespace
        ON namespace.oid = type.typnamespace
      WHERE namespace.nspname = 'public'
        AND type.typname = 'enum_payment_attempts_currency'
    ) THEN
      CREATE TYPE "public"."enum_payment_attempts_currency" AS ENUM('INR');
    ELSE
      SELECT array_agg(enum_value.enumlabel::text ORDER BY enum_value.enumsortorder)
      INTO currency_labels
      FROM "pg_enum" AS enum_value
      INNER JOIN "pg_type" AS type
        ON type.oid = enum_value.enumtypid
      INNER JOIN "pg_namespace" AS namespace
        ON namespace.oid = type.typnamespace
      WHERE namespace.nspname = 'public'
        AND type.typname = 'enum_payment_attempts_currency';

      IF currency_labels IS DISTINCT FROM ARRAY['INR']::text[] THEN
        RAISE EXCEPTION
          'Existing enum_payment_attempts_currency labels do not match the expected schema';
      END IF;
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM "pg_type" AS type
      INNER JOIN "pg_namespace" AS namespace
        ON namespace.oid = type.typnamespace
      WHERE namespace.nspname = 'public'
        AND type.typname = 'enum_payment_attempts_status'
    ) THEN
      CREATE TYPE "public"."enum_payment_attempts_status" AS ENUM(
        'creating',
        'pending',
        'authorized',
        'captured',
        'failed',
        'expired',
        'refund_required',
        'refunded'
      );
    ELSE
      SELECT array_agg(enum_value.enumlabel::text ORDER BY enum_value.enumsortorder)
      INTO status_labels
      FROM "pg_enum" AS enum_value
      INNER JOIN "pg_type" AS type
        ON type.oid = enum_value.enumtypid
      INNER JOIN "pg_namespace" AS namespace
        ON namespace.oid = type.typnamespace
      WHERE namespace.nspname = 'public'
        AND type.typname = 'enum_payment_attempts_status';

      IF status_labels IS DISTINCT FROM ARRAY[
        'creating',
        'pending',
        'authorized',
        'captured',
        'failed',
        'expired',
        'refund_required',
        'refunded'
      ]::text[] THEN
        RAISE EXCEPTION
          'Existing enum_payment_attempts_status labels do not match the expected schema';
      END IF;
    END IF;
  END
  $$;

  DO $$
  BEGIN
    IF EXISTS (
      SELECT 1
      FROM "orders"
      WHERE "razorpay_order_id" IS NOT NULL
      GROUP BY "razorpay_order_id"
      HAVING COUNT(*) > 1
    ) THEN
      RAISE EXCEPTION 'Cannot add unique Razorpay order index: duplicate non-null order IDs exist';
    END IF;

    IF EXISTS (
      SELECT 1
      FROM "orders"
      WHERE "razorpay_payment_id" IS NOT NULL
      GROUP BY "razorpay_payment_id"
      HAVING COUNT(*) > 1
    ) THEN
      RAISE EXCEPTION 'Cannot add unique Razorpay payment index: duplicate non-null payment IDs exist';
    END IF;
  END
  $$;

  CREATE TABLE "rate_limit_buckets" (
    "id" serial PRIMARY KEY NOT NULL,
    "key" varchar NOT NULL,
    "count" numeric NOT NULL,
    "reset_at" timestamp(3) with time zone NOT NULL
  );

  CREATE TABLE "payment_attempts_items" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "product_id" integer NOT NULL,
    "name" varchar NOT NULL,
    "size_id" integer,
    "color_id" integer,
    "variant_key" varchar NOT NULL,
    "variant_id" varchar NOT NULL,
    "quantity" numeric NOT NULL,
    "unit_price_paise" numeric NOT NULL,
    "line_total_paise" numeric NOT NULL
  );

  CREATE TABLE "payment_attempts" (
    "id" serial PRIMARY KEY NOT NULL,
    "attempt_id" varchar NOT NULL,
    "user_id" integer,
    "email" varchar NOT NULL,
    "phone" varchar NOT NULL,
    "shipping_address_full_name" varchar NOT NULL,
    "shipping_address_address_line1" varchar NOT NULL,
    "shipping_address_address_line2" varchar,
    "shipping_address_city" varchar NOT NULL,
    "shipping_address_state" varchar NOT NULL,
    "shipping_address_country" varchar DEFAULT 'India' NOT NULL,
    "shipping_address_postal_code" varchar NOT NULL,
    "shipping_address_landmark" varchar,
    "amount_paise" numeric NOT NULL,
    "currency" "enum_payment_attempts_currency" DEFAULT 'INR' NOT NULL,
    "status" "enum_payment_attempts_status" DEFAULT 'creating' NOT NULL,
    "razorpay_order_id" varchar,
    "razorpay_payment_id" varchar,
    "order_id" integer,
    "expires_at" timestamp(3) with time zone NOT NULL,
    "processed_at" timestamp(3) with time zone,
    "failure_reason" varchar,
    "refund_id" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payment_webhook_events" (
    "id" serial PRIMARY KEY NOT NULL,
    "event_id" varchar NOT NULL,
    "event_name" varchar NOT NULL,
    "razorpay_order_id" varchar,
    "payment_attempt_id" integer,
    "processed_at" timestamp(3) with time zone NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  DROP INDEX "orders_razorpay_order_id_idx";
  DROP INDEX "orders_razorpay_payment_id_idx";
  ALTER TABLE "orders" ADD COLUMN "payment_attempt_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "rate_limit_buckets_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payment_attempts_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payment_webhook_events_id" integer;
  ALTER TABLE "payment_attempts_items" ADD CONSTRAINT "payment_attempts_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payment_attempts_items" ADD CONSTRAINT "payment_attempts_items_size_id_sizes_id_fk" FOREIGN KEY ("size_id") REFERENCES "public"."sizes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payment_attempts_items" ADD CONSTRAINT "payment_attempts_items_color_id_colors_id_fk" FOREIGN KEY ("color_id") REFERENCES "public"."colors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payment_attempts_items" ADD CONSTRAINT "payment_attempts_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payment_attempts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payment_attempts" ADD CONSTRAINT "payment_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payment_attempts" ADD CONSTRAINT "payment_attempts_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payment_webhook_events" ADD CONSTRAINT "payment_webhook_events_payment_attempt_id_payment_attempts_id_fk" FOREIGN KEY ("payment_attempt_id") REFERENCES "public"."payment_attempts"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "rate_limit_buckets_key_idx" ON "rate_limit_buckets" USING btree ("key");
  CREATE INDEX "rate_limit_buckets_reset_at_idx" ON "rate_limit_buckets" USING btree ("reset_at");
  CREATE INDEX "payment_attempts_items_order_idx" ON "payment_attempts_items" USING btree ("_order");
  CREATE INDEX "payment_attempts_items_parent_id_idx" ON "payment_attempts_items" USING btree ("_parent_id");
  CREATE INDEX "payment_attempts_items_product_idx" ON "payment_attempts_items" USING btree ("product_id");
  CREATE INDEX "payment_attempts_items_size_idx" ON "payment_attempts_items" USING btree ("size_id");
  CREATE INDEX "payment_attempts_items_color_idx" ON "payment_attempts_items" USING btree ("color_id");
  CREATE UNIQUE INDEX "payment_attempts_attempt_id_idx" ON "payment_attempts" USING btree ("attempt_id");
  CREATE INDEX "payment_attempts_user_idx" ON "payment_attempts" USING btree ("user_id");
  CREATE INDEX "payment_attempts_status_idx" ON "payment_attempts" USING btree ("status");
  CREATE UNIQUE INDEX "payment_attempts_razorpay_order_id_idx" ON "payment_attempts" USING btree ("razorpay_order_id") WHERE "razorpay_order_id" IS NOT NULL;
  CREATE UNIQUE INDEX "payment_attempts_razorpay_payment_id_idx" ON "payment_attempts" USING btree ("razorpay_payment_id") WHERE "razorpay_payment_id" IS NOT NULL;
  CREATE UNIQUE INDEX "payment_attempts_order_idx" ON "payment_attempts" USING btree ("order_id") WHERE "order_id" IS NOT NULL;
  CREATE INDEX "payment_attempts_expires_at_idx" ON "payment_attempts" USING btree ("expires_at");
  CREATE INDEX "payment_attempts_refund_id_idx" ON "payment_attempts" USING btree ("refund_id");
  CREATE INDEX "payment_attempts_updated_at_idx" ON "payment_attempts" USING btree ("updated_at");
  CREATE INDEX "payment_attempts_created_at_idx" ON "payment_attempts" USING btree ("created_at");
  CREATE UNIQUE INDEX "payment_webhook_events_event_id_idx" ON "payment_webhook_events" USING btree ("event_id");
  CREATE INDEX "payment_webhook_events_razorpay_order_id_idx" ON "payment_webhook_events" USING btree ("razorpay_order_id");
  CREATE INDEX "payment_webhook_events_payment_attempt_idx" ON "payment_webhook_events" USING btree ("payment_attempt_id");
  CREATE INDEX "payment_webhook_events_updated_at_idx" ON "payment_webhook_events" USING btree ("updated_at");
  CREATE INDEX "payment_webhook_events_created_at_idx" ON "payment_webhook_events" USING btree ("created_at");
  ALTER TABLE "orders" ADD CONSTRAINT "orders_payment_attempt_id_payment_attempts_id_fk" FOREIGN KEY ("payment_attempt_id") REFERENCES "public"."payment_attempts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_rate_limit_buckets_fk" FOREIGN KEY ("rate_limit_buckets_id") REFERENCES "public"."rate_limit_buckets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payment_attempts_fk" FOREIGN KEY ("payment_attempts_id") REFERENCES "public"."payment_attempts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payment_webhook_events_fk" FOREIGN KEY ("payment_webhook_events_id") REFERENCES "public"."payment_webhook_events"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "orders_payment_attempt_idx" ON "orders" USING btree ("payment_attempt_id") WHERE "payment_attempt_id" IS NOT NULL;
  CREATE INDEX "payload_locked_documents_rels_rate_limit_buckets_id_idx" ON "payload_locked_documents_rels" USING btree ("rate_limit_buckets_id");
  CREATE INDEX "payload_locked_documents_rels_payment_attempts_id_idx" ON "payload_locked_documents_rels" USING btree ("payment_attempts_id");
  CREATE INDEX "payload_locked_documents_rels_payment_webhook_events_id_idx" ON "payload_locked_documents_rels" USING btree ("payment_webhook_events_id");
  CREATE UNIQUE INDEX "orders_razorpay_order_id_idx" ON "orders" USING btree ("razorpay_order_id") WHERE "razorpay_order_id" IS NOT NULL;
  CREATE UNIQUE INDEX "orders_razorpay_payment_id_idx" ON "orders" USING btree ("razorpay_payment_id") WHERE "razorpay_payment_id" IS NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "orders" DROP CONSTRAINT "orders_payment_attempt_id_payment_attempts_id_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_rate_limit_buckets_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_payment_attempts_fk";

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_payment_webhook_events_fk";

  DROP INDEX "orders_payment_attempt_idx";
  DROP INDEX "payload_locked_documents_rels_rate_limit_buckets_id_idx";
  DROP INDEX "payload_locked_documents_rels_payment_attempts_id_idx";
  DROP INDEX "payload_locked_documents_rels_payment_webhook_events_id_idx";
  DROP INDEX "orders_razorpay_order_id_idx";
  DROP INDEX "orders_razorpay_payment_id_idx";
  ALTER TABLE "orders" DROP COLUMN "payment_attempt_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "rate_limit_buckets_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payment_attempts_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payment_webhook_events_id";
  DROP TABLE "rate_limit_buckets";
  DROP TABLE "payment_attempts_items";
  DROP TABLE "payment_webhook_events";
  DROP TABLE "payment_attempts";
  CREATE INDEX "orders_razorpay_order_id_idx" ON "orders" USING btree ("razorpay_order_id");
  CREATE INDEX "orders_razorpay_payment_id_idx" ON "orders" USING btree ("razorpay_payment_id");
  DROP TYPE "public"."enum_payment_attempts_currency";
  DROP TYPE "public"."enum_payment_attempts_status";`)
}
