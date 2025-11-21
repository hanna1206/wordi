import { and, asc, count, desc, eq, inArray, lte, sql } from 'drizzle-orm';

import { db } from '@/db/client';
import { wordsTable } from '@/modules/vocabulary/vocabulary.schema';

import { userWordProgressTable } from './flashcards.schema';
import type { ExistingProgress, ProgressUpdate } from './flashcards.types';

const createInitialProgress = async (
  userId: string,
  wordId: string,
): Promise<void> => {
  try {
    await db.insert(userWordProgressTable).values({
      userId,
      wordId,
      status: 'new',
    });
  } catch (error) {
    // Ignore duplicate key errors (23505)
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code !== '23505'
    ) {
      throw error;
    }
  }
};

const getProgressByUserAndWord = async (
  userId: string,
  wordId: string,
): Promise<ExistingProgress | null> => {
  const [progress] = await db
    .select()
    .from(userWordProgressTable)
    .where(
      and(
        eq(userWordProgressTable.userId, userId),
        eq(userWordProgressTable.wordId, wordId),
      ),
    );

  return progress ? (progress as unknown as ExistingProgress) : null;
};

const updateProgress = async (
  progressId: string,
  update: Partial<ProgressUpdate>,
): Promise<void> => {
  await db
    .update(userWordProgressTable)
    .set({
      ...update,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(userWordProgressTable.id, progressId));
};

const getLatestWords = async (userId: string, limit: number) => {
  return db
    .select()
    .from(wordsTable)
    .where(eq(wordsTable.userId, userId))
    .orderBy(desc(wordsTable.createdAt))
    .limit(limit);
};

const getAllUserWords = async (userId: string) => {
  return db.select().from(wordsTable).where(eq(wordsTable.userId, userId));
};

const getRandomWords = async (userId: string, limit: number) => {
  return db
    .select()
    .from(wordsTable)
    .where(eq(wordsTable.userId, userId))
    .orderBy(sql`RANDOM()`)
    .limit(limit);
};

const getDueWords = async (userId: string, limit: number) => {
  const now = new Date().toISOString();

  return db
    .select({
      word: wordsTable,
      progress: userWordProgressTable,
    })
    .from(userWordProgressTable)
    .innerJoin(wordsTable, eq(userWordProgressTable.wordId, wordsTable.id))
    .where(
      and(
        eq(userWordProgressTable.userId, userId),
        lte(userWordProgressTable.nextReviewDate, now),
        eq(userWordProgressTable.isArchived, false),
      ),
    )
    .orderBy(asc(userWordProgressTable.nextReviewDate))
    .limit(limit);
};

const getWordsWithProgress = async (
  userId: string,
  limit: number,
  offset: number,
  sortBy: 'latest' | 'alphabetical' = 'latest',
) => {
  const orderBy =
    sortBy === 'alphabetical'
      ? asc(wordsTable.normalizedWord)
      : desc(wordsTable.createdAt);

  const [items, [{ total }]] = await Promise.all([
    db
      .select({
        word: {
          id: wordsTable.id,
          normalizedWord: wordsTable.normalizedWord,
          partOfSpeech: wordsTable.partOfSpeech,
          commonData: wordsTable.commonData,
          createdAt: wordsTable.createdAt,
        },
        progress: userWordProgressTable,
      })
      .from(wordsTable)
      .leftJoin(
        userWordProgressTable,
        and(
          eq(wordsTable.id, userWordProgressTable.wordId),
          eq(userWordProgressTable.userId, userId),
        ),
      )
      .where(eq(wordsTable.userId, userId))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset),

    db
      .select({ total: count() })
      .from(wordsTable)
      .where(eq(wordsTable.userId, userId)),
  ]);

  return { items, total: total ?? 0 };
};

const getProgressForWords = async (userId: string, wordIds: string[]) => {
  if (wordIds.length === 0) return [];

  return db
    .select()
    .from(userWordProgressTable)
    .where(
      and(
        eq(userWordProgressTable.userId, userId),
        inArray(userWordProgressTable.wordId, wordIds),
      ),
    );
};

const getDueWordsCount = async (userId: string): Promise<number> => {
  const now = new Date().toISOString();

  const [result] = await db
    .select({ count: count() })
    .from(userWordProgressTable)
    .where(
      and(
        eq(userWordProgressTable.userId, userId),
        lte(userWordProgressTable.nextReviewDate, now),
        eq(userWordProgressTable.isArchived, false),
      ),
    );

  return result?.count ?? 0;
};

const getTotalWordsCount = async (userId: string): Promise<number> => {
  const [result] = await db
    .select({ count: count() })
    .from(wordsTable)
    .where(eq(wordsTable.userId, userId));

  return result?.count ?? 0;
};

export {
  createInitialProgress,
  getAllUserWords,
  getDueWords,
  getDueWordsCount,
  getLatestWords,
  getProgressByUserAndWord,
  getProgressForWords,
  getRandomWords,
  getTotalWordsCount,
  getWordsWithProgress,
  updateProgress,
};
