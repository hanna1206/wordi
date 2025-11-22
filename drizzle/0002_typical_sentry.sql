-- Add sortable_word column (nullable first)
ALTER TABLE "words" ADD COLUMN "sortable_word" text;--> statement-breakpoint

-- Populate sortable_word by removing German articles
UPDATE "words" 
SET "sortable_word" = 
  CASE 
    WHEN LOWER("normalized_word") LIKE 'der %' THEN SUBSTRING("normalized_word" FROM 5)
    WHEN LOWER("normalized_word") LIKE 'die %' THEN SUBSTRING("normalized_word" FROM 5)
    WHEN LOWER("normalized_word") LIKE 'das %' THEN SUBSTRING("normalized_word" FROM 5)
    ELSE "normalized_word"
  END;--> statement-breakpoint

-- Make column NOT NULL after populating
ALTER TABLE "words" ALTER COLUMN "sortable_word" SET NOT NULL;--> statement-breakpoint

-- Create index
CREATE INDEX "idx_words_sortable_word" ON "words" USING btree ("sortable_word");