import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  CheckCircle2,
  ClipboardList,
  FileSpreadsheet,
  GraduationCap,
  Layers,
  ListChecks,
  Lock,
  ShieldCheck,
  TriangleAlert,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { DashboardCard } from "@/components/common/DashboardCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/States";
import { TableCard, ScrollTable } from "@/components/common/DataTable";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-state";
import { CLASSES, SUBJECTS } from "@/lib/mock-data";
import { ROLE_LABEL, type BookStatus } from "@/lib/types";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Hệ thống quản lý Sổ đầu bài" },
      { name: "description", content: "Tổng quan tình trạng Sổ đầu bài theo vai trò người dùng." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user, role, scopedBooks, books, notifications, weeklyGvcnConfirmations, bghConfirmed, yearEndReached } = useApp();
  if (!user || !role) return null;

  const count = (...statuses: BookStatus[]) => scopedBooks.filter((b) => statuses.includes(b.status)).length;
  const attention = scopedBooks
    .filter((b) => ["he_thong_tao", "chua_hoan_thien", "da_cap_nhat", "yeu_cau_chinh_sua"].includes(b.status))
    .slice(0, 8);

  const weeks = Array.from(
    new Set(scopedBooks.map((b) => b.weekNumber)),
  ).sort((a, b) => a - b);

  const cards = () => {
    switch (role) {
      case "GVBM":
        return [
          { label: "Tiết chưa hoàn thiện", value: count("he_thong_tao", "chua_hoan_thien"), icon: TriangleAlert, tone: "warning" as const },
          { label: "Tiết đã cập nhật", value: count("da_cap_nhat"), icon: BookOpen, tone: "info" as const },
          { label: "Tiết chờ xác nhận", value: count("da_cap_nhat"), icon: ListChecks, tone: "primary" as const },
          { label: "Tiết đã xác nhận", value: count("xac_nhan_gvbm", "xac_nhan_gvcn", "xac_nhan_bgh", "da_khoa"), icon: CheckCircle2, tone: "success" as const },
          { label: "Yêu cầu chỉnh sửa", value: count("yeu_cau_chinh_sua"), icon: TriangleAlert, tone: "danger" as const },
        ];
      case "GVCN":
        return [
          { label: "Lớp chủ nhiệm", value: user.homeroomClass ?? "-", icon: GraduationCap, tone: "primary" as const },
          { label: "Tổng số tiết của lớp", value: scopedBooks.length, icon: BookOpen, tone: "info" as const },
          { label: "Tuần đủ điều kiện xác nhận", value: weeks.filter((w) => scopedBooks.filter((b) => b.weekNumber === w).every((b) => !!b.gvbmConfirm)).length, icon: ListChecks, tone: "warning" as const },
          { label: "Tuần đã xác nhận", value: weeks.filter((w) => !!weeklyGvcnConfirmations[`${scopedBooks.find((b) => b.weekNumber === w)?.year}|${user.homeroomClass}|W${w}`]).length, icon: CheckCircle2, tone: "success" as const },
        ];
      case "BGH":
        return [
          { label: "PPCT", value: "Đã nhập", icon: ClipboardList, tone: "success" as const },
          { label: "TKB", value: "Đã nhập", icon: FileSpreadsheet, tone: "success" as const },
          { label: "Dữ liệu tiết dạy", value: books.length, icon: BookOpen, tone: "primary" as const },
          { label: "Đã xác nhận GVBM", value: books.filter((b) => b.gvbmConfirm).length, icon: ListChecks, tone: "info" as const },
          { label: "Tuần đã xác nhận GVCN", value: Object.keys(weeklyGvcnConfirmations).length, icon: CheckCircle2, tone: "info" as const },
          { label: "Trạng thái BGH", value: bghConfirmed ? "Đã xác nhận" : yearEndReached ? "Chờ xác nhận" : "Chưa đến thời điểm", icon: ShieldCheck, tone: bghConfirmed ? "success" as const : "warning" as const },
          { label: "Sổ đã khóa", value: books.filter((b) => b.status === "da_khoa").length, icon: Lock, tone: "neutral" as const },
          { label: "Tổng số lớp", value: CLASSES.length, icon: Layers, tone: "neutral" as const },
        ];
      case "TPT":
        return [
          { label: "Tổng số lớp", value: CLASSES.length, icon: Layers, tone: "primary" as const },
          { label: "Tổng số tiết", value: books.length, icon: BookOpen, tone: "info" as const },
          { label: "Đã xác nhận GVBM", value: books.filter((b) => b.gvbmConfirm).length, icon: ListChecks, tone: "info" as const },
          { label: "Đã xác nhận GVCN", value: books.filter((b) => b.status === "xac_nhan_gvcn" || b.status === "xac_nhan_bgh" || b.status === "da_khoa").length, icon: CheckCircle2, tone: "success" as const },
          { label: "Đã khóa", value: count("da_khoa"), icon: Lock, tone: "neutral" as const },
        ];
      default:
        return [
          { label: "Tổng số tài khoản", value: 10, icon: Users, tone: "primary" as const },
          { label: "Tổng số vai trò", value: 5, icon: ShieldCheck, tone: "info" as const },
          { label: "Tổng số lớp", value: CLASSES.length, icon: Layers, tone: "neutral" as const },
          { label: "Tổng số môn học", value: SUBJECTS.length, icon: BookOpen, tone: "neutral" as const },
        ];
    }
  };

  return (
    <div>
      <PageHeader
        title={`Xin chào, ${user.fullName}`}
        description={`Tổng quan hệ thống theo vai trò ${ROLE_LABEL[role]}`}
        crumbs={[{ label: "Dashboard" }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards().map((c) => (
          <DashboardCard key={c.label} {...c} />
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-base font-semibold">Dữ liệu cần xử lý</h2>
          <TableCard>
            {role === "ADMIN" ? (
              <EmptyState
                title="Quản trị hệ thống không tham gia nghiệp vụ Sổ đầu bài"
                description="Vai trò Admin tập trung vào tài khoản, vai trò và phân quyền."
                action={
                  <Button asChild size="sm" className="mt-2">
                    <Link to="/nguoi-dung/tai-khoan">Tới quản lý tài khoản</Link>
                  </Button>
                }
              />
            ) : attention.length === 0 ? (
              <EmptyState title="Không có dữ liệu cần xử lý" description="Các bản ghi trong phạm vi của bạn đã được cập nhật hoặc xác nhận." />
            ) : (
              <ScrollTable>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ngày</TableHead>
                      <TableHead>Tiết</TableHead>
                      <TableHead>Lớp</TableHead>
                      <TableHead>Môn</TableHead>
                      <TableHead>Giáo viên</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attention.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell className="whitespace-nowrap">{b.date}</TableCell>
                        <TableCell>Tiết {b.period}</TableCell>
                        <TableCell className="font-medium">{b.className}</TableCell>
                        <TableCell>{b.subject}</TableCell>
                        <TableCell className="whitespace-nowrap">{b.teacher}</TableCell>
                        <TableCell><StatusBadge status={b.status} /></TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="outline" size="sm">
                            <Link to="/so-dau-bai/$id" params={{ id: b.id }}>Xem</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollTable>
            )}
          </TableCard>
        </div>

        <div>
          <h2 className="mb-3 text-base font-semibold">Thông báo gần đây</h2>
          <div className="space-y-2">
            {notifications.map((n) => (
              <div key={n.id} className="rounded-xl border border-border bg-card p-3 shadow-card">
                <p className="text-sm text-foreground">{n.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{n.time}</p>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground shadow-card">
                Không có thông báo mới
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
