import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  FileSpreadsheet,
  Upload,
  Send,
  BookOpen,
  CheckCircle2,
  Clock,
  ChevronRight,
  Plus,
  Trash2,
  Search,
  Filter,
  Award,
  AlertCircle
} from 'lucide-react';
import { ClassRoom, Student } from '../../types';

interface ClassroomModuleProps {
  classes: ClassRoom[];
  onUpdateClasses: (classes: ClassRoom[]) => void;
  onOpenStudentProfile: (studentId: string) => void;
}

export const ClassroomModule: React.FC<ClassroomModuleProps> = ({
  classes,
  onUpdateClasses,
  onOpenStudentProfile
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddClass, setShowAddClass] = useState(false);
  const [noticeText, setNoticeText] = useState('');
  const [noticeSent, setNoticeSent] = useState(false);

  // New Student Form
  const [newStudent, setNewStudent] = useState({
    code: 'HS1007',
    name: '',
    group: 'Tổ 1',
    notes: 'Học sinh mới chuyển vào'
  });

  // New Class Form
  const [newClassForm, setNewClassForm] = useState({
    name: 'Lớp 10A2',
    grade: '10',
    homeroomTeacher: 'Nguyễn Thị Minh Vy',
    academicYear: '2024 - 2025'
  });

  const currentClass = classes.find(c => c.id === selectedClassId) || classes[0];

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name.trim() || !currentClass) return;

    const created: Student = {
      id: `hs-${Date.now()}`,
      code: newStudent.code,
      name: newStudent.name.trim(),
      group: newStudent.group,
      avgScore: 7.0,
      attendance: '100%',
      status: 'Mới',
      needSupport: false,
      notes: newStudent.notes
    };

    const updatedClasses = classes.map(c => {
      if (c.id === currentClass.id) {
        return {
          ...c,
          studentCount: (c.students?.length || 0) + 1,
          students: [...(c.students || []), created]
        };
      }
      return c;
    });

    onUpdateClasses(updatedClasses);
    setNewStudent({ code: `HS10${Date.now().toString().slice(-2)}`, name: '', group: 'Tổ 1', notes: '' });
    setShowAddStudent(false);
  };

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassForm.name.trim()) return;

    const createdClass: ClassRoom = {
      id: `cls-${Date.now()}`,
      name: newClassForm.name,
      grade: newClassForm.grade,
      academicYear: newClassForm.academicYear,
      homeroomTeacher: newClassForm.homeroomTeacher,
      studentCount: 0,
      groups: ['Tổ 1', 'Tổ 2', 'Tổ 3', 'Tổ 4'],
      students: []
    };

    onUpdateClasses([...classes, createdClass]);
    setSelectedClassId(createdClass.id);
    setShowAddClass(false);
  };

  const handleSendNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeText.trim()) return;
    setNoticeSent(true);
    setTimeout(() => {
      setNoticeSent(false);
      setNoticeText('');
    }, 2500);
  };

  // Filter students in current class
  const filteredStudents = (currentClass?.students || []).filter(s => {
    if (selectedGroup !== 'all' && s.group !== selectedGroup) return false;
    if (searchQuery.trim()) {
      const text = (s.name + s.code + s.group).toLowerCase();
      if (!text.includes(searchQuery.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-pink-600 dark:text-pink-400 uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>MODULE 7 • QUẢN LÝ LỚP HỌC & HỒ SƠ HỌC SINH</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Quản Lý Lớp Học THPT số 1 Tuy Phước
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Theo dõi danh sách lớp 10, 11, 12, phân tổ nhóm học tập, giao bài và bảo mật hồ sơ cá nhân của từng học sinh.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddClass(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tạo lớp mới</span>
          </button>
          <button
            onClick={() => setShowAddStudent(true)}
            className="px-3.5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Thêm học sinh</span>
          </button>
        </div>
      </div>

      {/* Class Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {classes.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedClassId(c.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              selectedClassId === c.id
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border text-slate-600 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <span>{c.name}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              selectedClassId === c.id ? 'bg-pink-500 text-white' : 'bg-slate-100 dark:bg-slate-800'
            }`}>
              {c.students?.length || 0} HS
            </span>
          </button>
        ))}
      </div>

      {/* Main Classroom Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Student Roster */}
        <div className="lg:col-span-8 space-y-4">
          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Tìm học sinh theo tên hoặc mã số..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-semibold">Tổ/Nhóm:</span>
              <select
                value={selectedGroup}
                onChange={e => setSelectedGroup(e.target.value)}
                className="p-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="all">Tất cả tổ nhóm</option>
                {currentClass?.groups?.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Student Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">Mã HS</th>
                    <th className="p-3.5">Họ và tên</th>
                    <th className="p-3.5">Tổ / Nhóm</th>
                    <th className="p-3.5 text-center">Điểm TB</th>
                    <th className="p-3.5 text-center">Chuyên cần</th>
                    <th className="p-3.5">Trạng thái</th>
                    <th className="p-3.5 text-right">Hồ sơ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        Chưa có học sinh nào trong danh sách.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map(student => (
                      <tr
                        key={student.id}
                        onClick={() => onOpenStudentProfile(student.id)}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                      >
                        <td className="p-3.5 font-mono text-slate-500">{student.code}</td>
                        <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                          {student.name}
                        </td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-300">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px]">
                            {student.group}
                          </span>
                        </td>
                        <td className="p-3.5 text-center font-extrabold text-pink-600">
                          {student.avgScore.toFixed(1)}
                        </td>
                        <td className="p-3.5 text-center text-slate-600 dark:text-slate-400">
                          {student.attendance}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            student.needSupport
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          }`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={(e) => { e.stopPropagation(); onOpenStudentProfile(student.id); }}
                            className="text-pink-600 hover:text-pink-700 font-semibold text-[11px] flex items-center gap-0.5 ml-auto cursor-pointer"
                          >
                            <span>Chi tiết</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Class Summary & Announcement tool */}
        <div className="lg:col-span-4 space-y-6">
          {/* Class Info Box */}
          {currentClass && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 text-xs">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
                <span>Thông tin {currentClass.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold">
                  Năm học {currentClass.academicYear}
                </span>
              </h3>
              <div className="space-y-1 text-slate-600 dark:text-slate-400">
                <div>Chủ nhiệm: <b>Cô {currentClass.homeroomTeacher}</b></div>
                <div>Sĩ số: <b>{currentClass.students?.length || 0} học sinh</b></div>
                <div>Phân tổ: <b>{currentClass.groups?.join(', ')}</b></div>
              </div>
            </div>
          )}

          {/* Send Announcement to Class Form */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-pink-600" />
              <span>Gửi thông báo tới {currentClass?.name}</span>
            </h3>

            <form onSubmit={handleSendNotice} className="space-y-2.5">
              <textarea
                rows={3}
                value={noticeText}
                onChange={e => setNoticeText(e.target.value)}
                placeholder="Nhập thông báo dặn dò bài tập, lịch kiểm tra hoặc link học liệu..."
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow"
              >
                <Send className="w-3.5 h-3.5 text-pink-400" />
                <span>{noticeSent ? 'Đã gửi tới cả lớp ✓' : 'Phát thông báo tới học sinh'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Modal: Add Student */}
      {showAddStudent && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-2xl p-6 border shadow-2xl space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Thêm học sinh mới vào {currentClass.name}</h3>
            <form onSubmit={handleAddStudent} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block text-slate-600 mb-1">Mã học sinh</label>
                <input
                  type="text"
                  required
                  value={newStudent.code}
                  onChange={e => setNewStudent({ ...newStudent, code: e.target.value })}
                  className="w-full p-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="font-semibold block text-slate-600 mb-1">Họ và tên học sinh</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hoàng Minh Đức..."
                  value={newStudent.name}
                  onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
                  className="w-full p-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="font-semibold block text-slate-600 mb-1">Tổ / Nhóm</label>
                <select
                  value={newStudent.group}
                  onChange={e => setNewStudent({ ...newStudent, group: e.target.value })}
                  className="w-full p-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                >
                  {currentClass?.groups?.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="font-semibold block text-slate-600 mb-1">Ghi chú sư phạm ban đầu</label>
                <input
                  type="text"
                  value={newStudent.notes}
                  onChange={e => setNewStudent({ ...newStudent, notes: e.target.value })}
                  className="w-full p-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudent(false)}
                  className="px-3 py-1.5 rounded-xl text-slate-500 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-pink-600 text-white font-bold"
                >
                  Lưu học sinh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Class */}
      {showAddClass && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-2xl p-6 border shadow-2xl space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Tạo lớp học mới</h3>
            <form onSubmit={handleAddClass} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block text-slate-600 mb-1">Tên lớp học</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lớp 10A2..."
                  value={newClassForm.name}
                  onChange={e => setNewClassForm({ ...newClassForm, name: e.target.value })}
                  className="w-full p-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="font-semibold block text-slate-600 mb-1">Khối lớp</label>
                <select
                  value={newClassForm.grade}
                  onChange={e => setNewClassForm({ ...newClassForm, grade: e.target.value })}
                  className="w-full p-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                >
                  <option value="10">Khối 10</option>
                  <option value="11">Khối 11</option>
                  <option value="12">Khối 12</option>
                </select>
              </div>
              <div>
                <label className="font-semibold block text-slate-600 mb-1">Giáo viên phụ trách</label>
                <input
                  type="text"
                  value={newClassForm.homeroomTeacher}
                  onChange={e => setNewClassForm({ ...newClassForm, homeroomTeacher: e.target.value })}
                  className="w-full p-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddClass(false)}
                  className="px-3 py-1.5 rounded-xl text-slate-500 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-bold"
                >
                  Tạo lớp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
