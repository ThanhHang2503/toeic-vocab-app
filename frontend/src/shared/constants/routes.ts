/**
 * Application route constants.
 * Use these instead of hardcoded strings to ensure consistency.
 */

export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
  },
  DASHBOARD: '/dashboard',
  TOPICS: {
    LIST: '/topics',
    DETAILS: (id: string | number) => `/topics/${id}`,
  },
  VOCABULARY: '/vocabulary',
  FLASHCARD: {
    ROOT: '/flashcard',
    SESSION: (topicId: string | number) => `/flashcard/${topicId}`,
  },
  TEST: {
    ROOT: '/test',
    SESSION: (topicId: string | number) => `/test/${topicId}`,
    RESULT: '/test/result',
  },
  MISTAKES: '/mistakes',
  SETTINGS: '/settings',
} as const;
