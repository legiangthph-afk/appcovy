import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Sparkles,
  Download,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Shuffle,
  BarChart2,
  AlertTriangle,
  Award,
  ChevronRight,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { OnlineTest, TestSubmission } from '../../types';
import { exportTestResultsToCsv } from '../../lib/exportUtils';

interface TestingAssessmentModuleProps {
  tests: OnlineTest[];
  onUpdateTests: (tests: OnlineTest[]) => void;
}

export const TestingAssessmentModule: React.FC<TestingAssessmentModuleProps> = ({
  tests,
  onUpdateTests
}) => {
  const [selectedTest, setSelectedTest] = useState<OnlineTest>(tests[0] || null);
  const [isTakingTest, setIsTakingTest] = useState(false);

  // Student Test Taking State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [testCompleted, setTestCompleted] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState<number | null>(null);

  useEffect(() => {
    let t: any;
    if (isTakingTest && !testCompleted && timeLeft > 0) {
      t = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isTakingTest && !testCompleted) {
      handleSubmitTest();
    }
    return () => clearInterval(t);
  }, [isTakingTest, testCompleted, timeLeft]);

  const startTestSimulation = () => {
    if (!selectedTest) return;
    setIsTakingTest(true);
    setTestCompleted(false);
    setUserAnswers({});
    setCurrentQIndex(0);
    setTimeLeft(selectedTest.durationMinutes * 60);
    setCalculatedScore(null);
  };

  const handleSelectOption = (qId: string, option: string) => {
    if (testCompleted) return;
    setUserAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleSubmitTest = () => {
    if (!selectedTest) return;
    let correctCount = 0;
    const totalQ = selectedTest.questions.length;

    selectedTest.questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const finalScore = Number(((correctCount / totalQ) * 10).toFixed(1));
    setCalculatedScore(finalScore);
    setTestCompleted(true);

    // Record submission into test results
    const newSubmission: TestSubmission = {
      studentId: `hs-101`,
      studentName: 'Nguyễn Văn An (Em)',
      score: finalScore,
      submittedAt: new Date().toISOString(),
      answers: userAnswers
    };

    const updatedTest = {
      ...selectedTest,
      submissionsCount: (selectedTest.submissionsCount || 0) + 1,
      results: [newSubmission, ...selectedTest.results]
    };

    setSelectedTest(updatedTest);
    onUpdateTests(tests.map(t => t.id === updatedTest.id ? updatedTest : t));

    if (finalScore >= 8) {
      confetti({ particleCount: 120, spread: 70 });
    }
  };

  // Analyze most missed questions
  const questionMissedAnalytics = (selectedTest?.questions || []).map(q => {
    const totalSubs = selectedTest.results.length;
    if (totalSubs === 0) return { q, wrongPercent: 0 };
    const wrongCount = selectedTest.results.filter(r => r.answers[q.id] !== q.correctAnswer).length;
    return {
      q,
      wrongPercent: Math.round((wrongCount / totalSubs) * 100)
    };
  }).sort((a, b) => b.wrongPercent - a.wrongPercent);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-pink-600 dark:text-pink-400 uppercase tracking-wider mb-1">
            <CheckSquare className="w-4 h-4" />
            <span>MODULE 8 • KIỂM TRA TRỰC TUYẾN & ĐÁNH GIÁ CHUẨN ĐẦU RA</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Hệ Thống Khảo Thí & Phân Tích Kết Quả Tự Động
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Trộn đề tự động, bấm giờ nghiêm ngặt, tự động chấm điểm và chẩn đoán các dạng bài học sinh hay mắc lỗi sai.
          </p>
        </div>

        {selectedTest && (
          <div className="flex items-center gap-2">
            <button
              onClick={startTestSimulation}
              className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-lg shadow-pink-600/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Làm bài thi thử nghiệm</span>
            </button>
            <button
              onClick={() => exportTestResultsToCsv(selectedTest)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer"
              title="Xuất bảng điểm Excel CSV"
            >
              <Download className="w-3.5 h-3.5 text-pink-400" />
              <span>Xuất Bảng Điểm Excel</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Test Details & Taking Mode */}
      {isTakingTest ? (
        /* Test Taker Live Mode */
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-100 text-pink-700 uppercase">
                Phòng thi trực tuyến
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {selectedTest.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold ${
                timeLeft < 180 ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
              }`}>
                <Clock className="w-4 h-4" />
                <span>
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
              {!testCompleted && (
                <button
                  onClick={handleSubmitTest}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
                >
                  Nộp bài thi
                </button>
              )}
            </div>
          </div>

          {testCompleted ? (
            /* Results Screen */
            <div className="max-w-xl mx-auto text-center space-y-5 py-6">
              <div className="text-5xl">🎯</div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Đã Hoàn Thành Bài Kiểm Tra!
              </h3>
              <div className="p-6 rounded-3xl bg-pink-50/60 dark:bg-pink-950/40 border border-pink-200 space-y-1">
                <div className="text-xs text-pink-600 font-bold uppercase">Điểm số của bạn:</div>
                <div className="text-5xl font-black text-pink-600">{calculatedScore} / 10</div>
                <div className="text-xs text-slate-500 mt-2">
                  Đã trả lời đúng {Math.round((calculatedScore! / 10) * selectedTest.questions.length)} / {selectedTest.questions.length} câu.
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => setIsTakingTest(false)}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer"
                >
                  Quay lại bảng phân tích
                </button>
                <button
                  onClick={startTestSimulation}
                  className="px-6 py-2.5 rounded-xl border border-slate-300 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Làm lại đề
                </button>
              </div>
            </div>
          ) : (
            /* Question Active Stepper */
            <div className="space-y-6">
              {/* Question Navigation Palette */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {selectedTest.questions.map((q, idx) => {
                  const isAnswered = !!userAnswers[q.id];
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQIndex(idx)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currentQIndex === idx
                          ? 'bg-pink-600 text-white shadow'
                          : isAnswered
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Current Question View */}
              {selectedTest.questions[currentQIndex] && (
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Câu hỏi {currentQIndex + 1} / {selectedTest.questions.length}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-semibold">
                      Mức độ: {selectedTest.questions[currentQIndex].level}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {selectedTest.questions[currentQIndex].question}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {selectedTest.questions[currentQIndex].options.map((opt, i) => {
                      const qId = selectedTest.questions[currentQIndex].id;
                      const isSelected = userAnswers[qId] === opt;
                      return (
                        <button
                          key={i}
                          onClick={() => handleSelectOption(qId, opt)}
                          className={`p-4 rounded-xl border text-xs text-left font-medium transition-all cursor-pointer flex items-center gap-3 ${
                            isSelected
                              ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/40 text-pink-800 dark:text-pink-200 ring-2 ring-pink-500/30 font-bold'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300'
                          }`}
                        >
                          <span className="w-5 h-5 rounded-full border flex items-center justify-center font-bold text-[10px] shrink-0">
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Teacher Analytics & Results Dashboard */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Test Overview & Grade Roster */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Bảng điểm học sinh: {selectedTest?.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Lớp: {selectedTest?.className} • Đã nộp: {selectedTest?.results.length} bài
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Điểm TB toàn bài</div>
                  <div className="text-xl font-black text-pink-600">
                    {selectedTest?.avgScore} / 10
                  </div>
                </div>
              </div>

              {/* Results table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b text-[10px] uppercase font-bold text-slate-400">
                    <tr>
                      <th className="p-3">Học sinh</th>
                      <th className="p-3 text-center">Điểm số</th>
                      <th className="p-3">Thời gian nộp</th>
                      <th className="p-3 text-right">Đánh giá</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {selectedTest?.results.map((r, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-800 dark:text-white">{r.studentName}</td>
                        <td className="p-3 text-center font-black text-pink-600">{r.score.toFixed(1)}</td>
                        <td className="p-3 text-slate-400 text-[11px]">{new Date(r.submittedAt).toLocaleTimeString('vi-VN')}</td>
                        <td className="p-3 text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            r.score >= 8
                              ? 'bg-emerald-100 text-emerald-700'
                              : r.score >= 6.5
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}>
                            {r.score >= 8 ? 'Giỏi' : r.score >= 6.5 ? 'Khá' : 'Cần bồi dưỡng'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Error Diagnostics & Frequently Missed Analysis */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Phân tích câu thường bị học sinh làm sai
              </h3>

              <div className="space-y-3">
                {questionMissedAnalytics.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-white">
                        Câu {idx + 1} ({item.q.level})
                      </span>
                      <span className={`text-[11px] font-bold ${item.wrongPercent > 30 ? 'text-rose-600' : 'text-slate-500'}`}>
                        Tỷ lệ sai: {item.wrongPercent}%
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 line-clamp-2">
                      {item.q.question}
                    </p>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      Đáp án chuẩn: {item.q.correctAnswer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
