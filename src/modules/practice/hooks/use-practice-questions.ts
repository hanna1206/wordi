import { useCallback, useEffect, useState } from 'react';

import { generateDistractors } from '@/modules/multiple-choice/multiple-choice.actions';
import type {
  DistractorGenerationRequest,
  Question,
  VocabularyExerciseItem,
} from '@/modules/multiple-choice/multiple-choice.types';
import { shuffleOptions } from '@/modules/multiple-choice/multiple-choice.utils';
import { fetchUserSettings } from '@/modules/user-settings/user-settings.actions';
import { LanguageLabels } from '@/modules/user-settings/user-settings.const';
import { fetchUserMinimalVocabulary } from '@/modules/vocabulary/vocabulary.actions';

import type { VocabularySourceType } from '../practice.types';

interface UsePracticeQuestionsParams {
  exerciseType: string | null;
  sourceType: VocabularySourceType | null;
  sourceId: string | null;
}

interface UsePracticeQuestionsReturn {
  questions: Question[];
  isLoading: boolean;
  error: string | null;
  reload: () => void;
}

export function usePracticeQuestions({
  exerciseType,
  sourceType,
  sourceId,
}: UsePracticeQuestionsParams): UsePracticeQuestionsReturn {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadQuestions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!exerciseType || !sourceType) {
        throw new Error('Missing practice configuration');
      }

      // Fetch user settings
      const settingsResult = await fetchUserSettings();
      if (!settingsResult.success || !settingsResult.data) {
        throw new Error('Failed to load user settings');
      }

      const settings = settingsResult.data;
      if (!settings.nativeLanguage) {
        throw new Error('Please complete your profile setup first');
      }

      // Fetch vocabulary items based on source
      const vocabularyParams: Parameters<typeof fetchUserMinimalVocabulary>[0] =
        {
          limit: 1000,
          offset: 0,
          visibilityFilter: 'visible-only',
        };

      // Apply source-specific filters
      if (sourceType === 'collection' && sourceId) {
        vocabularyParams.collectionIds = [sourceId];
      } else if (sourceType === 'worst-known') {
        vocabularyParams.progressAccuracyFilter = 'low';
        vocabularyParams.sort = 'Progress: Accuracy';
      } else if (sourceType === 'new-words') {
        vocabularyParams.progressStatusFilter = ['new', 'not-started'];
      } else if (sourceType === 'without-collection') {
        vocabularyParams.collectionIds = [];
      }

      const vocabularyResult =
        await fetchUserMinimalVocabulary(vocabularyParams);
      if (!vocabularyResult.success || !vocabularyResult.data) {
        throw new Error('Failed to load vocabulary items');
      }

      const items = vocabularyResult.data.items;

      if (items.length === 0) {
        throw new Error('No vocabulary items found for the selected source');
      }

      // Filter out items without translations
      const itemsWithTranslations = items.filter(
        (item) =>
          item.commonData?.mainTranslation &&
          item.commonData.mainTranslation.trim() !== '',
      );

      if (itemsWithTranslations.length === 0) {
        throw new Error(
          'No vocabulary items with translations found. Please add translations to your vocabulary items.',
        );
      }

      // Prepare vocabulary items for distractor generation
      const preparedItems: VocabularyExerciseItem[] = itemsWithTranslations.map(
        (item) => ({
          id: item.id,
          targetLanguageWord: item.normalizedText,
          nativeLanguageTranslation: item.commonData.mainTranslation,
          partOfSpeech: item.partOfSpeech,
          gender: undefined,
        }),
      );

      // Generate distractors
      const nativeLanguageLabel =
        LanguageLabels[settings.nativeLanguage as keyof typeof LanguageLabels];

      const request: DistractorGenerationRequest = {
        items: preparedItems,
        targetLanguage: 'German',
        nativeLanguage: nativeLanguageLabel,
      };

      const distractorsResult = await generateDistractors(request);

      if (!distractorsResult.success || !distractorsResult.data) {
        throw new Error(
          distractorsResult.error || 'Failed to generate distractors',
        );
      }

      // Prepare questions
      const preparedQuestions: Question[] = [];
      for (const item of preparedItems) {
        const itemDistractors = distractorsResult.data.distractors[item.id];

        if (!itemDistractors || itemDistractors.length !== 3) {
          continue;
        }

        const allOptions = [item.targetLanguageWord, ...itemDistractors];
        const shuffledOptions = shuffleOptions(allOptions);

        preparedQuestions.push({
          id: item.id,
          targetLanguageWord: item.targetLanguageWord,
          nativeLanguageTranslation: item.nativeLanguageTranslation,
          options: shuffledOptions,
          correctAnswer: item.targetLanguageWord,
        });
      }

      if (preparedQuestions.length === 0) {
        throw new Error('Failed to prepare questions');
      }

      setQuestions(preparedQuestions);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load practice data',
      );
    } finally {
      setIsLoading(false);
    }
  }, [exerciseType, sourceType, sourceId]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const reload = useCallback(() => {
    setQuestions([]);
    loadQuestions();
  }, [loadQuestions]);

  return {
    questions,
    isLoading,
    error,
    reload,
  };
}
