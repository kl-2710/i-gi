import type { AppNotification, AuditEntry, BookStatus, LessonBook, UserAccount } from "./types";

export const NAM_HOC = "2026 - 2027";
export const HOC_KY = "Học kỳ I";

export const CLASSES = [
  { code: "L6A1", name: "6A1", grade: "Khối 6", gvcn: "Trần Thị Bích Ngọc", size: 42 },
  { code: "L6A2", name: "6A2", grade: "Khối 6", gvcn: "Phạm Thu Hằng", size: 41 },
  { code: "L7A1", name: "7A1", grade: "Khối 7", gvcn: "Lê Thị Minh Thu", size: 43 },
  { code: "L7A2", name: "7A2", grade: "Khối 7", gvcn: "Đỗ Văn Hùng", size: 40 },
  { code: "L8A1", name: "8A1", grade: "Khối 8", gvcn: "Nguyễn Thị Lan Anh", size: 44 },
  { code: "L8A2", name: "8A2", grade: "Khối 8", gvcn: "Vũ Quang Huy", size: 42 },
  { code: "L9A1", name: "9A1", grade: "Khối 9", gvcn: "Hoàng Thị Mai", size: 39 },
  { code: "L9A2", name: "9A2", grade: "Khối 9", gvcn: "Bùi Đức Thắng", size: 40 },
];

export const SUBJECTS = [
  { code: "MH01", name: "Toán", sub: "-" },
  { code: "MH02", name: "Ngữ văn", sub: "-" },
  { code: "MH03", name: "Tiếng Anh", sub: "-" },
  { code: "MH04", name: "Vật lý", sub: "KHTN" },
  { code: "MH05", name: "Hóa học", sub: "KHTN" },
  { code: "MH06", name: "Sinh học", sub: "KHTN" },
  { code: "MH07", name: "Lịch sử và Địa lý", sub: "Lịch sử / Địa lý" },
  { code: "MH08", name: "GDCD", sub: "-" },
  { code: "MH09", name: "Tin học", sub: "-" },
  { code: "MH10", name: "Công nghệ", sub: "-" },
  { code: "MH11", name: "Giáo dục thể chất", sub: "-" },
  { code: "MH12", name: "Âm nhạc", sub: "Nghệ thuật" },
  { code: "MH13", name: "Mỹ thuật", sub: "Nghệ thuật" },
];

export const TEACHERS = [
  { id: "GV01", name: "Nguyễn Văn An", subject: "Toán" },
  { id: "GV02", name: "Trần Thị Bích Ngọc", subject: "Ngữ văn" },
  { id: "GV03", name: "Lê Thị Minh Thu", subject: "Tiếng Anh" },
  { id: "GV04", name: "Phạm Thu Hằng", subject: "Vật lý" },
  { id: "GV05", name: "Đỗ Văn Hùng", subject: "Hóa học" },
  { id: "GV06", name: "Nguyễn Thị Lan Anh", subject: "Sinh học" },
  { id: "GV07", name: "Vũ Quang Huy", subject: "Lịch sử và Địa lý" },
  { id: "GV08", name: "Hoàng Thị Mai", subject: "GDCD" },
  { id: "GV09", name: "Bùi Đức Thắng", subject: "Tin học" },
  { id: "GV10", name: "Đinh Thị Hương", subject: "Công nghệ" },
  { id: "GV11", name: "Ngô Bá Khánh", subject: "Giáo dục thể chất" },
  { id: "GV12", name: "Lý Thanh Vân", subject: "Âm nhạc" },
  { id: "GV13", name: "Chu Minh Đức", subject: "Mỹ thuật" },
];

