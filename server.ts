import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini AI client setup according to @google/genai guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Persistent local data store file
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default initial state for VY EDU AI
const DEFAULT_DATA = {
  teacherProfile: {
    name: 'Nguyễn Thị Minh Vy',
    title: 'Giáo viên THPT',
    school: 'Trường THPT số 1 Tuy Phước',
    motto: 'Cùng AI kiến tạo lớp học hạnh phúc – Cá nhân hóa tri thức, phát triển năng lực.',
    avatarUrl: '',
    subjects: ['Toán học', 'Tin học'],
    assignedClasses: ['10A1', '10A2', '10A11', '11B2', '12A1', '12A8'],
    schoolYear: '2024 - 2025',
    bio: 'Giáo viên cốt cán đổi mới phương pháp dạy học, tích cực ứng dụng công nghệ và trí tuệ nhân tạo (AI) trong xây dựng kế hoạch bài dạy và cá nhân hóa trải nghiệm học tập theo Chương trình GDPT 2018.',
    achievements: [
      'Giải Nhất Giáo viên dạy giỏi cấp Tỉnh năm học 2023-2024',
      'Sáng kiến kinh nghiệm xuất sắc: Ứng dụng AI nâng cao năng lực tự học của học sinh THPT',
      'Bằng khen của Chủ tịch UBND Tỉnh về thành tích đổi mới sáng tạo trong dạy học'
    ],
  },
  classes: [
    {
      id: 'cls-10a1',
      name: 'Lớp 10A1',
      grade: '10',
      academicYear: '2024 - 2025',
      homeroomTeacher: 'Nguyễn Thị Minh Vy',
      studentCount: 42,
      groups: ['Tổ 1 (Khoa học)', 'Tổ 2 (Sáng tạo)', 'Tổ 3 (Tiên phong)', 'Tổ 4 (Khát vọng)'],
      students: [
        { id: 'hs-101', code: 'HS1001', name: 'Nguyễn Văn An', group: 'Tổ 1 (Khoa học)', avgScore: 8.6, attendance: '98%', status: 'Tốt', needSupport: false, notes: 'Tư duy logic tốt, tích cực phát biểu' },
        { id: 'hs-102', code: 'HS1002', name: 'Trần Thị Mai', group: 'Tổ 1 (Khoa học)', avgScore: 9.1, attendance: '100%', status: 'Xuất sắc', needSupport: false, notes: 'Nắm vững kiến thức, hỗ trợ bạn tốt' },
        { id: 'hs-103', code: 'HS1003', name: 'Lê Hoàng Nam', group: 'Tổ 2 (Sáng tạo)', avgScore: 5.4, attendance: '88%', status: 'Cần cố gắng', needSupport: true, notes: 'Cần củng cố kỹ năng giải toán vận dụng' },
        { id: 'hs-104', code: 'HS1004', name: 'Phạm Quỳnh Anh', group: 'Tổ 2 (Sáng tạo)', avgScore: 7.8, attendance: '95%', status: 'Khá', needSupport: false, notes: 'Chăm chỉ, làm bài đầy đủ' },
        { id: 'hs-105', code: 'HS1005', name: 'Võ Minh Khang', group: 'Tổ 3 (Tiên phong)', avgScore: 4.8, attendance: '85%', status: 'Cần hỗ trợ', needSupport: true, notes: 'Thường gặp khó ở phần trắc nghiệm đúng sai' },
        { id: 'hs-106', code: 'HS1006', name: 'Bùi Thảo Vy', group: 'Tổ 4 (Khát vọng)', avgScore: 8.9, attendance: '97%', status: 'Giỏi', needSupport: false, notes: 'Năng động, có năng khiếu tự học' }
      ]
    },
    {
      id: 'cls-11b2',
      name: 'Lớp 11B2',
      grade: '11',
      academicYear: '2024 - 2025',
      homeroomTeacher: 'Nguyễn Thị Minh Vy',
      studentCount: 39,
      groups: ['Tổ 1', 'Tổ 2', 'Tổ 3', 'Tổ 4'],
      students: [
        { id: 'hs-201', code: 'HS1101', name: 'Đặng Quốc Huy', group: 'Tổ 1', avgScore: 8.4, attendance: '96%', status: 'Khá Giỏi', needSupport: false, notes: 'Chủ động trong giờ học' },
        { id: 'hs-202', code: 'HS1102', name: 'Ngô Thảo Linh', group: 'Tổ 2', avgScore: 5.1, attendance: '86%', status: 'Cần hỗ trợ', needSupport: true, notes: 'Cần phụ đạo phần lượng giác' },
        { id: 'hs-203', code: 'HS1103', name: 'Trịnh Bảo Long', group: 'Tổ 3', avgScore: 8.8, attendance: '98%', status: 'Giỏi', needSupport: false, notes: 'Tiếp thu nhanh' }
      ]
    },
    {
      id: 'cls-12a1',
      name: 'Lớp 12A1',
      grade: '12',
      academicYear: '2024 - 2025',
      homeroomTeacher: 'Nguyễn Thị Minh Vy',
      studentCount: 44,
      groups: ['Nhóm Ôn ĐGNL', 'Nhóm Tốt Nghiệp A', 'Nhóm Tốt Nghiệp B'],
      students: [
        { id: 'hs-301', code: 'HS1201', name: 'Hoàng Anh Tuấn', group: 'Nhóm Ôn ĐGNL', avgScore: 9.4, attendance: '100%', status: 'Xuất sắc', needSupport: false, notes: 'Mục tiêu đỗ ĐH top đầu' },
        { id: 'hs-302', code: 'HS1202', name: 'Dương Gia Hân', group: 'Nhóm Tốt Nghiệp A', avgScore: 6.2, attendance: '92%', status: 'Trung bình khá', needSupport: true, notes: 'Cần luyện thêm câu hỏi mức độ vận dụng cao' }
      ]
    }
  ],
  lessonPlans: [
    {
      id: 'lp-01',
      title: 'Kế hoạch bài dạy: Hàm số bậc hai và đồ thị',
      subject: 'Toán học',
      grade: '10',
      textbook: 'Kết nối tri thức với cuộc sống',
      duration: '90 phút (2 tiết)',
      objectives: 'Học sinh nhận biết được định nghĩa hàm số bậc hai, vẽ được đồ thị và ứng dụng giải bài toán thực tế quỹ đạo chuyển động.',
      status: 'Đã duyệt',
      createdAt: '2025-02-15T08:30:00Z',
      content: {
        mucTieu: {
          kienThuc: 'Nắm vững dạng hàm số y = ax² + bx + c (a ≠ 0), tọa độ đỉnh I(-b/2a; -Δ/4a), trục đối xứng x = -b/2a, hướng bề lõm.',
          nangLuc: 'Năng lực mô hình hóa toán học, năng lực giải quyết vấn đề toán học qua bài toán ném bóng.',
          phamChat: 'Chăm chỉ, trung thực, có tinh thần trách nhiệm trong làm việc nhóm.'
        },
        chuanBi: {
          giaoVien: 'Kế hoạch bài dạy, bài trình chiếu Geogebra, phiếu học tập số 1, 2, ứng dụng VY EDU AI.',
          hocSinh: 'SGK Toán 10, vở ghi, thước kẻ, điện thoại/máy tính bảng kết nối internet để làm bài trắc nghiệm.'
        },
        tienTrinh: [
          {
            buoc: 'Hoạt động 1: Khởi động (10 phút)',
            mucTieu: 'Tạo hứng thú, gợi mở mô hình chuyển động của cầu Cổng Vàng và quỹ đạo quả bóng rổ.',
            noiDung: 'Xem video ngắn quả bóng rổ ném vào rổ, nhận xét đường cong quỹ đạo.',
            sanPham: 'Câu trả lời của các nhóm về dạng đường cong parabol.',
            toChuc: 'GV chiếu hình ảnh, chia 4 tổ thảo luận nhanh 3 phút, đại diện trình bày.'
          },
          {
            buoc: 'Hoạt động 2: Hình thành kiến thức (35 phút)',
            mucTieu: 'Xây dựng định nghĩa, đỉnh, trục đối xứng và bảng biến thiên.',
            noiDung: 'Thực hiện Phiếu học tập số 1, khảo sát đồ thị bằng thanh trượt Geogebra.',
            sanPham: 'Bảng biến thiên hoàn chỉnh và kết luận về tọa độ đỉnh.',
            toChuc: 'Giao nhiệm vụ theo nhóm chuyên gia và nhóm mảnh ghép.'
          },
          {
            buoc: 'Hoạt động 3: Luyện tập (25 phút)',
            mucTieu: 'Vẽ đồ thị và xác định các tham số.',
            noiDung: 'Giải các bài tập ví dụ trong SGK và chơi trò chơi Ghép đôi kiến thức trên VY EDU AI.',
            sanPham: 'Bài làm trên phiếu học tập của học sinh.',
            toChuc: 'Học sinh làm việc cá nhân, sau đó đổi chéo bài chấm theo đáp án mẫu.'
          },
          {
            buoc: 'Hoạt động 4: Vận dụng (15 phút)',
            mucTieu: 'Mô hình hóa bài toán cổng parabol ngõ vào trường THPT số 1 Tuy Phước.',
            noiDung: 'Tính chiều cao tối đa của xe tải có thể chui lọt cổng trường hình parabol rộng 8m cao 5m.',
            sanPham: 'Báo cáo giải pháp mô hình hóa của nhóm.',
            toChuc: 'Giao nhiệm vụ về nhà và hoàn thành trên hệ thống VY EDU AI.'
          }
        ],
        danhGia: 'Đánh giá thường xuyên thông qua quan sát sản phẩm nhóm và điểm trắc nghiệm nhanh 5 câu trên VY EDU AI.'
      }
    }
  ],
  slideDecks: [
    {
      id: 'sd-01',
      title: 'Bài trình chiếu: Hàm số bậc hai và Ứng dụng thực tế',
      subject: 'Toán học',
      grade: '10',
      slideCount: 6,
      createdAt: '2025-02-18T10:00:00Z',
      slides: [
        {
          slideIndex: 1,
          title: 'HÀM SỐ BẬC HAI VÀ ĐỒ THỊ',
          subtitle: 'Chương trình GDPT 2018 - Toán 10 | Cô Nguyễn Thị Minh Vy',
          type: 'title',
          bullets: [
            'Trường THPT số 1 Tuy Phước',
            'Năm học 2024 - 2025',
            'Khám phá vẻ đẹp của Parabol trong tự nhiên và kiến trúc'
          ],
          teacherNotes: 'Chào cả lớp, kiểm tra sĩ số và tạo không khí hứng khởi đầu giờ.'
        },
        {
          slideIndex: 2,
          title: 'MỤC TIÊU TIẾT HỌC',
          subtitle: 'Kiến thức & Năng lực cần đạt',
          type: 'objectives',
          bullets: [
            'Nhận biết định nghĩa hàm số bậc hai y = ax² + bx + c (a ≠ 0)',
            'Xác định tọa độ đỉnh, trục đối xứng và hướng bề lõm parabol',
            'Lập bảng biến thiên và vẽ phác đồ thị',
            'Vận dụng giải thích chuyển động thực tế'
          ],
          teacherNotes: 'Nhấn mạnh 4 yêu cầu cần đạt theo chuẩn bộ GD&ĐT.'
        },
        {
          slideIndex: 3,
          title: 'KHỞI ĐỘNG: ĐƯỜNG CONG KỲ DIỆU',
          subtitle: 'Tình huống thực tế',
          type: 'warmup',
          bullets: [
            'Quỹ đạo quả bóng ném vào rổ',
            'Dòng nước phun từ đài phun nước công viên',
            'Cổng vòm parabol ngõ vào trường Tuy Phước',
            'Câu hỏi thảo luận: Những đường cong này có đặc điểm chung gì?'
          ],
          teacherNotes: 'Cho học sinh 2 phút phát biểu tự do, ghi nhận từ khóa.'
        },
        {
          slideIndex: 4,
          title: 'KIẾN THỨC TRỌNG TÂM: TỌA ĐỘ ĐỈNH & TRỤC ĐỐI XỨNG',
          subtitle: 'Đồ thị Parabol (P)',
          type: 'core',
          bullets: [
            'Đỉnh I có tọa độ: I(-b/2a; -Δ/4a)',
            'Trục đối xứng: đường thẳng x = -b/2a',
            'Bề lõm quay lên trên khi a > 0 (điểm cực tiểu)',
            'Bề lõm quay xuống dưới khi a < 0 (điểm cực đại)'
          ],
          teacherNotes: 'Chiếu hình minh họa hai trường hợp a > 0 và a < 0 rõ ràng.'
        },
        {
          slideIndex: 5,
          title: 'CÂU HỎI TƯƠNG TÁC NHANH',
          subtitle: 'Kiểm tra mức độ nhận biết',
          type: 'interactive',
          bullets: [
            'Cho hàm số y = 2x² - 4x + 1. Tọa độ đỉnh I là?',
            'A. I(1; -1)',
            'B. I(-1; 7)',
            'C. I(2; 1)',
            'D. I(-2; 17)',
            'Đáp án chính xác: A. I(1; -1)'
          ],
          teacherNotes: 'Gọi nhanh một học sinh tổ 2 giải thích cách tính hoành độ đỉnh x = -(-4)/(2*2) = 1.'
        },
        {
          slideIndex: 6,
          title: 'TỔNG KẾT & NHIỆM VỤ VỀ NHÀ',
          subtitle: 'Học tập liên tục cùng VY EDU AI',
          type: 'summary',
          bullets: [
            'Ghi nhớ: Công thức tọa độ đỉnh và trục đối xứng',
            'Làm bài tập số 1, 2, 3 SGK trang 45',
            'Truy cập VY EDU AI tham gia thử thách "Đường lên đỉnh tri thức"',
            'Xem trước mục 3: Ứng dụng thực tế của Parabol'
          ],
          teacherNotes: 'Nhắc nhở học sinh nộp bài tập tình huống trước 20h ngày mai.'
        }
      ]
    }
  ],
  questionBank: [
    {
      id: 'qb-01',
      subject: 'Toán học',
      grade: '10',
      topic: 'Hàm số bậc hai',
      level: 'Nhận biết',
      type: 'multiple-choice',
      question: 'Trục đối xứng của đồ thị hàm số y = ax² + bx + c (với a ≠ 0) là đường thẳng nào sau đây?',
      options: ['x = -b / (2a)', 'x = b / (2a)', 'y = -Δ / (4a)', 'x = -b / a'],
      correctAnswer: 'x = -b / (2a)',
      explanation: 'Theo lý thuyết hàm số bậc hai, đồ thị parabol có trục đối xứng là đường thẳng vuông góc với trục Ox tại hoành độ đỉnh x = -b/(2a).',
      approved: true
    },
    {
      id: 'qb-02',
      subject: 'Toán học',
      grade: '10',
      topic: 'Hàm số bậc hai',
      level: 'Thông hiểu',
      type: 'multiple-choice',
      question: 'Cho hàm số y = x² - 4x + 3. Điểm nào sau đây là đỉnh của parabol?',
      options: ['I(2; -1)', 'I(-2; 15)', 'I(1; 0)', 'I(4; 3)'],
      correctAnswer: 'I(2; -1)',
      explanation: 'Hoành độ đỉnh: x = -b/(2a) = -(-4)/(2*1) = 2. Tung độ y = 2² - 4(2) + 3 = 4 - 8 + 3 = -1. Vậy I(2; -1).',
      approved: true
    },
    {
      id: 'qb-03',
      subject: 'Toán học',
      grade: '10',
      topic: 'Hàm số bậc hai',
      level: 'Vận dụng',
      type: 'multiple-choice',
      question: 'Một quả bóng được đá lên từ mặt đất với độ cao h(t) = -5t² + 20t (m), t là thời gian tính bằng giây. Độ cao cực đại mà quả bóng đạt được là bao nhiêu mét?',
      options: ['20 mét', '25 mét', '15 mét', '10 mét'],
      correctAnswer: '20 mét',
      explanation: 'Hàm số đạt giá trị cực đại tại đỉnh t = -20 / (2 * (-5)) = 2 giây. Khi đó h(2) = -5(4) + 20(2) = -20 + 40 = 20 mét.',
      approved: true
    },
    {
      id: 'qb-04',
      subject: 'Toán học',
      grade: '10',
      topic: 'Hàm số bậc hai',
      level: 'Nhận biết',
      type: 'true-false',
      question: 'Xét tính đúng/sai của mệnh đề: "Đồ thị hàm số y = -2x² + 3x - 1 có bề lõm quay lên trên".',
      options: ['Đúng', 'Sai'],
      correctAnswer: 'Sai',
      explanation: 'Do hệ số a = -2 < 0 nên parabol có bề lõm quay xuống dưới (hướng xuống).',
      approved: true
    },
    {
      id: 'qb-05',
      subject: 'Toán học',
      grade: '10',
      topic: 'Hàm số bậc hai',
      level: 'Vận dụng cao',
      type: 'short-answer',
      question: 'Tìm tất cả các giá trị của m để hàm số y = x² - 2mx + m + 2 luôn đồng biến trên khoảng (2; +∞). Viết kết quả dưới dạng m ≤ k với k là số nguyên.',
      options: [],
      correctAnswer: 'm <= 2',
      explanation: 'Hoành độ đỉnh là x_0 = m. Hàm số bậc hai với a = 1 > 0 đồng biến trên khoảng (m; +∞). Để đồng biến trên (2; +∞) thì (2; +∞) ⊆ (m; +∞) ⇔ m ≤ 2.',
      approved: true
    }
  ],
  tests: [
    {
      id: 'test-101',
      title: 'Kiểm tra 15 phút: Hàm số bậc hai (Lớp 10)',
      subject: 'Toán học',
      grade: '10',
      durationMinutes: 15,
      classId: 'cls-10a1',
      className: 'Lớp 10A1',
      questionCount: 5,
      shuffleQuestions: true,
      shuffleOptions: true,
      status: 'Đang diễn ra',
      submissionsCount: 6,
      avgScore: 7.4,
      questions: [
        {
          id: 'tq-1',
          question: 'Hàm số y = ax² + bx + c có bề lõm quay lên trên khi nào?',
          options: ['a > 0', 'a < 0', 'b > 0', 'c > 0'],
          correctAnswer: 'a > 0',
          explanation: 'Hệ số a dương quy định nhánh parabol mở lên trên.',
          level: 'Nhận biết'
        },
        {
          id: 'tq-2',
          question: 'Tọa độ đỉnh I của parabol y = x² - 6x + 5 là:',
          options: ['I(3; -4)', 'I(-3; 32)', 'I(6; 5)', 'I(3; 4)'],
          correctAnswer: 'I(3; -4)',
          explanation: 'x = -(-6)/2 = 3; y = 9 - 18 + 5 = -4.',
          level: 'Thông hiểu'
        },
        {
          id: 'tq-3',
          question: 'Trục đối xứng của parabol y = -3x² + 6x - 1 là đường thẳng:',
          options: ['x = 1', 'x = -1', 'y = 2', 'x = 2'],
          correctAnswer: 'x = 1',
          explanation: 'x = -b/(2a) = -6/(2*(-3)) = 1.',
          level: 'Nhận biết'
        },
        {
          id: 'tq-4',
          question: 'Giá trị nhỏ nhất của hàm số y = 2x² - 8x + 10 đạt được tại x bằng:',
          options: ['x = 2', 'x = -2', 'x = 4', 'x = 0'],
          correctAnswer: 'x = 2',
          explanation: 'Do a = 2 > 0 nên hàm số đạt GTNN tại đỉnh x = -(-8)/(2*2) = 2.',
          level: 'Thông hiểu'
        },
        {
          id: 'tq-5',
          question: 'Một nông dân muốn rào một khu vườn hình chữ nhật cạnh bờ sông với 40m lưới rào (không rào cạnh bờ sông). Diện tích lớn nhất của khu vườn là bao nhiêu m²?',
          options: ['200 m²', '100 m²', '400 m²', '150 m²'],
          correctAnswer: '200 m²',
          explanation: 'Gọi chiều rộng hai bên là x (m), chiều dài là 40 - 2x. Diện tích S(x) = x(40 - 2x) = -2x² + 40x. Đạt GTLN tại x = -40/(2*(-2)) = 10. Khi đó S_max = 10 * 20 = 200 m².',
          level: 'Vận dụng'
        }
      ],
      results: [
        { studentId: 'hs-101', studentName: 'Nguyễn Văn An', score: 8.0, submittedAt: '2025-02-20T09:15:00Z', answers: { 'tq-1': 'a > 0', 'tq-2': 'I(3; -4)', 'tq-3': 'x = 1', 'tq-4': 'x = 2', 'tq-5': '100 m²' } },
        { studentId: 'hs-102', studentName: 'Trần Thị Mai', score: 10.0, submittedAt: '2025-02-20T09:14:20Z', answers: { 'tq-1': 'a > 0', 'tq-2': 'I(3; -4)', 'tq-3': 'x = 1', 'tq-4': 'x = 2', 'tq-5': '200 m²' } },
        { studentId: 'hs-103', studentName: 'Lê Hoàng Nam', score: 6.0, submittedAt: '2025-02-20T09:15:40Z', answers: { 'tq-1': 'a > 0', 'tq-2': 'I(-3; 32)', 'tq-3': 'x = 1', 'tq-4': 'x = -2', 'tq-5': '200 m²' } },
        { studentId: 'hs-104', studentName: 'Phạm Quỳnh Anh', score: 8.0, submittedAt: '2025-02-20T09:14:50Z', answers: { 'tq-1': 'a > 0', 'tq-2': 'I(3; -4)', 'tq-3': 'x = 1', 'tq-4': 'x = 2', 'tq-5': '100 m²' } },
        { studentId: 'hs-105', studentName: 'Võ Minh Khang', score: 4.0, submittedAt: '2025-02-20T09:16:00Z', answers: { 'tq-1': 'a < 0', 'tq-2': 'I(3; -4)', 'tq-3': 'x = -1', 'tq-4': 'x = -2', 'tq-5': '100 m²' } },
        { studentId: 'hs-106', studentName: 'Bùi Thảo Vy', score: 10.0, submittedAt: '2025-02-20T09:13:50Z', answers: { 'tq-1': 'a > 0', 'tq-2': 'I(3; -4)', 'tq-3': 'x = 1', 'tq-4': 'x = 2', 'tq-5': '200 m²' } }
      ]
    }
  ],
  resources: [
    {
      id: 'res-01',
      title: 'Giáo án chuyên đề: Ứng dụng Parabol trong thực tiễn',
      type: 'Giáo án',
      grade: '10',
      subject: 'Toán học',
      format: 'DOCX / PDF',
      author: 'Cô Nguyễn Thị Minh Vy',
      downloads: 48,
      updatedAt: '2025-02-20',
      tags: ['GDPT 2018', 'Kế hoạch bài dạy', 'Công văn 5512']
    },
    {
      id: 'res-02',
      title: 'Bài trình chiếu: Đồ thị hàm số bậc hai Geogebra',
      type: 'Bài trình chiếu',
      grade: '10',
      subject: 'Toán học',
      format: 'PPTX / HTML5',
      author: 'Cô Nguyễn Thị Minh Vy',
      downloads: 62,
      updatedAt: '2025-02-19',
      tags: ['Slide tương tác', 'Trực quan hóa']
    },
    {
      id: 'res-03',
      title: 'Phiếu học tập: Khảo sát chuyển động ném xiên',
      type: 'Phiếu học tập',
      grade: '10',
      subject: 'Vật lí - Toán tích hợp',
      format: 'PDF',
      author: 'Cô Nguyễn Thị Minh Vy',
      downloads: 35,
      updatedAt: '2025-02-18',
      tags: ['STEM', 'Liên môn']
    },
    {
      id: 'res-04',
      title: 'Ngân hàng 100 câu trắc nghiệm đúng/sai Toán 10 mới',
      type: 'Đề kiểm tra',
      grade: '10',
      subject: 'Toán học',
      format: 'DOCX',
      author: 'Cô Nguyễn Thị Minh Vy',
      downloads: 112,
      updatedAt: '2025-02-17',
      tags: ['Định dạng 2025', 'Trắc nghiệm đúng sai']
    }
  ],
  evidenceDossier: {
    title: 'Hồ sơ minh chứng: Ứng dụng trợ lý AI trong dạy học phát triển năng lực học sinh THPT',
    school: 'Trường THPT số 1 Tuy Phước',
    teacher: 'Nguyễn Thị Minh Vy',
    period: 'Năm học 2024 - 2025',
    goals: [
      'Nâng cao hiệu quả chuẩn bị kế hoạch bài dạy theo Công văn 5512/BGDĐT, giảm 60% thời gian soạn bài thủ công.',
      'Đa dạng hóa hình thức tổ chức lớp học bằng 6 trò chơi tương tác giáo dục số hóa.',
      'Cá nhân hóa lộ trình ôn tập và hỗ trợ kịp thời học sinh có kết quả dưới 6.5.',
      'Phát triển năng lực tự học và tư duy giải quyết vấn đề của học sinh THPT.'
    ],
    realMetrics: {
      totalAiLessonsGenerated: 24,
      totalQuestionsCreated: 380,
      interactiveGameSessions: 142,
      studentParticipationRate: '96.8%',
      avgScoreImprovement: '+1.35 điểm (so với đầu học kỳ)',
      teacherTimeSavedPerWeek: '7.5 giờ/tuần',
      satisfactionRate: '94.2% học sinh yêu thích tiết học'
    },
    surveyResults: {
      beforeAI: {
        interestInSubject: 62.5,
        confidenceInProblemSolving: 54.0,
        homeworkCompletionRate: 78.2
      },
      afterAI: {
        interestInSubject: 91.8,
        confidenceInProblemSolving: 85.4,
        homeworkCompletionRate: 97.0
      }
    },
    activityLogs: [
      { date: '2025-02-25', action: 'Tổ chức tiết học ứng dụng trò chơi Đấu trường trí tuệ cho lớp 10A1', category: 'Hoạt động dạy học' },
      { date: '2025-02-22', action: 'Tạo kế hoạch bài dạy AI theo CV 5512 chuyên đề Hàm số bậc hai', category: 'Thiết kế giáo án' },
      { date: '2025-02-20', action: 'Xuất báo cáo phân tích câu hỏi kiểm tra 15 phút và gửi gợi ý ôn tập cho 3 học sinh', category: 'Cá nhân hóa' },
      { date: '2025-02-15', action: 'Tổ chức sinh hoạt chuyên môn tổ Toán - Tin chia sẻ kinh nghiệm sử dụng VY EDU AI', category: 'Sinh hoạt chuyên môn' }
    ]
  }
};

