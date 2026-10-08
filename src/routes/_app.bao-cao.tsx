import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Target } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/common/PageHeader";
import { DashboardCard } from "@/components/common/DashboardCard";
import { FilterField, ScrollTable, SearchBar, TableCard, TableToolbar } from "@/components/common/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { EmptyState, NoPermissionState } from "@/components/common/States";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/lib/app-state";
import { CLASSES, SUBJECTS } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/bao-cao")({
  head: () => ({
    meta: [
      { title: "Báo cáo và thống kê — THCS Khương Mai" },
      { name: "description", content: "Thống kê tiến độ giảng dạy, kết quả xếp loại, tình trạng hoàn thiện và Sổ đầu bài tổng hợp." },
    ],
  }),
  component: ReportPage,
});

const PAGE_SIZE = 8;

function ReportPage() {
  const { can, scopedBooks, user } = useApp();
  const teacherOnly = Boolean(user && user.roles.length > 0 && user.roles.every((r) => r === "GVBM" || r === "GVCN"));
  const [q, setQ] = useState("");
  const [subject, setSubject] = useState("all");
  const [page, setPage] = useState(1);

  const books = useMemo(
    () => scopedBooks.filter((b) => subject === "all" || b.subject === subject),
    [scopedBooks, subject],
  );

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
      }).filter((r) => r.className.toLowerCase().includes(q.toLowerCase())),
    [books, q],
  );

  const bySubject = useMemo(
    () =>
      SUBJECTS.map((s) => {
        const rows = books.filter((b) => b.subject === s.name);
        return {
          name: s.name,
          total: rows.length,
          avgScore: rows.length ? Number((rows.reduce((sum, b) => sum + (b.score ?? 0), 0) / rows.length).toFixed(1)) : 0,
          ranked: rows.filter((b) => !!b.rank).length,
        };
      }).filter((r) => r.total > 0),
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

  const pageRows = byClass.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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

        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <h2 className="mb-3 text-sm font-semibold">4. Báo cáo Sổ đầu bài tổng hợp theo môn</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bySubject}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" fontSize={10} interval={0} angle={-15} textAnchor="end" height={60} />
                <YAxis fontSize={11} allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" name="Tổng số tiết" fill="var(--chart-4)" />
                <Bar dataKey="ranked" name="Đã xếp loại" fill="var(--chart-3)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <TableCard>
        <TableToolbar>
          <SearchBar value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Tìm lớp..." />
          <FilterField label="Môn">
            <Select value={subject} onValueChange={(v) => { setSubject(v); setPage(1); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả môn</SelectItem>
                {SUBJECTS.map((s) => <SelectItem key={s.code} value={s.name}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </FilterField>
        </TableToolbar>

        {pageRows.length === 0 ? (
          <EmptyState />
        ) : (
          <ScrollTable>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lớp</TableHead>
                  <TableHead>Tổng số tiết</TableHead>
                  <TableHead>Đã cập nhật</TableHead>
                  <TableHead>GVBM</TableHead>
                  <TableHead>GVCN</TableHead>
                  <TableHead>BGH</TableHead>
                  <TableHead>Đã khóa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageRows.map((r) => (
                  <TableRow key={r.className}>
                    <TableCell className="font-medium">{r.className}</TableCell>
                    <TableCell className="tabular-nums">{r.total}</TableCell>
                    <TableCell className="tabular-nums">{r.updated}</TableCell>
                    <TableCell className="tabular-nums">{r.gvbm}</TableCell>
                    <TableCell className="tabular-nums">{r.gvcn}</TableCell>
                    <TableCell className="tabular-nums">{r.bgh}</TableCell>
                    <TableCell className="tabular-nums">{r.locked}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollTable>
        )}

        <Pagination page={page} pageSize={PAGE_SIZE} total={byClass.length} onChange={setPage} />
      </TableCard>
    </div>
  );
}
