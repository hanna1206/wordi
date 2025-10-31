'use server';

import * as Sentry from '@sentry/nextjs';

import { withAuth } from '@/modules/auth/utils/with-auth';
import { createInitialWordProgressService } from '@/modules/flashcards/flash-cards-game.service';
import { LanguageCode } from '@/modules/user-settings/user-settings.const';
import { withUserSettings } from '@/modules/user-settings/utils/with-user-settings';
import type { ActionResult } from '@/shared-types';

import { LinguisticItem } from '../linguistics/linguistics.types';
import {
  deleteUserWord,
  getCachedWord,
  getUserMinimalVocabulary,
  getUserWordByNormalizedWordAndPos,
  saveWordToDatabase,
} from './vocabulary.service';
import type {
  MinimalVocabularyWord,
  VocabularyItem,
  VocabularyItemAnonymized,
  VocabularySortOption,
} from './vocabulary.types';

// Save word for learning
export const saveWordForLearning = withUserSettings<
  LinguisticItem,
  VocabularyItem
>(async (context, linguisticItem): Promise<ActionResult<VocabularyItem>> => {
  // Validate input
  if (!linguisticItem || !linguisticItem.normalizedWord) {
    const error = 'Valid translation result is required';

    return {
      success: false,
      error,
    };
  }

  try {
    const saved = await saveWordToDatabase(
      linguisticItem,
      context.userId,
      context.userSettings.native_language as LanguageCode,
    );

    await createInitialWordProgressService(context.userId, saved.id);

    return { success: true, data: saved };
  } catch (error) {
    Sentry.captureException(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save word',
    };
  }
});

// Note: Word duplicate checking is handled by database constraints
// No need for separate checkWordSaved action

// Get cached word
export const getWordFromCache = withUserSettings<
  string,
  VocabularyItemAnonymized | null
>(
  async (
    context,
    normalizedWord: string,
  ): Promise<ActionResult<VocabularyItemAnonymized | null>> => {
    try {
      const data = await getCachedWord(
        normalizedWord,
        context.userSettings.native_language as LanguageCode,
      );
      return { success: true, data };
    } catch (error) {
      Sentry.captureException(error);
      return { success: false, error: 'Failed to get cached word' };
    }
  },
);

type FetchMinimalVocabularyParams = {
  limit?: number;
  offset?: number;
  sort?: VocabularySortOption;
};

export const fetchUserMinimalVocabulary = withAuth<
  FetchMinimalVocabularyParams,
  { items: MinimalVocabularyWord[]; total: number }
>(
  async (
    context,
    { limit = 20, offset = 0, sort = 'Latest' },
  ): Promise<
    ActionResult<{ items: MinimalVocabularyWord[]; total: number }>
  > => {
    try {
      const data = await getUserMinimalVocabulary(
        context.userId,
        limit,
        offset,
        sort,
      );
      return { success: true, data };
    } catch (error) {
      Sentry.captureException(error);
      return { success: false, error: 'Failed to get saved words' };
    }
  },
);

type FetchWordParams = {
  normalizedWord: string;
  partOfSpeech: string;
};

export const fetchUserWordByNormalizedWordAndPos = withAuth<
  FetchWordParams,
  VocabularyItem | null
>(
  async (
    context,
    { normalizedWord, partOfSpeech },
  ): Promise<ActionResult<VocabularyItem | null>> => {
    try {
      const data = await getUserWordByNormalizedWordAndPos(
        context.userId,
        normalizedWord,
        partOfSpeech,
      );
      return { success: true, data };
    } catch (error) {
      Sentry.captureException(error);
      return { success: false, error: 'Failed to get word' };
    }
  },
);

// Delete user word
export const deleteWord = withAuth<{ wordId: string }, void>(
  async (context, { wordId }): Promise<ActionResult<void>> => {
    try {
      await deleteUserWord(wordId, context.userId);
      return { success: true };
    } catch (error) {
      Sentry.captureException(error);
      return { success: false, error: 'Failed to delete word' };
    }
  },
);
