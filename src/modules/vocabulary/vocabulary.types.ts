import type { LinguisticItem } from '../linguistics/linguistics.types';
import { LanguageCode } from '../user-settings/user-settings.const';

export interface VocabularyItem {
  id: string;
  userId: string;
  normalizedWord: string;
  partOfSpeech: string;
  commonData: CommonWordData;
  partSpecificData: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  targetLanguage?: LanguageCode;
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

export interface VocabularyItemAnonymized {
  id: string;
  normalizedWord: string;
  partOfSpeech: string;
  commonData: CommonWordData;
  partSpecificData: Record<string, unknown>;
  createdAt: string;
  targetLanguage: LanguageCode;
}

export interface UserWordCheck {
  exists: boolean;
  word?: VocabularyItem;
}
