import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, CheckCircle2, Download, FileText, ListChecks, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/common/PageHeader";
import { DashboardCard } from "@/components/common/DashboardCard";
import { FilterField, ScrollTable, SearchBar, TableCard, TableToolbar } from "@/components/common/DataTable";
import { EmptyState, NoPermissionState } from "@/components/common/States";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/lib/app-state";
import { CLASSES, SUBJECTS } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/bao-cao")({
  head: () => ({
    meta: [
      { title: "Báo cáo và thống kê — Sổ đầu bài THCS Khương Mai" },
      { name: "description", content: "Thống kê tiến độ giảng dạy, kết quả xếp loại, tình trạng hoàn thiện và báo cáo Sổ đầu bài tổng hợp." },
    ],
  }),
  component: ReportPage,
});

type View = "tien-do" | "xep-loai" | "hoan-thien" | "tong-hop";

function ReportPage() {
  const { can, scopedBooks } = useApp();
  const [view, setView] = useState<View>("tong-hop");
  const [q, setQ] = useState("");
  const [subject, setSubject] = useState("all");

  const books = useMemo(
    () => scopedBooks.filter((b) => subject === "all" || b.subject === subject),
    [scopedBooks, subject],
  );

  if (!can("report.view")) {
    return (
      <div>
        <PageHeader title="Báo cáo và thống kê" crumbs={[{ label: "Báo cáo và thống kê" }]} />
        <NoPermissionState />
      </div>
    );
  }

  const completed = books.filter((b) => b.status === "xac_nhan_gvbm" || b.status === "xac_nhan_gvcn" || b.status === "xac_nhan_bgh" || b.status === "da_khoa").length;
  const gvbm = books.filter((b) => !!b.gvbmConfirm).length;
  const gvcn = books.filter((b) => !!b.gvcnConfirm).length;
  const bgh = books.filter((b) => !!b.bghConfirm).length;

  const byClass = CLASSES.map((cl) => {
    const rows = books.filter((b) => b.className === cl.name);
    return {
      className: cl.name,
      total: rows.length,
      gvbm: rows.filter((b) => !!b.gvbmConfirm).length,
      gvcn: rows.filter((b) => !!b.gvcnConfirm).length,
      bgh: rows.filter((b) => !!b.bghConfirm).length,
      incomplete: rows.filter((b) => ["he_thong_tao", "chua_hoan_thien"].includes(b.status)).length,
    };
  }).filter((r) => r.className.toLowerCase().includes(q.toLowerCase()));

  const rankData = ["A", "B", "C", "D"].map((rank) => ({
    rank,
    count: books.filter((b) => b.rank === rank).length,
  }));

  const subjectData = SUBJECTS.map((s) => {
    const rows = books.filter((b) => b.subject === s.name);
    return { subject: s.name, total: rows.length, completed: rows.filter((b) => !!b.gvbmConfirm).length };
  }).filter((r) => r.total > 0);

  const viewTitle: Record<View, string> = {
    "tien-do": "Thống kê tiến độ giảng dạy",
    "xep-loai": "Thống kê kết quả xếp loại tiết học",
    "hoan-thien": "Thống kê tình trạng hoàn thiện Sổ đầu bài",
    "tong-hop": "Báo cáo Sổ đầu bài tổng hợp",
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title={viewTitle[view]}
        description="Dữ liệu được tổng hợp từ Sổ đầu bài theo phạm vi mà tài khoản hiện tại được phép xem."
        crumbs={[{ label: "Báo cáo và thống kê" }, { label: viewTitle[view] }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast.success("Đã xuất báo cáo Excel (dữ liệu mẫu)")}><Download className="size-4" />Xuất Excel</Button>
            <Button variant="outline" onClick={() => toast.success("Đã xuất báo cáo PDF (dữ liệu mẫu)")}><FileText className="size-4" />Xuất PDF</Button>
          </div>
        }
      />

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {(Object.entries(viewTitle) as [View, string][]).map(([key, label]) => (
          <Button key={key} variant={view === key ? "default" : "outline"} className="justify-start" onClick={() => setView(key)}>
            {key === "tien-do" && <TrendingUp className="size-4" />}
            {key === "xep-loai" && <BarChart3 className="size-4" />}
            {key === "hoan-thien" && <ListChecks className="size-4" />}
            {key === "tong-hop" && <CheckCircle2 className="size-4" />}
            {label}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard label="Tổng số tiết" value={books.length} icon={BarChart3} tone="primary" />
        <DashboardCard label="Đã xác nhận GVBM" value={gvbm} icon={CheckCircle2} tone="info" />
        <DashboardCard label="Đã xác nhận GVCN" value={gvcn} icon={CheckCircle2} tone="info" />
        <DashboardCard label="Đã xác nhận BGH" value={bgh} icon={CheckCircle2} tone="success" />
      </div>

      {(view === "tien-do" || view === "tong-hop") && (
        <section className="space-y-4">
          <TableCard>
            <TableToolbar>
              <SearchBar value={q} onChange={setQ} placeholder="Tìm lớp..." />
              <FilterField label="Môn">
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả môn</SelectItem>
                    {SUBJECTS.map((s) => <SelectItem key={s.code} value={s.name}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FilterField>
            </TableToolbar>
            {byClass.length === 0 ? <EmptyState /> : (
              <ScrollTable>
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>Lớp</TableHead><TableHead>Tổng tiết</TableHead><TableHead>GVBM</TableHead><TableHead>GVCN</TableHead><TableHead>BGH</TableHead><TableHead>Chưa hoàn thiện</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>{byClass.map((r) => <TableRow key={r.className}>
                    <TableCell className="font-medium">{r.className}</TableCell><TableCell>{r.total}</TableCell><TableCell>{r.gvbm}</TableCell><TableCell>{r.gvcn}</TableCell><TableCell>{r.bgh}</TableCell><TableCell className="text-warning">{r.incomplete}</TableCell>
                  </TableRow>)}</TableBody>
                </Table>
              </ScrollTable>
            )}
          </TableCard>
        </section>
      )}

      {view === "xep-loai" && (
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="mb-4 text-base font-semibold">Kết quả xếp loại tiết học</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rankData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="rank" /><YAxis allowDecimals={false} /><Tooltip /><Legend />
                <Bar dataKey="count" name="Số tiết" fill="var(--chart-1)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {view === "hoan-thien" && (
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="mb-4 text-base font-semibold">Tình trạng hoàn thiện Sổ đầu bài theo môn</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="subject" angle={-20} textAnchor="end" height={70} fontSize={10} />
                <YAxis allowDecimals={false} /><Tooltip /><Legend />
                <Bar dataKey="completed" name="Đã cập nhật/xác nhận" fill="var(--chart-2)" radius={[4,4,0,0]} />
                <Bar dataKey="total" name="Tổng số tiết" fill="var(--chart-4)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {view === "tong-hop" && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
          <p className="text-sm font-medium">Tỷ lệ hoàn thiện hiện tại</p>
          <p className="mt-1 text-3xl font-semibold">{books.length ? Math.round((completed / books.length) * 100) : 0}%</p>
          <p className="mt-1 text-sm text-muted-foreground">Tính theo các tiết đã được xác nhận ít nhất bởi GVBM và các bước xác nhận tiếp theo.</p>
        </div>
      )}
    </div>
  );
}
