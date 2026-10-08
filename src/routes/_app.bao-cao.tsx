import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Target } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/common/PageHeader";
import { DashboardCard } from "@/components/common/DashboardCard";

import { NoPermissionState } from "@/components/common/States";
import { useApp } from "@/lib/app-state";
import { CLASSES } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/bao-cao")({
  head: () => ({
    meta: [
      { title: "Báo cáo và thống kê — THCS Khương Mai" },
      { name: "description", content: "Thống kê tiến độ giảng dạy, kết quả xếp loại, tình trạng hoàn thiện và Sổ đầu bài tổng hợp." },
    ],
  }),
  component: ReportPage,
});

function ReportPage() {
  const { can, scopedBooks, user } = useApp();
  const teacherOnly = Boolean(user && user.roles.length > 0 && user.roles.every((r) => r === "GVBM" || r === "GVCN"));
  const books = scopedBooks;

  const total = books.length;
  const updated = books.filter((b) => b.status !== "he_thong_tao" && b.status !== "chua_hoan_thien").length;
  const gvbm = books.filter((b) => !!b.gvbmConfirm).length;
  const gvcn = books.filter((b) => b.status === "xac_nhan_gvcn" || b.status === "xac_nhan_bgh" || b.status === "da_khoa").length;
  const bgh = books.filter((b) => b.status === "xac_nhan_bgh" || b.status === "da_khoa").length;
  const locked = books.filter((b) => b.status === "da_khoa").length;

  const byClass = useMemo(
    () =>
      CLASSES.map((cl) => {
        const rows = books.filter((b) => b.className === cl.name);
        return {
          className: cl.name,
          total: rows.length,
          updated: rows.filter((b) => !["he_thong_tao", "chua_hoan_thien"].includes(b.status)).length,
          gvbm: rows.filter((b) => !!b.gvbmConfirm).length,
          gvcn: rows.filter((b) => ["xac_nhan_gvcn", "xac_nhan_bgh", "da_khoa"].includes(b.status)).length,
          bgh: rows.filter((b) => ["xac_nhan_bgh", "da_khoa"].includes(b.status)).length,
          locked: rows.filter((b) => b.status === "da_khoa").length,
        };
      })
    [books],
  );

  const ranking = useMemo(() => {
    const groups = [
      { name: "A - Tốt", key: "A" as const },
      { name: "B - Khá", key: "B" as const },
      { name: "C - Trung bình", key: "C" as const },
      { name: "D - Yếu", key: "D" as const },
    ];
    return groups.map((g) => ({ name: g.name, value: books.filter((b) => b.rank === g.key).length }));
  }, [books]);


  if (teacherOnly || !can("report.view")) {
    return (
      <div>
        <PageHeader title="Báo cáo và thống kê" crumbs={[{ label: "Báo cáo và thống kê" }]} />
        <NoPermissionState />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Báo cáo và thống kê"
        description="Khai thác dữ liệu Sổ đầu bài theo tiến độ giảng dạy, kết quả xếp loại, tình trạng hoàn thiện và báo cáo tổng hợp."
        crumbs={[{ label: "Báo cáo và thống kê" }]}

      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard label="Tổng số tiết" value={total} icon={BarChart3} tone="primary" />
        <DashboardCard label="Đã cập nhật" value={updated} icon={Target} tone="info" />
        <DashboardCard label="Đã xác nhận GVBM" value={gvbm} icon={Target} tone="info" />
        <DashboardCard label="Đã xác nhận GVCN" value={gvcn} icon={Target} tone="info" />
        <DashboardCard label="Đã xác nhận BGH" value={bgh} icon={Target} tone="success" />
        <DashboardCard label="Đã khóa" value={locked} icon={Target} tone="neutral" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <h2 className="mb-3 text-sm font-semibold">1. Tiến độ giảng dạy theo lớp</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byClass}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="className" fontSize={11} />
                <YAxis fontSize={11} allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" name="Tổng số tiết" fill="var(--chart-4)" />
                <Bar dataKey="updated" name="Đã cập nhật" fill="var(--chart-1)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <h2 className="mb-3 text-sm font-semibold">2. Kết quả xếp loại tiết học</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ranking}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis fontSize={11} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" name="Số tiết" fill="var(--chart-3)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <h2 className="mb-3 text-sm font-semibold">3. Tình trạng hoàn thiện theo lớp</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byClass}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="className" fontSize={11} />
                <YAxis fontSize={11} allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="gvbm" name="Xác nhận GVBM" fill="var(--chart-1)" />
                <Bar dataKey="gvcn" name="Xác nhận GVCN" fill="var(--chart-2)" />
                <Bar dataKey="locked" name="Đã khóa" fill="var(--chart-5)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>


      </div>


    </div>
  );
}
