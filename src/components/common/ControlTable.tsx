import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { FilterField, ScrollTable, SearchBar, TableCard, TableToolbar } from "@/components/common/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { EmptyState } from "@/components/common/States";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ActionDialog } from "@/components/common/ActionDialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/lib/app-state";
import { CLASSES } from "@/lib/mock-data";
import type { BookStatus, LessonBook } from "@/lib/types";

export type ControlAction = "check" | "approve" | "lock" | "unlock" | "archive" | "restore";

const ACTION_META: Record<
  ControlAction,
  { label: string; title: string; status: BookStatus; reason: boolean; auditLabel: string }
> = {
  check: { label: "Kiểm tra", title: "Xác nhận kiểm tra sổ đầu bài", status: "da_kiem_tra", reason: false, auditLabel: "Kiểm tra sổ đầu bài" },
  approve: { label: "Duyệt", title: "Duyệt sổ đầu bài", status: "da_duyet", reason: false, auditLabel: "Duyệt sổ đầu bài" },
  lock: { label: "Khóa sổ", title: "Khóa sổ đầu bài", status: "da_khoa", reason: false, auditLabel: "Khóa sổ" },
  unlock: { label: "Mở khóa", title: "Mở khóa sổ đầu bài", status: "da_duyet", reason: true, auditLabel: "Mở khóa sổ" },
  archive: { label: "Lưu trữ", title: "Lưu trữ sổ đầu bài", status: "da_luu_tru", reason: false, auditLabel: "Lưu trữ sổ" },
  restore: { label: "Khôi phục", title: "Khôi phục sổ đầu bài", status: "da_khoi_phuc", reason: true, auditLabel: "Khôi phục sổ" },
};

const PAGE_SIZE = 10;

export function ControlTable({
  filterFn,
  actions,
  allowRequestFix = false,
}: {
  filterFn: (b: LessonBook) => boolean;
  actions: ControlAction[];
  allowRequestFix?: boolean;
}) {
  const { scopedBooks, updateBook, user } = useApp();
  const [q, setQ] = useState("");
  const [cls, setCls] = useState("all");
  const [page, setPage] = useState(1);
  const [pending, setPending] = useState<{ action: ControlAction | "fix"; book: LessonBook } | null>(null);

  const rows = useMemo(
    () =>
      scopedBooks.filter(
        (b) =>
          filterFn(b) &&
          (cls === "all" || b.className === cls) &&
          `${b.code} ${b.className} ${b.subject} ${b.teacher}`.toLowerCase().includes(q.toLowerCase()),
      ),
    [scopedBooks, filterFn, cls, q],
  );
  const pageRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const now = () => new Date().toLocaleString("vi-VN", { hour12: false });

  const run = (action: ControlAction | "fix", book: LessonBook, reason: string) => {
    if (action === "fix") {
      updateBook(book.id, { fixReason: reason }, "Yêu cầu chỉnh sửa", "yeu_cau_chinh_sua", reason);
      toast.success("Đã gửi yêu cầu chỉnh sửa");
      return;
    }
    const meta = ACTION_META[action];
    const patch: Partial<LessonBook> = {};
    if (action === "check") patch.checkedBy = { by: user?.fullName ?? "", at: now() };
    if (action === "approve") patch.approvedBy = { by: user?.fullName ?? "", at: now() };
    if (action === "lock") patch.lockedBy = { by: user?.fullName ?? "", at: now() };
    if (action === "unlock") patch.lockedBy = undefined;
    if (action === "archive") patch.archivedBy = { by: user?.fullName ?? "", at: now() };
    if (action === "restore") patch.archivedBy = undefined;
    updateBook(book.id, patch, meta.auditLabel, meta.status, reason);
    toast.success(`${meta.label}: đã cập nhật trạng thái bản ghi`);
  };

  return (
    <TableCard>
      <TableToolbar>
        <SearchBar value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Tìm theo lớp, môn, giáo viên..." />
        <FilterField label="Lớp">
          <Select value={cls} onValueChange={(v) => { setCls(v); setPage(1); }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả lớp</SelectItem>
              {CLASSES.map((c) => <SelectItem key={c.code} value={c.name}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </FilterField>
      </TableToolbar>

      {pageRows.length === 0 ? (
        <EmptyState description="Không còn bản ghi nào cần xử lý ở bước này." />
      ) : (
        <ScrollTable>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lớp</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Tiết</TableHead>
                <TableHead>Môn</TableHead>
                <TableHead>Giáo viên</TableHead>
                <TableHead>GVBM</TableHead>
                <TableHead>GVCN</TableHead>
                <TableHead>Kiểm tra</TableHead>
                <TableHead>Duyệt</TableHead>
                <TableHead>Khóa</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{b.className}</TableCell>
                  <TableCell className="whitespace-nowrap">{b.date}</TableCell>
                  <TableCell>Tiết {b.period}</TableCell>
                  <TableCell className="whitespace-nowrap">{b.subject}</TableCell>
                  <TableCell className="whitespace-nowrap">{b.teacher}</TableCell>
                  <TableCell className="text-xs">{b.gvbmConfirm ? "Đã xác nhận" : "Chưa"}</TableCell>
                  <TableCell className="text-xs">{b.gvcnConfirm ? "Đã xác nhận" : "Chưa"}</TableCell>
                  <TableCell className="text-xs">{b.checkedBy ? "Đã kiểm tra" : "Chưa"}</TableCell>
                  <TableCell className="text-xs">{b.approvedBy ? "Đã duyệt" : "Chưa"}</TableCell>
                  <TableCell className="text-xs">{b.lockedBy ? "Đã khóa" : "Chưa"}</TableCell>
                  <TableCell><StatusBadge status={b.status} /></TableCell>
                  <TableCell>
                    <div className="flex flex-wrap justify-end gap-1">
                      <Button asChild variant="ghost" size="sm">
                        <Link to="/so-dau-bai/$id" params={{ id: b.id }}>Xem</Link>
                      </Button>
                      {actions.map((a) => (
                        <Button key={a} variant="outline" size="sm" onClick={() => setPending({ action: a, book: b })}>
                          {ACTION_META[a].label}
                        </Button>
                      ))}
                      {allowRequestFix && (
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setPending({ action: "fix", book: b })}>
                          Yêu cầu chỉnh sửa
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollTable>
      )}
      <Pagination page={page} pageSize={PAGE_SIZE} total={rows.length} onChange={setPage} />

      <ActionDialog
        open={!!pending}
        onOpenChange={(v) => !v && setPending(null)}
        title={pending ? (pending.action === "fix" ? "Yêu cầu chỉnh sửa" : ACTION_META[pending.action].title) : ""}
        description={
          pending
            ? `${pending.book.className} · Tiết ${pending.book.period} · ${pending.book.subject} · ${pending.book.date}`
            : ""
        }
        confirmLabel={pending ? (pending.action === "fix" ? "Gửi yêu cầu" : ACTION_META[pending.action].label) : ""}
        requireReason={pending ? pending.action === "fix" || ACTION_META[pending.action as ControlAction]?.reason : false}
        onConfirm={(reason) => pending && run(pending.action, pending.book, reason)}
      />
    </TableCard>
  );
}
