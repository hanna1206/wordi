import { and, asc, count, eq, sql } from 'drizzle-orm';

import { db } from '@/db/client';

import {
  collectionsTable,
  collectionVocabularyItemsTable,
} from './collections.schema';
import type { Collection, CollectionWithCount } from './collections.types';

/**
 * Create a new collection for a user
 */
export const create = async (
  userId: string,
  name: string,
): Promise<Collection> => {
  const [collection] = await db
    .insert(collectionsTable)
    .values({
      userId,
      name: name.trim(),
    })
    .returning();

  return collection as Collection;
};

/**
 * Update a collection's name
 */
export const update = async (
  collectionId: string,
  userId: string,
  name: string,
): Promise<Collection> => {
  const [collection] = await db
    .update(collectionsTable)
    .set({
      name: name.trim(),
      updatedAt: sql`timezone('utc'::text, now())`,
    })
    .where(
      and(
        eq(collectionsTable.id, collectionId),
        eq(collectionsTable.userId, userId),
      ),
    )
    .returning();

  if (!collection) {
    throw new Error('Collection not found');
  }

  return collection as Collection;
};

/**
 * Delete a collection
 */
export const deleteCollection = async (
  collectionId: string,
  userId: string,
): Promise<void> => {
  await db
    .delete(collectionsTable)
    .where(
      and(
        eq(collectionsTable.id, collectionId),
        eq(collectionsTable.userId, userId),
      ),
    );
};

/**
 * Get all collections for a user with item counts
 */
export const getUserCollections = async (
  userId: string,
): Promise<CollectionWithCount[]> => {
  const collections = await db
    .select({
      id: collectionsTable.id,
      userId: collectionsTable.userId,
      name: collectionsTable.name,
      createdAt: collectionsTable.createdAt,
      updatedAt: collectionsTable.updatedAt,
      itemCount: count(collectionVocabularyItemsTable.id),
    })
    .from(collectionsTable)
    .leftJoin(
      collectionVocabularyItemsTable,
      eq(collectionsTable.id, collectionVocabularyItemsTable.collectionId),
    )
    .where(eq(collectionsTable.userId, userId))
    .groupBy(collectionsTable.id)
    .orderBy(asc(collectionsTable.name));

  return collections.map((c) => ({
    ...c,
    itemCount: Number(c.itemCount),
  })) as CollectionWithCount[];
};

/**
 * Get a collection by ID
 */
export const getCollectionById = async (
  collectionId: string,
  userId: string,
): Promise<Collection | null> => {
  const [collection] = await db
    .select()
    .from(collectionsTable)
    .where(
      and(
        eq(collectionsTable.id, collectionId),
        eq(collectionsTable.userId, userId),
      ),
    );

  return collection ? (collection as Collection) : null;
};

/**
 * Add a vocabulary item to a collection
 */
export const addItemToCollection = async (
  collectionId: string,
  vocabularyItemId: string,
): Promise<void> => {
  await db
    .insert(collectionVocabularyItemsTable)
    .values({
      collectionId,
      vocabularyItemId,
    })
    .onConflictDoNothing();
};

/**
 * Remove a vocabulary item from a collection
 */
export const removeItemFromCollection = async (
  collectionId: string,
  vocabularyItemId: string,
): Promise<void> => {
  await db
    .delete(collectionVocabularyItemsTable)
    .where(
      and(
        eq(collectionVocabularyItemsTable.collectionId, collectionId),
        eq(collectionVocabularyItemsTable.vocabularyItemId, vocabularyItemId),
      ),
    );
};

/**
 * Get all collections that contain a specific vocabulary item
 */
export const getCollectionsForItem = async (
  vocabularyItemId: string,
): Promise<Collection[]> => {
  const collections = await db
    .select({
      id: collectionsTable.id,
      userId: collectionsTable.userId,
      name: collectionsTable.name,
      createdAt: collectionsTable.createdAt,
      updatedAt: collectionsTable.updatedAt,
    })
    .from(collectionsTable)
    .innerJoin(
      collectionVocabularyItemsTable,
      eq(collectionsTable.id, collectionVocabularyItemsTable.collectionId),
    )
    .where(
      eq(collectionVocabularyItemsTable.vocabularyItemId, vocabularyItemId),
    )
    .orderBy(asc(collectionsTable.name));

  return collections as Collection[];
};

/**
 * Get all vocabulary item IDs in a collection
 */
export const getItemsInCollection = async (
  collectionId: string,
  userId: string,
): Promise<string[]> => {
  // First verify the collection belongs to the user
  const collection = await getCollectionById(collectionId, userId);
  if (!collection) {
    throw new Error('Collection not found');
  }

  const items = await db
    .select({
      vocabularyItemId: collectionVocabularyItemsTable.vocabularyItemId,
    })
    .from(collectionVocabularyItemsTable)
    .where(eq(collectionVocabularyItemsTable.collectionId, collectionId));

  return items.map((item) => item.vocabularyItemId);
};

/**
 * Check if a collection with the given name already exists for a user
 */
export const collectionExists = async (
  userId: string,
  name: string,
): Promise<boolean> => {
  const [result] = await db
    .select({ count: count() })
    .from(collectionsTable)
    .where(
      and(
        eq(collectionsTable.userId, userId),
        eq(collectionsTable.name, name.trim()),
      ),
    );

  return Number(result?.count) > 0;
};