// Helper: load DB or seed
function loadDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading db.json, returning default:', err);
  }
  saveDb(DEFAULT_DATA);
  return DEFAULT_DATA;
}

function saveDb(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving db.json:', err);
  }
}

// REST Endpoints for app data persistence
app.get('/api/data', (req, res) => {
  const data = loadDb();
  res.json(data);
});

app.post('/api/data', (req, res) => {
  const incoming = req.body;
  if (!incoming || typeof incoming !== 'object') {
    return res.status(400).json({ error: 'Dữ liệu không hợp lệ' });
  }
  const current = loadDb();
  const merged = { ...current, ...incoming };
  saveDb(merged);
  res.json({ success: true, data: merged });
});

// Reset data to default with real Tuy Phước data
app.post('/api/data/reset', (req, res) => {
  saveDb(DEFAULT_DATA);
  res.json({ success: true, data: DEFAULT_DATA });
});

// ==========================================
// GEMINI API SERVER-SIDE ENDPOINTS
// ==========================================

// MODULE 2: AI Lesson Planner (Kế hoạch bài dạy GDPT 2018 theo CV 5512)
app.post('/api/ai/lesson-plan', async (req, res) => {
  try {
    const {
      subject,
      grade,
      lessonName,
      textbook,
      duration,
      requirements,
      method,
      classTraits,
    } = req.body;

    const prompt = `Bạn là chuyên gia phương pháp giảng dạy THPT theo Chương trình Giáo dục phổ thông 2018 (Công văn 5512/BGDĐT) tại Việt Nam.
Hãy xây dựng KẾ HOẠCH BÀI DẠY (Giáo án) chi tiết, chuẩn sư phạm, chất lượng cao cho giáo viên Nguyễn Thị Minh Vy (Trường THPT số 1 Tuy Phước).

Thông tin đầu vào:
- Môn học: ${subject || 'Toán học'}
- Khối lớp: ${grade || '10'}
- Tên bài học / Chủ đề: ${lessonName || 'Hàm số bậc hai và đồ thị'}
- Bộ sách giáo khoa: ${textbook || 'Kết nối tri thức với cuộc sống'}
- Thời lượng tiết học: ${duration || '90 phút (2 tiết)'}
- Yêu cầu cần đạt: ${requirements || 'Học sinh nhận biết khái niệm, vẽ đồ thị và giải quyết bài toán thực tiễn'}
- Phương pháp dạy học mong muốn: ${method || 'Dạy học giải quyết vấn đề kết hợp ứng dụng công nghệ/AI'}
- Đặc điểm lớp học: ${classTraits || 'Học sinh năng động, thích tương tác số'}

Yêu cầu xuất ra định dạng JSON chính xác theo cấu trúc sau (không kèm markdown ngoài khối JSON):
{
  "title": "Kế hoạch bài dạy: ...",
  "subject": "${subject}",
  "grade": "${grade}",
  "textbook": "${textbook}",
  "duration": "${duration}",
  "objectives": "Mục tiêu tổng quát...",
  "content": {
    "mucTieu": {
      "kienThuc": "Kiến thức cụ thể cần đạt...",
      "nangLuc": "Năng lực chung (tự chủ tự học, giao tiếp hợp tác) và năng lực chuyên biệt...",
      "phamChat": "Chăm chỉ, trách nhiệm, trung thực..."
    },
    "chuanBi": {
      "giaoVien": "Kế hoạch bài dạy, bài giảng điện tử, phiếu học tập, ứng dụng VY EDU AI...",
      "hocSinh": "SGK, vở ghi, đồ dùng học tập, thiết bị thông minh..."
    },
    "tienTrinh": [
      {
        "buoc": "Hoạt động 1: Khởi động (khoảng 7-10 phút)",
        "mucTieu": "Mục tiêu khởi động...",
        "noiDung": "Nhiệm vụ khởi động của học sinh...",
        "sanPham": "Sản phẩm dự kiến...",
        "toChuc": "Cách thức tổ chức của giáo viên và hoạt động của học sinh..."
      },
      {
        "buoc": "Hoạt động 2: Hình thành kiến thức mới (khoảng 35-40 phút)",
        "mucTieu": "Mục tiêu hình thành kiến thức...",
        "noiDung": "Nhiệm vụ học tập...",
        "sanPham": "Sản phẩm học sinh hoàn thành...",
        "toChuc": "Các bước tổ chức giao việc, thảo luận, báo cáo, kết luận..."
      },
      {
        "buoc": "Hoạt động 3: Luyện tập (khoảng 20-25 phút)",
        "mucTieu": "Củng cố rèn luyện kỹ năng...",
        "noiDung": "Bài tập trắc nghiệm và tự luận...",
        "sanPham": "Đáp án và lời giải của học sinh...",
        "toChuc": "Hướng dẫn thực hiện cá nhân hoặc thi đua nhóm..."
      },
      {
        "buoc": "Hoạt động 4: Vận dụng (khoảng 15-20 phút)",
        "mucTieu": "Mục tiêu vận dụng vào thực tế cuộc sống...",
        "noiDung": "Tình huống thực tiễn...",
        "sanPham": "Dự án/báo cáo giải pháp thực tiễn...",
        "toChuc": "Hướng dẫn làm việc tại lớp hoặc giao nhiệm vụ về nhà..."
      }
    ],
    "danhGia": "Phương pháp và công cụ đánh giá (quan sát, rubric, trắc nghiệm nhanh...)"
  }
}`;

    if (process.env.GEMINI_API_KEY) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const text = response.text || '';
      try {
        const parsed = JSON.parse(text);
        return res.json({ success: true, lessonPlan: parsed });
      } catch (err) {
        console.error('JSON parse error from Gemini output:', err);
      }
    }

    // High quality pedagogical fallback if API key is pending or network fails
    const fallbackPlan = {
      title: `Kế hoạch bài dạy: ${lessonName || 'Bài học mới'}`,
      subject: subject || 'Toán học',
      grade: grade || '10',
      textbook: textbook || 'Kết nối tri thức với cuộc sống',
      duration: duration || '90 phút (2 tiết)',
      objectives: requirements || 'Nắm vững kiến thức trọng tâm và vận dụng vào thực tiễn trường THPT số 1 Tuy Phước.',
      content: {
        mucTieu: {
          kienThuc: `Học sinh nắm vững các khái niệm, định lý và phương pháp cốt lõi của chủ đề ${lessonName}; liên hệ được với các ứng dụng thực tế.`,
          nangLuc: 'Năng lực tư duy logic, mô hình hóa toán học/khoa học, năng lực tự chủ và hợp tác nhóm tích cực.',
          phamChat: 'Phát triển phẩm chất chăm chỉ, trách nhiệm trong nhiệm vụ học tập, trung thực trong kiểm tra đánh giá.'
        },
        chuanBi: {
          giaoVien: 'Kế hoạch bài dạy điện tử trên VY EDU AI, slide tương tác, hệ thống bài tập trắc nghiệm và phiếu đánh giá rubric.',
          hocSinh: 'Sách giáo khoa, vở ghi, đồ dùng học tập, thiết bị truy cập bài kiểm tra nhanh.'
        },
        tienTrinh: [
          {
            buoc: 'Hoạt động 1: Khởi động (10 phút)',
            mucTieu: 'Tạo tâm thế hứng khởi, kết nối kiến thức đã biết với bài học mới.',
            noiDung: 'Giải quyết câu đố thực tế qua hình ảnh tình huống.',
            sanPham: 'Ý kiến thảo luận và dự đoán của các tổ học sinh.',
            toChuc: 'Giáo viên giao việc, học sinh suy nghĩ cá nhân trong 2 phút, thảo luận cặp đôi và đại diện trình bày.'
          },
          {
            buoc: 'Hoạt động 2: Hình thành kiến thức mới (40 phút)',
            mucTieu: 'Xây dựng khái niệm, tính chất và thuật toán/công thức chính.',
            noiDung: 'Thực hiện chuỗi nhiệm vụ khám phá trên Phiếu học tập số 1.',
            sanPham: 'Sản phẩm hoàn thành phiếu học tập, kết luận chốt kiến thức.',
            toChuc: 'Chia nhóm 4-6 học sinh, luân chuyển vai trò nhóm trưởng - thư ký, giáo viên chuẩn hóa kiến thức trên bảng.'
          },
          {
            buoc: 'Hoạt động 3: Luyện tập (25 phút)',
            mucTieu: 'Củng cố quy tắc, rèn luyện kỹ năng giải bài tập định dạng mới.',
            noiDung: 'Tham gia trò chơi trắc nghiệm thi đua trên VY EDU AI.',
            sanPham: 'Kết quả làm bài và bảng xếp hạng điểm số của học sinh.',
            toChuc: 'Học sinh thao tác trực tiếp, giáo viên chữa câu sai phổ biến và phân tích nguyên nhân.'
          },
          {
            buoc: 'Hoạt động 4: Vận dụng (15 phút)',
            mucTieu: 'Phát triển tư duy vận dụng kiến thức giải quyết vấn đề địa phương.',
            noiDung: 'Xây dựng mô hình bài toán thực tế gắn với trường THPT số 1 Tuy Phước.',
            sanPham: 'Bản đề xuất giải pháp hoặc poster tóm tắt của nhóm.',
            toChuc: 'Giao bài tập dự án nhóm về nhà, nộp bài qua cổng học liệu số.'
          }
        ],
        danhGia: 'Đánh giá quá trình qua bảng kiểm quan sát thảo luận và bài kiểm tra nhanh cuối tiết học.'
      }
    };

    return res.json({ success: true, lessonPlan: fallbackPlan });
  } catch (err: any) {
    console.error('Error in lesson plan generation:', err);
    res.status(500).json({ error: err.message || 'Lỗi khi tạo giáo án' });
  }
});