export const ACCOUNTS: UserAccount[] = [
  {
    id: "U001",
    code: "TK001",
    fullName: "Quản trị viên",
    username: "admin",
    phone: "0243 888 0001",
    position: "Quản trị viên",
    roles: ["ADMIN"],
    updatedAt: "15/09/2026",
  },
  {
    id: "U002",
    code: "TK002",
    fullName: "Nguyễn Thị Thanh Hà",
    username: "hieutruong",
    phone: "0912 345 601",
    position: "Hiệu trưởng",
    roles: ["BGH"],
    updatedAt: "12/09/2026",
  },
  {
    id: "U003",
    code: "TK003",
    fullName: "Trần Quốc Bảo",
    username: "phohieutruong",
    phone: "0912 345 602",
    position: "Phó Hiệu trưởng",
    roles: ["BGH"],
    updatedAt: "18/09/2026",
  },
  {
    id: "U004",
    code: "TK004",
    fullName: "Phan Thị Kim Oanh",
    username: "tongphutrach",
    phone: "0912 345 603",
    position: "Tổng phụ trách Đội",
    roles: ["TPT"],
    updatedAt: "17/09/2026",
  },
  {
    id: "U005",
    code: "TK005",
    fullName: "Nguyễn Văn An",
    username: "an.nguyen",
    phone: "0912 345 604",
    teacherId: "GV01",
    position: "Giáo viên Toán",
    roles: ["GVBM"],
    updatedAt: "20/09/2026",
    subjects: ["Toán"],
  },
  {
    id: "U006",
    code: "TK006",
    fullName: "Lê Thị Minh Thu",
    username: "thu.le",
    phone: "0912 345 605",
    teacherId: "GV03",
    position: "Giáo viên Tiếng Anh - GVCN 7A1",
    roles: ["GVBM", "GVCN"],
    updatedAt: "20/09/2026",
    homeroomClass: "7A1",
    subjects: ["Tiếng Anh"],
  },
  {
    id: "U007",
    code: "TK007",
    fullName: "Trần Thị Bích Ngọc",
    username: "ngoc.tran",
    phone: "0912 345 606",
    teacherId: "GV02",
    position: "Giáo viên Ngữ văn - GVCN 6A1",
    roles: ["GVBM", "GVCN"],
    updatedAt: "19/09/2026",
    homeroomClass: "6A1",
    subjects: ["Ngữ văn"],
  },
  {
    id: "U008",
    code: "TK008",
    fullName: "Đỗ Văn Hùng",
    username: "hung.do",
    phone: "0912 345 607",
    teacherId: "GV05",
    position: "Giáo viên Hóa học - GVCN 7A2",
    roles: ["GVBM", "GVCN"],
    updatedAt: "16/09/2026",
    homeroomClass: "7A2",
    subjects: ["Hóa học"],
  },
  {
    id: "U009",
    code: "TK009",
    fullName: "Vũ Quang Huy",
    username: "huy.vu",
    phone: "0912 345 608",
    teacherId: "GV07",
    position: "Giáo viên Lịch sử và Địa lý",
    roles: ["GVBM"],
    updatedAt: "02/09/2026",
    subjects: ["Lịch sử và Địa lý"],
  },
  {
    id: "U010",
    code: "TK010",
    fullName: "Hoàng Thị Mai",
    username: "mai.hoang",
    phone: "0912 345 609",
    teacherId: "GV08",
    position: "Giáo viên GDCD - GVCN 9A1",
    roles: ["GVBM", "GVCN"],
    updatedAt: "14/09/2026",
    homeroomClass: "9A1",
    subjects: ["GDCD"],
  },
];

export const DEMO_LOGINS = [
  { username: "admin", role: "Admin" },
  { username: "hieutruong", role: "Ban Giám hiệu" },
  { username: "phohieutruong", role: "Ban Giám hiệu" },
  { username: "tongphutrach", role: "Tổng phụ trách" },
  { username: "an.nguyen", role: "GVBM" },
  { username: "thu.le", role: "Giáo viên chủ nhiệm kiêm giáo viên bộ môn" },
];

const CONTENTS: Record<string, string[]> = {
  Toán: ["Tập hợp. Phần tử của tập hợp", "Phép cộng và phép nhân", "Lũy thừa với số mũ tự nhiên", "Luyện tập chung", "Số nguyên tố. Hợp số"],
  "Ngữ văn": ["Truyện đồng thoại", "Thực hành tiếng Việt", "Viết bài văn kể chuyện", "Nói và nghe", "Ôn tập giữa kỳ"],
  "Tiếng Anh": ["Unit 1: My new school - Getting started", "Unit 1: A closer look 1", "Unit 2: Communication", "Unit 2: Skills 1", "Review 1"],
  "Vật lý": ["Đo chiều dài", "Đo khối lượng", "Lực và biểu diễn lực", "Thực hành đo lực", "Ôn tập chương I"],
  "Hóa học": ["Chất và sự biến đổi của chất", "Nguyên tử", "Nguyên tố hóa học", "Thực hành thí nghiệm", "Luyện tập"],
  "Sinh học": ["Tế bào - đơn vị cơ sở của sự sống", "Cấu tạo tế bào", "Sự lớn lên và sinh sản của tế bào", "Thực hành quan sát tế bào", "Ôn tập"],
  "Lịch sử và Địa lý": ["Lịch sử là gì?", "Thời gian trong lịch sử", "Bản đồ và phương hướng", "Trái Đất trong Hệ Mặt Trời", "Ôn tập chủ đề 1"],
  GDCD: ["Tự hào về truyền thống gia đình", "Yêu thương con người", "Siêng năng, kiên trì", "Thực hành tình huống", "Ôn tập"],
  "Tin học": ["Thông tin và dữ liệu", "Mạng máy tính", "Soạn thảo văn bản", "Thực hành trên máy", "Ôn tập"],
  "Công nghệ": ["Nhà ở đối với con người", "Xây dựng nhà ở", "Vật liệu xây dựng", "Thực hành thiết kế", "Ôn tập"],
  "Giáo dục thể chất": ["Chạy cự ly ngắn", "Bài thể dục liên hoàn", "Bật nhảy", "Trò chơi vận động", "Kiểm tra thể lực"],
  "Âm nhạc": ["Học hát: Mái trường mến yêu", "Đọc nhạc số 1", "Thường thức âm nhạc", "Ôn tập bài hát", "Biểu diễn nhóm"],
  "Mỹ thuật": ["Tranh tĩnh vật", "Màu sắc và cảm xúc", "Vẽ theo mẫu", "Thực hành sáng tạo", "Trưng bày sản phẩm"],
};

