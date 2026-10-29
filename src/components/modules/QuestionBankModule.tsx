import React, { useState } from 'react';
import {
  Database,
  Sparkles,
  Filter,
  Search,
  CheckCircle2,
  Trash2,
  Plus,
  RefreshCw,
  HelpCircle,
  Tag,
  BookOpen,
  Download
} from 'lucide-react';
import { QuestionItem, CognitiveLevel, QuestionType } from '../../types';
import { generateQuestionsAI } from '../../lib/api';

interface QuestionBankModuleProps {
  questions: QuestionItem[];
  onAddQuestions: (newQuestions: QuestionItem[]) => void;
  onDeleteQuestion: (id: string) => void;
  onUpdateQuestion: (question: QuestionItem) => void;
}

export const QuestionBankModule: React.FC<QuestionBankModuleProps> = ({
  questions,
  onAddQuestions,
  onDeleteQuestion,
  onUpdateQuestion
}) => {
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // AI Generator Form
  const [form, setForm] = useState({
    subject: 'Toán học',
    grade: '10',
    topic: 'Hàm số bậc hai và giải bài toán thực tế',
    level: 'Thông hiểu' as CognitiveLevel,
    type: 'multiple-choice' as QuestionType,
    count: 3
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const generated = await generateQuestionsAI(form);
      const tagged = generated.map((q, idx) => ({
        ...q,
        id: `qb-${Date.now()}-${idx}`,
        approved: true
      }));
      onAddQuestions(tagged);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi tạo câu hỏi');
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredQuestions = questions.filter(q => {
    if (filterLevel !== 'all' && q.level !== filterLevel) return false;
    if (filterType !== 'all' && q.type !== filterType) return false;
    if (searchQuery.trim()) {
      const qText = (q.question + q.topic + q.explanation).toLowerCase();
      if (!qText.includes(searchQuery.toLowerCase())) return false;
    }
    return true;
  });

  const cognitiveLevels: CognitiveLevel[] = ['Nhận biết', 'Thông hiểu', 'Vận dụng', 'Vận dụng cao'];

  const typeLabels: Record<QuestionType, string> = {
    'multiple-choice': 'Trắc nghiệm 4 lựa chọn',
    'true-false': 'Trắc nghiệm Đúng/Sai (Mẫu 2025)',
    'short-answer': 'Trả lời ngắn',
    'essay': 'Tự luận',
    'case-study': 'Bài tập tình huống'
  };

  const getLevelBadgeClass = (lvl: CognitiveLevel) => {
    switch (lvl) {
      case 'Nhận biết': return 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200';
      case 'Thông hiểu': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200';
      case 'Vận dụng': return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200';
      case 'Vận dụng cao': return 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200';
    }
  };

  const handleExportBank = () => {
    const json = JSON.stringify(filteredQuestions, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ngan_Hang_Cau_Hoi_THPT_Tuy_Phuoc_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-pink-600 dark:text-pink-400 uppercase tracking-wider mb-1">
            <Database className="w-4 h-4" />
            <span>MODULE 4 • NGÂN HÀNG CÂU HỎI VÀ ĐỀ THI ĐỔI MỚI</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Ngân Hàng Câu Hỏi AI Theo 4 Mức Độ Nhận Thức
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Đáp ứng cấu trúc đề thi tốt nghiệp THPT và kiểm tra đánh giá định dạng mới: Trắc nghiệm 4 phương án, Đúng/Sai, Trả lời ngắn & Tình huống.
          </p>
        </div>

        <button
          onClick={handleExportBank}
          className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Download className="w-3.5 h-3.5 text-pink-400" />
          <span>Xuất ngân hàng câu hỏi ({filteredQuestions.length})</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Generator Settings */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-600" />
              <span>Khởi tạo câu hỏi bằng AI</span>
            </h3>

            <form onSubmit={handleGenerate} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">Môn học</label>
                  <select
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Toán học">Toán học</option>
                    <option value="Tin học">Tin học</option>
                    <option value="Vật lí">Vật lí</option>
                    <option value="Hóa học">Hóa học</option>
                    <option value="Sinh học">Sinh học</option>
                    <option value="Ngữ văn">Ngữ văn</option>
                    <option value="Tiếng Anh">Tiếng Anh</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">Khối lớp</label>
                  <select
                    value={form.grade}
                    onChange={e => setForm({ ...form, grade: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="10">Lớp 10</option>
                    <option value="11">Lớp 11</option>
                    <option value="12">Lớp 12</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">Chủ đề bài học</label>
                <input
                  type="text"
                  required
                  value={form.topic}
                  onChange={e => setForm({ ...form, topic: e.target.value })}
                  placeholder="Ví dụ: Hàm số bậc hai, Lượng giác..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">Mức độ nhận thức</label>
                  <select
                    value={form.level}
                    onChange={e => setForm({ ...form, level: e.target.value as CognitiveLevel })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {cognitiveLevels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">Số lượng câu</label>
                  <select
                    value={form.count}
                    onChange={e => setForm({ ...form, count: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value={2}>2 câu</option>
                    <option value={3}>3 câu</option>
                    <option value={5}>5 câu</option>
                    <option value={8}>8 câu</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">Định dạng câu hỏi</label>
                <select
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value as QuestionType })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="multiple-choice">Trắc nghiệm 4 lựa chọn</option>
                  <option value="true-false">Trắc nghiệm Đúng/Sai (Định dạng mới)</option>
                  <option value="short-answer">Trả lời ngắn</option>
                  <option value="case-study">Bài tập tình huống thực tế</option>
                  <option value="essay">Tự luận / Trình bày các bước</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-xs shadow-lg shadow-pink-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-300" />
                    <span>AI đang phân tích ma trận và tạo câu hỏi...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Tạo câu hỏi vào Ngân hàng</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Question List & Filter Toolbar */}
        <div className="lg:col-span-8 space-y-4">
          {/* Filters Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm câu hỏi, chủ đề hoặc giải thích..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            {/* Level filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Mức độ:</span>
              <select
                value={filterLevel}
                onChange={e => setFilterLevel(e.target.value)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="all">Tất cả mức độ</option>
                {cognitiveLevels.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            {/* Type filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Loại:</span>
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="all">Tất cả loại câu</option>
                <option value="multiple-choice">Trắc nghiệm 4 lựa chọn</option>
                <option value="true-false">Trắc nghiệm Đúng/Sai</option>
                <option value="short-answer">Trả lời ngắn</option>
                <option value="case-study">Bài tập tình huống</option>
              </select>
            </div>
          </div>

          {/* Question Cards List */}
          <div className="space-y-4">
            {filteredQuestions.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl border text-center text-slate-400 text-xs">
                Không tìm thấy câu hỏi phù hợp. Hãy điều chỉnh bộ lọc hoặc tạo câu hỏi mới bằng AI.
              </div>
            ) : (
              filteredQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-slate-800 dark:text-white">
                        Câu #{idx + 1}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full font-bold border text-[10px] ${getLevelBadgeClass(q.level)}`}>
                        {q.level}
                      </span>
                      <span className="px-2 py-0.5 rounded-full font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px]">
                        {typeLabels[q.type] || q.type}
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        {q.subject} • Khối {q.grade} • {q.topic}
                      </span>
                    </div>

                    <button
                      onClick={() => onDeleteQuestion(q.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                      title="Xóa câu hỏi"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Question content */}
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    {q.question}
                  </div>

                  {/* Options */}
                  {q.options && q.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt, i) => {
                        const isCorrect = opt.trim() === q.correctAnswer.trim() || opt.startsWith(q.correctAnswer);
                        return (
                          <div
                            key={i}
                            className={`p-2 rounded-xl border text-xs flex items-center gap-2 ${
                              isCorrect
                                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 font-semibold'
                                : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span>{opt}</span>
                            {isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-auto shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Answer & Explanation Box */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 space-y-1">
                    <div className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Đáp án chính xác: <b>{q.correctAnswer}</b></span>
                    </div>
                    {q.explanation && (
                      <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                        💡 <b>Lời giải chi tiết & bẫy thường gặp:</b> {q.explanation}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
