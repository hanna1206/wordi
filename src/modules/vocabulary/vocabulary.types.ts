import { PartOfSpeech } from '../linguistics/linguistics.const';
import { LanguageCode } from '../user-settings/user-settings.const';
import { wordsTable } from './vocabulary.schema';

export interface VocabularyItemDatabaseInput {
  userId: string;
  normalizedWord: string;
  sortableWord: string;
  partOfSpeech: PartOfSpeech;
  commonData: CommonWordData;
  partSpecificData: Record<string, unknown>;
  targetLanguage: LanguageCode;
}

export interface VocabularyItem extends VocabularyItemDatabaseInput {
  id: string;
  createdAt: string;
  updatedAt: string;
  isHidden: boolean;
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
  id: string;
  normalizedWord: string;
  partOfSpeech: PartOfSpeech;
  commonData: CommonWordData;
  isHidden: boolean;
}

export type Word = typeof wordsTable.$inferSelect;
export type InsertWord = typeof wordsTable.$inferInsert;

// Visibility filter type for filtering vocabulary by hidden status
export type VisibilityFilter = 'any' | 'hidden-only' | 'visible-only';

// All available parts of speech for filtering
export const ALL_PARTS_OF_SPEECH: PartOfSpeech[] = [
  PartOfSpeech.NOUN,
  PartOfSpeech.VERB,
  PartOfSpeech.ADJECTIVE,
  PartOfSpeech.PERSONAL_PRONOUN,
  PartOfSpeech.DEMONSTRATIVE_PRONOUN,
  PartOfSpeech.OTHER,
];

// Helper function to determine if filters are at default values
export function areFiltersAtDefault(
  visibilityFilter: VisibilityFilter,
  selectedPartsOfSpeech: PartOfSpeech[],
): boolean {
  const isVisibilityDefault = visibilityFilter === 'visible-only';
  const arePartsOfSpeechDefault =
    selectedPartsOfSpeech.length === ALL_PARTS_OF_SPEECH.length &&
    ALL_PARTS_OF_SPEECH.every((pos) => selectedPartsOfSpeech.includes(pos));

  return isVisibilityDefault && arePartsOfSpeechDefault;
}
