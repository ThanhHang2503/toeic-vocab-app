import { create } from 'zustand';
import axiosInstance from '@/shared/lib/axios';
import type { Topic, CreateTopicDto } from '../types/topic.types';
import toast from 'react-hot-toast';

interface TopicState {
  topics: Topic[];
  isLoading: boolean;
  error: string | null;
  fetchTopics: () => Promise<void>;
  addTopic: (data: CreateTopicDto) => Promise<void>;
  updateTopic: (id: number, data: CreateTopicDto) => Promise<void>;
  deleteTopic: (id: number) => Promise<void>;
  getVocabularyCount: (topicId: number) => number;
  updateVocabCount: (topicId: number, delta: number) => void;
}

export const useTopicStore = create<TopicState>((set, get) => ({
  topics: [],
  isLoading: false,
  error: null,

  fetchTopics: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/topics');
      set({ topics: response.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      toast.error('Không thể tải danh sách chủ đề');
    }
  },

  addTopic: async (data) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post('/topics', data);
      set({ topics: [...get().topics, response.data], isLoading: false });
      toast.success('Thêm chủ đề thành công');
    } catch (err: any) {
      set({ isLoading: false });
      toast.error('Lỗi khi thêm chủ đề');
    }
  },

  updateTopic: async (id, data) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.put(`/topics/${id}`, data);
      set({
        topics: get().topics.map((t) => (t.id === id ? response.data : t)),
        isLoading: false,
      });
      toast.success('Cập nhật chủ đề thành công');
    } catch (err: any) {
      set({ isLoading: false });
      toast.error('Lỗi khi cập nhật chủ đề');
    }
  },

  deleteTopic: async (id) => {
    try {
      await axiosInstance.delete(`/topics/${id}`);
      set({ topics: get().topics.filter((t) => t.id !== id) });
      toast.success('Xóa chủ đề thành công');
    } catch (err: any) {
      toast.error('Lỗi khi xóa chủ đề');
    }
  },

  getVocabularyCount: (topicId) => {
    const topic = get().topics.find((t) => t.id === topicId);
    return topic?.vocabCount || 0;
  },

  updateVocabCount: (topicId, delta) => {
    set({
      topics: get().topics.map((t) => 
        t.id === topicId 
          ? { ...t, vocabCount: (t.vocabCount || 0) + delta } 
          : t
      )
    });
  },
}));
