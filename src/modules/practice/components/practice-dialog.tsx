'use client';

import { useEffect, useState } from 'react';

import {
  Button,
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  Flex,
  Portal,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';

import { getUserCollections } from '@/modules/collection/collections.actions';
import type { CollectionWithCount } from '@/modules/collection/collections.types';
import { MultipleChoiceExercise } from '@/modules/multiple-choice/components/multiple-choice-exercise';
import type { ExerciseResults } from '@/modules/multiple-choice/multiple-choice.types';
import { fetchUserSettings } from '@/modules/user-settings/user-settings.actions';
import { LanguageLabels } from '@/modules/user-settings/user-settings.const';
import type { UserSettings } from '@/modules/user-settings/user-settings.types';
import { fetchUserMinimalVocabulary } from '@/modules/vocabulary/vocabulary.actions';
import type { MinimalVocabularyWord } from '@/modules/vocabulary/vocabulary.types';

import { ExerciseType } from '../practice.const';
import type { VocabularySource } from '../practice.types';
import { ExerciseTypeSelector } from './exercise-type-selector';
import { VocabularySourceSelector } from './vocabulary-source-selector';

interface PracticeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PracticeDialog({ isOpen, onClose }: PracticeDialogProps) {
  const [selectedExerciseType, setSelectedExerciseType] =
    useState<ExerciseType | null>(null);
  const [selectedSource, setSelectedSource] = useState<VocabularySource | null>(
    null,
  );
  const [collections, setCollections] = useState<CollectionWithCount[]>([]);
  const [isLoadingCollections, setIsLoadingCollections] = useState(false);

  // Exercise state
  const [isExerciseActive, setIsExerciseActive] = useState(false);
  const [vocabularyItems, setVocabularyItems] = useState<
    MinimalVocabularyWord[]
  >([]);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [isLoadingExercise, setIsLoadingExercise] = useState(false);
  const [exerciseError, setExerciseError] = useState<string | null>(null);

  // Load collections when dialog opens
  useEffect(() => {
    if (isOpen) {
      setIsLoadingCollections(true);
      getUserCollections()
        .then((result) => {
          if (result.success && result.data) {
            setCollections(result.data);
          }
        })
        .finally(() => {
          setIsLoadingCollections(false);
        });
    }
  }, [isOpen]);

  const handleOpenChange = (details: { open: boolean }) => {
    if (!details.open) {
      onClose();
      // Reset state on close
      setSelectedExerciseType(null);
      setSelectedSource(null);
      setIsExerciseActive(false);
      setVocabularyItems([]);
      setUserSettings(null);
      setExerciseError(null);
    }
  };

  const handlePractice = async () => {
    if (!selectedExerciseType || !selectedSource) return;

    // Only handle Multiple Choice for now
    if (selectedExerciseType !== ExerciseType.MultipleChoice) {
      // TODO: Handle other exercise types
      onClose();
      return;
    }

    setIsLoadingExercise(true);
    setExerciseError(null);

    try {
      // Fetch user settings to get native language
      const settingsResult = await fetchUserSettings();
      if (!settingsResult.success || !settingsResult.data) {
        throw new Error('Failed to load user settings');
      }

      const settings = settingsResult.data;
      setUserSettings(settings);

      // Check if user has completed onboarding
      if (!settings.nativeLanguage) {
        throw new Error('Please complete your profile setup first');
      }

      // Fetch vocabulary items based on selected source
      const vocabularyParams: Parameters<typeof fetchUserMinimalVocabulary>[0] =
        {
          limit: 1000, // Fetch a large number to have enough items
          offset: 0,
          visibilityFilter: 'visible-only',
        };

      // Apply source-specific filters
      if (selectedSource.type === 'collection' && selectedSource.id) {
        vocabularyParams.collectionIds = [selectedSource.id];
      } else if (selectedSource.type === 'worst-known') {
        vocabularyParams.progressAccuracyFilter = 'low';
        vocabularyParams.sort = 'Progress: Accuracy';
      } else if (selectedSource.type === 'new-words') {
        vocabularyParams.progressStatusFilter = ['new', 'not-started'];
      } else if (selectedSource.type === 'without-collection') {
        vocabularyParams.collectionIds = [];
      }

      const vocabularyResult =
        await fetchUserMinimalVocabulary(vocabularyParams);
      if (!vocabularyResult.success || !vocabularyResult.data) {
        throw new Error('Failed to load vocabulary items');
      }

      const items = vocabularyResult.data.items.map((item) => ({
        id: item.id,
        type: item.type,
        normalizedText: item.normalizedText,
        partOfSpeech: item.partOfSpeech,
        commonData: item.commonData,
        isHidden: item.isHidden,
      }));

      if (items.length === 0) {
        throw new Error('No vocabulary items found for the selected source');
      }

      setVocabularyItems(items);
      setIsExerciseActive(true);
    } catch (error) {
      setExerciseError(
        error instanceof Error ? error.message : 'Failed to start exercise',
      );
    } finally {
      setIsLoadingExercise(false);
    }
  };

  const handleExerciseComplete = (results: ExerciseResults) => {
    // TODO: Save results to database or show summary
    // For now, just log completion (results available for future use)
    void results;
  };

  const handleExerciseExit = () => {
    setIsExerciseActive(false);
    setVocabularyItems([]);
    setUserSettings(null);
    setExerciseError(null);
    onClose();
  };

  const isPracticeButtonEnabled =
    selectedExerciseType !== null && selectedSource !== null;

  // Show exercise if active
  if (isExerciseActive && userSettings && vocabularyItems.length > 0) {
    const nativeLanguageCode = userSettings.nativeLanguage;
    if (!nativeLanguageCode) {
      // This shouldn't happen as we check earlier, but handle it gracefully
      setExerciseError('Native language not set');
      setIsExerciseActive(false);
      return null;
    }

    const nativeLanguage =
      LanguageLabels[nativeLanguageCode as keyof typeof LanguageLabels];
    const targetLanguage = 'German'; // Currently hardcoded as per requirements

    return (
      <DialogRoot open={isOpen} onOpenChange={handleOpenChange} size="full">
        <Portal>
          <DialogBackdrop />
          <DialogPositioner>
            <DialogContent borderRadius={0} p={0}>
              <MultipleChoiceExercise
                vocabularyItems={vocabularyItems}
                nativeLanguage={nativeLanguage}
                targetLanguage={targetLanguage}
                onComplete={handleExerciseComplete}
                onExit={handleExerciseExit}
              />
            </DialogContent>
          </DialogPositioner>
        </Portal>
      </DialogRoot>
    );
  }

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={handleOpenChange}
      size={{ mdDown: 'full', md: 'lg' }}
    >
      <Portal>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent borderRadius={{ base: 0, md: 'lg' }} overflowY="auto">
            <DialogHeader>
              <DialogTitle>Practice Settings</DialogTitle>
              <DialogCloseTrigger />
            </DialogHeader>

            <DialogBody py={{ base: 4, md: 3 }}>
              {isLoadingExercise ? (
                <VStack gap={4} py={8}>
                  <Spinner size="xl" color="purple.500" />
                  <Text fontSize="lg" color="gray.600">
                    Loading exercise...
                  </Text>
                </VStack>
              ) : exerciseError ? (
                <VStack gap={4} py={8}>
                  <Text fontSize="lg" color="red.600" fontWeight="bold">
                    Error
                  </Text>
                  <Text fontSize="md" color="gray.600" textAlign="center">
                    {exerciseError}
                  </Text>
                  <Button
                    onClick={() => setExerciseError(null)}
                    colorScheme="purple"
                    size="md"
                  >
                    Try Again
                  </Button>
                </VStack>
              ) : (
                <Flex direction="column" gap={{ base: 4, md: 3 }}>
                  {/* Exercise Type Section */}
                  <ExerciseTypeSelector
                    selectedType={selectedExerciseType}
                    onSelect={setSelectedExerciseType}
                  />

                  {/* Vocabulary Source Section */}
                  <VocabularySourceSelector
                    selectedSource={selectedSource}
                    onSelect={setSelectedSource}
                    collections={collections}
                    isLoading={isLoadingCollections}
                  />
                </Flex>
              )}
            </DialogBody>

            <DialogFooter pt={3} gap={2}>
              <Button size="md" flex={1} variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button
                size="md"
                flex={1}
                onClick={handlePractice}
                disabled={!isPracticeButtonEnabled || isLoadingExercise}
                loading={isLoadingExercise}
              >
                Practice
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </Portal>
    </DialogRoot>
  );
}
