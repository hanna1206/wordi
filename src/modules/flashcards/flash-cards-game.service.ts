import { ExistingProgress } from '@/modules/flashcards/flash-cards-game.types';
import { VocabularyItem } from '@/modules/vocabulary/vocabulary.types';
import { createClient } from '@/services/supabase/server';
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
): Promise<void> => {
  const supabase = await createClient();

  const { error } = await supabase.from('user_word_progress').insert({
    user_id: userId,
    word_id: wordId,
    status: 'new',
  });

  if (error && error.code !== '23505') {
    throw new Error('Failed to create initial word progress');
  }
};

export const getWordsForGameService = async ({
  userId,
  mode,
  limit,
}: GetWordsForGameParams): Promise<VocabularyItem[]> => {
  const supabase = await createClient();

  if (mode === GameMode.Latest) {
    const { data, error } = await supabase
      .from('words')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error('Failed to fetch latest words');
    }

    return (
      data?.map(
        (item) =>
          convertKeysToCamelCase(
            item as Record<string, unknown>,
          ) as unknown as VocabularyItem,
      ) || []
    );
  }

  if (mode === GameMode.Random) {
    const { data: allWords, error: allWordsError } = await supabase
      .from('words')
      .select('*')
      .eq('user_id', userId);

    if (allWordsError) {
      throw new Error('Failed to fetch words for random mode');
    }

    const shuffledWords = (allWords || [])
      .map(
        (item) =>
          convertKeysToCamelCase(
            item as Record<string, unknown>,
          ) as unknown as VocabularyItem,
      )
      .sort(() => 0.5 - Math.random());

    return shuffledWords.slice(0, limit);
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
      throw new Error('Failed to fetch words due for review');
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
          ? (convertKeysToCamelCase(dbWord) as unknown as VocabularyItem)
          : null;
      })
      .filter(Boolean) as VocabularyItem[];

    return dueWords;
  }

  throw new Error('Invalid mode specified');
};

export const saveQualityFeedbackService = async ({
  userId,
  wordId,
  qualityScore,
}: SaveQualityFeedbackParams): Promise<void> => {
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
    throw new Error('Failed to fetch existing progress');
  }

  const now = new Date().toISOString();

  // Since progress is created with the word, we assume it always exists.
  if (!existingProgress) {
    throw new Error(
      'Word progress record not found. It should have been created with the word.',
    );
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
    throw new Error('Failed to update word progress');
  }
};

export const getDueWordsCountService = async (
  userId: string,
): Promise<DueWordsCount> => {
  const supabase = await createClient();

  const nowIso = new Date().toISOString();

  const dueCountPromise = supabase
    .from('user_word_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .lte('next_review_date', nowIso)
    .eq('is_archived', false);

  const totalWordsPromise = supabase
    .from('words')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  const [
    { count: dueCount, error: dueError },
    { count: totalWords, error: totalError },
  ] = await Promise.all([dueCountPromise, totalWordsPromise]);

  if (dueError || totalError) {
    throw new Error(
      dueError
        ? 'Failed to fetch due words count'
        : 'Failed to fetch total words count',
    );
  }

  return {
    dueCount: dueCount || 0,
    totalWords: totalWords || 0,
  };
};
