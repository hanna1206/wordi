import { PartOfSpeech } from '../linguistics/linguistics.const';
import { LanguageCode } from '../user-settings/user-settings.const';
import { vocabularyItemsTable } from './vocabulary.schema';

export interface VocabularyItemDatabaseInput {
  userId: string;
  type: 'word' | 'collocation';
  normalizedText: string;
  sortableText: string;
  partOfSpeech: PartOfSpeech;
  commonData: CommonVocabularyData;
  specificData: Record<string, unknown>;
  targetLanguage: LanguageCode;
}

export interface VocabularyItem extends VocabularyItemDatabaseInput {
  id: string;
  createdAt: string;
  updatedAt: string;
  isHidden: boolean;
}

export interface CommonVocabularyData {
  mainTranslation: string;
  additionalTranslations: string[];
  exampleSentences: string[];
  synonyms: string[];
  collocations: Array<{
    collocation: string;
    translation: string;
  }>;
}

export type VocabularySortOption =
  | 'Latest'
  | 'Alphabetical'
  | 'Progress: Status'
  | 'Progress: Next Review'
  | 'Progress: Accuracy'
  | 'Progress: Reviews';

export interface UserWordCheck {
  exists: boolean;
  word?: VocabularyItem;
}

export interface MinimalVocabularyWord {
  id: string;
  type: 'word' | 'collocation';
  normalizedText: string;
  partOfSpeech: PartOfSpeech;
  commonData: CommonVocabularyData;
  isHidden: boolean;
}

export interface VocabularyWordProgress {
  status: string;
  nextReviewDate: string | null;
  totalReviews: number;
  correctReviews: number;
  consecutiveCorrect: number;
  intervalDays: number;
}

export interface MinimalVocabularyWordWithProgress
  extends MinimalVocabularyWord {
  progress: VocabularyWordProgress | null;
}

export type Word = typeof vocabularyItemsTable.$inferSelect;
export type InsertWord = typeof vocabularyItemsTable.$inferInsert;

export type VisibilityFilter = 'any' | 'hidden-only' | 'visible-only';
export type VocabularyTypeFilter = 'all' | 'words-only' | 'collocations-only';

// Progress filters
export type ProgressStatusFilter =
  | 'new'
  | 'learning'
  | 'review'
  | 'graduated'
  | 'lapsed'
  | 'not-started';
export type ProgressAccuracyFilter = 'all' | 'low' | 'medium' | 'high';
export type ProgressReviewFilter = 'all' | 'due' | 'upcoming' | 'overdue';

// All available parts of speech for filtering
export const ALL_PARTS_OF_SPEECH: PartOfSpeech[] = [
  PartOfSpeech.NOUN,
  PartOfSpeech.VERB,
  PartOfSpeech.ADJECTIVE,
  PartOfSpeech.PERSONAL_PRONOUN,
  PartOfSpeech.DEMONSTRATIVE_PRONOUN,
  PartOfSpeech.OTHER,
];
