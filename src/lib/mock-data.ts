import type {
  AppNotification,
  AuditEntry,
  LessonBook,
  BookStatus,
  UserAccount,
} from "./types";

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
    fullName: "Quản trị hệ thống",
    username: "admin",
    email: "admin@thcskhuongmai.edu.vn",
    position: "Quản trị viên",
    roles: ["ADMIN"],
    active: true,
    updatedAt: "15/09/2026",
  },
  {
    id: "U002",
    code: "TK002",
    fullName: "Nguyễn Thị Thanh Hà",
    username: "hieutruong",
    email: "ha.nguyen@thcskhuongmai.edu.vn",
    position: "Hiệu trưởng",
    roles: ["BGH"],
    active: true,
    updatedAt: "12/09/2026",
  },
  {
    id: "U003",
    code: "TK003",
    fullName: "Trần Quốc Bảo",
    username: "phohieutruong",
    email: "bao.tran@thcskhuongmai.edu.vn",
    position: "Phó Hiệu trưởng",
    roles: ["PHT"],
    active: true,
    updatedAt: "18/09/2026",
  },
  {
    id: "U004",
    code: "TK004",
    fullName: "Phan Thị Kim Oanh",
    username: "tongphutrach",
    email: "oanh.phan@thcskhuongmai.edu.vn",
    position: "Tổng phụ trách Đội",
    roles: ["TPT"],
    active: true,
    updatedAt: "17/09/2026",
  },
  {
    id: "U005",
    code: "TK005",
    fullName: "Nguyễn Văn An",
    username: "an.nguyen",
    email: "an.nguyen@thcskhuongmai.edu.vn",
    position: "Giáo viên Toán",
    roles: ["GVBM"],
    active: true,
    updatedAt: "20/09/2026",
    subjects: ["Toán"],
  },
  {
    id: "U006",
    code: "TK006",
    fullName: "Lê Thị Minh Thu",
    username: "thu.le",
    email: "thu.le@thcskhuongmai.edu.vn",
    position: "Giáo viên Tiếng Anh - GVCN 7A1",
    roles: ["GVBM", "GVCN"],
    active: true,
    updatedAt: "20/09/2026",
    homeroomClass: "7A1",
    subjects: ["Tiếng Anh"],
  },
  {
    id: "U007",
    code: "TK007",
    fullName: "Trần Thị Bích Ngọc",
    username: "ngoc.tran",
    email: "ngoc.tran@thcskhuongmai.edu.vn",
    position: "Giáo viên Ngữ văn - GVCN 6A1",
    roles: ["GVBM", "GVCN"],
    active: true,
    updatedAt: "19/09/2026",
    homeroomClass: "6A1",
    subjects: ["Ngữ văn"],
  },
  {
    id: "U008",
    code: "TK008",
    fullName: "Đỗ Văn Hùng",
    username: "hung.do",
    email: "hung.do@thcskhuongmai.edu.vn",
    position: "Giáo viên Hóa học - GVCN 7A2",
    roles: ["GVBM", "GVCN"],
    active: true,
    updatedAt: "16/09/2026",
    homeroomClass: "7A2",
    subjects: ["Hóa học"],
  },
  {
    id: "U009",
    code: "TK009",
    fullName: "Vũ Quang Huy",
    username: "huy.vu",
    email: "huy.vu@thcskhuongmai.edu.vn",
    position: "Giáo viên Lịch sử và Địa lý",
    roles: ["GVBM"],
    active: false,
    updatedAt: "02/09/2026",
    subjects: ["Lịch sử và Địa lý"],
  },
  {
    id: "U010",
    code: "TK010",
    fullName: "Hoàng Thị Mai",
    username: "mai.hoang",
    email: "mai.hoang@thcskhuongmai.edu.vn",
    position: "Giáo viên GDCD - GVCN 9A1",
    roles: ["GVBM", "GVCN"],
    active: true,
    updatedAt: "14/09/2026",
    homeroomClass: "9A1",
    subjects: ["GDCD"],
  },
];

export const DEMO_LOGINS = [
  { username: "admin", role: "Admin" },
  { username: "hieutruong", role: "Ban Giám hiệu" },
  { username: "phohieutruong", role: "Phó Hiệu trưởng" },
  { username: "tongphutrach", role: "Tổng phụ trách" },
  { username: "an.nguyen", role: "GVBM" },
  { username: "thu.le", role: "GVBM + GVCN" },
];

