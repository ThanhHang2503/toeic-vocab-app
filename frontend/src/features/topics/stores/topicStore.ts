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
  deleteTopic: (id: number) => Promise<void>;
}

export const useTopicStore = create<TopicState>((set, get) => ({
  topics: [],
  isLoading: false,
  error: null,

  fetchTopics: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/topics');
      // The backend uses /api/topics but axiosInstance already has /api prefix
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

  deleteTopic: async (id) => {
    try {
      await axiosInstance.delete(`/topics/${id}`);
      set({ topics: get().topics.filter(t => t.id !== id) });
      toast.success('Xóa chủ đề thành công');
    } catch (err: any) {
      toast.error('Lỗi khi xóa chủ đề');
    }
  },
}));
