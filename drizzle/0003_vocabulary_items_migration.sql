-- Migration: Rename words table to vocabulary_items and add type discriminator
-- This migration transforms the schema to support both words and collocations

-- Create vocabulary_item_type enum
DO $$ BEGIN
  CREATE TYPE "vocabulary_item_type" AS ENUM('word', 'collocation');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint

-- Drop foreign key constraint from user_word_progress before renaming table
ALTER TABLE "user_word_progress" DROP CONSTRAINT IF EXISTS "user_word_progress_word_id_fkey";--> statement-breakpoint

-- Rename table from words to vocabulary_items
ALTER TABLE "words" RENAME TO "vocabulary_items";--> statement-breakpoint

-- Add type column with default 'word' for existing records
ALTER TABLE "vocabulary_items" ADD COLUMN "type" "vocabulary_item_type" DEFAULT 'word' NOT NULL;--> statement-breakpoint

-- Rename columns
ALTER TABLE "vocabulary_items" RENAME COLUMN "normalized_word" TO "normalized_text";--> statement-breakpoint
ALTER TABLE "vocabulary_items" RENAME COLUMN "sortable_word" TO "sortable_text";--> statement-breakpoint
ALTER TABLE "vocabulary_items" RENAME COLUMN "part_specific_data" TO "specific_data";--> statement-breakpoint

-- Drop old indexes
DROP INDEX IF EXISTS "idx_words_cache_lookup";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_words_common_data_gin";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_words_part_specific_data_gin";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_words_search";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_words_normalized_word";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_words_sortable_word";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_words_part_of_speech";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_words_target_language";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_words_user_id";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_words_user_word_lookup";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_words_is_hidden";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_words_user_hidden";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_words_user_normalized_target_unique";--> statement-breakpoint

-- Drop old check constraint
ALTER TABLE "vocabulary_items" DROP CONSTRAINT IF EXISTS "words_normalized_word_check";--> statement-breakpoint

-- Create new indexes with updated column names
CREATE INDEX "idx_vocabulary_items_type" ON "vocabulary_items" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_vocabulary_items_cache_lookup" ON "vocabulary_items" USING btree ("normalized_text", "part_of_speech", "target_language");--> statement-breakpoint
CREATE INDEX "idx_vocabulary_items_common_data_gin" ON "vocabulary_items" USING gin ("common_data");--> statement-breakpoint
CREATE INDEX "idx_vocabulary_items_specific_data_gin" ON "vocabulary_items" USING gin ("specific_data");--> statement-breakpoint
CREATE INDEX "idx_vocabulary_items_search" ON "vocabulary_items" USING gin (to_tsvector('simple'::regconfig, "normalized_text"));--> statement-breakpoint
CREATE INDEX "idx_vocabulary_items_normalized_text" ON "vocabulary_items" USING btree ("normalized_text");--> statement-breakpoint
CREATE INDEX "idx_vocabulary_items_sortable_text" ON "vocabulary_items" USING btree ("sortable_text");--> statement-breakpoint
CREATE INDEX "idx_vocabulary_items_part_of_speech" ON "vocabulary_items" USING btree ("part_of_speech");--> statement-breakpoint
CREATE INDEX "idx_vocabulary_items_target_language" ON "vocabulary_items" USING btree ("target_language");--> statement-breakpoint
CREATE INDEX "idx_vocabulary_items_user_id" ON "vocabulary_items" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_vocabulary_items_user_text_lookup" ON "vocabulary_items" USING btree ("user_id", "normalized_text");--> statement-breakpoint
CREATE INDEX "idx_vocabulary_items_user_type" ON "vocabulary_items" USING btree ("user_id", "type");--> statement-breakpoint
CREATE INDEX "idx_vocabulary_items_is_hidden" ON "vocabulary_items" USING btree ("is_hidden");--> statement-breakpoint
CREATE INDEX "idx_vocabulary_items_user_hidden" ON "vocabulary_items" USING btree ("user_id", "is_hidden");--> statement-breakpoint

-- Create new unique constraint
CREATE UNIQUE INDEX "idx_vocabulary_items_user_normalized_target_unique" ON "vocabulary_items" ("user_id", "normalized_text", "target_language");--> statement-breakpoint

-- Add new check constraint
ALTER TABLE "vocabulary_items" ADD CONSTRAINT "vocabulary_items_normalized_text_check" CHECK (length("normalized_text") > 0);--> statement-breakpoint

-- Drop old view
DROP VIEW IF EXISTS "word_cache";--> statement-breakpoint

-- Create new vocabulary_cache view
CREATE VIEW "vocabulary_cache" AS 
  SELECT DISTINCT ON ("normalized_text", "part_of_speech", "target_language")
    "id", 
    "normalized_text", 
    "part_of_speech", 
    "target_language", 
    "common_data", 
    "specific_data", 
    "created_at",
    "type"
  FROM "vocabulary_items"
  ORDER BY "normalized_text", "part_of_speech", "target_language", "created_at";--> statement-breakpoint

-- Recreate foreign key constraint from user_word_progress to vocabulary_items
ALTER TABLE "user_word_progress" ADD CONSTRAINT "user_word_progress_word_id_fkey" 
  FOREIGN KEY ("word_id") REFERENCES "vocabulary_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
