'use client';

import { useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';

import {
  Button,
  Flex,
  IconButton,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';

import { useMultipleChoiceGame } from '../hooks/use-multiple-choice-game';
import type { MultipleChoiceExerciseProps } from '../multiple-choice.types';
import { AnswerOptions } from './answer-options';
import { ProgressIndicator } from './progress-indicator';
import { QuestionCard } from './question-card';
import { ResultsSummary } from './results-summary';

const FEEDBACK_DELAY_MS = 1500; // 1.5 seconds feedback period

export const MultipleChoiceExercise = ({
  vocabularyItems,
  nativeLanguage,
  targetLanguage,
  onComplete,
  onExit,
}: MultipleChoiceExerciseProps) => {
  const {
    status,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    selectedAnswer,
    answers,
    error,
    results,
    selectAnswer,
    nextQuestion,
    retry,
  } = useMultipleChoiceGame({
    vocabularyItems,
    nativeLanguage,
    targetLanguage,
  });

  const feedbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle automatic advancement after feedback period
  useEffect(() => {
    if (status === 'feedback') {
      // Clear any existing timer
      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current);
      }

      // Set timer for automatic advancement
      feedbackTimerRef.current = setTimeout(() => {
        nextQuestion();
      }, FEEDBACK_DELAY_MS);
    }

    // Cleanup timer on unmount or status change
    return () => {
      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current);
      }
    };
  }, [status, nextQuestion]);

  // Handle exercise completion
  useEffect(() => {
    if (status === 'completed' && results) {
      onComplete(results);
    }
  }, [status, results, onComplete]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  // Loading state
  if (status === 'loading') {
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

  // Error state
  if (status === 'error') {
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
            Oops! Something went wrong
          </Text>
          <Text fontSize="md" color="gray.600">
            {error || 'An unexpected error occurred'}
          </Text>
          <VStack gap={2} w="full" maxW="300px">
            <Button onClick={retry} colorScheme="purple" size="lg" w="full">
              Try Again
            </Button>
            <Button
              onClick={onExit}
              variant="outline"
              colorScheme="gray"
              size="lg"
              w="full"
            >
              Exit
            </Button>
          </VStack>
        </VStack>
      </Flex>
    );
  }

  // Completed state - show results
  if (status === 'completed' && results) {
    return (
      <ResultsSummary
        results={results}
        onRestart={() => {
          // Clear timer if any
          if (feedbackTimerRef.current) {
            clearTimeout(feedbackTimerRef.current);
          }
          retry();
        }}
        onExit={onExit}
      />
    );
  }

  // Playing state - show question and options
  if (
    (status === 'ready' || status === 'playing' || status === 'feedback') &&
    currentQuestion
  ) {
    const showFeedback = status === 'feedback';
    const correctCount = answers.filter((a) => a.isCorrect).length;

    return (
      <Flex
        direction="column"
        minH="100svh"
        p={{ base: 3, sm: 4, md: 6 }}
        py={{ base: 6, sm: 8 }}
      >
        <VStack gap={{ base: 6, md: 8 }} maxW="800px" w="full" mx="auto">
          {/* Exit Button */}
          <Flex w="full" justify="flex-end">
            <IconButton
              onClick={onExit}
              aria-label="Exit exercise"
              variant="ghost"
              size="lg"
            >
              <FaTimes />
            </IconButton>
          </Flex>

          {/* Progress Indicator */}
          <ProgressIndicator
            current={currentQuestionIndex + 1}
            total={totalQuestions}
            correctCount={correctCount}
          />

          {/* Question Card */}
          <QuestionCard
            question={currentQuestion.nativeLanguageTranslation}
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={totalQuestions}
          />

          {/* Answer Options */}
          <AnswerOptions
            options={currentQuestion.options}
            correctAnswer={currentQuestion.correctAnswer}
            selectedAnswer={selectedAnswer}
            onSelect={selectAnswer}
            showFeedback={showFeedback}
          />
        </VStack>
      </Flex>
    );
  }

  // Fallback - should not reach here
  return null;
};