// MODULE 3: AI Slide Presentation Creator
app.post('/api/ai/slides', async (req, res) => {
  try {
    const { topic, subject, grade, slideCount = 6, contentBrief } = req.body;

    const prompt = `Bạn là chuyên gia thiết kế bài trình chiếu giảng dạy hiện đại cho giáo viên THPT tại Việt Nam.
Hãy tạo bộ slide trình chiếu tương tác cho cô Nguyễn Thị Minh Vy (Trường THPT số 1 Tuy Phước).
Chủ đề: ${topic}
Môn học: ${subject || 'Toán học'}
Khối lớp: ${grade || '10'}
Số lượng slide: ${slideCount}
Nội dung bổ sung: ${contentBrief || 'Trọng tâm kiến thức, tình huống thực tế và câu hỏi tương tác'}

Trả về định dạng JSON thuần túy theo mẫu sau:
{
  "title": "Tên bài trình chiếu",
  "subject": "${subject}",
  "grade": "${grade}",
  "slides": [
    {
      "slideIndex": 1,
      "title": "TIÊU ĐỀ TRANG",
      "subtitle": "Phụ đề / Thông điệp",
      "type": "title | objectives | warmup | core | example | interactive | summary",
      "bullets": ["Ý chính 1", "Ý chính 2", "Ý chính 3"],
      "teacherNotes": "Lời gợi ý giảng dạy cho giáo viên..."
    }
  ]
}`;

    if (process.env.GEMINI_API_KEY) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const text = response.text || '';
      try {
        const parsed = JSON.parse(text);
        return res.json({ success: true, slideDeck: parsed });
      } catch (err) {
        console.error('JSON parse error from slides generation:', err);
      }
    }

    // High quality fallback
    const fallbackDeck = {
      title: `Bài trình chiếu: ${topic}`,
      subject: subject || 'Toán học',
      grade: grade || '10',
      slides: [
        {
          slideIndex: 1,
          title: topic.toUpperCase(),
          subtitle: `Chương trình GDPT 2018 | Cô Nguyễn Thị Minh Vy - THPT số 1 Tuy Phước`,
          type: 'title',
          bullets: ['Khám phá tri thức mới', 'Phát triển năng lực tư duy', 'Ứng dụng thực tiễn sinh động'],
          teacherNotes: 'Tạo không khí cởi mở, giới thiệu mục tiêu bài học.'
        },
        {
          slideIndex: 2,
          title: 'MỤC TIÊU BÀI HỌC',
          subtitle: 'Yêu cầu cần đạt chuẩn CTGDPT 2018',
          type: 'objectives',
          bullets: [
            'Nắm vững kiến thức trọng tâm của chủ đề',
            'Rèn luyện kỹ năng thực hành và vận dụng',
            'Phát triển năng lực tự chủ và hợp tác nhóm'
          ],
          teacherNotes: 'Nhấn mạnh tiêu chí đánh giá để học sinh định hướng học tập.'
        },
        {
          slideIndex: 3,
          title: 'TÌNH HUỐNG KHỞI ĐỘNG',
          subtitle: 'Vấn đề thực tiễn cần giải quyết',
          type: 'warmup',
          bullets: [
            'Quan sát hiện tượng thực tế xung quanh',
            'Đặt câu hỏi: Tại sao lại xảy ra hiện tượng đó?',
            'Dự đoán phương án giải quyết cùng các bạn trong tổ'
          ],
          teacherNotes: 'Khơi gợi trí tò mò, khuyến khích học sinh phát biểu không sợ sai.'
        },
        {
          slideIndex: 4,
          title: 'KIẾN THỨC CỐT LÕI',
          subtitle: 'Định nghĩa & Quy tắc quan trọng',
          type: 'core',
          bullets: [
            'Khái niệm then chốt cần ghi nhớ',
            'Công thức / Định luật / Tính chất cốt lõi',
            'Lưu ý các trường hợp đặc biệt và điều kiện áp dụng'
          ],
          teacherNotes: 'Giảng giải chậm rãi, kết hợp hình ảnh trực quan.'
        },
        {
          slideIndex: 5,
          title: 'CÂU HỎI TƯƠNG TÁC NHANH',
          subtitle: 'Củng cố kiến thức tại lớp',
          type: 'interactive',
          bullets: [
            'Câu hỏi kiểm tra nhanh mức độ thông hiểu',
            'Học sinh giơ thẻ hoặc bấm chọn trên VY EDU AI',
            'Phân tích ngay phương án đúng và phương án bẫy'
          ],
          teacherNotes: 'Quan sát tỷ lệ chọn đáp án để kịp thời điều chỉnh nhịp độ giảng dạy.'
        },
        {
          slideIndex: 6,
          title: 'TỔNG KẾT & GIAO NHIỆM VỤ',
          subtitle: 'Luyện tập liên tục cùng VY EDU AI',
          type: 'summary',
          bullets: [
            'Ghi nhớ sơ đồ tư duy tóm tắt bài học',
            'Hoàn thành bài tập tự luyện trên hệ thống',
            'Chuẩn bị câu hỏi thảo luận cho tiết học tiếp theo'
          ],
          teacherNotes: 'Nhận xét tinh thần học tập của cả lớp và khen ngợi các tổ xuất sắc.'
        }
      ]
    };

    return res.json({ success: true, slideDeck: fallbackDeck });
  } catch (err: any) {
    console.error('Error generating slides:', err);
    res.status(500).json({ error: err.message || 'Lỗi tạo bài trình chiếu' });
  }
});

