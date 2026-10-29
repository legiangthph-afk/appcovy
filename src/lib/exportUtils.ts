import { LessonPlan, SlideDeck, OnlineTest, ClassRoom } from '../types';

/**
 * Exports a Lesson Plan to a Microsoft Word compliant document (.doc)
 * with formal Vietnamese pedagogical styling, tables, and borders.
 */
export function exportLessonPlanToWord(plan: LessonPlan) {
  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${plan.title}</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.3; margin: 2cm 2cm 2cm 2.5cm; }
        h1 { font-size: 16pt; font-weight: bold; text-align: center; text-transform: uppercase; margin-bottom: 5px; color: #002060; }
        h2 { font-size: 14pt; font-weight: bold; margin-top: 15px; margin-bottom: 5px; color: #1f497d; }
        h3 { font-size: 13pt; font-weight: bold; font-style: italic; margin-top: 10px; }
        p { margin: 4px 0; text-align: justify; }
        .header-tbl { width: 100%; border: none; margin-bottom: 20px; }
        .header-tbl td { border: none; vertical-align: top; }
        .meta-box { background: #f2f2f2; border: 1px solid #d9d9d9; padding: 10px; margin-bottom: 15px; }
        table.plan-tbl { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 15px; }
        table.plan-tbl th, table.plan-tbl td { border: 1px solid #333; padding: 6px 8px; vertical-align: top; }
        table.plan-tbl th { background-color: #dbe5f1; font-weight: bold; text-align: center; }
        .bold { font-weight: bold; }
        .italic { font-style: italic; }
      </style>
    </head>
    <body>
      <table class="header-tbl">
        <tr>
          <td style="text-align: center; width: 45%;">
            SỞ GD&ĐT BÌNH ĐỊNH<br>
            <b>TRƯỜNG THPT SỐ 1 TUY PHƯỚC</b><br>
            TỔ TOÁN - TIN HỌC
          </td>
          <td style="text-align: center; width: 55%;">
            <b>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</b><br>
            <u>Độc lập - Tự do - Hạnh phúc</u><br>
            <span style="font-size: 11pt;"><i>Tuy Phước, ngày ${new Date().toLocaleDateString('vi-VN')}</i></span>
          </td>
        </tr>
      </table>

      <h1>${plan.title}</h1>
      <p style="text-align: center; font-style: italic; margin-bottom: 15px;">
        Môn học: <b>${plan.subject}</b> - Khối <b>${plan.grade}</b> | Bộ sách: <b>${plan.textbook}</b> | Thời lượng: <b>${plan.duration}</b><br>
        Giáo viên thực hiện: <b>Nguyễn Thị Minh Vy</b> - Ứng dụng hỗ trợ: <b>VY EDU AI</b>
      </p>

      <h2>I. MỤC TIÊU DẠY HỌC (THEO CHUẨN GDPT 2018)</h2>
      <p><b>1. Về kiến thức:</b> ${plan.content.mucTieu.kienThuc}</p>
      <p><b>2. Về năng lực:</b> ${plan.content.mucTieu.nangLuc}</p>
      <p><b>3. Về phẩm chất:</b> ${plan.content.mucTieu.phamChat}</p>

      <h2>II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU</h2>
      <p><b>1. Chuẩn bị của giáo viên:</b> ${plan.content.chuanBi.giaoVien}</p>
      <p><b>2. Chuẩn bị của học sinh:</b> ${plan.content.chuanBi.hocSinh}</p>

      <h2>III. TIẾN TRÌNH DẠY HỌC (CÔNG VĂN 5512/BGDĐT)</h2>
      ${plan.content.tienTrinh.map((act, idx) => `
        <h3>${act.buoc}</h3>
        <table class="plan-tbl">
          <tr>
            <th style="width: 20%;">Mục tiêu</th>
            <td>${act.mucTieu}</td>
          </tr>
          <tr>
            <th>Nội dung nhiệm vụ</th>
            <td>${act.noiDung}</td>
          </tr>
          <tr>
            <th>Sản phẩm học tập</th>
            <td>${act.sanPham}</td>
          </tr>
          <tr>
            <th>Tổ chức thực hiện</th>
            <td>${act.toChuc}</td>
          </tr>
        </table>
      `).join('')}

      <h2>IV. HƯỚNG DẪN ĐÁNH GIÁ VÀ HỌC TẬP TẠI NHÀ</h2>
      <p>${plan.content.danhGia}</p>

      <br><br>
      <table style="width: 100%; border: none;">
        <tr>
          <td style="width: 50%; text-align: center;">
            <b>TỔ TRƯỞNG CHUYÊN MÔN</b><br>
            <i>(Ký và ghi rõ họ tên)</i>
          </td>
          <td style="width: 50%; text-align: center;">
            <b>GIÁO VIÊN SOẠN BÀI</b><br>
            <i>(Đã duyệt trên VY EDU AI)</i><br><br><br>
            <b>Nguyễn Thị Minh Vy</b>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${plan.title.replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1E00-\u1EFF]/g, '_')}_THPT_Tuy_Phuoc.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Exports test results to Excel-compatible CSV with UTF-8 BOM
 */
export function exportTestResultsToCsv(test: OnlineTest) {
  const headers = ['STT', 'Mã Học Sinh', 'Họ và Tên', 'Điểm Số', 'Thời Gian Nộp', 'Trạng Thái'];
  const rows = test.results.map((res, index) => [
    index + 1,
    res.studentId,
    `"${res.studentName}"`,
    res.score.toFixed(1),
    new Date(res.submittedAt).toLocaleString('vi-VN'),
    res.score >= 8 ? 'Giỏi' : res.score >= 6.5 ? 'Khá' : res.score >= 5 ? 'Đạt' : 'Cần hỗ trợ'
  ]);

  const csvContent = '\ufeff' + [
    `"BẢNG ĐIỂM KIỂM TRA: ${test.title}"`,
    `"Lớp: ${test.className} | Môn: ${test.subject} - Khối: ${test.grade} | Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}"`,
    `"Giáo viên phụ trách: Cô Nguyễn Thị Minh Vy - THPT số 1 Tuy Phước"`,
    '',
    headers.join(','),
    ...rows.map(e => e.join(','))
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Bang_Diem_${test.title.replace(/[^a-zA-Z0-9]/g, '_')}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Exports Slide Deck as interactive standalone HTML presentation
 */
export function exportSlideDeckToHtml(deck: SlideDeck) {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <title>${deck.title}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #fff; height: 100vh; overflow: hidden; display: flex; flex-direction: column; }
        .slide-container { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px; }
        .slide-card { background: linear-gradient(135deg, #1e293b, #0f172a); border: 2px solid #334155; border-radius: 20px; width: 90%; max-width: 1000px; min-height: 550px; padding: 50px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); display: none; flex-direction: column; }
        .slide-card.active { display: flex; animation: fadeIn 0.4s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .slide-header { border-bottom: 2px solid #ec4899; padding-bottom: 15px; margin-bottom: 25px; }
        .slide-title { font-size: 28px; font-weight: 800; color: #fbcfe8; }
        .slide-sub { font-size: 16px; color: #94a3b8; margin-top: 5px; }
        .slide-bullets { list-style: none; font-size: 20px; line-height: 1.8; color: #e2e8f0; }
        .slide-bullets li { margin-bottom: 15px; display: flex; align-items: flex-start; }
        .slide-bullets li::before { content: "★"; color: #f59e0b; margin-right: 12px; font-size: 18px; }
        .notes-box { margin-top: auto; background: rgba(30, 41, 59, 0.8); border-left: 4px solid #38bdf8; padding: 12px 18px; font-size: 14px; color: #cbd5e1; border-radius: 0 8px 8px 0; }
        .controls { height: 70px; background: #1e293b; border-top: 1px solid #334155; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; }
        .btn { background: #ec4899; color: #fff; border: none; padding: 10px 24px; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; }
        .btn:hover { background: #db2777; }
        .progress-text { color: #94a3b8; font-weight: 500; font-size: 16px; }
      </style>
    </head>
    <body>
      <div class="slide-container">
        ${deck.slides.map((s, idx) => `
          <div class="slide-card ${idx === 0 ? 'active' : ''}" id="slide-${idx}">
            <div class="slide-header">
              <div class="slide-title">${s.title}</div>
              <div class="slide-sub">${s.subtitle || 'Chương trình GDPT 2018 | Cô Nguyễn Thị Minh Vy'}</div>
            </div>
            <ul class="slide-bullets">
              ${s.bullets.map(b => `<li>${b}</li>`).join('')}
            </ul>
            ${s.teacherNotes ? `<div class="notes-box">💡 <b>Gợi ý sư phạm cho giáo viên:</b> ${s.teacherNotes}</div>` : ''}
          </div>
        `).join('')}
      </div>
      <div class="controls">
        <button class="btn" onclick="prevSlide()">◀ Slide trước</button>
        <span class="progress-text" id="slide-num">Slide 1 / ${deck.slides.length}</span>
        <button class="btn" onclick="nextSlide()">Slide tiếp ▶</button>
      </div>

      <script>
        let current = 0;
        const total = ${deck.slides.length};
        function update() {
          document.querySelectorAll('.slide-card').forEach((el, i) => {
            el.classList.toggle('active', i === current);
          });
          document.getElementById('slide-num').innerText = 'Slide ' + (current + 1) + ' / ' + total;
        }
        function nextSlide() { if (current < total - 1) { current++; update(); } }
        function prevSlide() { if (current > 0) { current--; update(); } }
        window.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
          if (e.key === 'ArrowLeft') prevSlide();
        });
      </script>
    </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${deck.title.replace(/[^a-zA-Z0-9]/g, '_')}_TrinhChieu.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
