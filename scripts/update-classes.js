import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../data/db.json');
const currentData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

// Helper to generate realistic Vietnamese student names
const hoList = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'];
const demListNam = ['Văn', 'Hữu', 'Minh', 'Đức', 'Quốc', 'Thanh', 'Tuấn', 'Hải', 'Bảo', 'Gia'];
const demListNu = ['Thị', 'Ngọc', 'Mai', 'Thảo', 'Quỳnh', 'Phương', 'Hồng', 'Tuyết', 'Bích', 'Kim'];
const tenListNam = ['An', 'Bình', 'Cường', 'Dũng', 'Đạt', 'Huy', 'Khoa', 'Long', 'Nam', 'Phong', 'Quân', 'Sơn', 'Tài', 'Thắng', 'Tùng', 'Việt', 'Khôi', 'Nhân', 'Phúc', 'Lâm'];
const tenListNu = ['Anh', 'Chi', 'Dung', 'Giang', 'Hà', 'Hạnh', 'Hoa', 'Linh', 'Mai', 'My', 'Ngân', 'Nhi', 'Oanh', 'Trang', 'Trâm', 'Uyên', 'Vân', 'Vy', 'Yến', 'Châu'];

function generateRoster(classCodePrefix, count, groups) {
  const students = [];
  for (let i = 1; i <= count; i++) {
    const isMale = (i % 2 === 0);
    const ho = hoList[(i * 3) % hoList.length];
    const dem = isMale ? demListNam[(i * 2) % demListNam.length] : demListNu[(i * 2) % demListNu.length];
    const ten = isMale ? tenListNam[(i * 5) % tenListNam.length] : tenListNu[(i * 5) % tenListNu.length];
    const name = `${ho} ${dem} ${ten}`;

    const numStr = i < 10 ? `0${i}` : `${i}`;
    const code = `${classCodePrefix}${numStr}`;
    const group = groups[i % groups.length];

    let avgScore;
    let needSupport = false;
    let status = 'Khá';
    let notes = 'Học sinh có ý thức tốt, hoàn thành bài tập';

    if (i % 8 === 0) {
      avgScore = Number((4.5 + ((i % 10) * 0.15)).toFixed(1));
      needSupport = true;
      status = 'Cần hỗ trợ';
      notes = 'Cần củng cố kỹ năng giải toán vận dụng và trắc nghiệm đúng/sai';
    } else if (i % 3 === 0) {
      avgScore = Number((6.8 + ((i % 10) * 0.12)).toFixed(1));
      status = 'Khá';
      notes = 'Nắm vững lý thuyết, cần rèn luyện phản xạ tính toán';
    } else if (i % 5 === 0) {
      avgScore = Number((9.0 + ((i % 8) * 0.1)).toFixed(1));
      status = 'Xuất sắc';
      notes = 'Tư duy logic tốt, tích cực phát biểu xây dựng bài';
    } else {
      avgScore = Number((7.8 + ((i % 10) * 0.1)).toFixed(1));
      status = 'Giỏi';
      notes = 'Tiếp thu bài nhanh, chăm chỉ và chủ động';
    }

    const attendance = `${92 + (i % 8)}%`;

    students.push({
      id: `hs-${classCodePrefix.toLowerCase()}-${numStr}`,
      code,
      name,
      group,
      avgScore,
      attendance,
      status,
      needSupport,
      notes
    });
  }
  return students;
}

// 1. Lớp 10A1: 42 học sinh
const groups10A1 = ['Tổ 1 (Khoa học)', 'Tổ 2 (Sáng tạo)', 'Tổ 3 (Tiên phong)', 'Tổ 4 (Khát vọng)'];
const students10A1 = generateRoster('HS101', 42, groups10A1);
students10A1[0].name = 'Nguyễn Văn An';
students10A1[0].notes = 'Lớp trưởng 10A1, tư duy toán học logic, năng động';
students10A1[0].avgScore = 9.2;
students10A1[0].status = 'Xuất sắc';
students10A1[1].name = 'Trần Thị Mai';
students10A1[1].notes = 'Nắm vững kiến thức, hỗ trợ các bạn trong tổ rất tốt';
students10A1[1].avgScore = 9.5;
students10A1[1].status = 'Xuất sắc';

const class10A1 = {
  id: 'cls-10a1',
  name: 'Lớp 10A1',
  grade: '10',
  academicYear: '2024 - 2025',
  homeroomTeacher: 'Nguyễn Thị Minh Vy',
  studentCount: 42,
  groups: groups10A1,
  students: students10A1
};

// 2. Lớp 10A2: 50 học sinh
const groups10A2 = ['Tổ 1 (Khám phá)', 'Tổ 2 (Đổi mới)', 'Tổ 3 (Hành động)', 'Tổ 4 (Vươn xa)'];
const students10A2 = generateRoster('HS102', 50, groups10A2);
students10A2[0].name = 'Trương Gia Bảo';
students10A2[0].notes = 'Lớp trưởng 10A2, gương mẫu, hỗ trợ giáo viên điều phối tổ tốt';
students10A2[0].avgScore = 9.3;
students10A2[0].status = 'Xuất sắc';

