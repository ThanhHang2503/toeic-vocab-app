import { create } from 'zustand';
import axiosInstance from '@/shared/lib/axios';
import type { Vocabulary } from '../types/vocabulary.types';
import toast from 'react-hot-toast';
import { useTopicStore } from '@/features/topics/stores/topicStore';

interface VocabState {
  words: Vocabulary[];
  isLoading: boolean;
  error: string | null;
  fetchWords: (topicId?: number) => Promise<void>;
  addWord: (formData: FormData) => Promise<void>;
  updateWord: (id: number, formData: FormData) => Promise<void>;
  deleteWord: (id: number) => Promise<void>;
  updateWordStatus: (id: number, status: 'known' | 'unknown') => Promise<void>;
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
      const response = await axiosInstance.post('/words', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const newWord = response.data;
      set({ words: [...get().words, newWord], isLoading: false });
      
      // Update topic count in topicStore
      if (newWord.topic?.id) {
        useTopicStore.getState().updateVocabCount(newWord.topic.id, 1);
      }
      
      toast.success('Thêm từ vựng thành công');
    } catch (err: any) {
      set({ isLoading: false });
      toast.error('Lỗi khi thêm từ vựng');
    }
  },

  updateWord: async (id, formData) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.put(`/words/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      set({
        words: get().words.map((w) => (w.id === id ? response.data : w)),
        isLoading: false,
      });
      toast.success('Cập nhật từ vựng thành công');
    } catch (err: any) {
      set({ isLoading: false });
      toast.error('Lỗi khi cập nhật từ vựng');
    }
  },

  deleteWord: async (id) => {
    try {
      const wordToDelete = get().words.find(w => w.id === id);
      await axiosInstance.delete(`/words/${id}`);
      set({ words: get().words.filter(w => w.id !== id) });
      
      // Update topic count in topicStore
      if (wordToDelete?.topic?.id) {
        useTopicStore.getState().updateVocabCount(wordToDelete.topic.id, -1);
      }

      toast.success('Xóa từ vựng thành công');
    } catch (err: any) {
      toast.error('Lỗi khi xóa từ vựng');
    }
  },

  updateWordStatus: async (id, status) => {
    // Optimistic UI update
    const previousWords = get().words;
    set({
      words: previousWords.map((w) => (w.id === id ? { ...w, status } : w)),
    });

    try {
      const response = await axiosInstance.patch(`/words/${id}/status`, null, {
        params: { status }
      });
      // Ensure the response data has the updated status
      set({
        words: get().words.map((w) => (w.id === id ? response.data : w)),
      });
      
      if (status === 'known') {
        toast.success('Đã thêm vào danh sách đã nhớ');
      } else {
        toast.success('Đã thêm vào danh sách chưa nhớ');
      }
    } catch (err: any) {
      // Revert optimistic update
      set({ words: previousWords });
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  },
}));
