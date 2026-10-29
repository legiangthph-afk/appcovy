export type UserRole = 'teacher' | 'student' | 'admin';

export interface TeacherProfile {
  name: string;
  title: string;
  school: string;
  motto: string;
  avatarUrl: string;
  subjects: string[];
  assignedClasses: string[];
  schoolYear: string;
  bio: string;
  achievements: string[];
}

export interface Student {
  id: string;
  code: string;
  name: string;
  group: string;
  avgScore: number;
  attendance: string;
  status: string;
  needSupport: boolean;
  notes: string;
}

export interface ClassRoom {
  id: string;
  name: string;
  grade: string;
  academicYear: string;
  homeroomTeacher: string;
  studentCount: number;
  groups: string[];
  students: Student[];
}

export interface LessonPlanContent {
  mucTieu: {
    kienThuc: string;
    nangLuc: string;
    phamChat: string;
  };
  chuanBi: {
    giaoVien: string;
    hocSinh: string;
  };
  tienTrinh: Array<{
    buoc: string;
    mucTieu: string;
    noiDung: string;
    sanPham: string;
    toChuc: string;
  }>;
  danhGia: string;
}

export interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  grade: string;
  textbook: string;
  duration: string;
  objectives: string;
  status: string;
  createdAt: string;
  content: LessonPlanContent;
}

export interface SlideItem {
  slideIndex: number;
  title: string;
  subtitle: string;
  type: 'title' | 'objectives' | 'warmup' | 'core' | 'example' | 'interactive' | 'summary';
  bullets: string[];
  teacherNotes: string;
}

export interface SlideDeck {
  id: string;
  title: string;
  subject: string;
  grade: string;
  slideCount: number;
  createdAt: string;
  slides: SlideItem[];
}

export type CognitiveLevel = 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
export type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer' | 'essay' | 'case-study';

export interface QuestionItem {
  id: string;
  subject: string;
  grade: string;
  topic: string;
  level: CognitiveLevel;
  type: QuestionType;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  approved: boolean;
}

export interface TestQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  level: string;
}

export interface TestSubmission {
  studentId: string;
  studentName: string;
  score: number;
  submittedAt: string;
  answers: Record<string, string>;
}

export interface OnlineTest {
  id: string;
  title: string;
  subject: string;
  grade: string;
  durationMinutes: number;
  classId: string;
  className: string;
  questionCount: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  status: 'Đang diễn ra' | 'Đã kết thúc' | 'Bản nháp';
  submissionsCount: number;
  avgScore: number;
  questions: TestQuestion[];
  results: TestSubmission[];
}

export interface LearningResource {
  id: string;
  title: string;
  type: 'Giáo án' | 'Bài trình chiếu' | 'Phiếu học tập' | 'Đề kiểm tra' | 'Trò chơi' | 'Tài liệu tham khảo';
  grade: string;
  subject: string;
  format: string;
  author: string;
  downloads: number;
  updatedAt: string;
  tags: string[];
}

export interface EvidenceDossier {
  title: string;
  school: string;
  teacher: string;
  period: string;
  goals: string[];
  realMetrics: {
    totalAiLessonsGenerated: number;
    totalQuestionsCreated: number;
    interactiveGameSessions: number;
    studentParticipationRate: string;
    avgScoreImprovement: string;
    teacherTimeSavedPerWeek: string;
    satisfactionRate: string;
  };
  surveyResults: {
    beforeAI: {
      interestInSubject: number;
      confidenceInProblemSolving: number;
      homeworkCompletionRate: number;
    };
    afterAI: {
      interestInSubject: number;
      confidenceInProblemSolving: number;
      homeworkCompletionRate: number;
    };
  };
  activityLogs: Array<{
    date: string;
    action: string;
    category: string;
  }>;
}

export interface AppData {
  teacherProfile: TeacherProfile;
  classes: ClassRoom[];
  lessonPlans: LessonPlan[];
  slideDecks: SlideDeck[];
  questionBank: QuestionItem[];
  tests: OnlineTest[];
  resources: LearningResource[];
  evidenceDossier: EvidenceDossier;
}
