import type { ID } from '@/shared/types/global.types';

/**
 * Question types for quizzes.
 */
export type QuestionType = 'FILL_BLANK' | 'TRANSLATION' | 'MULTIPLE_CHOICE';

export interface Question {
  id: string;
  vocabId: ID;
  type: QuestionType;
  prompt: string;
  correctAnswer: string;
  options?: string[];
}

export interface TestSession {
  id: string;
  topicId: ID;
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  mistakes: ID[]; // Array of vocabIds that were answered incorrectly
}
