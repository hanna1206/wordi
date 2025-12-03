'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { MinimalVocabularyWord } from '@/modules/vocabulary/vocabulary.types';

import { generateDistractors } from '../multiple-choice.actions';
import type {
  AnswerRecord,
  DistractorGenerationRequest,
  ExerciseResults,
  MultipleChoiceGameState,
  Question,
  VocabularyExerciseItem,
} from '../multiple-choice.types';
import { calculateResults, shuffleOptions } from '../multiple-choice.utils';

interface UseMultipleChoiceGameProps {
  vocabularyItems: MinimalVocabularyWord[];
  nativeLanguage: string;
  targetLanguage: string;
}

interface UseMultipleChoiceGameReturn {
  // State
  status: MultipleChoiceGameState['status'];
  currentQuestion: Question | null;
  currentQuestionIndex: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  answers: AnswerRecord[];
  error: string | undefined;
  results: ExerciseResults | null;

  // Actions
  selectAnswer: (answer: string) => void;
  nextQuestion: () => void;
  retry: () => void;
}

export function useMultipleChoiceGame({
  vocabularyItems,
  nativeLanguage,
  targetLanguage,
}: UseMultipleChoiceGameProps): UseMultipleChoiceGameReturn {
  const [gameState, setGameState] = useState<MultipleChoiceGameState>({
    status: 'loading',
    questions: [],
    currentQuestionIndex: 0,
    selectedAnswer: null,
    answers: [],
    distractors: {},
    startTime: 0,
    error: undefined,
  });

  const [results, setResults] = useState<ExerciseResults | null>(null);
  const hasInitialized = useRef(false);

  // Extract vocabulary exercise items and validate translations
  const prepareVocabularyItems = useCallback(
    (items: MinimalVocabularyWord[]): VocabularyExerciseItem[] => {
      const prepared: VocabularyExerciseItem[] = [];

      for (const item of items) {
        // Check if the item has a translation in the native language
        const nativeTranslation = item.commonData.mainTranslation;

        if (!nativeTranslation || nativeTranslation.trim() === '') {
          // Skip items without native language translation
          continue;
        }

        prepared.push({
          id: item.id,
          targetLanguageWord: item.normalizedText,
          nativeLanguageTranslation: nativeTranslation,
          partOfSpeech: item.partOfSpeech,
          // Extract gender if available from specific data
          gender: undefined, // TODO: Extract from specificData if needed
        });
      }

      return prepared;
    },
    [],
  );

  // Prepare questions from vocabulary items and distractors
  const prepareQuestions = useCallback(
    (
      items: VocabularyExerciseItem[],
      distractors: Record<string, string[]>,
    ): Question[] => {
      const questions: Question[] = [];

      for (const item of items) {
        const itemDistractors = distractors[item.id];

        if (!itemDistractors || itemDistractors.length !== 3) {
          // Skip items without proper distractors
          continue;
        }

        // Combine correct answer with distractors
        const allOptions = [item.targetLanguageWord, ...itemDistractors];

        // Shuffle the options
        const shuffledOptions = shuffleOptions(allOptions);

        questions.push({
          id: item.id,
          targetLanguageWord: item.targetLanguageWord,
          nativeLanguageTranslation: item.nativeLanguageTranslation,
          options: shuffledOptions,
          correctAnswer: item.targetLanguageWord,
        });
      }

      return questions;
    },
    [],
  );

  // Initialize game: load distractors and prepare questions
  const initializeGame = useCallback(async () => {
    try {
      setGameState((prev) => ({
        ...prev,
        status: 'loading',
        error: undefined,
      }));

      // Prepare vocabulary items and validate translations
      const preparedItems = prepareVocabularyItems(vocabularyItems);

      if (preparedItems.length === 0) {
        setGameState((prev) => ({
          ...prev,
          status: 'error',
          error: 'No vocabulary items with valid translations available',
        }));
        return;
      }

      // Generate distractors
      const request: DistractorGenerationRequest = {
        items: preparedItems,
        targetLanguage,
        nativeLanguage,
      };

      const result = await generateDistractors(request);

      if (!result.success || !result.data) {
        setGameState((prev) => ({
          ...prev,
          status: 'error',
          error: result.error || 'Failed to generate distractors',
        }));
        return;
      }

      // Prepare questions
      const questions = prepareQuestions(
        preparedItems,
        result.data.distractors,
      );

      if (questions.length === 0) {
        setGameState((prev) => ({
          ...prev,
          status: 'error',
          error: 'Failed to prepare questions',
        }));
        return;
      }

      // Set game state to ready
      setGameState({
        status: 'ready',
        questions,
        currentQuestionIndex: 0,
        selectedAnswer: null,
        answers: [],
        distractors: result.data.distractors,
        startTime: Date.now(),
        error: undefined,
      });
    } catch (error) {
      setGameState((prev) => ({
        ...prev,
        status: 'error',
        error:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      }));
    }
  }, [
    vocabularyItems,
    nativeLanguage,
    targetLanguage,
    prepareVocabularyItems,
    prepareQuestions,
  ]);

  // Initialize game on mount
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      initializeGame();
    }
  }, [initializeGame]);

  // Select an answer
  const selectAnswer = useCallback((answer: string) => {
    setGameState((prev) => {
      // Only allow selection if in ready or playing state
      if (prev.status !== 'ready' && prev.status !== 'playing') {
        return prev;
      }

      const currentQuestion = prev.questions[prev.currentQuestionIndex];
      if (!currentQuestion) {
        return prev;
      }

      // Create answer record
      const answerRecord: AnswerRecord = {
        questionId: currentQuestion.id,
        selectedAnswer: answer,
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect: answer === currentQuestion.correctAnswer,
        timestamp: Date.now(),
      };

      return {
        ...prev,
        status: 'feedback',
        selectedAnswer: answer,
        answers: [...prev.answers, answerRecord],
      };
    });
  }, []);

  // Move to next question
  const nextQuestion = useCallback(() => {
    setGameState((prev) => {
      // Only allow navigation if in feedback state
      if (prev.status !== 'feedback') {
        return prev;
      }

      const nextIndex = prev.currentQuestionIndex + 1;

      // Check if there are more questions
      if (nextIndex < prev.questions.length) {
        return {
          ...prev,
          status: 'playing',
          currentQuestionIndex: nextIndex,
          selectedAnswer: null,
        };
      }

      // No more questions - complete the game
      const finalResults = calculateResults(prev.answers, prev.startTime);
      setResults(finalResults);

      return {
        ...prev,
        status: 'completed',
        selectedAnswer: null,
      };
    });
  }, []);

  // Retry after error
  const retry = useCallback(() => {
    hasInitialized.current = false;
    setResults(null);
    initializeGame();
  }, [initializeGame]);

  // Get current question
  const currentQuestion =
    gameState.questions[gameState.currentQuestionIndex] || null;

  return {
    // State
    status: gameState.status,
    currentQuestion,
    currentQuestionIndex: gameState.currentQuestionIndex,
    totalQuestions: gameState.questions.length,
    selectedAnswer: gameState.selectedAnswer,
    answers: gameState.answers,
    error: gameState.error,
    results,

    // Actions
    selectAnswer,
    nextQuestion,
    retry,
  };
}
