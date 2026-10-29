import React, { useState } from 'react';
import {
  Sparkles,
  Download,
  Printer,
  CheckCircle2,
  Edit3,
  Save,
  BookOpen,
  Clock,
  Layers,
  FileText,
  RefreshCw,
  Plus,
  Trash2
} from 'lucide-react';
import { LessonPlan } from '../../types';
import { generateLessonPlanAI } from '../../lib/api';
import { exportLessonPlanToWord } from '../../lib/exportUtils';

interface LessonPlannerModuleProps {
  plans: LessonPlan[];
  onSavePlan: (plan: LessonPlan) => void;
  onDeletePlan: (planId: string) => void;
}

export const LessonPlannerModule: React.FC<LessonPlannerModuleProps> = ({
  plans,
  onSavePlan,
  onDeletePlan
}) => {
  const [selectedPlan, setSelectedPlan] = useState<LessonPlan>(plans[0] || null);
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editFormData, setEditFormData] = useState<LessonPlan | null>(null);

  // Form input state for generating a new lesson plan
  const [form, setForm] = useState({
    subject: 'Toán học',
    grade: '10',
    lessonName: 'Hàm số bậc hai và đồ thị',
    textbook: 'Kết nối tri thức với cuộc sống',
    duration: '90 phút (2 tiết)',
    requirements: 'Học sinh nhận biết khái niệm hàm số bậc hai, vẽ được đồ thị và ứng dụng giải bài toán thực tế quỹ đạo chuyển động.',
    method: 'Dạy học giải quyết vấn đề kết hợp phương pháp trò chơi số hóa',
    classTraits: 'Lớp 10A1 học sinh năng động, thích thực hành số và làm việc nhóm.'
  });

  const subjects = ['Toán học', 'Tin học', 'Vật lí', 'Hóa học', 'Sinh học', 'Ngữ văn', 'Tiếng Anh', 'Lịch sử', 'Địa lí', 'GD Kinh tế & Pháp luật', 'Công nghệ'];
  const textbooks = ['Kết nối tri thức với cuộc sống', 'Cánh diều', 'Chân trời sáng tạo'];
  const methods = [
    'Dạy học giải quyết vấn đề kết hợp công nghệ',
    'Dạy học theo dự án (Project-based learning)',
    'Phương pháp trạm và kỹ thuật khăn trải bàn',
    'Phương pháp Bàn tay nặn bột (khoa học thực nghiệm)',
    'Dạy học tích hợp STEM và mô hình hóa thực tế'
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const generated = await generateLessonPlanAI(form);
      const newPlan: LessonPlan = {
        ...generated,
        id: `lp-${Date.now()}`,
        status: 'Bản nháp AI (Chờ duyệt)',
        createdAt: new Date().toISOString(),
      };
      setSelectedPlan(newPlan);
      onSavePlan(newPlan);
      setEditFormData(newPlan);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi tạo giáo án');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApprovePlan = () => {
    if (!selectedPlan) return;
    const updated = { ...selectedPlan, status: 'Đã duyệt sư phạm (Sẵn sàng dạy)' };
    setSelectedPlan(updated);
    onSavePlan(updated);
  };

  const handleStartEdit = () => {
    if (!selectedPlan) return;
    setEditFormData(JSON.parse(JSON.stringify(selectedPlan)));
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!editFormData) return;
    setSelectedPlan(editFormData);
    onSavePlan(editFormData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-pink-600 dark:text-pink-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>MODULE 2 • THIẾT KẾ KẾ HOẠCH BÀI DẠY (CÔNG VĂN 5512/BGDĐT)</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Trợ lý AI Soạn Giáo Án Chuẩn CTGDPT 2018
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tạo tiến trình 4 hoạt động chuẩn sư phạm: Khởi động - Hình thành kiến thức - Luyện tập - Vận dụng. Giáo viên duyệt trước khi sử dụng.
          </p>
        </div>

        {selectedPlan && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => exportLessonPlanToWord(selectedPlan)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow transition-all flex items-center gap-1.5 cursor-pointer"
              title="Xuất file Word chuẩn văn phòng"
            >
              <Download className="w-3.5 h-3.5 text-pink-400" />
              <span>Xuất DOCX/Word</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In / Xuất PDF</span>
            </button>
            {selectedPlan.status !== 'Đã duyệt sư phạm (Sẵn sàng dạy)' && (
              <button
                onClick={handleApprovePlan}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Duyệt giáo án</span>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Saved List */}
        <div className="lg:col-span-5 space-y-6">
          {/* Generator Form */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-600" />
              Thiết lập thông số giáo án mới
            </h3>

            <form onSubmit={handleGenerate} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Môn học</label>
                  <select
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Khối lớp</label>
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
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Tên bài học / Chủ đề</label>
                <input
                  type="text"
                  required
                  value={form.lessonName}
                  onChange={e => setForm({ ...form, lessonName: e.target.value })}
                  placeholder="Ví dụ: Hàm số bậc hai và đồ thị..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Bộ sách giáo khoa</label>
                  <select
                    value={form.textbook}
                    onChange={e => setForm({ ...form, textbook: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {textbooks.map(tb => <option key={tb} value={tb}>{tb}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Thời lượng tiết học</label>
                  <select
                    value={form.duration}
                    onChange={e => setForm({ ...form, duration: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="45 phút (1 tiết)">45 phút (1 tiết)</option>
                    <option value="90 phút (2 tiết)">90 phút (2 tiết)</option>
                    <option value="135 phút (3 tiết)">135 phút (3 tiết)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Yêu cầu cần đạt chuẩn GDPT 2018</label>
                <textarea
                  rows={2}
                  value={form.requirements}
                  onChange={e => setForm({ ...form, requirements: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Phương pháp giảng dạy mong muốn</label>
                <select
                  value={form.method}
                  onChange={e => setForm({ ...form, method: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {methods.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Đặc điểm lớp học</label>
                <input
                  type="text"
                  value={form.classTraits}
                  onChange={e => setForm({ ...form, classTraits: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-xs shadow-lg shadow-pink-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>AI đang phân tích chương trình và soạn bài...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Khởi tạo Kế hoạch bài dạy bằng AI</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Saved Lesson Plans list */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
              <span>Danh sách giáo án đã lưu ({plans.length})</span>
            </h3>

            <div className="space-y-2">
              {plans.map(p => {
                const isCur = selectedPlan?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => { setSelectedPlan(p); setIsEditing(false); }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-xs ${
                      isCur
                        ? 'border-pink-500 bg-pink-50/50 dark:bg-pink-950/20 shadow-sm'
                        : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="truncate">
                      <div className="font-bold text-slate-800 dark:text-white truncate">{p.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {p.subject} • Khối {p.grade} • {p.duration}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        p.status.includes('Đã duyệt')
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}>
                        {p.status.includes('Đã duyệt') ? 'Đã duyệt' : 'Bản nháp'}
                      </span>
                      {plans.length > 1 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onDeletePlan(p.id); }}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Full Lesson Plan Document Preview & In-line Editor */}
        <div className="lg:col-span-7">
          {selectedPlan ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
              {/* Document Header & Edit Action Bar */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/40">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-pink-600" />
                  <span className="font-bold text-xs text-slate-800 dark:text-white">
                    {isEditing ? 'Đang chỉnh sửa kế hoạch bài dạy' : 'Bản xem trước kế hoạch bài dạy'}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    selectedPlan.status.includes('Đã duyệt') ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                  }`}>
                    {selectedPlan.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <button
                      onClick={handleSaveEdit}
                      className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow flex items-center gap-1 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Lưu thay đổi</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStartEdit}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Sửa nội dung</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Document Content View */}
              <div className="p-6 md:p-8 space-y-6 text-sm text-slate-800 dark:text-slate-200 max-h-[800px] overflow-y-auto">
                {/* Official Title Box */}
                <div className="text-center pb-4 border-b border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-xs font-semibold text-slate-500 uppercase">
                    Sở GD&ĐT Bình Định • Trường THPT số 1 Tuy Phước
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                    {selectedPlan.title}
                  </h2>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Môn: <b>{selectedPlan.subject}</b> • Khối: <b>{selectedPlan.grade}</b> • Bộ sách: <b>{selectedPlan.textbook}</b> • Thời lượng: <b>{selectedPlan.duration}</b>
                  </div>
                  <div className="text-xs text-pink-600 font-medium">
                    Giáo viên thực hiện: Cô Nguyễn Thị Minh Vy
                  </div>
                </div>

                {/* Section I: Objectives */}
                <div className="space-y-2">
                  <h3 className="font-extrabold text-sm text-indigo-900 dark:text-indigo-400 uppercase tracking-wide">
                    I. MỤC TIÊU DẠY HỌC (CHUẨN GDPT 2018)
                  </h3>
                  {isEditing && editFormData ? (
                    <div className="space-y-2 text-xs">
                      <div>
                        <label className="font-semibold block text-slate-600">1. Kiến thức:</label>
                        <textarea
                          rows={2}
                          value={editFormData.content.mucTieu.kienThuc}
                          onChange={e => setEditFormData({
                            ...editFormData,
                            content: { ...editFormData.content, mucTieu: { ...editFormData.content.mucTieu, kienThuc: e.target.value } }
                          })}
                          className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        />
                      </div>
                      <div>
                        <label className="font-semibold block text-slate-600">2. Năng lực:</label>
                        <textarea
                          rows={2}
                          value={editFormData.content.mucTieu.nangLuc}
                          onChange={e => setEditFormData({
                            ...editFormData,
                            content: { ...editFormData.content, mucTieu: { ...editFormData.content.mucTieu, nangLuc: e.target.value } }
                          })}
                          className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        />
                      </div>
                      <div>
                        <label className="font-semibold block text-slate-600">3. Phẩm chất:</label>
                        <input
                          type="text"
                          value={editFormData.content.mucTieu.phamChat}
                          onChange={e => setEditFormData({
                            ...editFormData,
                            content: { ...editFormData.content, mucTieu: { ...editFormData.content.mucTieu, phamChat: e.target.value } }
                          })}
                          className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs space-y-1.5 pl-3 border-l-2 border-indigo-400">
                      <p><b>1. Về kiến thức:</b> {selectedPlan.content.mucTieu.kienThuc}</p>
                      <p><b>2. Về năng lực:</b> {selectedPlan.content.mucTieu.nangLuc}</p>
                      <p><b>3. Về phẩm chất:</b> {selectedPlan.content.mucTieu.phamChat}</p>
                    </div>
                  )}
                </div>

                {/* Section II: Equipment & Materials */}
                <div className="space-y-2">
                  <h3 className="font-extrabold text-sm text-indigo-900 dark:text-indigo-400 uppercase tracking-wide">
                    II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU
                  </h3>
                  <div className="text-xs space-y-1 pl-3 border-l-2 border-pink-400">
                    <p><b>1. Chuẩn bị của giáo viên:</b> {selectedPlan.content.chuanBi.giaoVien}</p>
                    <p><b>2. Chuẩn bị của học sinh:</b> {selectedPlan.content.chuanBi.hocSinh}</p>
                  </div>
                </div>

                {/* Section III: Pedagogical Flow CV 5512 */}
                <div className="space-y-4">
                  <h3 className="font-extrabold text-sm text-indigo-900 dark:text-indigo-400 uppercase tracking-wide">
                    III. TIẾN TRÌNH DẠY HỌC (CÔNG VĂN 5512/BGDĐT)
                  </h3>

                  <div className="space-y-4">
                    {selectedPlan.content.tienTrinh.map((act, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
                        <div className="font-bold text-sm text-pink-700 dark:text-pink-400 flex items-center justify-between">
                          <span>{act.buoc}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          <div className="space-y-1">
                            <span className="font-bold text-slate-700 dark:text-slate-300">a) Mục tiêu:</span>
                            <p className="text-slate-600 dark:text-slate-400">{act.mucTieu}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="font-bold text-slate-700 dark:text-slate-300">b) Nội dung nhiệm vụ:</span>
                            <p className="text-slate-600 dark:text-slate-400">{act.noiDung}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="font-bold text-slate-700 dark:text-slate-300">c) Sản phẩm học tập:</span>
                            <p className="text-slate-600 dark:text-slate-400">{act.sanPham}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="font-bold text-slate-700 dark:text-slate-300">d) Tổ chức thực hiện:</span>
                            <p className="text-slate-600 dark:text-slate-400">{act.toChuc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section IV: Assessment & Self-study */}
                <div className="space-y-2">
                  <h3 className="font-extrabold text-sm text-indigo-900 dark:text-indigo-400 uppercase tracking-wide">
                    IV. ĐÁNH GIÁ VÀ HƯỚNG DẪN TỰ HỌC
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 pl-3 border-l-2 border-emerald-400">
                    {selectedPlan.content.danhGia}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-center text-slate-400">
              Chưa chọn giáo án. Hãy tạo mới bằng AI hoặc chọn từ danh sách bên trái.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
