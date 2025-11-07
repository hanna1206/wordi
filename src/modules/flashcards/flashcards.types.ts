import { userWordProgressTable } from './flashcards.schema';

// Types for the spaced repetition algorithm
export interface ExistingProgress {
  id: string;
  easinessFactor: string;
  intervalDays: number;
  repetitionCount: number;
  totalReviews: number;
  correctReviews: number;
  consecutiveCorrect: number;
  qualityScores: unknown;
  status: string;
}

export interface ProgressUpdate {
  easinessFactor?: string;
  intervalDays?: number;
  repetitionCount?: number;
  totalReviews?: number;
  correctReviews?: number;
  consecutiveCorrect?: number;
  qualityScores?: unknown;
  status?: string;
  nextReviewDate?: string;
  lastReviewedAt?: string;
}

export type UserWordProgress = typeof userWordProgressTable.$inferSelect;
export type InsertUserWordProgress = typeof userWordProgressTable.$inferInsert;
