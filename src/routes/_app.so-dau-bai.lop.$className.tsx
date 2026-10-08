import { useMemo } from "react";
import { Link, createFileRoute, useParams } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { LessonStatusBadge, Pill } from "@/components/common/StatusBadge";
import { EmptyState, NoPermissionState } from "@/components/common/States";
import { ScrollTable, TableCard } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/_app/so-dau-bai/lop/$className")({
  head: () => ({
    meta: [{ title: "Sổ đầu bài lớp chủ nhiệm — THCS Khương Mai" }],
  }),
  component: HomeroomBookPage,
});

function HomeroomBookPage() {
  const { className } = useParams({ from: "/_app/so-dau-bai/lop/$className" });
  const { user, role, books, can, weeklyGvcnConfirmations, confirmGvcnWeek, isGvcnWeekConfirmed } = useApp();

  const isOwner = user?.homeroomClass === className && (
    user.roles.includes("GVCN") || role === "GVCN"
  );

  if (!can("book.view.class") || !isOwner) {
    return (
      <div>
        <PageHeader
          title={`Sổ đầu bài lớp ${className}`}
          crumbs={[{ label: "Quản lý Sổ đầu bài", to: "/so-dau-bai" }, { label: className }]}
        />
        <NoPermissionState message="Bạn chỉ được xem Sổ đầu bài của lớp chủ nhiệm." />
      </div>
    );
  }

  const classBooks = useMemo(
    () => books.filter((book) => book.className === className),
    [books, className],
  );

  const weeks = useMemo(() => {
    const map = new Map<number, typeof classBooks>();
    for (const book of classBooks) {
      const items = map.get(book.weekNumber) ?? [];
      items.push(book);
      map.set(book.weekNumber, items);
    }
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [classBooks]);

  const confirmWeek = (weekNumber: number) => {
    const result = confirmGvcnWeek(className, weekNumber);
    result.ok ? toast.success(result.message) : toast.error(result.message);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title={`Sổ đầu bài lớp ${className}`}
        description={`Năm học ${classBooks[0]?.year ?? "-"} · ${classBooks[0]?.semester ?? "-"}`}
        crumbs={[
          { label: "Quản lý Sổ đầu bài", to: "/so-dau-bai" },
          { label: `Lớp ${className}` },
        ]}
        actions={
          <Button asChild variant="outline">
            <Link to="/so-dau-bai">
              <ArrowLeft className="size-4" />Quay lại danh sách
            </Link>
          </Button>
        }
      />

      <TableCard>
        <div className="border-b border-border p-4">
          <h2 className="text-base font-semibold">Danh sách tiết dạy</h2>
        </div>
        {classBooks.length === 0 ? (
          <EmptyState title="Chưa có dữ liệu Sổ đầu bài" />
        ) : (
          <ScrollTable>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Thứ</TableHead>
                  <TableHead>Tiết</TableHead>
                  <TableHead>Môn</TableHead>
                  <TableHead>Giáo viên</TableHead>
                  <TableHead>Trạng thái tiết dạy</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classBooks.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>{book.date}</TableCell>
                    <TableCell>{book.weekday}</TableCell>
                    <TableCell>Tiết {book.period}</TableCell>
                    <TableCell>{book.subject}</TableCell>
                    <TableCell>{book.teacher}</TableCell>
                    <TableCell><LessonStatusBadge status={book.status} /></TableCell>
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
      </TableCard>

      <TableCard>
        <div className="border-b border-border p-4">
          <h2 className="text-base font-semibold">Xác nhận Sổ đầu bài theo tuần</h2>
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
                const allGvbm = items.every((book) => Boolean(book.gvbmConfirm));
                const confirmed = isGvcnWeekConfirmed(className, weekNumber);
                return (
                  <TableRow key={weekNumber}>
                    <TableCell className="font-medium">Tuần {weekNumber}</TableCell>
                    <TableCell>{items[0]?.weekStart} - {items[0]?.weekEnd}</TableCell>
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
                      <Button size="sm" disabled={!allGvbm || confirmed} onClick={() => confirmWeek(weekNumber)}>
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
    </div>
  );
}
