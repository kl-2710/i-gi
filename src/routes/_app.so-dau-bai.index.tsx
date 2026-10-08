import { useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Check, Lock, X } from "lucide-react";
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
import type { LessonBook } from "@/lib/types";

export const Route = createFileRoute("/_app/so-dau-bai/")({
  head: () => ({
    meta: [
      { title: "Quản lý Sổ đầu bài — THCS Khương Mai" },
      { name: "description", content: "Tra cứu, cập nhật và xác nhận Sổ đầu bài theo phạm vi phân quyền." },
    ],
  }),
  component: BookListPage,
});

const PAGE_SIZE = 12;

const YesNo = ({ ok }: { ok: boolean }) =>
  ok
    ? <Check className="mx-auto size-4 text-success" />
    : <X className="mx-auto size-4 text-muted-foreground" />;

function getWeeks(books: LessonBook[]) {
  const map = new Map<number, LessonBook[]>();
  for (const book of books) {
    const rows = map.get(book.weekNumber) ?? [];
    rows.push(book);
    map.set(book.weekNumber, rows);
  }
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

  const canView =
    can("book.view.all") || can("book.view.own") || can("book.view.class");

  const rows = useMemo(
    () =>
      scopedBooks.filter((book) => {
        const text = `${book.code} ${book.className} ${book.subject} ${book.teacher} ${book.plannedContent}`.toLowerCase();

        if (q && !text.includes(q.toLowerCase())) return false;
        if (cls !== "all" && book.className !== cls) return false;

        const weekConfirmed = Boolean(
          weeklyGvcnConfirmations[`${book.year}|${book.className}|W${book.weekNumber}`],
        );

        if (status === "xac_nhan_gvcn" && !weekConfirmed) return false;
        if (status === "xac_nhan_bgh" && !isBghConfirmed(book.className)) return false;
        if (status === "da_khoa" && book.status !== "da_khoa") return false;

        return true;
      }),
    [scopedBooks, q, cls, status, weeklyGvcnConfirmations, isBghConfirmed],
  );

  const pageRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const weeks = getWeeks(scopedBooks);

  const bghReadyForConfirmation =
    !bghConfirmed &&
    yearEndReached &&
    weeks.length > 0 &&
    weeks.every(([, items]) =>
      items.every((book) => Boolean(book.gvcnConfirm)),
    );

  const canActAsGvcn =
    Boolean(user?.roles.includes("GVCN")) || role === "GVCN";
  const canViewBghPanel =
    can("book.confirm.bgh") || can("book.lock");

  if (!canView) {
    return (
      <div>
        <PageHeader
          title="Quản lý Sổ đầu bài"
          crumbs={[{ label: "Quản lý Sổ đầu bài" }]}
        />
        <NoPermissionState message="Phân quyền hiện tại không tham gia nghiệp vụ Sổ đầu bài." />
      </div>
    );
  }

  const handleConfirmWeek = (weekNumber: number) => {
    if (!user?.homeroomClass) return;
    const result = confirmGvcnWeek(user.homeroomClass, weekNumber);
    result.ok ? toast.success(result.message) : toast.error(result.message);
  };

  const selectedClass = cls === "all" ? CLASSES[0]?.name : cls;
  const selectedClassConfirmed = selectedClass
    ? isBghConfirmed(selectedClass)
    : false;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Quản lý Sổ đầu bài"
        description="Danh sách Sổ đầu bài của nhà trường."
        crumbs={[{ label: "Quản lý Sổ đầu bài" }]}
      />

      {canActAsGvcn && (
        <TableCard>
          <div className="border-b border-border p-4">
            <h2 className="text-base font-semibold">
              Xác nhận Sổ đầu bài theo tuần
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              GVCN xác nhận theo tuần đối với lớp chủ nhiệm.
            </p>
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
                {getWeeks(scopedBooks.filter((book) => book.className === user?.homeroomClass)).map(
                  ([weekNumber, items]) => {
                    const allGvbm = items.every((book) => Boolean(book.gvbmConfirm));
                    const confirmed = Boolean(
                      weeklyGvcnConfirmations[
                        `${items[0]?.year}|${items[0]?.className}|W${weekNumber}`
                      ],
                    );

                    return (
                      <TableRow key={weekNumber}>
                        <TableCell className="font-medium">Tuần {weekNumber}</TableCell>
                        <TableCell>
                          {items[0]?.weekStart} - {items[0]?.weekEnd}
                        </TableCell>
                        <TableCell>{items.length}</TableCell>
                        <TableCell>
                          <Pill tone={allGvbm ? "success" : "warning"}>
                            {allGvbm ? "Đã xác nhận đủ" : "Chưa đủ"}
                          </Pill>
                        </TableCell>
                        <TableCell>
                          <Pill tone={confirmed ? "success" : "warning"}>
                            {confirmed ? "Đã xác nhận" : "Chưa xác nhận"}
                          </Pill>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            disabled={!allGvbm || confirmed}
                            onClick={() => handleConfirmWeek(weekNumber)}
                          >
                            <Check className="size-4" />
                            Xác nhận tuần
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  },
                )}
              </TableBody>
            </Table>
          </ScrollTable>
        </TableCard>
      )}

      {canViewBghPanel && (
        <TableCard>
          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-base font-semibold">
                Xác nhận Sổ đầu bài
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-muted-foreground">Lớp:</span>
                <Select
                  value={cls === "all" ? CLASSES[0]?.name ?? "" : cls}
                  onValueChange={setCls}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CLASSES.map((item) => (
                      <SelectItem key={item.code} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-muted-foreground">
                  Năm học: 2026 - 2027
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {selectedClassConfirmed
                  ? `Đã xác nhận bởi ${bghConfirmations[selectedClass!]?.by} · ${bghConfirmations[selectedClass!]?.at}`
                  : yearEndReached
                    ? `Tất cả tuần của lớp ${selectedClass ?? ""} phải được GVCN xác nhận trước khi BGH xác nhận.`
                    : "Chưa đến thời điểm xác nhận."}
              </p>
            </div>

            <div className="flex shrink-0 gap-2">
              {can("book.confirm.bgh") && (
                <Button
                  disabled={!yearEndReached || !selectedClass || selectedClassConfirmed}
                  onClick={() => {
                    if (!selectedClass) return;
                    const result = confirmBgh(selectedClass);
                    result.ok ? toast.success(result.message) : toast.error(result.message);
                  }}
                >
                  <Check className="size-4" />
                  Xác nhận BGH
                </Button>
              )}
              {can("book.lock") && (
                <Button
                  variant="outline"
                  disabled={!bghConfirmed}
                  onClick={() => {
                    const result = lockAllBooks();
                    result.ok ? toast.success(result.message) : toast.error(result.message);
                  }}
                >
                  <Lock className="size-4" />
                  Khóa Sổ đầu bài
                </Button>
              )}
            </div>
          </div>
        </TableCard>
      )}

      <TableCard>
        <TableToolbar>
          <SearchBar
            value={q}
            onChange={(value) => {
              setQ(value);
              setPage(1);
            }}
            placeholder="Tìm theo mã sổ hoặc lớp..."
          />
          <FilterField label="Lớp">
            <Select
              value={cls}
              onValueChange={(value) => {
                setCls(value);
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả lớp</SelectItem>
                {CLASSES.map((item) => (
                  <SelectItem key={item.code} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>
          <FilterField label="Trạng thái">
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="xac_nhan_gvcn">GVCN đã xác nhận</SelectItem>
                <SelectItem value="xac_nhan_bgh">BGH đã xác nhận</SelectItem>
                <SelectItem value="da_khoa">Đã khóa</SelectItem>
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
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageRows.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="whitespace-nowrap">{book.date}</TableCell>
                    <TableCell>{book.weekday}</TableCell>
                    <TableCell>Tiết {book.period}</TableCell>
                    <TableCell className="font-medium">{book.className}</TableCell>
                    <TableCell className="whitespace-nowrap">{book.subject}</TableCell>
                    <TableCell className="whitespace-nowrap">{book.teacher}</TableCell>
                    <TableCell className="max-w-[260px] truncate">{book.plannedContent}</TableCell>
                    <TableCell className="text-center"><YesNo ok={Boolean(book.gvbmConfirm)} /></TableCell>
                    <TableCell className="text-center">
                      <YesNo ok={Boolean(weeklyGvcnConfirmations[`${book.year}|${book.className}|W${book.weekNumber}`])} />
                    </TableCell>
                    <TableCell className="text-center"><YesNo ok={isBghConfirmed(book.className)} /></TableCell>
                    <TableCell className="text-center"><YesNo ok={book.status === "da_khoa"} /></TableCell>
                    <TableCell><StatusBadge status={book.status} /></TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link to="/so-dau-bai/$id" params={{ id: book.id }}>Xem</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollTable>
        )}

        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          total={rows.length}
          onChange={setPage}
        />
      </TableCard>
    </div>
  );
}
