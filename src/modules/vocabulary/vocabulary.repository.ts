import { and, asc, count, desc, eq, ilike, or, sql } from 'drizzle-orm';

import { db } from '@/db/client';
import { LanguageCode } from '@/modules/user-settings/user-settings.const';

import { wordCacheView, wordsTable } from './vocabulary.schema';
import type {
  MinimalVocabularyWord,
  VocabularyItem,
  VocabularyItemAnonymized,
  VocabularySortOption,
} from './vocabulary.types';

const create = async (
  data: typeof wordsTable.$inferInsert,
): Promise<VocabularyItem> => {
  const [word] = await db.insert(wordsTable).values(data).returning();
  return word as VocabularyItem;
};

const getUserMinimalVocabulary = async (
  userId: string,
  limit = 20,
  offset = 0,
  sort: VocabularySortOption = 'Latest',
  searchQuery?: string,
): Promise<{ items: MinimalVocabularyWord[]; total: number }> => {
  const orderBy =
    sort === 'Alphabetical'
      ? asc(wordsTable.normalizedWord)
      : desc(wordsTable.createdAt);

  const whereConditions = [eq(wordsTable.userId, userId)];

  if (searchQuery && searchQuery.trim()) {
    whereConditions.push(
      or(
        ilike(wordsTable.normalizedWord, `%${searchQuery}%`),
        sql`${wordsTable.commonData}::text ilike ${`%${searchQuery}%`}`,
      )!,
    );
  }

  const [items, [{ total }]] = await Promise.all([
    db
      .select({
        normalizedWord: wordsTable.normalizedWord,
        partOfSpeech: wordsTable.partOfSpeech,
        commonData: wordsTable.commonData,
      })
      .from(wordsTable)
      .where(and(...whereConditions))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset),

    db
      .select({ total: count() })
      .from(wordsTable)
      .where(and(...whereConditions)),
  ]);

  return {
    items: items as MinimalVocabularyWord[],
    total: total ?? 0,
  };
};

const getByNormalizedWordAndPos = async (
  userId: string,
  normalizedWord: string,
  partOfSpeech: string,
): Promise<VocabularyItem | null> => {
  const [word] = await db
    .select()
    .from(wordsTable)
    .where(
      and(
        eq(wordsTable.userId, userId),
        eq(wordsTable.normalizedWord, normalizedWord),
        eq(wordsTable.partOfSpeech, partOfSpeech),
      ),
    );

  return word ? (word as VocabularyItem) : null;
};

const getCachedWord = async (
  normalizedWord: string,
  targetLanguage: LanguageCode,
): Promise<VocabularyItemAnonymized | null> => {
  const [word] = await db
    .select()
    .from(wordCacheView)
    .where(
      and(
        eq(wordCacheView.normalizedWord, normalizedWord),
        eq(wordCacheView.targetLanguage, targetLanguage),
      ),
    );

  return word ? (word as VocabularyItemAnonymized) : null;
};

const deleteItem = async (wordId: string, userId: string): Promise<void> => {
  await db
    .delete(wordsTable)
    .where(and(eq(wordsTable.id, wordId), eq(wordsTable.userId, userId)));
};

const getLatestWords = async (userId: string, limit: number) => {
  return db
    .select()
    .from(wordsTable)
    .where(eq(wordsTable.userId, userId))
    .orderBy(wordsTable.createdAt)
    .limit(limit);
};

export {
  create,
  deleteItem,
  getByNormalizedWordAndPos,
  getCachedWord,
  getLatestWords,
  getUserMinimalVocabulary,
};
