import { useEffect, useState } from 'react';
import { Button } from '@/shared/components/Button';
import { AlertCircle, Trash2, RefreshCw, CreditCard, Trophy } from 'lucide-react';
import axiosInstance from '@/shared/lib/axios';
import toast from 'react-hot-toast';


interface Mistake {
  id: number;
  word: {
    id: number;
    word: string;
    meaning: string;
    example: string;
    topic: { name: string };
  };
  wrongAnswer: string;
  createdAt: string;
}

const MistakesPage = () => {
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMistakes = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/mistakes');
      setMistakes(response.data);
    } catch (err) {
      toast.error('Không thể tải lịch sử lỗi sai');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMistakes();
  }, []);

  const deleteMistake = async (id: number) => {
    try {
      await axiosInstance.delete(`/mistakes/${id}`);
      setMistakes(prev => prev.filter(m => m.id !== id));
      toast.success('Đã xóa lưu ý');
    } catch (err) {
      toast.error('Lỗi khi xóa');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <AlertCircle className="text-danger" size={32} />
            Lịch sử lỗi sai
          </h1>
          <p className="text-gray-500 mt-1">Ôn tập lại những từ bạn thường xuyên nhầm lẫn</p>
        </div>
        {mistakes.length > 0 && (
          <Button className="gap-2 bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200">
            <CreditCard size={18} />
            Ôn tập ngay ({mistakes.length})
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <RefreshCw className="animate-spin mb-2" />
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : mistakes.length === 0 ? (
        <div className="card h-64 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mb-4">
            <Trophy size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Tuyệt vời!</h3>
          <p className="text-gray-500 mt-1">Bạn chưa có lỗi sai nào được ghi lại.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {mistakes.map((mistake) => (
            <div key={mistake.id} className="card group hover:border-danger/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="bg-danger/10 p-2 rounded-lg text-danger mt-1">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-black text-gray-900 uppercase">{mistake.word.word}</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-500 font-bold uppercase">
                      {mistake.word.topic.name}
                    </span>
                  </div>
                  <p className="text-gray-600">Ý nghĩa: <span className="font-semibold">{mistake.word.meaning}</span></p>
                  <p className="text-sm text-gray-400 mt-1 italic">"{mistake.word.example}"</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl md:w-80">
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Đáp án sai</p>
                  <p className="text-danger font-bold line-through">{mistake.wrongAnswer || '(Để trống)'}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => deleteMistake(mistake.id)}
                    className="text-gray-400 hover:text-danger hover:bg-danger/10"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MistakesPage;
