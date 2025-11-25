import { sql } from 'drizzle-orm';
import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { vocabularyItemsTable } from '../vocabulary/vocabulary.schema';

export const collectionsTable = pgTable(
  'collections',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    userId: uuid('user_id').notNull(),
    name: text('name').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .default(sql`timezone('utc'::text, now())`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .default(sql`timezone('utc'::text, now())`)
      .notNull(),
  },
  (table) => [
    // Index for userId for efficient user-based queries
    index('idx_collections_user_id').on(table.userId),
    // Unique constraint on (userId, name) to prevent duplicate collection names per user
    uniqueIndex('idx_collections_user_name_unique').on(
      table.userId,
      table.name,
    ),
  ],
);

export const collectionVocabularyItemsTable = pgTable(
  'collection_vocabulary_items',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    collectionId: uuid('collection_id')
      .notNull()
      .references(() => collectionsTable.id, { onDelete: 'cascade' }),
    vocabularyItemId: uuid('vocabulary_item_id')
      .notNull()
      .references(() => vocabularyItemsTable.id, { onDelete: 'cascade' }),
    addedAt: timestamp('added_at', { withTimezone: true, mode: 'string' })
      .default(sql`timezone('utc'::text, now())`)
      .notNull(),
  },
  (table) => [
    // Index for collectionId for efficient collection-based queries
    index('idx_collection_vocab_collection_id').on(table.collectionId),
    // Index for vocabularyItemId for efficient item-based queries
    index('idx_collection_vocab_vocabulary_id').on(table.vocabularyItemId),
    // Unique constraint on (collectionId, vocabularyItemId) to prevent duplicates
    uniqueIndex('idx_collection_vocab_unique').on(
      table.collectionId,
      table.vocabularyItemId,
    ),
  ],
);
