import {
  Archive,
  BarChart3,
  BookOpen,
  CalendarRange,
  CheckSquare,
  ClipboardList,
  FileSpreadsheet,
  GraduationCap,
  History,
  KeyRound,
  LayoutDashboard,
  Library,
  ListChecks,
  Lock,
  Server,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import type { Permission } from "@/lib/types";

export interface NavItem {
  label: string;
  to: string;
  icon: typeof Users;
  perms: Permission[];
}

export interface NavGroup {
  label: string;
  icon: typeof Users;
  items: NavItem[];
  perms: Permission[];
}

export const DASHBOARD_ITEM: NavItem = {
  label: "Dashboard",
  to: "/dashboard",
  icon: LayoutDashboard,
  perms: [],
};

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "1. Quản lý người dùng & phân quyền",
    icon: Users,
    perms: ["user.manage", "role.manage", "perm.manage"],
    items: [
      { label: "Quản lý tài khoản", to: "/nguoi-dung/tai-khoan", icon: Users, perms: ["user.manage"] },
      { label: "Quản lý vai trò", to: "/nguoi-dung/vai-tro", icon: ShieldCheck, perms: ["role.manage"] },
      { label: "Quản lý phân quyền", to: "/nguoi-dung/phan-quyen", icon: KeyRound, perms: ["perm.manage"] },
    ],
  },
  {
    label: "2. Thiết lập dạy học",
    icon: GraduationCap,
    perms: ["setup.view", "setup.manage"],
    items: [
      { label: "Năm học / Học kỳ", to: "/day-hoc/nam-hoc", icon: CalendarRange, perms: ["setup.view"] },
      { label: "Lớp", to: "/day-hoc/lop", icon: Library, perms: ["setup.view"] },
      { label: "Môn học", to: "/day-hoc/mon-hoc", icon: BookOpen, perms: ["setup.view"] },
      { label: "PPCT", to: "/day-hoc/ppct", icon: ClipboardList, perms: ["ppct.upload"] },
      { label: "TKB", to: "/day-hoc/tkb", icon: FileSpreadsheet, perms: ["tkb.upload"] },
      { label: "Sinh dữ liệu sổ đầu bài", to: "/day-hoc/sinh-so-dau-bai", icon: Sparkles, perms: ["gen.confirm"] },
    ],
  },
  {
    label: "3. Quản lý sổ đầu bài",
    icon: BookOpen,
    perms: ["book.view.all", "book.view.own", "book.view.class"],
    items: [
      {
        label: "Danh sách sổ đầu bài",
        to: "/so-dau-bai",
        icon: BookOpen,
        perms: ["book.view.all", "book.view.own", "book.view.class"],
      },
    ],
  },
  {
    label: "4. Kiểm soát & lưu trữ",
    icon: CheckSquare,
    perms: ["ctrl.check", "ctrl.approve", "ctrl.lock", "ctrl.archive", "audit.view"],
    items: [
      { label: "Kiểm tra", to: "/kiem-soat/kiem-tra", icon: ListChecks, perms: ["ctrl.check"] },
      { label: "Duyệt", to: "/kiem-soat/duyet", icon: CheckSquare, perms: ["ctrl.approve"] },
      { label: "Khóa / Mở khóa", to: "/kiem-soat/khoa-so", icon: Lock, perms: ["ctrl.lock"] },
      { label: "Lưu trữ / Khôi phục", to: "/kiem-soat/luu-tru", icon: Archive, perms: ["ctrl.archive"] },
      { label: "Lịch sử thao tác", to: "/kiem-soat/lich-su", icon: History, perms: ["audit.view"] },
      { label: "Thông tin hệ thống", to: "/kiem-soat/he-thong", icon: Server, perms: ["audit.view", "system.info"] },
    ],
  },
  {
    label: "5. Báo cáo & thống kê",
    icon: BarChart3,
    perms: ["report.view"],
    items: [
      { label: "Báo cáo Sổ đầu bài tổng hợp", to: "/bao-cao", icon: BarChart3, perms: ["report.view"] },
    ],
  },
];
