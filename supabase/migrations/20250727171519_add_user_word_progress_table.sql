-- Create user_word_progress table for spaced repetition tracking
CREATE TABLE user_word_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  word_id UUID NOT NULL REFERENCES words(id),
  
  -- Spaced repetition core
  easiness_factor DECIMAL(3,2) DEFAULT 2.50,
  interval_days INTEGER DEFAULT 1,
  repetition_count INTEGER DEFAULT 0,
  next_review_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_reviewed_at TIMESTAMP WITH TIME ZONE,
  
  -- Performance tracking
  total_reviews INTEGER DEFAULT 0,
  correct_reviews INTEGER DEFAULT 0,
  consecutive_correct INTEGER DEFAULT 0,
  quality_scores JSONB DEFAULT '[]',
  
  -- Status
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'learning', 'review', 'graduated', 'lapsed')),
  
  -- Archive functionality
  is_archived BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, word_id)
);

-- Indexes for efficient queries
CREATE INDEX idx_user_word_progress_user_id ON user_word_progress(user_id);
CREATE INDEX idx_user_word_progress_next_review ON user_word_progress(user_id, next_review_date);
CREATE INDEX idx_user_word_progress_status ON user_word_progress(user_id, status);

-- RLS policies
ALTER TABLE user_word_progress ENABLE ROW LEVEL SECURITY;

-- Users can only access their own progress records
CREATE POLICY "Users can view their own word progress" ON user_word_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own word progress" ON user_word_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own word progress" ON user_word_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own word progress" ON user_word_progress
  FOR DELETE USING (auth.uid() = user_id);
