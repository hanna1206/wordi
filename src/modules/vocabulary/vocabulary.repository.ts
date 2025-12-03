import { and, asc, count, desc, eq, ilike, inArray, sql } from 'drizzle-orm';

import { db } from '@/db/client';
import { collectionVocabularyItemsTable } from '@/modules/collection/collections.schema';
import { userWordProgressTable } from '@/modules/flashcards/flashcards.schema';
import { PartOfSpeech } from '@/modules/linguistics/linguistics.const';

import { vocabularyItemsTable } from './vocabulary.schema';
import type {
  MinimalVocabularyWordWithProgress,
  ProgressAccuracyFilter,
  ProgressReviewFilter,
  ProgressStatusFilter,
  VisibilityFilter,
  VocabularyItem,
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
  collectionIds?: string[],
  progressStatusFilter: ProgressStatusFilter[] = [],
  progressAccuracyFilter: ProgressAccuracyFilter = 'all',
  progressReviewFilter: ProgressReviewFilter = 'all',
): Promise<{ items: MinimalVocabularyWordWithProgress[]; total: number }> => {
  // Determine sort order
  let orderBy;
  switch (sort) {
    case 'Alphabetical':
      orderBy = asc(vocabularyItemsTable.sortableText);
      break;
    case 'Progress: Status':
      // Order: new -> learning -> review -> lapsed -> graduated, nulls last
      orderBy = sql`
        CASE 
          WHEN ${userWordProgressTable.status} IS NULL THEN 6
          WHEN ${userWordProgressTable.status} = 'new' THEN 1
          WHEN ${userWordProgressTable.status} = 'learning' THEN 2
          WHEN ${userWordProgressTable.status} = 'review' THEN 3
          WHEN ${userWordProgressTable.status} = 'lapsed' THEN 4
          WHEN ${userWordProgressTable.status} = 'graduated' THEN 5
          ELSE 7
        END ASC
      `;
      break;
    case 'Progress: Next Review':
      // Earlier dates first, nulls last
      orderBy = sql`${userWordProgressTable.nextReviewDate} ASC NULLS LAST`;
      break;
    case 'Progress: Accuracy':
      // Lower accuracy first (needs more practice), nulls last
      orderBy = sql`
        CASE 
          WHEN ${userWordProgressTable.totalReviews} = 0 THEN NULL
          ELSE CAST(${userWordProgressTable.correctReviews} AS FLOAT) / ${userWordProgressTable.totalReviews}
        END ASC NULLS LAST
      `;
      break;
    case 'Progress: Reviews':
      // More reviews first, nulls last
      orderBy = sql`${userWordProgressTable.totalReviews} DESC NULLS LAST`;
      break;
    case 'Latest':
    default:
      orderBy = desc(vocabularyItemsTable.createdAt);
      break;
  }

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

  // Progress Status Filter
  if (progressStatusFilter.length > 0) {
    const statusConditions = [];

    for (const status of progressStatusFilter) {
      if (status === 'not-started') {
        // Words without progress
        statusConditions.push(sql`${userWordProgressTable.id} IS NULL`);
      } else {
        // Words with specific status
        statusConditions.push(eq(userWordProgressTable.status, status));
      }
    }

    // Combine with OR
    if (statusConditions.length > 0) {
      whereConditions.push(sql`(${sql.join(statusConditions, sql` OR `)})`);
    }
  }

  // Progress Accuracy Filter
  if (progressAccuracyFilter !== 'all') {
    const accuracyCondition = sql`
      CASE 
        WHEN ${userWordProgressTable.totalReviews} = 0 OR ${userWordProgressTable.totalReviews} IS NULL THEN NULL
        ELSE CAST(${userWordProgressTable.correctReviews} AS FLOAT) / ${userWordProgressTable.totalReviews}
      END
    `;

    if (progressAccuracyFilter === 'low') {
      whereConditions.push(sql`${accuracyCondition} < 0.5`);
    } else if (progressAccuracyFilter === 'medium') {
      whereConditions.push(
        sql`${accuracyCondition} >= 0.5 AND ${accuracyCondition} <= 0.8`,
      );
    } else if (progressAccuracyFilter === 'high') {
      whereConditions.push(sql`${accuracyCondition} > 0.8`);
    }
  }

  // Progress Review Filter
  if (progressReviewFilter !== 'all') {
    const now = sql`NOW()`;

    if (progressReviewFilter === 'due') {
      whereConditions.push(
        sql`${userWordProgressTable.nextReviewDate} <= ${now}`,
      );
    } else if (progressReviewFilter === 'overdue') {
      whereConditions.push(
        sql`${userWordProgressTable.nextReviewDate} < ${now}`,
      );
    } else if (progressReviewFilter === 'upcoming') {
      whereConditions.push(
        sql`${userWordProgressTable.nextReviewDate} > ${now}`,
      );
    }
  }

  // Build the base query with optional collection filtering
  // When multiple collections are selected, we use union (OR) logic:
  // items that belong to ANY of the selected collections (without duplicates)
  let baseQuery;
  let countQuery;

  if (collectionIds && collectionIds.length > 0) {
    // Use DISTINCT with a subquery to get unique vocabulary items from any selected collection
    // This implements union logic (item in ANY collection, no duplicates)
    const collectionFilterSubquery = db
      .selectDistinct({
        vocabularyItemId: collectionVocabularyItemsTable.vocabularyItemId,
      })
      .from(collectionVocabularyItemsTable)
      .where(
        inArray(collectionVocabularyItemsTable.collectionId, collectionIds),
      )
      .as('filtered_items');

    baseQuery = db
      .select({
        id: vocabularyItemsTable.id,
        type: vocabularyItemsTable.type,
        normalizedText: vocabularyItemsTable.normalizedText,
        partOfSpeech: vocabularyItemsTable.partOfSpeech,
        commonData: vocabularyItemsTable.commonData,
        isHidden: vocabularyItemsTable.isHidden,
        progress: {
          status: userWordProgressTable.status,
          nextReviewDate: userWordProgressTable.nextReviewDate,
          totalReviews: userWordProgressTable.totalReviews,
          correctReviews: userWordProgressTable.correctReviews,
          consecutiveCorrect: userWordProgressTable.consecutiveCorrect,
          intervalDays: userWordProgressTable.intervalDays,
        },
      })
      .from(vocabularyItemsTable)
      .innerJoin(
        collectionFilterSubquery,
        eq(vocabularyItemsTable.id, collectionFilterSubquery.vocabularyItemId),
      )
      .leftJoin(
        userWordProgressTable,
        and(
          eq(vocabularyItemsTable.id, userWordProgressTable.wordId),
          eq(userWordProgressTable.userId, userId),
        ),
      );

    countQuery = db
      .select({ total: count() })
      .from(vocabularyItemsTable)
      .innerJoin(
        collectionFilterSubquery,
        eq(vocabularyItemsTable.id, collectionFilterSubquery.vocabularyItemId),
      )
      .leftJoin(
        userWordProgressTable,
        and(
          eq(vocabularyItemsTable.id, userWordProgressTable.wordId),
          eq(userWordProgressTable.userId, userId),
        ),
      );
  } else {
    // No collection filter - query all vocabulary items
    baseQuery = db
      .select({
        id: vocabularyItemsTable.id,
        type: vocabularyItemsTable.type,
        normalizedText: vocabularyItemsTable.normalizedText,
        partOfSpeech: vocabularyItemsTable.partOfSpeech,
        commonData: vocabularyItemsTable.commonData,
        isHidden: vocabularyItemsTable.isHidden,
        progress: {
          status: userWordProgressTable.status,
          nextReviewDate: userWordProgressTable.nextReviewDate,
          totalReviews: userWordProgressTable.totalReviews,
          correctReviews: userWordProgressTable.correctReviews,
          consecutiveCorrect: userWordProgressTable.consecutiveCorrect,
          intervalDays: userWordProgressTable.intervalDays,
        },
      })
      .from(vocabularyItemsTable)
      .leftJoin(
        userWordProgressTable,
        and(
          eq(vocabularyItemsTable.id, userWordProgressTable.wordId),
          eq(userWordProgressTable.userId, userId),
        ),
      );

    countQuery = db
      .select({ total: count() })
      .from(vocabularyItemsTable)
      .leftJoin(
        userWordProgressTable,
        and(
          eq(vocabularyItemsTable.id, userWordProgressTable.wordId),
          eq(userWordProgressTable.userId, userId),
        ),
      );
  }

  const [items, [{ total }]] = await Promise.all([
    baseQuery
      .where(and(...whereConditions))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset),

    countQuery.where(and(...whereConditions)),
  ]);

  return {
    items: items as MinimalVocabularyWordWithProgress[],
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
  getLatestWords,
  getUserMinimalVocabulary,
  toggleWordHidden,
};