const STATUS_CYCLE: BookStatus[] = [
  "he_thong_tao",
  "chua_hoan_thien",
  "da_cap_nhat",
  "xac_nhan_gvbm",
  "yeu_cau_chinh_sua",
];

const WEEKDAYS = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu"];

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function dateLabel(day: number) {
  return `${pad(day)}/09/2026`;
}

export function buildLessonBooks(): LessonBook[] {
  const list: LessonBook[] = [];
  let seed = 19;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  let idx = 0;

  for (let dayOffset = 0; dayOffset < 10; dayOffset++) {
    const day = 14 + dayOffset;
    const weekNumber = Math.floor(dayOffset / 5) + 1;
    const weekdayIndex = dayOffset % 5;
    const weekday = WEEKDAYS[weekdayIndex]!;
    const weekStart = dateLabel(14 + (weekNumber - 1) * 5);
    const weekEnd = dateLabel(18 + (weekNumber - 1) * 5);

    for (const cls of CLASSES) {
      for (let period = 1; period <= 3; period++) {
        idx++;
        const subj = SUBJECTS[(idx + weekNumber + period) % SUBJECTS.length]!;
        const teacher = TEACHERS.find((t) => t.subject === subj.name) ?? TEACHERS[0]!;
        const contents = CONTENTS[subj.name] ?? ["Nội dung bài học"];
        const ppctNo = ((idx - 1) % 5) + 1;
        const readyForGvcnDemo = cls.name === "7A1" && weekNumber === 1;
        const status = readyForGvcnDemo
          ? "xac_nhan_gvbm"
          : STATUS_CYCLE[(idx - 1) % STATUS_CYCLE.length]!;
        const completed = ["da_cap_nhat", "xac_nhan_gvbm", "xac_nhan_gvcn"].includes(status);
        const confirmedGvbm = completed && status !== "yeu_cau_chinh_sua";
        const confirmedGvcn = false;
        const date = dateLabel(day);
        const at = `${date} ${pad(7 + period)}:30`;

        list.push({
          id: `SDB${pad(idx)}`,
          code: `SDB-2026-${pad(idx)}`,
          date,
          weekday,
          weekNumber,
          weekStart,
          weekEnd,
          period,
          className: cls.name,
          grade: cls.grade,
          subject: subj.name,
          teacher: teacher.name,
          teacherId: teacher.id,
          ppctNo,
          plannedContent: contents[ppctNo - 1] ?? contents[0]!,
          totalStudents: cls.size,
          absentCount: completed ? Math.floor(rnd() * 3) : null,
          comment: completed ? "Lớp học nghiêm túc, học sinh tích cực phát biểu." : "",
          score: completed ? 8 + Math.round(rnd() * 2) : null,
          rank: completed ? (["A", "A", "B"][idx % 3] as "A" | "B" | "C") : null,
          status,
          gvbmConfirm: confirmedGvbm ? { by: teacher.name, at } : undefined,
          gvcnConfirm: confirmedGvcn ? { by: cls.gvcn, at } : undefined,
          fixReason: status === "yeu_cau_chinh_sua" ? "Thông tin tiết dạy cần được cập nhật lại." : undefined,
          year: NAM_HOC,
          semester: HOC_KY,
        });
      }
    }
  }

  return list;
}

