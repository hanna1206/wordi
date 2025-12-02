CREATE INDEX "idx_collection_vocab_collection_item" ON "collection_vocabulary_items" USING btree ("collection_id","vocabulary_item_id");--> statement-breakpoint
CREATE INDEX "idx_vocabulary_items_user_created_desc" ON "vocabulary_items" USING btree ("user_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "idx_vocabulary_items_user_sortable_asc" ON "vocabulary_items" USING btree ("user_id","sortable_text");--> statement-breakpoint
CREATE INDEX "idx_vocabulary_items_user_visible_created" ON "vocabulary_items" USING btree ("user_id","is_hidden","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "idx_vocabulary_items_user_visible_sortable" ON "vocabulary_items" USING btree ("user_id","is_hidden","sortable_text");--> statement-breakpoint
CREATE INDEX "idx_vocabulary_items_user_type_hidden" ON "vocabulary_items" USING btree ("user_id","type","is_hidden");--> statement-breakpoint
CREATE INDEX "idx_vocabulary_items_user_type_hidden_created" ON "vocabulary_items" USING btree ("user_id","type","is_hidden","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "idx_vocabulary_items_user_pos_hidden" ON "vocabulary_items" USING btree ("user_id","part_of_speech","is_hidden");--> statement-breakpoint
CREATE INDEX "idx_vocabulary_items_user_hidden_type_created" ON "vocabulary_items" USING btree ("user_id","is_hidden","type","created_at" DESC NULLS LAST);