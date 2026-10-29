import React, { useState, useEffect } from 'react';
import { AppData, UserRole, LessonPlan, SlideDeck, QuestionItem, ClassRoom, OnlineTest, LearningResource, TeacherProfile } from './types';
import { fetchAppData, saveAppData } from './lib/api';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { DashboardModule } from './components/modules/DashboardModule';
import { LessonPlannerModule } from './components/modules/LessonPlannerModule';
import { SlideCreatorModule } from './components/modules/SlideCreatorModule';
import { QuestionBankModule } from './components/modules/QuestionBankModule';
import { InteractiveGamesModule } from './components/modules/InteractiveGamesModule';
import { AIMentorModule } from './components/modules/AIMentorModule';
import { ClassroomModule } from './components/modules/ClassroomModule';
import { TestingAssessmentModule } from './components/modules/TestingAssessmentModule';
import { PersonalizedLearningModule } from './components/modules/PersonalizedLearningModule';
import { ResourceLibraryModule } from './components/modules/ResourceLibraryModule';
import { EvidenceDossierModule } from './components/modules/EvidenceDossierModule';
import { TeacherProfileModule } from './components/modules/TeacherProfileModule';
import { StudentProfileModal } from './components/modals/StudentProfileModal';
import { RefreshCw, Heart } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState<UserRole>('teacher');
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [studentModalTarget, setStudentModalTarget] = useState<any>(null);

  // Load persistent application state
  useEffect(() => {
    async function init() {
      try {
        const appData = await fetchAppData();
        setData(appData);
      } catch (err) {
        console.error('Error fetching initial data:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handlers to persist changes
  const handleSaveLessonPlan = (plan: LessonPlan) => {
    if (!data) return;
    const exists = data.lessonPlans.some(p => p.id === plan.id);
    const updatedPlans = exists
      ? data.lessonPlans.map(p => p.id === plan.id ? plan : p)
      : [plan, ...data.lessonPlans];

    const updated = { ...data, lessonPlans: updatedPlans };
    setData(updated);
    saveAppData({ lessonPlans: updatedPlans }).catch(console.error);
  };

  const handleDeleteLessonPlan = (planId: string) => {
    if (!data) return;
    const updatedPlans = data.lessonPlans.filter(p => p.id !== planId);
    const updated = { ...data, lessonPlans: updatedPlans };
    setData(updated);
    saveAppData({ lessonPlans: updatedPlans }).catch(console.error);
  };

  const handleSaveSlideDeck = (deck: SlideDeck) => {
    if (!data) return;
    const exists = data.slideDecks.some(d => d.id === deck.id);
    const updatedDecks = exists
      ? data.slideDecks.map(d => d.id === deck.id ? deck : d)
      : [deck, ...data.slideDecks];

    const updated = { ...data, slideDecks: updatedDecks };
    setData(updated);
    saveAppData({ slideDecks: updatedDecks }).catch(console.error);
  };

  const handleDeleteSlideDeck = (deckId: string) => {
    if (!data) return;
    const updatedDecks = data.slideDecks.filter(d => d.id !== deckId);
    const updated = { ...data, slideDecks: updatedDecks };
    setData(updated);
    saveAppData({ slideDecks: updatedDecks }).catch(console.error);
  };

  const handleAddQuestions = (newQuestions: QuestionItem[]) => {
    if (!data) return;
    const updatedQuestions = [...newQuestions, ...data.questionBank];
    const updated = { ...data, questionBank: updatedQuestions };
    setData(updated);
    saveAppData({ questionBank: updatedQuestions }).catch(console.error);
  };

  const handleDeleteQuestion = (id: string) => {
    if (!data) return;
    const updatedQuestions = data.questionBank.filter(q => q.id !== id);
    const updated = { ...data, questionBank: updatedQuestions };
    setData(updated);
    saveAppData({ questionBank: updatedQuestions }).catch(console.error);
  };

  const handleUpdateQuestion = (question: QuestionItem) => {
    if (!data) return;
    const updatedQuestions = data.questionBank.map(q => q.id === question.id ? question : q);
    const updated = { ...data, questionBank: updatedQuestions };
    setData(updated);
    saveAppData({ questionBank: updatedQuestions }).catch(console.error);
  };

  const handleUpdateClasses = (classes: ClassRoom[]) => {
    if (!data) return;
    const updated = { ...data, classes };
    setData(updated);
    saveAppData({ classes }).catch(console.error);
  };

  const handleUpdateTests = (tests: OnlineTest[]) => {
    if (!data) return;
    const updated = { ...data, tests };
    setData(updated);
    saveAppData({ tests }).catch(console.error);
  };

  const handleAddResource = (res: LearningResource) => {
    if (!data) return;
    const updatedResources = [res, ...data.resources];
    const updated = { ...data, resources: updatedResources };
    setData(updated);
    saveAppData({ resources: updatedResources }).catch(console.error);
  };

  const handleDeleteResource = (id: string) => {
    if (!data) return;
    const updatedResources = data.resources.filter(r => r.id !== id);
    const updated = { ...data, resources: updatedResources };
    setData(updated);
    saveAppData({ resources: updatedResources }).catch(console.error);
  };

  const handleUpdateTeacherProfile = (profile: TeacherProfile) => {
    if (!data) return;
    const updated = { ...data, teacherProfile: profile };
    setData(updated);
    saveAppData({ teacherProfile: profile }).catch(console.error);
  };

  const handleOpenStudentModal = (studentId: string) => {
    if (!data) return;
    for (const c of data.classes) {
      const match = c.students?.find(s => s.id === studentId);
      if (match) {
        setStudentModalTarget({ ...match, className: c.name });
        return;
      }
    }
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center animate-pulse">
          <RefreshCw className="w-7 h-7 text-white animate-spin" />
        </div>
        <div className="text-center">
          <h1 className="text-xl font-bold tracking-tight">VY EDU AI</h1>
          <p className="text-xs text-slate-400 mt-1">Đang khởi tạo hệ thống trợ lý giảng dạy thông minh...</p>
        </div>
      </div>
    );
  }

  // All students for interactive games
  const allStudents = data.classes.flatMap(c => c.students || []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        teacherProfile={data.teacherProfile}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onNavigateModule={setActiveModule}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Navigation Sidebar with 12 Modules */}
        <Sidebar
          activeModule={activeModule}
          onSelectModule={setActiveModule}
          currentRole={currentRole}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Stage */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {activeModule === 'dashboard' && (
            <DashboardModule
              data={data}
              currentRole={currentRole}
              onNavigate={setActiveModule}
              onOpenStudentModal={handleOpenStudentModal}
            />
          )}

          {activeModule === 'lesson-planner' && (
            <LessonPlannerModule
              plans={data.lessonPlans}
              onSavePlan={handleSaveLessonPlan}
              onDeletePlan={handleDeleteLessonPlan}
            />
          )}

          {activeModule === 'slide-creator' && (
            <SlideCreatorModule
              decks={data.slideDecks}
              onSaveDeck={handleSaveSlideDeck}
              onDeleteDeck={handleDeleteSlideDeck}
            />
          )}

          {activeModule === 'question-bank' && (
            <QuestionBankModule
              questions={data.questionBank}
              onAddQuestions={handleAddQuestions}
              onDeleteQuestion={handleDeleteQuestion}
              onUpdateQuestion={handleUpdateQuestion}
            />
          )}

          {activeModule === 'interactive-games' && (
            <InteractiveGamesModule
              questions={data.questionBank}
              students={allStudents}
            />
          )}

          {activeModule === 'ai-mentor' && (
            <AIMentorModule />
          )}

          {activeModule === 'classroom' && (
            <ClassroomModule
              classes={data.classes}
              onUpdateClasses={handleUpdateClasses}
              onOpenStudentProfile={handleOpenStudentModal}
            />
          )}

          {activeModule === 'testing' && (
            <TestingAssessmentModule
              tests={data.tests}
              onUpdateTests={handleUpdateTests}
            />
          )}

          {activeModule === 'personalized' && (
            <PersonalizedLearningModule
              classes={data.classes}
            />
          )}

          {activeModule === 'resources' && (
            <ResourceLibraryModule
              resources={data.resources}
              onAddResource={handleAddResource}
              onDeleteResource={handleDeleteResource}
            />
          )}

          {activeModule === 'evidence' && (
            <EvidenceDossierModule
              dossier={data.evidenceDossier}
            />
          )}

          {activeModule === 'teacher-profile' && (
            <TeacherProfileModule
              profile={data.teacherProfile}
              onUpdateProfile={handleUpdateTeacherProfile}
            />
          )}

          {/* Footer pedagogical motto */}
          <footer className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <div className="font-semibold text-slate-700 dark:text-slate-300">
              VY EDU AI – Trợ lý giảng dạy thông minh • Trường THPT số 1 Tuy Phước
            </div>
            <div className="text-[11px] text-pink-600 dark:text-pink-400 font-medium italic">
              "Cùng AI kiến tạo lớp học hạnh phúc – Cá nhân hóa tri thức, phát triển năng lực."
            </div>
            <div className="text-[10px] text-slate-400">
              Giáo viên phụ trách: Cô Nguyễn Thị Minh Vy • Chương trình Giáo dục phổ thông 2018
            </div>
          </footer>
        </main>
      </div>

      {/* Student Profile Quick Modal */}
      {studentModalTarget && (
        <StudentProfileModal
          student={studentModalTarget}
          onClose={() => setStudentModalTarget(null)}
          onNavigatePersonalize={() => {
            setActiveModule('personalized');
            setStudentModalTarget(null);
          }}
        />
      )}
    </div>
  );
}
