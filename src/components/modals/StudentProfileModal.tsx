import React from 'react';
import {
  X,
  User,
  BookOpen,
  Award,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Student } from '../../types';

interface StudentProfileModalProps {
  student: (Student & { className?: string }) | null;
  onClose: () => void;
  onNavigatePersonalize: (student: any) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  onClose,
  onNavigatePersonalize,
}) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center font-bold text-base">
              {student.name.split(' ').map(n => n[0]).slice(-2).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{student.name}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {student.code}
                </span>
              </div>
              <div className="text-xs text-slate-400">
                {student.className || 'Lớp THPT'} • {student.group}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Academic Highlights */}
        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border">
            <span className="text-slate-400 block mb-1">Điểm TB</span>
            <span className="text-xl font-black text-pink-600">{student.avgScore.toFixed(1)}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border">
            <span className="text-slate-400 block mb-1">Chuyên cần</span>
            <span className="text-xl font-black text-indigo-600">{student.attendance}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border">
            <span className="text-slate-400 block mb-1">Xếp loại</span>
            <span className={`text-xs font-bold block mt-1 ${student.needSupport ? 'text-rose-600' : 'text-emerald-600'}`}>
              {student.status}
            </span>
          </div>
        </div>

        {/* Pedagogical Observations */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border text-xs space-y-2">
          <div className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-pink-600" />
            <span>Nhận xét sư phạm & Lịch sử học tập:</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {student.notes || 'Học sinh có ý thức học tập tốt, hoàn thành đầy đủ bài tập được giao.'}
          </p>
          <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-200/60 dark:border-slate-700">
            Trường THPT số 1 Tuy Phước • Giáo viên phụ trách: Cô Nguyễn Thị Minh Vy
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Đóng
          </button>
          <button
            onClick={() => {
              onClose();
              onNavigatePersonalize(student);
            }}
            className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Xem lộ trình cá nhân hóa</span>
          </button>
        </div>
      </div>
    </div>
  );
};
