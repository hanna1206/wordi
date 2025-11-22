import { and, asc, count, desc, eq, ilike, inArray } from 'drizzle-orm';

import { db } from '@/db/client';
import { PartOfSpeech } from '@/modules/linguistics/linguistics.const';
import { LanguageCode } from '@/modules/user-settings/user-settings.const';

import { wordCacheView, wordsTable } from './vocabulary.schema';
import type {
  MinimalVocabularyWord,
  VisibilityFilter,
  VocabularyItem,
  VocabularyItemAnonymized,
  VocabularySortOption,
} from './vocabulary.types';
import { ALL_PARTS_OF_SPEECH } from './vocabulary.types';

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
  visibilityFilter: VisibilityFilter = 'visible-only',
  partsOfSpeech: PartOfSpeech[] = ALL_PARTS_OF_SPEECH,
): Promise<{ items: MinimalVocabularyWord[]; total: number }> => {
  const orderBy =
    sort === 'Alphabetical'
      ? asc(wordsTable.sortableWord)
      : desc(wordsTable.createdAt);

  const whereConditions = [eq(wordsTable.userId, userId)];

  if (searchQuery && searchQuery.trim()) {
    whereConditions.push(ilike(wordsTable.normalizedWord, `%${searchQuery}%`));
  }

  // Apply visibility filter
  if (visibilityFilter === 'hidden-only') {
    whereConditions.push(eq(wordsTable.isHidden, true));
  } else if (visibilityFilter === 'visible-only') {
    whereConditions.push(eq(wordsTable.isHidden, false));
  }
  // 'any' means no visibility filter is applied

  // Apply parts of speech filter
  // If empty array, no results should be returned
  if (partsOfSpeech.length === 0) {
    // Add a condition that will never match to return empty results
    whereConditions.push(eq(wordsTable.id, 'impossible-id-that-never-exists'));
  } else if (partsOfSpeech.length < ALL_PARTS_OF_SPEECH.length) {
    // Only apply filter if it's a subset (not all parts of speech)
    whereConditions.push(inArray(wordsTable.partOfSpeech, partsOfSpeech));
  }
  // If all parts of speech are selected, no filter is needed

  const [items, [{ total }]] = await Promise.all([
    db
      .select({
        id: wordsTable.id,
        normalizedWord: wordsTable.normalizedWord,
        partOfSpeech: wordsTable.partOfSpeech,
        commonData: wordsTable.commonData,
        isHidden: wordsTable.isHidden,
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
    .orderBy(desc(wordsTable.createdAt))
    .limit(limit);
};

const toggleWordHidden = async (
  wordId: string,
  userId: string,
  isHidden: boolean,
): Promise<void> => {
  await db
    .update(wordsTable)
    .set({ isHidden, updatedAt: new Date().toISOString() })
    .where(and(eq(wordsTable.id, wordId), eq(wordsTable.userId, userId)));
};

export {
  create,
  deleteItem,
  getByNormalizedWordAndPos,
  getCachedWord,
  getLatestWords,
  getUserMinimalVocabulary,
  toggleWordHidden,
};
