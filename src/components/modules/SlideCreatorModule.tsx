import React, { useState } from 'react';
import {
  Presentation,
  Sparkles,
  Download,
  Play,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  RefreshCw,
  Edit2,
  Check
} from 'lucide-react';
import { SlideDeck, SlideItem } from '../../types';
import { generateSlidesAI } from '../../lib/api';
import { exportSlideDeckToHtml } from '../../lib/exportUtils';

interface SlideCreatorModuleProps {
  decks: SlideDeck[];
  onSaveDeck: (deck: SlideDeck) => void;
  onDeleteDeck: (deckId: string) => void;
}

export const SlideCreatorModule: React.FC<SlideCreatorModuleProps> = ({
  decks,
  onSaveDeck,
  onDeleteDeck,
}) => {
  const [selectedDeck, setSelectedDeck] = useState<SlideDeck>(decks[0] || null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingSlide, setEditingSlide] = useState<SlideItem | null>(null);

  const [form, setForm] = useState({
    topic: 'Hàm số bậc hai và Ứng dụng thực tế',
    subject: 'Toán học',
    grade: '10',
    slideCount: 6,
    contentBrief: 'Nhấn mạnh tọa độ đỉnh, trục đối xứng và ví dụ bài toán cổng vòm parabol Tuy Phước.'
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const generated = await generateSlidesAI(form);
      const newDeck: SlideDeck = {
        ...generated,
        id: `sd-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setSelectedDeck(newDeck);
      setActiveSlideIndex(0);
      onSaveDeck(newDeck);
    } catch (err: any) {
      alert(err.message || 'Lỗi tạo bài trình chiếu');
    } finally {
      setIsGenerating(false);
    }
  };

  const currentSlide = selectedDeck?.slides[activeSlideIndex];

  const handleUpdateCurrentSlide = (updated: SlideItem) => {
    if (!selectedDeck) return;
    const updatedSlides = [...selectedDeck.slides];
    updatedSlides[activeSlideIndex] = updated;
    const updatedDeck = { ...selectedDeck, slides: updatedSlides };
    setSelectedDeck(updatedDeck);
    onSaveDeck(updatedDeck);
    setEditingSlide(null);
  };

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-pink-600 dark:text-pink-400 uppercase tracking-wider mb-1">
            <Presentation className="w-4 h-4" />
            <span>MODULE 3 • BÀI TRÌNH CHIẾU TƯƠNG TÁC THPT</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            AI Thiết Kế Bài Trình Chiếu Giảng Dạy
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tự động tạo cấu trúc 8 bước sư phạm chuẩn GDPT 2018. Hỗ trợ xem trước, sửa nội dung và trình chiếu trực tiếp trên lớp.
          </p>
        </div>

        {selectedDeck && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsFullscreen(true)}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-pink-600 hover:bg-pink-700 text-white shadow-lg shadow-pink-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Bật chế độ Trình chiếu</span>
            </button>
            <button
              onClick={() => exportSlideDeckToHtml(selectedDeck)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow transition-all flex items-center gap-1.5 cursor-pointer"
              title="Xuất file trình chiếu HTML5 mở trên mọi thiết bị"
            >
              <Download className="w-3.5 h-3.5 text-pink-400" />
              <span>Xuất Tệp Trình Chiếu</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input & Deck List */}
        <div className="lg:col-span-4 space-y-6">
          {/* Generator Form */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-600" />
              <span>Tạo bộ slide mới bằng AI</span>
            </h3>

            <form onSubmit={handleGenerate} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">Chủ đề bài giảng</label>
                <input
                  type="text"
                  required
                  value={form.topic}
                  onChange={e => setForm({ ...form, topic: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

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
                  </select>
                </div>
                <div>
                  <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">Số lượng slide</label>
                  <select
                    value={form.slideCount}
                    onChange={e => setForm({ ...form, slideCount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value={5}>5 slide (Ngắn gọn)</option>
                    <option value={6}>6 slide (Chuẩn 1 tiết)</option>
                    <option value={8}>8 slide (Chi tiết)</option>
                    <option value={10}>10 slide (Chuyên đề)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">Nội dung bài học cần nhấn mạnh</label>
                <textarea
                  rows={2}
                  value={form.contentBrief}
                  onChange={e => setForm({ ...form, contentBrief: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-pink-400" />
                    <span>AI đang tạo bộ slide...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                    <span>Tạo Slide Trình Chiếu</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Decks List */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Các bộ slide đã lưu ({decks.length})
            </h4>
            <div className="space-y-1.5">
              {decks.map(d => (
                <div
                  key={d.id}
                  onClick={() => { setSelectedDeck(d); setActiveSlideIndex(0); }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 text-xs ${
                    selectedDeck?.id === d.id
                      ? 'border-pink-500 bg-pink-50/50 dark:bg-pink-950/20 font-bold'
                      : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <div className="truncate">
                    <div className="text-slate-900 dark:text-white truncate">{d.title}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{d.slides.length} slide • Khối {d.grade}</div>
                  </div>
                  {decks.length > 1 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteDeck(d.id); }}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Slide Interactive Player & Canvas View */}
        <div className="lg:col-span-8 space-y-4">
          {selectedDeck && currentSlide ? (
            <div className="space-y-4">
              {/* Slide Screen (16:9 Aspect Ratio) */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-10 flex flex-col justify-between">
                {/* Decorative header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-500 text-white uppercase tracking-wider">
                      Slide {activeSlideIndex + 1} / {selectedDeck.slides.length}
                    </span>
                    <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                      Cô Nguyễn Thị Minh Vy • THPT số 1 Tuy Phước
                    </span>
                  </div>
                  <button
                    onClick={() => setEditingSlide(currentSlide)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Sửa slide này</span>
                  </button>
                </div>

                {/* Slide Main Content */}
                <div className="my-auto py-4 space-y-4">
                  <div>
                    <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-pink-200">
                      {currentSlide.title}
                    </h2>
                    {currentSlide.subtitle && (
                      <p className="text-xs sm:text-base text-slate-300 mt-1 font-medium">
                        {currentSlide.subtitle}
                      </p>
                    )}
                  </div>

                  <ul className="space-y-2.5 sm:space-y-3.5 text-xs sm:text-lg text-slate-100 max-w-2xl">
                    {currentSlide.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="text-amber-400 font-bold shrink-0 mt-0.5">✦</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Slide Teacher Pedagogical Notes Footer */}
                <div className="bg-slate-900/80 border border-white/10 p-2.5 rounded-xl text-[11px] text-slate-300 flex items-center justify-between gap-2">
                  <span className="truncate">
                    💡 <b>Gợi ý sư phạm:</b> {currentSlide.teacherNotes || 'Khuyến khích học sinh trao đổi theo nhóm bàn.'}
                  </span>
                  <span className="text-[10px] text-pink-400 shrink-0 uppercase font-semibold">
                    {currentSlide.type}
                  </span>
                </div>
              </div>

              {/* Slide Navigation Controls */}
              <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <button
                  disabled={activeSlideIndex === 0}
                  onClick={() => setActiveSlideIndex(activeSlideIndex - 1)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Trang trước</span>
                </button>

                {/* Thumbnail Dots */}
                <div className="flex items-center gap-1.5 overflow-x-auto px-2">
                  {selectedDeck.slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveSlideIndex(i)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeSlideIndex === i
                          ? 'bg-pink-600 text-white shadow'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  disabled={activeSlideIndex === selectedDeck.slides.length - 1}
                  onClick={() => setActiveSlideIndex(activeSlideIndex + 1)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                >
                  <span>Trang sau</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border text-center text-slate-400">
              Chưa có slide nào được chọn.
            </div>
          )}
        </div>
      </div>

      {/* In-line Slide Editor Modal */}
      {editingSlide && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Chỉnh sửa nội dung Slide {activeSlideIndex + 1}
              </h3>
              <button onClick={() => setEditingSlide(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">Tiêu đề slide</label>
                <input
                  type="text"
                  value={editingSlide.title}
                  onChange={e => setEditingSlide({ ...editingSlide, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">Phụ đề</label>
                <input
                  type="text"
                  value={editingSlide.subtitle}
                  onChange={e => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">Các ý chính (mỗi ý 1 dòng)</label>
                <textarea
                  rows={4}
                  value={editingSlide.bullets.join('\n')}
                  onChange={e => setEditingSlide({ ...editingSlide, bullets: e.target.value.split('\n').filter(Boolean) })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs"
                />
              </div>
              <div>
                <label className="font-semibold block text-slate-700 dark:text-slate-300 mb-1">Gợi ý sư phạm cho giáo viên</label>
                <input
                  type="text"
                  value={editingSlide.teacherNotes}
                  onChange={e => setEditingSlide({ ...editingSlide, teacherNotes: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingSlide(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                onClick={() => handleUpdateCurrentSlide(editingSlide)}
                className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Cập nhật Slide</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Live Presentation Mode */}
      {isFullscreen && selectedDeck && currentSlide && (
        <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between p-8 sm:p-14 select-none">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <span className="font-extrabold text-pink-400 text-sm">VY EDU AI PRESENTER</span>
              <span>•</span>
              <span>{selectedDeck.title}</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Nhấn phím mũi tên [◀ / ▶] để chuyển trang</span>
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Thoát</span>
              </button>
            </div>
          </div>

          {/* Slide Stage */}
          <div className="my-auto max-w-4xl mx-auto w-full space-y-6">
            <div>
              <div className="text-amber-400 text-sm font-bold uppercase tracking-widest mb-1">
                Slide {activeSlideIndex + 1} / {selectedDeck.slides.length}
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-pink-100 tracking-tight leading-tight">
                {currentSlide.title}
              </h1>
              {currentSlide.subtitle && (
                <p className="text-lg sm:text-xl text-slate-300 mt-2 font-medium">
                  {currentSlide.subtitle}
                </p>
              )}
            </div>

            <ul className="space-y-4 text-lg sm:text-2xl text-slate-200">
              {currentSlide.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="text-amber-400 font-bold shrink-0">✦</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom Bar */}
          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            <button
              disabled={activeSlideIndex === 0}
              onClick={() => setActiveSlideIndex(activeSlideIndex - 1)}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-semibold disabled:opacity-30 cursor-pointer"
            >
              ◀ Slide trước
            </button>
            <div className="text-xs text-slate-400">
              Trường THPT số 1 Tuy Phước • Cô Nguyễn Thị Minh Vy
            </div>
            <button
              disabled={activeSlideIndex === selectedDeck.slides.length - 1}
              onClick={() => setActiveSlideIndex(activeSlideIndex + 1)}
              className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold disabled:opacity-30 cursor-pointer"
            >
              Slide tiếp ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
