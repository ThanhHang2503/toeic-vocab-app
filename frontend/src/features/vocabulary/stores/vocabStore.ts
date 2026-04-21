import { create } from 'zustand';
import axiosInstance from '@/shared/lib/axios';
import type { Vocabulary } from '../types/vocabulary.types';
import toast from 'react-hot-toast';

interface VocabState {
  words: Vocabulary[];
  isLoading: boolean;
  error: string | null;
  fetchWords: (topicId?: number) => Promise<void>;
  addWord: (formData: FormData) => Promise<void>;
  deleteWord: (id: number) => Promise<void>;
}

export const useVocabStore = create<VocabState>((set, get) => ({
  words: [],
  isLoading: false,
  error: null,

  fetchWords: async (topicId) => {
    set({ isLoading: true, error: null });
    try {
      const url = topicId ? `/words/topic/${topicId}` : '/words';
      const response = await axiosInstance.get(url);
      set({ words: response.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      toast.error('Không thể tải danh sách từ vựng');
    }
  },

  addWord: async (formData) => {
    set({ isLoading: true });
    try {
      // multipart/form-data is handled automatically by browser when sending FormData
      const response = await axiosInstance.post('/words', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      set({ words: [...get().words, response.data], isLoading: false });
      toast.success('Thêm từ vựng thành công');
    } catch (err: any) {
      set({ isLoading: false });
      toast.error('Lỗi khi thêm từ vựng');
    }
  },

  deleteWord: async (id) => {
    try {
      await axiosInstance.delete(`/words/${id}`);
      set({ words: get().words.filter(w => w.id !== id) });
      toast.success('Xóa từ vựng thành công');
    } catch (err: any) {
      toast.error('Lỗi khi xóa từ vựng');
    }
  },
}));
