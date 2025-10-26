import { LinguisticItem } from '@/modules/linguistics/linguistics.types';
import { createClient } from '@/services/supabase/server';
import {
  convertKeysToCamelCase,
  convertKeysToSnakeCase,
} from '@/utils/case-conversion';

import { LanguageCode } from '../user-settings/user-settings.const';
import { transformLinguisticItemToVocabularyItem } from './utils/transform-linguistic-item-to-vocabulary-item';
import type {
  MinimalVocabularyWord,
  VocabularyItem,
  VocabularyItemAnonymized,
} from './vocabulary.types';

export const saveWordToDatabase = async (
  linguisticItem: LinguisticItem,
  userId: string,
  targetLanguage: LanguageCode,
): Promise<VocabularyItem> => {
  const supabase = await createClient();
  const newVocabularyItem = transformLinguisticItemToVocabularyItem(
    linguisticItem,
    userId,
    targetLanguage,
  );

  const databaseData = convertKeysToSnakeCase(
    newVocabularyItem as unknown as Record<string, unknown>,
  );

  const { data, error } = await supabase
    .from('words')
    .insert(databaseData)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      const duplicate = new Error('Word already saved for learning');
      duplicate.name = 'DuplicateWordError';
      throw duplicate;
    }
    throw new Error('Failed to save word');
  }

  return convertKeysToCamelCase(
    data as Record<string, unknown>,
  ) as unknown as VocabularyItem;
};

// Get cached word (from any user)
export const getCachedWord = async (
  normalizedWord: string,
  targetLanguage: LanguageCode,
): Promise<VocabularyItemAnonymized | null> => {
  const supabase = await createClient();

  const query = supabase
    .from('word_cache')
    .select('*')
    .eq('normalized_word', normalizedWord)
    .eq('target_language', targetLanguage);

  const { data, error } = await query.maybeSingle();

  if (error) {
    throw new Error('Failed to get cached word');
  }

  return data
    ? (convertKeysToCamelCase(
        data as Record<string, unknown>,
      ) as unknown as VocabularyItemAnonymized)
    : null;
};

// Get user's saved words
export const getUserVocabularyItems = async (
  userId: string,
  limit = 50,
  offset = 0,
): Promise<VocabularyItem[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('words')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error('Failed to get saved words');
  }

  return (
    data?.map(
      (item) =>
        convertKeysToCamelCase(
          item as Record<string, unknown>,
        ) as unknown as VocabularyItem,
    ) || []
  );
};

export const getUserMinimalVocabulary = async (
  userId: string,
  limit = 20,
  offset = 0,
): Promise<{ items: MinimalVocabularyWord[]; total: number }> => {
  const supabase = await createClient();

  const { data, error, count } = await supabase
    .from('words')
    .select('normalized_word, part_of_speech, common_data', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error('Failed to get saved words');
  }

  const items: MinimalVocabularyWord[] = data.map((datum) =>
    convertKeysToCamelCase(datum),
  ) as unknown as MinimalVocabularyWord[];

  return { items, total: count || 0 };
};

// Delete user's saved word
export const deleteUserWord = async (
  wordId: string,
  userId: string,
): Promise<void> => {
  const supabase = await createClient();

  const { error } = await supabase
    .from('words')
    .delete()
    .eq('id', wordId)
    .eq('user_id', userId);

  if (error) {
    throw new Error('Failed to delete word');
  }
};
