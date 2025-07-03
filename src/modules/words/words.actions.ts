'use server';

import { getLanguageName } from '@/modules/user-settings/utils/get-language-name';
import { withUserSettings } from '@/modules/user-settings/utils/with-user-settings';
import type { ActionResult } from '@/shared-types';

import { getWordInfo as wordInfoService } from './words.service';
import type { TranslationResult } from './words.types';

export const translateWord = withUserSettings<string, TranslationResult>(
  async (context, word): Promise<ActionResult<TranslationResult>> => {
    const serializedWord = word.trim().toLowerCase();
    // Validate input
    if (!serializedWord) {
      return {
        success: false,
        error: 'Word is required',
      };
    }

    const { userSettings } = context;
    const targetLanguage = getLanguageName(userSettings.native_language!);

    try {
      // Call OpenAI for translation
      const response = await wordInfoService(serializedWord, targetLanguage);

      if (!response) {
        return {
          success: false,
          error: 'Translation service unavailable',
        };
      }

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('OpenAI translation error:', error);
      return {
        success: false,
        error: 'Translation service failed',
      };
    }
  },
);

// // Пример: простой action для получения списка изученных слов пользователя
// interface UserWord {
//   id: string;
//   word: string;
//   translation: string;
//   created_at: string;
// }

// export const getUserWords = withAuth<void, UserWord[]>(
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   async (_context): Promise<ActionResult<UserWord[]>> => {
//     // Примечание: здесь будет реальная логика получения слов из БД
//     // Пока возвращаем mock данные для демонстрации

//     try {
//       // TODO: заменить на реальный запрос к базе данных
//       const mockWords: UserWord[] = [
//         {
//           id: '1',
//           word: 'das Buch',
//           translation: 'книга',
//           created_at: new Date().toISOString(),
//         },
//         {
//           id: '2',
//           word: 'lernen',
//           translation: 'изучать',
//           created_at: new Date().toISOString(),
//         },
//       ];

//       return {
//         success: true,
//         data: mockWords,
//       };
//     } catch (error) {
//       console.error('Error fetching user words:', error);
//       return {
//         success: false,
//         error: 'Failed to load your words',
//       };
//     }
//   },
// );
