'use server';

import { createClient } from '@/services/supabase/server';

import { GameMode } from '../flash-cards-game.const';

type GetWordsForGameParams = {
  mode: GameMode;
  limit: number;
};

export const getWordsForGame = async ({
  mode,
  limit,
}: GetWordsForGameParams) => {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('User not found');
  }

  if (mode === GameMode.Latest) {
    const { data, error } = await supabase
      .from('words')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error('Failed to fetch latest words');
    }
    return data;
  }

  if (mode === GameMode.Random) {
    const { data: allWords, error: allWordsError } = await supabase
      .from('words')
      .select('*')
      .eq('user_id', user.id);

    if (allWordsError) {
      throw new Error('Failed to fetch words for random mode');
    }

    const shuffledWords = allWords.sort(() => 0.5 - Math.random());
    return shuffledWords.slice(0, limit);
  }

  throw new Error('Invalid mode specified');
};
