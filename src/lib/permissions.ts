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
    "book.confirm.bgh",
    "book.lock",
    "book.unlock",
    "report.view",
    "ctrl.check",
    "ctrl.approve",
    "ctrl.request_fix",
    "ctrl.lock",
    "ctrl.unlock",
    "ctrl.archive",
    "ctrl.restore",
  ],
  BGH: [
    "setup.view",
    "setup.manage",
    "ppct.upload",
    "tkb.upload",
    "gen.confirm",
    "book.view.all",
    "book.confirm.bgh",
    "book.lock",
    "book.unlock",
    "report.view",
    "audit.view",
  ],
  TPT: [
    "setup.view",
    "book.view.all",
    "report.view",
  ],
  GVBM: [
    "setup.view",
    "book.view.own",
    "book.edit",
    "book.confirm.gvbm",
  ],
  GVCN: [
    "setup.view",
    "book.view.class",
    "book.confirm.gvcn",
  ],
};

export const PERMISSION_GROUPS: {
  module: string;
  items: { key: string; label: string; roles: RoleCode[] }[];
}[] = [
  {
    module: "1. Quản trị hệ thống",
    items: [
      { key: "user.manage", label: "Quản lý tài khoản", roles: ["ADMIN"] },
      { key: "role.manage", label: "Quản lý phân quyền", roles: ["ADMIN"] },
      { key: "perm.manage", label: "Quản lý quyền", roles: ["ADMIN"] },
      { key: "system.info", label: "Xem thông tin hệ thống", roles: ["ADMIN"] },
    ],
  },
  {
    module: "2. Quản lý danh mục và dữ liệu dạy học",
    items: [
      { key: "setup.view", label: "Xem dữ liệu dạy học", roles: ["ADMIN", "BGH", "TPT", "GVBM", "GVCN"] },
      { key: "setup.manage", label: "Quản lý năm học, học kỳ, lớp", roles: ["ADMIN", "BGH"] },
      { key: "ppct.upload", label: "Nhập PPCT", roles: ["ADMIN", "BGH"] },
      { key: "tkb.upload", label: "Nhập TKB", roles: ["ADMIN", "BGH"] },
      { key: "gen.confirm", label: "Hình thành dữ liệu tiết dạy và Sổ đầu bài", roles: ["ADMIN", "BGH"] },
    ],
  },
  {
    module: "3. Quản lý Sổ đầu bài",
    items: [
      { key: "book.view.all", label: "Xem Sổ đầu bài toàn trường", roles: ["ADMIN", "BGH", "TPT"] },
      { key: "book.view.own", label: "Xem tiết dạy của mình", roles: ["GVBM"] },
      { key: "book.view.class", label: "Xem Sổ đầu bài lớp chủ nhiệm", roles: ["GVCN"] },
      { key: "book.edit", label: "Cập nhật thông tin tiết dạy", roles: ["GVBM"] },
      { key: "book.confirm.gvbm", label: "Xác nhận tiết học", roles: ["GVBM"] },
      { key: "book.confirm.gvcn", label: "Xác nhận Sổ đầu bài theo tuần", roles: ["GVCN"] },
      { key: "book.confirm.bgh", label: "Xác nhận Sổ đầu bài", roles: ["BGH"] },
      { key: "book.lock", label: "Khóa Sổ đầu bài", roles: ["BGH"] },
      { key: "book.unlock", label: "Mở khóa Sổ đầu bài", roles: ["BGH"] },
    ],
  },
  {
    module: "4. Báo cáo và thống kê",
    items: [
      { key: "report.view", label: "Xem báo cáo và thống kê", roles: ["ADMIN", "BGH", "TPT", "GVBM", "GVCN"] },
    ],
  },
];

export const PERMISSION_CATEGORIES = [
  "Xem",
  "Thêm",
  "Sửa",
  "Xóa",
  "Xác nhận",
  "Khóa",
  "Mở khóa",
];

export function hasPerm(role: RoleCode, perm: Permission) {
  return ROLE_PERMISSIONS[role].includes(perm);
}
