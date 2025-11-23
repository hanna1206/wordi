import { relations } from 'drizzle-orm/relations';

import { userWordProgressTable, vocabularyItemsTable } from './schema';

export const userWordProgressRelations = relations(
  userWordProgressTable,
  ({ one }) => ({
    word: one(vocabularyItemsTable, {
      fields: [userWordProgressTable.wordId],
      references: [vocabularyItemsTable.id],
    }),
  }),
);

export const vocabularyItemsRelations = relations(
  vocabularyItemsTable,
  ({ many }) => ({
    userWordProgresses: many(userWordProgressTable),
  }),
);
