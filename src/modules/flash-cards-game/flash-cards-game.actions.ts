'use server';

import { withAuth } from '@/modules/auth/utils/with-auth';
import { VocabularyItem } from '@/modules/vocabulary/vocabulary.types';
import type { ActionResult } from '@/shared-types';

import { GameMode, QualityScore } from './flash-cards-game.const';
import {
  createInitialWordProgressService,
  getDueWordsCountService,
  getWordsForGameService,
  saveQualityFeedbackService,
} from './flash-cards-game.service';

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
    return createInitialWordProgressService(context.userId, wordId);
  },
);

export const getWordsForGame = withAuth<
  GetWordsForGameParams,
  VocabularyItem[]
>(async (context, { mode, limit }): Promise<ActionResult<VocabularyItem[]>> => {
  return getWordsForGameService({
    userId: context.userId,
    mode,
    limit,
  });
});

export const saveQualityFeedback = withAuth<SaveQualityFeedbackParams, void>(
  async (context, { wordId, qualityScore }): Promise<ActionResult<void>> => {
    return saveQualityFeedbackService({
      userId: context.userId,
      wordId,
      qualityScore,
    });
  },
);

export const getDueWordsCount = withAuth<void, DueWordsCount>(
  async (context): Promise<ActionResult<DueWordsCount>> => {
    return getDueWordsCountService(context.userId);
  },
);
