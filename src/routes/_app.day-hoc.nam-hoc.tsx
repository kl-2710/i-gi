import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, CalendarRange, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { ScrollTable, TableCard } from "@/components/common/DataTable";
import { Pill } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/_app/day-hoc/nam-hoc")({
  head: () => ({ meta: [{ title: "Năm học / Học kỳ — Sổ đầu bài THCS Khương Mai" }] }),
  component: YearPage,
});

const ROWS = [
  { year: "2026 - 2027", term: "Học kỳ I", from: "05/09/2026", to: "15/01/2027", status: "Đang áp dụng" },
  { year: "2026 - 2027", term: "Học kỳ II", from: "18/01/2027", to: "31/05/2027", status: "Chưa bắt đầu" },
  { year: "2025 - 2026", term: "Học kỳ I", from: "05/09/2025", to: "15/01/2026", status: "Đã kết thúc" },
];
const WEEKS = [
  { week: 1, from: "07/09/2026", to: "12/09/2026", status: "Đã thiết lập" },
  { week: 2, from: "14/09/2026", to: "19/09/2026", status: "Đã thiết lập" },
  { week: 3, from: "21/09/2026", to: "26/09/2026", status: "Đang học" },
  { week: 4, from: "28/09/2026", to: "03/10/2026", status: "Chưa bắt đầu" },
];
const DAYS_OFF = [
  { date: "02/09/2026", name: "Quốc khánh", type: "Ngày nghỉ lễ" },
  { date: "03/09/2026", name: "Nghỉ bù", type: "Ngày nghỉ" },
];

function YearPage() {
  const { can } = useApp();
  const [rows, setRows] = useState(ROWS);
  if (!can("setup.view")) return <><PageHeader title="Năm học / Học kỳ" /><p>Không có quyền truy cập.</p></>;

  const manage = can("setup.manage");
  return (
    <div className="space-y-5">
      <PageHeader title="Năm học / Học kỳ" description="Thiết lập năm học, học kỳ, tuần học, ngày học/nghỉ và điều chỉnh lịch học làm cơ sở hình thành tiết học." crumbs={[{ label: "Quản lý danh mục và dữ liệu dạy học" }, { label: "Năm học / Học kỳ" }]} />
      <div className="rounded-xl border border-primary/25 bg-primary/5 p-4"><p className="flex items-center gap-2 text-sm font-medium"><CalendarRange className="size-4 text-primary" />Ngữ cảnh đang áp dụng: Năm học 2026 - 2027 · Học kỳ I</p></div>

      <TableCard>
        <div className="flex items-center justify-between border-b border-border p-4"><h2 className="font-semibold">Năm học / Học kỳ</h2>{manage && <Button onClick={() => toast.success("Đã mở biểu mẫu thêm năm học/học kỳ")}>Thêm</Button>}</div>
        <ScrollTable><Table><TableHeader><TableRow><TableHead>Năm học</TableHead><TableHead>Học kỳ</TableHead><TableHead>Bắt đầu</TableHead><TableHead>Kết thúc</TableHead><TableHead>Trạng thái</TableHead><TableHead /></TableRow></TableHeader>
          <TableBody>{rows.map((r, i) => <TableRow key={r.year+r.term}><TableCell className="font-medium">{r.year}</TableCell><TableCell>{r.term}</TableCell><TableCell>{r.from}</TableCell><TableCell>{r.to}</TableCell><TableCell><Pill tone={r.status === "Đang áp dụng" ? "success" : "neutral"}>{r.status}</Pill></TableCell><TableCell className="text-right">{manage && <div className="flex justify-end gap-1"><Button variant="ghost" size="icon" onClick={() => toast.info("Đã mở chỉnh sửa")}><Pencil className="size-4" /></Button><Button variant="ghost" size="icon" onClick={() => setRows((prev) => prev.filter((_, idx) => idx !== i))}><Trash2 className="size-4" /></Button></div>}</TableCell></TableRow>)}</TableBody>
        </Table></ScrollTable>
      </TableCard>

      <div className="grid gap-5 lg:grid-cols-2">
        <TableCard>
          <div className="border-b border-border p-4"><h2 className="flex items-center gap-2 font-semibold"><CalendarDays className="size-4 text-primary" />Thiết lập thời gian tuần học</h2></div>
          <ScrollTable><Table><TableHeader><TableRow><TableHead>Tuần</TableHead><TableHead>Từ ngày</TableHead><TableHead>Đến ngày</TableHead><TableHead>Trạng thái</TableHead></TableRow></TableHeader><TableBody>{WEEKS.map((w) => <TableRow key={w.week}><TableCell>Tuần {w.week}</TableCell><TableCell>{w.from}</TableCell><TableCell>{w.to}</TableCell><TableCell><Pill tone={w.status === "Đang học" ? "success" : "neutral"}>{w.status}</Pill></TableCell></TableRow>)}</TableBody></Table></ScrollTable>
        </TableCard>
        <TableCard>
          <div className="border-b border-border p-4"><h2 className="font-semibold">Quản lý ngày học, ngày nghỉ</h2></div>
          <ScrollTable><Table><TableHeader><TableRow><TableHead>Ngày</TableHead><TableHead>Nội dung</TableHead><TableHead>Loại</TableHead></TableRow></TableHeader><TableBody>{DAYS_OFF.map((d) => <TableRow key={d.date}><TableCell>{d.date}</TableCell><TableCell>{d.name}</TableCell><TableCell>{d.type}</TableCell></TableRow>)}</TableBody></Table></ScrollTable>
        </TableCard>
      </div>

      <TableCard>
        <div className="border-b border-border p-4"><h2 className="font-semibold">Điều chỉnh lịch học</h2><p className="mt-1 text-xs text-muted-foreground">Điều chỉnh lịch học được áp dụng trước khi hệ thống hình thành tiết học từ TKB.</p></div>
        <div className="p-4"><Button variant="outline" disabled={!manage} onClick={() => toast.success("Đã mở chức năng điều chỉnh lịch học")}>Điều chỉnh lịch học</Button></div>
      </TableCard>
    </div>
  );
}
