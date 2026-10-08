import { useMemo } from "react";
import { Link, createFileRoute, useParams } from "@tanstack/react-router";
import { ArrowLeft, Eye } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState, NoPermissionState } from "@/components/common/States";
import { LessonStatusBadge } from "@/components/common/StatusBadge";
import { ScrollTable, TableCard } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/_app/so-dau-bai/truong/$className")({
  head: () => ({
    meta: [{ title: "Sổ đầu bài theo lớp — THCS Khương Mai" }],
  }),
  component: SchoolClassBookPage,
});

function SchoolClassBookPage() {
  const { className } = useParams({ from: "/_app/so-dau-bai/truong/$className" });
  const { books, can } = useApp();

  const classBooks = useMemo(
    () => books.filter((book) => book.className === className),
    [books, className],
  );

  if (!can("book.view.all")) {
    return (
      <div>
        <PageHeader
          title={`Sổ đầu bài lớp ${className}`}
          crumbs={[{ label: "Quản lý Sổ đầu bài", to: "/so-dau-bai" }, { label: className }]}
        />
        <NoPermissionState message="Bạn không có quyền xem Sổ đầu bài của lớp này." />
      </div>
    );
  }

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
          <EmptyState title="Chưa có dữ liệu tiết dạy" />
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
                  <TableHead>Nội dung từ PPCT</TableHead>
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
                    <TableCell className="max-w-[320px] truncate">{book.plannedContent}</TableCell>
                    <TableCell><LessonStatusBadge status={book.status} /></TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="icon" title="Xem chi tiết tiết dạy">
                        <Link to="/so-dau-bai/$id" params={{ id: book.id }} search={{ mode: "view" }}>
                          <Eye className="size-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollTable>
        )}
      </TableCard>
    </div>
  );
}