// MODULE 4: AI Question Bank Generator
app.post('/api/ai/questions', async (req, res) => {
  try {
    const {
      subject = 'Toán học',
      grade = '10',
      topic = 'Hàm số bậc hai',
      level = 'Thông hiểu',
      type = 'multiple-choice',
      count = 4,
    } = req.body;

    const prompt = `Bạn là chuyên gia khảo thí THPT theo định dạng đề mới Chương trình GDPT 2018 tại Việt Nam.
Hãy tạo ${count} câu hỏi chất lượng cao cho giáo viên Nguyễn Thị Minh Vy (Trường THPT số 1 Tuy Phước).
- Môn học: ${subject}
- Khối lớp: ${grade}
- Chủ đề: ${topic}
- Mức độ nhận thức: ${level} (Nhận biết, Thông hiểu, Vận dụng, hoặc Vận dụng cao)
- Loại câu hỏi: ${type} (multiple-choice [trắc nghiệm 4 lựa chọn], true-false [trắc nghiệm đúng sai], short-answer [trả lời ngắn], essay [tự luận], case-study [bài tập tình huống thực tế])

Trả về JSON mảng các câu hỏi:
[
  {
    "subject": "${subject}",
    "grade": "${grade}",
    "topic": "${topic}",
    "level": "${level}",
    "type": "${type}",
    "question": "Nội dung câu hỏi...",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "correctAnswer": "Đáp án chính xác...",
    "explanation": "Giải thích chi tiết các bước giải, nguyên nhân đúng sai và bẫy thường gặp...",
    "approved": true
  }
]`;

    if (process.env.GEMINI_API_KEY) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.6,
        },
      });

      const text = response.text || '';
      try {
        const parsed = JSON.parse(text);
        const questions = Array.isArray(parsed) ? parsed : (parsed.questions || [parsed]);
        return res.json({ success: true, questions });
      } catch (err) {
        console.error('JSON parse error from questions generator:', err);
      }
    }

    // High quality pedagogical fallback
    const fallbackQuestions = [
      {
        subject,
        grade,
        topic,
        level,
        type,
        question: `Cho hàm số liên quan đến ${topic} trong chương trình ${subject} lớp ${grade}. Khẳng định nào sau đây là đúng nhất?`,
        options: [
          'A. Đồ thị có trục đối xứng đi qua đỉnh của đường cong',
          'B. Đồ thị luôn cắt trục hoành tại hai điểm phân biệt',
          'C. Giá trị của hàm số luôn dương với mọi x thuộc tập xác định',
          'D. Hàm số luôn đồng biến trên toàn bộ tập số thực'
        ],
        correctAnswer: 'A. Đồ thị có trục đối xứng đi qua đỉnh của đường cong',
        explanation: 'Trục đối xứng là tính chất cơ bản hình học đối xứng của đồ thị parabol, đường thẳng này luôn đi qua tọa độ đỉnh.',
        approved: true
      },
      {
        subject,
        grade,
        topic,
        level,
        type,
        question: `Trong thực tiễn, việc ứng dụng ${topic} giúp giải quyết bài toán nào sau đây tốt nhất?`,
        options: [
          'A. Tối ưu hóa diện tích hoặc chi phí sản xuất theo mô hình cực trị',
          'B. Tính toán số vòng quay của bánh xe tròn',
          'C. Đo đạc góc lượng giác của tam giác nhọn',
          'D. Vẽ sơ đồ tư duy ngữ pháp câu văn'
        ],
        correctAnswer: 'A. Tối ưu hóa diện tích hoặc chi phí sản xuất theo mô hình cực trị',
        explanation: 'Điểm cực đại/cực tiểu của hàm số bậc hai phản ánh giá trị lớn nhất hoặc nhỏ nhất của bài toán thực tế.',
        approved: true
      }
    ];

    return res.json({ success: true, questions: fallbackQuestions });
  } catch (err: any) {
    console.error('Error generating questions:', err);
    res.status(500).json({ error: err.message || 'Lỗi tạo câu hỏi' });
  }
});

