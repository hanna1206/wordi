import {
  AdjectiveType,
  Gender,
  PartOfSpeech,
  ReflexiveVerb,
  Regularity,
} from './words.const';

export type Collocation = {
  collocation: string;
  translation: string;
};

export type Preposition = {
  rule: string;
  exampleSentence: string;
  translation: string;
};

export type SichUsage = {
  withSich: string;
  withoutSich: string;
};

export type ComparisonForms = {
  positive: string;
  comparative: string | null;
  superlative: string | null;
};

export type PronounCase = {
  nominativ: string;
  akkusativ: string;
  dativ: string;
  genitiv: string;
};

export type PronounDeclension = {
  case: string;
  form: string;
  translation: string;
  example: string;
};

export type DemonstrativeDeclension = {
  case: string;
  masculine: string;
  feminine: string;
  neuter: string;
  plural: string;
};

export interface TranslationBasicResult {
  normalizedWord: string;
  mainTranslation: string;
  additionalTranslations: string[];
  partOfSpeech: PartOfSpeech[];
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
  regular: Regularity;
  prepositions: Preposition[] | null;
  isReflexive: ReflexiveVerb;
  sichUsage: SichUsage | null;
  separablePrefix: string | null;
  conjugation: string;
}

export interface TranslationAdjectiveResult extends TranslationBasicResult {
  type: AdjectiveType;
  comparisonForms: ComparisonForms | null;
  prepositions: Preposition[] | null;
}

export interface TranslationPronounResult extends TranslationBasicResult {
  declensions: PronounDeclension[];
  pronounType: string;
}

export interface TranslationDemonstrativePronounResult
  extends TranslationBasicResult {
  declensions: DemonstrativeDeclension[];
  pronounType: string;
  baseForm: string;
}

export type TranslationResult =
  | TranslationBasicResult
  | TranslationNounResult
  | TranslationVerbResult
  | TranslationAdjectiveResult
  | TranslationPronounResult
  | TranslationDemonstrativePronounResult;
