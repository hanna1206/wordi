// should be in sync with db enums (in vocabulary module and db migrations)
export enum PartOfSpeech {
  NOUN = 'noun',
  VERB = 'verb',
  ADJECTIVE = 'adjective',
  PERSONAL_PRONOUN = 'personal pronoun',
  DEMONSTRATIVE_PRONOUN = 'demonstrative pronoun',
  OTHER = 'other',
}

export enum Gender {
  MASCULINE = 'masculine',
  FEMININE = 'feminine',
  NEUTER = 'neuter',
}

export enum Regularity {
  REGULAR = 'regular',
  IRREGULAR = 'irregular',
}

export enum ReflexiveVerb {
  REFLEXIVE = 'reflexive',
  NON_REFLEXIVE = 'non-reflexive',
  BOTH = 'both',
}

export enum AdjectiveType {
  QUALITATIVE = 'qualitative',
  RELATIVE = 'relative',
}
