import { PartOfSpeech } from '../linguistics/linguistics.const';
import { LanguageCode } from '../user-settings/user-settings.const';

export interface VocabularyItemDatabaseInput {
  userId: string;
  normalizedWord: string;
  partOfSpeech: PartOfSpeech;
  commonData: CommonWordData;
  partSpecificData: Record<string, unknown>;
  targetLanguage: LanguageCode;
}

export interface VocabularyItem extends VocabularyItemDatabaseInput {
  id: string;
  createdAt: string;
  updatedAt: string;
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

export interface VocabularyItemAnonymized extends VocabularyItemDatabaseInput {
  id: string;
  createdAt: string;
}

export type VocabularySortOption = 'Latest' | 'Alphabetical';

export interface UserWordCheck {
  exists: boolean;
  word?: VocabularyItem;
}

export interface MinimalVocabularyWord {
  normalizedWord: string;
  partOfSpeech: PartOfSpeech;
  commonData: CommonWordData;
}
