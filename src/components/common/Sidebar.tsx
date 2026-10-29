import React from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Presentation,
  Database,
  Gamepad2,
  BotMessageSquare,
  Users,
  CheckSquare,
  Sparkles,
  FolderOpen,
  Award,
  UserCheck,
  X
} from 'lucide-react';
import { UserRole } from '../../types';

export interface NavItem {
  id: string;
  name: string;
  shortName: string;
  icon: React.ComponentType<{ className?: string }>;
  tag?: string;
  badge?: string;
  allowedRoles: UserRole[];
}

export const NAV_MODULES: NavItem[] = [
  { id: 'dashboard', name: 'Bảng điều khiển', shortName: 'Tổng quan', icon: LayoutDashboard, allowedRoles: ['teacher', 'admin', 'student'] },
  { id: 'lesson-planner', name: 'AI Thiết kế bài giảng', shortName: 'Soạn giáo án', icon: FileSpreadsheet, badge: 'CV 5512', allowedRoles: ['teacher', 'admin'] },
  { id: 'slide-creator', name: 'AI Tạo bài trình chiếu', shortName: 'Tạo slide', icon: Presentation, badge: 'AI', allowedRoles: ['teacher', 'admin'] },
  { id: 'question-bank', name: 'Ngân hàng câu hỏi AI', shortName: 'Ngân hàng đề', icon: Database, badge: 'Định dạng mới', allowedRoles: ['teacher', 'admin'] },
  { id: 'interactive-games', name: 'Trò chơi học tập', shortName: '6 Trò chơi', icon: Gamepad2, tag: 'Hot', allowedRoles: ['teacher', 'student', 'admin'] },
  { id: 'ai-mentor', name: 'VY AI Mentor', shortName: 'Gia sư AI', icon: BotMessageSquare, badge: 'Hỏi đáp 24/7', allowedRoles: ['teacher', 'student', 'admin'] },
  { id: 'classroom', name: 'Quản lý lớp học', shortName: 'Lớp học', icon: Users, allowedRoles: ['teacher', 'admin'] },
  { id: 'testing', name: 'Kiểm tra & Đánh giá', shortName: 'Thi online', icon: CheckSquare, allowedRoles: ['teacher', 'student', 'admin'] },
  { id: 'personalized', name: 'Cá nhân hóa học tập', shortName: 'Cá nhân hóa', icon: Sparkles, badge: 'Khuyến nghị', allowedRoles: ['teacher', 'admin', 'student'] },
  { id: 'resources', name: 'Thư viện học liệu', shortName: 'Học liệu', icon: FolderOpen, allowedRoles: ['teacher', 'student', 'admin'] },
  { id: 'evidence', name: 'Hồ sơ minh chứng AI', shortName: 'Minh chứng', icon: Award, badge: 'Báo cáo', allowedRoles: ['teacher', 'admin'] },
  { id: 'teacher-profile', name: 'Hồ sơ giáo viên', shortName: 'Cô Minh Vy', icon: UserCheck, allowedRoles: ['teacher', 'student', 'admin'] },
];

interface SidebarProps {
  activeModule: string;
  onSelectModule: (moduleId: string) => void;
  currentRole: UserRole;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
  currentRole,
  isMobileOpen,
  onCloseMobile
}) => {
  const visibleModules = NAV_MODULES.filter(m => m.allowedRoles.includes(currentRole));

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 left-0 z-50 lg:z-30 h-screen lg:h-[calc(100vh-4rem)] w-68 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out overflow-y-auto ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 lg:hidden">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-slate-800 dark:text-white">VY EDU AI</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-pink-100 text-pink-700 font-semibold">12 Module</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="p-3 space-y-1">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Hệ thống chức năng ({visibleModules.length})
          </div>

          {visibleModules.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectModule(item.id);
                  onCloseMobile();
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl font-medium text-xs flex items-center justify-between transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md dark:from-pink-950 dark:to-slate-900 dark:text-pink-100 dark:border dark:border-pink-800/60'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className={`p-1.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-pink-500/30 text-pink-300'
                      : 'text-slate-400 group-hover:text-pink-600 dark:group-hover:text-pink-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="truncate">
                    <span className="text-[10px] text-slate-400 mr-1.5 font-mono">M{idx + 1}.</span>
                    {item.name}
                  </span>
                </div>

                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                    isActive
                      ? 'bg-pink-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-pink-100 group-hover:text-pink-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.tag && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-extrabold bg-amber-400 text-slate-950 shadow-sm shrink-0">
                    {item.tag}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info in sidebar */}
        <div className="p-4 mx-3 my-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[11px]">
          <div className="font-semibold text-slate-800 dark:text-slate-200">Trường THPT số 1 Tuy Phước</div>
          <div className="mt-0.5 text-[10px]">Tổ Toán - Tin học</div>
          <div className="mt-2 text-[10px] text-pink-600 dark:text-pink-400 font-medium italic">
            "Cùng AI kiến tạo lớp học hạnh phúc"
          </div>
        </div>
      </aside>
    </>
  );
};
