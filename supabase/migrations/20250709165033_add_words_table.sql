CREATE TYPE part_of_speech_enum AS ENUM (
  'noun', 
  'verb', 
  'adjective', 
  'personal pronoun', 
  'demonstrative pronoun', 
  'other'
);

CREATE TABLE public.words (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  normalized_word TEXT NOT NULL,
  part_of_speech part_of_speech_enum NOT NULL,
  common_data JSONB NOT NULL DEFAULT '{}',
  part_specific_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  CONSTRAINT words_normalized_word_check CHECK (length(normalized_word) > 0)
);

CREATE INDEX idx_words_user_id ON public.words(user_id);
CREATE INDEX idx_words_normalized_word ON public.words(normalized_word);
CREATE INDEX idx_words_part_of_speech ON public.words(part_of_speech);

-- Composite index for user's words lookup
CREATE INDEX idx_words_user_word_lookup ON public.words(user_id, normalized_word);

-- GIN indexes for JSONB queries
CREATE INDEX idx_words_common_data_gin ON public.words USING GIN(common_data);
CREATE INDEX idx_words_part_specific_data_gin ON public.words USING GIN(part_specific_data);

-- Unique constraint to prevent duplicate words per user
CREATE UNIQUE INDEX idx_words_user_normalized_unique 
ON public.words(user_id, normalized_word);

-- Full-text search index
CREATE INDEX idx_words_search ON public.words 
USING GIN(to_tsvector('simple', normalized_word));

-- Enable Row Level Security (RLS)
ALTER TABLE public.words ENABLE ROW LEVEL SECURITY;

-- RLS policies
-- Allow users to see their own words (for management) and any words for cache lookup
CREATE POLICY "words_select_own_or_cache" ON public.words 
  FOR SELECT USING (true);  -- Allow reading any word for cache, app logic handles filtering

CREATE POLICY "words_insert_own" ON public.words 
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "words_update_own" ON public.words 
  FOR UPDATE USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "words_delete_own" ON public.words 
  FOR DELETE USING ((SELECT auth.uid()) = user_id);

-- Create trigger for updated_at (reuse existing function)
CREATE TRIGGER words_updated_at
  BEFORE UPDATE ON public.words
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create view for efficient word cache lookups
-- Returns one version of each word (first saved) for cache purposes
CREATE VIEW public.word_cache AS
SELECT DISTINCT ON (normalized_word, part_of_speech)
  id,
  normalized_word,
  part_of_speech,
  common_data,
  part_specific_data,
  created_at
FROM public.words
ORDER BY normalized_word, part_of_speech, created_at ASC;

-- Grant access to the view (no RLS needed on views)
GRANT SELECT ON public.word_cache TO authenticated;