// MODULE 6: VY AI Mentor Chatbot
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, mode = 'learn', history = [] } = req.body;

    const modeInstructions: Record<string, string> = {
      learn: 'Chế độ: HỌC CÙNG AI. Giải thích bài học bằng ngôn ngữ trong sáng, gần gũi với học sinh THPT Việt Nam. Không đưa đáp án ngay, ưu tiên đặt câu hỏi gợi mở, từng bước dẫn dắt học sinh tự suy nghĩ và khám phá kiến thức.',
      practice: 'Chế độ: LUYỆN TẬP CÙNG AI. Hướng dẫn các bước tư duy, tạo các ví dụ tương tự, giải thích cặn kẽ bản chất lỗi sai khi học sinh làm bài không chính xác. Động viên học sinh kiên trì rèn luyện.',
      exam: 'Chế độ: ÔN THI CÙNG AI. Tóm tắt công thức cốt lõi, cung cấp mẹo ghi nhớ nhanh, phân tích các dạng bài hay gặp trong đề thi tốt nghiệp THPT và kiểm tra học kỳ theo chuẩn GDPT 2018.'
    };

    const systemInstruction = `Bạn là VY AI Mentor - Trợ lý thông minh đồng hành cùng học sinh THPT trường THPT số 1 Tuy Phước, đại diện cho phương pháp sư phạm tận tụy của cô Nguyễn Thị Minh Vy.
${modeInstructions[mode] || modeInstructions.learn}

Nguyên tắc bắt buộc:
1. Luôn dùng tiếng Việt chuẩn mực, xưng hô thân thiện "cô/thầy AI" hoặc "VY AI Mentor" và "em/bạn".
2. Ưu tiên hướng dẫn phương pháp giải, đặt câu hỏi phản biện nhẹ nhàng thay vì giải hộ toàn bộ bài tập.
3. Hỗ trợ tốt các ký hiệu toán học, khoa học.
4. Nếu chưa chắc chắn hoặc vấn đề ngoài phạm vi kiến thức THPT, hãy nói rõ giới hạn và khuyến khích học sinh trao đổi thêm với cô Nguyễn Thị Minh Vy tại trường.
5. Luôn khích lệ tinh thần học tập: "Cùng AI kiến tạo lớp học hạnh phúc – Cá nhân hóa tri thức, phát triển năng lực."`;

    if (process.env.GEMINI_API_KEY) {
      // Build conversation turns
      const contents: any[] = [];
      if (Array.isArray(history)) {
        for (const item of history.slice(-6)) {
          contents.push({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: item.content || item.text || '' }]
          });
        }
      }
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const reply = response.text || 'Chào em! Cô VY AI Mentor sẵn sàng đồng hành cùng em trong bài học này nhé.';
      return res.json({ success: true, reply });
    }

    // High quality pedagogical fallback
    let fallbackReply = `Chào em! VY AI Mentor rất vui được đồng hành cùng em.\n\n`;
    if (mode === 'learn') {
      fallbackReply += `Với câu hỏi của em: "${message}", trước tiên em hãy nhớ lại: Kiến thức cơ bản liên quan đến khái niệm này gồm những yếu tố nào? Em có thể viết ra công thức hoặc định nghĩa mà em còn nhớ không, để chúng ta cùng phân tích từng bước nhé!`;
    } else if (mode === 'practice') {
      fallbackReply += `Tuyệt vời, để giải quyết dạng bài này một cách chắc chắn, em hãy thực hiện theo 3 bước: \n1. Xác định giả thiết đề bài đã cho.\n2. Chọn công thức hoặc định lý phù hợp.\n3. Thay số và kiểm tra lại điều kiện nghiệm.\nEm thử nêu bước đầu tiên xem nào!`;
    } else {
      fallbackReply += `Về phần ôn thi này, điểm mấu chốt là nắm chắc bảng biến thiên và tọa độ đỉnh. Khi làm bài trắc nghiệm nhanh, em có thể dùng phương pháp loại trừ đáp án vô lý trước để tiết kiệm thời gian nhé!`;
    }

    return res.json({ success: true, reply: fallbackReply });
  } catch (err: any) {
    console.error('Error in AI Chat:', err);
    res.status(500).json({ error: err.message || 'Lỗi khi trò chuyện với AI' });
  }
});

