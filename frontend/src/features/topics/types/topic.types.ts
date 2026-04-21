import type { BaseEntity } from '@/shared/types/global.types';

/**
 * Topic interface for vocabulary categorization.
 */

export interface Topic extends BaseEntity {
  name: string;
  description?: string;
  imageUrl?: string;
  vocabCount?: number;
}

export interface CreateTopicDto {
  name: string;
  description?: string;
}
