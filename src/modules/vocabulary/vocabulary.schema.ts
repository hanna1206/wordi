import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  index,
  jsonb,
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
    isHidden: boolean('is_hidden').default(false).notNull(),
  },
  (table) => [
    // Composite index for cache lookup
    index('idx_words_cache_lookup').on(
      table.normalizedWord,
      table.partOfSpeech,
      table.targetLanguage,
    ),
    // GIN indexes for JSONB
    index('idx_words_common_data_gin').using('gin', table.commonData),
    index('idx_words_part_specific_data_gin').using(
      'gin',
      table.partSpecificData,
    ),
    // Full-text search
    index('idx_words_search').using(
      'gin',
      sql`to_tsvector('simple'::regconfig, normalized_word)`,
    ),
    // Simple indexes
    index('idx_words_normalized_word').on(table.normalizedWord),
    index('idx_words_part_of_speech').on(table.partOfSpeech),
    index('idx_words_target_language').on(table.targetLanguage),
    index('idx_words_user_id').on(table.userId),
    // Composite index for user word lookup
    index('idx_words_user_word_lookup').on(table.userId, table.normalizedWord),
    // Index for hidden flag
    index('idx_words_is_hidden').on(table.isHidden),
    // Composite index for user + hidden filtering
    index('idx_words_user_hidden').on(table.userId, table.isHidden),
    // Unique constraint
    uniqueIndex('idx_words_user_normalized_target_unique').on(
      table.userId,
      table.normalizedWord,
      table.targetLanguage,
    ),
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
