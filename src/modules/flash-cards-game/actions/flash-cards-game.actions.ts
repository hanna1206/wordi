'use server';

import { createClient } from '@/services/supabase/server';

import { SavedWord } from '../../words-persistence/words-persistence.types';
import { GameMode } from '../flash-cards-game.const';

type GetFlashCardsWordsParams = {
  mode: GameMode;
  limit: number;
};

export const getFlashCardsWords = async (
  params: GetFlashCardsWordsParams,
): Promise<{ data?: SavedWord[]; error?: string }> => {
  const { mode, limit } = params;

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: 'User not found' };
  }

  if (mode === GameMode.Latest) {
    const { data, error } = await supabase
      .from('words')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      return { error: 'Failed to fetch latest words' };
    }
    return { data };
  }

  if (mode === GameMode.Random) {
    const { data: idsData, error: idsError } = await supabase
      .from('words')
      .select('id')
      .eq('user_id', user.id);

    if (idsError) {
      return { error: 'Failed to fetch word IDs for randomization' };
    }

    if (!idsData || idsData.length === 0) {
      return { data: [] };
    }

    const ids = idsData.map((item) => item.id);

    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }

    const randomIds = ids.slice(0, limit);

    if (randomIds.length === 0) {
      return { data: [] };
    }

    const { data, error } = await supabase
      .from('words')
      .select('*')
      .in('id', randomIds);

    if (error) {
      return { error: 'Failed to fetch random words' };
    }
    return { data };
  }

  return { error: 'Invalid mode specified' };
};
