import { z } from 'zod';

// Collection name validation schema (1-100 chars, non-empty)
export const collectionNameSchema = z
  .string()
  .trim()
  .min(1, 'Collection name cannot be empty')
  .max(100, 'Collection name must be 100 characters or less');

// Schema for creating a collection
export const createCollectionSchema = z.object({
  name: collectionNameSchema,
});

// Schema for updating a collection
export const updateCollectionSchema = z.object({
  collectionId: z.string().uuid('Invalid collection ID'),
  name: collectionNameSchema,
});

// Schema for deleting a collection
export const deleteCollectionSchema = z.object({
  collectionId: z.string().uuid('Invalid collection ID'),
});

// Schema for adding an item to a collection
export const addItemToCollectionSchema = z.object({
  collectionId: z.string().uuid('Invalid collection ID'),
  vocabularyItemId: z.string().uuid('Invalid vocabulary item ID'),
});

// Schema for removing an item from a collection
export const removeItemFromCollectionSchema = z.object({
  collectionId: z.string().uuid('Invalid collection ID'),
  vocabularyItemId: z.string().uuid('Invalid vocabulary item ID'),
});

// Schema for getting collections for an item
export const getCollectionsForItemSchema = z.object({
  vocabularyItemId: z.string().uuid('Invalid vocabulary item ID'),
});
