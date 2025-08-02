import { QualityScore } from '@/modules/flash-cards-game/flash-cards-game.const';
import type {
  ExistingProgress,
  ProgressUpdate,
} from '@/modules/flash-cards-game/flash-cards-game.types';

/**
 * Spaced Repetition Utilities
 *
 * NOTE: These utilities work directly with database field names (snake_case)
 * to avoid unnecessary conversions when interfacing with the database.
 */

interface InitialProgress {
  easiness_factor: number;
  interval_days: number;
  repetition_count: number;
  total_reviews: number;
  correct_reviews: number;
  consecutive_correct: number;
  quality_scores: number[];
  status: 'new' | 'learning' | 'review';
  next_review_date: string;
}

/**
 * Calculate the next review date based on interval days
 */
export const calculateNextReviewDate = (intervalDays: number): string => {
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays);
  return nextReviewDate.toISOString();
};

/**
 * Calculate updated progress for existing word based on quality score
 */
export const calculateProgressUpdate = (
  existingProgress: ExistingProgress,
  qualityScore: QualityScore,
): ProgressUpdate => {
  const newQualityScores = [...existingProgress.quality_scores, qualityScore];
  const wasCorrect = qualityScore > QualityScore.Hard;
  const newCorrectReviews = wasCorrect
    ? existingProgress.correct_reviews + 1
    : existingProgress.correct_reviews;
  const newConsecutiveCorrect = wasCorrect
    ? existingProgress.consecutive_correct + 1
    : 0;

  // Simple spaced repetition algorithm based on SM-2
  let newEasinessFactor = existingProgress.easiness_factor;
  let newIntervalDays = existingProgress.interval_days;
  let newStatus = existingProgress.status;

  if (qualityScore === QualityScore.Hard) {
    // Decrease easiness and reset interval for hard responses
    newEasinessFactor = Math.max(1.3, newEasinessFactor - 0.2);
    newIntervalDays = 1;
    newStatus = 'lapsed';
  } else if (qualityScore === QualityScore.Good) {
    // Maintain or slightly increase interval for good responses
    newIntervalDays = Math.ceil(newIntervalDays * newEasinessFactor);
    newStatus = 'review';
  } else if (qualityScore === QualityScore.Easy) {
    // Increase easiness and interval more for easy responses
    newEasinessFactor = Math.min(2.5, newEasinessFactor + 0.1);
    newIntervalDays = Math.ceil(newIntervalDays * newEasinessFactor * 1.2);
    // Graduate after 2 consecutive correct answers
    newStatus = newConsecutiveCorrect >= 2 ? 'graduated' : 'review';
  }

  const nextReviewDate = calculateNextReviewDate(newIntervalDays);

  return {
    easiness_factor: newEasinessFactor,
    interval_days: newIntervalDays,
    repetition_count: existingProgress.repetition_count + 1,
    total_reviews: existingProgress.total_reviews + 1,
    correct_reviews: newCorrectReviews,
    consecutive_correct: newConsecutiveCorrect,
    quality_scores: newQualityScores,
    status: newStatus,
    next_review_date: nextReviewDate,
  };
};

/**
 * Calculate initial progress for a new word based on quality score
 */
export const calculateInitialProgress = (
  qualityScore: QualityScore,
): InitialProgress => {
  let initialEasinessFactor = 2.5;
  let initialIntervalDays = 1;
  const initialStatus: 'new' | 'learning' | 'review' = 'learning';

  // Adjust initial values based on first impression
  if (qualityScore === QualityScore.Hard) {
    initialEasinessFactor = 2.3;
    initialIntervalDays = 1;
  } else if (qualityScore === QualityScore.Easy) {
    initialEasinessFactor = 2.6;
    initialIntervalDays = 2;
  }

  const nextReviewDate = calculateNextReviewDate(initialIntervalDays);

  return {
    easiness_factor: initialEasinessFactor,
    interval_days: initialIntervalDays,
    repetition_count: 1,
    total_reviews: 1,
    correct_reviews: qualityScore > QualityScore.Hard ? 1 : 0,
    consecutive_correct: qualityScore > QualityScore.Hard ? 1 : 0,
    quality_scores: [qualityScore],
    status: initialStatus,
    next_review_date: nextReviewDate,
  };
};

/**
 * Check if a response was correct based on quality score
 */
export const isCorrectResponse = (qualityScore: QualityScore): boolean => {
  return qualityScore > QualityScore.Hard;
};
