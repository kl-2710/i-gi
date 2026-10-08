import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Clock3, Lock, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { FilterField, ScrollTable, SearchBar, TableCard, TableToolbar } from "@/components/common/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { EmptyState, NoPermissionState } from "@/components/common/States";
import { StatusBadge, Pill } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/lib/app-state";
import { CLASSES } from "@/lib/mock-data";
import { STATUS_LABEL, type BookStatus, type LessonBook } from "@/lib/types";

export const Route = createFileRoute("/_app/so-dau-bai/")({
  head: () => ({
    meta: [
      { title: "Quản lý Sổ đầu bài — THCS Khương Mai" },
      { name: "description", content: "Tra cứu, cập nhật và xác nhận Sổ đầu bài theo phạm vi quyền của người dùng." },
    ],
  }),
  component: BookListPage,
});

const PAGE_SIZE = 12;
const YesNo = ({ ok }: { ok: boolean }) =>
  ok ? <Check className="mx-auto size-4 text-success" /> : <X className="mx-auto size-4 text-muted-foreground" />;

function getWeeks(books: LessonBook[]) {
  const map = new Map<number, LessonBook[]>();
  books.forEach((b) => {
    const rows = map.get(b.weekNumber) ?? [];
    rows.push(b);
    map.set(b.weekNumber, rows);
  });
  return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
}

