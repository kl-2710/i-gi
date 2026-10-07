import type { Permission, RoleCode } from "./types";

export const ROLE_PERMISSIONS: Record<RoleCode, Permission[]> = {
  ADMIN: [
    "user.manage",
    "role.manage",
    "perm.manage",
    "profile.view",
    "profile.edit",
  ],

  BGH: [
    "profile.view",
    "profile.edit",
    "setup.view",
    "teacher.view",
    "book.view.all",
    "book.confirm.bgh",
    "book.lock",
    "book.unlock",
    "report.view",
  ],

  PHT: [
    "profile.view",
    "profile.edit",
    "setup.view",
    "setup.manage",
    "teacher.view",
    "ppct.upload",
    "tkb.upload",
    "gen.confirm",
  ],

  TPT: [
    "profile.view",
    "profile.edit",
    "book.view.all",
    "report.view",
  ],

  GVBM: [
    "profile.view",
    "profile.edit",
    "setup.view",
    "book.view.own",
    "book.edit",
    "book.confirm.gvbm",
    "report.view",
  ],

  GVCN: [
    "profile.view",
    "profile.edit",
    "setup.view",
    "book.view.class",
    "book.confirm.gvcn",
    "report.view",
  ],
};

export const PERMISSION_GROUPS: {
  module: string;
  items: { key: Permission; label: string; roles: RoleCode[] }[];
}[] = [
  {
    module: "1. Quản trị hệ thống",
    items: [
      { key: "user.manage", label: "Quản lý tài khoản người dùng", roles: ["ADMIN"] },
      { key: "role.manage", label: "Quản lý vai trò", roles: ["ADMIN"] },
      { key: "perm.manage", label: "Quản lý phân quyền", roles: ["ADMIN"] },
      { key: "profile.view", label: "Xem hồ sơ cá nhân", roles: ["ADMIN", "BGH", "PHT", "TPT", "GVBM", "GVCN"] },
      { key: "profile.edit", label: "Cập nhật hồ sơ / đổi mật khẩu", roles: ["ADMIN", "BGH", "PHT", "TPT", "GVBM", "GVCN"] },
    ],
  },
  {
    module: "2. Quản lý danh mục và dữ liệu dạy học",
    items: [
      { key: "setup.view", label: "Xem danh mục và dữ liệu dạy học", roles: ["BGH", "PHT", "GVBM", "GVCN"] },
      { key: "setup.manage", label: "Quản lý năm học, học kỳ, lớp, môn học và lịch học", roles: ["PHT"] },
      { key: "teacher.view", label: "Theo dõi giáo viên", roles: ["BGH", "PHT"] },
      { key: "ppct.upload", label: "Nhập PPCT", roles: ["PHT"] },
      { key: "tkb.upload", label: "Nhập TKB", roles: ["PHT"] },
      { key: "gen.confirm", label: "Đối soát và hình thành tiết học", roles: ["PHT"] },
    ],
  },
  {
    module: "3. Quản lý Sổ đầu bài",
    items: [
      { key: "book.view.all", label: "Xem Sổ đầu bài toàn trường", roles: ["BGH", "TPT"] },
      { key: "book.view.own", label: "Xem các tiết dạy được phân công", roles: ["GVBM"] },
      { key: "book.view.class", label: "Xem Sổ đầu bài lớp chủ nhiệm", roles: ["GVCN"] },
      { key: "book.edit", label: "Cập nhật thông tin tiết học", roles: ["GVBM"] },
      { key: "book.confirm.gvbm", label: "Xác nhận Sổ đầu bài của GVBM", roles: ["GVBM"] },
      { key: "book.confirm.gvcn", label: "Xác nhận Sổ đầu bài của GVCN theo tuần", roles: ["GVCN"] },
      { key: "book.confirm.bgh", label: "Xác nhận Sổ đầu bài của BGH", roles: ["BGH"] },
      { key: "book.lock", label: "Khóa Sổ đầu bài", roles: ["BGH"] },
      { key: "book.unlock", label: "Mở khóa Sổ đầu bài", roles: ["BGH"] },
    ],
  },
  {
    module: "4. Báo cáo và thống kê",
    items: [
      { key: "report.view", label: "Xem báo cáo và thống kê", roles: ["BGH", "PHT", "TPT", "GVBM", "GVCN"] },
    ],
  },
];

export const PERMISSION_CATEGORIES = [
  "Xem",
  "Thêm",
  "Sửa",
  "Cập nhật",
  "Xác nhận",
  "Khóa",
  "Mở khóa",
];

export function hasPerm(role: RoleCode, perm: Permission) {
  return ROLE_PERMISSIONS[role].includes(perm);
}
