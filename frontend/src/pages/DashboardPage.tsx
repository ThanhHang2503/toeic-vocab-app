import { useEffect } from 'react';
import { useTopicStore } from '@/features/topics/stores/topicStore';
import { useVocabStore } from '@/features/vocabulary/stores/vocabStore';
import { Button } from '@/shared/components/Button';
import { BookOpen, Languages, Plus, CreditCard, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/shared/utils/cn';

const DashboardPage = () => {
  const { topics, fetchTopics } = useTopicStore();
  const { words, fetchWords } = useVocabStore();

  useEffect(() => {
    fetchTopics();
    fetchWords();
  }, [fetchTopics, fetchWords]);

  const stats = [
    {
      label: 'Chủ đề',
      value: topics.length,
      icon: BookOpen,
      color: 'bg-blue-500',
      description: 'Tổng số chủ đề bạn đã tạo'
    },
    {
      label: 'Từ vựng',
      value: words.length,
      icon: Languages,
      color: 'bg-green-500',
      description: 'Tổng số từ vựng trong hệ thống'
    },
    {
      label: 'Tiến độ',
      value: '',
      icon: Trophy,
      color: 'bg-purple-500',
      description: 'Hoàn thành các bài kiểm tra'
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chào mừng trở lại! 👋</h1>
          <p className="text-gray-500 mt-1">Hôm nay bạn muốn học gì nào?</p>
        </div>
        <div className="flex gap-3">
          <Link to="/flashcard">
            <Button className="gap-2">
              <CreditCard size={18} />
              Học Flashcards
            </Button>
          </Link>
          <Link to="/test">
            <Button variant="secondary" className="gap-2">
              <Trophy size={18} />
              Làm bài test
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="card group hover:border-primary/50 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-4xl font-bold text-gray-900 mt-2">{stat.value}</h3>
              </div>
              <div className={cn('p-3 rounded-xl text-white shadow-lg', stat.color)}>
                <stat.icon size={24} />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4 flex items-center gap-1">
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      {/* Progress Section Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-bold mb-4">Tiến độ học tập</h2>
          <div className="h-64 flex flex-col items-center justify-center text-gray-400">
            <Trophy size={48} className="mb-2 opacity-20" />
            <p>Biểu đồ tiến độ sẽ xuất hiện ở đây khi bạn có dữ liệu test</p>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-bold mb-4">Hành động nhanh</h2>
          <div className="space-y-3">
            <Link to="/vocabulary" className="block p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-all">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                  <Plus size={20} />
                </div>
                <div>
                  <p className="font-bold">Thêm từ vựng mới</p>
                  <p className="text-sm text-gray-500">Mở rộng vốn từ vựng của bạn ngay</p>
                </div>
              </div>
            </Link>
            <Link to="/topics" className="block p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-all">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-2 rounded-lg text-green-600">
                  <BookOpen size={20} />
                </div>
                <div>
                  <p className="font-bold">Khám phá chủ đề</p>
                  <p className="text-sm text-gray-500">Xem lại các chủ đề bạn đã tạo</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
