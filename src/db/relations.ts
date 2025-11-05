import { relations } from 'drizzle-orm/relations';

import { userWordProgressTable, wordsTable } from './schema';

export const userWordProgressRelations = relations(
  userWordProgressTable,
  ({ one }) => ({
    word: one(wordsTable, {
      fields: [userWordProgressTable.wordId],
      references: [wordsTable.id],
    }),
  }),
);

export const wordsRelations = relations(wordsTable, ({ many }) => ({
  userWordProgresses: many(userWordProgressTable),
}));
