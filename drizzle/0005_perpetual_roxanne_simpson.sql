ALTER TABLE "user_word_progress" DROP CONSTRAINT "user_word_progress_word_id_fkey";
--> statement-breakpoint
ALTER TABLE "user_word_progress" ADD CONSTRAINT "user_word_progress_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "public"."vocabulary_items"("id") ON DELETE cascade ON UPDATE no action;