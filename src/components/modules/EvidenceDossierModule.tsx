import React, { useState } from 'react';
import {
  Award,
  Download,
  Printer,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  BarChart3,
  FileText,
  School,
  Share2
} from 'lucide-react';
import { EvidenceDossier } from '../../types';

interface EvidenceDossierModuleProps {
  dossier: EvidenceDossier;
}

export const EvidenceDossierModule: React.FC<EvidenceDossierModuleProps> = ({
  dossier,
}) => {
  const { title, school, teacher, period, goals, realMetrics, surveyResults, activityLogs } = dossier;

  const handleExportDossier = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-pink-600 dark:text-pink-400 uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" />
            <span>MODULE 11 • HỒ SƠ MINH CHỨNG & BÁO CÁO HIỆU QUẢ ỨNG DỤNG AI</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Báo Cáo Minh Chứng Chuyển Đổi Số Giáo Dục
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Số liệu đo lường thực tế, so sánh trước - sau triển khai phục vụ đánh giá sáng kiến kinh nghiệm và hồ sơ chuyên môn THPT.
          </p>
        </div>

        <button
          onClick={handleExportDossier}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Printer className="w-3.5 h-3.5 text-pink-400" />
          <span>In / Xuất Báo Cáo Minh Chứng</span>
        </button>
      </div>

      {/* Official Metadata Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-xs text-amber-400 font-bold uppercase tracking-wider">
          <School className="w-4 h-4" />
          <span>{school} • Năm học {period}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white">
          {title}
        </h2>
        <div className="text-xs text-slate-300">
          Chủ nhiệm đề tài / Giáo viên thực hiện: <b>Cô {teacher}</b> (Tổ Toán - Tin học)
        </div>
      </div>

      {/* Real Measured Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-semibold">Bài giảng AI đã thực hiện</div>
          <div className="text-2xl font-black text-pink-600">{realMetrics.totalAiLessonsGenerated} bài</div>
          <div className="text-[10px] text-slate-500">Chuẩn CV 5512/BGDĐT</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-semibold">Lượt học sinh chơi game</div>
          <div className="text-2xl font-black text-indigo-600">{realMetrics.interactiveGameSessions} lượt</div>
          <div className="text-[10px] text-slate-500">Tỷ lệ tham gia: {realMetrics.studentParticipationRate}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-semibold">Tăng trưởng điểm số TB</div>
          <div className="text-2xl font-black text-emerald-600">{realMetrics.avgScoreImprovement}</div>
          <div className="text-[10px] text-slate-500">So sánh bài KT đầu kỳ & cuối kỳ</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-semibold">Thời gian GV tiết kiệm</div>
          <div className="text-2xl font-black text-amber-500">{realMetrics.teacherTimeSavedPerWeek}</div>
          <div className="text-[10px] text-slate-500">Dành thêm thời gian hỗ trợ HS</div>
        </div>
      </div>

      {/* Comparison: Before vs After AI Implementation */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-pink-600" />
          Khảo sát thực tế: So sánh mức độ phát triển năng lực học sinh (Trước & Sau khi ứng dụng AI)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Metric 1 */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border space-y-2 text-xs">
            <div className="font-bold text-slate-800 dark:text-white">Hứng thú học tập bộ môn</div>
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between text-slate-500">
                <span>Trước triển khai:</span>
                <b>{surveyResults.beforeAI.interestInSubject}%</b>
              </div>
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Sau triển khai AI:</span>
                <b>{surveyResults.afterAI.interestInSubject}%</b>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${surveyResults.afterAI.interestInSubject}%` }} />
            </div>
          </div>

          {/* Metric 2 */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border space-y-2 text-xs">
            <div className="font-bold text-slate-800 dark:text-white">Tự tin giải quyết bài toán mới</div>
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between text-slate-500">
                <span>Trước triển khai:</span>
                <b>{surveyResults.beforeAI.confidenceInProblemSolving}%</b>
              </div>
              <div className="flex justify-between text-indigo-600 font-bold">
                <span>Sau triển khai AI:</span>
                <b>{surveyResults.afterAI.confidenceInProblemSolving}%</b>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${surveyResults.afterAI.confidenceInProblemSolving}%` }} />
            </div>
          </div>

          {/* Metric 3 */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border space-y-2 text-xs">
            <div className="font-bold text-slate-800 dark:text-white">Tỷ lệ hoàn thành nhiệm vụ về nhà</div>
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between text-slate-500">
                <span>Trước triển khai:</span>
                <b>{surveyResults.beforeAI.homeworkCompletionRate}%</b>
              </div>
              <div className="flex justify-between text-pink-600 font-bold">
                <span>Sau triển khai AI:</span>
                <b>{surveyResults.afterAI.homeworkCompletionRate}%</b>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div className="bg-pink-600 h-2 rounded-full" style={{ width: `${surveyResults.afterAI.homeworkCompletionRate}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Activity Logs Timeline */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-600" />
          Nhật ký hoạt động chuyên môn theo thời gian thực
        </h3>

        <div className="space-y-3">
          {activityLogs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border text-xs">
              <div className="w-2 h-2 rounded-full bg-pink-500 mt-1.5 shrink-0" />
              <div className="flex-1 space-y-0.5">
                <div className="font-semibold text-slate-800 dark:text-white">
                  {log.action}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span>{log.date}</span>
                  <span>•</span>
                  <span className="text-pink-600 dark:text-pink-400 font-medium">{log.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
