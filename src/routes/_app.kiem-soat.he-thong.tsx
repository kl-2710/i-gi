import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, Database, ShieldCheck, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { DashboardCard } from "@/components/common/DashboardCard";
import { NoPermissionState } from "@/components/common/States";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/_app/kiem-soat/he-thong")({
  head: () => ({
    meta: [
      { title: "Thông tin hệ thống — THCS Khương Mai" },
      { name: "description", content: "Chính sách lưu trữ dữ liệu và lịch tự động xóa dữ liệu hết hạn của hệ thống." },
      { property: "og:title", content: "Thông tin hệ thống" },
      { property: "og:description", content: "Chính sách lưu trữ và dọn dẹp dữ liệu tự động." },
    ],
  }),
  component: SystemPage,
});

function SystemPage() {
  const { can } = useApp();
  if (!can("audit.view") && !can("system.info")) {
    return (
      <div>
        <PageHeader title="Thông tin hệ thống" crumbs={[{ label: "Kiểm soát & lưu trữ" }, { label: "Thông tin hệ thống" }]} />
        <NoPermissionState />
      </div>
    );
  }
  return (
    <div>
      <PageHeader
        title="Thông tin hệ thống"
        description="Dữ liệu hết hạn được hệ thống tự động xóa theo chính sách lưu trữ, không có thao tác xóa thủ công."
        crumbs={[{ label: "Kiểm soát & lưu trữ" }, { label: "Thông tin hệ thống" }]}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard label="Chính sách lưu trữ" value="36 tháng" icon={Database} tone="primary" hint="Dữ liệu sổ đầu bài sau khi lưu trữ" />
        <DashboardCard label="Lần dọn dẹp gần nhất" value="01/09/2026" icon={CalendarClock} tone="info" hint="Tự động lúc 02:00" />
        <DashboardCard label="Bản ghi đã xử lý" value={1420} icon={Trash2} tone="neutral" hint="Trong lần dọn dẹp gần nhất" />
        <DashboardCard label="Lần dọn dẹp kế tiếp" value="01/10/2026" icon={ShieldCheck} tone="success" hint="Theo lịch tự động hàng tháng" />
      </div>
      <div className="mt-4 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground shadow-card">
        Việc xóa dữ liệu hết hạn được hệ thống thực hiện tự động theo chính sách lưu trữ đã cấu hình. Người dùng không thực hiện thao tác xóa dữ liệu hết hạn thủ công.
      </div>
    </div>
  );
}
