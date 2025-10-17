'use server';

import { withAuth } from '@/modules/auth/utils/with-auth';
import { createInitialWordProgressService } from '@/modules/flash-cards-game/flash-cards-game.service';
import { LanguageCode } from '@/modules/user-settings/user-settings.const';
import { withUserSettings } from '@/modules/user-settings/utils/with-user-settings';
import type { ActionResult } from '@/shared-types';

import { LinguisticItem } from '../linguistics/linguistics.types';
import {
  deleteUserWord,
  getCachedWord,
  getUserVocabularyItems,
  saveWordToDatabase,
} from './vocabulary.service';
import type {
  VocabularyItem,
  VocabularyItemAnonymized,
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
    const saveResult = await saveWordToDatabase(
      linguisticItem,
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
    const result = await getCachedWord(
      normalizedWord,
      context.userSettings.native_language as LanguageCode,
    );
    return result;
  },
);

// Get user saved words
export const fetchUserVocabularyItems = withAuth<void, VocabularyItem[]>(
  async (context): Promise<ActionResult<VocabularyItem[]>> => {
    const result = await getUserVocabularyItems(context.userId);
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
