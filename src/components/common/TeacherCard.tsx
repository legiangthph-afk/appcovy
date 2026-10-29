import React from 'react';
import { Award, BookOpen, GraduationCap, Sparkles, School, HeartHandshake } from 'lucide-react';
import { TeacherProfile } from '../../types';

interface TeacherCardProps {
  profile: TeacherProfile;
  onOpenProfile: () => void;
}

export const TeacherCard: React.FC<TeacherCardProps> = ({ profile, onOpenProfile }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 shadow-xl border border-slate-800">
      {/* Decorative background glows */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Avatar with gold border and status badge */}
        <div className="relative group shrink-0">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden ring-4 ring-amber-400/80 shadow-2xl bg-gradient-to-tr from-pink-600 to-indigo-700 flex items-center justify-center text-white">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-rose-500 via-pink-600 to-indigo-800 p-2 text-center">
                <span className="text-3xl font-extrabold tracking-tight">VY</span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-pink-200 mt-1">THPT Tuy Phước</span>
              </div>
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-xs font-bold px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1 border border-amber-200">
            <Sparkles className="w-3 h-3" />
            <span>AI Lead</span>
          </div>
        </div>

        {/* Info & Pedagogical motto */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
              Giáo viên THPT
            </span>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
              <School className="w-3 h-3" />
              {profile.school}
            </span>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Năm học {profile.schoolYear}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center justify-center md:justify-start gap-2">
            Cô {profile.name}
          </h2>

          <p className="mt-2 text-sm text-pink-200 italic flex items-center justify-center md:justify-start gap-2 bg-white/5 py-1.5 px-3 rounded-lg border border-white/10 max-w-xl">
            <HeartHandshake className="w-4 h-4 text-pink-400 shrink-0" />
            "{profile.motto}"
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <BookOpen className="w-3.5 h-3.5 text-pink-400" />
              <span>Môn: <b>{profile.subjects.join(', ')}</b></span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span>Phụ trách: <b>{profile.assignedClasses.join(', ')}</b></span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <Award className="w-3.5 h-3.5 text-yellow-400" />
              <span>Giáo viên giỏi cấp Tỉnh</span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="shrink-0 flex flex-col gap-2">
          <button
            onClick={onOpenProfile}
            className="px-4 py-2 text-xs font-medium rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-lg transition-all hover:scale-102 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Xem hồ sơ & cập nhật ảnh</span>
          </button>
        </div>
      </div>
    </div>
  );
};
