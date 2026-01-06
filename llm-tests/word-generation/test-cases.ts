import { PartOfSpeech } from '@/modules/linguistics/linguistics.const';

export interface WordTestCase {
  word: string;
  targetLanguage: string;
  expectedPartOfSpeech: PartOfSpeech[];
}

export const testCases: WordTestCase[] = [
  // Nouns - different genders
  {
    word: 'Haus',
    targetLanguage: 'English',
    expectedPartOfSpeech: [PartOfSpeech.NOUN],
  },
  {
    word: 'Frau',
    targetLanguage: 'English',
    expectedPartOfSpeech: [PartOfSpeech.NOUN],
  },

  // Verbs - regular and separable
  {
    word: 'gehen',
    targetLanguage: 'English',
    expectedPartOfSpeech: [PartOfSpeech.VERB],
  },
  {
    word: 'aufstehen',
    targetLanguage: 'English',
    expectedPartOfSpeech: [PartOfSpeech.VERB],
  },

  // Adjectives
  {
    word: 'gut',
    targetLanguage: 'English',
    expectedPartOfSpeech: [PartOfSpeech.ADJECTIVE],
  },

  // Pronouns
  {
    word: 'ich',
    targetLanguage: 'English',
    expectedPartOfSpeech: [PartOfSpeech.PERSONAL_PRONOUN],
  },
];
