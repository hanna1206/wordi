import { pgEnum } from 'drizzle-orm/pg-core';

export const languageCodeEnum = pgEnum('language_code', [
  'russian',
  'english',
  'ukrainian',
  'turkish',
  'portuguese',
]);

export const partOfSpeechEnum = pgEnum('part_of_speech_enum', [
  'noun',
  'verb',
  'adjective',
  'personal pronoun',
  'demonstrative pronoun',
  'other',
]);
