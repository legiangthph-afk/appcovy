import React, { useState } from 'react';
import {
  Sparkles,
  Users,
  Target,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  FileCheck,
  Edit2
} from 'lucide-react';
import { Student, ClassRoom } from '../../types';
import { generatePersonalizedRecommendation } from '../../lib/api';

interface PersonalizedLearningModuleProps {
  classes: ClassRoom[];
}

export const PersonalizedLearningModule: React.FC<PersonalizedLearningModuleProps> = ({
  classes,
}) => {
  const allStudents = classes.flatMap(c => (c.students || []).map(s => ({ ...s, className: c.name })));
  const [selectedStudent, setSelectedStudent] = useState<any>(allStudents[2] || allStudents[0]); // default to a student needing support like Lê Hoàng Nam
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);

  // Grouping students dynamically by support needs (anti-fixed-labeling)
  const needSupportGroup = allStudents.filter(s => s.avgScore < 6.5);
  const coreCompetencyGroup = allStudents.filter(s => s.avgScore >= 6.5 && s.avgScore < 8.5);
  const advancedTalentGroup = allStudents.filter(s => s.avgScore >= 8.5);

  const handleRunAnalysis = async (student: any) => {
    setSelectedStudent(student);
    setIsAnalyzing(true);
    try {
      const rec = await generatePersonalizedRecommendation({
        studentName: student.name,
        avgScore: student.avgScore,
        weakTopics: student.notes
      });
      setRecommendation(rec);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi phân tích cá nhân hóa');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-pink-600 dark:text-pink-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>MODULE 9 • CÁ NHÂN HÓA HỌC TẬP & PHÁT TRIỂN NĂNG LỰC</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Trợ Lý Phân Hóa & Đề Xuất Lộ Trình Học Tập AI
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Chẩn đoán chuẩn xác kiến thức đã nắm vững và lỗ hổng cần bù đắp theo 4 mức độ nhận thức. Không gắn nhãn cố định học sinh.
          </p>
        </div>
      </div>

      {/* 3 Dynamic Support Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tier 1: Needs foundational support */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-rose-200 dark:border-rose-900/50 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-rose-600 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              Nhóm Cần củng cố kiến thức nền ({needSupportGroup.length})
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold">
              Điểm &lt; 6.5
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Tập trung ôn luyện mức độ <b>Nhận biết</b> và <b>Thông hiểu</b>, tháo gỡ tâm lý tự ti và giao bài tập chia nhỏ.
          </p>
          <div className="space-y-1 pt-1">
            {needSupportGroup.map(s => (
              <div
                key={s.id}
                onClick={() => handleRunAnalysis(s)}
                className={`p-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors ${
                  selectedStudent?.id === s.id
                    ? 'bg-rose-500 text-white font-bold'
                    : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-800 dark:text-slate-200'
                }`}
              >
                <span>{s.name} ({s.className})</span>
                <span className="text-[11px] font-mono">{s.avgScore}đ</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 2: Solid core progressing to application */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-blue-200 dark:border-blue-900/50 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-blue-600 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              Nhóm Tăng cường vận dụng ({coreCompetencyGroup.length})
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">
              6.5 - 8.4
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Đã vững lý thuyết nền, tập trung giải các bài toán thực tiễn và rèn luyện kỹ năng làm trắc nghiệm đúng/sai.
          </p>
          <div className="space-y-1 pt-1">
            {coreCompetencyGroup.map(s => (
              <div
                key={s.id}
                onClick={() => handleRunAnalysis(s)}
                className={`p-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors ${
                  selectedStudent?.id === s.id
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-800 dark:text-slate-200'
                }`}
              >
                <span>{s.name} ({s.className})</span>
                <span className="text-[11px] font-mono">{s.avgScore}đ</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 3: Advanced problem solvers */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-emerald-600 flex items-center gap-1.5">
              <Target className="w-4 h-4" />
              Nhóm Bồi dưỡng nâng cao ({advancedTalentGroup.length})
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">
              ≥ 8.5
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Thử thách với các bài toán <b>Vận dụng cao</b>, định hướng thi học sinh giỏi và ôn luyện Đánh giá năng lực.
          </p>
          <div className="space-y-1 pt-1">
            {advancedTalentGroup.map(s => (
              <div
                key={s.id}
                onClick={() => handleRunAnalysis(s)}
                className={`p-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors ${
                  selectedStudent?.id === s.id
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-800 dark:text-slate-200'
                }`}
              >
                <span>{s.name} ({s.className})</span>
                <span className="text-[11px] font-mono">{s.avgScore}đ</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student Individualized Diagnostic Card */}
      {selectedStudent && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Lộ trình học tập của học sinh: {selectedStudent.name}
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                  {selectedStudent.className}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Điểm TB thực tế: <b>{selectedStudent.avgScore}</b> • Chuyên cần: <b>{selectedStudent.attendance}</b> • {selectedStudent.notes}
              </p>
            </div>

            <button
              onClick={() => handleRunAnalysis(selectedStudent)}
              disabled={isAnalyzing}
              className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>AI đang phân tích...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tạo lộ trình AI mới</span>
                </>
              )}
            </button>
          </div>

          {/* 4 Cognitive Levels Plan */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
              Kế hoạch rèn luyện 4 mức độ nhận thức
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 space-y-2">
                <div className="font-bold text-blue-700 dark:text-blue-300">1. Mức Nhận Biết</div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                  {recommendation?.cognitiveLevelPlan?.nhanBiet || 'Ôn lại các công thức tọa độ đỉnh I(-b/2a; -Δ/4a) và định nghĩa parabol.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 space-y-2">
                <div className="font-bold text-emerald-700 dark:text-emerald-300">2. Mức Thông Hiểu</div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                  {recommendation?.cognitiveLevelPlan?.thongHieu || 'Lập bảng biến thiên khi a > 0 và a < 0 trên các khoảng xác định.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 space-y-2">
                <div className="font-bold text-amber-700 dark:text-amber-300">3. Mức Vận Dụng</div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                  {recommendation?.cognitiveLevelPlan?.vanDung || 'Giải bài toán cực trị thực tế về diện tích rào chắn vườn và ném bóng.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/60 space-y-2">
                <div className="font-bold text-purple-700 dark:text-purple-300">4. Mức Vận Dụng Cao</div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                  {recommendation?.cognitiveLevelPlan?.vanDungCao || 'Thử thách bài toán tham số m để hàm số đồng biến trên khoảng.'}
                </p>
              </div>
            </div>
          </div>

          {/* Teacher Pedagogical Note */}
          <div className="p-4 rounded-2xl bg-pink-50/50 dark:bg-pink-950/20 border border-pink-200/60 space-y-1.5 text-xs">
            <span className="font-bold text-pink-700 dark:text-pink-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-pink-600" />
              Lời khuyên sư phạm của cô Nguyễn Thị Minh Vy:
            </span>
            <p className="text-slate-700 dark:text-slate-300">
              {recommendation?.recommendedAction || 'Cô Minh Vy khuyên em dành thêm 15 phút mỗi ngày làm bài tập trắc nghiệm trên VY EDU AI và tích cực trao đổi cùng nhóm học tập.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
