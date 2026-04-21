import { useEffect, useState } from 'react';
import { useTopicStore } from '@/features/topics/stores/topicStore';
import { Button } from '@/shared/components/Button';
import { Plus, Trash2, BookOpen } from 'lucide-react';
import { Modal } from '@/shared/components/Modal';
import { Input } from '@/shared/components/Input';
import { useForm } from 'react-hook-form';
import type { CreateTopicDto } from '@/features/topics/types/topic.types';

const TopicsPage = () => {
  const { topics, isLoading, fetchTopics, addTopic, deleteTopic } = useTopicStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateTopicDto>();

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const onAddSubmit = async (data: CreateTopicDto) => {
    await addTopic(data);
    setIsAddModalOpen(false);
    reset();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chủ đề này không?')) {
      deleteTopic(id);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Chủ đề</h1>
          <p className="text-gray-500 mt-1">Sắp xếp từ vựng của bạn theo từng lĩnh vực</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
          <Plus size={18} />
          Thêm chủ đề mới
        </Button>
      </div>

      {isLoading && topics.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="card h-48 animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : topics.length === 0 ? (
        <div className="card h-64 flex flex-col items-center justify-center text-center">
          <BookOpen size={48} className="text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-900">Chưa có chủ đề nào</h3>
          <p className="text-gray-500 mt-1 max-w-sm">Hãy tạo chủ đề đầu tiên để bắt đầu thêm từ vựng và luyện tập.</p>
          <Button variant="outline" className="mt-6" onClick={() => setIsAddModalOpen(true)}>
            Tạo chủ đề đầu tiên
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <div key={topic.id} className="card group hover:border-primary transition-all relative overflow-hidden">
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between">
                  <div className="bg-primary/10 p-3 rounded-xl text-primary mb-4">
                    <BookOpen size={24} />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => topic.id && handleDelete(topic.id)}
                    className="text-gray-400 hover:text-danger hover:bg-danger/10"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                  {topic.name}
                </h3>
                <p className="text-gray-500 text-sm mt-2 line-clamp-2 flex-grow">
                  {topic.description || 'Không có mô tả'}
                </p>
                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-900">{topic.vocabCount || 0} từ vựng</span>
                  <span className="text-primary font-medium">Chi tiết &rarr;</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Topic Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        title="Thêm chủ đề mới"
      >
        <form onSubmit={handleSubmit(onAddSubmit)} className="space-y-4">
          <Input 
            label="Tên chủ đề"
            placeholder="Ví dụ: Công sở, Du lịch..."
            {...register('name', { required: 'Tên chủ đề là bắt buộc' })}
            error={errors.name?.message}
          />
          <Input 
            label="Mô tả"
            placeholder="Mô tả ngắn gọn về chủ đề này"
            {...register('description')}
          />
          <div className="flex justify-end gap-3 mt-8">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Lưu chủ đề
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TopicsPage;
