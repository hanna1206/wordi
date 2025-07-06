export type Gender = 'masculine' | 'feminine' | 'neuter';
export type Collocation = {
  collocation: string;
  translation: string;
};
export type Preposition = {
  rule: string;
  exampleSentence: string;
  translation: string;
};
export type ReflexiveVerb = 'reflexive' | 'non-reflexive' | 'both';
export type SichUsage = {
  withSich: string;
  withoutSich: string;
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
  prepositions: Preposition[] | null;
}

export interface TranslationVerbResult extends TranslationBasicResult {
  regular: 'regular' | 'irregular';
  prepositions: Preposition[] | null;
  isReflexive: ReflexiveVerb;
  sichUsage: SichUsage | null;
  separablePrefix: string | null;
  conjugation: string;
}

export type TranslationResult =
  | TranslationBasicResult
  | TranslationNounResult
  | TranslationVerbResult;
