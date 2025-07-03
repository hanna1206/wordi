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
}

export type TranslationResult = TranslationBasicResult | TranslationNounResult;
