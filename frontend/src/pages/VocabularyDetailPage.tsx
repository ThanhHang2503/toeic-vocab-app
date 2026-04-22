import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useVocabStore } from '@/features/vocabulary/stores/vocabStore';
import { useTopicStore } from '@/features/topics/stores/topicStore';
import { Button } from '@/shared/components/Button';
import { 
  ArrowLeft, 
  Edit2, 
  Trash2, 
  Volume2, 
  BookOpen, 
  Calendar,
  Image as ImageIcon,
  Tag
} from 'lucide-react';
import { Modal } from '@/shared/components/Modal';
import { Input } from '@/shared/components/Input';
import { useForm } from 'react-hook-form';
import type { Vocabulary } from '@/features/vocabulary/types/vocabulary.types';

const VocabularyDetailPage = () => {
  const { vocabId } = useParams<{ vocabId: string }>();
  const navigate = useNavigate();
  const vId = Number(vocabId);

  const { words, isLoading, fetchWords, updateWord, deleteWord } = useVocabStore();
  const { topics, fetchTopics } = useTopicStore();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const currentWord = words.find(w => w.id === vId);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    // We fetch all words for now, or we could have a fetchWordById API
    fetchWords();
    fetchTopics();
  }, [fetchWords, fetchTopics]);

  useEffect(() => {
    if (currentWord) {
      setValue('word', currentWord.word);
      setValue('meaning', currentWord.meaning);
      setValue('example', currentWord.example);
      setValue('pronunciation', currentWord.pronunciation);
      setValue('topicId', currentWord.topic?.id);
    }
  }, [currentWord, setValue]);

  const onEditSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append('word', data.word);
    formData.append('meaning', data.meaning);
    formData.append('example', data.example);
    formData.append('topicId', data.topicId);
    if (data.pronunciation) formData.append('pronunciation', data.pronunciation);
    if (data.image && data.image[0]) formData.append('image', data.image[0]);

    await updateWord(vId, formData);
    setIsEditModalOpen(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa từ vựng này không?')) {
      await deleteWord(vId);
      navigate(-1); // Go back to previous page
    }
  };

  if (isLoading && !currentWord) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium">Đang tải thông tin từ vựng...</p>
      </div>
    );
  }

  if (!currentWord && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <div className="bg-danger/10 p-4 rounded-full text-danger mb-4">
          <Trash2 size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Không tìm thấy từ vựng</h2>
        <p className="text-gray-500 mt-2">Từ vựng này có thể đã bị xóa hoặc không tồn tại.</p>
        <Button onClick={() => navigate(-1)} className="mt-6">Quay lại</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 text-gray-600 hover:text-primary">
          <ArrowLeft size={20} />
          Quay lại
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setIsEditModalOpen(true)} className="gap-2">
            <Edit2 size={18} />
            Sửa từ vựng
          </Button>
          <Button variant="ghost" onClick={handleDelete} className="gap-2 text-danger hover:bg-danger/10">
            <Trash2 size={18} />
            Xóa
          </Button>
        </div>
      </div>

      {/* Main Detail Card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Section */}
          <div className="bg-gray-50 flex items-center justify-center p-8 border-r border-gray-100">
            {currentWord?.imagePath ? (
              <img 
                src={`http://localhost:8080/uploads/${currentWord.imagePath}`} 
                alt={currentWord.word}
                className="w-full h-auto max-h-[400px] object-contain rounded-2xl shadow-2xl transition-transform hover:scale-105 duration-500"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-300">
                <ImageIcon size={120} strokeWidth={1} />
                <p className="mt-4 font-medium italic">Chưa có ảnh minh họa</p>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Tag size={16} className="text-primary" />
                  <Link 
                    to={`/topics/${currentWord?.topic?.id}`}
                    className="text-sm font-bold text-primary hover:underline uppercase tracking-widest"
                  >
                    {currentWord?.topic?.name}
                  </Link>
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">
                  {currentWord?.word}
                </h1>
                <div className="flex items-center gap-4 mt-4">
                  <span className="text-2xl font-mono text-primary/60">
                    {currentWord?.pronunciation || '/.../'}
                  </span>
                  <button className="p-2 bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-white transition-all shadow-sm">
                    <Volume2 size={24} />
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Ý nghĩa</h3>
                <p className="text-2xl font-bold text-gray-800 leading-relaxed bg-primary/5 p-4 rounded-2xl border-l-4 border-primary">
                  {currentWord?.meaning}
                </p>
              </div>

              <div className="pt-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Ví dụ</h3>
                <div className="relative">
                   <p className="text-lg text-gray-600 italic leading-relaxed pl-6 border-l-2 border-gray-200">
                    "{currentWord?.example}"
                  </p>
                </div>
              </div>
              
              <div className="pt-8 flex items-center gap-6 text-sm text-gray-400 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>Ngày thêm: {new Date(currentWord?.createdAt || '').toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen size={16} />
                  <span>Dành cho TOEIC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        title="Cập nhật từ vựng"
        size="lg"
      >
        <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Từ tiếng Anh"
              {...register('word', { required: 'Bắt buộc' })}
              error={errors.word?.message as string}
            />
            <Input 
              label="Ý nghĩa"
              {...register('meaning', { required: 'Bắt buộc' })}
              error={errors.meaning?.message as string}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Phiên âm"
              {...register('pronunciation')}
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Chủ đề</label>
              <select 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                {...register('topicId', { required: 'Bắt buộc' })}
              >
                {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>

          <Input 
            label="Câu ví dụ"
            {...register('example', { 
              required: 'Bắt buộc',
              validate: (value, formValues) => 
                value.toLowerCase().includes(formValues.word.toLowerCase()) || 
                `Câu ví dụ phải chứa từ '${formValues.word}'`
            })}
            error={errors.example?.message as string}
          />

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Thay đổi ảnh minh họa</label>
            <input type="file" className="file-input" {...register('image')} />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default VocabularyDetailPage;
