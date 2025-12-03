import { AnswerRecord, ExerciseResults } from './multiple-choice.types';

/**
 * Shuffles an array using Fisher-Yates algorithm
 * Returns a new array without modifying the original
 */
export function shuffleOptions<T>(options: T[]): T[] {
  const shuffled = [...options];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Calculates the accuracy percentage from answer records
 * Returns a number between 0 and 100, rounded to 2 decimal places
 */
export function calculateAccuracy(answers: AnswerRecord[]): number {
  if (answers.length === 0) {
    return 0;
  }

  const correctCount = answers.filter((answer) => answer.isCorrect).length;
  const accuracy = (correctCount / answers.length) * 100;

  return Math.round(accuracy * 100) / 100;
}

/**
 * Calculates exercise results from answer records
 */
export function calculateResults(
  answers: AnswerRecord[],
  startTime: number,
): ExerciseResults {
  const correctAnswers = answers.filter((answer) => answer.isCorrect).length;
  const incorrectAnswers = answers.length - correctAnswers;
  const accuracy = calculateAccuracy(answers);
  const duration = Date.now() - startTime;

  return {
    totalQuestions: answers.length,
    correctAnswers,
    incorrectAnswers,
    accuracy,
    answers,
    duration,
  };
}
