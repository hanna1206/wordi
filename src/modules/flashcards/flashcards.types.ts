// Types for the spaced repetition algorithm
export interface ExistingProgress {
  easiness_factor: number;
  interval_days: number;
  repetition_count: number;
  total_reviews: number;
  correct_reviews: number;
  consecutive_correct: number;
  quality_scores: number[];
  status: 'new' | 'learning' | 'review' | 'graduated' | 'lapsed';
}

export interface ProgressUpdate {
  easiness_factor: number;
  interval_days: number;
  repetition_count: number;
  total_reviews: number;
  correct_reviews: number;
  consecutive_correct: number;
  quality_scores: number[];
  status: 'new' | 'learning' | 'review' | 'graduated' | 'lapsed';
  next_review_date: string;
}
