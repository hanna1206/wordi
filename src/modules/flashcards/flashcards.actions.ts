'use server';

import * as Sentry from '@sentry/nextjs';

import { withAuth } from '@/modules/auth/utils/with-auth';
import { VocabularyItem } from '@/modules/vocabulary/vocabulary.types';
import type { ActionResult } from '@/shared-types';

import { GameMode, QualityScore } from './flashcards.const';
import {
  createInitialWordProgressService,
  getDueWordsCountService,
  getWordsForGameService,
  saveQualityFeedbackService,
} from './flashcards.service';

type GetWordsForGameParams = {
  mode: GameMode;
  limit: number;
};

type SaveQualityFeedbackParams = {
  wordId: string;
  qualityScore: QualityScore;
};

type DueWordsCount = {
  dueCount: number;
  totalWords: number;
};

export const createInitialWordProgress = withAuth<{ wordId: string }, void>(
  async (context, { wordId }): Promise<ActionResult<void>> => {
    try {
      await createInitialWordProgressService(context.userId, wordId);
      return { success: true };
    } catch (error) {
      Sentry.captureException(error);
      return { success: false, error: 'Failed to init word progress' };
    }
  },
);

export const getWordsForGame = withAuth<
  GetWordsForGameParams,
  VocabularyItem[]
>(async (context, { mode, limit }): Promise<ActionResult<VocabularyItem[]>> => {
  try {
    const data = await getWordsForGameService({
      userId: context.userId,
      mode,
      limit,
    });
    return { success: true, data };
  } catch (error) {
    Sentry.captureException(error);
    return { success: false, error: 'Failed to fetch words for game' };
  }
});

export const saveQualityFeedback = withAuth<SaveQualityFeedbackParams, void>(
  async (context, { wordId, qualityScore }): Promise<ActionResult<void>> => {
    try {
      await saveQualityFeedbackService({
        userId: context.userId,
        wordId,
        qualityScore,
      });
      return { success: true };
    } catch (error) {
      Sentry.captureException(error);
      return { success: false, error: 'Failed to save quality feedback' };
    }
  },
);

export const getDueWordsCount = withAuth<void, DueWordsCount>(
  async (context): Promise<ActionResult<DueWordsCount>> => {
    try {
      const data = await getDueWordsCountService(context.userId);
      return { success: true, data };
    } catch (error) {
      Sentry.captureException(error);
      return { success: false, error: 'Failed to get due words count' };
    }
  },
);
