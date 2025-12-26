'use client';

import { useEffect, useState } from 'react';

import { Center, Spinner, Text, VStack } from '@chakra-ui/react';
import { useRouter, useSearchParams } from 'next/navigation';

import { MultipleChoiceExercise } from '@/modules/multiple-choice/components/multiple-choice-exercise';
import type { ExerciseResults } from '@/modules/multiple-choice/multiple-choice.types';
import { fetchUserSettings } from '@/modules/user-settings/user-settings.actions';
import { LanguageLabels } from '@/modules/user-settings/user-settings.const';
import { fetchUserMinimalVocabulary } from '@/modules/vocabulary/vocabulary.actions';
import type { MinimalVocabularyWord } from '@/modules/vocabulary/vocabulary.types';

import { ExerciseType } from '../practice.const';
import type { VocabularySourceType } from '../practice.types';

export const PracticePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [practiceData, setPracticeData] = useState<{
    vocabularyItems: MinimalVocabularyWord[];
    nativeLanguage: string;
    targetLanguage: string;
  } | null>(null);

  useEffect(() => {
    const loadPracticeData = async () => {
      try {
        // Get params from URL
        const exerciseType = searchParams.get('exerciseType') as ExerciseType;
        const sourceType = searchParams.get(
          'sourceType',
        ) as VocabularySourceType;
        const sourceId = searchParams.get('sourceId');

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
        const vocabularyParams: Parameters<
          typeof fetchUserMinimalVocabulary
        >[0] = {
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

        setPracticeData({
          vocabularyItems: itemsWithTranslations,
          nativeLanguage: settings.nativeLanguage,
          targetLanguage: 'German',
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load practice data',
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadPracticeData();
  }, [searchParams]);

  const handleExerciseComplete = (results: ExerciseResults) => {
    // TODO: Save results to database
    void results;
    // Don't redirect automatically - let user see results and decide when to exit
  };

  const handleExerciseExit = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <Center h="full">
        <VStack gap={4}>
          <Spinner size="xl" />
          <Text fontSize="lg" color="gray.600">
            Preparing your exercise...
          </Text>
        </VStack>
      </Center>
    );
  }

  if (error || !practiceData) {
    return (
      <Center h="full">
        <VStack gap={4}>
          <Text fontSize="lg" color="red.600" fontWeight="bold">
            Error
          </Text>
          <Text fontSize="md" color="gray.600" textAlign="center">
            {error || 'Failed to load practice data'}
          </Text>
        </VStack>
      </Center>
    );
  }

  const nativeLanguage =
    LanguageLabels[practiceData.nativeLanguage as keyof typeof LanguageLabels];

  return (
    <MultipleChoiceExercise
      vocabularyItems={practiceData.vocabularyItems}
      nativeLanguage={nativeLanguage}
      targetLanguage={practiceData.targetLanguage}
      onComplete={handleExerciseComplete}
      onExit={handleExerciseExit}
    />
  );
};
