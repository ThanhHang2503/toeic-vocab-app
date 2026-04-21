import { useEffect, useState } from 'react';
import { useVocabStore } from '@/features/vocabulary/stores/vocabStore';
import { useTopicStore } from '@/features/topics/stores/topicStore';
import { Button } from '@/shared/components/Button';
import { Plus, Trash2, Search, Filter, Image as ImageIcon } from 'lucide-react';
import { Modal } from '@/shared/components/Modal';
import { Input } from '@/shared/components/Input';
import { useForm } from 'react-hook-form';

const VocabularyPage = () => {
  const { words, isLoading, fetchWords, addWord, deleteWord } = useVocabStore();
  const { topics, fetchTopics } = useTopicStore();
  const [selectedTopic, setSelectedTopic] = useState<number | undefined>(undefined);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchTopics();
    fetchWords(selectedTopic);
  }, [fetchTopics, fetchWords, selectedTopic]);

  const onAddSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append('word', data.word);
    formData.append('meaning', data.meaning);
    formData.append('example', data.example);
    formData.append('topicId', data.topicId);
    if (data.pronunciation) formData.append('pronunciation', data.pronunciation);
    if (data.image[0]) formData.append('image', data.image[0]);

    await addWord(formData);
    setIsAddModalOpen(false);
    reset();
  };

  const filteredWords = words.filter(w => 
    w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.meaning.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Từ vựng</h1>
          <p className="text-gray-500 mt-1">Trau dồi vốn từ của bạn mỗi ngày</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 shadow-lg shadow-primary/20">
          <Plus size={18} />
          Thêm từ mới
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
            placeholder="Tìm kiếm từ vựng hoặc ý nghĩa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 px-3 bg-gray-50 rounded-xl">
          <Filter size={18} className="text-gray-400" />
          <select 
            className="bg-transparent border-none py-2 focus:ring-0 outline-none text-sm font-medium"
            value={selectedTopic || ''}
            onChange={(e) => setSelectedTopic(e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">Tất cả chủ đề</option>
            {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      </div>

      {/* Vocabulary Table */}
      <div className="card overflow-hidden p-0 border-none shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Từ vựng</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Phiên âm</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ý nghĩa</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ví dụ</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-4"><div className="h-10 bg-gray-50 rounded-lg w-full" /></td>
                  </tr>
                ))
              ) : filteredWords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    Không tìm thấy từ vựng nào
                  </td>
                </tr>
              ) : (
                filteredWords.map((word) => (
                  <tr key={word.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {word.imagePath ? (
                          <img 
                            src={`http://localhost:8080/uploads/${word.imagePath}`} 
                            alt={word.word}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                            <ImageIcon size={18} />
                          </div>
                        )}
                        <span className="font-bold text-gray-900">{word.word}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">{word.pronunciation || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm font-medium">
                        {word.meaning}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{word.example}</td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => word.id && deleteWord(word.id)}
                        className="text-gray-400 hover:text-danger hover:bg-danger/10"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Word Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        title="Thêm từ vựng mới"
        size="lg"
      >
        <form onSubmit={handleSubmit(onAddSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Từ tiếng Anh"
              placeholder="Ví dụ: Opportunity"
              {...register('word', { required: 'Bắt buộc' })}
              error={errors.word?.message as string}
            />
            <Input 
              label="Ý nghĩa"
              placeholder="Ví dụ: Cơ hội"
              {...register('meaning', { required: 'Bắt buộc' })}
              error={errors.meaning?.message as string}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Phiên âm"
              placeholder="Ví dụ: /ˌɒpərˈtunɪti/"
              {...register('pronunciation')}
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Chủ đề</label>
              <select 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                {...register('topicId', { required: 'Bắt buộc' })}
              >
                <option value="">Chọn chủ đề...</option>
                {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              {errors.topicId && <p className="text-xs text-danger">Vui lòng chọn chủ đề</p>}
            </div>
          </div>

          <Input 
            label="Câu ví dụ"
            placeholder="Viết một câu ví dụ chứa từ vựng trên"
            {...register('example', { required: 'Bắt buộc' })}
            error={errors.example?.message as string}
          />

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Ảnh minh họa</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 font-semibold italic">Nhấp để tải ảnh lên</p>
                </div>
                <input type="file" className="hidden" {...register('image')} />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Lưu từ vựng
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default VocabularyPage;
