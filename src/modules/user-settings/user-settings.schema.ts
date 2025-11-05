import { sql } from 'drizzle-orm';
import {
  check,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';

import { languageCodeEnum } from '@/db/shared';

export const userSettingsTable = pgTable(
  'user_settings',
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    userId: uuid('user_id').notNull(),
    email: text().notNull(),
    name: text(),
    nativeLanguage: languageCodeEnum('native_language'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .default(sql`timezone('utc'::text, now())`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .default(sql`timezone('utc'::text, now())`)
      .notNull(),
  },
  (table) => [
    unique('user_settings_user_id_key').on(table.userId),
    pgPolicy('user_settings_update_own', {
      as: 'permissive',
      for: 'update',
      to: ['public'],
      using: sql`(( SELECT auth.uid() AS uid) = user_id)`,
    }),
    pgPolicy('user_settings_select_own', {
      as: 'permissive',
      for: 'select',
      to: ['public'],
    }),
    check(
      'user_settings_email_check',
      sql`email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text`,
    ),
  ],
);
