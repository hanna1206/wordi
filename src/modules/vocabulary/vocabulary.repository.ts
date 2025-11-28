import { and, asc, count, desc, eq, ilike, inArray } from 'drizzle-orm';

import { db } from '@/db/client';
import { collectionVocabularyItemsTable } from '@/modules/collection/collections.schema';
import { PartOfSpeech } from '@/modules/linguistics/linguistics.const';
import { LanguageCode } from '@/modules/user-settings/user-settings.const';

import { vocabularyCacheView, vocabularyItemsTable } from './vocabulary.schema';
import type {
  MinimalVocabularyWord,
  VisibilityFilter,
  VocabularyItem,
  VocabularyItemAnonymized,
  VocabularySortOption,
  VocabularyTypeFilter,
} from './vocabulary.types';
import { ALL_PARTS_OF_SPEECH } from './vocabulary.types';

const create = async (
  data: typeof vocabularyItemsTable.$inferInsert,
): Promise<VocabularyItem> => {
  const [word] = await db.insert(vocabularyItemsTable).values(data).returning();
  return word as VocabularyItem;
};

const getUserMinimalVocabulary = async (
  userId: string,
  limit = 20,
  offset = 0,
  sort: VocabularySortOption = 'Latest',
  searchQuery?: string,
  visibilityFilter: VisibilityFilter = 'visible-only',
  partsOfSpeech: PartOfSpeech[] = [],
  typeFilter: VocabularyTypeFilter = 'all',
  collectionId?: string,
): Promise<{ items: MinimalVocabularyWord[]; total: number }> => {
  const orderBy =
    sort === 'Alphabetical'
      ? asc(vocabularyItemsTable.sortableText)
      : desc(vocabularyItemsTable.createdAt);

  const whereConditions = [eq(vocabularyItemsTable.userId, userId)];

  if (searchQuery && searchQuery.trim()) {
    whereConditions.push(
      ilike(vocabularyItemsTable.normalizedText, `%${searchQuery}%`),
    );
  }
  if (visibilityFilter === 'hidden-only') {
    whereConditions.push(eq(vocabularyItemsTable.isHidden, true));
  } else if (visibilityFilter === 'visible-only') {
    whereConditions.push(eq(vocabularyItemsTable.isHidden, false));
  }

  if (typeFilter === 'words-only') {
    whereConditions.push(eq(vocabularyItemsTable.type, 'word'));
  } else if (typeFilter === 'collocations-only') {
    whereConditions.push(eq(vocabularyItemsTable.type, 'collocation'));
  }

  // Only apply part of speech filter if at least one is selected
  if (
    partsOfSpeech.length > 0 &&
    partsOfSpeech.length < ALL_PARTS_OF_SPEECH.length
  ) {
    whereConditions.push(
      inArray(vocabularyItemsTable.partOfSpeech, partsOfSpeech),
    );
  }

  // Add collection filter if collectionId is provided
  if (collectionId) {
    whereConditions.push(
      eq(collectionVocabularyItemsTable.collectionId, collectionId),
    );
  }

  // Build the base query with optional join
  const baseQuery = collectionId
    ? db
        .select({
          id: vocabularyItemsTable.id,
          type: vocabularyItemsTable.type,
          normalizedText: vocabularyItemsTable.normalizedText,
          partOfSpeech: vocabularyItemsTable.partOfSpeech,
          commonData: vocabularyItemsTable.commonData,
          isHidden: vocabularyItemsTable.isHidden,
        })
        .from(vocabularyItemsTable)
        .innerJoin(
          collectionVocabularyItemsTable,
          eq(
            vocabularyItemsTable.id,
            collectionVocabularyItemsTable.vocabularyItemId,
          ),
        )
    : db
        .select({
          id: vocabularyItemsTable.id,
          type: vocabularyItemsTable.type,
          normalizedText: vocabularyItemsTable.normalizedText,
          partOfSpeech: vocabularyItemsTable.partOfSpeech,
          commonData: vocabularyItemsTable.commonData,
          isHidden: vocabularyItemsTable.isHidden,
        })
        .from(vocabularyItemsTable);

  const countQuery = collectionId
    ? db
        .select({ total: count() })
        .from(vocabularyItemsTable)
        .innerJoin(
          collectionVocabularyItemsTable,
          eq(
            vocabularyItemsTable.id,
            collectionVocabularyItemsTable.vocabularyItemId,
          ),
        )
    : db.select({ total: count() }).from(vocabularyItemsTable);

  const [items, [{ total }]] = await Promise.all([
    baseQuery
      .where(and(...whereConditions))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset),

    countQuery.where(and(...whereConditions)),
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
    .from(vocabularyItemsTable)
    .where(
      and(
        eq(vocabularyItemsTable.userId, userId),
        eq(vocabularyItemsTable.normalizedText, normalizedWord),
        eq(vocabularyItemsTable.partOfSpeech, partOfSpeech),
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
    .from(vocabularyCacheView)
    .where(
      and(
        eq(vocabularyCacheView.normalizedText, normalizedWord),
        eq(vocabularyCacheView.targetLanguage, targetLanguage),
      ),
    );

  return word ? (word as VocabularyItemAnonymized) : null;
};

// Deletes a vocabulary item and all associated collection memberships (via cascade)
const deleteItem = async (wordId: string, userId: string): Promise<void> => {
  await db
    .delete(vocabularyItemsTable)
    .where(
      and(
        eq(vocabularyItemsTable.id, wordId),
        eq(vocabularyItemsTable.userId, userId),
      ),
    );
};

const getLatestWords = async (userId: string, limit: number) => {
  return db
    .select()
    .from(vocabularyItemsTable)
    .where(eq(vocabularyItemsTable.userId, userId))
    .orderBy(desc(vocabularyItemsTable.createdAt))
    .limit(limit);
};

const toggleWordHidden = async (
  wordId: string,
  userId: string,
  isHidden: boolean,
): Promise<void> => {
  await db
    .update(vocabularyItemsTable)
    .set({ isHidden, updatedAt: new Date().toISOString() })
    .where(
      and(
        eq(vocabularyItemsTable.id, wordId),
        eq(vocabularyItemsTable.userId, userId),
      ),
    );
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
