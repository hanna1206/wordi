import type { TranslationResult } from '../words-generation/words-generation.types';

// Database word structure (matches our migration)
export interface SavedWord {
  id: string;
  user_id: string;
  normalized_word: string;
  part_of_speech: string;
  common_data: CommonWordData;
  part_specific_data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
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
  translationResult: TranslationResult;
}

// Result of cache lookup
export interface CachedWord {
  id: string;
  normalized_word: string;
  part_of_speech: string;
  common_data: CommonWordData;
  part_specific_data: Record<string, unknown>;
  created_at: string;
}

// Check if user already has this word saved
export interface UserWordCheck {
  exists: boolean;
  word?: SavedWord;
}