function BookListPage() {
  const {
    can,
    scopedBooks,
    role,
    user,
    weeklyGvcnConfirmations,
    confirmGvcnWeek,
    bghConfirmed,
    bghConfirmAt,
    bghConfirmations,
    confirmBgh,
    isBghConfirmed,
    lockAllBooks,
    yearEndReached,
  } = useApp();
  const [q, setQ] = useState("");
  const [cls, setCls] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const canView = can("book.view.all") || can("book.view.own") || can("book.view.class");

  const rows = useMemo(
    () =>
      scopedBooks.filter((b) => {
        if (q && !`${b.code} ${b.className} ${b.subject} ${b.teacher} ${b.plannedContent}`.toLowerCase().includes(q.toLowerCase())) return false;
        if (cls !== "all" && b.className !== cls) return false;
        if (status === "xac_nhan_gvcn" && !weeklyGvcnConfirmations[`${b.year}|${b.className}|W${b.weekNumber}`]) return false;
        if (status === "xac_nhan_bgh" && !isBghConfirmed(b.className)) return false;
        if (status === "da_khoa" && b.status !== "da_khoa") return false;
        return true;
      }),
    [scopedBooks, q, cls, status, weeklyGvcnConfirmations, isBghConfirmed],
  );

  const weeks = getWeeks(scopedBooks);
  const bghReadyForConfirmation = !bghConfirmed && yearEndReached && weeks.every(([, items]) => items.every((b) => Boolean(b.gvcnConfirm)));

  if (!canView) {
    return (
      <div>
        <PageHeader title="Quản lý Sổ đầu bài" crumbs={[{ label: "Quản lý Sổ đầu bài" }]} />
        <NoPermissionState message="Phân quyền hiện tại không tham gia nghiệp vụ Sổ đầu bài." />
      </div>
    );
  }

  const pageRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleConfirmWeek = (weekNumber: number) => {
    if (!user?.homeroomClass) return;
    const result = confirmGvcnWeek(user.homeroomClass, weekNumber);
    if (result.ok) toast.success(result.message);
    else toast.error(result.message);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Quản lý Sổ đầu bài"
        description="Danh sách Sổ đầu bài của nhà trường."
        crumbs={[{ label: "Quản lý Sổ đầu bài" }]}
      />

      {(user.roles.includes("GVCN") || role === "GVCN") && (
        <TableCard>
          <div className="border-b border-border p-4">
            <h2 className="text-base font-semibold">Xác nhận Sổ đầu bài theo tuần</h2>
            <p className="mt-1 text-sm text-muted-foreground">Chỉ được xác nhận khi tất cả các tiết trong tuần của lớp chủ nhiệm đã được GVBM xác nhận.</p>
          </div>
          <ScrollTable>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tuần</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Số tiết</TableHead>
                  <TableHead>GVBM</TableHead>
                  <TableHead>GVCN</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {weeks.map(([weekNumber, items]) => {
                  const allGvbm = items.every((b) => Boolean(b.gvbmConfirm));
                  const confirmed = Boolean(weeklyGvcnConfirmations[`${items[0]?.year}|${items[0]?.className}|W${weekNumber}`]);
                  return (
                    <TableRow key={weekNumber}>
                      <TableCell className="font-medium">Tuần {weekNumber}</TableCell>
                      <TableCell>{items[0]?.weekStart} - {items[0]?.weekEnd}</TableCell>
                      <TableCell>{items.length}</TableCell>
                      <TableCell><Pill tone={allGvbm ? "success" : "warning"}>{allGvbm ? "Đã xác nhận đủ" : "Chưa đủ"}</Pill></TableCell>
                      <TableCell><Pill tone={confirmed ? "success" : "warning"}>{confirmed ? "Đã xác nhận" : "Chưa xác nhận"}</Pill></TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          disabled={!allGvbm || confirmed}
                          onClick={() => handleConfirmWeek(weekNumber)}
                        >
                          <Check className="size-4" />Xác nhận tuần
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollTable>
        </TableCard>
      )}

      {(role === "BGH" || role === "TPT" || role === "ADMIN") && (
        <TableCard>
          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-base font-semibold">Xác nhận Sổ đầu bài</h2>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-muted-foreground">Lớp:</span>
                <Select value={cls === "all" ? CLASSES[0]?.name ?? "" : cls} onValueChange={setCls}>
                  <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
                  <SelectContent>{CLASSES.map((c) => <SelectItem key={c.code} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
                <span className="text-muted-foreground">Năm học: 2026 - 2027</span>
              </div>
              {(() => {
                const selectedClass = cls === "all" ? CLASSES[0]?.name : cls;
                const confirmed = selectedClass ? isBghConfirmed(selectedClass) : false;
                const classWeeks = selectedClass ? getWeeks(scopedBooks.filter((b) => b.className === selectedClass)) : [];
                const ready = yearEndReached && classWeeks.length > 0 && classWeeks.every(([, items]) => items.every((b) => Boolean(b.gvcnConfirm)));
                return <p className="mt-2 text-sm text-muted-foreground">{confirmed ? `Đã xác nhận bởi ${bghConfirmations[selectedClass!]?.by} · ${bghConfirmations[selectedClass!]?.at}` : ready ? "Sổ đầu bài của lớp đã đủ điều kiện xác nhận." : yearEndReached ? "Chưa đủ điều kiện: vẫn còn tuần chưa được GVCN xác nhận." : "Chưa đến thời điểm xác nhận."}</p>;
              })()}
            </div>
            <div className="flex gap-2">
              {can("book.confirm.bgh") && (() => {
                const selectedClass = cls === "all" ? CLASSES[0]?.name : cls;
                const classWeeks = selectedClass ? getWeeks(scopedBooks.filter((b) => b.className === selectedClass)) : [];
                const ready = Boolean(selectedClass) && yearEndReached && classWeeks.length > 0 && classWeeks.every(([, items]) => items.every((b) => Boolean(b.gvcnConfirm)));
                return <Button disabled={!ready || isBghConfirmed(selectedClass ?? "")} onClick={() => { if (!selectedClass) return; const result = confirmBgh(selectedClass); result.ok ? toast.success(result.message) : toast.error(result.message); }}><Check className="size-4" />Xác nhận Sổ đầu bài</Button>;
              })()}
              {can("book.lock") && <Button variant="outline" disabled={!bghConfirmed} onClick={() => { const result = lockAllBooks(); result.ok ? toast.success(result.message) : toast.error(result.message); }}><Lock className="size-4" />Khóa Sổ đầu bài</Button>}
            </div>
          </div>
        </TableCard>
      )}
      <TableCard>
          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold">Trạng thái xác nhận Sổ đầu bài</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {bghConfirmed
                  ? `Đã xác nhận bởi ${bghConfirmAt?.by} · ${bghConfirmAt?.at}`
                  : yearEndReached
                    ? bghReadyForConfirmation
                      ? "Tất cả các tuần đã được GVCN xác nhận; Sổ đầu bài đủ điều kiện để BGH xác nhận."
                      : "Chưa đủ điều kiện: vẫn còn tuần chưa được GVCN xác nhận."
                    : "Chưa đến thời điểm xác nhận: BGH chỉ xác nhận sau khi kết thúc năm học."}
              </p>
            </div>
            <div className="flex gap-2">
              {can("book.confirm.bgh") && (
                <Button disabled={!bghReadyForConfirmation} onClick={() => {
                  const result = confirmBgh();
                  result.ok ? toast.success(result.message) : toast.error(result.message);
                }}>
                  <Check className="size-4" />Xác nhận BGH
                </Button>
              )}
              {can("book.lock") && (
                <Button variant="outline" disabled={!bghConfirmed} onClick={() => {
                  const result = lockAllBooks();
                  result.ok ? toast.success(result.message) : toast.error(result.message);
                }}>
                  <Lock className="size-4" />Khóa Sổ đầu bài
                </Button>
              )}
            </div>
          </div>
        </TableCard>
      )}

      <TableCard>
        <TableToolbar>
          <SearchBar value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Tìm theo mã sổ hoặc lớp..." />
          <FilterField label="Lớp">
            <Select value={cls} onValueChange={(v) => { setCls(v); setPage(1); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">Tất cả lớp</SelectItem>{CLASSES.map((c) => <SelectItem key={c.code} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </FilterField>
          <FilterField label="Trạng thái">
            <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="xac_nhan_gvcn">GVCN đã xác nhận</SelectItem>
                <SelectItem value="xac_nhan_bgh">BGH đã xác nhận</SelectItem>
                <SelectItem value="da_khoa">Đã khóa</SelectItem>
              </SelectContent>
            </Select>
          </FilterField>
        </TableToolbar>Toolbar>

        {pageRows.length === 0 ? (
          <EmptyState />
        ) : (
          <ScrollTable>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Thứ</TableHead>
                  <TableHead>Tiết</TableHead>
                  <TableHead>Lớp</TableHead>
                  <TableHead>Môn</TableHead>
                  <TableHead>Giáo viên</TableHead>
                  <TableHead>Nội dung từ PPCT</TableHead>
                  <TableHead className="text-center">GVBM</TableHead>
                  <TableHead className="text-center">GVCN / Tuần</TableHead>
                  <TableHead className="text-center">BGH</TableHead>
                  <TableHead className="text-center">Khóa</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageRows.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="whitespace-nowrap">{b.date}</TableCell>
                    <TableCell>{b.weekday}</TableCell>
                    <TableCell>Tiết {b.period}</TableCell>
                    <TableCell className="font-medium">{b.className}</TableCell>
                    <TableCell className="whitespace-nowrap">{b.subject}</TableCell>
                    <TableCell className="whitespace-nowrap">{b.teacher}</TableCell>
                    <TableCell className="max-w-[260px] truncate">{b.plannedContent}</TableCell>
                    <TableCell className="text-center"><YesNo ok={!!b.gvbmConfirm} /></TableCell>
                    <TableCell className="text-center"><YesNo ok={!!weeklyGvcnConfirmations[`${b.year}|${b.className}|W${b.weekNumber}`]} /></TableCell>
                    <TableCell className="text-center"><YesNo ok={isBghConfirmed(b.className)} /></TableCell>
                    <TableCell className="text-center"><YesNo ok={b.status === "da_khoa"} /></TableCell>
                    <TableCell><StatusBadge status={b.status} /></TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm"><Link to="/so-dau-bai/$id" params={{ id: b.id }}>Xem</Link></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollTable>
        )}
        <Pagination page={page} pageSize={PAGE_SIZE} total={rows.length} onChange={setPage} />
      </TableCard>
    </div>
  );
}
