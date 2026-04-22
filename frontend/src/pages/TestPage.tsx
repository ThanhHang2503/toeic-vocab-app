import { useEffect, useState } from 'react';
import { useTopicStore } from '@/features/topics/stores/topicStore';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { BookOpen, Trophy, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import toast from 'react-hot-toast';
import axiosInstance from '@/shared/lib/axios';

const QuestionType = {
  FILL_BLANK: 'FILL_BLANK',
  TRANSLATION: 'TRANSLATION'
} as const;

type QuestionType = typeof QuestionType[keyof typeof QuestionType];

interface Question {
  wordId: number;
  word: string;
  type: QuestionType;
  prompt: string;
  answer: string;
  fullExample: string;
}

const TestPage = () => {
  const { topics, fetchTopics } = useTopicStore();
  
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState<any[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const generateFillBlankQuestion = (word: string, example: string) => {
    const wordLower = word.toLowerCase();
    const exampleLower = example.toLowerCase();
    const firstIndex = exampleLower.indexOf(wordLower);
    
    if (firstIndex !== -1) {
      const before = example.substring(0, firstIndex);
      const after = example.substring(firstIndex + word.length);
      return `${before}______${after}`;
    }
    return example;
  };

  const generateQuestions = (vocabList: any[]) => {
    return vocabList.map((item, index) => {
      const type = index % 2 === 0 ? QuestionType.FILL_BLANK : QuestionType.TRANSLATION;
      
      let prompt = '';
      let answer = item.word; // Answer is the exact word from database

      if (type === QuestionType.FILL_BLANK) {
        prompt = generateFillBlankQuestion(item.word, item.example);
      } else {
        prompt = item.meaning;
      }

      return {
        wordId: item.id,
        word: item.word,
        type,
        prompt,
        answer,
        fullExample: item.example
      };
    }).sort(() => Math.random() - 0.5);
  };

  const startTest = async (topicId: number) => {
    try {
      const url = `/words/topic/${topicId}`;
      const response = await axiosInstance.get(url);
      const vocabList = response.data;

      if (vocabList.length === 0) {
        toast.error('Chủ đề này chưa có từ vựng nào để kiểm tra');
        return;
      }

      const generated = generateQuestions(vocabList);
      setQuestions(generated);
      setIsSessionActive(true);
      setCurrentIndex(0);
      setScore(0);
      setMistakes([]);
      setIsFinished(false);
      setUserAnswer('');
      setIsAnswered(false);
    } catch (err) {
      toast.error('Lỗi khi tải dữ liệu kiểm tra');
    }
  };

  const handleSubmit = async () => {
    if (!userAnswer.trim()) return;
    
    const current = questions[currentIndex];
    const isCorrect = userAnswer.toLowerCase().trim() === current.answer.toLowerCase().trim();

    setIsAnswered(true);

    if (isCorrect) {
      setScore(prev => prev + 1);
      toast.success('Chính xác!', { duration: 1000 });
    } else {
      toast.error('Sai rồi!', { duration: 1000 });
      
      // Check for duplicate mistakes in this session
      const isDuplicate = mistakes.some(m => m.wordId === current.wordId);
      
      const mistake = {
        wordId: current.wordId,
        wrongAnswer: userAnswer
      };
      
      if (!isDuplicate) {
        setMistakes(prev => [...prev, mistake]);
      }
      
      // Save mistake to backend
      try {
        await axiosInstance.post('/mistakes', mistake);
      } catch (e) {
        console.error('Failed to save mistake', e);
      }
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserAnswer('');
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  if (!isSessionActive) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 text-center py-10">
        <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="text-primary" size={48} />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Kiểm tra kiến thức</h1>
          <p className="text-gray-500 mt-2 text-lg">Chọn một chủ đề để bắt đầu bài kiểm tra 15 phút</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => topic.id && startTest(topic.id)}
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

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto text-center space-y-8 py-10 animate-in zoom-in duration-500">
        <div className="relative inline-block">
          <div className="w-48 h-48 rounded-full border-8 border-gray-100 flex items-center justify-center">
            <span className="text-5xl font-black text-primary">{percentage}%</span>
          </div>
          <Trophy className="absolute -top-2 -right-2 text-warning animate-bounce" size={48} />
        </div>

        <div>
          <h2 className="text-3xl font-bold text-gray-900">Hoàn thành bài kiểm tra!</h2>
          <p className="text-gray-500 mt-2 text-lg">
            Bạn đã trả lời đúng <span className="font-bold text-primary">{score}/{questions.length}</span> câu hỏi.
          </p>
        </div>

        {mistakes.length > 0 && (
          <div className="card text-left bg-danger/5 border-danger/20">
            <h3 className="font-bold text-danger flex items-center gap-2 mb-4">
              <AlertCircle size={20} />
              Các từ cần lưu ý ({mistakes.length})
            </h3>
            <div className="space-y-2">
              {mistakes.map((m, idx) => {
                const question = questions.find(q => q.wordId === m.wordId);
                return (
                  <div key={idx} className="flex items-center justify-between text-sm p-2 bg-white rounded-lg border border-danger/10">
                    <span className="font-bold">{question?.word}</span>
                    <span className="text-gray-500">Bạn đã nhập: <del className="text-danger">{m.wrongAnswer || '(Để trống)'}</del></span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => setIsSessionActive(false)}>Quay lại</Button>
          <Button onClick={() => startTest(topics[0].id || 0)}>Làm bài test khác</Button>
        </div>
      </div>
    );
  }

  const current = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-2 w-48 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500" 
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
          <span className="text-sm font-bold text-gray-400">{currentIndex + 1} / {questions.length}</span>
        </div>
        <div className="flex items-center gap-2 text-success font-bold">
          <CheckCircle2 size={18} />
          {score}
        </div>
      </div>

      <div className="card min-h-[400px] flex flex-col justify-between">
        <div className="space-y-6">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
            {current.type === QuestionType.FILL_BLANK ? 'Điền vào chỗ trống' : 'Dịch nghĩa'}
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 leading-relaxed">
              {current.prompt}
            </h2>
            {isAnswered && current.type === QuestionType.FILL_BLANK && (
              <p className="text-gray-500 italic">"{current.fullExample}"</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
           {!isAnswered ? (
             <div className="space-y-4">
               <Input 
                 placeholder="Nhập đáp án của bạn..."
                 value={userAnswer}
                 onChange={(e) => setUserAnswer(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                 autoFocus
               />
               <Button className="w-full h-12 text-lg font-bold" onClick={handleSubmit}>
                 <Send size={18} className="mr-2" />
                 Kiểm tra
               </Button>
             </div>
           ) : (
             <div className={cn(
               "p-6 rounded-2xl animate-in zoom-in duration-300",
               userAnswer.toLowerCase().trim() === current.answer.toLowerCase().trim() 
                 ? "bg-success/10 border-2 border-success/20" 
                 : "bg-danger/10 border-2 border-danger/20"
             )}>
               <div className="flex items-start justify-between mb-2">
                 <div className="flex flex-col">
                   <p className={cn(
                     "text-lg font-bold uppercase tracking-wider",
                     userAnswer.toLowerCase().trim() === current.answer.toLowerCase().trim() ? "text-success" : "text-danger"
                   )}>
                     {userAnswer.toLowerCase().trim() === current.answer.toLowerCase().trim() ? '✅ Đúng!' : '❌ Sai!'}
                   </p>
                   <p className="text-sm opacity-70 mt-1">
                     {userAnswer.toLowerCase().trim() === current.answer.toLowerCase().trim() ? 'Bạn đã trả lời đúng' : 'Hãy cố gắng ở câu tiếp theo'}
                   </p>
                 </div>
                 {userAnswer.toLowerCase().trim() !== current.answer.toLowerCase().trim() && (
                   <div className="text-right">
                     <span className="text-xs font-medium block opacity-50">Bạn đã nhập:</span>
                     <span className="text-sm font-bold text-danger line-through">{userAnswer || '(Trống)'}</span>
                   </div>
                 )}
               </div>
               <div className="mt-4 p-4 bg-white/50 rounded-xl">
                 <p className="text-xs font-bold text-gray-400 uppercase mb-1">Đáp án đúng là:</p>
                 <p className="text-3xl font-black text-primary">{current.answer}</p>
               </div>
               <Button className="w-full mt-6 h-12 text-lg font-bold" onClick={nextQuestion}>
                 Câu tiếp theo &rarr;
               </Button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default TestPage;
