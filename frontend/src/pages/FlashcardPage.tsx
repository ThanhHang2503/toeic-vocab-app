import { useEffect, useState } from 'react';
import { useVocabStore } from '@/features/vocabulary/stores/vocabStore';
import { useTopicStore } from '@/features/topics/stores/topicStore';
import { Button } from '@/shared/components/Button';
import { BookOpen, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

const FlashcardPage = () => {
  const { words, fetchWords, isLoading } = useVocabStore();
  const { topics, fetchTopics } = useTopicStore();
  const [, setSelectedTopic] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const startSession = (topicId: number) => {
    setSelectedTopic(topicId);
    fetchWords(topicId);
    setIsSessionActive(true);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const nextCard = () => {
    if (currentIndex < words.length - 1) {
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

  const currentWord = words[currentIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => setIsSessionActive(false)}>
          &larr; Quay lại
        </Button>
        <div className="text-sm font-bold text-gray-400">
          {currentIndex + 1} / {words.length}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <RefreshCw className="animate-spin text-primary" size={48} />
        </div>
      ) : words.length === 0 ? (
        <div className="card h-96 flex flex-col items-center justify-center">
          <p className="text-gray-500">Chủ đề này chưa có từ vựng nào.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Flashcard Container */}
          <div 
            className="group perspective h-96 w-full cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className={cn(
              "relative h-full w-full preserve-3d transition-all duration-500 ease-in-out shadow-2xl rounded-3xl",
              isFlipped ? "rotate-y-180" : ""
            )}>
              {/* Front Side */}
              <div className="absolute inset-0 backface-hidden bg-white rounded-3xl p-10 flex flex-col items-center justify-center text-center border-4 border-primary/5">
                {currentWord.imagePath && (
                  <img 
                    src={`http://localhost:8080/uploads/${currentWord.imagePath}`} 
                    alt={currentWord.word}
                    className="w-48 h-48 object-cover rounded-2xl mb-6 shadow-sm"
                  />
                )}
                <h2 className="text-5xl font-black text-gray-900">{currentWord.word}</h2>
                {currentWord.pronunciation && (
                  <p className="mt-4 text-xl text-gray-400 font-mono italic">{currentWord.pronunciation}</p>
                )}
                <p className="mt-8 text-sm font-bold text-primary uppercase tracking-widest animate-pulse">Nhấp để lật thẻ</p>
              </div>

              {/* Back Side */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-primary/5 rounded-3xl p-10 flex flex-col items-center justify-center text-center border-4 border-primary/20">
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Ý nghĩa</p>
                    <h2 className="text-4xl font-bold text-gray-900">{currentWord.meaning}</h2>
                  </div>
                  <div className="max-w-md">
                    <p className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Ví dụ</p>
                    <p className="text-xl text-gray-700 italic leading-relaxed">
                      "{currentWord.example}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6">
            <Button 
              variant="outline" 
              className="rounded-full w-14 h-14 p-0"
              onClick={prevCard}
              disabled={currentIndex === 0}
            >
              <ChevronLeft size={28} />
            </Button>
            <div className="flex gap-4">
              <Button 
                variant="secondary" 
                className="px-8 py-4 rounded-2xl h-auto font-bold text-lg"
                onClick={nextCard}
              >
                Chưa nhớ
              </Button>
              <Button 
                className="px-8 py-4 rounded-2xl h-auto font-bold text-lg shadow-xl shadow-primary/30"
                onClick={nextCard}
              >
                Đã nhớ!
              </Button>
            </div>
            <Button 
              variant="outline" 
              className="rounded-full w-14 h-14 p-0"
              onClick={nextCard}
              disabled={currentIndex === words.length - 1}
            >
              <ChevronRight size={28} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardPage;
