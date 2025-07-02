'use server';

import { withAuth } from '@/modules/auth/utils/with-auth';
import { getLanguageName } from '@/modules/user-settings/utils/get-language-name';
import { withUserSettings } from '@/modules/user-settings/utils/with-user-settings';
import { openAiClient } from '@/services/openai/openai-client';
import type { ActionResult } from '@/shared-types';

interface TranslationResult {
  translation: string;
}

export const translateWord = withUserSettings<string, TranslationResult>(
  async (context, word): Promise<ActionResult<TranslationResult>> => {
    // Validate input
    if (!word?.trim()) {
      return {
        success: false,
        error: 'Word is required',
      };
    }

    const { userSettings } = context;
    const targetLanguage = getLanguageName(userSettings.native_language!);

    // Create OpenAI prompt for translation
    const prompt = `Translate the German word "${word.trim()}" to ${targetLanguage}. 
    Provide a concise, accurate translation. If the word has multiple meanings, provide the most common one.
    Respond with just the translation, no additional explanation.`;

    try {
      // Call OpenAI for translation
      const response = await openAiClient.invoke(prompt);

      if (!response?.content) {
        return {
          success: false,
          error: 'Translation service unavailable',
        };
      }

      const content =
        typeof response.content === 'string'
          ? response.content
          : response.content.toString();

      return {
        success: true,
        data: {
          translation: content.trim(),
        },
      };
    } catch (error) {
      console.error('OpenAI translation error:', error);
      return {
        success: false,
        error: 'Translation service failed',
      };
    }
  },
);

// Пример: простой action для получения списка изученных слов пользователя
interface UserWord {
  id: string;
  word: string;
  translation: string;
  created_at: string;
}

export const getUserWords = withAuth<void, UserWord[]>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (_context): Promise<ActionResult<UserWord[]>> => {
    // Примечание: здесь будет реальная логика получения слов из БД
    // Пока возвращаем mock данные для демонстрации

    try {
      // TODO: заменить на реальный запрос к базе данных
      const mockWords: UserWord[] = [
        {
          id: '1',
          word: 'das Buch',
          translation: 'книга',
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          word: 'lernen',
          translation: 'изучать',
          created_at: new Date().toISOString(),
        },
      ];

      return {
        success: true,
        data: mockWords,
      };
    } catch (error) {
      console.error('Error fetching user words:', error);
      return {
        success: false,
        error: 'Failed to load your words',
      };
    }
  },
);
