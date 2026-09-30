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
  BGH: "Ban Giám hiệu",
  TPT: "Tổng phụ trách",
  GVBM: "GVBM",
  GVCN: "GVCN",
};

export type Permission =
  | "user.manage"
  | "role.manage"
  | "perm.manage"
  | "system.info"
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
  | "ctrl.check"
  | "ctrl.approve"
  | "ctrl.request_fix"
  | "ctrl.lock"
  | "ctrl.unlock"
  | "ctrl.archive"
  | "ctrl.restore"
  | "audit.view"
  | "report.view";

export interface UserAccount {
  id: string;
  code: string;
  fullName: string;
  username: string;
  email: string;
  position: string;
  roles: RoleCode[];
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
  | "cho_kiem_tra"
  | "yeu_cau_chinh_sua"
  | "da_kiem_tra"
  | "cho_duyet"
  | "da_duyet"
  | "da_khoa"
  | "da_luu_tru"
  | "da_khoi_phuc";

export const STATUS_LABEL: Record<BookStatus, string> = {
  he_thong_tao: "Được hệ thống tạo",
  chua_hoan_thien: "Chưa hoàn thiện",
  da_cap_nhat: "Đã cập nhật",
  xac_nhan_gvbm: "Đã xác nhận GVBM",
  xac_nhan_gvcn: "Đã xác nhận GVCN",
  cho_kiem_tra: "Chờ kiểm tra",
  yeu_cau_chinh_sua: "Yêu cầu chỉnh sửa",
  da_kiem_tra: "Đã kiểm tra",
  cho_duyet: "Chờ duyệt",
  da_duyet: "Đã duyệt",
  da_khoa: "Đã khóa",
  da_luu_tru: "Đã lưu trữ",
  da_khoi_phuc: "Đã khôi phục",
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
  date: string; // dd/mm/yyyy
  weekday: string;
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
  checkedBy?: { by: string; at: string };
  approvedBy?: { by: string; at: string };
  lockedBy?: { by: string; at: string };
  archivedBy?: { by: string; at: string };
  fixReason?: string;
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
