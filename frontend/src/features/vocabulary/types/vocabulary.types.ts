import type { BaseEntity, ID } from '@/shared/types/global.types';

/**
 * Vocabulary interface representing a word in the system.
 */

export interface Vocabulary extends BaseEntity {
  word: string;
  meaning: string;
  example: string;
  pronunciation?: string;
  imagePath?: string;
  topicId: ID;
  isLearned?: boolean;
}

export type CreateVocabularyDto = Omit<Vocabulary, keyof BaseEntity>;
export type UpdateVocabularyDto = Partial<CreateVocabularyDto>;
