-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."language_code" AS ENUM('russian', 'english', 'ukrainian', 'turkish', 'portuguese');--> statement-breakpoint
CREATE TYPE "public"."part_of_speech_enum" AS ENUM('noun', 'verb', 'adjective', 'personal pronoun', 'demonstrative pronoun', 'other');--> statement-breakpoint
CREATE TABLE "user_settings" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_id" uuid NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"native_language" "language_code",
	"created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
	CONSTRAINT "user_settings_user_id_key" UNIQUE("user_id"),
	CONSTRAINT "user_settings_email_check" CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text)
);
--> statement-breakpoint
ALTER TABLE "user_settings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "user_word_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"word_id" uuid NOT NULL,
	"easiness_factor" numeric(3, 2) DEFAULT '2.50',
	"interval_days" integer DEFAULT 1,
	"repetition_count" integer DEFAULT 0,
	"next_review_date" timestamp with time zone DEFAULT now(),
	"last_reviewed_at" timestamp with time zone,
	"total_reviews" integer DEFAULT 0,
	"correct_reviews" integer DEFAULT 0,
	"consecutive_correct" integer DEFAULT 0,
	"quality_scores" jsonb DEFAULT '[]'::jsonb,
	"status" text DEFAULT 'new',
	"is_archived" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "user_word_progress_user_id_word_id_key" UNIQUE("user_id","word_id"),
	CONSTRAINT "user_word_progress_status_check" CHECK (status = ANY (ARRAY['new'::text, 'learning'::text, 'review'::text, 'graduated'::text, 'lapsed'::text]))
);
--> statement-breakpoint
ALTER TABLE "user_word_progress" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "words" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_id" uuid NOT NULL,
	"normalized_word" text NOT NULL,
	"part_of_speech" "part_of_speech_enum" NOT NULL,
	"common_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"part_specific_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
	"target_language" "language_code" DEFAULT 'english' NOT NULL,
	CONSTRAINT "words_normalized_word_check" CHECK (length(normalized_word) > 0)
);
--> statement-breakpoint
ALTER TABLE "words" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_word_progress" ADD CONSTRAINT "user_word_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_word_progress" ADD CONSTRAINT "user_word_progress_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "public"."words"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "words" ADD CONSTRAINT "words_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_user_word_progress_next_review" ON "user_word_progress" USING btree ("user_id" timestamptz_ops,"next_review_date" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_user_word_progress_status" ON "user_word_progress" USING btree ("user_id" uuid_ops,"status" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_user_word_progress_user_id" ON "user_word_progress" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_words_cache_lookup" ON "words" USING btree ("normalized_word" enum_ops,"part_of_speech" text_ops,"target_language" enum_ops);--> statement-breakpoint
CREATE INDEX "idx_words_common_data_gin" ON "words" USING gin ("common_data" jsonb_ops);--> statement-breakpoint
CREATE INDEX "idx_words_normalized_word" ON "words" USING btree ("normalized_word" text_ops);--> statement-breakpoint
CREATE INDEX "idx_words_part_of_speech" ON "words" USING btree ("part_of_speech" enum_ops);--> statement-breakpoint
CREATE INDEX "idx_words_part_specific_data_gin" ON "words" USING gin ("part_specific_data" jsonb_ops);--> statement-breakpoint
CREATE INDEX "idx_words_search" ON "words" USING gin (to_tsvector('simple'::regconfig, normalized_word) tsvector_ops);--> statement-breakpoint
CREATE INDEX "idx_words_target_language" ON "words" USING btree ("target_language" enum_ops);--> statement-breakpoint
CREATE INDEX "idx_words_user_id" ON "words" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "idx_words_user_normalized_target_unique" ON "words" USING btree ("user_id" text_ops,"normalized_word" uuid_ops,"target_language" enum_ops);--> statement-breakpoint
CREATE INDEX "idx_words_user_word_lookup" ON "words" USING btree ("user_id" uuid_ops,"normalized_word" uuid_ops);--> statement-breakpoint
CREATE VIEW "public"."word_cache" AS (SELECT DISTINCT ON (words.normalized_word, words.part_of_speech, words.target_language) words.id, words.normalized_word, words.part_of_speech, words.target_language, words.common_data, words.part_specific_data, words.created_at FROM words ORDER BY words.normalized_word, words.part_of_speech, words.target_language, words.created_at);--> statement-breakpoint
CREATE POLICY "user_settings_update_own" ON "user_settings" AS PERMISSIVE FOR UPDATE TO public USING ((( SELECT auth.uid() AS uid) = user_id));--> statement-breakpoint
CREATE POLICY "user_settings_select_own" ON "user_settings" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Users can delete their own word progress" ON "user_word_progress" AS PERMISSIVE FOR DELETE TO public USING ((auth.uid() = user_id));--> statement-breakpoint
CREATE POLICY "Users can update their own word progress" ON "user_word_progress" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "Users can insert their own word progress" ON "user_word_progress" AS PERMISSIVE FOR INSERT TO public;--> statement-breakpoint
CREATE POLICY "Users can view their own word progress" ON "user_word_progress" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "words_delete_own" ON "words" AS PERMISSIVE FOR DELETE TO public USING ((( SELECT auth.uid() AS uid) = user_id));--> statement-breakpoint
CREATE POLICY "words_update_own" ON "words" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "words_insert_own" ON "words" AS PERMISSIVE FOR INSERT TO public;--> statement-breakpoint
CREATE POLICY "words_select_own_or_cache" ON "words" AS PERMISSIVE FOR SELECT TO public;
*/