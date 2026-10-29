import React, { useState } from 'react';
import {
  UserCheck,
  Award,
  School,
  BookOpen,
  GraduationCap,
  Sparkles,
  Camera,
  Save,
  CheckCircle2,
  Calendar,
  HeartHandshake
} from 'lucide-react';
import { TeacherProfile } from '../../types';

interface TeacherProfileModuleProps {
  profile: TeacherProfile;
  onUpdateProfile: (profile: TeacherProfile) => void;
}

export const TeacherProfileModule: React.FC<TeacherProfileModuleProps> = ({
  profile,
  onUpdateProfile,
}) => {
  const [formData, setFormData] = useState<TeacherProfile>({ ...profile });
  const [isSaved, setIsSaved] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-pink-600 dark:text-pink-400 uppercase tracking-wider mb-1">
            <UserCheck className="w-4 h-4" />
            <span>MODULE 12 • HỒ SƠ SƯ PHẠM GIÁO VIÊN</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Hồ Sơ Cô Nguyễn Thị Minh Vy
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Trường THPT số 1 Tuy Phước • Bảo vệ thông tin cá nhân theo đúng quy định.
          </p>
        </div>

        {isSaved && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>Đã lưu hồ sơ thành công!</span>
          </div>
        )}
      </div>

      {/* Main Profile Form Card */}
      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Photo Upload & Top Banner */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="relative group">
            <div className="w-32 h-32 rounded-3xl overflow-hidden ring-4 ring-pink-500/80 shadow-2xl bg-gradient-to-tr from-rose-500 to-indigo-700 flex items-center justify-center text-white">
              {formData.avatarUrl ? (
                <img src={formData.avatarUrl} alt={formData.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-2">
                  <div className="text-3xl font-black">MV</div>
                  <div className="text-[10px] text-pink-200 uppercase font-semibold">Tuy Phước</div>
                </div>
              )}
            </div>

            {/* Upload Button Overlay */}
            <label className="absolute inset-0 bg-slate-950/60 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer text-xs font-bold gap-1">
              <Camera className="w-5 h-5 text-amber-300" />
              <span>Đổi ảnh</span>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>

          <div className="space-y-1 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-pink-100 text-pink-700">
                {formData.title}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                <School className="w-3 h-3" />
                {formData.school}
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Cô {formData.name}
            </h2>
            <p className="text-xs text-pink-600 dark:text-pink-400 font-medium italic">
              "{formData.motto}"
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">Họ và tên giáo viên</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
            />
          </div>

          <div>
            <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">Đơn vị công tác</label>
            <input
              type="text"
              required
              value={formData.school}
              onChange={e => setFormData({ ...formData, school: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">Môn học giảng dạy</label>
            <input
              type="text"
              value={formData.subjects.join(', ')}
              onChange={e => setFormData({ ...formData, subjects: e.target.value.split(',').map(s => s.trim()) })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">Các lớp phụ trách</label>
            <input
              type="text"
              value={formData.assignedClasses.join(', ')}
              onChange={e => setFormData({ ...formData, assignedClasses: e.target.value.split(',').map(s => s.trim()) })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">Phương châm giảng dạy</label>
            <input
              type="text"
              value={formData.motto}
              onChange={e => setFormData({ ...formData, motto: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
            />
          </div>

          <div className="md:col-span-2">
            <label className="font-bold block text-slate-700 dark:text-slate-300 mb-1">Giới thiệu bản thân & định hướng đổi mới phương pháp</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white leading-relaxed"
            />
          </div>
        </div>

        {/* Verified Achievements */}
        <div className="space-y-3 pt-2">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Thành tích sư phạm & Sáng kiến kinh nghiệm đã xác minh</span>
          </h4>
          <div className="space-y-2">
            {formData.achievements.map((ach, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 text-xs flex items-center gap-2.5 text-amber-950 dark:text-amber-200">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-medium">{ach}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 text-white font-bold text-xs shadow-lg shadow-pink-500/25 flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Lưu cập nhật hồ sơ</span>
          </button>
        </div>
      </form>
    </div>
  );
};
