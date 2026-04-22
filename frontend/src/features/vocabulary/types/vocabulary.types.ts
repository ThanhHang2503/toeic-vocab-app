import type { BaseEntity, ID } from '@/shared/types/global.types';

/**
 * Vocabulary interface representing a word in the system.
 */

import type { Topic } from '@/features/topics/types/topic.types';

export interface Vocabulary extends BaseEntity {
  word: string;
  meaning: string;
  example: string;
  pronunciation?: string;
  imagePath?: string;
  topic?: Topic;
  topicId?: ID;
  status?: 'known' | 'unknown';
}

export type CreateVocabularyDto = Omit<Vocabulary, keyof BaseEntity>;
export type UpdateVocabularyDto = Partial<CreateVocabularyDto>;
