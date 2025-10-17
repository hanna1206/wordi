import { createClient } from '@/services/supabase/server';
import type { ActionResult } from '@/shared-types';
import {
  convertKeysToCamelCase,
  convertKeysToSnakeCase,
} from '@/utils/case-conversion';

import { LanguageCode } from '../user-settings/user-settings.const';
import type {
  CachedWord,
  CommonWordData,
  VocabularyItem,
  VocabularyItemInput,
} from './vocabulary.types';

const transformTranslationToDbFormat = (
  input: VocabularyItemInput,
  userId: string,
  targetLanguage: LanguageCode,
) => {
  const { linguisticItem } = input;

  // Extract common data
  const commonData: CommonWordData = {
    mainTranslation: linguisticItem.mainTranslation,
    additionalTranslations: linguisticItem.additionalTranslations,
    exampleSentences: linguisticItem.exampleSentences,
    synonyms: linguisticItem.synonyms,
    collocations: linguisticItem.collocations,
  };

  // Build part-specific data object (everything except common fields)
  const specificData: Record<string, unknown> = {};
  const commonFields = new Set([
    'normalizedWord',
    'mainTranslation',
    'additionalTranslations',
    'exampleSentences',
    'synonyms',
    'collocations',
    'partOfSpeech',
  ]);

  Object.entries(linguisticItem).forEach(([key, value]) => {
    if (!commonFields.has(key)) {
      specificData[key] = value;
    }
  });

  // Create camelCase object first, then convert to snake_case for database
  const camelCaseData = {
    userId,
    normalizedWord: linguisticItem.normalizedWord,
    partOfSpeech: linguisticItem.partOfSpeech[0] || 'other', // Use first part of speech
    commonData,
    partSpecificData: specificData,
    targetLanguage,
  };

  // Convert to snake_case for database
  return convertKeysToSnakeCase(camelCaseData);
};

export const saveWordToDatabase = async (
  input: VocabularyItemInput,
  userId: string,
  targetLanguage: LanguageCode,
): Promise<ActionResult<VocabularyItem>> => {
  try {
    const supabase = await createClient();
    const wordData = transformTranslationToDbFormat(
      input,
      userId,
      targetLanguage,
    );

    const { data, error } = await supabase
      .from('words')
      .insert(wordData)
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
  partOfSpeech?: string,
): Promise<ActionResult<CachedWord | null>> => {
  try {
    const supabase = await createClient();

    let query = supabase
      .from('word_cache')
      .select('*')
      .eq('normalized_word', normalizedWord);

    if (partOfSpeech) {
      query = query.eq('part_of_speech', partOfSpeech);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data
        ? (convertKeysToCamelCase(
            data as Record<string, unknown>,
          ) as unknown as CachedWord)
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