const class10A2 = {
  id: 'cls-10a2',
  name: 'Lớp 10A2',
  grade: '10',
  academicYear: '2024 - 2025',
  homeroomTeacher: 'Nguyễn Thị Minh Vy',
  studentCount: 50,
  groups: groups10A2,
  students: students10A2
};

// 3. Lớp 10A11: 41 học sinh
const groups10A11 = ['Tổ 1 (Khát vọng)', 'Tổ 2 (Tự lực)', 'Tổ 3 (Kiên định)', 'Tổ 4 (Hội nhập)'];
const students10A11 = generateRoster('HS1011', 41, groups10A11);
students10A11[0].name = 'Lâm Quốc Thắng';
students10A11[0].notes = 'Lớp trưởng 10A11, chăm chỉ, năng nổ tham gia trò chơi số hóa';
students10A11[0].avgScore = 9.1;
students10A11[0].status = 'Xuất sắc';

const class10A11 = {
  id: 'cls-10a11',
  name: 'Lớp 10A11',
  grade: '10',
  academicYear: '2024 - 2025',
  homeroomTeacher: 'Nguyễn Thị Minh Vy',
  studentCount: 41,
  groups: groups10A11,
  students: students10A11
};

// 4. Lớp 11B2: 39 học sinh
const groups11B2 = ['Tổ 1', 'Tổ 2', 'Tổ 3', 'Tổ 4'];
const students11B2 = generateRoster('HS112', 39, groups11B2);
students11B2[0].name = 'Đặng Quốc Huy';
students11B2[0].notes = 'Lớp trưởng 11B2, chủ động trong giờ học, giải toán tốt';
students11B2[0].avgScore = 8.8;
students11B2[0].status = 'Giỏi';

const class11B2 = {
  id: 'cls-11b2',
  name: 'Lớp 11B2',
  grade: '11',
  academicYear: '2024 - 2025',
  homeroomTeacher: 'Nguyễn Thị Minh Vy',
  studentCount: 39,
  groups: groups11B2,
  students: students11B2
};

// 5. Lớp 12A1: 44 học sinh
const groups12A1 = ['Nhóm Ôn ĐGNL', 'Nhóm Tốt Nghiệp A', 'Nhóm Tốt Nghiệp B', 'Nhóm Tự Chọn'];
const students12A1 = generateRoster('HS121', 44, groups12A1);
students12A1[0].name = 'Hoàng Anh Tuấn';
students12A1[0].notes = 'Lớp trưởng 12A1, mục tiêu thủ khoa ĐGNL, kỹ năng tự học cao';
students12A1[0].avgScore = 9.6;
students12A1[0].status = 'Xuất sắc';

const class12A1 = {
  id: 'cls-12a1',
  name: 'Lớp 12A1',
  grade: '12',
  academicYear: '2024 - 2025',
  homeroomTeacher: 'Nguyễn Thị Minh Vy',
  studentCount: 44,
  groups: groups12A1,
  students: students12A1
};

// 6. Lớp 12A8: 42 học sinh
const groups12A8 = ['Tổ 1 (Mục tiêu Khối A)', 'Tổ 2 (Mục tiêu Khối A1)', 'Tổ 3 (Mục tiêu Khối D)', 'Tổ 4 (Đánh giá năng lực)'];
const students12A8 = generateRoster('HS128', 42, groups12A8);
students12A8[0].name = 'Phan Nhật Huy';
students12A8[0].notes = 'Lớp trưởng 12A8, mục tiêu ĐH Bách Khoa, nắm chắc kiến thức 12';
students12A8[0].avgScore = 9.5;
students12A8[0].status = 'Xuất sắc';

const class12A8 = {
  id: 'cls-12a8',
  name: 'Lớp 12A8',
  grade: '12',
  academicYear: '2024 - 2025',
  homeroomTeacher: 'Nguyễn Thị Minh Vy',
  studentCount: 42,
  groups: groups12A8,
  students: students12A8
};

currentData.classes = [class10A1, class10A2, class10A11, class11B2, class12A1, class12A8];

currentData.teacherProfile.assignedClasses = ['10A1', '10A2', '10A11', '11B2', '12A1', '12A8'];

fs.writeFileSync(dbPath, JSON.stringify(currentData, null, 2), 'utf-8');
console.log('SUCCESS! Updated all 6 classes:');
currentData.classes.forEach(c => {
  console.log(`- ${c.name}: ${c.students.length} học sinh (Khối ${c.grade})`);
});
const totalAll = currentData.classes.reduce((sum, c) => sum + c.students.length, 0);
console.log(`TOTAL STUDENTS: ${totalAll}`);
