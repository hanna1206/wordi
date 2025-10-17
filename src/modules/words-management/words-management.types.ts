import type { VocabularyItem } from '../words-persistence/vocabulary.types';

// Combines word data with progress data for the management view
export interface WordWithProgress extends VocabularyItem {
  // Flattened common data for easier access
  mainTranslation: string;
  additionalTranslations: string[];
  exampleSentences: string[];
  synonyms: string[];
  collocations: Array<{
    collocation: string;
    translation: string;
  }>;

  // Progress data
  progressId: string;
  easinessFactor: number;
  intervalDays: number;
  repetitionCount: number;
  nextReviewDate: string;
  lastReviewedAt: string | null;
  totalReviews: number;
  correctReviews: number;
  consecutiveCorrect: number;
  status: 'new' | 'learning' | 'review' | 'graduated' | 'lapsed';
  isArchived: boolean;
  successRate: number; // Calculated: correctReviews / totalReviews
}

// Filter options for the words table
export interface WordsFilterOptions {
  searchTerm?: string;
  status?: Array<'new' | 'learning' | 'review' | 'graduated' | 'lapsed'>;
  partOfSpeech?: string[];
  isArchived?: boolean;
  reviewDateRange?: {
    start?: string;
    end?: string;
  };
  overdue?: boolean;
}

// Sort options for the words table
export interface WordsSortOptions {
  field: keyof WordWithProgress;
  direction: 'asc' | 'desc';
}

// Bulk action types
export type BulkActionType =
  | 'archive'
  | 'unarchive'
  | 'changeStatus'
  | 'delete'
  | 'export';

export interface BulkActionPayload {
  action: BulkActionType;
  wordIds: string[];
  data?: {
    newStatus?: WordWithProgress['status'];
  };
}

// Statistics for the dashboard
export interface WordsStatistics {
  totalWords: number;
  wordsByStatus: Record<WordWithProgress['status'], number>;
  overallSuccessRate: number;
  wordsDueTodayCount: number;
  currentStreak: number;
  longestStreak: number;
  recentActivity: Array<{
    date: string;
    reviewsCompleted: number;
    wordsAdded: number;
  }>;
}
