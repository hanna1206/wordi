ALTER TABLE "words" ADD COLUMN "is_hidden" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX "idx_words_is_hidden" ON "words" USING btree ("is_hidden");--> statement-breakpoint
CREATE INDEX "idx_words_user_hidden" ON "words" USING btree ("user_id","is_hidden");