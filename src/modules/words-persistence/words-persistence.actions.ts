'use server';

import { withAuth } from '@/modules/auth/utils/with-auth';
import { LanguageCode } from '@/modules/user-settings/user-settings.const';
import { withUserSettings } from '@/modules/user-settings/utils/with-user-settings';
import type { ActionResult } from '@/shared-types';

import {
  deleteUserWord,
  getCachedWord,
  getUserSavedWords,
  saveWordToDatabase,
} from './words-persistence.service';
import type {
  CachedWord,
  SavedWord,
  SaveWordInput,
} from './words-persistence.types';

// Save word for learning
export const saveWordForLearning = withUserSettings<SaveWordInput, SavedWord>(
  async (context, input): Promise<ActionResult<SavedWord>> => {
    const { translationResult } = input;

    // Validate input
    if (!translationResult || !translationResult.normalizedWord) {
      const error = 'Valid translation result is required';

      return {
        success: false,
        error,
      };
    }

    try {
      // Try to save - database constraint will handle duplicates
      const saveResult = await saveWordToDatabase(
        input,
        context.userId,
        context.userSettings.native_language as LanguageCode,
      );

      return saveResult;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Save word error:', error);
      return {
        success: false,
        error: 'Failed to save word',
      };
    }
  },
);

// Note: Word duplicate checking is handled by database constraints
// No need for separate checkWordSaved action

// Get cached word
export const getWordFromCache = async (
  normalizedWord: string,
  partOfSpeech?: string,
): Promise<ActionResult<CachedWord | null>> => {
  if (!normalizedWord) {
    return {
      success: false,
      error: 'Word is required',
    };
  }

  try {
    const result = await getCachedWord(normalizedWord, partOfSpeech);
    return result;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to get cached word:', error);
    return {
      success: false,
      error: 'Failed to get cached word',
    };
  }
};

// Get user's saved words
export const getUserWords = withAuth<void, SavedWord[]>(
  async (context): Promise<ActionResult<SavedWord[]>> => {
    try {
      const result = await getUserSavedWords(context.userId);

      return result;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to get saved words:', error);
      return {
        success: false,
        error: 'Failed to get saved words',
      };
    }
  },
);

// Delete user's saved word
export const deleteWord = withAuth<{ wordId: string }, void>(
  async (context, input): Promise<ActionResult<void>> => {
    const { wordId } = input;

    if (!wordId) {
      return {
        success: false,
        error: 'Word ID is required',
      };
    }

    try {
      const result = await deleteUserWord(wordId, context.userId);
      return result;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to delete word:', error);
      return {
        success: false,
        error: 'Failed to delete word',
      };
    }
  },
);
