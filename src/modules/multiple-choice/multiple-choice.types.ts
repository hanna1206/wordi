import { Gender, PartOfSpeech } from '../linguistics/linguistics.const';
import { MinimalVocabularyWord } from '../vocabulary/vocabulary.types';

// Vocabulary item for the exercise
export interface VocabularyExerciseItem {
  id: string;
  targetLanguageWord: string; // German word
  nativeLanguageTranslation: string; // Translation in user's native language
  partOfSpeech: PartOfSpeech;
  gender?: Gender; // For nouns
}

// Distractor generation request
export interface DistractorGenerationRequest {
  items: Array<{
    id: string;
    targetLanguageWord: string; // German word
    nativeLanguageTranslation: string; // Translation in user's native language
    partOfSpeech: PartOfSpeech;
    gender?: Gender;
  }>;
  targetLanguage: string; // "German"
  nativeLanguage: string; // User's native language (e.g., "Russian", "English")
}

// Distractor generation response
export interface DistractorGenerationResponse {
  distractors: Record<string, string[]>; // id -> [distractor1, distractor2, distractor3]
}

// Question state
export interface Question {
  id: string;
  targetLanguageWord: string; // German word (correct answer)
  nativeLanguageTranslation: string; // Question text in native language
  options: string[]; // 4 shuffled German options
  correctAnswer: string;
}

// Answer record
export interface AnswerRecord {
  questionId: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timestamp: number;
}

// Exercise results
export interface ExerciseResults {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number; // percentage
  answers: AnswerRecord[];
  duration: number; // milliseconds
}

// Game state
export interface MultipleChoiceGameState {
  status: 'loading' | 'ready' | 'playing' | 'feedback' | 'completed' | 'error';
  questions: Question[];
  currentQuestionIndex: number;
  selectedAnswer: string | null;
  answers: AnswerRecord[];
  distractors: Record<string, string[]>;
  startTime: number;
  error?: string;
}

// Component props
export interface MultipleChoiceExerciseProps {
  vocabularyItems: MinimalVocabularyWord[];
  nativeLanguage: string; // User's native language (e.g., "Russian", "English")
  targetLanguage: string; // Target language being learned (e.g., "German")
  onComplete: (results: ExerciseResults) => void;
  onExit: () => void;
}

export interface QuestionCardProps {
  question: string; // Native language translation
  currentQuestion: number;
  totalQuestions: number;
}

export interface AnswerOptionsProps {
  options: string[]; // 4 target language options (shuffled)
  correctAnswer: string;
  selectedAnswer: string | null;
  onSelect: (answer: string) => void;
  showFeedback: boolean;
}

export interface ProgressIndicatorProps {
  current: number;
  total: number;
  correctCount: number;
}

export interface ResultsSummaryProps {
  results: ExerciseResults;
  onRestart: () => void;
  onExit: () => void;
}
