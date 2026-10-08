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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/lib/app-state";
import { CLASSES, SUBJECTS, TEACHERS } from "@/lib/mock-data";
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
    confirmBgh,
    lockAllBooks,
    yearEndReached,
  } = useApp();
  const [q, setQ] = useState("");
  const [cls, setCls] = useState("all");
  const [subject, setSubject] = useState("all");
  const [teacher, setTeacher] = useState("all");
  const [status, setStatus] = useState("all");
  const [from, setFrom] = useState("");
  const [page, setPage] = useState(1);

  const canView = can("book.view.all") || can("book.view.own") || can("book.view.class");

  const rows = useMemo(
    () =>
      scopedBooks.filter((b) => {
        if (q && !`${b.code} ${b.className} ${b.subject} ${b.teacher} ${b.plannedContent}`.toLowerCase().includes(q.toLowerCase())) return false;
        if (cls !== "all" && b.className !== cls) return false;
        if (subject !== "all" && b.subject !== subject) return false;
        if (teacher !== "all" && b.teacher !== teacher) return false;
        if (status !== "all" && b.status !== status) return false;
        if (from && b.date.slice(0, 2) < from.slice(8, 10)) return false;
        return true;
      }),
    [scopedBooks, q, cls, subject, teacher, status, from],
  );

  const weeks = getWeeks(scopedBooks);
  const bghReadyForConfirmation = !bghConfirmed && yearEndReached && weeks.every(([, items]) => items.every((b) => Boolean(b.gvcnConfirm)));

  if (!canView) {
    return (
      <div>
        <PageHeader title="Quản lý Sổ đầu bài" crumbs={[{ label: "Quản lý Sổ đầu bài" }]} />
        <NoPermissionState message="Vai trò hiện tại không tham gia nghiệp vụ Sổ đầu bài." />
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
        description="Sổ đầu bài được hình thành từ dữ liệu tiết dạy; GVBM cập nhật và xác nhận từng tiết, GVCN xác nhận theo tuần, BGH xác nhận sau khi kết thúc năm học rồi thực hiện khóa."
        crumbs={[{ label: "Quản lý Sổ đầu bài" }]}
      />

      {role === "GVCN" && (
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
          <SearchBar value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Tìm theo mã sổ, lớp, môn, giáo viên..." />
          <FilterField label="Từ ngày">
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </FilterField>
          <FilterField label="Lớp">
            <Select value={cls} onValueChange={(v) => { setCls(v); setPage(1); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả lớp</SelectItem>
                {CLASSES.map((c) => <SelectItem key={c.code} value={c.name}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </FilterField>
          <FilterField label="Môn">
            <Select value={subject} onValueChange={(v) => { setSubject(v); setPage(1); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả môn</SelectItem>
                {SUBJECTS.map((s) => <SelectItem key={s.code} value={s.name}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </FilterField>
          <FilterField label="Giáo viên">
            <Select value={teacher} onValueChange={(v) => { setTeacher(v); setPage(1); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả giáo viên</SelectItem>
                {TEACHERS.map((t) => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </FilterField>
          <FilterField label="Trạng thái">
            <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                {(Object.keys(STATUS_LABEL) as BookStatus[]).filter((s) => ["he_thong_tao", "chua_hoan_thien", "da_cap_nhat", "xac_nhan_gvbm", "xac_nhan_gvcn", "xac_nhan_bgh", "da_khoa", "yeu_cau_chinh_sua"].includes(s)).map((s) => (
                  <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>
                ))}
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
                    <TableCell className="text-center"><YesNo ok={bghConfirmed || b.status === "xac_nhan_bgh"} /></TableCell>
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
