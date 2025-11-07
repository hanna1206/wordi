'use server';

import * as Sentry from '@sentry/nextjs';

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

    if (!userSettings.nativeLanguage) {
      const error =
        'Please complete your profile setup to use the translation feature';

      return {
        success: false,
        error,
      };
    }

    const targetLanguage = getLanguageName(
      userSettings.nativeLanguage as LanguageCode,
    );

    try {
      const response = await generateLinguisticItemService(
        serializedWord,
        targetLanguage,
      );

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      Sentry.captureException(error);
      return {
        success: false,
        error: 'Translation service failed',
      };
    }
  },
);
