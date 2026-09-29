import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Archive,
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
      { title: "Dashboard — Hệ thống quản lý sổ đầu bài" },
      { name: "description", content: "Tổng quan tình trạng sổ đầu bài theo vai trò người dùng." },
      { property: "og:title", content: "Dashboard — Hệ thống quản lý sổ đầu bài" },
      { property: "og:description", content: "Tổng quan tình trạng sổ đầu bài Trường THCS Khương Mai." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user, role, scopedBooks, books, notifications } = useApp();
  if (!user || !role) return null;

  const count = (...s: BookStatus[]) => scopedBooks.filter((b) => s.includes(b.status)).length;
  const attention = scopedBooks
    .filter((b) =>
      ["chua_hoan_thien", "yeu_cau_chinh_sua", "cho_kiem_tra", "cho_duyet", "he_thong_tao"].includes(
        b.status,
      ),
    )
    .slice(0, 8);

  const cards = () => {
    switch (role) {
      case "GVBM":
        return [
          { label: "Tiết chưa hoàn thiện", value: count("chua_hoan_thien", "he_thong_tao"), icon: TriangleAlert, tone: "warning" as const },
          { label: "Tiết đã cập nhật", value: count("da_cap_nhat"), icon: BookOpen, tone: "info" as const },
          { label: "Tiết chờ xác nhận", value: count("da_cap_nhat"), icon: ListChecks, tone: "primary" as const },
          { label: "Sổ đã xác nhận", value: count("xac_nhan_gvbm", "xac_nhan_gvcn", "da_kiem_tra", "da_duyet", "da_khoa"), icon: CheckCircle2, tone: "success" as const },
          { label: "Yêu cầu chỉnh sửa", value: count("yeu_cau_chinh_sua"), icon: TriangleAlert, tone: "danger" as const },
        ];
      case "GVCN":
        return [
          { label: "Lớp chủ nhiệm", value: user.homeroomClass ?? "-", icon: GraduationCap, tone: "primary" as const },
          { label: "Sổ đầu bài của lớp", value: scopedBooks.length, icon: BookOpen, tone: "info" as const },
          { label: "Sổ chờ xác nhận GVCN", value: count("xac_nhan_gvbm"), icon: ListChecks, tone: "warning" as const },
          { label: "Sổ đã xác nhận GVCN", value: count("xac_nhan_gvcn", "cho_kiem_tra", "da_kiem_tra", "da_duyet", "da_khoa"), icon: CheckCircle2, tone: "success" as const },
        ];
      case "TPT":
        return [
          { label: "Tổng số lớp", value: CLASSES.length, icon: Layers, tone: "primary" as const },
          { label: "Sổ cần kiểm tra", value: count("cho_kiem_tra", "xac_nhan_gvcn"), icon: ListChecks, tone: "warning" as const },
          { label: "Sổ cần duyệt", value: count("cho_duyet", "da_kiem_tra"), icon: CheckCircle2, tone: "info" as const },
          { label: "Sổ đã khóa", value: count("da_khoa"), icon: Lock, tone: "neutral" as const },
          { label: "Sổ đã lưu trữ", value: count("da_luu_tru"), icon: Archive, tone: "neutral" as const },
        ];
      case "BGH":
        return [
          { label: "Sổ cần kiểm tra", value: count("cho_kiem_tra", "xac_nhan_gvcn"), icon: ListChecks, tone: "warning" as const },
          { label: "Sổ cần duyệt", value: count("cho_duyet", "da_kiem_tra"), icon: CheckCircle2, tone: "info" as const },
          { label: "Tổng số sổ toàn trường", value: books.length, icon: BookOpen, tone: "primary" as const },
          { label: "Sổ đã duyệt", value: count("da_duyet", "da_khoa", "da_luu_tru"), icon: ShieldCheck, tone: "success" as const },
        ];
      case "PHT":
        return [
          { label: "Trạng thái PPCT", value: "Đã nhập", icon: ClipboardList, tone: "success" as const, hint: "PPCT_HK1_2026_2027.xlsx" },
          { label: "Trạng thái TKB", value: "Đã nhập", icon: FileSpreadsheet, tone: "success" as const, hint: "TKB_HK1_2026_2027.xlsx" },
          { label: "Tệp đã tải lên", value: 2, icon: FileSpreadsheet, tone: "info" as const },
          { label: "Kiểm tra dữ liệu", value: "13 dòng cảnh báo", icon: TriangleAlert, tone: "warning" as const },
          { label: "Bản ghi sổ đã sinh", value: books.length, icon: BookOpen, tone: "primary" as const },
          { label: "Sổ chờ kiểm tra / duyệt", value: count("cho_kiem_tra", "cho_duyet", "da_kiem_tra"), icon: ListChecks, tone: "warning" as const },
        ];
      default:
        return [
          { label: "Tổng số tài khoản", value: 10, icon: Users, tone: "primary" as const },
          { label: "Tổng số vai trò", value: 6, icon: ShieldCheck, tone: "info" as const },
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards().map((c) => (
          <DashboardCard key={c.label} {...c} />
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-base font-semibold">Bản ghi cần xử lý</h2>
          <TableCard>
            {role === "ADMIN" ? (
              <EmptyState
                title="Quản trị hệ thống không tham gia nghiệp vụ sổ đầu bài"
                description="Vai trò Admin tập trung vào quản lý tài khoản, vai trò và phân quyền."
                action={
                  <Button asChild size="sm" className="mt-2">
                    <Link to="/nguoi-dung/tai-khoan">Tới quản lý tài khoản</Link>
                  </Button>
                }
              />
            ) : attention.length === 0 ? (
              <EmptyState title="Không có bản ghi cần xử lý" description="Tất cả sổ đầu bài trong phạm vi của bạn đã được xử lý." />
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
                        <TableCell>
                          <StatusBadge status={b.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="outline" size="sm">
                            <Link to="/so-dau-bai/$id" params={{ id: b.id }}>
                              Xem
                            </Link>
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
