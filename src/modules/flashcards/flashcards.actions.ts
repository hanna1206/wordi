'use server';

import * as Sentry from '@sentry/nextjs';

import { withAuth } from '@/modules/auth/utils/with-auth';
import * as vocabularyRepository from '@/modules/vocabulary/vocabulary.repository';
import { VocabularyItem } from '@/modules/vocabulary/vocabulary.types';
import type { ActionResult } from '@/shared-types';

import { GameMode, QualityScore } from './flashcards.const';
import * as flashcardsRepository from './flashcards.repository';
import { calculateProgressUpdate } from './utils/spaced-repetition.utils';

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
      await flashcardsRepository.createInitialProgress(context.userId, wordId);
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
    let words: VocabularyItem[] = [];

    if (mode === GameMode.Latest) {
      const result = await vocabularyRepository.getLatestWords(
        context.userId,
        limit,
      );
      words = result as VocabularyItem[];
    } else if (mode === GameMode.Random) {
      const allWords = await flashcardsRepository.getAllUserWords(
        context.userId,
      );
      const shuffled = (allWords as VocabularyItem[]).sort(
        () => 0.5 - Math.random(),
      );
      words = shuffled.slice(0, limit);
    } else if (mode === GameMode.DueReview) {
      const dueWords = await flashcardsRepository.getDueWords(
        context.userId,
        limit,
      );
      words = dueWords.map((item) => item.word as VocabularyItem);
    } else {
      throw new Error('Invalid mode specified');
    }

    return { success: true, data: words };
  } catch (error) {
    Sentry.captureException(error);
    return { success: false, error: 'Failed to fetch words for game' };
  }
});

export const saveQualityFeedback = withAuth<SaveQualityFeedbackParams, void>(
  async (context, { wordId, qualityScore }): Promise<ActionResult<void>> => {
    try {
      const existingProgress =
        await flashcardsRepository.getProgressByUserAndWord(
          context.userId,
          wordId,
        );

      if (!existingProgress) {
        return {
          success: false,
          error: 'Word progress record not found',
        };
      }

      const progressUpdate = calculateProgressUpdate(
        existingProgress,
        qualityScore,
      );

      await flashcardsRepository.updateProgress(existingProgress.id, {
        ...progressUpdate,
        lastReviewedAt: new Date().toISOString(),
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
      const [dueCount, totalWords] = await Promise.all([
        flashcardsRepository.getDueWordsCount(context.userId),
        flashcardsRepository.getTotalWordsCount(context.userId),
      ]);

      return {
        success: true,
        data: { dueCount, totalWords },
      };
    } catch (error) {
      Sentry.captureException(error);
      return { success: false, error: 'Failed to get due words count' };
    }
  },
);
