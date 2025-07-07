'use server';

import * as Sentry from '@sentry/nextjs';

import { LanguageCode } from '@/modules/user-settings/user-settings.const';
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
      const error = 'Word is required';

      // Log validation error to Sentry
      Sentry.addBreadcrumb({
        message: 'Translation validation failed',
        category: 'validation',
        level: 'warning',
        data: { word, error },
      });

      return {
        success: false,
        error,
      };
    }

    const { userSettings } = context;

    // Check if user has completed their profile
    if (!userSettings.native_language) {
      const error =
        'Please complete your profile setup to use the translation feature';

      // Log profile incomplete error to Sentry
      Sentry.addBreadcrumb({
        message: 'Translation failed - incomplete profile',
        category: 'user-settings',
        level: 'warning',
        data: {
          userId: context.userId,
          hasNativeLanguage: !!userSettings.native_language,
          error,
        },
      });

      return {
        success: false,
        error,
      };
    }

    const targetLanguage = getLanguageName(
      userSettings.native_language as LanguageCode,
    );

    try {
      // Add context for successful translation attempt
      Sentry.addBreadcrumb({
        message: 'Starting word translation',
        category: 'translation',
        level: 'info',
        data: {
          word: serializedWord,
          targetLanguage,
          userId: context.userId,
        },
      });

      // Call OpenAI for translation
      const response = await wordInfoService(serializedWord, targetLanguage);

      if (!response) {
        const error = 'Translation service unavailable';

        // Log service unavailable error to Sentry
        Sentry.captureMessage('Translation service returned null response', {
          level: 'error',
          tags: {
            action: 'translateWord',
            service: 'wordInfoService',
          },
          extra: {
            word: serializedWord,
            targetLanguage,
            userId: context.userId,
          },
        });

        return {
          success: false,
          error,
        };
      }

      // Log successful translation to Sentry
      Sentry.addBreadcrumb({
        message: 'Translation completed successfully',
        category: 'translation',
        level: 'info',
        data: {
          word: serializedWord,
          normalizedWord: response.normalizedWord,
          partOfSpeech: response.partOfSpeech,
          targetLanguage,
          userId: context.userId,
          hasMainTranslation: !!response.mainTranslation,
          additionalTranslationsCount:
            response.additionalTranslations?.length || 0,
          exampleSentencesCount: response.exampleSentences?.length || 0,
        },
      });

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      // Enhanced error logging with Sentry
      Sentry.captureException(error, {
        tags: {
          action: 'translateWord',
          service: 'wordInfoService',
        },
        extra: {
          word: serializedWord,
          targetLanguage,
          userId: context.userId,
          userNativeLanguage: userSettings.native_language,
        },
        user: {
          id: context.userId,
        },
      });

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
