import { QualityScore } from '@/modules/flashcards/flashcards.const';
import type {
  ExistingProgress,
  ProgressUpdate,
} from '@/modules/flashcards/flashcards.types';

/**
 * Spaced Repetition Utilities
 *
 * NOTE: These utilities work directly with database field names (snake_case)
 * to avoid unnecessary conversions when interfacing with the database.
 */

interface InitialProgress {
  easinessFactor: number;
  intervalDays: number;
  repetitionCount: number;
  totalReviews: number;
  correctReviews: number;
  consecutiveCorrect: number;
  qualityScores: number[];
  status: 'new' | 'learning' | 'review';
  nextReviewDate: string;
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
  const currentScores = Array.isArray(existingProgress.qualityScores)
    ? existingProgress.qualityScores
    : [];
  const newQualityScores = [...currentScores, qualityScore];
  const wasCorrect = qualityScore > QualityScore.Hard;
  const newCorrectReviews = wasCorrect
    ? existingProgress.correctReviews + 1
    : existingProgress.correctReviews;
  const newConsecutiveCorrect = wasCorrect
    ? existingProgress.consecutiveCorrect + 1
    : 0;

  // Simple spaced repetition algorithm based on SM-2
  let newEasinessFactor = parseFloat(existingProgress.easinessFactor);
  let newIntervalDays = existingProgress.intervalDays;
  let newStatus = existingProgress.status;

  if (qualityScore === QualityScore.Hard) {
    // Decrease easiness and reset interval for hard responses
    newEasinessFactor = Math.max(1.3, newEasinessFactor - 0.2);
    newIntervalDays = 1;
    newStatus = 'lapsed';
  } else if (qualityScore === QualityScore.Good) {
    // Maintain or slightly increase interval for good responses
    newIntervalDays = Math.ceil(newIntervalDays * newEasinessFactor);
    // Keep in learning status for first few reviews, then move to review
    if (
      existingProgress.status === 'new' ||
      existingProgress.status === 'learning'
    ) {
      newStatus =
        existingProgress.repetitionCount + 1 >= 2 ? 'review' : 'learning';
    } else {
      newStatus = 'review';
    }
  } else if (qualityScore === QualityScore.Easy) {
    // Increase easiness and interval more for easy responses
    newEasinessFactor = Math.min(2.5, newEasinessFactor + 0.1);
    newIntervalDays = Math.ceil(newIntervalDays * newEasinessFactor * 1.2);
    // Graduate only after completing learning phase (at least 3 reviews) and having 3+ consecutive correct
    if (
      existingProgress.status === 'new' ||
      existingProgress.status === 'learning'
    ) {
      newStatus =
        existingProgress.repetitionCount + 1 >= 3 && newConsecutiveCorrect >= 3
          ? 'review'
          : 'learning';
    } else {
      newStatus = newConsecutiveCorrect >= 3 ? 'graduated' : 'review';
    }
  }

  const nextReviewDate = calculateNextReviewDate(newIntervalDays);

  return {
    easinessFactor: newEasinessFactor.toFixed(2),
    intervalDays: newIntervalDays,
    repetitionCount: existingProgress.repetitionCount + 1,
    totalReviews: existingProgress.totalReviews + 1,
    correctReviews: newCorrectReviews,
    consecutiveCorrect: newConsecutiveCorrect,
    qualityScores: newQualityScores,
    status: newStatus,
    nextReviewDate,
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
    easinessFactor: initialEasinessFactor,
    intervalDays: initialIntervalDays,
    repetitionCount: 1,
    totalReviews: 1,
    correctReviews: qualityScore > QualityScore.Hard ? 1 : 0,
    consecutiveCorrect: qualityScore > QualityScore.Hard ? 1 : 0,
    qualityScores: [qualityScore],
    status: initialStatus,
    nextReviewDate,
  };
};

/**
 * Check if a response was correct based on quality score
 */
export const isCorrectResponse = (qualityScore: QualityScore): boolean => {
  return qualityScore > QualityScore.Hard;
};