const CONTENTS: Record<string, string[]> = {
  Toán: ["Tập hợp. Phần tử của tập hợp", "Phép cộng và phép nhân", "Lũy thừa với số mũ tự nhiên", "Luyện tập chung", "Số nguyên tố. Hợp số"],
  "Ngữ văn": ["Truyện đồng thoại", "Thực hành tiếng Việt", "Viết bài văn kể chuyện", "Nói và nghe", "Ôn tập giữa kỳ"],
  "Tiếng Anh": ["Unit 1: My new school - Getting started", "Unit 1: A closer look 1", "Unit 2: Communication", "Unit 2: Skills 1", "Review 1"],
  "Vật lý": ["Đo chiều dài", "Đo khối lượng", "Lực và biểu diễn lực", "Thực hành đo lực", "Ôn tập chương I"],
  "Hóa học": ["Chất và sự biến đổi của chất", "Nguyên tử", "Nguyên tố hóa học", "Thực hành thí nghiệm", "Luyện tập"],
  "Sinh học": ["Tế bào - đơn vị cơ sở của sự sống", "Cấu tạo tế bào", "Sự lớn lên và sinh sản của tế bào", "Thực hành quan sát tế bào", "Ôn tập"],
  "Lịch sử và Địa lý": ["Lịch sử là gì?", "Thời gian trong lịch sử", "Bản đồ và phương hướng", "Trái Đất trong hệ Mặt Trời", "Ôn tập chủ đề 1"],
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
  "xac_nhan_gvcn",
  "xac_nhan_bgh",
  "da_khoa",
];

const WEEKDAYS = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
const ABSENT_NAMES = ["Nguyễn Gia Bảo", "Trần Khánh Linh", "Lê Hoàng Nam", "Phạm Ngọc Diệp", "Vũ Minh Quân"];
const REASONS = ["Có phép - ốm", "Không phép", "Có phép - việc gia đình"];

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

