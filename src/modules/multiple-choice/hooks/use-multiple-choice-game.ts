'use client';

import { useCallback, useState } from 'react';

import type {
  AnswerRecord,
  ExerciseResults,
  MultipleChoiceGameState,
  Question,
} from '../multiple-choice.types';
import { calculateResults } from '../multiple-choice.utils';

interface UseMultipleChoiceGameProps {
  questions: Question[];
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
}

export function useMultipleChoiceGame({
  questions,
}: UseMultipleChoiceGameProps): UseMultipleChoiceGameReturn {
  const [gameState, setGameState] = useState<MultipleChoiceGameState>({
    status: 'ready',
    questions,
    currentQuestionIndex: 0,
    selectedAnswer: null,
    answers: [],
    distractors: {},
    startTime: Date.now(),
    error: undefined,
  });

  const [results, setResults] = useState<ExerciseResults | null>(null);

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
  };
}
