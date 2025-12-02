import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { languageCodeEnum, partOfSpeechEnum } from '@/db/shared';

export const vocabularyItemTypeEnum = pgEnum('vocabulary_item_type', [
  'word',
  'collocation',
]);

export const vocabularyItemsTable = pgTable(
  'vocabulary_items',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    userId: uuid('user_id').notNull(),
    type: vocabularyItemTypeEnum('type').default('word').notNull(),
    normalizedText: text('normalized_text').notNull(),
    sortableText: text('sortable_text').notNull(),
    partOfSpeech: partOfSpeechEnum('part_of_speech').notNull(),
    commonData: jsonb('common_data').default({}).notNull(),
    specificData: jsonb('specific_data').default({}).notNull(),
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
    // Index for type field
    index('idx_vocabulary_items_type').on(table.type),

    // GIN indexes for JSONB
    index('idx_vocabulary_items_common_data_gin').using(
      'gin',
      table.commonData,
    ),
    index('idx_vocabulary_items_specific_data_gin').using(
      'gin',
      table.specificData,
    ),
    // Full-text search
    index('idx_vocabulary_items_search').using(
      'gin',
      sql`to_tsvector('simple'::regconfig, normalized_text)`,
    ),
    // Simple indexes
    index('idx_vocabulary_items_normalized_text').on(table.normalizedText),
    index('idx_vocabulary_items_sortable_text').on(table.sortableText),
    index('idx_vocabulary_items_part_of_speech').on(table.partOfSpeech),
    index('idx_vocabulary_items_target_language').on(table.targetLanguage),
    index('idx_vocabulary_items_user_id').on(table.userId),

    // === COMPOSITE INDEXES FOR COMMON QUERY PATTERNS ===

    // Composite index for user text lookup
    index('idx_vocabulary_items_user_text_lookup').on(
      table.userId,
      table.normalizedText,
    ),
    // Composite index for user + type filtering
    index('idx_vocabulary_items_user_type').on(table.userId, table.type),
    // Index for hidden flag
    index('idx_vocabulary_items_is_hidden').on(table.isHidden),
    // Composite index for user + hidden filtering
    index('idx_vocabulary_items_user_hidden').on(table.userId, table.isHidden),

    // NEW: Optimized composite indexes for common filtering + sorting patterns

    // Latest sort (default): user_id + created_at DESC
    index('idx_vocabulary_items_user_created_desc').on(
      table.userId,
      table.createdAt.desc(),
    ),

    // Alphabetical sort: user_id + sortable_text ASC
    index('idx_vocabulary_items_user_sortable_asc').on(
      table.userId,
      table.sortableText.asc(),
    ),

    // Visible items with latest sort (most common query)
    index('idx_vocabulary_items_user_visible_created').on(
      table.userId,
      table.isHidden,
      table.createdAt.desc(),
    ),

    // Visible items with alphabetical sort
    index('idx_vocabulary_items_user_visible_sortable').on(
      table.userId,
      table.isHidden,
      table.sortableText.asc(),
    ),

    // User + type + hidden (filtered views with type)
    index('idx_vocabulary_items_user_type_hidden').on(
      table.userId,
      table.type,
      table.isHidden,
    ),

    // User + type + hidden + created (filtered + sorted by latest)
    index('idx_vocabulary_items_user_type_hidden_created').on(
      table.userId,
      table.type,
      table.isHidden,
      table.createdAt.desc(),
    ),

    // User + part of speech + hidden (part of speech filter)
    index('idx_vocabulary_items_user_pos_hidden').on(
      table.userId,
      table.partOfSpeech,
      table.isHidden,
    ),

    // User + hidden + type + created (covers multiple filter combinations)
    index('idx_vocabulary_items_user_hidden_type_created').on(
      table.userId,
      table.isHidden,
      table.type,
      table.createdAt.desc(),
    ),

    // Unique constraint
    uniqueIndex('idx_vocabulary_items_user_normalized_target_unique').on(
      table.userId,
      table.normalizedText,
      table.targetLanguage,
    ),
    check(
      'vocabulary_items_normalized_text_check',
      sql`length(normalized_text) > 0`,
    ),
  ],
);
