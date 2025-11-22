'use server';

import * as Sentry from '@sentry/nextjs';

import { LanguageCode } from '@/modules/user-settings/user-settings.const';
import { getLanguageName } from '@/modules/user-settings/utils/get-language-name';
import { withUserSettings } from '@/modules/user-settings/utils/with-user-settings';
import type { ActionResult } from '@/shared-types';

import {
  classifyInput,
  generateLinguisticCollocationItem as generateLinguisticCollocationService,
  generateLinguisticItem as generateLinguisticItemService,
} from './linguistics.service';
import type {
  LinguisticCollocationItem,
  LinguisticWordItem,
} from './linguistics.types';

export const generateLinguisticItem = withUserSettings<
  string,
  LinguisticWordItem | LinguisticCollocationItem
>(
  async (
    context,
    input,
  ): Promise<ActionResult<LinguisticWordItem | LinguisticCollocationItem>> => {
    const trimmedInput = input.trim();
    if (!trimmedInput) {
      const error = 'Input is required';

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
      const classification = await classifyInput(trimmedInput);

      if (classification.type === 'single-word') {
        const linguisticWordItem = await generateLinguisticItemService(
          classification.normalizedInput.toLowerCase(),
          targetLanguage,
        );

        return {
          success: true,
          data: linguisticWordItem,
        };
      } else {
        const linguisticCollocationItem =
          await generateLinguisticCollocationService(
            classification.normalizedInput,
            targetLanguage,
          );

        return {
          success: true,
          data: linguisticCollocationItem,
        };
      }
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          action: 'generateLinguisticItem',
        },
        extra: {
          input: trimmedInput,
          targetLanguage,
          nativeLanguage: userSettings.nativeLanguage,
          classificationType:
            error instanceof Error && error.message.includes('classifyInput')
              ? 'classification'
              : 'generation',
          errorMessage:
            error instanceof Error ? error.message : 'Unknown error',
          errorStack: error instanceof Error ? error.stack : undefined,
        },
      });

      const errorMessage =
        error instanceof Error &&
        error.message.toLowerCase().includes('network')
          ? 'Network error - please check your connection and try again'
          : error instanceof Error &&
              error.message.toLowerCase().includes('timeout')
            ? 'Request timed out. Please try again'
            : 'Translation service is temporarily unavailable. Please try again';

      return {
        success: false,
        error: errorMessage,
      };
    }
  },
);
