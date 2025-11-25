'use server';

import * as Sentry from '@sentry/nextjs';

import { withAuth } from '@/modules/auth/utils/with-auth';
import type { ActionResult } from '@/shared-types';

import * as collectionsRepository from './collections.repository';
import type { Collection, CollectionWithCount } from './collections.types';
import {
  addItemToCollectionSchema,
  createCollectionSchema,
  deleteCollectionSchema,
  getCollectionsForItemSchema,
  removeItemFromCollectionSchema,
  updateCollectionSchema,
} from './collections.validation';

export const createCollection = withAuth<{ name: string }, Collection>(
  async (context, { name }): Promise<ActionResult<Collection>> => {
    try {
      const validation = createCollectionSchema.safeParse({ name });
      if (!validation.success) {
        return {
          success: false,
          error: validation.error.errors[0]?.message || 'Invalid input',
        };
      }

      const exists = await collectionsRepository.collectionExists(
        context.user.id,
        name,
      );
      if (exists) {
        return {
          success: false,
          error: 'A collection with this name already exists',
        };
      }

      const collection = await collectionsRepository.create(
        context.user.id,
        name,
      );

      return { success: true, data: collection };
    } catch (error) {
      Sentry.captureException(error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create collection',
      };
    }
  },
);

export const updateCollection = withAuth<
  { collectionId: string; name: string },
  Collection
>(
  async (
    context,
    { collectionId, name },
  ): Promise<ActionResult<Collection>> => {
    try {
      const validation = updateCollectionSchema.safeParse({
        collectionId,
        name,
      });
      if (!validation.success) {
        return {
          success: false,
          error: validation.error.errors[0]?.message || 'Invalid input',
        };
      }

      const existingCollection = await collectionsRepository.getCollectionById(
        collectionId,
        context.user.id,
      );
      if (!existingCollection) {
        return {
          success: false,
          error: 'Collection not found',
        };
      }

      const exists = await collectionsRepository.collectionExists(
        context.user.id,
        name,
      );
      if (exists && existingCollection.name !== name.trim()) {
        return {
          success: false,
          error: 'A collection with this name already exists',
        };
      }

      const collection = await collectionsRepository.update(
        collectionId,
        context.user.id,
        name,
      );

      return { success: true, data: collection };
    } catch (error) {
      Sentry.captureException(error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to update collection',
      };
    }
  },
);

export const deleteCollection = withAuth<{ collectionId: string }, void>(
  async (context, { collectionId }): Promise<ActionResult<void>> => {
    try {
      const validation = deleteCollectionSchema.safeParse({ collectionId });
      if (!validation.success) {
        return {
          success: false,
          error: validation.error.errors[0]?.message || 'Invalid input',
        };
      }

      const existingCollection = await collectionsRepository.getCollectionById(
        collectionId,
        context.user.id,
      );
      if (!existingCollection) {
        return {
          success: false,
          error: 'Collection not found',
        };
      }

      await collectionsRepository.deleteCollection(
        collectionId,
        context.user.id,
      );

      return { success: true };
    } catch (error) {
      Sentry.captureException(error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to delete collection',
      };
    }
  },
);

export const getUserCollections = withAuth<void, CollectionWithCount[]>(
  async (context): Promise<ActionResult<CollectionWithCount[]>> => {
    try {
      const collections = await collectionsRepository.getUserCollections(
        context.user.id,
      );

      return { success: true, data: collections };
    } catch (error) {
      Sentry.captureException(error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch collections',
      };
    }
  },
);

export const addItemToCollection = withAuth<
  { collectionId: string; vocabularyItemId: string },
  void
>(
  async (
    context,
    { collectionId, vocabularyItemId },
  ): Promise<ActionResult<void>> => {
    try {
      const validation = addItemToCollectionSchema.safeParse({
        collectionId,
        vocabularyItemId,
      });
      if (!validation.success) {
        return {
          success: false,
          error: validation.error.errors[0]?.message || 'Invalid input',
        };
      }

      const existingCollection = await collectionsRepository.getCollectionById(
        collectionId,
        context.user.id,
      );
      if (!existingCollection) {
        return {
          success: false,
          error: 'Collection not found',
        };
      }

      await collectionsRepository.addItemToCollection(
        collectionId,
        vocabularyItemId,
      );

      return { success: true };
    } catch (error) {
      Sentry.captureException(error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to add item to collection',
      };
    }
  },
);

export const removeItemFromCollection = withAuth<
  { collectionId: string; vocabularyItemId: string },
  void
>(
  async (
    context,
    { collectionId, vocabularyItemId },
  ): Promise<ActionResult<void>> => {
    try {
      const validation = removeItemFromCollectionSchema.safeParse({
        collectionId,
        vocabularyItemId,
      });
      if (!validation.success) {
        return {
          success: false,
          error: validation.error.errors[0]?.message || 'Invalid input',
        };
      }

      const existingCollection = await collectionsRepository.getCollectionById(
        collectionId,
        context.user.id,
      );
      if (!existingCollection) {
        return {
          success: false,
          error: 'Collection not found',
        };
      }

      await collectionsRepository.removeItemFromCollection(
        collectionId,
        vocabularyItemId,
      );

      return { success: true };
    } catch (error) {
      Sentry.captureException(error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to remove item from collection',
      };
    }
  },
);

export const getCollectionsForItem = withAuth<
  { vocabularyItemId: string },
  Collection[]
>(
  async (
    context,
    { vocabularyItemId },
  ): Promise<ActionResult<Collection[]>> => {
    try {
      const validation = getCollectionsForItemSchema.safeParse({
        vocabularyItemId,
      });
      if (!validation.success) {
        return {
          success: false,
          error: validation.error.errors[0]?.message || 'Invalid input',
        };
      }

      const collections =
        await collectionsRepository.getCollectionsForItem(vocabularyItemId);

      const userCollections = collections.filter(
        (collection) => collection.userId === context.user.id,
      );

      return { success: true, data: userCollections };
    } catch (error) {
      Sentry.captureException(error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch collections for item',
      };
    }
  },
);
