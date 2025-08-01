'use server';

import { withAuth } from '@/modules/auth/utils/with-auth';
import { SavedWord } from '@/modules/words-persistence/words-persistence.types';
import { createClient } from '@/services/supabase/server';
import type { ActionResult } from '@/shared-types';

import { GameMode, QualityScore } from '../flash-cards-game.const';
import {
  calculateInitialProgress,
  calculateProgressUpdate,
} from '../utils/spaced-repetition.utils';

type GetWordsForGameParams = {
  mode: GameMode;
  limit: number;
};

type SaveQualityFeedbackParams = {
  wordId: string;
  qualityScore: QualityScore;
};

export const getWordsForGame = withAuth<GetWordsForGameParams, SavedWord[]>(
  async (context, { mode, limit }): Promise<ActionResult<SavedWord[]>> => {
    const supabase = await createClient();

    if (mode === GameMode.Latest) {
      const { data, error } = await supabase
        .from('words')
        .select('*')
        .eq('user_id', context.userId)
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
        data: data || [],
      };
    }

    if (mode === GameMode.Random) {
      const { data: allWords, error: allWordsError } = await supabase
        .from('words')
        .select('*')
        .eq('user_id', context.userId);

      if (allWordsError) {
        return {
          success: false,
          error: 'Failed to fetch words for random mode',
        };
      }

      const shuffledWords = (allWords || []).sort(() => 0.5 - Math.random());

      return {
        success: true,
        data: shuffledWords.slice(0, limit),
      };
    }

    return {
      success: false,
      error: 'Invalid mode specified',
    };
  },
);

export const saveQualityFeedback = withAuth<SaveQualityFeedbackParams, void>(
  async (context, { wordId, qualityScore }): Promise<ActionResult<void>> => {
    const supabase = await createClient();

    // Check if progress record exists for this word
    const { data: existingProgress, error: fetchError } = await supabase
      .from('user_word_progress')
      .select('*')
      .eq('user_id', context.userId)
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

    // Update existing progress or create new progress
    if (existingProgress) {
      // Calculate updated progress using utility function
      const progressUpdate = calculateProgressUpdate(
        existingProgress,
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
    } else {
      // Calculate initial progress using utility function
      const initialProgress = calculateInitialProgress(qualityScore);

      const { error: insertError } = await supabase
        .from('user_word_progress')
        .insert({
          user_id: context.userId,
          word_id: wordId,
          ...initialProgress,
          last_reviewed_at: now,
          created_at: now,
          updated_at: now,
        });

      if (insertError) {
        return {
          success: false,
          error: 'Failed to create word progress',
        };
      }
    }

    return {
      success: true,
    };
  },
);
