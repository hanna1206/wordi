-- Add new language codes to the existing enum
ALTER TYPE language_code ADD VALUE 'turkish';
ALTER TYPE language_code ADD VALUE 'portuguese';

-- Add target_language column to words table
-- First add as nullable to avoid conflicts with existing data
ALTER TABLE public.words 
ADD COLUMN target_language language_code;

-- Update existing words to match their user's native language where possible
UPDATE public.words 
SET target_language = COALESCE(
  (SELECT us.native_language 
   FROM public.user_settings us 
   WHERE us.user_id = words.user_id),
  'english'::language_code
);

-- Now make the column NOT NULL with proper default
ALTER TABLE public.words 
ALTER COLUMN target_language SET NOT NULL,
ALTER COLUMN target_language SET DEFAULT 'english';

-- Create index for target language filtering
CREATE INDEX idx_words_target_language ON public.words(target_language);

-- Create composite index for cache lookups by word + target language
CREATE INDEX idx_words_cache_lookup ON public.words(normalized_word, part_of_speech, target_language);

-- Update the unique constraint to include target language
-- This allows the same word to exist multiple times for different target languages
DROP INDEX idx_words_user_normalized_unique;
CREATE UNIQUE INDEX idx_words_user_normalized_target_unique 
ON public.words(user_id, normalized_word, target_language);

-- Update the word_cache view to consider target language
-- This ensures cached words are returned only for the correct target language
DROP VIEW public.word_cache;

CREATE VIEW public.word_cache AS
SELECT DISTINCT ON (normalized_word, part_of_speech, target_language)
  id,
  normalized_word,
  part_of_speech,
  target_language,
  common_data,
  part_specific_data,
  created_at
FROM public.words
ORDER BY normalized_word, part_of_speech, target_language, created_at ASC;

-- Grant access to the updated view
GRANT SELECT ON public.word_cache TO authenticated;

-- Add comment explaining the target_language column
COMMENT ON COLUMN public.words.target_language IS 'The target language that this word is translated to. Should match the user''s native_language setting when the word was generated.';
