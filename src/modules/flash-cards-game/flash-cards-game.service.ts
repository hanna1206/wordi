import { ExistingProgress } from '@/modules/flash-cards-game/flash-cards-game.types';
import { SavedWord } from '@/modules/words-persistence/words-persistence.types';
import { createClient } from '@/services/supabase/server';
import type { ActionResult } from '@/shared-types';
import { convertKeysToCamelCase } from '@/utils/case-conversion';

import { GameMode, QualityScore } from './flash-cards-game.const';
import { calculateProgressUpdate } from './utils/spaced-repetition.utils';

type GetWordsForGameParams = {
  userId: string;
  mode: GameMode;
  limit: number;
};

type SaveQualityFeedbackParams = {
  userId: string;
  wordId: string;
  qualityScore: QualityScore;
};

type DueWordsCount = {
  dueCount: number;
  totalWords: number;
};

type UserWordProgressWithWords = {
  word_id: string;
  words: Record<string, unknown> | Record<string, unknown>[];
};

export const createInitialWordProgressService = async (
  userId: string,
  wordId: string,
): Promise<ActionResult<void>> => {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from('user_word_progress').insert({
      user_id: userId,
      word_id: wordId,
      status: 'new',
    });

    if (error) {
      // It's possible a progress record was created by another process
      // between the word creation and now. We can ignore duplicate errors.
      if (error.code === '23505') {
        // Unique constraint violation
        return { success: true };
      }

      return {
        success: false,
        error: 'Failed to create initial word progress',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error creating initial word progress:', error);
    return {
      success: false,
      error: 'Failed to create initial word progress',
    };
  }
};

export const getWordsForGameService = async ({
  userId,
  mode,
  limit,
}: GetWordsForGameParams): Promise<ActionResult<SavedWord[]>> => {
  try {
    const supabase = await createClient();

    if (mode === GameMode.Latest) {
      const { data, error } = await supabase
        .from('words')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        return {
          success: false,
          error: 'Failed to fetch latest words',
        };
      }

      return {
        success: true,
        data:
          data?.map(
            (item) =>
              convertKeysToCamelCase(
                item as Record<string, unknown>,
              ) as unknown as SavedWord,
          ) || [],
      };
    }

    if (mode === GameMode.Random) {
      const { data: allWords, error: allWordsError } = await supabase
        .from('words')
        .select('*')
        .eq('user_id', userId);

      if (allWordsError) {
        return {
          success: false,
          error: 'Failed to fetch words for random mode',
        };
      }

      const shuffledWords = (allWords || [])
        .map(
          (item) =>
            convertKeysToCamelCase(
              item as Record<string, unknown>,
            ) as unknown as SavedWord,
        )
        .sort(() => 0.5 - Math.random());

      return {
        success: true,
        data: shuffledWords.slice(0, limit),
      };
    }

    if (mode === GameMode.DueReview) {
      // Fetch words that are due for review
      const { data: dueProgressData, error: progressError } = await supabase
        .from('user_word_progress')
        .select(
          `
            word_id,
            words (*)
          `,
        )
        .eq('user_id', userId)
        .lte('next_review_date', new Date().toISOString())
        .eq('is_archived', false)
        .order('next_review_date', { ascending: true })
        .limit(limit);

      if (progressError) {
        return {
          success: false,
          error: 'Failed to fetch words due for review',
        };
      }

      // Extract the words from the joined data
      const dueWords = (dueProgressData || [])
        .map((item) => {
          const progressItem = item as unknown as UserWordProgressWithWords;
          // Handle both single word and array cases from Supabase join
          const dbWord = Array.isArray(progressItem.words)
            ? progressItem.words[0]
            : progressItem.words;
          return dbWord
            ? (convertKeysToCamelCase(dbWord) as unknown as SavedWord)
            : null;
        })
        .filter(Boolean) as SavedWord[];

      return {
        success: true,
        data: dueWords,
      };
    }

    return {
      success: false,
      error: 'Invalid mode specified',
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error getting words for game:', error);
    return {
      success: false,
      error: 'Failed to fetch words for game',
    };
  }
};

export const saveQualityFeedbackService = async ({
  userId,
  wordId,
  qualityScore,
}: SaveQualityFeedbackParams): Promise<ActionResult<void>> => {
  try {
    const supabase = await createClient();

    // Check if progress record exists for this word
    const { data: existingProgress, error: fetchError } = await supabase
      .from('user_word_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('word_id', wordId)
      .single();

    // Handle database errors (but "no rows found" is expected for new words)
    if (fetchError && fetchError.code !== 'PGRST116') {
      return {
        success: false,
        error: 'Failed to fetch existing progress',
      };
    }

    const now = new Date().toISOString();

    // Since progress is created with the word, we assume it always exists.
    if (!existingProgress) {
      return {
        success: false,
        error:
          'Word progress record not found. It should have been created with the word.',
      };
    }

    // Calculate updated progress using utility function
    const progressUpdate = calculateProgressUpdate(
      existingProgress as ExistingProgress,
      qualityScore,
    );

    const { error: updateError } = await supabase
      .from('user_word_progress')
      .update({
        ...progressUpdate,
        last_reviewed_at: now,
        updated_at: now,
      })
      .eq('id', existingProgress.id);

    if (updateError) {
      return {
        success: false,
        error: 'Failed to update word progress',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error saving quality feedback:', error);
    return {
      success: false,
      error: 'Failed to save quality feedback',
    };
  }
};

export const getDueWordsCountService = async (
  userId: string,
): Promise<ActionResult<DueWordsCount>> => {
  try {
    const supabase = await createClient();

    // Get count of words due for review
    const { count: dueCount, error: dueError } = await supabase
      .from('user_word_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .lte('next_review_date', new Date().toISOString())
      .eq('is_archived', false);

    if (dueError) {
      return {
        success: false,
        error: 'Failed to fetch due words count',
      };
    }

    // Get total words count
    const { count: totalWords, error: totalError } = await supabase
      .from('words')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (totalError) {
      return {
        success: false,
        error: 'Failed to fetch total words count',
      };
    }

    return {
      success: true,
      data: {
        dueCount: dueCount || 0,
        totalWords: totalWords || 0,
      },
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error getting due words count:', error);
    return {
      success: false,
      error: 'Failed to get due words count',
    };
  }
};
