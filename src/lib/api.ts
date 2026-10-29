import { AppData, LessonPlan, SlideDeck, QuestionItem } from '../types';

export async function fetchAppData(): Promise<AppData> {
  const res = await fetch('/api/data');
  if (!res.ok) {
    throw new Error('Không thể tải dữ liệu từ máy chủ');
  }
  return res.json();
}

export async function saveAppData(partial: Partial<AppData>): Promise<AppData> {
  const res = await fetch('/api/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(partial),
  });
  if (!res.ok) {
    throw new Error('Lỗi khi lưu dữ liệu lên máy chủ');
  }
  const result = await res.json();
  return result.data;
}

export async function resetAppData(): Promise<AppData> {
  const res = await fetch('/api/data/reset', {
    method: 'POST',
  });
  if (!res.ok) {
    throw new Error('Không thể khôi phục dữ liệu');
  }
  const result = await res.json();
  return result.data;
}

export async function generateLessonPlanAI(params: {
  subject: string;
  grade: string;
  lessonName: string;
  textbook: string;
  duration: string;
  requirements: string;
  method: string;
  classTraits: string;
}): Promise<LessonPlan> {
  const res = await fetch('/api/ai/lesson-plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error('Lỗi từ AI khi tạo giáo án');
  }
  const result = await res.json();
  return result.lessonPlan;
}

export async function generateSlidesAI(params: {
  topic: string;
  subject: string;
  grade: string;
  slideCount: number;
  contentBrief: string;
}): Promise<SlideDeck> {
  const res = await fetch('/api/ai/slides', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error('Lỗi từ AI khi tạo bài trình chiếu');
  }
  const result = await res.json();
  return result.slideDeck;
}

export async function generateQuestionsAI(params: {
  subject: string;
  grade: string;
  topic: string;
  level: string;
  type: string;
  count: number;
}): Promise<QuestionItem[]> {
  const res = await fetch('/api/ai/questions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error('Lỗi từ AI khi tạo câu hỏi');
  }
  const result = await res.json();
  return result.questions;
}

export async function sendMentorMessageAI(params: {
  message: string;
  mode: 'learn' | 'practice' | 'exam';
  history: Array<{ role: 'user' | 'model'; content: string }>;
}): Promise<string> {
  const res = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error('Không thể kết nối tới VY AI Mentor');
  }
  const result = await res.json();
  return result.reply;
}

export async function generatePersonalizedRecommendation(params: {
  studentName: string;
  avgScore: number;
  weakTopics?: string;
}): Promise<any> {
  const res = await fetch('/api/ai/personalize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    throw new Error('Lỗi phân tích cá nhân hóa');
  }
  const result = await res.json();
  return result.recommendation;
}
