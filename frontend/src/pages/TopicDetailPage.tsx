import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useVocabStore } from '@/features/vocabulary/stores/vocabStore';
import { useTopicStore } from '@/features/topics/stores/topicStore';
import { Button } from '@/shared/components/Button';
import { Plus, Trash2, Search, Image as ImageIcon, ArrowLeft, Edit2, Settings, AlertCircle } from 'lucide-react';
import { Modal } from '@/shared/components/Modal';
import { Input } from '@/shared/components/Input';
import { ImageUpload } from '@/shared/components/ImageUpload';
import { useForm } from 'react-hook-form';
import type { Vocabulary } from '@/features/vocabulary/types/vocabulary.types';
import type { CreateTopicDto } from '@/features/topics/types/topic.types';

const TopicDetailPage = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const tId = Number(topicId);

  const { words, isLoading: isVocabLoading, fetchWords, addWord, updateWord, deleteWord } = useVocabStore();
  const { topics, isLoading: isTopicLoading, fetchTopics, updateTopic, deleteTopic } = useTopicStore();
  
  const [isWordModalOpen, setIsWordModalOpen] = useState(false);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<Vocabulary | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const currentTopic = topics.find(t => t.id === tId);

  const wordForm = useForm();
  const topicForm = useForm<CreateTopicDto>();

  useEffect(() => {
    fetchTopics();
    fetchWords(tId);
  }, [fetchTopics, fetchWords, tId]);

  // Sync topic form values
  useEffect(() => {
    if (currentTopic) {
      topicForm.setValue('name', currentTopic.name);
      topicForm.setValue('description', currentTopic.description);
    }
  }, [currentTopic, topicForm]);

  const onWordSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append('word', data.word);
    formData.append('meaning', data.meaning);
    formData.append('example', data.example);
    formData.append('topicId', String(tId));
    if (data.pronunciation) formData.append('pronunciation', data.pronunciation);
    if (data.image && data.image[0]) formData.append('image', data.image[0]);

    if (editingWord) {
      await updateWord(editingWord.id, formData);
    } else {
      await addWord(formData);
    }
    
    // Refresh topics to update vocabCount in the store/UI
    fetchTopics();
    
    setIsWordModalOpen(false);
    setEditingWord(null);
    wordForm.reset();
  };

  const onTopicSubmit = async (data: CreateTopicDto) => {
    await updateTopic(tId, data);
    setIsTopicModalOpen(false);
  };

  const handleDeleteTopic = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chủ đề này? Tất cả từ vựng bên trong cũng sẽ bị xóa.')) {
      await deleteTopic(tId);
      navigate('/topics');
    }
  };

  const handleEditWord = (word: Vocabulary) => {
    setEditingWord(word);
    setIsWordModalOpen(true);
    wordForm.setValue('word', word.word);
    wordForm.setValue('meaning', word.meaning);
    wordForm.setValue('example', word.example);
    wordForm.setValue('pronunciation', word.pronunciation);
  };

  const filteredWords = words.filter(w => 
    w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.meaning.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isTopicLoading && !currentTopic) {
    return <div className="flex items-center justify-center h-64 text-gray-500">Đang tải chủ đề...</div>;
  }

  if (!currentTopic && !isTopicLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <AlertCircle size={48} className="text-danger mb-4" />
        <h2 className="text-2xl font-bold">Không tìm thấy chủ đề</h2>
        <Button onClick={() => navigate('/topics')} className="mt-4">Quay lại danh sách</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/topics')} className="mt-1">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">{currentTopic?.name}</h1>
            <p className="text-gray-500 mt-2 text-lg">{currentTopic?.description || 'Danh sách từ vựng thuộc chủ đề này'}</p>
            <div className="flex items-center gap-2 mt-4">
               <span className="badge badge-primary">{words.length} từ vựng</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setIsWordModalOpen(true)} className="gap-2 shadow-lg shadow-primary/20">
            <Plus size={18} />
            Thêm từ vựng
          </Button>
          <Button variant="outline" onClick={() => setIsTopicModalOpen(true)} className="gap-2">
            <Settings size={18} />
            Chỉnh sửa
          </Button>
          <Button variant="ghost" onClick={handleDeleteTopic} className="gap-2 text-danger hover:bg-danger/10">
            <Trash2 size={18} />
            Xóa chủ đề
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          placeholder="Tìm kiếm từ vựng trong chủ đề này..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Vocabulary List */}
      <div className="space-y-4">
        {isVocabLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="card h-40 animate-pulse bg-gray-50" />)}
          </div>
        ) : filteredWords.length === 0 ? (
          <div className="card border-dashed border-2 py-20 flex flex-col items-center justify-center text-center">
            <div className="bg-gray-50 p-6 rounded-full mb-6">
              <ImageIcon size={48} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Chủ đề này chưa có từ vựng nào</h3>
            <p className="text-gray-500 mt-2 max-w-xs">Hãy thêm từ vựng đầu tiên để bắt đầu hành trình chinh phục TOEIC của bạn!</p>
            <Button onClick={() => setIsWordModalOpen(true)} className="mt-8 gap-2">
              <Plus size={18} />
              Thêm từ vựng ngay
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredWords.map((word) => (
              <div key={word.id} className="card group hover:shadow-xl hover:-translate-y-1 transition-all border-none bg-white shadow-sm ring-1 ring-gray-100">
                <div className="flex gap-4">
                  {word.imagePath ? (
                    <img 
                      src={`http://localhost:8080/uploads/${word.imagePath}`} 
                      alt={word.word}
                      className="w-20 h-20 rounded-xl object-cover shadow-sm"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300">
                      <ImageIcon size={24} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <Link to={`/vocabulary/${word.id}`}>
                        <h4 className="text-xl font-black text-gray-900 truncate hover:text-primary transition-colors cursor-pointer">
                          {word.word}
                        </h4>
                      </Link>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" onClick={() => handleEditWord(word)} className="p-1 h-8 w-8 text-gray-400 hover:text-primary">
                          <Edit2 size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => word.id && deleteWord(word.id).then(fetchTopics)} className="p-1 h-8 w-8 text-gray-400 hover:text-danger">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm font-mono text-primary/70 mt-0.5">{word.pronunciation || '/.../'}</p>
                    <p className="text-gray-900 font-bold mt-2 truncate bg-primary/5 inline-block px-2 py-0.5 rounded text-sm">
                      {word.meaning}
                    </p>
                    <Link 
                      to={`/vocabulary/${word.id}`}
                      className="text-primary text-xs font-bold mt-3 flex items-center gap-1 hover:underline group-hover:translate-x-1 transition-all"
                    >
                      Chi tiết &rarr;
                    </Link>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-gray-50/50 rounded-xl">
                  <p className="text-sm text-gray-600 italic line-clamp-2 leading-relaxed">
                    "{word.example}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Word Modal */}
      <Modal 
        isOpen={isWordModalOpen} 
        onClose={() => { setIsWordModalOpen(false); setEditingWord(null); wordForm.reset(); }}
        title={editingWord ? "Cập nhật từ vựng" : "Thêm từ vựng mới"}
        size="lg"
      >
        <form onSubmit={wordForm.handleSubmit(onWordSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Từ tiếng Anh"
              placeholder="Ví dụ: Opportunity"
              {...wordForm.register('word', { required: 'Bắt buộc' })}
              error={wordForm.formState.errors.word?.message as string}
            />
            <Input 
              label="Ý nghĩa"
              placeholder="Ví dụ: Cơ hội"
              {...wordForm.register('meaning', { required: 'Bắt buộc' })}
              error={wordForm.formState.errors.meaning?.message as string}
            />
          </div>
          
          <Input 
            label="Phiên âm"
            placeholder="Ví dụ: /ˌɒpərˈtunɪti/"
            {...wordForm.register('pronunciation')}
          />

          <Input 
            label="Câu ví dụ"
            placeholder="Viết một câu ví dụ chứa từ vựng trên"
            {...wordForm.register('example', { 
              required: 'Bắt buộc',
              validate: (value, formValues) => 
                value.toLowerCase().includes(formValues.word.toLowerCase()) || 
                `Câu ví dụ phải chứa từ '${formValues.word}'`
            })}
            error={wordForm.formState.errors.example?.message as string}
          />

          <ImageUpload 
            label="Ảnh minh họa (Không bắt buộc)"
            defaultPreview={editingWord?.imagePath ? `http://localhost:8080/uploads/${editingWord.imagePath}` : null}
            {...wordForm.register('image')} 
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => { setIsWordModalOpen(false); setEditingWord(null); wordForm.reset(); }}>
              Hủy
            </Button>
            <Button type="submit" isLoading={isVocabLoading}>
              {editingWord ? 'Cập nhật' : 'Lưu từ vựng'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Topic Modal */}
      <Modal 
        isOpen={isTopicModalOpen} 
        onClose={() => setIsTopicModalOpen(false)}
        title="Chỉnh sửa chủ đề"
      >
        <form onSubmit={topicForm.handleSubmit(onTopicSubmit)} className="space-y-4">
          <Input 
            label="Tên chủ đề"
            {...topicForm.register('name', { required: 'Bắt buộc' })}
            error={topicForm.formState.errors.name?.message}
          />
          <Input 
            label="Mô tả"
            {...topicForm.register('description')}
          />
          <div className="flex justify-end gap-3 mt-8">
            <Button type="button" variant="outline" onClick={() => setIsTopicModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" isLoading={isTopicLoading}>
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TopicDetailPage;
