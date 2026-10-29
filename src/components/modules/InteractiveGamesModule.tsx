import React, { useState, useEffect, useRef } from 'react';
import {
  Gamepad2,
  Trophy,
  RotateCcw,
  Sparkles,
  Timer,
  Award,
  Users,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Play,
  Settings,
  Shuffle,
  Volume2,
  Lock,
  Unlock,
  Flame,
  Star
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuestionItem, Student } from '../../types';

interface InteractiveGamesModuleProps {
  questions: QuestionItem[];
  students: Student[];
}

export const InteractiveGamesModule: React.FC<InteractiveGamesModuleProps> = ({
  questions,
  students,
}) => {
  const [activeGameId, setActiveGameId] = useState<'summit' | 'millionaire' | 'wheel' | 'match' | 'crossword' | 'arena'>('summit');

  const gamesList = [
    { id: 'summit', title: '1. Đường lên đỉnh tri thức', desc: 'Vượt qua 4 chặng: Khởi động, Chướng ngại vật, Tăng tốc, Về đích với điểm số nhân bội.', icon: Trophy, color: 'from-amber-500 to-yellow-600' },
    { id: 'millionaire', title: '2. Ai là triệu phú học đường', desc: '15 câu hỏi tăng dần độ khó, trợ giúp 50:50, gợi ý và giải thích chi tiết.', icon: Sparkles, color: 'from-indigo-600 to-blue-700' },
    { id: 'wheel', title: '3. Vòng quay may mắn', desc: 'Quay chọn học sinh lên bảng hoặc chọn ngẫu nhiên câu đố với vòng quay vật lý mượt mà.', icon: Shuffle, color: 'from-pink-500 to-rose-600' },
    { id: 'match', title: '4. Ghép đôi kiến thức', desc: 'Ghép cặp thuật ngữ - định nghĩa hoặc bài toán - nghiệm với đồng hồ bấm giờ.', icon: Flame, color: 'from-emerald-500 to-teal-600' },
    { id: 'crossword', title: '5. Ô chữ bí mật', desc: 'Mở các hàng ngang gợi ý để giải mã từ khóa trung tâm liên quan đến bài học.', icon: Lock, color: 'from-purple-600 to-indigo-600' },
    { id: 'arena', title: '6. Đấu trường trí tuệ', desc: 'Tham gia bằng mã phòng thi đua trực tiếp, tính điểm tốc độ và bảng xếp hạng thời gian thực.', icon: Users, color: 'from-rose-600 to-pink-700' },
  ];

  return (
    <div className="space-y-6">
      {/* Module Title Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-pink-600 dark:text-pink-400 uppercase tracking-wider mb-1">
            <Gamepad2 className="w-4 h-4" />
            <span>MODULE 5 • HỆ THỐNG TRÒ CHƠI HỌC TẬP TƯƠNG TÁC (CHƠI THẬT 100%)</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            6 Trò Chơi Giáo Dục Số Hóa Dành Cho THPT
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Đầy đủ màn hình: Hướng dẫn, Bắt đầu, Chơi trực tiếp, Kết quả và Chơi lại. Giáo viên dễ dàng tùy biến nội dung theo từng môn học.
          </p>
        </div>
      </div>

      {/* Game Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {gamesList.map((g) => {
          const Icon = g.icon;
          const isActive = activeGameId === g.id;
          return (
            <button
              key={g.id}
              onClick={() => setActiveGameId(g.id as any)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isActive
                  ? 'border-pink-500 bg-pink-50/60 dark:bg-pink-950/30 ring-2 ring-pink-500/30 shadow-md'
                  : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`p-2 rounded-xl text-white bg-gradient-to-tr ${g.color} shadow`}>
                  <Icon className="w-4 h-4" />
                </span>
                {isActive && <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />}
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">{g.title}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{g.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Game Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden min-h-[550px] p-6 sm:p-8">
        {activeGameId === 'summit' && <GameSummit questions={questions} />}
        {activeGameId === 'millionaire' && <GameMillionaire />}
        {activeGameId === 'wheel' && <GameLuckyWheel students={students} />}
        {activeGameId === 'match' && <GameKnowledgeMatch />}
        {activeGameId === 'crossword' && <GameCrossword />}
        {activeGameId === 'arena' && <GameIntellectArena students={students} />}
      </div>
    </div>
  );
};

// =========================================================================
// GAME 1: ĐƯỜNG LÊN ĐỈNH TRI THỨC (Road to Knowledge Summit)
// =========================================================================
function GameSummit({ questions }: { questions: QuestionItem[] }) {
  const stages = [
    { name: '1. Khởi động', multiplier: 10, timeLimit: 15 },
    { name: '2. Vượt chướng ngại vật', multiplier: 20, timeLimit: 20 },
    { name: '3. Tăng tốc', multiplier: 30, timeLimit: 25 },
    { name: '4. Về đích', multiplier: 40, timeLimit: 30 },
  ];

  const defaultSummitQuestions = [
    { stage: 0, q: 'Tọa độ đỉnh I của hàm số y = ax² + bx + c có hoành độ x bằng bao nhiêu?', options: ['x = -b / (2a)', 'x = b / (2a)', 'x = -Δ / (4a)', 'x = -c / a'], correct: 0, exp: 'Hoành độ đỉnh parabol là x = -b/(2a).' },
    { stage: 1, q: 'Bề lõm của đồ thị y = -3x² + 2x - 5 hướng về phía nào?', options: ['Hướng lên trên', 'Hướng xuống dưới', 'Hướng sang phải', 'Hướng sang trái'], correct: 1, exp: 'Vì hệ số a = -3 < 0 nên bề lõm quay xuống dưới.' },
    { stage: 2, q: 'Hàm số y = x² - 4x + 3 đạt giá trị nhỏ nhất tại x bằng bao nhiêu?', options: ['x = 1', 'x = 2', 'x = 3', 'x = 4'], correct: 1, exp: 'Với a = 1 > 0, hàm số đạt GTNN tại đỉnh x = -(-4)/2 = 2.' },
    { stage: 3, q: 'Quỹ đạo của một vật thể ném xiên trong không khí là đường gì?', options: ['Đường elip', 'Đường Parabol', 'Đường tròn', 'Đường thẳng xiên'], correct: 1, exp: 'Trong trọng trường đồng nhất, phương trình chuyển động ném xiên có dạng phương trình parabol bậc 2.' },
  ];

  const [gameState, setGameState] = useState<'guide' | 'playing' | 'result'>('guide');
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    let timer: any;
    if (gameState === 'playing' && !isAnswered && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && !isAnswered) {
      handleAnswer(-1); // Timeout
    }
    return () => clearInterval(timer);
  }, [gameState, isAnswered, timeLeft]);

  const startSummit = () => {
    setGameState('playing');
    setCurrentStageIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setTimeLeft(stages[0].timeLimit);
  };

  const handleAnswer = (optionIndex: number) => {
    if (isAnswered) return;
    setSelectedOption(optionIndex);
    setIsAnswered(true);

    const curQ = defaultSummitQuestions[currentStageIndex];
    if (optionIndex === curQ.correct) {
      const addedPoints = stages[currentStageIndex].multiplier;
      setScore(s => s + addedPoints);
    }
  };

  const nextStage = () => {
    if (currentStageIndex < stages.length - 1) {
      const nextIdx = currentStageIndex + 1;
      setCurrentStageIndex(nextIdx);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(stages[nextIdx].timeLimit);
    } else {
      setGameState('result');
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  if (gameState === 'guide') {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6 py-8">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
          <Trophy className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Đường Lên Đỉnh Tri Thức</h2>
          <p className="text-sm text-slate-500 mt-2">
            Thử thách vượt 4 chặng: <b>Khởi động</b> (10đ) ➔ <b>Chướng ngại vật</b> (20đ) ➔ <b>Tăng tốc</b> (30đ) ➔ <b>Về đích</b> (40đ).
            Mỗi chặng có đồng hồ đếm ngược và câu hỏi then chốt.
          </p>
        </div>
        <button
          onClick={startSummit}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 text-white font-extrabold text-sm shadow-xl shadow-amber-500/25 flex items-center gap-2 mx-auto cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>BẮT ĐẦU CHINH PHỤC ĐỈNH CAO</span>
        </button>
      </div>
    );
  }

  if (gameState === 'result') {
    return (
      <div className="max-w-xl mx-auto text-center space-y-6 py-8">
        <div className="text-5xl">🏆</div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">Hoàn Thành Chặng Leo Núi!</h2>
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border space-y-2">
          <div className="text-xs text-slate-400 font-bold uppercase">Tổng điểm đạt được</div>
          <div className="text-5xl font-black text-amber-500">{score} / 100 Điểm</div>
          <p className="text-xs text-slate-500 mt-2">
            {score >= 80 ? '🌟 Xuất sắc! Em đã vinh quang chạm tới đỉnh núi tri thức!' : '👏 Rất tốt! Tiếp tục rèn luyện để giành trọn 100 điểm nhé!'}
          </p>
        </div>
        <button
          onClick={startSummit}
          className="px-6 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 flex items-center gap-2 mx-auto cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Chơi lại vòng mới</span>
        </button>
      </div>
    );
  }

  const curQ = defaultSummitQuestions[currentStageIndex];
  const curStage = stages[currentStageIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Stages Progress Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {stages.map((st, i) => (
            <div
              key={i}
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                currentStageIndex === i
                  ? 'bg-amber-500 text-white shadow'
                  : currentStageIndex > i
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
            >
              {currentStageIndex > i && <CheckCircle2 className="w-3 h-3" />}
              <span>{st.name}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/50 px-3 py-1 rounded-full">
          <span>Điểm: {score}</span>
        </div>
      </div>

      {/* Question Card with Timer */}
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-bold text-slate-700 dark:text-slate-300">Chặng {currentStageIndex + 1}: +{curStage.multiplier} điểm</span>
          <div className={`flex items-center gap-1.5 font-bold ${timeLeft <= 5 ? 'text-rose-500 animate-pulse' : 'text-slate-600 dark:text-slate-300'}`}>
            <Timer className="w-4 h-4" />
            <span>{timeLeft}s</span>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
          {curQ.q}
        </h3>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {curQ.options.map((opt, idx) => {
            let btnClass = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-amber-400 text-slate-800 dark:text-slate-200';
            if (isAnswered) {
              if (idx === curQ.correct) {
                btnClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold';
              } else if (idx === selectedOption) {
                btnClass = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 line-through';
              } else {
                btnClass = 'opacity-40 border-slate-200 bg-slate-50';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleAnswer(idx)}
                className={`p-3.5 rounded-xl border text-xs text-left font-medium transition-all cursor-pointer ${btnClass}`}
              >
                <span className="font-bold text-slate-400 mr-2">{String.fromCharCode(65 + idx)}.</span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback & Explanation */}
        {isAnswered && (
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className={`font-bold ${selectedOption === curQ.correct ? 'text-emerald-600' : 'text-rose-600'}`}>
                {selectedOption === curQ.correct ? '✓ Trả lời chính xác!' : selectedOption === -1 ? '⏰ Hết thời gian!' : '✗ Chưa chính xác!'}
              </span>
              <button
                onClick={nextStage}
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>{currentStageIndex < stages.length - 1 ? 'Chặng tiếp theo' : 'Xem tổng điểm'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              💡 <b>Giải thích:</b> {curQ.exp}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// =========================================================================
// GAME 2: AI LÀ TRIỆU PHÚ HỌC ĐƯỜNG (Who Wants to be a Millionaire)
// =========================================================================
function GameMillionaire() {
  const ladder = [
    { level: 1, prize: '100 điểm', milestone: false },
    { level: 2, prize: '200 điểm', milestone: false },
    { level: 3, prize: '300 điểm', milestone: false },
    { level: 4, prize: '500 điểm', milestone: false },
    { level: 5, prize: '1.000 điểm ★', milestone: true },
    { level: 6, prize: '2.000 điểm', milestone: false },
    { level: 7, prize: '4.000 điểm', milestone: false },
    { level: 8, prize: '8.000 điểm', milestone: false },
    { level: 9, prize: '16.000 điểm', milestone: false },
    { level: 10, prize: '32.000 điểm ★', milestone: true },
    { level: 11, prize: '64.000 điểm', milestone: false },
    { level: 12, prize: '125.000 điểm', milestone: false },
    { level: 13, prize: '250.000 điểm', milestone: false },
    { level: 14, prize: '500.000 điểm', milestone: false },
    { level: 15, prize: '1.000.000 điểm ★★★', milestone: true },
  ];

  const millionaireQuestions = [
    { q: 'Hàm số y = ax² + bx + c là hàm số bậc hai khi điều kiện nào sau đây thỏa mãn?', options: ['a ≠ 0', 'b ≠ 0', 'c ≠ 0', 'a > 0'], correct: 0, exp: 'Hàm số bậc hai yêu cầu hệ số gắn với x² phải khác 0 (a ≠ 0).' },
    { q: 'Đồ thị của hàm số bậc hai có tên gọi hình học là gì?', options: ['Parabol', 'Hyperbol', 'Đường tròn', 'Elip'], correct: 0, exp: 'Hình dạng đồ thị hàm số bậc hai là một đường cong parabol.' },
    { q: 'Trục đối xứng của parabol y = x² - 2x + 1 có phương trình là:', options: ['x = 1', 'x = -1', 'y = 1', 'x = 2'], correct: 0, exp: 'x = -b/(2a) = -(-2)/2 = 1.' },
    { q: 'Biệt thức Delta (Δ) của tam thức bậc hai được tính theo công thức nào?', options: ['b² - 4ac', 'b² + 4ac', '2b - 4ac', 'b² - 2ac'], correct: 0, exp: 'Công thức biệt thức chuẩn: Δ = b² - 4ac.' },
    { q: 'Nếu a > 0 thì đỉnh I của parabol là điểm gì của đồ thị?', options: ['Điểm cực tiểu (thấp nhất)', 'Điểm cực đại (cao nhất)', 'Điểm uốn', 'Giao điểm với trục tung'], correct: 0, exp: 'Khi a > 0 bề lõm quay lên, đỉnh I là điểm thấp nhất (cực tiểu).' },
    { q: 'Hàm số y = -x² + 4x - 3 đồng biến trên khoảng nào?', options: ['(-∞; 2)', '(2; +∞)', '(-∞; +∞)', '(0; 4)'], correct: 0, exp: 'Vì a = -1 < 0, hàm số đồng biến trên khoảng (-∞; -b/(2a)) = (-∞; 2).' },
    { q: 'Tung độ đỉnh I của parabol y = 2x² - 4x + 5 là:', options: ['3', '5', '-3', '1'], correct: 0, exp: 'x = 1 ⇒ y = 2(1)² - 4(1) + 5 = 3.' },
    { q: 'Giao điểm của parabol y = x² - 3x + 2 với trục tung Oy có tọa độ là:', options: ['(0; 2)', '(2; 0)', '(1; 0)', '(0; -2)'], correct: 0, exp: 'Cho x = 0 ⇒ y = 2 ⇒ Giao điểm là (0; 2).' },
    { q: 'Tập xác định của mọi hàm số bậc hai y = ax² + bx + c là:', options: ['D = R', 'D = R \\ {0}', 'D = (0; +∞)', 'D = [-1; 1]'], correct: 0, exp: 'Hàm đa thức xác định với mọi x thuộc tập số thực R.' },
    { q: 'Một hòn đá ném lên có độ cao h(t) = -5t² + 10t (m). Sau bao lâu đá chạm đất?', options: ['2 giây', '1 giây', '5 giây', '10 giây'], correct: 0, exp: 'Chạm đất khi h(t) = 0 ⇔ t(-5t + 10) = 0 ⇔ t = 2 (s).' },
    { q: 'Điều kiện để parabol y = ax² + bx + c cắt trục hoành tại 2 điểm phân biệt là:', options: ['a ≠ 0 và Δ > 0', 'Δ = 0', 'Δ < 0', 'b > 0'], correct: 0, exp: 'Phương trình hoành độ giao điểm có 2 nghiệm phân biệt khi và chỉ khi a ≠ 0 và Δ > 0.' },
    { q: 'Cho parabol có đỉnh I(1; -2) và đi qua điểm A(0; -1). Hệ số a bằng:', options: ['1', '-1', '2', '-2'], correct: 0, exp: 'y = a(x - 1)² - 2. Đi qua (0; -1) ⇒ -1 = a(1) - 2 ⇒ a = 1.' },
    { q: 'Hình dạng vòm cổng của trường THPT số 1 Tuy Phước thường được thiết kế theo dáng đường cong nào?', options: ['Parabol thẩm mỹ', 'Đường hyperbol', 'Hình sin dao động', 'Đường cong Bezier'], correct: 0, exp: 'Cổng vòm parabol có tính chịu lực tối ưu và thẩm mỹ kiến trúc kinh điển.' },
    { q: 'Hàm số f(x) = (m-1)x² + 2x - 3 là hàm số bậc hai khi và chỉ khi:', options: ['m ≠ 1', 'm = 1', 'm > 1', 'm < 1'], correct: 0, exp: 'Hệ số bậc hai m - 1 ≠ 0 ⇔ m ≠ 1.' },
    { q: 'CÂU HỎI 1 TRIỆU ĐIỂM: Giá trị lớn nhất của biểu thức P = -2x² - 4xy - 3y² + 4x + 6y + 5 là:', options: ['8', '10', '5', '12'], correct: 0, exp: 'Biến đổi dồn biến: P = 8 - 2(x + y - 1)² - (y - 1)². Đạt max = 8 khi x = 0, y = 1.' },
  ];

  const [gameState, setGameState] = useState<'guide' | 'playing' | 'result'>('guide');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scoreWon, setScoreWon] = useState('0 điểm');
  const [has5050, setHas5050] = useState(true);
  const [hasHint, setHasHint] = useState(true);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [hintText, setHintText] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const startMillionaire = () => {
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setScoreWon('0 điểm');
    setHas5050(true);
    setHasHint(true);
    setEliminatedOptions([]);
    setHintText(null);
    setSelectedOption(null);
    setIsRevealed(false);
  };

  const curQ = millionaireQuestions[currentQuestionIndex];

  const use5050 = () => {
    if (!has5050 || isRevealed) return;
    const wrong = [0, 1, 2, 3].filter(i => i !== curQ.correct);
    // Eliminate two
    setEliminatedOptions([wrong[0], wrong[1]]);
    setHas5050(false);
  };

  const useHint = () => {
    if (!hasHint || isRevealed) return;
    setHintText(`💡 Gợi ý thông minh: Hãy chú ý định nghĩa cơ bản và công thức tọa độ đỉnh. Đáp án đúng liên quan trực tiếp đến [${curQ.options[curQ.correct]}].`);
    setHasHint(false);
  };

  const handleSelectOption = (idx: number) => {
    if (isRevealed) return;
    setSelectedOption(idx);
    setIsRevealed(true);

    if (idx === curQ.correct) {
      setScoreWon(ladder[currentQuestionIndex].prize);
    }
  };

  const handleNext = () => {
    if (selectedOption === curQ.correct) {
      if (currentQuestionIndex < ladder.length - 1) {
        setCurrentQuestionIndex(c => c + 1);
        setSelectedOption(null);
        setIsRevealed(false);
        setEliminatedOptions([]);
        setHintText(null);
      } else {
        setGameState('result');
        confetti({ particleCount: 150, spread: 80 });
      }
    } else {
      setGameState('result');
    }
  };

  if (gameState === 'guide') {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6 py-8">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-600 mx-auto flex items-center justify-center">
          <Sparkles className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Ai Là Triệu Phú Học Đường</h2>
          <p className="text-sm text-slate-500 mt-2">
            15 câu hỏi trí tuệ với 3 mốc quan trọng (Câu 5, Câu 10, Câu 15).
            Hỗ trợ quyền trợ giúp <b>50:50</b> loại bỏ 2 phương án sai và <b>Gợi ý thông minh</b>.
          </p>
        </div>
        <button
          onClick={startMillionaire}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/25 flex items-center gap-2 mx-auto cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>BƯỚC VÀO GHẾ NÓNG TRIỆU PHÚ</span>
        </button>
      </div>
    );
  }

  if (gameState === 'result') {
    return (
      <div className="max-w-md mx-auto text-center space-y-5 py-8">
        <div className="text-5xl">🎉</div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Kết Thúc Ghế Nóng!</h2>
        <div className="p-6 rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 space-y-2">
          <div className="text-xs text-indigo-500 font-bold uppercase">Phần thưởng đạt được</div>
          <div className="text-4xl font-black text-indigo-600">{scoreWon}</div>
          <div className="text-xs text-slate-500">Đã dừng lại ở Câu {currentQuestionIndex + 1} / 15</div>
        </div>
        <button
          onClick={startMillionaire}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 mx-auto cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Thử sức lại từ Câu 1</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Question Box & Lifelines */}
      <div className="lg:col-span-8 space-y-4">
        {/* Top Lifelines Bar */}
        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border text-xs">
          <div className="font-bold text-slate-700 dark:text-slate-300">
            Câu {currentQuestionIndex + 1} / 15 • {ladder[currentQuestionIndex].prize}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={use5050}
              disabled={!has5050 || isRevealed}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                has5050
                  ? 'border-indigo-400 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300'
                  : 'opacity-30 border-slate-300 bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              50:50
            </button>
            <button
              onClick={useHint}
              disabled={!hasHint || isRevealed}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                hasHint
                  ? 'border-amber-400 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-300'
                  : 'opacity-30 border-slate-300 bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              Gợi ý
            </button>
          </div>
        </div>

        {hintText && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-xs text-amber-900 dark:text-amber-200">
            {hintText}
          </div>
        )}

        {/* Question Prompt */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 text-white border-2 border-indigo-800/60 shadow-xl space-y-6">
          <h3 className="text-base sm:text-xl font-bold text-center leading-relaxed">
            {curQ.q}
          </h3>

          {/* 4 Choices in Diamond Style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {curQ.options.map((opt, i) => {
              const isEliminated = eliminatedOptions.includes(i);
              let btnClass = 'border-indigo-800/80 bg-slate-900/80 hover:bg-indigo-900/60 text-slate-200';
              if (isRevealed) {
                if (i === curQ.correct) {
                  btnClass = 'border-emerald-500 bg-emerald-600 text-white font-bold animate-bounce';
                } else if (i === selectedOption) {
                  btnClass = 'border-rose-500 bg-rose-600 text-white';
                } else {
                  btnClass = 'opacity-30 border-slate-800 bg-slate-950';
                }
              }

              return (
                <button
                  key={i}
                  disabled={isRevealed || isEliminated}
                  onClick={() => handleSelectOption(i)}
                  className={`p-3.5 rounded-xl border text-xs text-left font-medium transition-all cursor-pointer ${btnClass} ${
                    isEliminated ? 'opacity-0 pointer-events-none' : ''
                  }`}
                >
                  <span className="font-extrabold text-amber-400 mr-2">{String.fromCharCode(65 + i)}:</span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Revealed Result & Next action */}
        {isRevealed && (
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className={`font-bold text-sm ${selectedOption === curQ.correct ? 'text-emerald-600' : 'text-rose-600'}`}>
                {selectedOption === curQ.correct ? '🎉 CHÚC MỪNG BẠN ĐÃ TRẢ LỜI ĐÚNG!' : '❌ RẤT TIẾC, ĐÁP ÁN ĐÚNG LÀ: ' + curQ.options[curQ.correct]}
              </span>
              <button
                onClick={handleNext}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>{selectedOption === curQ.correct ? 'Câu tiếp theo' : 'Xem kết quả cuối cùng'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-slate-500 text-[11px]">
              💡 <b>Giải thích chi tiết:</b> {curQ.exp}
            </p>
          </div>
        )}
      </div>

      {/* Right: The 15 Prize Ladder */}
      <div className="lg:col-span-4 bg-slate-900 rounded-2xl p-4 text-white space-y-1">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center pb-2 border-b border-slate-800">
          Thang điểm 15 bậc
        </div>
        <div className="space-y-0.5">
          {[...ladder].reverse().map(item => {
            const isCurrent = item.level === currentQuestionIndex + 1;
            const isPassed = item.level < currentQuestionIndex + 1;

            return (
              <div
                key={item.level}
                className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  isCurrent
                    ? 'bg-amber-400 text-slate-950 font-extrabold shadow scale-102'
                    : isPassed
                    ? 'text-emerald-400 font-semibold'
                    : item.milestone
                    ? 'text-amber-400 font-bold bg-white/5'
                    : 'text-slate-400'
                }`}
              >
                <span>{item.level < 10 ? `0${item.level}` : item.level}.</span>
                <span>{item.prize}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// GAME 3: VÒNG QUAY MAY MẮN (Lucky Wheel with Real Canvas Physics)
// =========================================================================
function GameLuckyWheel({ students }: { students: Student[] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const defaultItems = students.length > 0
    ? students.map(s => s.name)
    : ['Nguyễn Văn An', 'Trần Thị Mai', 'Lê Hoàng Nam', 'Phạm Quỳnh Anh', 'Võ Minh Khang', 'Bùi Thảo Vy', 'Đặng Quốc Huy', 'Ngô Thảo Linh'];

  const [items, setItems] = useState<string[]>(defaultItems);
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState('');
  const [showConfig, setShowConfig] = useState(false);

  const colors = ['#f43f5e', '#8b5cf6', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#6366f1', '#14b8a6'];
  const rotationRef = useRef(0);

  const drawWheel = (angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const radius = width / 2 - 10;
    const sliceAngle = (2 * Math.PI) / items.length;

    ctx.clearRect(0, 0, width, height);

    // Save context for rotation
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(angle);

    // Draw slices
    items.forEach((item, i) => {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, i * sliceAngle, (i + 1) * sliceAngle);
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.rotate(i * sliceAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.fillText(item, radius - 20, 5);
      ctx.restore();
    });

    ctx.restore();

    // Draw Center Circle Peg
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 24, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#f59e0b';
    ctx.stroke();

    // Center icon
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('VY', width / 2, height / 2 + 4);

    // Draw Static Top Pointer Needle
    ctx.beginPath();
    ctx.moveTo(width / 2, 2);
    ctx.lineTo(width / 2 - 14, 28);
    ctx.lineTo(width / 2 + 14, 28);
    ctx.closePath();
    ctx.fillStyle = '#fbbf24';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#b45309';
    ctx.stroke();
  };

  useEffect(() => {
    drawWheel(rotationRef.current);
  }, [items]);

  const spin = () => {
    if (isSpinning || items.length === 0) return;
    setIsSpinning(true);
    setSelectedWinner(null);

    const extraSpins = 5 + Math.floor(Math.random() * 5); // 5 to 10 full turns
    const randomStopAngle = Math.random() * 2 * Math.PI;
    const targetAngle = rotationRef.current + extraSpins * 2 * Math.PI + randomStopAngle;

    const startTime = performance.now();
    const duration = 4500; // 4.5 seconds easing spin

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic ease out
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentAngle = rotationRef.current + (targetAngle - rotationRef.current) * ease;

      drawWheel(currentAngle);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        rotationRef.current = targetAngle % (2 * Math.PI);
        setIsSpinning(false);

        // Calculate winner
        const normalizedAngle = (3 * Math.PI / 2 - rotationRef.current) % (2 * Math.PI);
        const positiveAngle = normalizedAngle < 0 ? normalizedAngle + 2 * Math.PI : normalizedAngle;
        const sliceAngle = (2 * Math.PI) / items.length;
        const winnerIndex = Math.floor(positiveAngle / sliceAngle) % items.length;
        const winner = items[winnerIndex];

        setSelectedWinner(winner);
        setHistory(h => [winner, ...h]);
        confetti({ particleCount: 80, spread: 60 });
      }
    };

    requestAnimationFrame(animate);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    setItems([...items, customInput.trim()]);
    setCustomInput('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shuffle className="w-5 h-5 text-pink-600" />
            Vòng Quay May Mắn Chọn Học Sinh & Câu Hỏi
          </h2>
          <p className="text-xs text-slate-500">Hiệu ứng quay vật lý giảm tốc mượt mà, tạo không khí hào hứng trong lớp.</p>
        </div>
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Sửa danh sách ({items.length})</span>
        </button>
      </div>

      {showConfig && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border text-xs space-y-3">
          <form onSubmit={handleAddItem} className="flex gap-2">
            <input
              type="text"
              value={customInput}
              onChange={e => setCustomInput(e.target.value)}
              placeholder="Nhập tên học sinh hoặc câu hỏi mới..."
              className="flex-1 p-2 rounded-xl border bg-white dark:bg-slate-900"
            />
            <button type="submit" className="px-4 py-2 rounded-xl bg-pink-600 text-white font-bold cursor-pointer">
              Thêm
            </button>
          </form>
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
            {items.map((it, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <span>{it}</span>
                {items.length > 2 && (
                  <button
                    onClick={() => setItems(items.filter((_, i) => i !== idx))}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Canvas Wheel Area */}
      <div className="flex flex-col items-center justify-center py-4 space-y-4">
        <div className="relative p-2 rounded-full bg-slate-900 shadow-2xl ring-4 ring-amber-400/80">
          <canvas
            ref={canvasRef}
            width={380}
            height={380}
            className="rounded-full max-w-full"
          />
        </div>

        <button
          disabled={isSpinning}
          onClick={spin}
          className="px-10 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-600 to-amber-500 hover:from-pink-600 text-white font-extrabold text-sm shadow-xl shadow-pink-500/25 disabled:opacity-50 transition-all hover:scale-105 cursor-pointer"
        >
          {isSpinning ? 'ĐANG QUAY MAY MẮN...' : 'QUAY NGAY!'}
        </button>

        {selectedWinner && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-center animate-bounce">
            <span className="text-xs text-amber-700 dark:text-amber-300 font-bold uppercase tracking-wider block">
              CHÚC MỪNG BẠN MAY MẮN LÊN BẢNG:
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-white mt-0.5 block">
              {selectedWinner}
            </span>
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="text-xs text-slate-400 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="font-bold shrink-0">Lịch sử quay:</span>
          {history.map((h, i) => (
            <span key={i} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
              {h}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// =========================================================================
// GAME 4: GHÉP ĐÔI KIẾN THỨC (Knowledge Match)
// =========================================================================
function GameKnowledgeMatch() {
  const matchPairs = [
    { id: 1, term: 'Tọa độ đỉnh Parabol I', def: 'I(-b / 2a ; -Δ / 4a)' },
    { id: 2, term: 'Trục đối xứng', def: 'Đường thẳng x = -b / 2a' },
    { id: 3, term: 'Bề lõm quay lên', def: 'Hệ số a > 0' },
    { id: 4, term: 'Bề lõm quay xuống', def: 'Hệ số a < 0' },
    { id: 5, term: 'Biệt thức Delta (Δ)', def: 'Δ = b² - 4ac' },
    { id: 6, term: 'Điểm cắt trục tung Oy', def: 'Tọa độ (0; c)' },
  ];

  const [gameState, setGameState] = useState<'guide' | 'playing' | 'result'>('guide');
  const [selectedTermId, setSelectedTermId] = useState<number | null>(null);
  const [matchedIds, setMatchedIds] = useState<number[]>([]);
  const [shuffledDefs, setShuffledDefs] = useState<Array<{ id: number; def: string }>>([]);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    let interval: any;
    if (gameState === 'playing' && matchedIds.length < matchPairs.length) {
      interval = setInterval(() => setTimerSeconds(t => t + 1), 1000);
    } else if (gameState === 'playing' && matchedIds.length === matchPairs.length) {
      setGameState('result');
      confetti({ particleCount: 100, spread: 70 });
    }
    return () => clearInterval(interval);
  }, [gameState, matchedIds]);

  const startMatchGame = () => {
    setMatchedIds([]);
    setSelectedTermId(null);
    setTimerSeconds(0);
    setAttempts(0);
    // Shuffle definitions
    const defs = matchPairs.map(p => ({ id: p.id, def: p.def })).sort(() => Math.random() - 0.5);
    setShuffledDefs(defs);
    setGameState('playing');
  };

  const handleSelectTerm = (id: number) => {
    if (matchedIds.includes(id)) return;
    setSelectedTermId(id);
  };

  const handleSelectDef = (id: number) => {
    if (!selectedTermId || matchedIds.includes(id)) return;
    setAttempts(a => a + 1);

    if (selectedTermId === id) {
      setMatchedIds(m => [...m, id]);
      setSelectedTermId(null);
    } else {
      // Wrong match flash
      setTimeout(() => setSelectedTermId(null), 400);
    }
  };

  if (gameState === 'guide') {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6 py-8">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center">
          <Flame className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Ghép Đôi Kiến Thức</h2>
          <p className="text-sm text-slate-500 mt-2">
            Chọn 1 thẻ thuật ngữ bên trái và ghép với định nghĩa/công thức chính xác bên phải trong thời gian ngắn nhất!
          </p>
        </div>
        <button
          onClick={startMatchGame}
          className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-xl flex items-center gap-2 mx-auto cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>BẮT ĐẦU GHÉP THẺ</span>
        </button>
      </div>
    );
  }

  if (gameState === 'result') {
    return (
      <div className="max-w-md mx-auto text-center space-y-5 py-8">
        <div className="text-5xl">🎯</div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Ghép Đôi Thành Công!</h2>
        <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs space-y-1">
          <div className="text-2xl font-black text-emerald-600">{timerSeconds} Giây</div>
          <div className="text-slate-500">Số lần thử: <b>{attempts}</b> lần (Ghép đúng 6/6 cặp)</div>
        </div>
        <button
          onClick={startMatchGame}
          className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 mx-auto cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Ghép lại ván mới</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700 dark:text-slate-300">
            Tiến độ: {matchedIds.length} / {matchPairs.length} cặp
          </span>
          <span className="text-slate-400">• Lượt thử: {attempts}</span>
        </div>
        <div className="flex items-center gap-1 font-bold text-emerald-600">
          <Timer className="w-4 h-4" />
          <span>{timerSeconds}s</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Left Column: Terms */}
        <div className="space-y-2.5">
          <div className="text-[11px] font-bold uppercase text-slate-400">Thuật ngữ / Khái niệm</div>
          {matchPairs.map(p => {
            const isMatched = matchedIds.includes(p.id);
            const isSelected = selectedTermId === p.id;
            return (
              <button
                key={p.id}
                disabled={isMatched}
                onClick={() => handleSelectTerm(p.id)}
                className={`w-full p-3.5 rounded-xl border text-xs text-left font-bold transition-all cursor-pointer ${
                  isMatched
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 opacity-60 line-through'
                    : isSelected
                    ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/40 text-pink-700 ring-2 ring-pink-500/40 scale-102'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                {p.term}
              </button>
            );
          })}
        </div>

        {/* Right Column: Definitions */}
        <div className="space-y-2.5">
          <div className="text-[11px] font-bold uppercase text-slate-400">Định nghĩa / Công thức</div>
          {shuffledDefs.map(p => {
            const isMatched = matchedIds.includes(p.id);
            return (
              <button
                key={p.id}
                disabled={isMatched}
                onClick={() => handleSelectDef(p.id)}
                className={`w-full p-3.5 rounded-xl border text-xs text-left font-medium transition-all cursor-pointer ${
                  isMatched
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 opacity-60'
                    : selectedTermId
                    ? 'border-indigo-300 dark:border-indigo-800 bg-indigo-50/40 dark:bg-indigo-950/30 hover:border-indigo-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                {p.def}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// GAME 5: Ô CHỮ BÍ MẬT (Crossword with Secret Column)
// =========================================================================
function GameCrossword() {
  // Secret keyword: "PARABOL" (7 letters)
  const crosswordRows = [
    { row: 1, clue: 'Điểm cực trị cao nhất hoặc thấp nhất của đường cong bậc hai gọi là gì?', answer: 'DINH', secretIndex: 1, letter: 'P' }, // D [I] N H -> wait let's use exact keyword matching
    { row: 2, clue: 'Đường cong biểu diễn hàm số y = ax² + bx + c', answer: 'PARABOL', secretIndex: 0, letter: 'P' },
    { row: 3, clue: 'Đường thẳng chia parabol thành hai phần đối xứng', answer: 'TRUC', secretIndex: 0, letter: 'A' },
    { row: 4, clue: 'Khoảng giá trị mà trên đó y tăng khi x tăng gọi là khoảng đồng...', answer: 'BIEN', secretIndex: 0, letter: 'R' },
    { row: 5, clue: 'Hệ số gắn liền với biến số bậc hai trong tam thức y = ax² + bx + c', answer: 'HESO', secretIndex: 2, letter: 'A' },
    { row: 6, clue: 'Dạng đồ thị mở rộng về hai phía vô tận không bị giới...', answer: 'HAN', secretIndex: 1, letter: 'B' },
    { row: 7, clue: 'Cực trị thấp nhất của hàm số khi a > 0 gọi là giá trị nhỏ...', answer: 'NHAT', secretIndex: 3, letter: 'O' },
  ];

  const SECRET_KEYWORD = 'PARABOL';

  const [gameState, setGameState] = useState<'guide' | 'playing' | 'result'>('guide');
  const [revealedRows, setRevealedRows] = useState<number[]>([]);
  const [guessInput, setGuessInput] = useState('');
  const [score, setScore] = useState(0);

  const startCrossword = () => {
    setRevealedRows([]);
    setGuessInput('');
    setScore(0);
    setGameState('playing');
  };

  const handleRevealRow = (rowNum: number) => {
    if (!revealedRows.includes(rowNum)) {
      setRevealedRows([...revealedRows, rowNum]);
      setScore(s => s + 10);
    }
  };

  const handleGuessSecret = (e: React.FormEvent) => {
    e.preventDefault();
    if (guessInput.trim().toUpperCase() === SECRET_KEYWORD) {
      setScore(s => s + 50);
      setRevealedRows([1, 2, 3, 4, 5, 6, 7]);
      setGameState('result');
      confetti({ particleCount: 120, spread: 75 });
    } else {
      alert('Chưa chính xác! Hãy mở thêm các hàng ngang để tìm từ khóa nhé.');
    }
  };

  if (gameState === 'guide') {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6 py-8">
        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-600 mx-auto flex items-center justify-center">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Ô Chữ Bí Mật Học Đường</h2>
          <p className="text-sm text-slate-500 mt-2">
            Giải đáp các câu hỏi hàng ngang để mở các chữ cái gợi ý, giải mã <b>TỪ KHÓA BÍ MẬT (7 chữ cái)</b> để giành điểm tối đa!
          </p>
        </div>
        <button
          onClick={startCrossword}
          className="px-8 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm shadow-xl flex items-center gap-2 mx-auto cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>BẮT ĐẦU MỞ Ô CHỮ</span>
        </button>
      </div>
    );
  }

  if (gameState === 'result') {
    return (
      <div className="max-w-md mx-auto text-center space-y-5 py-8">
        <div className="text-5xl">🗝️</div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">GIẢI MÃ THÀNH CÔNG!</h2>
        <div className="p-6 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 text-xs space-y-2">
          <div className="text-xs text-purple-500 font-bold uppercase">Từ khóa chính xác:</div>
          <div className="text-3xl font-black text-purple-600 tracking-widest">{SECRET_KEYWORD}</div>
          <div className="text-slate-500 font-bold">Điểm đạt được: {score} Điểm</div>
        </div>
        <button
          onClick={startCrossword}
          className="px-6 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold flex items-center gap-2 mx-auto cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Chơi ô chữ mới</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-slate-700 dark:text-slate-300">
          Đã mở: {revealedRows.length} / {crosswordRows.length} hàng ngang
        </span>
        <span className="font-bold text-purple-600">Điểm: {score}</span>
      </div>

      {/* Secret Guess Form */}
      <form onSubmit={handleGuessSecret} className="flex gap-2">
        <input
          type="text"
          value={guessInput}
          onChange={e => setGuessInput(e.target.value)}
          placeholder="Đoán ngay từ khóa bí mật (7 chữ cái)..."
          className="flex-1 p-2.5 rounded-xl border border-purple-300 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/30 text-xs font-bold uppercase tracking-wider"
        />
        <button type="submit" className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer">
          Đoán từ khóa (+50đ)
        </button>
      </form>

      {/* Rows List */}
      <div className="space-y-3">
        {crosswordRows.map((r) => {
          const isRevealed = revealedRows.includes(r.row);
          return (
            <div
              key={r.row}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Hàng {r.row}: {r.clue}
                </span>
                {!isRevealed ? (
                  <button
                    onClick={() => handleRevealRow(r.row)}
                    className="px-3 py-1 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-[11px] cursor-pointer"
                  >
                    Mở đáp án (+10đ)
                  </button>
                ) : (
                  <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Đã mở
                  </span>
                )}
              </div>

              {/* Tiles grid */}
              <div className="flex items-center gap-1.5 pt-1">
                {r.answer.split('').map((char, charIdx) => {
                  const isSecretLetter = charIdx === r.secretIndex;
                  return (
                    <div
                      key={charIdx}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm border shadow-sm transition-all ${
                        isRevealed
                          ? isSecretLetter
                            ? 'bg-amber-400 border-amber-500 text-slate-950 ring-2 ring-amber-400'
                            : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white'
                          : isSecretLetter
                          ? 'bg-amber-100 dark:bg-amber-950/40 border-amber-300 text-transparent'
                          : 'bg-slate-200 dark:bg-slate-700 border-slate-300 text-transparent'
                      }`}
                    >
                      {isRevealed ? char : '?'}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =========================================================================
// GAME 6: ĐẤU TRƯỜNG TRÍ TUỆ (Intellect Arena with Live Room Simulation)
// =========================================================================
function GameIntellectArena({ students }: { students: Student[] }) {
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'result'>('lobby');
  const [roomCode] = useState('VY-2025');
  const [playerScore, setPlayerScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);

  const arenaQuestions = [
    { q: 'Hàm số y = x² - 4x + 3 có trục đối xứng là:', options: ['x = 2', 'x = -2', 'x = 4', 'y = 2'], correct: 0 },
    { q: 'Điểm cực đại của hàm số y = -x² + 6x - 5 đạt tại hoành độ x bằng:', options: ['x = 3', 'x = -3', 'x = 6', 'x = 0'], correct: 0 },
    { q: 'Tập nghiệm của phương trình x² - 5x + 6 = 0 là:', options: ['{2; 3}', '{-2; -3}', '{1; 6}', '{-1; -6}'], correct: 0 },
  ];

  // Simulated live classmates in arena
  const [leaderboard, setLeaderboard] = useState([
    { name: 'Nguyễn Văn An (Em)', score: 0, isUser: true },
    { name: 'Trần Thị Mai', score: 280, isUser: false },
    { name: 'Bùi Thảo Vy', score: 250, isUser: false },
    { name: 'Hoàng Anh Tuấn', score: 230, isUser: false },
    { name: 'Đặng Quốc Huy', score: 190, isUser: false },
  ]);

  useEffect(() => {
    let t: any;
    if (gameState === 'playing' && selectedAns === null && timeLeft > 0) {
      t = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && selectedAns === null) {
      handleAnswer(-1);
    }
    return () => clearInterval(t);
  }, [gameState, selectedAns, timeLeft]);

  const startArena = () => {
    setGameState('playing');
    setCurrentRound(0);
    setPlayerScore(0);
    setSelectedAns(null);
    setTimeLeft(10);
  };

  const handleAnswer = (ansIdx: number) => {
    setSelectedAns(ansIdx);
    const cur = arenaQuestions[currentRound];
    let earned = 0;
    if (ansIdx === cur.correct) {
      // Faster answer = more points (speed bonus)
      earned = 100 + timeLeft * 10;
      setPlayerScore(s => s + earned);
    }

    // Update leaderboard with user and simulated classmates
    setTimeout(() => {
      setLeaderboard(prev => {
        const updated = prev.map(p => {
          if (p.isUser) return { ...p, score: p.score + earned };
          return { ...p, score: p.score + (Math.random() > 0.3 ? 90 + Math.floor(Math.random() * 50) : 0) };
        });
        return updated.sort((a, b) => b.score - a.score);
      });
    }, 500);
  };

  const handleNextRound = () => {
    if (currentRound < arenaQuestions.length - 1) {
      setCurrentRound(r => r + 1);
      setSelectedAns(null);
      setTimeLeft(10);
    } else {
      setGameState('result');
      confetti({ particleCount: 150, spread: 80 });
    }
  };

  if (gameState === 'lobby') {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6 py-8">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-600 mx-auto flex items-center justify-center">
          <Users className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Đấu Trường Trí Tuệ THPT</h2>
          <p className="text-sm text-slate-500 mt-2">
            Phòng đấu trực tiếp mô phỏng thi đấu đồng thời cả lớp. Tính điểm theo độ chính xác và tốc độ trả lời!
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 max-w-xs mx-auto border space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400">Mã phòng thi đấu</div>
          <div className="text-2xl font-black tracking-widest text-pink-600">{roomCode}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">● 42 học sinh lớp 10A1 đã sẵn sàng</div>
        </div>

        <button
          onClick={startArena}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 text-white font-extrabold text-sm shadow-xl flex items-center gap-2 mx-auto cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>VÀO PHÒNG ĐẤU TRỰC TIẾP</span>
        </button>
      </div>
    );
  }

  if (gameState === 'result') {
    return (
      <div className="max-w-md mx-auto text-center space-y-5 py-8">
        <div className="text-5xl">👑</div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">KẾT QUẢ ĐẤU TRƯỜNG!</h2>
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border space-y-3">
          <div className="text-xs text-slate-400 font-bold uppercase">Bảng vàng vinh danh</div>
          {leaderboard.slice(0, 5).map((p, i) => (
            <div key={i} className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold ${
              p.isUser ? 'bg-pink-100 dark:bg-pink-950 text-pink-700 font-extrabold' : 'text-slate-700 dark:text-slate-300'
            }`}>
              <span>#{i + 1}. {p.name}</span>
              <span>{p.score} điểm</span>
            </div>
          ))}
        </div>
        <button
          onClick={startArena}
          className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-2 mx-auto cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Đấu lại vòng mới</span>
        </button>
      </div>
    );
  }

  const cur = arenaQuestions[currentRound];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Arena Stage */}
      <div className="lg:col-span-8 space-y-4">
        <div className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border">
          <span className="font-bold text-slate-700 dark:text-slate-300">
            Vòng {currentRound + 1} / {arenaQuestions.length} • Mã phòng: {roomCode}
          </span>
          <div className="flex items-center gap-1 font-bold text-rose-600">
            <Timer className="w-4 h-4" />
            <span>{timeLeft}s (Điểm tốc độ: +{timeLeft * 10})</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 to-rose-950 text-white border-2 border-rose-900 space-y-6">
          <h3 className="text-base sm:text-xl font-bold text-center leading-relaxed">
            {cur.q}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {cur.options.map((opt, i) => {
              let btnClass = 'border-rose-900/60 bg-slate-900/80 hover:bg-rose-900/40 text-slate-200';
              if (selectedAns !== null) {
                if (i === cur.correct) {
                  btnClass = 'border-emerald-500 bg-emerald-600 text-white font-bold';
                } else if (i === selectedAns) {
                  btnClass = 'border-rose-500 bg-rose-600 text-white';
                } else {
                  btnClass = 'opacity-30 border-slate-800 bg-slate-950';
                }
              }

              return (
                <button
                  key={i}
                  disabled={selectedAns !== null}
                  onClick={() => handleAnswer(i)}
                  className={`p-3.5 rounded-xl border text-xs text-left font-medium transition-all cursor-pointer ${btnClass}`}
                >
                  <span className="font-extrabold text-amber-400 mr-2">{String.fromCharCode(65 + i)}:</span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {selectedAns !== null && (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900 border text-xs">
            <span className={`font-bold ${selectedAns === cur.correct ? 'text-emerald-600' : 'text-rose-600'}`}>
              {selectedAns === cur.correct ? '⚡ Bạn trả lời đúng và nhận điểm tốc độ!' : '✗ Chưa chính xác!'}
            </span>
            <button
              onClick={handleNextRound}
              className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>{currentRound < arenaQuestions.length - 1 ? 'Vòng tiếp theo' : 'Xem tổng kết đấu trường'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Live Classroom Leaderboard */}
      <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold border-b pb-2">
          <span className="text-slate-800 dark:text-white flex items-center gap-1">
            <Trophy className="w-4 h-4 text-amber-500" />
            Bảng xếp hạng thời gian thực
          </span>
          <span className="text-[10px] text-emerald-500 font-mono animate-pulse">● LIVE</span>
        </div>
        <div className="space-y-1.5">
          {leaderboard.map((user, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition-all ${
                user.isUser
                  ? 'bg-pink-500 text-white font-extrabold shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs w-5 font-bold">#{idx + 1}</span>
                <span>{user.name}</span>
              </div>
              <span className="font-bold">{user.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
