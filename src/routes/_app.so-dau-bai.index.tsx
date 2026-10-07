import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { FilterField, ScrollTable, SearchBar, TableCard, TableToolbar } from "@/components/common/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { EmptyState, NoPermissionState } from "@/components/common/States";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/lib/app-state";
import { CLASSES, SUBJECTS, TEACHERS } from "@/lib/mock-data";
import { STATUS_LABEL, type BookStatus } from "@/lib/types";

export const Route = createFileRoute("/_app/so-dau-bai/")({
  head: () => ({
    meta: [
      { title: "Danh sách sổ đầu bài — THCS Khương Mai" },
      { name: "description", content: "Danh sách sổ đầu bài theo lớp, môn, giáo viên và trạng thái xử lý." },
      { property: "og:title", content: "Danh sách sổ đầu bài" },
      { property: "og:description", content: "Theo dõi và xử lý sổ đầu bài của Trường THCS Khương Mai." },
    ],
  }),
  component: BookListPage,
});

const PAGE_SIZE = 12;
const YesNo = ({ ok }: { ok: boolean }) =>
  ok ? <Check className="size-4 text-success" /> : <X className="size-4 text-muted-foreground" />;

function BookListPage() {
  const { can, scopedBooks } = useApp();
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
  const pageRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (!canView) {
    return (
      <div>
        <PageHeader title="Quản lý sổ đầu bài" crumbs={[{ label: "Quản lý sổ đầu bài" }]} />
        <NoPermissionState message="Vai trò hiện tại không tham gia nghiệp vụ sổ đầu bài." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Danh sách sổ đầu bài"
        description="Dữ liệu được hệ thống hình thành từ PPCT và TKB; GVBM bổ sung thông tin thực tế, GVCN xác nhận theo tuần và BGH xác nhận trước khi khóa."
        crumbs={[{ label: "Quản lý sổ đầu bài" }]}
      />
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
                {(Object.keys(STATUS_LABEL) as BookStatus[]).map((s) => (
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
                  <TableHead>Tuần</TableHead>
                  <TableHead>Tiết</TableHead>
                  <TableHead>Lớp</TableHead>
                  <TableHead>Môn</TableHead>
                  <TableHead>Giáo viên</TableHead>
                  <TableHead>Nội dung</TableHead>
                  <TableHead className="text-center">GVBM</TableHead>
                  <TableHead className="text-center">Khóa</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageRows.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="whitespace-nowrap">{b.date}</TableCell>
                    <TableCell className="whitespace-nowrap">{b.weekday}</TableCell>
                    <TableCell>Tiết {b.period}</TableCell>
                    <TableCell className="font-medium">{b.className}</TableCell>
                    <TableCell className="whitespace-nowrap">{b.subject}</TableCell>
                    <TableCell className="whitespace-nowrap">{b.teacher}</TableCell>
                    <TableCell className="max-w-[240px] truncate">{b.actualContent || b.plannedContent}</TableCell>
                    <TableCell className="text-center"><div className="flex justify-center"><YesNo ok={!!b.gvbmConfirm} /></div></TableCell>
                    <TableCell className="text-center"><div className="flex justify-center"><YesNo ok={!!b.lockedBy} /></div></TableCell>
                    <TableCell><StatusBadge status={b.status} /></TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link to="/so-dau-bai/$id" params={{ id: b.id }}>Xem</Link>
                      </Button>
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
