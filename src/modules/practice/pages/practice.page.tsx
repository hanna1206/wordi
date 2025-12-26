'use client';

import { Flex, Spinner, Text, VStack } from '@chakra-ui/react';
import { useRouter, useSearchParams } from 'next/navigation';

import { MultipleChoiceExercise } from '@/modules/multiple-choice/components/multiple-choice-exercise';
import type { ExerciseResults } from '@/modules/multiple-choice/multiple-choice.types';

import { usePracticeQuestions } from '../hooks/use-practice-questions';
import { ExerciseType } from '../practice.const';
import type { VocabularySourceType } from '../practice.types';

export const PracticePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const exerciseType = searchParams.get('exerciseType') as ExerciseType;
  const sourceType = searchParams.get('sourceType') as VocabularySourceType;
  const sourceId = searchParams.get('sourceId');

  const { questions, isLoading, error, reload } = usePracticeQuestions({
    exerciseType,
    sourceType,
    sourceId,
  });

  const handleExerciseComplete = (results: ExerciseResults) => {
    // TODO: Save results to database
    void results;
  };

  const handleExerciseExit = () => {
    router.push('/');
  };

  if (isLoading || questions.length === 0) {
    return (
      <Flex
        direction="column"
        minH="100svh"
        align="center"
        justify="center"
        p={4}
      >
        <VStack gap={4}>
          <Spinner size="xl" color="purple.500" />
          <Text fontSize="lg" color="gray.600">
            Preparing your exercise...
          </Text>
        </VStack>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex
        direction="column"
        minH="100svh"
        align="center"
        justify="center"
        p={4}
      >
        <VStack gap={4} maxW="500px" textAlign="center">
          <Text fontSize="2xl" fontWeight="bold" color="red.600">
            Error
          </Text>
          <Text fontSize="md" color="gray.600">
            {error}
          </Text>
        </VStack>
      </Flex>
    );
  }

  return (
    <MultipleChoiceExercise
      questions={questions}
      onComplete={handleExerciseComplete}
      onExit={handleExerciseExit}
      onRetry={reload}
    />
  );
};
