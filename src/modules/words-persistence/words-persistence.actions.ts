'use server';

import { withAuth } from '@/modules/auth/utils/with-auth';
import { createInitialWordProgressService } from '@/modules/flash-cards-game/flash-cards-game.service';
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
      const saveResult = await saveWordToDatabase(
        input,
        context.userId,
        context.userSettings.native_language as LanguageCode,
      );

      // If the word was saved successfully, create its initial progress record
      if (saveResult.success && saveResult.data) {
        await createInitialWordProgressService(
          context.userId,
          saveResult.data.id,
        );
      }

      return saveResult;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in saveWordForLearning action:', error);
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
  const result = await getCachedWord(normalizedWord, partOfSpeech);
  return result;
};

// Get user saved words
export const fetchUserSavedWords = withAuth<void, SavedWord[]>(
  async (context): Promise<ActionResult<SavedWord[]>> => {
    const result = await getUserSavedWords(context.userId);
    return result;
  },
);

// Delete user word
export const deleteWord = withAuth<{ wordId: string }, void>(
  async (context, { wordId }): Promise<ActionResult<void>> => {
    const result = await deleteUserWord(wordId, context.userId);
    return result;
  },
);
