import {
  collectionsTable,
  collectionVocabularyItemsTable,
} from './collections.schema';

export interface Collection {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionWithCount extends Collection {
  itemCount: number;
}

export interface CollectionMembership {
  id: string;
  collectionId: string;
  vocabularyItemId: string;
  addedAt: string;
}

export interface VocabularyItemWithCollections {
  vocabularyItemId: string;
  collections: Collection[];
}

// Drizzle inferred types
export type CollectionRow = typeof collectionsTable.$inferSelect;
export type InsertCollection = typeof collectionsTable.$inferInsert;
export type CollectionMembershipRow =
  typeof collectionVocabularyItemsTable.$inferSelect;
export type InsertCollectionMembership =
  typeof collectionVocabularyItemsTable.$inferInsert;

// Repository input/output types
export interface CreateCollectionInput {
  userId: string;
  name: string;
}

export interface UpdateCollectionInput {
  collectionId: string;
  userId: string;
  name: string;
}

export interface DeleteCollectionInput {
  collectionId: string;
  userId: string;
}

export interface AddItemToCollectionInput {
  collectionId: string;
  vocabularyItemId: string;
}

export interface RemoveItemFromCollectionInput {
  collectionId: string;
  vocabularyItemId: string;
}
