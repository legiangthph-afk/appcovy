import React, { useState } from 'react';
import {
  Bell,
  Sparkles,
  BookOpen,
  UserCheck,
  GraduationCap,
  Shield,
  Sun,
  Moon,
  Menu,
  X,
  School,
  CheckCircle2
} from 'lucide-react';
import { UserRole, TeacherProfile } from '../../types';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  teacherProfile: TeacherProfile;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onToggleMobileSidebar: () => void;
  onNavigateModule: (moduleId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  teacherProfile,
  darkMode,
  onToggleDarkMode,
  onToggleMobileSidebar,
  onNavigateModule
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'Học sinh cần hỗ trợ', desc: 'Võ Minh Khang (10A1) đạt 4.0đ bài kiểm tra 15p', time: '10 phút trước', type: 'urgent', moduleId: 'personalized' },
    { id: 2, title: 'Bài nộp mới', desc: '38/42 học sinh lớp 10A1 đã hoàn thành bài tập Hàm số', time: '1 giờ trước', type: 'success', moduleId: 'classroom' },
    { id: 3, title: 'Đề xuất AI mới', desc: 'Đã tạo 5 câu hỏi nâng cao dạng Đúng/Sai môn Toán 10', time: 'Hôm nay', type: 'info', moduleId: 'question-bank' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile trigger & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden cursor-pointer"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Official Logo: Open book + AI Brain/Sparkle + Knowledge Star */}
          <div
            onClick={() => onNavigateModule('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 via-indigo-900 to-pink-600 flex items-center justify-center shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-pink-200" />
              <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-pink-600 dark:from-white dark:via-pink-200 dark:to-pink-400 bg-clip-text text-transparent">
                  VY EDU AI
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-pink-100 text-pink-700 dark:bg-pink-950/80 dark:text-pink-300 border border-pink-200 dark:border-pink-800">
                  GDPT 2018
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                <School className="w-3 h-3 text-indigo-500" />
                <span className="truncate max-w-[170px] sm:max-w-xs">THPT số 1 Tuy Phước</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Academic year banner (hidden on tiny screens) */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Năm học 2024 - 2025</span>
          <span className="text-slate-400 dark:text-slate-500">|</span>
          <span className="text-pink-600 dark:text-pink-400 font-semibold">Khối 10, 11, 12</span>
        </div>

        {/* Right: Actions, Role Selector, Theme toggle & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-pink-50 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800/60 hover:bg-pink-100 transition-colors cursor-pointer"
            >
              {currentRole === 'teacher' && <UserCheck className="w-3.5 h-3.5 text-pink-600" />}
              {currentRole === 'student' && <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />}
              {currentRole === 'admin' && <Shield className="w-3.5 h-3.5 text-amber-600" />}
              <span className="capitalize">
                {currentRole === 'teacher' && 'Cô Minh Vy (GV)'}
                {currentRole === 'student' && 'Học sinh'}
                {currentRole === 'admin' && 'Quản trị viên'}
              </span>
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 text-xs">
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Chọn vai trò trải nghiệm
                </div>
                <button
                  onClick={() => { onRoleChange('teacher'); setShowRoleMenu(false); }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer ${currentRole === 'teacher' ? 'text-pink-600 font-bold bg-pink-50/50 dark:bg-pink-950/20' : 'text-slate-700 dark:text-slate-200'}`}
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-pink-600" />
                    <div>
                      <div>Giáo viên (Cô Nguyễn Thị Minh Vy)</div>
                      <div className="text-[10px] text-slate-400">Toàn quyền soạn bài, chấm điểm, quản lý</div>
                    </div>
                  </div>
                  {currentRole === 'teacher' && <CheckCircle2 className="w-3.5 h-3.5 text-pink-600" />}
                </button>
                <button
                  onClick={() => { onRoleChange('student'); setShowRoleMenu(false); }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer ${currentRole === 'student' ? 'text-indigo-600 font-bold bg-indigo-50/50 dark:bg-indigo-950/20' : 'text-slate-700 dark:text-slate-200'}`}
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    <div>
                      <div>Học sinh (Nguyễn Văn An - 12A1)</div>
                      <div className="text-[10px] text-slate-400">Làm bài kiểm tra, chơi game, hỏi AI Mentor</div>
                    </div>
                  </div>
                  {currentRole === 'student' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                </button>
                <button
                  onClick={() => { onRoleChange('admin'); setShowRoleMenu(false); }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer ${currentRole === 'admin' ? 'text-amber-600 font-bold bg-amber-50/50 dark:bg-amber-950/20' : 'text-slate-700 dark:text-slate-200'}`}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-600" />
                    <div>
                      <div>Quản trị viên (BGH / Admin)</div>
                      <div className="text-[10px] text-slate-400">Giám sát hệ thống, xuất minh chứng</div>
                    </div>
                  </div>
                  {currentRole === 'admin' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />}
                </button>
              </div>
            )}
          </div>

          {/* Notifications Drawer Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 relative cursor-pointer"
              aria-label="Thông báo"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-xs text-slate-800 dark:text-white">Thông báo mới ({notifications.length})</span>
                  <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        onNavigateModule(n.moduleId);
                        setShowNotifications(false);
                      }}
                      className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-semibold ${n.type === 'urgent' ? 'text-rose-600' : 'text-slate-800 dark:text-slate-200'}`}>
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 mt-0.5 text-[11px]">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            aria-label="Chuyển chế độ sáng tối"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Teacher Profile Avatar */}
          <button
            onClick={() => onNavigateModule('teacher-profile')}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Xem hồ sơ giáo viên"
          >
            <div className="w-8 h-8 rounded-full ring-2 ring-pink-500/80 overflow-hidden bg-gradient-to-tr from-rose-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow">
              {teacherProfile.avatarUrl ? (
                <img src={teacherProfile.avatarUrl} alt={teacherProfile.name} className="w-full h-full object-cover" />
              ) : (
                'MV'
              )}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
