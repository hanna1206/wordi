import type { LinguisticItem } from '../linguistics/linguistics.types';

export interface VocabularyItem {
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

export interface VocabularyItemInput {
  linguisticItem: LinguisticItem;
}

export interface CachedWord {
  id: string;
  normalizedWord: string;
  partOfSpeech: string;
  commonData: CommonWordData;
  partSpecificData: Record<string, unknown>;
  createdAt: string;
}

export interface UserWordCheck {
  exists: boolean;
  word?: VocabularyItem;
}
