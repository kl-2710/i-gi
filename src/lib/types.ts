export type RoleCode = "ADMIN" | "BGH" | "TPT" | "GVBM" | "GVCN";

export const ROLE_LABEL: Record<RoleCode, string> = {
  ADMIN: "Quản trị hệ thống",
  BGH: "Ban Giám hiệu",
  TPT: "Tổng phụ trách",
  GVBM: "Giáo viên bộ môn",
  GVCN: "Giáo viên chủ nhiệm",
};

export const ROLE_SHORT: Record<RoleCode, string> = {
  ADMIN: "Admin",
  BGH: "BGH",
  TPT: "TPT",
  GVBM: "GVBM",
  GVCN: "GVCN",
};

export type Permission =
  | "user.manage"
  | "perm.manage"
  | "setup.view"
  | "setup.manage"
  | "ppct.upload"
  | "tkb.upload"
  | "gen.confirm"
  | "book.view.all"
  | "book.view.own"
  | "book.view.class"
  | "book.edit"
  | "book.confirm.gvbm"
  | "book.confirm.gvcn"
  | "book.confirm.bgh"
  | "book.lock"
  | "book.unlock"
  | "report.view"
  | "profile.view"
  | "blocked.route";

export interface UserAccount {
  id: string;
  code: string;
  fullName: string;
  username: string;
  email: string;
  position: string;
  roles: RoleCode[];
  /** Quyền bổ sung/điều chỉnh ở cấp tài khoản; dùng khi cùng một vai trò có chức vụ khác nhau. */
  permissions?: Permission[];
  active: boolean;
  updatedAt: string;
  homeroomClass?: string;
  subjects?: string[];
}

export type BookStatus =
  | "he_thong_tao"
  | "chua_hoan_thien"
  | "da_cap_nhat"
  | "xac_nhan_gvbm"
  | "xac_nhan_gvcn"
  | "xac_nhan_bgh"
  | "da_khoa";

export const STATUS_LABEL: Record<BookStatus, string> = {
  he_thong_tao: "Được hệ thống hình thành",
  chua_hoan_thien: "Chưa hoàn thiện",
  da_cap_nhat: "Đã cập nhật",
  xac_nhan_gvbm: "Đã xác nhận GVBM",
  xac_nhan_gvcn: "Đã xác nhận GVCN",
  xac_nhan_bgh: "Đã xác nhận BGH",
  da_khoa: "Đã khóa",
};

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface AbsentStudent {
  name: string;
  reason: string;
}

export interface LessonBook {
  id: string;
  code: string;
  date: string;
  weekday: string;
  week: number;
  period: number;
  className: string;
  grade: string;
  subject: string;
  teacher: string;
  teacherId: string;
  ppctNo: number;
  plannedContent: string;
  actualContent: string;
  room: string;
  totalStudents: number;
  absents: AbsentStudent[];
  comment: string;
  score: number | null;
  rank: "A" | "B" | "C" | "D" | null;
  attachments: Attachment[];
  status: BookStatus;
  gvbmConfirm?: { by: string; at: string };
  gvcnConfirm?: { by: string; at: string };
  bghConfirm?: { by: string; at: string };
  lockedBy?: { by: string; at: string };
  year: string;
  semester: string;
}

export interface AuditEntry {
  id: string;
  at: string;
  actor: string;
  role: RoleCode;
  action: string;
  target: string;
  recordCode: string;
  from: string;
  to: string;
  reason: string;
}

export interface AppNotification {
  id: string;
  roles: RoleCode[];
  title: string;
  time: string;
  type: "info" | "warning" | "success";
}
