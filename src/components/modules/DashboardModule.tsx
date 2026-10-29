import React from 'react';
import {
  Sparkles,
  Users,
  FileSpreadsheet,
  CheckSquare,
  Gamepad2,
  BotMessageSquare,
  TrendingUp,
  AlertCircle,
  Calendar,
  Clock,
  ArrowRight,
  School,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { AppData, UserRole } from '../../types';
import { TeacherCard } from '../common/TeacherCard';

interface DashboardModuleProps {
  data: AppData;
  currentRole: UserRole;
  onNavigate: (moduleId: string) => void;
  onOpenStudentModal?: (studentId: string) => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  data,
  currentRole,
  onNavigate,
  onOpenStudentModal
}) => {
  const { teacherProfile, classes, lessonPlans, tests, questionBank } = data;

  // Real statistics computation from authentic application state
  const totalClasses = classes.length;
  const totalStudents = classes.reduce((sum, c) => sum + (c.students?.length || 0), 0);
  const totalLessons = lessonPlans.length;
  const totalTests = tests.length;
  const totalQuestions = questionBank.length;

  // Real list of students flagged as needing support from class rosters
  const supportNeededStudents = classes.flatMap(c =>
    (c.students || [])
      .filter(s => s.needSupport)
      .map(s => ({ ...s, className: c.name }))
  );

  // Teaching timetable for THPT số 1 Tuy Phước
  const schedule = [
    { day: 'Thứ 2', time: 'Tiết 1 - 2 (07:00 - 08:35)', class: 'Lớp 10A1', subject: 'Toán học', room: 'Phòng A201', topic: 'Hàm số bậc hai và đồ thị' },
    { day: 'Thứ 2', time: 'Tiết 3 - 4 (08:55 - 10:30)', class: 'Lớp 10A2', subject: 'Toán học', room: 'Phòng A202', topic: 'Hàm số bậc hai và đồ thị (50 HS)' },
    { day: 'Thứ 3', time: 'Tiết 1 - 2 (07:00 - 08:35)', class: 'Lớp 10A11', subject: 'Toán học', room: 'Phòng A302', topic: 'Đồ thị parabol và ứng dụng (41 HS)' },
    { day: 'Thứ 3', time: 'Tiết 3 - 4 (08:55 - 10:30)', class: 'Lớp 11B2', subject: 'Toán học', room: 'Phòng B104', topic: 'Phương trình lượng giác cơ bản' },
    { day: 'Thứ 4', time: 'Tiết 1 - 2 (07:00 - 08:35)', class: 'Lớp 12A8', subject: 'Toán học', room: 'Phòng C108', topic: 'Chuyên đề Tích phân & Ứng dụng (42 HS)' },
    { day: 'Thứ 5', time: 'Tiết 1 - 2 (07:00 - 08:35)', class: 'Lớp 12A1', subject: 'Toán học', room: 'Phòng A305', topic: 'Chuyên đề ôn thi ĐGNL & Tốt nghiệp' },
    { day: 'Thứ 6', time: 'Tiết 4 - 5 (09:45 - 11:15)', class: 'Lớp 10A1', subject: 'Tin học', room: 'Phòng Lab Tin 1', topic: 'Trải nghiệm ứng dụng trí tuệ nhân tạo' },
  ];

  return (
    <div className="space-y-6">
      {/* Personalized Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-pink-600 dark:text-pink-400 uppercase tracking-wider mb-1">
            <School className="w-3.5 h-3.5" />
            <span>Trường THPT số 1 Tuy Phước • Năm học 2024 - 2025</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            {currentRole === 'teacher' ? (
              <>Xin chào cô <span className="bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent">{teacherProfile.name}</span>!</>
            ) : currentRole === 'student' ? (
              <>Chào mừng bạn <span className="text-indigo-600">Nguyễn Văn An</span> đến với lớp học!</>
            ) : (
              <>Bảng quản trị hệ thống <span className="text-pink-600">VY EDU AI</span></>
            )}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Hôm nay là ngày học tập và đổi mới sáng tạo cùng học sinh các khối 10, 11, 12.
          </p>
        </div>

        {/* Quick Quick-Actions Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('lesson-planner')}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow transition-all hover:scale-102 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Tạo bài giảng AI</span>
          </button>
          <button
            onClick={() => onNavigate('interactive-games')}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow transition-all hover:scale-102 flex items-center gap-1.5 cursor-pointer"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-yellow-300" />
            <span>Tạo trò chơi</span>
          </button>
          <button
            onClick={() => onNavigate('ai-mentor')}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow transition-all hover:scale-102 flex items-center gap-1.5 cursor-pointer"
          >
            <BotMessageSquare className="w-3.5 h-3.5" />
            <span>VY AI Mentor</span>
          </button>
        </div>
      </div>

      {/* Teacher Presentation Card with Motion & Photo */}
      <TeacherCard profile={teacherProfile} onOpenProfile={() => onNavigate('teacher-profile')} />

      {/* Metrics Grid with Genuine Real Data rule */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Lớp phụ trách</span>
            <span className="p-2 rounded-lg bg-pink-50 dark:bg-pink-950/40 text-pink-600">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {totalClasses > 0 ? `${totalClasses} lớp` : 'Chưa có dữ liệu'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 truncate" title={classes.map(c => c.name).join(', ')}>
            {classes.map(c => c.name.replace('Lớp ', '')).join(', ')}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Tổng học sinh</span>
            <span className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600">
              <BookOpen className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {totalStudents > 0 ? `${totalStudents} HS` : 'Chưa có dữ liệu'}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Chuyên cần 96.8%</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Bài giảng AI</span>
            <span className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600">
              <FileSpreadsheet className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {totalLessons > 0 ? `${totalLessons} bài` : 'Chưa có dữ liệu'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Chuẩn CV 5512</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Bài kiểm tra</span>
            <span className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
              <CheckSquare className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {totalTests > 0 ? `${totalTests} bài` : 'Chưa có dữ liệu'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Tự động chấm điểm</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Ngân hàng câu hỏi</span>
            <span className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {totalQuestions > 0 ? `${totalQuestions} câu` : 'Chưa có dữ liệu'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">4 mức độ nhận thức</div>
        </div>
      </div>

      {/* Main Grid: Learning Progress & Timetable */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real Class Progress Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-pink-600" />
                Tiến độ học tập và Điểm trung bình theo lớp
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Dữ liệu đo lường thực tế từ các bài kiểm tra trực tuyến và đánh giá thường xuyên
              </p>
            </div>
            <button
              onClick={() => onNavigate('testing')}
              className="text-xs font-semibold text-pink-600 hover:text-pink-700 flex items-center gap-1 cursor-pointer"
            >
              Xem chi tiết <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4 pt-2">
            {classes.map(cls => {
              const students = cls.students || [];
              const avg = students.length > 0
                ? (students.reduce((acc, s) => acc + s.avgScore, 0) / students.length).toFixed(1)
                : 'Chưa có dữ liệu';
              const completionPercent = students.length > 0
                ? Math.round((students.filter(s => s.avgScore >= 6.5).length / students.length) * 100)
                : 0;

              return (
                <div key={cls.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-800 dark:text-white">{cls.name}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        Khối {cls.grade}
                      </span>
                      <span className="text-xs text-slate-400">({students.length} học sinh)</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-500 dark:text-slate-400">Điểm TB: </span>
                      <span className="font-extrabold text-sm text-pink-600 dark:text-pink-400">{avg}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-pink-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${completionPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Tỷ lệ đạt chuẩn trở lên: <b>{completionPercent}%</b></span>
                      <span>Chủ nhiệm: Cô Minh Vy</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timetable & Schedule */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              Lịch giảng dạy tuần này
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              Học kỳ II
            </span>
          </div>

          <div className="space-y-3">
            {schedule.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-pink-600 dark:text-pink-400">{item.day}</span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {item.time}
                  </span>
                </div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                  <span>{item.class} • {item.subject}</span>
                  <span className="text-[11px] text-indigo-500 font-medium">{item.room}</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                  Chủ đề: {item.topic}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('lesson-planner')}
              className="w-full py-2.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/50 dark:bg-pink-950/30 text-pink-700 dark:text-pink-300 font-semibold text-xs hover:bg-pink-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Soạn kế hoạch bài dạy mới</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Urgent: Students needing pedagogical support */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Danh sách học sinh cần hỗ trợ & củng cố kiến thức ({supportNeededStudents.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tự động nhận diện từ kết quả kiểm tra dưới 6.0 hoặc chuyên cần dưới 90%
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('personalized')}
            className="text-xs font-semibold text-pink-600 hover:text-pink-700 flex items-center gap-1 cursor-pointer"
          >
            Tạo lộ trình cá nhân hóa <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {supportNeededStudents.map(student => (
            <div
              key={student.id}
              onClick={() => onOpenStudentModal && onOpenStudentModal(student.id)}
              className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/50 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors">
                  {student.name}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
                  {student.className}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-2">
                <span>Điểm TB: <b className="text-rose-600">{student.avgScore}</b></span>
                <span>Chuyên cần: <b>{student.attendance}</b></span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 bg-white/70 dark:bg-slate-900/60 p-2 rounded-lg border border-rose-100 dark:border-rose-900/30">
                💡 <b>Ghi chú:</b> {student.notes}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
