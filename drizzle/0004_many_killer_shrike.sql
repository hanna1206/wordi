CREATE TABLE "collection_vocabulary_items" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"collection_id" uuid NOT NULL,
	"vocabulary_item_id" uuid NOT NULL,
	"added_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collections" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
--> statement-breakpoint
DROP VIEW "public"."vocabulary_cache";--> statement-breakpoint
ALTER TABLE "collection_vocabulary_items" ADD CONSTRAINT "collection_vocabulary_items_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_vocabulary_items" ADD CONSTRAINT "collection_vocabulary_items_vocabulary_item_id_vocabulary_items_id_fk" FOREIGN KEY ("vocabulary_item_id") REFERENCES "public"."vocabulary_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_collection_vocab_collection_id" ON "collection_vocabulary_items" USING btree ("collection_id");--> statement-breakpoint
CREATE INDEX "idx_collection_vocab_vocabulary_id" ON "collection_vocabulary_items" USING btree ("vocabulary_item_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_collection_vocab_unique" ON "collection_vocabulary_items" USING btree ("collection_id","vocabulary_item_id");--> statement-breakpoint
CREATE INDEX "idx_collections_user_id" ON "collections" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_collections_user_name_unique" ON "collections" USING btree ("user_id","name");--> statement-breakpoint
CREATE VIEW "public"."vocabulary_cache" AS (SELECT DISTINCT ON (vocabulary_items.normalized_text, vocabulary_items.part_of_speech, vocabulary_items.target_language) vocabulary_items.id, vocabulary_items.normalized_text, vocabulary_items.part_of_speech, vocabulary_items.target_language, vocabulary_items.common_data, vocabulary_items.specific_data, vocabulary_items.created_at, vocabulary_items.type FROM vocabulary_items ORDER BY vocabulary_items.normalized_text, vocabulary_items.part_of_speech, vocabulary_items.target_language, vocabulary_items.created_at);