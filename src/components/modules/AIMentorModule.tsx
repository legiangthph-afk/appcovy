import React, { useState, useRef, useEffect } from 'react';
import {
  BotMessageSquare,
  Sparkles,
  Send,
  Trash2,
  BookOpen,
  Target,
  GraduationCap,
  MessageSquare,
  CheckCircle2,
  HelpCircle,
  Share2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { sendMentorMessageAI } from '../../lib/api';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export const AIMentorModule: React.FC = () => {
  const [mode, setMode] = useState<'learn' | 'practice' | 'exam'>('learn');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      role: 'model',
      content: 'Chào em! Cô VY AI Mentor – trợ lý học tập của cô Nguyễn Thị Minh Vy (THPT số 1 Tuy Phước) đây.\n\nCô luôn sẵn sàng cùng em: giải thích kiến thức, gợi ý từng bước giải bài tập, hoặc chia sẻ mẹo ghi nhớ cho kỳ thi. Em đang học chủ đề nào hoặc gặp khó khăn ở câu hỏi nào, chia sẻ cùng cô nhé!',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const reply = await sendMentorMessageAI({
        message: userText,
        mode,
        history
      });

      const aiMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'model',
        content: reply,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: `msg-err-${Date.now()}`,
        role: 'model',
        content: 'Cô tạm thời chưa nhận được tín hiệu đường truyền. Em hãy thử gửi lại câu hỏi hoặc ghi chép lại để hỏi trực tiếp cô Minh Vy trên lớp nhé!',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Em có chắc chắn muốn xóa lịch sử trò chuyện này không?')) {
      setMessages([
        {
          id: `m-init-${Date.now()}`,
          role: 'model',
          content: 'Lịch sử đã được làm mới. Em muốn khám phá bài học nào tiếp theo cùng VY AI Mentor?',
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  const handleSendTeacherFeedback = () => {
    setFeedbackSent(true);
    setTimeout(() => setFeedbackSent(false), 3000);
  };

  const samplePrompts = {
    learn: [
      'Giải thích cho em ý nghĩa thực tế của đỉnh Parabol',
      'Làm thế nào để nhớ nhanh bảng biến thiên hàm số bậc hai?',
      'Tại sao hệ số a lại quyết định bề lõm quay lên hay xuống?'
    ],
    practice: [
      'Cho em một bài tập tương tự về tìm tọa độ đỉnh và hướng dẫn em cách làm',
      'Em tính ra x = 2 nhưng đề bài ra x = -2, em sai ở bước nào?',
      'Cho em thử thách 1 câu trắc nghiệm Đúng/Sai mức độ thông hiểu'
    ],
    exam: [
      'Tóm tắt các dạng câu hỏi hàm số hay gặp trong đề thi tốt nghiệp THPT',
      'Mẹo bấm máy tính Casio kiểm tra nhanh nghiệm phương trình bậc hai',
      'Cách phân biệt nhanh các phương án bẫy trong câu hỏi trắc nghiệm'
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-pink-600 dark:text-pink-400 uppercase tracking-wider mb-1">
            <BotMessageSquare className="w-4 h-4" />
            <span>MODULE 6 • GIA SƯ AI THÔNG MINH ĐỒNG HÀNH 24/7</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>VY AI Mentor</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-950/80 dark:text-pink-300">
              Phương pháp gợi mở Socratic
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Không đưa ra lời giải ngay mà khéo léo gợi ý, dẫn dắt học sinh tự tư duy và phát triển năng lực tự học.
          </p>
        </div>

        {/* 3 Modes Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border">
          <button
            onClick={() => setMode('learn')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              mode === 'learn'
                ? 'bg-white dark:bg-slate-900 text-pink-600 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>1. Học cùng AI</span>
          </button>
          <button
            onClick={() => setMode('practice')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              mode === 'practice'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>2. Luyện tập</span>
          </button>
          <button
            onClick={() => setMode('exam')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              mode === 'exam'
                ? 'bg-white dark:bg-slate-900 text-amber-600 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>3. Ôn thi THPT</span>
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col h-[650px]">
        {/* Chat Sub-bar */}
        <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Đang hoạt động: {mode === 'learn' ? 'Chế độ giảng giải gợi mở' : mode === 'practice' ? 'Chế độ luyện tập giải bài' : 'Chế độ tóm tắt kiến thức ôn thi'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSendTeacherFeedback}
              className="text-slate-500 hover:text-pink-600 flex items-center gap-1 cursor-pointer"
              title="Gửi câu hỏi này tới cô giáo Minh Vy"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{feedbackSent ? 'Đã gửi cô giáo ✓' : 'Gửi phản hồi cho GV'}</span>
            </button>
            <button
              onClick={handleClearHistory}
              className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
              title="Xóa lịch sử trò chuyện"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-2xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold shadow ${
                  isUser
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gradient-to-tr from-pink-500 to-rose-600 text-white'
                }`}>
                  {isUser ? 'HS' : 'VY'}
                </div>

                {/* Message Bubble */}
                <div className="space-y-1">
                  <div className={`p-4 rounded-2xl text-xs sm:text-sm whitespace-pre-wrap leading-relaxed shadow-sm ${
                    isUser
                      ? 'bg-slate-900 dark:bg-pink-900/60 text-white rounded-tr-none'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-none'
                  }`}>
                    {m.content}
                  </div>
                  <div className={`text-[10px] text-slate-400 px-1 ${isUser ? 'text-right' : ''}`}>
                    {m.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-xl">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-rose-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                VY
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border text-xs text-slate-500 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-pink-600" />
                <span>Cô VY AI Mentor đang suy nghĩ câu hỏi dẫn dắt cho em...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-6 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-400 shrink-0 font-semibold">Gợi ý câu hỏi:</span>
          {samplePrompts[mode].map((prompt, i) => (
            <button
              key={i}
              onClick={() => { setInput(prompt); }}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-pink-500 hover:text-pink-600 shrink-0 transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Hỏi VY AI Mentor về bài tập, công thức hoặc cách giải..."
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-pink-500/30 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 text-white font-bold text-xs shadow-lg shadow-pink-500/25 disabled:opacity-40 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Gửi</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
