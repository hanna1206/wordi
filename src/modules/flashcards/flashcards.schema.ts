import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  foreignKey,
  index,
  integer,
  jsonb,
  numeric,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';

import { wordsTable } from '@/modules/vocabulary/vocabulary.schema';

export const userWordProgressTable = pgTable(
  'user_word_progress',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid('user_id').notNull(),
    wordId: uuid('word_id').notNull(),
    easinessFactor: numeric('easiness_factor', {
      precision: 3,
      scale: 2,
    }).default('2.50'),
    intervalDays: integer('interval_days').default(1),
    repetitionCount: integer('repetition_count').default(0),
    nextReviewDate: timestamp('next_review_date', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    lastReviewedAt: timestamp('last_reviewed_at', {
      withTimezone: true,
      mode: 'string',
    }),
    totalReviews: integer('total_reviews').default(0),
    correctReviews: integer('correct_reviews').default(0),
    consecutiveCorrect: integer('consecutive_correct').default(0),
    qualityScores: jsonb('quality_scores').default([]),
    status: text().default('new'),
    isArchived: boolean('is_archived').default(false),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => [
    index('idx_user_word_progress_next_review').using(
      'btree',
      table.userId.asc().nullsLast().op('timestamptz_ops'),
      table.nextReviewDate.asc().nullsLast().op('timestamptz_ops'),
    ),
    index('idx_user_word_progress_status').using(
      'btree',
      table.userId.asc().nullsLast().op('uuid_ops'),
      table.status.asc().nullsLast().op('uuid_ops'),
    ),
    index('idx_user_word_progress_user_id').using(
      'btree',
      table.userId.asc().nullsLast().op('uuid_ops'),
    ),
    foreignKey({
      columns: [table.wordId],
      foreignColumns: [wordsTable.id],
      name: 'user_word_progress_word_id_fkey',
    }),
    unique('user_word_progress_user_id_word_id_key').on(
      table.userId,
      table.wordId,
    ),
    pgPolicy('Users can delete their own word progress', {
      as: 'permissive',
      for: 'delete',
      to: ['public'],
      using: sql`(auth.uid() = user_id)`,
    }),
    pgPolicy('Users can update their own word progress', {
      as: 'permissive',
      for: 'update',
      to: ['public'],
    }),
    pgPolicy('Users can insert their own word progress', {
      as: 'permissive',
      for: 'insert',
      to: ['public'],
    }),
    pgPolicy('Users can view their own word progress', {
      as: 'permissive',
      for: 'select',
      to: ['public'],
    }),
    check(
      'user_word_progress_status_check',
      sql`status = ANY (ARRAY['new'::text, 'learning'::text, 'review'::text, 'graduated'::text, 'lapsed'::text])`,
    ),
  ],
);
