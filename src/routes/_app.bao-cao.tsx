import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Download, FileText } from "lucide-react";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/common/PageHeader";
import { DashboardCard } from "@/components/common/DashboardCard";
import { FilterField, ScrollTable, SearchBar, TableCard, TableToolbar } from "@/components/common/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { EmptyState, NoPermissionState } from "@/components/common/States";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/lib/app-state";
import { CLASSES, SUBJECTS } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/bao-cao")({
  head: () => ({
    meta: [
      { title: "Báo cáo Sổ đầu bài tổng hợp — THCS Khương Mai" },
      { name: "description", content: "Báo cáo tổng hợp tình trạng sổ đầu bài theo lớp, môn và tiến độ xử lý." },
      { property: "og:title", content: "Báo cáo Sổ đầu bài tổng hợp" },
      { property: "og:description", content: "Thống kê tình trạng sổ đầu bài toàn trường." },
    ],
  }),
  component: ReportPage,
});

const PAGE_SIZE = 8;

function ReportPage() {
  const { can, scopedBooks } = useApp();
  const [q, setQ] = useState("");
  const [subject, setSubject] = useState("all");
  const [page, setPage] = useState(1);

  const books = useMemo(
    () => scopedBooks.filter((b) => subject === "all" || b.subject === subject),
    [scopedBooks, subject],
  );

  const c = (fn: (b: (typeof books)[number]) => boolean) => books.filter(fn).length;

  const byClass = useMemo(
    () =>
      CLASSES.map((cl) => {
        const rows = books.filter((b) => b.className === cl.name);
        return {
          className: cl.name,
          total: rows.length,
          updated: rows.filter((b) => b.actualContent).length,
          gvbm: rows.filter((b) => b.gvbmConfirm).length,
          gvcn: rows.filter((b) => b.gvcnConfirm).length,
          checked: rows.filter((b) => b.checkedBy).length,
          approved: rows.filter((b) => b.approvedBy).length,
          locked: rows.filter((b) => b.lockedBy).length,
          todo: rows.filter((b) => ["chua_hoan_thien", "he_thong_tao", "yeu_cau_chinh_sua"].includes(b.status)).length,
        };
      }).filter((r) => r.className.toLowerCase().includes(q.toLowerCase())),
    [books, q],
  );

  const bySubject = useMemo(
    () =>
      SUBJECTS.slice(0, 8).map((s) => {
        const rows = books.filter((b) => b.subject === s.name);
        return {
          name: s.name,
          hoanThanh: rows.filter((b) => b.gvbmConfirm).length,
          tong: rows.length,
        };
      }),
    [books],
  );

  const timeline = useMemo(() => {
    const map = new Map<string, { date: string; capNhat: number; duyet: number }>();
    books.forEach((b) => {
      const e = map.get(b.date) ?? { date: b.date.slice(0, 5), capNhat: 0, duyet: 0 };
      if (b.actualContent) e.capNhat += 1;
      if (b.approvedBy) e.duyet += 1;
      map.set(b.date, e);
    });
    return Array.from(map.values());
  }, [books]);

  if (!can("report.view")) {
    return (
      <div>
        <PageHeader title="Báo cáo Sổ đầu bài tổng hợp" crumbs={[{ label: "Báo cáo & thống kê" }]} />
        <NoPermissionState />
      </div>
    );
  }

  const pageRows = byClass.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Báo cáo Sổ đầu bài tổng hợp"
        description="Thống kê tình trạng sổ đầu bài theo phạm vi dữ liệu của vai trò hiện tại."
        crumbs={[{ label: "Báo cáo & thống kê" }, { label: "Báo cáo Sổ đầu bài tổng hợp" }]}
        actions={
          <>
            <Button variant="outline" onClick={() => toast.success("Đã xuất báo cáo Excel (dữ liệu mẫu)")}>
              <Download className="size-4" />Xuất Excel
            </Button>
            <Button variant="outline" onClick={() => toast.success("Đã xuất báo cáo PDF (dữ liệu mẫu)")}>
              <FileText className="size-4" />Xuất PDF
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard label="Tổng số tiết" value={books.length} icon={BarChart3} tone="primary" />
        <DashboardCard label="Đã cập nhật" value={c((b) => !!b.actualContent)} icon={BarChart3} tone="info" />
        <DashboardCard label="Đã xác nhận GVBM" value={c((b) => !!b.gvbmConfirm)} icon={BarChart3} tone="info" />
        <DashboardCard label="Đã xác nhận GVCN" value={c((b) => !!b.gvcnConfirm)} icon={BarChart3} tone="info" />
        <DashboardCard label="Đã kiểm tra" value={c((b) => !!b.checkedBy)} icon={BarChart3} tone="success" />
        <DashboardCard label="Đã duyệt" value={c((b) => !!b.approvedBy)} icon={BarChart3} tone="success" />
        <DashboardCard label="Đã khóa" value={c((b) => !!b.lockedBy)} icon={BarChart3} tone="neutral" />
        <DashboardCard
          label="Cần xử lý"
          value={c((b) => ["chua_hoan_thien", "he_thong_tao", "yeu_cau_chinh_sua"].includes(b.status))}
          icon={BarChart3}
          tone="warning"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <h2 className="mb-3 text-sm font-semibold">Tình trạng sổ đầu bài theo thời gian</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="capNhat" name="Đã cập nhật" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="duyet" name="Đã duyệt" stroke="var(--chart-3)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <h2 className="mb-3 text-sm font-semibold">Tỷ lệ hoàn thành theo lớp</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byClass}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="className" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Legend />
                <Bar dataKey="gvbm" name="Xác nhận GVBM" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="gvcn" name="Xác nhận GVCN" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <h2 className="mb-3 text-sm font-semibold">Tỷ lệ hoàn thành theo môn</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bySubject}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" fontSize={10} interval={0} angle={-15} textAnchor="end" height={60} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Legend />
                <Bar dataKey="hoanThanh" name="Đã hoàn thành" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="tong" name="Tổng số tiết" fill="var(--chart-4)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <h2 className="mb-3 text-sm font-semibold">Tình trạng kiểm tra và duyệt</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byClass}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="className" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Legend />
                <Bar dataKey="checked" name="Đã kiểm tra" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="approved" name="Đã duyệt" fill="var(--chart-5)" radius={[4, 4, 0, 0]} />
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
                  <TableHead>Xác nhận GVBM</TableHead>
                  <TableHead>Xác nhận GVCN</TableHead>
                  <TableHead>Đã kiểm tra</TableHead>
                  <TableHead>Đã duyệt</TableHead>
                  <TableHead>Đã khóa</TableHead>
                  <TableHead>Cần xử lý</TableHead>
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
                    <TableCell className="tabular-nums">{r.checked}</TableCell>
                    <TableCell className="tabular-nums">{r.approved}</TableCell>
                    <TableCell className="tabular-nums">{r.locked}</TableCell>
                    <TableCell className="tabular-nums text-destructive">{r.todo}</TableCell>
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
