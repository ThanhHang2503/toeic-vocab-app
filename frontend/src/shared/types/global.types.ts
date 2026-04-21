/**
 * Common types used throughout the application.
 * Defines standard response formats and pagination.
 */

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type ID = number;

export interface BaseEntity {
  id: ID;
  createdAt?: string;
  updatedAt?: string;
}
