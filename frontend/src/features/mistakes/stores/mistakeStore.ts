import { create } from 'zustand';
import type { ID } from '@/shared/types/global.types';

/**
 * Store for tracking mistakes during a learning session.
 */

interface MistakeState {
  sessionMistakes: ID[]; // List of vocabIds recorded as mistakes in the current session
  addMistake: (vocabId: ID) => void;
  clearSession: () => void;
}

/**
 * Mistake Store Logic:
 * KHÔNG lưu trùng lỗi trong cùng một phiên test cho cùng một từ.
 */
export const useMistakeStore = create<MistakeState>((set) => ({
  sessionMistakes: [],
  
  addMistake: (vocabId: ID) => set((state) => {
    // Logic: KHÔNG lưu trùng lỗi trong cùng một phiên test cho cùng một từ
    if (state.sessionMistakes.includes(vocabId)) {
      return state;
    }
    return {
      sessionMistakes: [...state.sessionMistakes, vocabId]
    };
  }),
  
  clearSession: () => set({ sessionMistakes: [] }),
}));