export function buildLessonBooks(): LessonBook[] {
  const list: LessonBook[] = [];
  let seed = 7;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  let idx = 0;
  for (let day = 14; day <= 26; day++) {
    const wd = WEEKDAYS[(day - 14) % 6];
    if (wd === undefined) continue;
    for (const cls of CLASSES) {
      for (let period = 1; period <= 3; period++) {
        const subj = SUBJECTS[Math.floor(rnd() * SUBJECTS.length)]!;
        const teacher = TEACHERS.find((t) => t.subject === subj.name) ?? TEACHERS[0]!;
        const contents = CONTENTS[subj.name] ?? ["Nội dung bài học"];
        const ppctNo = (idx % 5) + 1;
        const planned = contents[ppctNo - 1] ?? contents[0]!;
        const status = STATUS_CYCLE[idx % STATUS_CYCLE.length]!;
        const advanced = STATUS_CYCLE.indexOf(status) >= 2;
        const nAbs = Math.floor(rnd() * 3);
        const date = `${pad(day)}/09/2026`;
        const time = `${date} ${pad(7 + period)}:${pad(Math.floor(rnd() * 59))}`;
        idx++;
        list.push({
          id: `SDB${pad(idx)}`,
          code: `SDB-2026-${pad(idx)}`,
          date,
          weekday: wd,
          period,
          week: Math.floor((day - 14) / 6) + 1,
          className: cls.name,
          grade: cls.grade,
          subject: subj.name,
          teacher: teacher.name,
          teacherId: teacher.id,
          ppctNo,
          plannedContent: planned,
          actualContent: advanced ? planned : "",
          room: `P.${cls.name}`,
          totalStudents: cls.size,
          absents: advanced
            ? Array.from({ length: nAbs }, (_, i) => ({
                name: ABSENT_NAMES[(idx + i) % ABSENT_NAMES.length]!,
                reason: REASONS[(idx + i) % REASONS.length]!,
              }))
            : [],
          comment: advanced ? "Lớp học nghiêm túc, học sinh tích cực phát biểu." : "",
          score: advanced ? 8 + Math.round(rnd() * 2) : null,
          rank: advanced ? (["A", "A", "B", "C"][idx % 4] as "A" | "B" | "C") : null,
          attachments: advanced && idx % 5 === 0
            ? [
                {
                  id: `F${idx}`,
                  name: `Phieu_hoc_tap_${cls.name}.pdf`,
                  type: "PDF",
                  size: "412 KB",
                  uploadedBy: teacher.name,
                  uploadedAt: time,
                },
              ]
            : [],
          status,


          ...(STATUS_CYCLE.indexOf(status) >= 3 ? { gvbmConfirm: { by: teacher.name, at: time } } : {}),
          ...(STATUS_CYCLE.indexOf(status) >= 4 ? { gvcnConfirm: { by: cls.gvcn, at: time } } : {}),
          ...(STATUS_CYCLE.indexOf(status) >= 5 ? { bghConfirm: { by: "Nguyễn Thị Thanh Hà", at: time } } : {}),
          ...(STATUS_CYCLE.indexOf(status) >= 6 ? { lockedBy: { by: "Nguyễn Thị Thanh Hà", at: time } } : {}),
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
    role: "PHT",
    action: "Nhập PPCT",
    target: "PPCT_HK1_2026_2027.xlsx",
    recordCode: "PPCT-HK1",
    from: "-",
    to: "Đã nhập dữ liệu",
    reason: "-",
  },
  {
    id: "A002",
    at: "18/09/2026 09:40",
    actor: "Trần Quốc Bảo",
    role: "PHT",
    action: "Nhập TKB",
    target: "TKB_HK1_2026_2027.xlsx",
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
    action: "Tự động tạo dữ liệu sổ đầu bài",
    target: "Sổ đầu bài HK I",
    recordCode: "GEN-0918",
    from: "-",
    to: "Được hệ thống tạo",
    reason: "PPCT + TKB khớp dữ liệu",
  },
  {
    id: "A004",
    at: "21/09/2026 15:32",
    actor: "Nguyễn Văn An",
    role: "GVBM",
    action: "Xác nhận GVBM",
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
    action: "Xác nhận GVCN",
    target: "Tiết 1 - 7A1 - Toán",
    recordCode: "SDB-2026-07",
    from: "Đã xác nhận GVBM",
    to: "Đã xác nhận GVCN",
    reason: "-",
  },
  {
    id: "A006",
    at: "22/09/2026 09:00",
    actor: "Nguyễn Thị Thanh Hà",
    role: "BGH",
    action: "Xác nhận BGH",
    target: "Tiết 2 - 8A1 - Vật lý",
    recordCode: "SDB-2026-21",
    from: "Đã xác nhận GVCN",
    to: "Đã xác nhận BGH",
    reason: "-",
  },
  {
    id: "A007",
    at: "22/09/2026 14:25",
    actor: "Nguyễn Thị Thanh Hà",
    role: "BGH",
    action: "Khóa sổ",
    target: "Tiết 3 - 9A1 - GDCD",
    recordCode: "SDB-2026-33",
    from: "Đã xác nhận BGH",
    to: "Đã khóa",
    reason: "Hoàn tất quy trình tuần 3",
  },
  {
    id: "A008",
    at: "23/09/2026 08:45",
    actor: "Nguyễn Thị Thanh Hà",
    role: "BGH",
    action: "Mở khóa",
    target: "Tiết 1 - 6A2 - Ngữ văn",
    recordCode: "SDB-2026-12",
    from: "Đã khóa",
    to: "Đã xác nhận BGH",
    reason: "Yêu cầu chỉnh sửa được chấp thuận",
  },
];

export const NOTIFICATIONS: AppNotification[] = [
  { id: "N1", roles: ["GVBM"], title: "Bạn có 2 tiết chưa hoàn thiện.", time: "Hôm nay 07:30", type: "warning" },
  { id: "N2", roles: ["GVBM"], title: "Có 2 tiết cần bổ sung thông tin.", time: "Hôm qua 16:20", type: "warning" },
  { id: "N3", roles: ["GVCN"], title: "Có 3 sổ đầu bài lớp 7A1 chờ xác nhận.", time: "Hôm nay 08:05", type: "info" },
  { id: "N4", roles: ["BGH"], title: "Có 15 sổ đầu bài chờ BGH xác nhận.", time: "Hôm nay 07:50", type: "info" },
  { id: "N5", roles: ["BGH"], title: "Có 8 sổ đầu bài chờ BGH xác nhận.", time: "Hôm nay 07:50", type: "info" },
  { id: "N6", roles: ["TPT"], title: "Có 10 sổ đầu bài cần theo dõi.", time: "Hôm nay 08:15", type: "info" },
  { id: "N7", roles: ["TPT"], title: "Có 4 sổ đầu bài đã được BGH xác nhận.", time: "Hôm nay 08:15", type: "warning" },
  { id: "N8", roles: ["PHT"], title: "PPCT đã được nhập thành công.", time: "18/09/2026 08:12", type: "success" },
  { id: "N9", roles: ["PHT"], title: "Có 8 dòng TKB cần kiểm tra.", time: "18/09/2026 09:41", type: "warning" },
  { id: "N10", roles: ["PHT"], title: "Dữ liệu sổ đầu bài đã sẵn sàng để hình thành tiết học.", time: "18/09/2026 09:55", type: "info" },
  { id: "N11", roles: ["ADMIN"], title: "2 tài khoản đang ở trạng thái tạm khóa.", time: "Hôm nay 06:00", type: "info" },
];

export const PPCT_ROWS = Array.from({ length: 12 }, (_, i) => {
  const subj = SUBJECTS[i % SUBJECTS.length]!;
  const contents = CONTENTS[subj.name] ?? ["Nội dung bài học"];
  return {
    week: Math.floor(i / 3) + 1,
    ppct: (i % 5) + 1,
    subject: subj.name,
    grade: `Khối ${6 + (i % 4)}`,
    content: contents[i % contents.length]!,
    year: NAM_HOC,
    semester: HOC_KY,
    error: i === 4 ? "Thiếu số tiết PPCT" : i === 9 ? "Trùng bản ghi" : "",
  };
});

export const TKB_ROWS = Array.from({ length: 12 }, (_, i) => {
  const cls = CLASSES[i % CLASSES.length]!;
  const subj = SUBJECTS[(i * 3) % SUBJECTS.length]!;
  const teacher = TEACHERS.find((t) => t.subject === subj.name) ?? TEACHERS[0]!;
  return {
    weekday: WEEKDAYS[i % 6]!,
    date: `${pad(14 + (i % 6))}/09/2026`,
    period: (i % 5) + 1,
    className: cls.name,
    subject: subj.name,
    teacher: teacher.name,
    room: `P.${cls.name}`,
    year: NAM_HOC,
    semester: HOC_KY,
    error: i === 3 ? "Không khớp giáo viên" : i === 8 ? "Không khớp lớp" : "",
  };
});
