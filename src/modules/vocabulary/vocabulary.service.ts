import { LinguisticItem } from '@/modules/linguistics/linguistics.types';
import { createClient } from '@/services/supabase/server';
import type { ActionResult } from '@/shared-types';
import {
  convertKeysToCamelCase,
  convertKeysToSnakeCase,
} from '@/utils/case-conversion';

import { LanguageCode } from '../user-settings/user-settings.const';
import { transformLinguisticItemToVocabularyItem } from './utils/transform-linguistic-item-to-vocabulary-item';
import type {
  VocabularyItem,
  VocabularyItemAnonymized,
} from './vocabulary.types';

export const saveWordToDatabase = async (
  linguisticItem: LinguisticItem,
  userId: string,
  targetLanguage: LanguageCode,
): Promise<ActionResult<VocabularyItem>> => {
  try {
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
      // Check if it's a duplicate word error
      if (error.code === '23505') {
        // Unique constraint violation
        return {
          success: false,
          error: 'Word already saved for learning',
        };
      }

      throw error;
    }

    return {
      success: true,
      data: convertKeysToCamelCase(
        data as Record<string, unknown>,
      ) as unknown as VocabularyItem,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error saving word to database:', error);
    return {
      success: false,
      error: 'Failed to save word',
    };
  }
};

// Get cached word (from any user)
export const getCachedWord = async (
  normalizedWord: string,
  targetLanguage: LanguageCode,
): Promise<ActionResult<VocabularyItemAnonymized | null>> => {
  try {
    const supabase = await createClient();

    const query = supabase
      .from('word_cache')
      .select('*')
      .eq('normalized_word', normalizedWord)
      .eq('target_language', targetLanguage);

    const { data, error } = await query.maybeSingle();

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data
        ? (convertKeysToCamelCase(
            data as Record<string, unknown>,
          ) as unknown as VocabularyItemAnonymized)
        : null,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error getting cached word:', error);
    return {
      success: false,
      error: 'Failed to get cached word',
    };
  }
};

// Get user's saved words
export const getUserVocabularyItems = async (
  userId: string,
  limit = 50,
  offset = 0,
): Promise<ActionResult<VocabularyItem[]>> => {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('words')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    return {
      success: true,
      data:
        data?.map(
          (item) =>
            convertKeysToCamelCase(
              item as Record<string, unknown>,
            ) as unknown as VocabularyItem,
        ) || [],
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error getting user saved words:', error);
    return {
      success: false,
      error: 'Failed to get saved words',
    };
  }
};

// Delete user's saved word
export const deleteUserWord = async (
  wordId: string,
  userId: string,
): Promise<ActionResult<void>> => {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('words')
      .delete()
      .eq('id', wordId)
      .eq('user_id', userId); // Ensure user can only delete their own words

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error deleting word:', error);
    return {
      success: false,
      error: 'Failed to delete word',
    };
  }
};
