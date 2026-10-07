import {
  BarChart3, BookOpen, CalendarRange, ClipboardList, FileSpreadsheet,
  GraduationCap, KeyRound, LayoutDashboard, Library,
  UserRound, Users, UserSearch, Sparkles
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
    label: "1. QUẢN TRỊ HỆ THỐNG",
    icon: Users,
    perms: ["user.manage", "perm.manage"],
    items: [
      { label: "Quản lý tài khoản", to: "/nguoi-dung/tai-khoan", icon: Users, perms: ["user.manage"] },
      { label: "Quản lý phân quyền", to: "/nguoi-dung/phan-quyen", icon: KeyRound, perms: ["perm.manage"] },
    ],
  },
  {
    label: "2. QUẢN LÝ DANH MỤC VÀ DỮ LIỆU DẠY HỌC",
    icon: GraduationCap,
    perms: ["setup.view"],
    items: [
      { label: "Năm học / Học kỳ", to: "/day-hoc/nam-hoc", icon: CalendarRange, perms: ["setup.view"] },
      { label: "Theo dõi giáo viên", to: "/day-hoc/giao-vien", icon: UserSearch, perms: ["setup.view"] },
      { label: "Khối / Lớp học", to: "/day-hoc/lop", icon: Library, perms: ["setup.view"] },
      { label: "Môn học", to: "/day-hoc/mon-hoc", icon: BookOpen, perms: ["setup.view"] },
      { label: "PPCT", to: "/day-hoc/ppct", icon: ClipboardList, perms: ["ppct.upload"] },
      { label: "TKB", to: "/day-hoc/tkb", icon: FileSpreadsheet, perms: ["tkb.upload"] },
      { label: "Hình thành tiết học", to: "/day-hoc/sinh-so-dau-bai", icon: Sparkles, perms: ["gen.confirm"] },
    ],
  },
  {
    label: "3. QUẢN LÝ SỔ ĐẦU BÀI",
    icon: BookOpen,
    perms: ["book.view.all", "book.view.own", "book.view.class"],
    items: [
      { label: "Danh sách sổ đầu bài", to: "/so-dau-bai", icon: BookOpen, perms: ["book.view.all", "book.view.own", "book.view.class"] },
    ],
  },
  {
    label: "4. BÁO CÁO VÀ THỐNG KÊ",
    icon: BarChart3,
    perms: ["report.view"],
    items: [
      { label: "Thống kê tiến độ giảng dạy", to: "/bao-cao", icon: BarChart3, perms: ["report.view"] },
      { label: "Thống kê kết quả xếp loại tiết học", to: "/bao-cao", icon: BarChart3, perms: ["report.view"] },
      { label: "Thống kê tình trạng hoàn thiện Sổ đầu bài", to: "/bao-cao", icon: BarChart3, perms: ["report.view"] },
      { label: "Báo cáo Sổ đầu bài tổng hợp", to: "/bao-cao", icon: BarChart3, perms: ["report.view"] },
    ],
  },
];
