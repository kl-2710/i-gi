import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarOff, CalendarRange, Clock3, Pencil, Plus, Power, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { ScrollTable, TableCard } from "@/components/common/DataTable";
import { Pill } from "@/components/common/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NoPermissionState } from "@/components/common/States";
import { ActionDialog } from "@/components/common/ActionDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useApp } from "@/lib/app-state";

type SchoolTerm = {
  id: string;
  year: string;
  term: string;
  from: string;
  to: string;
  status: "Đang áp dụng" | "Chưa bắt đầu" | "Đã kết thúc";
  weekSetup: string;
  schoolDays: number;
  holidays: number;
};

export const Route = createFileRoute("/_app/day-hoc/nam-hoc")({
  head: () => ({ meta: [
    { title: "Năm học / Học kỳ — Sổ đầu bài THCS Khương Mai" },
  ] }),
  component: YearPage,
});

const INITIAL_ROWS: SchoolTerm[] = [
  { id: "HK-2026-1", year: "2026 - 2027", term: "Học kỳ I", from: "05/09/2026", to: "15/01/2027", status: "Đang áp dụng", weekSetup: "18 tuần", schoolDays: 90, holidays: 4 },
  { id: "HK-2026-2", year: "2026 - 2027", term: "Học kỳ II", from: "18/01/2027", to: "31/05/2027", status: "Chưa bắt đầu", weekSetup: "Chưa thiết lập", schoolDays: 0, holidays: 0 },
  { id: "HK-2025-1", year: "2025 - 2026", term: "Học kỳ I", from: "05/09/2025", to: "15/01/2026", status: "Đã kết thúc", weekSetup: "18 tuần", schoolDays: 90, holidays: 5 },
  { id: "HK-2025-2", year: "2025 - 2026", term: "Học kỳ II", from: "19/01/2026", to: "31/05/2026", status: "Đã kết thúc", weekSetup: "18 tuần", schoolDays: 90, holidays: 4 },
];

