import type { LinguisticItem } from '../linguistics/linguistics.types';

// Application layer word structure - uses camelCase
export interface SavedWord {
  id: string;
  userId: string;
  normalizedWord: string;
  partOfSpeech: string;
  commonData: CommonWordData;
  partSpecificData: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  targetLanguage?: string;
}

// Common data structure (stored in common_data JSONB)
export interface CommonWordData {
  mainTranslation: string;
  additionalTranslations: string[];
  exampleSentences: string[];
  synonyms: string[];
  collocations: Array<{
    collocation: string;
    translation: string;
  }>;
}

// Input for saving a word
export interface SaveWordInput {
  linguisticItem: LinguisticItem;
}

// Application layer cache word structure - uses camelCase
export interface CachedWord {
  id: string;
  normalizedWord: string;
  partOfSpeech: string;
  commonData: CommonWordData;
  partSpecificData: Record<string, unknown>;
  createdAt: string;
}

// Check if user already has this word saved
export interface UserWordCheck {
  exists: boolean;
  word?: SavedWord;
}