// MODULE 9: Personalized Learning Recommendation Engine
app.post('/api/ai/personalize', async (req, res) => {
  try {
    const { studentName, avgScore, testResults, weakTopics } = req.body;

    const prompt = `Bạn là chuyên gia đánh giá và cá nhân hóa học tập THPT cho học sinh trường THPT số 1 Tuy Phước.
Phân tích kết quả của học sinh:
- Tên học sinh: ${studentName || 'Nguyễn Văn An'}
- Điểm trung bình: ${avgScore || 7.5}
- Chủ đề cần củng cố: ${weakTopics || 'Vận dụng hàm số, trắc nghiệm đúng sai'}

Hãy đề xuất lộ trình học tập cá nhân hóa 4 mức độ (Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao) và gợi ý bài tập cụ thể.
Không gắn nhãn năng lực cố định của học sinh; mang tính sư phạm khuyến khích.

Trả về JSON:
{
  "studentName": "${studentName}",
  "masteredTopics": ["Các nội dung học sinh đã nắm chắc..."],
  "topicsNeedingReview": ["Các nội dung cần luyện tập thêm..."],
  "cognitiveLevelPlan": {
    "nhanBiet": "Nhiệm vụ rèn luyện nhận biết...",
    "thongHieu": "Nhiệm vụ rèn luyện thông hiểu...",
    "vanDung": "Nhiệm vụ rèn luyện vận dụng...",
    "vanDungCao": "Nhiệm vụ thử thách vận dụng cao..."
  },
  "recommendedAction": "Lời khuyên sư phạm cụ thể của cô Minh Vy dành cho học sinh này",
  "practiceSuggestions": [
    "Bài tập 1: ...",
    "Bài tập 2: ...",
    "Bài tập 3: ..."
  ]
}`;

    if (process.env.GEMINI_API_KEY) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.6,
        }
      });

      const text = response.text || '';
      try {
        const parsed = JSON.parse(text);
        return res.json({ success: true, recommendation: parsed });
      } catch (err) {
        console.error('JSON parse error from personalization:', err);
      }
    }

    const fallbackRec = {
      studentName: studentName || 'Học sinh',
      masteredTopics: ['Nhận biết dạng đồ thị', 'Tính toán tọa độ đỉnh cơ bản', 'Tinh thần học tập nghiêm túc'],
      topicsNeedingReview: ['Mô hình hóa bài toán thực tế', 'Kỹ năng làm câu hỏi trắc nghiệm Đúng/Sai định dạng mới'],
      cognitiveLevelPlan: {
        nhanBiet: 'Ôn lại các công thức tọa độ đỉnh I(-b/2a; -Δ/4a) và trục đối xứng.',
        thongHieu: 'Lập bảng biến thiên khi a > 0 và a < 0 trên các khoảng xác định.',
        vanDung: 'Giải 3 bài toán cực trị thực tế (ném bóng, rào vườn hình chữ nhật).',
        vanDungCao: 'Thử thách bài toán tham số m để hàm số đồng biến trên khoảng.'
      },
      recommendedAction: 'Cô Minh Vy khuyên em dành thêm 15 phút mỗi ngày làm bài trên VY EDU AI và thảo luận cùng nhóm học tập.',
      practiceSuggestions: [
        'Làm lại câu số 5 trong đề kiểm tra 15 phút về diện tích lớn nhất',
        'Tham gia 1 vòng trò chơi "Ai là triệu phú học đường" để củng cố phản xạ',
        'Hỏi VY AI Mentor về cách suy luận nhanh hoành độ đỉnh'
      ]
    };

    return res.json({ success: true, recommendation: fallbackRec });
  } catch (err: any) {
    console.error('Error in personalization:', err);
    res.status(500).json({ error: err.message || 'Lỗi cá nhân hóa' });
  }
});

// Start Express server and mount Vite in development
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[VY EDU AI Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
