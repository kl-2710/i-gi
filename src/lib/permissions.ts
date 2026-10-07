import type { Permission, RoleCode } from "./types";

export const ROLE_PERMISSIONS: Record<RoleCode, Permission[]> = {
  ADMIN: [
    "user.manage", "perm.manage", "setup.view", "setup.manage",
    "ppct.upload", "tkb.upload", "gen.confirm",
    "book.view.all", "book.view.own", "book.view.class", "book.edit",
    "book.confirm.gvbm", "book.confirm.gvcn", "book.confirm.bgh",
    "book.lock", "book.unlock", "report.view", "profile.view",
  ],
  BGH: [
    "setup.view", "book.view.all", "book.confirm.bgh",
    "book.lock", "book.unlock", "report.view", "profile.view",
  ],
  PHT: [
    "setup.view", "setup.manage", "ppct.upload", "tkb.upload", "gen.confirm",
    "book.view.all", "report.view", "profile.view",
  ],
  TPT: [
    "book.view.all", "report.view", "profile.view",
  ],
  GVBM: [
    "setup.view", "book.view.own", "book.edit", "book.confirm.gvbm", "profile.view",
  ],
  GVCN: [
    "setup.view", "book.view.class", "book.confirm.gvcn", "profile.view",
  ],
};

export const PERMISSION_GROUPS: {
  module: string;
  items: { key: Permission; label: string; roles: RoleCode[] }[];
}[] = [
  {
    module: "1. QUẢN TRỊ HỆ THỐNG",
    items: [
      { key: "user.manage", label: "Quản lý tài khoản người dùng", roles: ["ADMIN"] },
      { key: "perm.manage", label: "Quản lý phân quyền", roles: ["ADMIN"] },
      { key: "profile.view", label: "Hồ sơ cá nhân", roles: ["ADMIN", "BGH", "PHT", "TPT", "GVBM", "GVCN"] },
    ],
  },
  {
    module: "2. QUẢN LÝ DANH MỤC VÀ DỮ LIỆU DẠY HỌC",
    items: [
      { key: "setup.view", label: "Xem danh mục và dữ liệu dạy học", roles: ["ADMIN", "BGH", "PHT", "TPT", "GVBM", "GVCN"] },
      { key: "setup.manage", label: "Quản lý danh mục dữ liệu dạy học", roles: ["ADMIN", "PHT"] },
      { key: "ppct.upload", label: "Nhập PPCT", roles: ["PHT"] },
      { key: "tkb.upload", label: "Nhập TKB", roles: ["PHT"] },
      { key: "gen.confirm", label: "Hình thành tiết học", roles: ["PHT"] },
    ],
  },
  {
    module: "3. QUẢN LÝ SỔ ĐẦU BÀI",
    items: [
      { key: "book.view.all", label: "Xem sổ đầu bài toàn trường", roles: ["BGH", "PHT", "TPT", "ADMIN"] },
      { key: "book.view.own", label: "Xem tiết dạy được phân công", roles: ["GVBM", "ADMIN"] },
      { key: "book.view.class", label: "Xem sổ lớp chủ nhiệm", roles: ["GVCN", "ADMIN"] },
      { key: "book.edit", label: "Cập nhật thông tin tiết học", roles: ["GVBM", "ADMIN"] },
      { key: "book.confirm.gvbm", label: "Xác nhận Sổ đầu bài của GVBM", roles: ["GVBM", "ADMIN"] },
      { key: "book.confirm.gvcn", label: "Xác nhận Sổ đầu bài của GVCN", roles: ["GVCN", "ADMIN"] },
      { key: "book.confirm.bgh", label: "Xác nhận Sổ đầu bài của BGH", roles: ["BGH", "ADMIN"] },
      { key: "book.lock", label: "Khóa Sổ đầu bài", roles: ["BGH", "ADMIN"] },
      { key: "book.unlock", label: "Mở khóa Sổ đầu bài", roles: ["BGH", "ADMIN"] },
    ],
  },
  {
    module: "4. BÁO CÁO VÀ THỐNG KÊ",
    items: [
      { key: "report.view", label: "Xem báo cáo và thống kê", roles: ["BGH", "PHT", "TPT", "ADMIN", "GVBM", "GVCN"] },
    ],
  },
];

export const PERMISSION_CATEGORIES = ["Xem", "Thêm", "Sửa", "Cập nhật", "Xác nhận", "Khóa", "Mở khóa"];

export function hasPerm(role: RoleCode, perm: Permission) {
  return ROLE_PERMISSIONS[role].includes(perm);
}
