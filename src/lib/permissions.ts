import type { Permission, RoleCode } from "./types";

export const ROLE_PERMISSIONS: Record<RoleCode, Permission[]> = {
  ADMIN: [
    "user.manage",
    "role.manage",
    "perm.manage",
    "system.info",
    "audit.view",
    "setup.view",
    "setup.manage",
    "ppct.upload",
    "tkb.upload",
    "gen.confirm",
    "book.view.all",
    "book.view.own",
    "book.view.class",
    "book.edit",
    "book.confirm.gvbm",
    "book.confirm.gvcn",
    "ctrl.check",
    "ctrl.approve",
    "ctrl.request_fix",
    "ctrl.lock",
    "ctrl.unlock",
    "ctrl.archive",
    "ctrl.restore",
    "report.view",
  ],

  BGH: [
    "setup.view",
    "setup.manage",
    "ppct.upload",
    "tkb.upload",
    "gen.confirm",
    "book.view.all",
    "ctrl.check",
    "ctrl.approve",
    "ctrl.request_fix",
    "report.view",
    "audit.view",
  ],

  TPT: [
    "book.view.all",
    "ctrl.check",
    "ctrl.approve",
    "ctrl.request_fix",
    "ctrl.lock",
    "ctrl.unlock",
    "ctrl.archive",
    "ctrl.restore",
    "report.view",
    "audit.view",
    "setup.view",
  ],

  GVBM: [
    "book.view.own",
    "book.edit",
    "book.confirm.gvbm",
    "report.view",
    "setup.view",
  ],

  GVCN: [
    "book.view.class",
    "book.confirm.gvcn",
    "report.view",
    "setup.view",
  ],
};

export const PERMISSION_GROUPS: {
  module: string;
  items: { key: string; label: string; roles: RoleCode[] }[];
}[] = [
  {
    module: "1. Quản lý người dùng & phân quyền",
    items: [
      { key: "user.view", label: "Xem tài khoản", roles: ["ADMIN"] },
      { key: "user.add", label: "Thêm tài khoản", roles: ["ADMIN"] },
      { key: "user.edit", label: "Sửa tài khoản", roles: ["ADMIN"] },
      { key: "role.manage", label: "Quản lý vai trò", roles: ["ADMIN"] },
      { key: "perm.manage", label: "Quản lý phân quyền", roles: ["ADMIN"] },
    ],
  },
  {
    module: "2. Thiết lập dạy học",
    items: [
      { key: "setup.view", label: "Xem thiết lập", roles: ["ADMIN", "BGH", "TPT", "GVBM", "GVCN"] },
      { key: "setup.manage", label: "Quản lý dữ liệu (năm học, lớp, môn)", roles: ["BGH"] },
      { key: "ppct.upload", label: "Upload PPCT", roles: ["BGH"] },
      { key: "tkb.upload", label: "Upload TKB", roles: ["BGH"] },
      { key: "gen.confirm", label: "Xác nhận tạo dữ liệu sổ", roles: ["BGH"] },
    ],
  },
  {
    module: "3. Quản lý sổ đầu bài",
    items: [
      { key: "book.view.all", label: "Xem toàn trường", roles: ["BGH", "TPT"] },
      { key: "book.view.own", label: "Xem tiết của mình", roles: ["GVBM"] },
      { key: "book.view.class", label: "Xem sổ lớp chủ nhiệm", roles: ["GVCN"] },
      { key: "book.edit", label: "Sửa nội dung chuyên môn", roles: ["GVBM"] },
      { key: "book.confirm.gvbm", label: "Xác nhận GVBM", roles: ["GVBM"] },
      { key: "book.confirm.gvcn", label: "Xác nhận GVCN", roles: ["GVCN"] },
    ],
  },
  {
    module: "4. Kiểm soát & lưu trữ",
    items: [
      { key: "ctrl.check", label: "Kiểm tra", roles: ["BGH", "TPT"] },
      { key: "ctrl.approve", label: "Duyệt", roles: ["BGH", "TPT"] },
      { key: "ctrl.request_fix", label: "Yêu cầu chỉnh sửa", roles: ["BGH", "TPT"] },
      { key: "ctrl.lock", label: "Khóa sổ", roles: ["TPT"] },
      { key: "ctrl.unlock", label: "Mở khóa", roles: ["TPT"] },
      { key: "ctrl.archive", label: "Lưu trữ", roles: ["TPT"] },
      { key: "ctrl.restore", label: "Khôi phục", roles: ["TPT"] },
      { key: "audit.view", label: "Xem lịch sử thao tác", roles: ["ADMIN", "BGH", "TPT"] },
    ],
  },
  {
    module: "5. Báo cáo & thống kê",
    items: [
      { key: "report.view", label: "Xem báo cáo sổ đầu bài tổng hợp", roles: ["BGH", "TPT", "GVBM", "GVCN"] },
    ],
  },
];

export const PERMISSION_CATEGORIES = [
  "Xem",
  "Thêm",
  "Sửa",
  "Xác nhận",
  "Kiểm tra",
  "Duyệt",
  "Khóa",
  "Mở khóa",
  "Lưu trữ",
  "Khôi phục",
  "Quản lý dữ liệu",
];

export function hasPerm(role: RoleCode, perm: Permission) {
  return ROLE_PERMISSIONS[role].includes(perm);
}
