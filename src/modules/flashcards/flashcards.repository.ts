import { and, asc, count, desc, eq, inArray, lte, sql } from 'drizzle-orm';

import { db } from '@/db/client';
import { collectionVocabularyItemsTable } from '@/modules/collection/collections.schema';
import { vocabularyItemsTable } from '@/modules/vocabulary/vocabulary.schema';

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
    .from(vocabularyItemsTable)
    .where(
      and(
        eq(vocabularyItemsTable.userId, userId),
        eq(vocabularyItemsTable.isHidden, false),
      ),
    )
    .orderBy(desc(vocabularyItemsTable.createdAt))
    .limit(limit);
};

const getAllUserWords = async (userId: string) => {
  return db
    .select()
    .from(vocabularyItemsTable)
    .where(
      and(
        eq(vocabularyItemsTable.userId, userId),
        eq(vocabularyItemsTable.isHidden, false),
      ),
    );
};

const getRandomWords = async (userId: string, limit: number) => {
  return db
    .select()
    .from(vocabularyItemsTable)
    .where(
      and(
        eq(vocabularyItemsTable.userId, userId),
        eq(vocabularyItemsTable.isHidden, false),
      ),
    )
    .orderBy(sql`RANDOM()`)
    .limit(limit);
};

const getDueWords = async (
  userId: string,
  limit: number,
  collectionId?: string,
) => {
  const now = new Date().toISOString();

  // Build base query
  let query = db
    .select({
      word: vocabularyItemsTable,
      progress: userWordProgressTable,
    })
    .from(userWordProgressTable)
    .innerJoin(
      vocabularyItemsTable,
      eq(userWordProgressTable.wordId, vocabularyItemsTable.id),
    );

  // Add collection join if collectionId is provided
  if (collectionId) {
    query = query.innerJoin(
      collectionVocabularyItemsTable,
      and(
        eq(
          collectionVocabularyItemsTable.vocabularyItemId,
          vocabularyItemsTable.id,
        ),
        eq(collectionVocabularyItemsTable.collectionId, collectionId),
      ),
    ) as typeof query;
  }

  // Apply filters
  return query
    .where(
      and(
        eq(userWordProgressTable.userId, userId),
        lte(userWordProgressTable.nextReviewDate, now),
        eq(userWordProgressTable.isArchived, false),
        eq(vocabularyItemsTable.isHidden, false),
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
      ? asc(vocabularyItemsTable.sortableText)
      : desc(vocabularyItemsTable.createdAt);

  const [items, [{ total }]] = await Promise.all([
    db
      .select({
        word: {
          id: vocabularyItemsTable.id,
          normalizedText: vocabularyItemsTable.normalizedText,
          partOfSpeech: vocabularyItemsTable.partOfSpeech,
          commonData: vocabularyItemsTable.commonData,
          createdAt: vocabularyItemsTable.createdAt,
        },
        progress: userWordProgressTable,
      })
      .from(vocabularyItemsTable)
      .leftJoin(
        userWordProgressTable,
        and(
          eq(vocabularyItemsTable.id, userWordProgressTable.wordId),
          eq(userWordProgressTable.userId, userId),
        ),
      )
      .where(eq(vocabularyItemsTable.userId, userId))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset),

    db
      .select({ total: count() })
      .from(vocabularyItemsTable)
      .where(eq(vocabularyItemsTable.userId, userId)),
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

const getDueWordsCount = async (
  userId: string,
  collectionId?: string,
): Promise<number> => {
  const now = new Date().toISOString();

  // Build base query
  let query = db
    .select({ count: count() })
    .from(userWordProgressTable)
    .innerJoin(
      vocabularyItemsTable,
      eq(userWordProgressTable.wordId, vocabularyItemsTable.id),
    );

  // Add collection join if collectionId is provided
  if (collectionId) {
    query = query.innerJoin(
      collectionVocabularyItemsTable,
      and(
        eq(
          collectionVocabularyItemsTable.vocabularyItemId,
          vocabularyItemsTable.id,
        ),
        eq(collectionVocabularyItemsTable.collectionId, collectionId),
      ),
    ) as typeof query;
  }

  // Apply filters
  const [result] = await query.where(
    and(
      eq(userWordProgressTable.userId, userId),
      lte(userWordProgressTable.nextReviewDate, now),
      eq(userWordProgressTable.isArchived, false),
      eq(vocabularyItemsTable.isHidden, false),
    ),
  );

  return result?.count ?? 0;
};

const getTotalWordsCount = async (userId: string): Promise<number> => {
  const [result] = await db
    .select({ count: count() })
    .from(vocabularyItemsTable)
    .where(
      and(
        eq(vocabularyItemsTable.userId, userId),
        eq(vocabularyItemsTable.isHidden, false),
      ),
    );

  return result?.count ?? 0;
};

const resetProgress = async (userId: string, wordId: string): Promise<void> => {
  const progress = await getProgressByUserAndWord(userId, wordId);

  if (!progress) {
    throw new Error('No progress record found for this word');
  }

  await db
    .update(userWordProgressTable)
    .set({
      status: 'new',
      easinessFactor: '2.50',
      intervalDays: 1,
      repetitionCount: 0,
      nextReviewDate: new Date().toISOString(),
      lastReviewedAt: null,
      totalReviews: 0,
      correctReviews: 0,
      consecutiveCorrect: 0,
      qualityScores: [],
      updatedAt: new Date().toISOString(),
    })
    .where(
      and(
        eq(userWordProgressTable.userId, userId),
        eq(userWordProgressTable.wordId, wordId),
      ),
    );
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
  resetProgress,
  updateProgress,
};
