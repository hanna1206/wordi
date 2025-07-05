export interface TranslationBasicResult {
  normalizedWord: string;
  mainTranslation: string;
  additionalTranslations: string[];
  partOfSpeech: string[];
  exampleSentences: string[];
  synonyms: string[];
  collocations: string[];
}

export interface TranslationNounResult extends TranslationBasicResult {
  gender: string;
  pluralForm: string;
  prepositions: string[] | null;
}

export interface TranslationVerbResult extends TranslationBasicResult {
  regular: 'regular' | 'irregular';
  prepositions: string[] | null;
  conjugation: string;
}

export type TranslationResult =
  | TranslationBasicResult
  | TranslationNounResult
  | TranslationVerbResult;
