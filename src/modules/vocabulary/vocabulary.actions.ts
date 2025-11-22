'use server';

import * as Sentry from '@sentry/nextjs';

import { withAuth } from '@/modules/auth/utils/with-auth';
import * as flashcardsRepository from '@/modules/flashcards/flashcards.repository';
import { LanguageCode } from '@/modules/user-settings/user-settings.const';
import { withUserSettings } from '@/modules/user-settings/utils/with-user-settings';
import type { ActionResult } from '@/shared-types';

import { LinguisticItem } from '../linguistics/linguistics.types';
import { transformLinguisticItemToVocabularyItem } from './utils/transform-linguistic-item-to-vocabulary-item';
import * as vocabularyRepository from './vocabulary.repository';
import type {
  MinimalVocabularyWord,
  VocabularyItem,
  VocabularyItemAnonymized,
  VocabularySortOption,
} from './vocabulary.types';

export const saveWordForLearning = withUserSettings<
  LinguisticItem,
  VocabularyItem
>(async (context, linguisticItem): Promise<ActionResult<VocabularyItem>> => {
  if (!linguisticItem || !linguisticItem.normalizedWord) {
    const error = 'Valid translation result is required';

    return {
      success: false,
      error,
    };
  }

  try {
    const vocabularyItem = transformLinguisticItemToVocabularyItem(
      linguisticItem,
      context.user.id,
      context.userSettings.nativeLanguage as LanguageCode,
    );

    const saved = await vocabularyRepository.create(vocabularyItem);

    await flashcardsRepository.createInitialProgress(context.user.id, saved.id);

    return { success: true, data: saved };
  } catch (error) {
    Sentry.captureException(error);

    if (error instanceof Error && error.message.includes('duplicate')) {
      return {
        success: false,
        error: 'Word already saved for learning',
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save word',
    };
  }
});

// Note: Word duplicate checking is handled by database constraints
// No need for separate checkWordSaved action

export const getWordFromCache = withUserSettings<
  string,
  VocabularyItemAnonymized | null
>(
  async (
    context,
    normalizedWord: string,
  ): Promise<ActionResult<VocabularyItemAnonymized | null>> => {
    try {
      const data = await vocabularyRepository.getCachedWord(
        normalizedWord,
        context.userSettings.nativeLanguage as LanguageCode,
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
  searchQuery?: string;
  showHidden?: boolean;
};

export const fetchUserMinimalVocabulary = withAuth<
  FetchMinimalVocabularyParams,
  { items: MinimalVocabularyWord[]; total: number }
>(
  async (
    context,
    { limit = 20, offset = 0, sort = 'Latest', searchQuery, showHidden },
  ): Promise<
    ActionResult<{ items: MinimalVocabularyWord[]; total: number }>
  > => {
    try {
      const data = await vocabularyRepository.getUserMinimalVocabulary(
        context.user.id,
        limit,
        offset,
        sort,
        searchQuery,
        showHidden,
      );
      return { success: true, data };
    } catch (error) {
      Sentry.captureException(error);
      // eslint-disable-next-line no-console
      console.error(error);
      return {
        success: false,
        error: 'Failed to get saved words. Error: ' + error,
      };
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
      const data = await vocabularyRepository.getByNormalizedWordAndPos(
        context.user.id,
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
      await vocabularyRepository.deleteItem(wordId, context.user.id);
      return { success: true };
    } catch (error) {
      Sentry.captureException(error);
      return { success: false, error: 'Failed to delete word' };
    }
  },
);

// Toggle word hidden status
export const toggleWordHidden = withAuth<
  { wordId: string; isHidden: boolean },
  void
>(async (context, { wordId, isHidden }): Promise<ActionResult<void>> => {
  try {
    await vocabularyRepository.toggleWordHidden(
      wordId,
      context.user.id,
      isHidden,
    );
    return { success: true };
  } catch (error) {
    Sentry.captureException(error);
    return { success: false, error: 'Failed to update word visibility' };
  }
});

type FetchVocabularyWithProgressParams = {
  limit?: number;
  offset?: number;
  sort?: VocabularySortOption;
};

export const fetchUserVocabularyWithProgress = withAuth<
  FetchVocabularyWithProgressParams,
  { items: unknown[]; total: number }
>(
  async (
    context,
    { limit = 20, offset = 0, sort = 'Latest' },
  ): Promise<ActionResult<{ items: unknown[]; total: number }>> => {
    try {
      const sortBy = sort === 'Alphabetical' ? 'alphabetical' : 'latest';
      const data = await flashcardsRepository.getWordsWithProgress(
        context.user.id,
        limit,
        offset,
        sortBy,
      );
      return { success: true, data };
    } catch (error) {
      Sentry.captureException(error);
      return {
        success: false,
        error: 'Failed to get vocabulary with progress',
      };
    }
  },
);
