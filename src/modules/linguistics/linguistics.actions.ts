'use server';

import { LanguageCode } from '@/modules/user-settings/user-settings.const';
import { getLanguageName } from '@/modules/user-settings/utils/get-language-name';
import { withUserSettings } from '@/modules/user-settings/utils/with-user-settings';
import type { ActionResult } from '@/shared-types';

import { generateLinguisticItem as generateLinguisticItemService } from './linguistics.service';
import type { LinguisticItem } from './linguistics.types';

export const generateLinguisticItem = withUserSettings<string, LinguisticItem>(
  async (context, word): Promise<ActionResult<LinguisticItem>> => {
    const serializedWord = word.trim().toLowerCase();
    if (!serializedWord) {
      const error = 'Word is required';

      return {
        success: false,
        error,
      };
    }

    const { userSettings } = context;

    if (!userSettings.native_language) {
      const error =
        'Please complete your profile setup to use the translation feature';

      return {
        success: false,
        error,
      };
    }

    const targetLanguage = getLanguageName(
      userSettings.native_language as LanguageCode,
    );

    try {
      // Call OpenAI for translation
      const response = await generateLinguisticItemService(
        serializedWord,
        targetLanguage,
      );

      if (!response) {
        const error = 'Translation service unavailable';

        return {
          success: false,
          error,
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
