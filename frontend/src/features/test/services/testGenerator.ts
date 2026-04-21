import type { Vocabulary } from '../../vocabulary/types/vocabulary.types';
import type { Question } from '../types/test.types';

/**
 * Logic for generating test questions from vocabulary data.
 */

/**
 * Hàm tạo câu hỏi điền từ.
 * logic: CHỈ ẩn lần xuất hiện ĐẦU TIÊN của từ trong câu ví dụ (example).
 */
export const generateFillBlankQuestion = (vocab: Vocabulary): Question => {
  const { word, example, id } = vocab;
  
  // Logic: CHỈ ẩn lần xuất hiện ĐẦU TIÊN của từ trong câu ví dụ
  const regex = new RegExp(`\\b${word}\\b`, 'i');
  const prompt = example.replace(regex, '_______');

  return {
    id: `q-${Date.now()}`,
    vocabId: id,
    type: 'FILL_BLANK',
    prompt,
    correctAnswer: word,
  };
};

export const generateTestSet = (vocabList: Vocabulary[]): Question[] => {
  return vocabList.map(v => generateFillBlankQuestion(v));
};
