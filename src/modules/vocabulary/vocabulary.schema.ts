import { sql } from 'drizzle-orm';
import {
  check,
  index,
  jsonb,
  pgPolicy,
  pgTable,
  pgView,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { languageCodeEnum, partOfSpeechEnum } from '@/db/shared';

export const wordsTable = pgTable(
  'words',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    userId: uuid('user_id').notNull(),
    normalizedWord: text('normalized_word').notNull(),
    partOfSpeech: partOfSpeechEnum('part_of_speech').notNull(),
    commonData: jsonb('common_data').default({}).notNull(),
    partSpecificData: jsonb('part_specific_data').default({}).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .default(sql`timezone('utc'::text, now())`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .default(sql`timezone('utc'::text, now())`)
      .notNull(),
    targetLanguage: languageCodeEnum('target_language')
      .default('english')
      .notNull(),
  },
  (table) => [
    index('idx_words_cache_lookup').using(
      'btree',
      table.normalizedWord.asc().nullsLast().op('enum_ops'),
      table.partOfSpeech.asc().nullsLast().op('text_ops'),
      table.targetLanguage.asc().nullsLast().op('enum_ops'),
    ),
    index('idx_words_common_data_gin').using(
      'gin',
      table.commonData.asc().nullsLast().op('jsonb_ops'),
    ),
    index('idx_words_normalized_word').using(
      'btree',
      table.normalizedWord.asc().nullsLast().op('text_ops'),
    ),
    index('idx_words_part_of_speech').using(
      'btree',
      table.partOfSpeech.asc().nullsLast().op('enum_ops'),
    ),
    index('idx_words_part_specific_data_gin').using(
      'gin',
      table.partSpecificData.asc().nullsLast().op('jsonb_ops'),
    ),
    index('idx_words_search').using(
      'gin',
      sql`to_tsvector('simple'::regconfig, normalized_word)`,
    ),
    index('idx_words_target_language').using(
      'btree',
      table.targetLanguage.asc().nullsLast().op('enum_ops'),
    ),
    index('idx_words_user_id').using(
      'btree',
      table.userId.asc().nullsLast().op('uuid_ops'),
    ),
    uniqueIndex('idx_words_user_normalized_target_unique').using(
      'btree',
      table.userId.asc().nullsLast().op('text_ops'),
      table.normalizedWord.asc().nullsLast().op('uuid_ops'),
      table.targetLanguage.asc().nullsLast().op('enum_ops'),
    ),
    index('idx_words_user_word_lookup').using(
      'btree',
      table.userId.asc().nullsLast().op('uuid_ops'),
      table.normalizedWord.asc().nullsLast().op('uuid_ops'),
    ),
    pgPolicy('words_delete_own', {
      as: 'permissive',
      for: 'delete',
      to: ['public'],
      using: sql`(( SELECT auth.uid() AS uid) = user_id)`,
    }),
    pgPolicy('words_update_own', {
      as: 'permissive',
      for: 'update',
      to: ['public'],
    }),
    pgPolicy('words_insert_own', {
      as: 'permissive',
      for: 'insert',
      to: ['public'],
    }),
    pgPolicy('words_select_own_or_cache', {
      as: 'permissive',
      for: 'select',
      to: ['public'],
    }),
    check('words_normalized_word_check', sql`length(normalized_word) > 0`),
  ],
);

export const wordCacheView = pgView('word_cache', {
  id: uuid(),
  normalizedWord: text('normalized_word'),
  partOfSpeech: partOfSpeechEnum('part_of_speech'),
  targetLanguage: languageCodeEnum('target_language'),
  commonData: jsonb('common_data'),
  partSpecificData: jsonb('part_specific_data'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }),
}).as(
  sql`SELECT DISTINCT ON (words.normalized_word, words.part_of_speech, words.target_language) words.id, words.normalized_word, words.part_of_speech, words.target_language, words.common_data, words.part_specific_data, words.created_at FROM words ORDER BY words.normalized_word, words.part_of_speech, words.target_language, words.created_at`,
);
