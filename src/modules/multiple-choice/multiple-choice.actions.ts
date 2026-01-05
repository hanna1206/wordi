'use server';

import * as Sentry from '@sentry/nextjs';

import type { ActionResult } from '@/shared-types';

import * as multipleChoiceService from './multiple-choice.service';
import type {
  DistractorGenerationRequest,
  DistractorGenerationResponse,
} from './multiple-choice.types';

export async function generateDistractors(
  request: DistractorGenerationRequest,
): Promise<ActionResult<DistractorGenerationResponse>> {
  // Validate request
  if (!request.items || request.items.length === 0) {
    return {
      success: false,
      error: 'No vocabulary items provided',
    };
  }

  if (!request.targetLanguage || !request.nativeLanguage) {
    return {
      success: false,
      error: 'Target language and native language are required',
    };
  }

  try {
    // Format items for the prompt
    const itemsFormatted = request.items
      .map(
        (item) =>
          `ID: ${item.id}
Target Language Word: ${item.targetLanguageWord}
Native Language Translation: ${item.nativeLanguageTranslation}
Part of Speech: ${item.partOfSpeech}${item.gender ? `\nGender: ${item.gender}` : ''}`,
      )
      .join('\n\n');

    // Call service
    const result = await multipleChoiceService.generateDistractors(
      itemsFormatted,
      request.targetLanguage,
      request.nativeLanguage,
    );

    // Validate response structure
    const { distractors } = result;

    // Check that we have distractors for all items
    const missingIds = request.items
      .map((item) => item.id)
      .filter((id) => !distractors[id] || distractors[id].length !== 3);

    if (missingIds.length > 0) {
      Sentry.captureMessage('Incomplete distractor generation', {
        level: 'warning',
        tags: {
          action: 'generateDistractors',
        },
        extra: {
          missingIds,
          receivedIds: Object.keys(distractors),
          requestItemCount: request.items.length,
        },
      });

      return {
        success: false,
        error:
          'Failed to generate distractors for all vocabulary items. Please try again.',
      };
    }

    return {
      success: true,
      data: {
        distractors,
      },
    };
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        action: 'generateDistractors',
      },
      extra: {
        itemCount: request.items.length,
        targetLanguage: request.targetLanguage,
        nativeLanguage: request.nativeLanguage,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        errorStack: error instanceof Error ? error.stack : undefined,
      },
    });

    // Provide user-friendly error messages based on error type
    const errorMessage =
      error instanceof Error && error.message.toLowerCase().includes('network')
        ? 'Network error - please check your connection and try again'
        : error instanceof Error &&
            error.message.toLowerCase().includes('timeout')
          ? 'Request timed out. Please try again'
          : error instanceof Error &&
              error.message.toLowerCase().includes('rate limit')
            ? 'Service is busy. Please wait a moment and try again'
            : error instanceof Error &&
                error.message.toLowerCase().includes('validation')
              ? 'Invalid response from service. Please try again'
              : 'Failed to generate distractors. Please try again';

    return {
      success: false,
      error: errorMessage,
    };
  }
}
