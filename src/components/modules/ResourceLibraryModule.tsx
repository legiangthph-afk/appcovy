import React, { useState } from 'react';
import {
  FolderOpen,
  Search,
  Filter,
  Download,
  Share2,
  FileText,
  Presentation,
  CheckSquare,
  Gamepad2,
  Plus,
  Tag,
  BookOpen,
  Eye,
  Trash2
} from 'lucide-react';
import { LearningResource } from '../../types';

interface ResourceLibraryModuleProps {
  resources: LearningResource[];
  onAddResource: (res: LearningResource) => void;
  onDeleteResource: (id: string) => void;
}

export const ResourceLibraryModule: React.FC<ResourceLibraryModuleProps> = ({
  resources,
  onAddResource,
  onDeleteResource,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [previewResource, setPreviewResource] = useState<LearningResource | null>(null);

  const [newRes, setNewRes] = useState({
    title: '',
    type: 'Giáo án' as const,
    grade: '10',
    subject: 'Toán học',
    format: 'DOCX / PDF',
    tags: 'GDPT 2018, CV 5512'
  });

  const categories = ['Giáo án', 'Bài trình chiếu', 'Phiếu học tập', 'Đề kiểm tra', 'Trò chơi', 'Tài liệu tham khảo'];

  const filtered = resources.filter(r => {
    if (selectedType !== 'all' && r.type !== selectedType) return false;
    if (selectedGrade !== 'all' && r.grade !== selectedGrade) return false;
    if (searchQuery.trim()) {
      const text = (r.title + r.subject + r.tags.join(' ')).toLowerCase();
      if (!text.includes(searchQuery.toLowerCase())) return false;
    }
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRes.title.trim()) return;

    const created: LearningResource = {
      id: `res-${Date.now()}`,
      title: newRes.title,
      type: newRes.type,
      grade: newRes.grade,
      subject: newRes.subject,
      format: newRes.format,
      author: 'Cô Nguyễn Thị Minh Vy',
      downloads: 0,
      updatedAt: new Date().toISOString().split('T')[0],
      tags: newRes.tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    onAddResource(created);
    setShowAddModal(false);
    setNewRes({ title: '', type: 'Giáo án', grade: '10', subject: 'Toán học', format: 'DOCX / PDF', tags: '' });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Giáo án': return <FileText className="w-4 h-4 text-pink-600" />;
      case 'Bài trình chiếu': return <Presentation className="w-4 h-4 text-indigo-600" />;
      case 'Đề kiểm tra': return <CheckSquare className="w-4 h-4 text-emerald-600" />;
      case 'Trò chơi': return <Gamepad2 className="w-4 h-4 text-amber-500" />;
      default: return <BookOpen className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-pink-600 dark:text-pink-400 uppercase tracking-wider mb-1">
            <FolderOpen className="w-4 h-4" />
            <span>MODULE 10 • KHO HỌC LIỆU SỐ DÙNG CHUNG</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Thư Viện Học Liệu & Kế Hoạch Bài Dạy GDPT 2018
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Lưu trữ, tìm kiếm và chia sẻ có kiểm soát các giáo án, bài trình chiếu, phiếu học tập và bộ trò chơi của cô Nguyễn Thị Minh Vy.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm học liệu mới</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm tài liệu, giáo án, từ khóa..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="p-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="all">Tất cả loại học liệu</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={selectedGrade}
            onChange={e => setSelectedGrade(e.target.value)}
            className="p-2 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="all">Tất cả khối lớp</option>
            <option value="10">Khối 10</option>
            <option value="11">Khối 11</option>
            <option value="12">Khối 12</option>
          </select>
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(res => (
          <div
            key={res.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-3 text-xs flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                  {getTypeIcon(res.type)}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Khối {res.grade} • {res.format}
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug line-clamp-2">
                {res.title}
              </h3>

              <div className="text-[11px] text-slate-400">
                Tác giả: <b>{res.author}</b> • Cập nhật: {res.updatedAt}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 pt-1">
                {res.tags.map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 text-[10px] font-semibold">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 text-[10px]">
                {res.downloads} lượt tải
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPreviewResource(res)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                  title="Xem trước"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => alert(`Đã kích hoạt tải học liệu: ${res.title}`)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3 text-pink-400" />
                  <span>Tải</span>
                </button>
                {resources.length > 2 && (
                  <button
                    onClick={() => onDeleteResource(res.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-2xl p-6 border shadow-2xl space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Thêm học liệu vào thư viện số</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block text-slate-600 mb-1">Tên học liệu</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Chuyên đề Parabol và bài toán thực tế..."
                  value={newRes.title}
                  onChange={e => setNewRes({ ...newRes, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block text-slate-600 mb-1">Loại học liệu</label>
                  <select
                    value={newRes.type}
                    onChange={e => setNewRes({ ...newRes, type: e.target.value as any })}
                    className="w-full p-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-semibold block text-slate-600 mb-1">Khối lớp</label>
                  <select
                    value={newRes.grade}
                    onChange={e => setNewRes({ ...newRes, grade: e.target.value })}
                    className="w-full p-2 rounded-xl border bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="10">Khối 10</option>
                    <option value="11">Khối 11</option>
                    <option value="12">Khối 12</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-semibold block text-slate-600 mb-1">Thẻ từ khóa (phân cách dấu phẩy)</label>
                <input
                  type="text"
                  placeholder="GDPT 2018, Geogebra, CV 5512..."
                  value={newRes.tags}
                  onChange={e => setNewRes({ ...newRes, tags: e.target.value })}
                  className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-xl text-slate-500 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-pink-600 text-white font-bold"
                >
                  Lưu vào thư viện
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewResource && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-2xl p-6 border shadow-2xl space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">{previewResource.title}</h3>
            <div className="text-xs space-y-2 text-slate-600 dark:text-slate-300">
              <p><b>Loại:</b> {previewResource.type} • <b>Khối:</b> {previewResource.grade}</p>
              <p><b>Định dạng:</b> {previewResource.format} • <b>Tác giả:</b> {previewResource.author}</p>
              <p><b>Mô tả:</b> Học liệu được biên soạn phục vụ dạy học theo định hướng phát triển phẩm chất và năng lực của học sinh THPT số 1 Tuy Phước.</p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPreviewResource(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
