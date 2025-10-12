import {
  AdjectiveType,
  Gender,
  PartOfSpeech,
  ReflexiveVerb,
  Regularity,
} from './linguistics.const';

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

export interface BasicLinguisticItem {
  normalizedWord: string;
  mainTranslation: string;
  additionalTranslations: string[];
  partOfSpeech: PartOfSpeech[];
  exampleSentences: string[];
  synonyms: string[];
  collocations: Collocation[];
}

export interface NounLinguisticItem extends BasicLinguisticItem {
  gender: Gender;
  pluralForm: string;
  prepositions: Preposition[] | null;
}

export interface VerbLinguisticItem extends BasicLinguisticItem {
  regular: Regularity;
  prepositions: Preposition[] | null;
  isReflexive: ReflexiveVerb;
  sichUsage: SichUsage | null;
  separablePrefix: string | null;
  conjugation: string;
}

export interface AdjectiveLinguisticItem extends BasicLinguisticItem {
  type: AdjectiveType;
  comparisonForms: ComparisonForms | null;
  prepositions: Preposition[] | null;
}

export interface PronounLinguisticItem extends BasicLinguisticItem {
  declensions: PronounDeclension[];
  pronounType: string;
}

export interface DemonstrativePronounLinguisticItem
  extends BasicLinguisticItem {
  declensions: DemonstrativeDeclension[];
  pronounType: string;
  baseForm: string;
}

export type LinguisticItem =
  | BasicLinguisticItem
  | NounLinguisticItem
  | VerbLinguisticItem
  | AdjectiveLinguisticItem
  | PronounLinguisticItem
  | DemonstrativePronounLinguisticItem;
