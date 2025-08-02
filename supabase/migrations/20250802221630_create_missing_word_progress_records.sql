-- Create missing word progress records for existing words
-- This migration addresses words that were created before the word progress system was implemented

INSERT INTO user_word_progress (user_id, word_id, status)
SELECT 
  w.user_id,
  w.id as word_id,
  'new' as status
FROM words w
LEFT JOIN user_word_progress uwp ON w.id = uwp.word_id AND w.user_id = uwp.user_id
WHERE uwp.word_id IS NULL;
