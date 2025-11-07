import { pgEnum } from 'drizzle-orm/pg-core';

import { PartOfSpeech } from '@/modules/linguistics/linguistics.const';
import { LanguageCode } from '@/modules/user-settings/user-settings.const';

export const languageCodeEnum = pgEnum(
  'language_code',
  Object.values(LanguageCode) as [string, ...string[]],
);

export const partOfSpeechEnum = pgEnum(
  'part_of_speech_enum',
  Object.values(PartOfSpeech) as [string, ...string[]],
);