function YearPage() {
  const { can, role } = useApp();
  const canManage = can("setup.manage") && role === "ADMIN";
  const [rows, setRows] = useState<SchoolTerm[]>(INITIAL_ROWS);
  const [year, setYear] = useState("2026 - 2027");
  const [term, setTerm] = useState("Học kỳ I");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<SchoolTerm | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SchoolTerm | null>(null);
  const [weekTarget, setWeekTarget] = useState<SchoolTerm | null>(null);
  const [holidayTarget, setHolidayTarget] = useState<SchoolTerm | null>(null);
  const [weekCount, setWeekCount] = useState("18");
  const [days, setDays] = useState("90");
  const [holidayReason, setHolidayReason] = useState("");

  const currentCalendarYear = new Date().getFullYear();
  const schoolYearOptions = useMemo(
    () =>
      Array.from({ length: 9 }, (_, index) => {
        const startYear = currentCalendarYear - 5 + index;
        return `${startYear} - ${startYear + 1}`;
      }),
    [currentCalendarYear],
  );
  const years = useMemo(
    () => Array.from(new Set([...schoolYearOptions, ...rows.map((r) => r.year)])),
    [schoolYearOptions, rows],
  );
  const visibleRows = rows.filter((r) => r.year === year);
  const selected = rows.find((r) => r.year === year && r.term === term);

  if (!can("setup.view")) {
    return <div><PageHeader title="Năm học / Học kỳ" crumbs={[{ label: "Quản lý danh mục và dữ liệu dạy học" }, { label: "Năm học / Học kỳ" }]} /><NoPermissionState /></div>;
  }

  const openCreate = () => {
    const nextTerm = term;
    setEditing({ id: "NEW", year, term: nextTerm, from: "", to: "", status: "Chưa bắt đầu", weekSetup: "Chưa thiết lập", schoolDays: 0, holidays: 0 });
    setFormOpen(true);
  };

  const save = () => {
    if (!editing || !editing.year.trim() || !editing.from || !editing.to) { toast.error("Vui lòng nhập đầy đủ thông tin."); return; }
    if (editing.from >= editing.to) { toast.error("Ngày kết thúc phải sau ngày bắt đầu."); return; }
    const duplicate = rows.some((r) => r.id !== editing.id && r.year === editing.year && r.term === editing.term);
    if (duplicate) { toast.error("Tổ hợp năm học - học kỳ đã tồn tại."); return; }
    setRows((prev) => editing.id === "NEW" ? [...prev, { ...editing, id: "HK-" + Date.now() }] : prev.map((r) => r.id === editing.id ? editing : r));
    setYear(editing.year);
    setTerm(editing.term);
    setFormOpen(false);
    toast.success(editing.id === "NEW" ? "Đã tạo năm học / học kỳ." : "Đã cập nhật năm học / học kỳ.");
  };

  const cycleStatus = (status: SchoolTerm["status"]): SchoolTerm["status"] => status === "Đã kết thúc" ? "Chưa bắt đầu" : status === "Chưa bắt đầu" ? "Đang áp dụng" : "Đã kết thúc";

  return (
    <div className="space-y-5">
      <PageHeader
        title="Năm học / Học kỳ"
        description="Quản lý năm học, học kỳ và các thiết lập lịch học làm cơ sở cho PPCT, TKB và Sổ đầu bài."
        crumbs={[{ label: "Quản lý danh mục và dữ liệu dạy học" }, { label: "Năm học / Học kỳ" }]}
        actions={canManage ? <Button onClick={openCreate}><Plus className="size-4" />Thêm năm học / học kỳ</Button> : null}
      />

      <div className="rounded-xl border border-primary/25 bg-primary/5 p-4">
        <div className="flex items-center gap-3"><CalendarRange className="size-5 text-primary" /><div>
          <p className="text-sm">Ngữ cảnh đang áp dụng: <strong>Năm học 2026 - 2027 · Học kỳ I</strong></p>
        </div></div>
      </div>

      <TableCard>
        <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-end lg:justify-between">
          <div><h2 className="text-base font-semibold">Chọn năm học và học kỳ</h2></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Năm học</Label><Select value={year} onValueChange={setYear}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{years.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-1.5"><Label>Học kỳ</Label><Select value={term} onValueChange={setTerm}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Học kỳ I">Học kỳ I</SelectItem><SelectItem value="Học kỳ II">Học kỳ II</SelectItem></SelectContent></Select></div>
          </div>
        </div>

        {canManage && !selected && <div className="flex flex-col gap-3 border-b border-border bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-medium">Chưa tồn tại tổ hợp đã chọn.</p><p className="mt-1 text-xs text-muted-foreground">Thiết lập ngày bắt đầu và ngày kết thúc cho học kỳ.</p></div><Button size="sm" onClick={openCreate}><Plus className="size-4" />Thiết lập học kỳ</Button></div>}

        <ScrollTable><Table><TableHeader><TableRow>
          <TableHead>Năm học</TableHead><TableHead>Học kỳ</TableHead><TableHead>Ngày bắt đầu</TableHead><TableHead>Ngày kết thúc</TableHead><TableHead>Trạng thái</TableHead><TableHead>Tuần học</TableHead><TableHead className="text-right">Thao tác</TableHead>
        </TableRow></TableHeader><TableBody>
          {visibleRows.map((r) => <TableRow key={r.id}>
            <TableCell className="font-medium">{r.year}</TableCell><TableCell>{r.term}</TableCell><TableCell>{r.from}</TableCell><TableCell>{r.to}</TableCell>
            <TableCell><Pill tone={r.status === "Đang áp dụng" ? "success" : r.status === "Chưa bắt đầu" ? "info" : "neutral"}>{r.status}</Pill></TableCell>
            <TableCell>{r.weekSetup}</TableCell>
            <TableCell><div className="flex justify-end gap-1">
              <Button variant="ghost" size="icon" title="Sửa" disabled={!canManage} onClick={() => { setEditing(r); setFormOpen(true); }}><Pencil className="size-4" /></Button>
              <Button variant="ghost" size="icon" title="Cập nhật trạng thái" disabled={!canManage} onClick={() => setRows((prev) => prev.map((x) => x.id === r.id ? { ...x, status: cycleStatus(x.status) } : x))}><Power className="size-4" /></Button>
              <Button variant="ghost" size="icon" title="Xóa" disabled={!canManage} onClick={() => setDeleteTarget(r)}><Trash2 className="size-4" /></Button>
            </div></TableCell>
          </TableRow>)}
        </TableBody></Table></ScrollTable>
      </TableCard>

      <div className="grid gap-4 md:grid-cols-3">
        <Button variant="outline" className="h-auto justify-start p-4 text-left" disabled={!selected || !canManage} onClick={() => { if (selected) { setWeekCount(String(parseInt(selected.weekSetup, 10) || 18)); setDays(String(selected.schoolDays)); setWeekTarget(selected); } }}><Clock3 className="size-5 text-primary" /><span className="ml-3"><strong className="block text-sm">Thiết lập thời gian tuần học</strong><span className="text-xs text-muted-foreground"></span></span></Button>
        <Button variant="outline" className="h-auto justify-start p-4 text-left" disabled={!selected || !canManage} onClick={() => selected && (setHolidayReason(""), setHolidayTarget(selected))}><CalendarOff className="size-5 text-primary" /><span className="ml-3"><strong className="block text-sm">Quản lý ngày nghỉ</strong><span className="text-xs text-muted-foreground"></span></span></Button>
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}><DialogContent className="sm:max-w-lg"><DialogHeader><DialogTitle>{editing && editing.id !== "NEW" ? "Sửa năm học / học kỳ" : "Thiết lập năm học / học kỳ"}</DialogTitle><DialogDescription>Kiểm tra tổ hợp năm học - học kỳ và khoảng thời gian trước khi lưu.</DialogDescription></DialogHeader>
        {editing && <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Năm học</Label>
            <Select value={editing.year} onValueChange={(v) => setEditing({ ...editing, year: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn năm học" />
              </SelectTrigger>
              <SelectContent>
                {schoolYearOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label>Học kỳ</Label><Select value={editing.term} onValueChange={(v) => setEditing({ ...editing, term: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Học kỳ I">Học kỳ I</SelectItem><SelectItem value="Học kỳ II">Học kỳ II</SelectItem></SelectContent></Select></div>
          <div className="space-y-1.5"><Label>Ngày bắt đầu</Label><Input value={editing.from} onChange={(e) => setEditing({ ...editing, from: e.target.value })} placeholder="dd/mm/yyyy" /></div>
          <div className="space-y-1.5"><Label>Ngày kết thúc</Label><Input value={editing.to} onChange={(e) => setEditing({ ...editing, to: e.target.value })} placeholder="dd/mm/yyyy" /></div>
        </div>}
        <DialogFooter><Button variant="outline" onClick={() => setFormOpen(false)}>Hủy</Button><Button onClick={save}><Save className="size-4" />Lưu</Button></DialogFooter>
      </DialogContent></Dialog>

      <ActionDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)} title="Xóa năm học / học kỳ" description="Xóa dữ liệu chỉ nên thực hiện khi học kỳ chưa có dữ liệu PPCT, TKB và Sổ đầu bài liên quan." confirmLabel="Xóa" requireReason reasonLabel="Lý do xóa" onConfirm={() => { if (!deleteTarget) return; setRows((prev) => prev.filter((r) => r.id !== deleteTarget.id)); setDeleteTarget(null); toast.success("Đã xóa năm học / học kỳ."); }} />

      <Dialog open={!!weekTarget} onOpenChange={(v) => !v && setWeekTarget(null)}><DialogContent><DialogHeader><DialogTitle>Thiết lập thời gian tuần học</DialogTitle><DialogDescription>{weekTarget?.year} · {weekTarget?.term}</DialogDescription></DialogHeader><div className="grid gap-3 sm:grid-cols-2"><div className="space-y-1.5"><Label>Số tuần học</Label><Input type="number" min={1} max={25} value={weekCount} onChange={(e) => setWeekCount(e.target.value)} /></div><div className="space-y-1.5"><Label>Số ngày học dự kiến</Label><Input type="number" min={0} value={days} onChange={(e) => setDays(e.target.value)} /></div></div><DialogFooter><Button variant="outline" onClick={() => setWeekTarget(null)}>Hủy</Button><Button onClick={() => { if (!weekTarget) return; setRows((prev) => prev.map((r) => r.id === weekTarget.id ? { ...r, weekSetup: weekCount + " tuần", schoolDays: Number(days) || 0 } : r)); setWeekTarget(null); toast.success("Đã lưu thiết lập thời gian tuần học."); }}>Lưu thiết lập</Button></DialogFooter></DialogContent></Dialog>

      <Dialog open={!!holidayTarget} onOpenChange={(v) => !v && setHolidayTarget(null)}><DialogContent><DialogHeader><DialogTitle>Quản lý ngày học, ngày nghỉ</DialogTitle><DialogDescription>{holidayTarget?.year} · {holidayTarget?.term}</DialogDescription></DialogHeader><div className="space-y-3"><div className="space-y-1.5"><Label>Ngày nghỉ</Label><Input type="date" /></div><div className="space-y-1.5"><Label>Lý do</Label><Textarea value={holidayReason} onChange={(e) => setHolidayReason(e.target.value)} placeholder="Nhập lý do ngày nghỉ..." /></div></div><DialogFooter><Button variant="outline" onClick={() => setHolidayTarget(null)}>Hủy</Button><Button onClick={() => { if (!holidayTarget || !holidayReason.trim()) { toast.error("Vui lòng nhập lý do."); return; } setRows((prev) => prev.map((r) => r.id === holidayTarget.id ? { ...r, holidays: r.holidays + 1 } : r)); setHolidayTarget(null); toast.success("Đã bổ sung ngày nghỉ."); }}>Lưu ngày nghỉ</Button></DialogFooter></DialogContent></Dialog>

    </div>
  );
}