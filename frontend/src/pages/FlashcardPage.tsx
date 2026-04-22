import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVocabStore } from '@/features/vocabulary/stores/vocabStore';
import { useTopicStore } from '@/features/topics/stores/topicStore';
import { Button } from '@/shared/components/Button';
import { Modal } from '@/shared/components/Modal';
import { BookOpen, RefreshCw, ChevronLeft, ChevronRight, CheckCircle, XCircle, RotateCcw, Settings, Trash2, PartyPopper } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import toast from 'react-hot-toast';

type TabType = 'all' | 'unknown' | 'known';

const FlashcardPage = () => {
  const navigate = useNavigate();
  const { words, fetchWords, isLoading, updateWordStatus, deleteWord } = useVocabStore();
  const { topics, fetchTopics } = useTopicStore();
  
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  // Derived state based on selected tab
  const studyList = useMemo(() => {
    if (activeTab === 'known') return words.filter(w => w.status === 'known');
    if (activeTab === 'unknown') return words.filter(w => w.status !== 'known');
    return words; // all
  }, [words, activeTab]);

  // Handle out of bounds if list shrinks
  useEffect(() => {
    if (studyList.length > 0 && currentIndex >= studyList.length) {
      setCurrentIndex(Math.max(0, studyList.length - 1));
    }
  }, [studyList.length, currentIndex]);

  const startSession = (topicId: number) => {
    setSelectedTopic(topicId);
    fetchWords(topicId);
    setIsSessionActive(true);
    setCurrentIndex(0);
    setIsFlipped(false);
    setActiveTab('all');
  };

  const nextCard = () => {
    if (currentIndex < studyList.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev - 1), 150);
    }
  };

  const handleEvaluate = async (status: 'known' | 'unknown') => {
    const currentWord = studyList[currentIndex];
    if (!currentWord || !currentWord.id) return;

    if (currentWord.status === status || (status === 'unknown' && !currentWord.status)) {
      toast('Từ này đã nằm trong danh sách', { icon: 'ℹ️' });
      nextCard();
      return;
    }

    await updateWordStatus(currentWord.id, status);
    
    // Auto next card if not at end, or if item is removed from current tab
    if (currentIndex < studyList.length - 1 || activeTab !== 'all') {
      setIsFlipped(false);
      // Wait a bit to let user see the flip/toast before changing list
      setTimeout(() => {
        // if active tab is specific, it will remove the item, so index doesn't need to advance unless it's not removed
        if (activeTab === 'all') {
          setCurrentIndex(prev => prev + 1);
        }
      }, 150);
    }
  };

  const handleDeleteWord = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa từ vựng này?')) {
      await deleteWord(id);
    }
  };

  if (!isSessionActive) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 text-center py-10">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Học Flashcards</h1>
          <p className="text-gray-500 mt-2 text-lg">Chọn một chủ đề để bắt đầu luyện tập ghi nhớ</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => topic.id && startSession(topic.id)}
              className="card group hover:border-primary hover:shadow-lg transition-all text-left"
            >
              <div className="bg-primary/10 p-3 rounded-xl text-primary w-fit mb-4 group-hover:scale-110 transition-transform">
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{topic.name}</h3>
              <p className="text-gray-500 text-sm mt-1">{topic.vocabCount || 0} từ vựng</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const currentWord = studyList[currentIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button variant="outline" size="sm" onClick={() => setIsSessionActive(false)}>
          &larr; Quay lại
        </Button>
        
        {/* Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl w-full sm:w-auto">
          <button 
            className={cn("flex-1 sm:px-6 py-2 rounded-lg text-sm font-bold transition-all", activeTab === 'all' ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700")}
            onClick={() => { setActiveTab('all'); setCurrentIndex(0); setIsFlipped(false); }}
          >
            Tất cả ({words.length})
          </button>
          <button 
            className={cn("flex-1 sm:px-6 py-2 rounded-lg text-sm font-bold transition-all", activeTab === 'unknown' ? "bg-white text-red-600 shadow-sm" : "text-gray-500 hover:text-gray-700")}
            onClick={() => { setActiveTab('unknown'); setCurrentIndex(0); setIsFlipped(false); }}
          >
            Chưa nhớ ({words.filter(w => w.status !== 'known').length})
          </button>
          <button 
            className={cn("flex-1 sm:px-6 py-2 rounded-lg text-sm font-bold transition-all", activeTab === 'known' ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500 hover:text-gray-700")}
            onClick={() => { setActiveTab('known'); setCurrentIndex(0); setIsFlipped(false); }}
          >
            Đã nhớ ({words.filter(w => w.status === 'known').length})
          </button>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          onClick={() => setIsManageModalOpen(true)}
        >
          <Settings size={16} />
          Quản lý từ vựng
        </Button>
      </div>

      <div className="flex items-center justify-center">
        {studyList.length > 0 && (
          <div className="text-sm font-bold text-gray-400 bg-gray-100 px-4 py-1 rounded-full">
            {currentIndex + 1} / {studyList.length}
          </div>
        )}
      </div>

      {isLoading && studyList.length === 0 ? (
        <div className="flex items-center justify-center h-96">
          <RefreshCw className="animate-spin text-primary" size={48} />
        </div>
      ) : studyList.length === 0 ? (
        <div className="card h-96 flex flex-col items-center justify-center text-center space-y-4">
          <div className="bg-primary/10 p-6 rounded-full text-primary mb-2">
            {activeTab === 'all' && <PartyPopper size={48} />}
            {activeTab === 'unknown' && <CheckCircle size={48} />}
            {activeTab === 'known' && <BookOpen size={48} />}
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {activeTab === 'all' && 'Không còn từ để học 🎉'}
            {activeTab === 'unknown' && 'Bạn đã học hết từ chưa nhớ!'}
            {activeTab === 'known' && 'Chưa có từ nào được đánh dấu đã nhớ'}
          </h3>
          <p className="text-gray-500">
            {activeTab === 'unknown' && 'Hãy kiểm tra lại danh sách đã nhớ để ôn tập nhé.'}
            {activeTab === 'known' && 'Hãy bắt đầu học để đánh dấu các từ bạn đã nhớ.'}
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Flashcard Container */}
          <div 
            className="group perspective h-96 w-full cursor-pointer max-w-2xl mx-auto"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className={cn(
              "relative h-full w-full preserve-3d transition-all duration-500 ease-in-out shadow-2xl rounded-3xl",
              isFlipped ? "rotate-y-180" : ""
            )}>
              {/* Front Side */}
              <div className="absolute inset-0 backface-hidden bg-white rounded-3xl p-10 flex flex-col items-center justify-center text-center border-4 border-primary/5">
                {currentWord?.imagePath && (
                  <img 
                    src={`http://localhost:8080/uploads/${currentWord.imagePath}`} 
                    alt={currentWord?.word}
                    className="w-48 h-48 object-cover rounded-2xl mb-6 shadow-sm"
                  />
                )}
                <h2 className="text-5xl font-black text-gray-900">{currentWord?.word}</h2>
                {currentWord?.pronunciation && (
                  <p className="mt-4 text-xl text-gray-400 font-mono italic">{currentWord?.pronunciation}</p>
                )}
                <p className="mt-8 text-sm font-bold text-primary uppercase tracking-widest animate-pulse">Nhấp để lật thẻ</p>
              </div>

              {/* Back Side */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-primary/5 rounded-3xl p-10 flex flex-col items-center justify-center text-center border-4 border-primary/20">
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Ý nghĩa</p>
                    <h2 className="text-4xl font-bold text-gray-900">{currentWord?.meaning}</h2>
                  </div>
                    <div className="max-w-md">
                      <p className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Ví dụ</p>
                      <p className="text-xl text-gray-700 italic leading-relaxed">
                        "{currentWord?.example}"
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mt-8 gap-2 border-primary/20 hover:bg-primary hover:text-white transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/vocabulary/${currentWord?.id}`);
                    }}
                  >
                    Xem chi tiết
                  </Button>
                </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6">
            <Button 
              variant="outline" 
              className="rounded-full w-14 h-14 p-0"
              onClick={prevCard}
              disabled={currentIndex === 0 || isLoading}
            >
              <ChevronLeft size={28} />
            </Button>
            <div className="flex gap-4">
              <Button 
                variant="secondary" 
                className="px-8 py-4 rounded-2xl h-auto font-bold text-lg bg-red-100 text-red-600 hover:bg-red-200"
                onClick={() => handleEvaluate('unknown')}
                disabled={isLoading}
              >
                Chưa nhớ
              </Button>
              <Button 
                className="px-8 py-4 rounded-2xl h-auto font-bold text-lg bg-emerald-500 hover:bg-emerald-600 shadow-xl shadow-emerald-500/30"
                onClick={() => handleEvaluate('known')}
                disabled={isLoading}
              >
                Đã nhớ!
              </Button>
            </div>
            <Button 
              variant="outline" 
              className="rounded-full w-14 h-14 p-0"
              onClick={nextCard}
              disabled={currentIndex === studyList.length - 1 || isLoading}
            >
              <ChevronRight size={28} />
            </Button>
          </div>
        </div>
      )}

      {/* Management Modal */}
      <Modal 
        isOpen={isManageModalOpen} 
        onClose={() => setIsManageModalOpen(false)}
        title="Quản lý từ vựng"
        size="lg"
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {words.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Chưa có từ vựng nào trong chủ đề này.</p>
          ) : (
            words.map(w => (
              <div key={w.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-primary/30 transition-all">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-lg">{w.word}</h4>
                  <p className="text-sm text-gray-500">{w.meaning}</p>
                </div>
                <div className="flex items-center gap-3">
                  <select 
                    className={cn(
                      "text-sm font-bold rounded-lg px-3 py-2 border-2 outline-none transition-colors",
                      w.status === 'known' ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"
                    )}
                    value={w.status === 'known' ? 'known' : 'unknown'}
                    onChange={(e) => w.id && updateWordStatus(w.id, e.target.value as 'known' | 'unknown')}
                    disabled={isLoading}
                  >
                    <option value="unknown">Chưa nhớ</option>
                    <option value="known">Đã nhớ</option>
                  </select>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 hover:bg-red-50 hover:text-red-700 p-2 h-auto"
                    onClick={() => w.id && handleDeleteWord(w.id)}
                    disabled={isLoading}
                  >
                    <Trash2 size={20} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
};

export default FlashcardPage;
