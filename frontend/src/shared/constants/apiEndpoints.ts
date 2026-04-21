/**
 * API Endpoint constants.
 */

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  TOPICS: '/topics',
  VOCABULARY: '/vocabulary',
  TESTS: '/tests',
  MISTAKES: '/mistakes',
  STATS: '/stats',
} as const;
