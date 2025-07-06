export type Gender = 'masculine' | 'feminine' | 'neuter';
export type Collocation = {
  collocation: string;
  translation: string;
};

export interface TranslationBasicResult {
  normalizedWord: string;
  mainTranslation: string;
  additionalTranslations: string[];
  partOfSpeech: string[];
  exampleSentences: string[];
  synonyms: string[];
  collocations: Collocation[];
}

export interface TranslationNounResult extends TranslationBasicResult {
  gender: Gender;
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