export const INITIAL_AUDIT: AuditEntry[] = [
  {
    id: "A001",
    at: "18/09/2026 08:12",
    actor: "Trần Quốc Bảo",
    role: "BGH",
    action: "Nhập PPCT",
    target: "PPCT học kỳ I năm học 2026 - 2027",
    recordCode: "PPCT-HK1",
    from: "-",
    to: "Đã nhập dữ liệu",
    reason: "-",
  },
  {
    id: "A002",
    at: "18/09/2026 09:40",
    actor: "Trần Quốc Bảo",
    role: "BGH",
    action: "Nhập TKB",
    target: "TKB học kỳ I năm học 2026 - 2027",
    recordCode: "TKB-HK1",
    from: "-",
    to: "Đã nhập dữ liệu",
    reason: "-",
  },
  {
    id: "A003",
    at: "18/09/2026 10:05",
    actor: "Hệ thống",
    role: "BGH",
    action: "Hình thành dữ liệu tiết dạy",
    target: "Dữ liệu tiết dạy HK I",
    recordCode: "GEN-0918",
    from: "-",
    to: "Đã hình thành",
    reason: "PPCT + TKB hợp lệ",
  },
  {
    id: "A004",
    at: "21/09/2026 15:32",
    actor: "Nguyễn Văn An",
    role: "GVBM",
    action: "Xác nhận tiết học",
    target: "Tiết 1 - 7A1 - Toán",
    recordCode: "SDB-2026-07",
    from: "Đã cập nhật",
    to: "Đã xác nhận GVBM",
    reason: "-",
  },
  {
    id: "A005",
    at: "21/09/2026 16:10",
    actor: "Lê Thị Minh Thu",
    role: "GVCN",
    action: "Xác nhận Sổ đầu bài theo tuần",
    target: "Lớp 7A1 - Tuần 1",
    recordCode: "SDBT-7A1-W1",
    from: "Các tiết đã được GVBM xác nhận",
    to: "Đã xác nhận GVCN",
    reason: "Tất cả tiết trong tuần đã được GVBM xác nhận",
  },
];

export const NOTIFICATIONS: AppNotification[] = [
  { id: "N1", roles: ["GVBM"], title: "Bạn có các tiết chưa hoàn thiện.", time: "Hôm nay 07:30", type: "warning" },
  { id: "N2", roles: ["GVBM"], title: "Có Sổ đầu bài cần cập nhật lại.", time: "Hôm qua 16:20", type: "warning" },
  { id: "N3", roles: ["GVCN"], title: "Có tuần đã đủ điều kiện để xác nhận.", time: "Hôm nay 08:05", type: "info" },
  { id: "N4", roles: ["BGH"], title: "Theo dõi tình trạng hoàn thiện Sổ đầu bài toàn trường.", time: "Hôm nay 07:50", type: "info" },
  { id: "N5", roles: ["BGH"], title: "PPCT và TKB học kỳ hiện tại đã sẵn sàng.", time: "Hôm nay 07:50", type: "success" },
  { id: "N6", roles: ["TPT"], title: "Có dữ liệu Sổ đầu bài cần theo dõi.", time: "Hôm nay 08:15", type: "info" },
  { id: "N7", roles: ["ADMIN"], title: "2 tài khoản đang ở trạng thái tạm khóa.", time: "Hôm nay 06:00", type: "info" },
];

export const PPCT_ROWS = Array.from({ length: 15 }, (_, i) => {
  const subj = SUBJECTS[i % SUBJECTS.length]!;
  const contents = CONTENTS[subj.name] ?? ["Nội dung bài học"];
  return {
    soThuTuTiet: i + 1,
    subject: subj.name,
    grade: `Khối ${6 + (i % 4)}`,
    content: contents[i % contents.length]!,
    year: NAM_HOC,
    semester: HOC_KY,
    error: i === 7 ? "Trùng số thứ tự tiết trong cùng PPCT" : "",
  };
});

export const TKB_ROWS = Array.from({ length: 25 }, (_, i) => {
  const cls = CLASSES[i % CLASSES.length]!;
  const subj = SUBJECTS[(i * 2 + 1) % SUBJECTS.length]!;
  const teacher = TEACHERS.find((t) => t.subject === subj.name) ?? TEACHERS[0]!;
  return {
    weekday: WEEKDAYS[i % WEEKDAYS.length]!,
    period: (i % 5) + 1,
    className: cls.name,
    subject: subj.name,
    teacher: teacher.name,
    year: NAM_HOC,
    semester: HOC_KY,
    error: i === 8 ? "Không khớp giáo viên trong danh mục" : "",
  };
});
