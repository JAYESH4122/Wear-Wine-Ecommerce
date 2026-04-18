import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'user');
  CREATE TYPE "public"."enum_media_type" AS ENUM('hero', 'carousel', 'product');
  CREATE TYPE "public"."enum_pages_blocks_hero_properties_padding_top" AS ENUM('NONE', 'SM1', 'SM2', 'SM3', 'MD1', 'MD2', 'MD3', 'LG1', 'LG2', 'LG3', 'XL1', 'XL2', 'XL3', 'XXL1', 'XXL2', 'XXL3');
  CREATE TYPE "public"."enum_pages_blocks_hero_properties_padding_top_mobile" AS ENUM('NONE', 'SM1', 'SM2', 'SM3', 'MD1', 'MD2', 'MD3', 'LG1', 'LG2', 'LG3', 'XL1', 'XL2', 'XL3', 'XXL1', 'XXL2', 'XXL3');
  CREATE TYPE "public"."enum_pages_blocks_hero_properties_padding_bottom" AS ENUM('NONE', 'SM1', 'SM2', 'SM3', 'MD1', 'MD2', 'MD3', 'LG1', 'LG2', 'LG3', 'XL1', 'XL2', 'XL3', 'XXL1', 'XXL2', 'XXL3');
  CREATE TYPE "public"."enum_pages_blocks_hero_properties_padding_bottom_mobile" AS ENUM('NONE', 'SM1', 'SM2', 'SM3', 'MD1', 'MD2', 'MD3', 'LG1', 'LG2', 'LG3', 'XL1', 'XL2', 'XL3', 'XXL1', 'XXL2', 'XXL3');
  CREATE TYPE "public"."enum_pages_blocks_hero_properties_background_color" AS ENUM('primary', 'secondary', 'alt');
  CREATE TYPE "public"."enum_pages_blocks_hero_properties_background_color_mobile" AS ENUM('primary', 'secondary', 'alt');
  CREATE TYPE "public"."enum_collection_gallery_properties_padding_top" AS ENUM('NONE', 'SM1', 'SM2', 'SM3', 'MD1', 'MD2', 'MD3', 'LG1', 'LG2', 'LG3', 'XL1', 'XL2', 'XL3', 'XXL1', 'XXL2', 'XXL3');
  CREATE TYPE "public"."enum_collection_gallery_properties_padding_top_mobile" AS ENUM('NONE', 'SM1', 'SM2', 'SM3', 'MD1', 'MD2', 'MD3', 'LG1', 'LG2', 'LG3', 'XL1', 'XL2', 'XL3', 'XXL1', 'XXL2', 'XXL3');
  CREATE TYPE "public"."enum_collection_gallery_properties_padding_bottom" AS ENUM('NONE', 'SM1', 'SM2', 'SM3', 'MD1', 'MD2', 'MD3', 'LG1', 'LG2', 'LG3', 'XL1', 'XL2', 'XL3', 'XXL1', 'XXL2', 'XXL3');
  CREATE TYPE "public"."enum_collection_gallery_properties_padding_bottom_mobile" AS ENUM('NONE', 'SM1', 'SM2', 'SM3', 'MD1', 'MD2', 'MD3', 'LG1', 'LG2', 'LG3', 'XL1', 'XL2', 'XL3', 'XXL1', 'XXL2', 'XXL3');
  CREATE TYPE "public"."enum_collection_gallery_properties_background_color" AS ENUM('primary', 'secondary', 'alt');
  CREATE TYPE "public"."enum_collection_gallery_properties_background_color_mobile" AS ENUM('primary', 'secondary', 'alt');
  CREATE TYPE "public"."enum_depth_deck_carousel_properties_padding_top" AS ENUM('NONE', 'SM1', 'SM2', 'SM3', 'MD1', 'MD2', 'MD3', 'LG1', 'LG2', 'LG3', 'XL1', 'XL2', 'XL3', 'XXL1', 'XXL2', 'XXL3');
  CREATE TYPE "public"."enum_depth_deck_carousel_properties_padding_top_mobile" AS ENUM('NONE', 'SM1', 'SM2', 'SM3', 'MD1', 'MD2', 'MD3', 'LG1', 'LG2', 'LG3', 'XL1', 'XL2', 'XL3', 'XXL1', 'XXL2', 'XXL3');
  CREATE TYPE "public"."enum_depth_deck_carousel_properties_padding_bottom" AS ENUM('NONE', 'SM1', 'SM2', 'SM3', 'MD1', 'MD2', 'MD3', 'LG1', 'LG2', 'LG3', 'XL1', 'XL2', 'XL3', 'XXL1', 'XXL2', 'XXL3');
  CREATE TYPE "public"."enum_depth_deck_carousel_properties_padding_bottom_mobile" AS ENUM('NONE', 'SM1', 'SM2', 'SM3', 'MD1', 'MD2', 'MD3', 'LG1', 'LG2', 'LG3', 'XL1', 'XL2', 'XL3', 'XXL1', 'XXL2', 'XXL3');
  CREATE TYPE "public"."enum_depth_deck_carousel_properties_background_color" AS ENUM('primary', 'secondary', 'alt');
  CREATE TYPE "public"."enum_depth_deck_carousel_properties_background_color_mobile" AS ENUM('primary', 'secondary', 'alt');
  CREATE TYPE "public"."enum_product_list_section_properties_padding_top" AS ENUM('NONE', 'SM1', 'SM2', 'SM3', 'MD1', 'MD2', 'MD3', 'LG1', 'LG2', 'LG3', 'XL1', 'XL2', 'XL3', 'XXL1', 'XXL2', 'XXL3');
  CREATE TYPE "public"."enum_product_list_section_properties_padding_top_mobile" AS ENUM('NONE', 'SM1', 'SM2', 'SM3', 'MD1', 'MD2', 'MD3', 'LG1', 'LG2', 'LG3', 'XL1', 'XL2', 'XL3', 'XXL1', 'XXL2', 'XXL3');
  CREATE TYPE "public"."enum_product_list_section_properties_padding_bottom" AS ENUM('NONE', 'SM1', 'SM2', 'SM3', 'MD1', 'MD2', 'MD3', 'LG1', 'LG2', 'LG3', 'XL1', 'XL2', 'XL3', 'XXL1', 'XXL2', 'XXL3');
  CREATE TYPE "public"."enum_product_list_section_properties_padding_bottom_mobile" AS ENUM('NONE', 'SM1', 'SM2', 'SM3', 'MD1', 'MD2', 'MD3', 'LG1', 'LG2', 'LG3', 'XL1', 'XL2', 'XL3', 'XXL1', 'XXL2', 'XXL3');
  CREATE TYPE "public"."enum_product_list_section_properties_background_color" AS ENUM('primary', 'secondary', 'alt');
  CREATE TYPE "public"."enum_product_list_section_properties_background_color_mobile" AS ENUM('primary', 'secondary', 'alt');
  CREATE TYPE "public"."enum_pages_blocks_contact_methods_type" AS ENUM('Email', 'Phone', 'Chat');
  CREATE TYPE "public"."enum_pages_blocks_contact_social_links_platform" AS ENUM('Instagram', 'Twitter', 'LinkedIn', 'Facebook');
  CREATE TYPE "public"."enum_pages_blocks_contact_properties_padding_top" AS ENUM('NONE', 'SM1', 'SM2', 'SM3', 'MD1', 'MD2', 'MD3', 'LG1', 'LG2', 'LG3', 'XL1', 'XL2', 'XL3', 'XXL1', 'XXL2', 'XXL3');
  CREATE TYPE "public"."enum_pages_blocks_contact_properties_padding_top_mobile" AS ENUM('NONE', 'SM1', 'SM2', 'SM3', 'MD1', 'MD2', 'MD3', 'LG1', 'LG2', 'LG3', 'XL1', 'XL2', 'XL3', 'XXL1', 'XXL2', 'XXL3');
  CREATE TYPE "public"."enum_pages_blocks_contact_properties_padding_bottom" AS ENUM('NONE', 'SM1', 'SM2', 'SM3', 'MD1', 'MD2', 'MD3', 'LG1', 'LG2', 'LG3', 'XL1', 'XL2', 'XL3', 'XXL1', 'XXL2', 'XXL3');
  CREATE TYPE "public"."enum_pages_blocks_contact_properties_padding_bottom_mobile" AS ENUM('NONE', 'SM1', 'SM2', 'SM3', 'MD1', 'MD2', 'MD3', 'LG1', 'LG2', 'LG3', 'XL1', 'XL2', 'XL3', 'XXL1', 'XXL2', 'XXL3');
  CREATE TYPE "public"."enum_pages_blocks_contact_properties_background_color" AS ENUM('primary', 'secondary', 'alt');
  CREATE TYPE "public"."enum_pages_blocks_contact_properties_background_color_mobile" AS ENUM('primary', 'secondary', 'alt');
  CREATE TYPE "public"."enum_orders_status" AS ENUM('placed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'failed');
  CREATE TYPE "public"."enum_orders_courier" AS ENUM('dtdc');
  CREATE TYPE "public"."enum_header_nav_items_type" AS ENUM('page', 'section');
  CREATE TYPE "public"."enum_header_nav_items_section" AS ENUM('hero', 'collectionGallery', 'depthDeckCarousel', 'productListSection', 'contact');
  CREATE TYPE "public"."enum_site_settings_social_links_platform" AS ENUM('Instagram', 'Twitter', 'LinkedIn', 'Facebook');
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"google_id" varchar,
  	"is_verified" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"_verified" boolean,
  	"_verificationtoken" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"type" "enum_media_type" DEFAULT 'product' NOT NULL,
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
  
  CREATE TABLE "products_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "products_variants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"color_id" integer,
  	"size_id" integer NOT NULL,
  	"sku" varchar,
  	"stock" numeric DEFAULT 0 NOT NULL
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"description" varchar,
  	"category_id" integer,
  	"price" numeric NOT NULL,
  	"sale_price" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "products_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "colors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"hex" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "sizes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages_blocks_hero_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"properties_padding_top" "enum_pages_blocks_hero_properties_padding_top" DEFAULT 'NONE',
  	"properties_padding_top_mobile" "enum_pages_blocks_hero_properties_padding_top_mobile" DEFAULT 'NONE',
  	"properties_padding_bottom" "enum_pages_blocks_hero_properties_padding_bottom" DEFAULT 'NONE',
  	"properties_padding_bottom_mobile" "enum_pages_blocks_hero_properties_padding_bottom_mobile" DEFAULT 'NONE',
  	"properties_background_color" "enum_pages_blocks_hero_properties_background_color" DEFAULT 'primary',
  	"properties_background_color_mobile" "enum_pages_blocks_hero_properties_background_color_mobile" DEFAULT 'primary',
  	"block_name" varchar
  );
  
  CREATE TABLE "collection_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"title" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "collection_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"properties_padding_top" "enum_collection_gallery_properties_padding_top" DEFAULT 'XXL2',
  	"properties_padding_top_mobile" "enum_collection_gallery_properties_padding_top_mobile" DEFAULT 'XL2',
  	"properties_padding_bottom" "enum_collection_gallery_properties_padding_bottom" DEFAULT 'XXL2',
  	"properties_padding_bottom_mobile" "enum_collection_gallery_properties_padding_bottom_mobile" DEFAULT 'XL3',
  	"properties_background_color" "enum_collection_gallery_properties_background_color" DEFAULT 'secondary',
  	"properties_background_color_mobile" "enum_collection_gallery_properties_background_color_mobile" DEFAULT 'secondary',
  	"block_name" varchar
  );
  
  CREATE TABLE "depth_deck_carousel_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "depth_deck_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"properties_padding_top" "enum_depth_deck_carousel_properties_padding_top" DEFAULT 'XXL2',
  	"properties_padding_top_mobile" "enum_depth_deck_carousel_properties_padding_top_mobile" DEFAULT 'XL2',
  	"properties_padding_bottom" "enum_depth_deck_carousel_properties_padding_bottom" DEFAULT 'XXL2',
  	"properties_padding_bottom_mobile" "enum_depth_deck_carousel_properties_padding_bottom_mobile" DEFAULT 'XL3',
  	"properties_background_color" "enum_depth_deck_carousel_properties_background_color" DEFAULT 'secondary',
  	"properties_background_color_mobile" "enum_depth_deck_carousel_properties_background_color_mobile" DEFAULT 'secondary',
  	"block_name" varchar
  );
  
  CREATE TABLE "product_list_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"properties_padding_top" "enum_product_list_section_properties_padding_top" DEFAULT 'XXL2',
  	"properties_padding_top_mobile" "enum_product_list_section_properties_padding_top_mobile" DEFAULT 'XL2',
  	"properties_padding_bottom" "enum_product_list_section_properties_padding_bottom" DEFAULT 'XXL2',
  	"properties_padding_bottom_mobile" "enum_product_list_section_properties_padding_bottom_mobile" DEFAULT 'XL3',
  	"properties_background_color" "enum_product_list_section_properties_background_color" DEFAULT 'secondary',
  	"properties_background_color_mobile" "enum_product_list_section_properties_background_color_mobile" DEFAULT 'secondary',
  	"tagline" varchar DEFAULT 'New Arrivals' NOT NULL,
  	"title_prefix" varchar DEFAULT 'Premium' NOT NULL,
  	"title_highlight" varchar DEFAULT 'Collection' NOT NULL,
  	"description" varchar DEFAULT 'Explore our latest pieces designed for modern living.' NOT NULL,
  	"button_text" varchar DEFAULT 'View All Products' NOT NULL,
  	"limit" numeric DEFAULT 20 NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_methods" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_pages_blocks_contact_methods_type" NOT NULL,
  	"value" varchar NOT NULL,
  	"href" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_pages_blocks_contact_social_links_platform" NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"properties_padding_top" "enum_pages_blocks_contact_properties_padding_top" DEFAULT 'XL2',
  	"properties_padding_top_mobile" "enum_pages_blocks_contact_properties_padding_top_mobile" DEFAULT 'NONE',
  	"properties_padding_bottom" "enum_pages_blocks_contact_properties_padding_bottom" DEFAULT 'XL2',
  	"properties_padding_bottom_mobile" "enum_pages_blocks_contact_properties_padding_bottom_mobile" DEFAULT 'NONE',
  	"properties_background_color" "enum_pages_blocks_contact_properties_background_color" DEFAULT 'primary',
  	"properties_background_color_mobile" "enum_pages_blocks_contact_properties_background_color_mobile" DEFAULT 'primary',
  	"badge" varchar DEFAULT 'Get In Touch' NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"cta_label" varchar DEFAULT 'Subscribe' NOT NULL,
  	"cta_href" varchar DEFAULT '#subscribe' NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "policies_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"content" varchar NOT NULL
  );
  
  CREATE TABLE "policies_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "policies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"last_updated" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "carts_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id_id" integer NOT NULL,
  	"quantity" numeric NOT NULL,
  	"size_id" integer,
  	"color_id" integer
  );
  
  CREATE TABLE "carts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"last_merged_guest_hash" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "wishlists_products" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id_id" integer NOT NULL,
  	"size_id" integer,
  	"color_id" integer
  );
  
  CREATE TABLE "wishlists" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "orders_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer NOT NULL,
  	"name" varchar NOT NULL,
  	"size_id" integer,
  	"color_id" integer,
  	"price" numeric NOT NULL,
  	"quantity" numeric NOT NULL
  );
  
  CREATE TABLE "orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order_id" varchar NOT NULL,
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
  	"total" numeric NOT NULL,
  	"status" "enum_orders_status" DEFAULT 'placed' NOT NULL,
  	"courier" "enum_orders_courier" DEFAULT 'dtdc',
  	"awb_number" varchar,
  	"tracking_url" varchar,
  	"razorpay_order_id" varchar,
  	"razorpay_payment_id" varchar,
  	"razorpay_signature" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"products_id" integer,
  	"categories_id" integer,
  	"tags_id" integer,
  	"colors_id" integer,
  	"sizes_id" integer,
  	"pages_id" integer,
  	"policies_id" integer,
  	"carts_id" integer,
  	"wishlists_id" integer,
  	"orders_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "header_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_header_nav_items_type" DEFAULT 'page',
  	"link_id" integer,
  	"section" "enum_header_nav_items_section",
  	"label" varchar
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_policies_group_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_id" integer NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "footer_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "footer_contact_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"time" varchar
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"policies_group_title" varchar,
  	"contact_title" varchar,
  	"contact_email" varchar,
  	"contact_phone" varchar,
  	"copyright_year" varchar,
  	"copyright_brand" varchar,
  	"copyright_text" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "pdp_static_trust_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "pdp_static_accordions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"content" varchar NOT NULL
  );
  
  CREATE TABLE "pdp_static" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"shipping_title" varchar NOT NULL,
  	"shipping_description" varchar NOT NULL,
  	"returns_title" varchar NOT NULL,
  	"returns_description" varchar NOT NULL,
  	"size_guide_title" varchar NOT NULL,
  	"size_guide_description" varchar NOT NULL,
  	"size_chart_image_id" integer NOT NULL,
  	"size_chart_description" varchar NOT NULL,
  	"cta_add_to_cart" varchar NOT NULL,
  	"cta_buy_now" varchar NOT NULL,
  	"cta_added_to_cart" varchar NOT NULL,
  	"cta_already_in_cart" varchar NOT NULL,
  	"cta_out_of_stock" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_settings_social_links_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'Wear Wine' NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_images" ADD CONSTRAINT "products_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_images" ADD CONSTRAINT "products_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_variants" ADD CONSTRAINT "products_variants_color_id_colors_id_fk" FOREIGN KEY ("color_id") REFERENCES "public"."colors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_variants" ADD CONSTRAINT "products_variants_size_id_sizes_id_fk" FOREIGN KEY ("size_id") REFERENCES "public"."sizes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_variants" ADD CONSTRAINT "products_variants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_slides" ADD CONSTRAINT "pages_blocks_hero_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_slides" ADD CONSTRAINT "pages_blocks_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collection_gallery_images" ADD CONSTRAINT "collection_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "collection_gallery_images" ADD CONSTRAINT "collection_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."collection_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "collection_gallery" ADD CONSTRAINT "collection_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "depth_deck_carousel_cards" ADD CONSTRAINT "depth_deck_carousel_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "depth_deck_carousel_cards" ADD CONSTRAINT "depth_deck_carousel_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."depth_deck_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "depth_deck_carousel" ADD CONSTRAINT "depth_deck_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_list_section" ADD CONSTRAINT "product_list_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_methods" ADD CONSTRAINT "pages_blocks_contact_methods_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_social_links" ADD CONSTRAINT "pages_blocks_contact_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact" ADD CONSTRAINT "pages_blocks_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "policies_sections" ADD CONSTRAINT "policies_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."policies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "policies_faqs" ADD CONSTRAINT "policies_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."policies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "carts_items" ADD CONSTRAINT "carts_items_product_id_id_products_id_fk" FOREIGN KEY ("product_id_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "carts_items" ADD CONSTRAINT "carts_items_size_id_sizes_id_fk" FOREIGN KEY ("size_id") REFERENCES "public"."sizes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "carts_items" ADD CONSTRAINT "carts_items_color_id_colors_id_fk" FOREIGN KEY ("color_id") REFERENCES "public"."colors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "carts_items" ADD CONSTRAINT "carts_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."carts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "wishlists_products" ADD CONSTRAINT "wishlists_products_product_id_id_products_id_fk" FOREIGN KEY ("product_id_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "wishlists_products" ADD CONSTRAINT "wishlists_products_size_id_sizes_id_fk" FOREIGN KEY ("size_id") REFERENCES "public"."sizes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "wishlists_products" ADD CONSTRAINT "wishlists_products_color_id_colors_id_fk" FOREIGN KEY ("color_id") REFERENCES "public"."colors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "wishlists_products" ADD CONSTRAINT "wishlists_products_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."wishlists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_size_id_sizes_id_fk" FOREIGN KEY ("size_id") REFERENCES "public"."sizes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_color_id_colors_id_fk" FOREIGN KEY ("color_id") REFERENCES "public"."colors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_colors_fk" FOREIGN KEY ("colors_id") REFERENCES "public"."colors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sizes_fk" FOREIGN KEY ("sizes_id") REFERENCES "public"."sizes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_policies_fk" FOREIGN KEY ("policies_id") REFERENCES "public"."policies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_carts_fk" FOREIGN KEY ("carts_id") REFERENCES "public"."carts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_wishlists_fk" FOREIGN KEY ("wishlists_id") REFERENCES "public"."wishlists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_link_id_pages_id_fk" FOREIGN KEY ("link_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_policies_group_links" ADD CONSTRAINT "footer_policies_group_links_link_id_policies_id_fk" FOREIGN KEY ("link_id") REFERENCES "public"."policies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_policies_group_links" ADD CONSTRAINT "footer_policies_group_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_socials" ADD CONSTRAINT "footer_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_contact_hours" ADD CONSTRAINT "footer_contact_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pdp_static_trust_badges" ADD CONSTRAINT "pdp_static_trust_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pdp_static"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pdp_static_accordions" ADD CONSTRAINT "pdp_static_accordions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pdp_static"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pdp_static" ADD CONSTRAINT "pdp_static_size_chart_image_id_media_id_fk" FOREIGN KEY ("size_chart_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_social_links" ADD CONSTRAINT "site_settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "users_google_id_idx" ON "users" USING btree ("google_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "products_images_order_idx" ON "products_images" USING btree ("_order");
  CREATE INDEX "products_images_parent_id_idx" ON "products_images" USING btree ("_parent_id");
  CREATE INDEX "products_images_image_idx" ON "products_images" USING btree ("image_id");
  CREATE INDEX "products_variants_order_idx" ON "products_variants" USING btree ("_order");
  CREATE INDEX "products_variants_parent_id_idx" ON "products_variants" USING btree ("_parent_id");
  CREATE INDEX "products_variants_color_idx" ON "products_variants" USING btree ("color_id");
  CREATE INDEX "products_variants_size_idx" ON "products_variants" USING btree ("size_id");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX "products_category_idx" ON "products" USING btree ("category_id");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "products_rels_order_idx" ON "products_rels" USING btree ("order");
  CREATE INDEX "products_rels_parent_idx" ON "products_rels" USING btree ("parent_id");
  CREATE INDEX "products_rels_path_idx" ON "products_rels" USING btree ("path");
  CREATE INDEX "products_rels_tags_id_idx" ON "products_rels" USING btree ("tags_id");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_image_idx" ON "categories" USING btree ("image_id");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "tags_slug_idx" ON "tags" USING btree ("slug");
  CREATE INDEX "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at");
  CREATE INDEX "colors_updated_at_idx" ON "colors" USING btree ("updated_at");
  CREATE INDEX "colors_created_at_idx" ON "colors" USING btree ("created_at");
  CREATE UNIQUE INDEX "sizes_value_idx" ON "sizes" USING btree ("value");
  CREATE INDEX "sizes_updated_at_idx" ON "sizes" USING btree ("updated_at");
  CREATE INDEX "sizes_created_at_idx" ON "sizes" USING btree ("created_at");
  CREATE INDEX "pages_blocks_hero_slides_order_idx" ON "pages_blocks_hero_slides" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_slides_parent_id_idx" ON "pages_blocks_hero_slides" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_slides_image_idx" ON "pages_blocks_hero_slides" USING btree ("image_id");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "collection_gallery_images_order_idx" ON "collection_gallery_images" USING btree ("_order");
  CREATE INDEX "collection_gallery_images_parent_id_idx" ON "collection_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "collection_gallery_images_image_idx" ON "collection_gallery_images" USING btree ("image_id");
  CREATE INDEX "collection_gallery_order_idx" ON "collection_gallery" USING btree ("_order");
  CREATE INDEX "collection_gallery_parent_id_idx" ON "collection_gallery" USING btree ("_parent_id");
  CREATE INDEX "collection_gallery_path_idx" ON "collection_gallery" USING btree ("_path");
  CREATE INDEX "depth_deck_carousel_cards_order_idx" ON "depth_deck_carousel_cards" USING btree ("_order");
  CREATE INDEX "depth_deck_carousel_cards_parent_id_idx" ON "depth_deck_carousel_cards" USING btree ("_parent_id");
  CREATE INDEX "depth_deck_carousel_cards_image_idx" ON "depth_deck_carousel_cards" USING btree ("image_id");
  CREATE INDEX "depth_deck_carousel_order_idx" ON "depth_deck_carousel" USING btree ("_order");
  CREATE INDEX "depth_deck_carousel_parent_id_idx" ON "depth_deck_carousel" USING btree ("_parent_id");
  CREATE INDEX "depth_deck_carousel_path_idx" ON "depth_deck_carousel" USING btree ("_path");
  CREATE INDEX "product_list_section_order_idx" ON "product_list_section" USING btree ("_order");
  CREATE INDEX "product_list_section_parent_id_idx" ON "product_list_section" USING btree ("_parent_id");
  CREATE INDEX "product_list_section_path_idx" ON "product_list_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_contact_methods_order_idx" ON "pages_blocks_contact_methods" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_methods_parent_id_idx" ON "pages_blocks_contact_methods" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_social_links_order_idx" ON "pages_blocks_contact_social_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_social_links_parent_id_idx" ON "pages_blocks_contact_social_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_order_idx" ON "pages_blocks_contact" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_parent_id_idx" ON "pages_blocks_contact" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_path_idx" ON "pages_blocks_contact" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "policies_sections_order_idx" ON "policies_sections" USING btree ("_order");
  CREATE INDEX "policies_sections_parent_id_idx" ON "policies_sections" USING btree ("_parent_id");
  CREATE INDEX "policies_faqs_order_idx" ON "policies_faqs" USING btree ("_order");
  CREATE INDEX "policies_faqs_parent_id_idx" ON "policies_faqs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "policies_slug_idx" ON "policies" USING btree ("slug");
  CREATE INDEX "policies_updated_at_idx" ON "policies" USING btree ("updated_at");
  CREATE INDEX "policies_created_at_idx" ON "policies" USING btree ("created_at");
  CREATE INDEX "carts_items_order_idx" ON "carts_items" USING btree ("_order");
  CREATE INDEX "carts_items_parent_id_idx" ON "carts_items" USING btree ("_parent_id");
  CREATE INDEX "carts_items_product_id_idx" ON "carts_items" USING btree ("product_id_id");
  CREATE INDEX "carts_items_size_idx" ON "carts_items" USING btree ("size_id");
  CREATE INDEX "carts_items_color_idx" ON "carts_items" USING btree ("color_id");
  CREATE UNIQUE INDEX "carts_user_idx" ON "carts" USING btree ("user_id");
  CREATE INDEX "carts_updated_at_idx" ON "carts" USING btree ("updated_at");
  CREATE INDEX "carts_created_at_idx" ON "carts" USING btree ("created_at");
  CREATE INDEX "wishlists_products_order_idx" ON "wishlists_products" USING btree ("_order");
  CREATE INDEX "wishlists_products_parent_id_idx" ON "wishlists_products" USING btree ("_parent_id");
  CREATE INDEX "wishlists_products_product_id_idx" ON "wishlists_products" USING btree ("product_id_id");
  CREATE INDEX "wishlists_products_size_idx" ON "wishlists_products" USING btree ("size_id");
  CREATE INDEX "wishlists_products_color_idx" ON "wishlists_products" USING btree ("color_id");
  CREATE UNIQUE INDEX "wishlists_user_idx" ON "wishlists" USING btree ("user_id");
  CREATE INDEX "wishlists_updated_at_idx" ON "wishlists" USING btree ("updated_at");
  CREATE INDEX "wishlists_created_at_idx" ON "wishlists" USING btree ("created_at");
  CREATE INDEX "orders_items_order_idx" ON "orders_items" USING btree ("_order");
  CREATE INDEX "orders_items_parent_id_idx" ON "orders_items" USING btree ("_parent_id");
  CREATE INDEX "orders_items_product_idx" ON "orders_items" USING btree ("product_id");
  CREATE INDEX "orders_items_size_idx" ON "orders_items" USING btree ("size_id");
  CREATE INDEX "orders_items_color_idx" ON "orders_items" USING btree ("color_id");
  CREATE UNIQUE INDEX "orders_order_id_idx" ON "orders" USING btree ("order_id");
  CREATE INDEX "orders_user_idx" ON "orders" USING btree ("user_id");
  CREATE INDEX "orders_email_idx" ON "orders" USING btree ("email");
  CREATE INDEX "orders_razorpay_order_id_idx" ON "orders" USING btree ("razorpay_order_id");
  CREATE INDEX "orders_updated_at_idx" ON "orders" USING btree ("updated_at");
  CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");
  CREATE INDEX "payload_locked_documents_rels_colors_id_idx" ON "payload_locked_documents_rels" USING btree ("colors_id");
  CREATE INDEX "payload_locked_documents_rels_sizes_id_idx" ON "payload_locked_documents_rels" USING btree ("sizes_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_policies_id_idx" ON "payload_locked_documents_rels" USING btree ("policies_id");
  CREATE INDEX "payload_locked_documents_rels_carts_id_idx" ON "payload_locked_documents_rels" USING btree ("carts_id");
  CREATE INDEX "payload_locked_documents_rels_wishlists_id_idx" ON "payload_locked_documents_rels" USING btree ("wishlists_id");
  CREATE INDEX "payload_locked_documents_rels_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("orders_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "header_nav_items_order_idx" ON "header_nav_items" USING btree ("_order");
  CREATE INDEX "header_nav_items_parent_id_idx" ON "header_nav_items" USING btree ("_parent_id");
  CREATE INDEX "header_nav_items_link_idx" ON "header_nav_items" USING btree ("link_id");
  CREATE INDEX "footer_policies_group_links_order_idx" ON "footer_policies_group_links" USING btree ("_order");
  CREATE INDEX "footer_policies_group_links_parent_id_idx" ON "footer_policies_group_links" USING btree ("_parent_id");
  CREATE INDEX "footer_policies_group_links_link_idx" ON "footer_policies_group_links" USING btree ("link_id");
  CREATE INDEX "footer_socials_order_idx" ON "footer_socials" USING btree ("_order");
  CREATE INDEX "footer_socials_parent_id_idx" ON "footer_socials" USING btree ("_parent_id");
  CREATE INDEX "footer_contact_hours_order_idx" ON "footer_contact_hours" USING btree ("_order");
  CREATE INDEX "footer_contact_hours_parent_id_idx" ON "footer_contact_hours" USING btree ("_parent_id");
  CREATE INDEX "pdp_static_trust_badges_order_idx" ON "pdp_static_trust_badges" USING btree ("_order");
  CREATE INDEX "pdp_static_trust_badges_parent_id_idx" ON "pdp_static_trust_badges" USING btree ("_parent_id");
  CREATE INDEX "pdp_static_accordions_order_idx" ON "pdp_static_accordions" USING btree ("_order");
  CREATE INDEX "pdp_static_accordions_parent_id_idx" ON "pdp_static_accordions" USING btree ("_parent_id");
  CREATE INDEX "pdp_static_size_chart_size_chart_image_idx" ON "pdp_static" USING btree ("size_chart_image_id");
  CREATE INDEX "site_settings_social_links_order_idx" ON "site_settings_social_links" USING btree ("_order");
  CREATE INDEX "site_settings_social_links_parent_id_idx" ON "site_settings_social_links" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "products_images" CASCADE;
  DROP TABLE "products_variants" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_rels" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "tags" CASCADE;
  DROP TABLE "colors" CASCADE;
  DROP TABLE "sizes" CASCADE;
  DROP TABLE "pages_blocks_hero_slides" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "collection_gallery_images" CASCADE;
  DROP TABLE "collection_gallery" CASCADE;
  DROP TABLE "depth_deck_carousel_cards" CASCADE;
  DROP TABLE "depth_deck_carousel" CASCADE;
  DROP TABLE "product_list_section" CASCADE;
  DROP TABLE "pages_blocks_contact_methods" CASCADE;
  DROP TABLE "pages_blocks_contact_social_links" CASCADE;
  DROP TABLE "pages_blocks_contact" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "policies_sections" CASCADE;
  DROP TABLE "policies_faqs" CASCADE;
  DROP TABLE "policies" CASCADE;
  DROP TABLE "carts_items" CASCADE;
  DROP TABLE "carts" CASCADE;
  DROP TABLE "wishlists_products" CASCADE;
  DROP TABLE "wishlists" CASCADE;
  DROP TABLE "orders_items" CASCADE;
  DROP TABLE "orders" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "header_nav_items" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "footer_policies_group_links" CASCADE;
  DROP TABLE "footer_socials" CASCADE;
  DROP TABLE "footer_contact_hours" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "pdp_static_trust_badges" CASCADE;
  DROP TABLE "pdp_static_accordions" CASCADE;
  DROP TABLE "pdp_static" CASCADE;
  DROP TABLE "site_settings_social_links" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_media_type";
  DROP TYPE "public"."enum_pages_blocks_hero_properties_padding_top";
  DROP TYPE "public"."enum_pages_blocks_hero_properties_padding_top_mobile";
  DROP TYPE "public"."enum_pages_blocks_hero_properties_padding_bottom";
  DROP TYPE "public"."enum_pages_blocks_hero_properties_padding_bottom_mobile";
  DROP TYPE "public"."enum_pages_blocks_hero_properties_background_color";
  DROP TYPE "public"."enum_pages_blocks_hero_properties_background_color_mobile";
  DROP TYPE "public"."enum_collection_gallery_properties_padding_top";
  DROP TYPE "public"."enum_collection_gallery_properties_padding_top_mobile";
  DROP TYPE "public"."enum_collection_gallery_properties_padding_bottom";
  DROP TYPE "public"."enum_collection_gallery_properties_padding_bottom_mobile";
  DROP TYPE "public"."enum_collection_gallery_properties_background_color";
  DROP TYPE "public"."enum_collection_gallery_properties_background_color_mobile";
  DROP TYPE "public"."enum_depth_deck_carousel_properties_padding_top";
  DROP TYPE "public"."enum_depth_deck_carousel_properties_padding_top_mobile";
  DROP TYPE "public"."enum_depth_deck_carousel_properties_padding_bottom";
  DROP TYPE "public"."enum_depth_deck_carousel_properties_padding_bottom_mobile";
  DROP TYPE "public"."enum_depth_deck_carousel_properties_background_color";
  DROP TYPE "public"."enum_depth_deck_carousel_properties_background_color_mobile";
  DROP TYPE "public"."enum_product_list_section_properties_padding_top";
  DROP TYPE "public"."enum_product_list_section_properties_padding_top_mobile";
  DROP TYPE "public"."enum_product_list_section_properties_padding_bottom";
  DROP TYPE "public"."enum_product_list_section_properties_padding_bottom_mobile";
  DROP TYPE "public"."enum_product_list_section_properties_background_color";
  DROP TYPE "public"."enum_product_list_section_properties_background_color_mobile";
  DROP TYPE "public"."enum_pages_blocks_contact_methods_type";
  DROP TYPE "public"."enum_pages_blocks_contact_social_links_platform";
  DROP TYPE "public"."enum_pages_blocks_contact_properties_padding_top";
  DROP TYPE "public"."enum_pages_blocks_contact_properties_padding_top_mobile";
  DROP TYPE "public"."enum_pages_blocks_contact_properties_padding_bottom";
  DROP TYPE "public"."enum_pages_blocks_contact_properties_padding_bottom_mobile";
  DROP TYPE "public"."enum_pages_blocks_contact_properties_background_color";
  DROP TYPE "public"."enum_pages_blocks_contact_properties_background_color_mobile";
  DROP TYPE "public"."enum_orders_status";
  DROP TYPE "public"."enum_orders_courier";
  DROP TYPE "public"."enum_header_nav_items_type";
  DROP TYPE "public"."enum_header_nav_items_section";
  DROP TYPE "public"."enum_site_settings_social_links_platform";`)
}
