import { Gender, PartOfSpeech } from '@/modules/linguistics/linguistics.const';

export interface DistractorTestCase {
  id: string;
  targetLanguageWord: string;
  nativeLanguageTranslation: string;
  partOfSpeech: PartOfSpeech;
  gender?: Gender;
  targetLanguage: string;
  nativeLanguage: string;
}

export const testCases: DistractorTestCase[] = [
  // Nouns - masculine
  {
    id: 'noun-masculine-1',
    targetLanguageWord: 'der Tisch',
    nativeLanguageTranslation: 'table',
    partOfSpeech: PartOfSpeech.NOUN,
    gender: Gender.MASCULINE,
    targetLanguage: 'German',
    nativeLanguage: 'English',
  },
  {
    id: 'noun-masculine-2',
    targetLanguageWord: 'der Stuhl',
    nativeLanguageTranslation: 'chair',
    partOfSpeech: PartOfSpeech.NOUN,
    gender: Gender.MASCULINE,
    targetLanguage: 'German',
    nativeLanguage: 'English',
  },

  // Nouns - feminine
  {
    id: 'noun-feminine-1',
    targetLanguageWord: 'die Lampe',
    nativeLanguageTranslation: 'lamp',
    partOfSpeech: PartOfSpeech.NOUN,
    gender: Gender.FEMININE,
    targetLanguage: 'German',
    nativeLanguage: 'English',
  },
  {
    id: 'noun-feminine-2',
    targetLanguageWord: 'die Tür',
    nativeLanguageTranslation: 'door',
    partOfSpeech: PartOfSpeech.NOUN,
    gender: Gender.FEMININE,
    targetLanguage: 'German',
    nativeLanguage: 'English',
  },

  // Nouns - neuter
  {
    id: 'noun-neuter-1',
    targetLanguageWord: 'das Fenster',
    nativeLanguageTranslation: 'window',
    partOfSpeech: PartOfSpeech.NOUN,
    gender: Gender.NEUTER,
    targetLanguage: 'German',
    nativeLanguage: 'English',
  },
  {
    id: 'noun-neuter-2',
    targetLanguageWord: 'das Buch',
    nativeLanguageTranslation: 'book',
    partOfSpeech: PartOfSpeech.NOUN,
    gender: Gender.NEUTER,
    targetLanguage: 'German',
    nativeLanguage: 'English',
  },

  // Verbs - infinitive form
  {
    id: 'verb-infinitive-1',
    targetLanguageWord: 'spielen',
    nativeLanguageTranslation: 'to play',
    partOfSpeech: PartOfSpeech.VERB,
    targetLanguage: 'German',
    nativeLanguage: 'English',
  },
  {
    id: 'verb-infinitive-2',
    targetLanguageWord: 'lesen',
    nativeLanguageTranslation: 'to read',
    partOfSpeech: PartOfSpeech.VERB,
    targetLanguage: 'German',
    nativeLanguage: 'English',
  },
  {
    id: 'verb-infinitive-3',
    targetLanguageWord: 'schreiben',
    nativeLanguageTranslation: 'to write',
    partOfSpeech: PartOfSpeech.VERB,
    targetLanguage: 'German',
    nativeLanguage: 'English',
  },

  // Adjectives
  {
    id: 'adjective-1',
    targetLanguageWord: 'groß',
    nativeLanguageTranslation: 'big',
    partOfSpeech: PartOfSpeech.ADJECTIVE,
    targetLanguage: 'German',
    nativeLanguage: 'English',
  },
  {
    id: 'adjective-2',
    targetLanguageWord: 'klein',
    nativeLanguageTranslation: 'small',
    partOfSpeech: PartOfSpeech.ADJECTIVE,
    targetLanguage: 'German',
    nativeLanguage: 'English',
  },
  {
    id: 'adjective-3',
    targetLanguageWord: 'schnell',
    nativeLanguageTranslation: 'fast',
    partOfSpeech: PartOfSpeech.ADJECTIVE,
    targetLanguage: 'German',
    nativeLanguage: 'English',
  },

  // Collocations (multi-word phrases) - using OTHER part of speech
  {
    id: 'collocation-1',
    targetLanguageWord: 'Guten Morgen',
    nativeLanguageTranslation: 'good morning',
    partOfSpeech: PartOfSpeech.OTHER,
    targetLanguage: 'German',
    nativeLanguage: 'English',
  },
  {
    id: 'collocation-2',
    targetLanguageWord: 'Auf Wiedersehen',
    nativeLanguageTranslation: 'goodbye',
    partOfSpeech: PartOfSpeech.OTHER,
    targetLanguage: 'German',
    nativeLanguage: 'English',
  },
];
