import { useMemo } from "react";
import { Link, createFileRoute, useParams } from "@tanstack/react-router";
import { ArrowLeft, Eye, Pencil } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState, NoPermissionState } from "@/components/common/States";
import { ScrollTable, TableCard } from "@/components/common/DataTable";
import { LessonStatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/_app/so-dau-bai/giang-day/$className")({
  validateSearch: (search) => ({
    viewer: search.viewer === "school" ? "school" : "teacher",
  }),
  head: () => ({
    meta: [{ title: "Tiết dạy theo lớp — THCS Khương Mai" }],
  }),
  component: TeachingClassPage,
});

function TeachingClassPage() {
  const { className } = useParams({ from: "/_app/so-dau-bai/giang-day/$className" });
  const { viewer } = Route.useSearch();
  const { user, role, books, can } = useApp();
  const canUpdate = can("book.edit");

  const isTeacher =
    Boolean(user?.teacherId) &&
    (user.roles.includes("GVBM") || role === "GVBM");
  const isSchoolViewer = viewer === "school" && (role === "BGH" || role === "TPT" || role === "ADMIN");

  const classBooks = useMemo(
    () =>
      books.filter((book) =>
        book.className === className &&
        (isSchoolViewer || book.teacherId === user?.teacherId),
      ),
    [books, className, user?.teacherId, isSchoolViewer],
  );

  if ((!isSchoolViewer && (!can("book.view.own") || !isTeacher)) ||
      (isSchoolViewer && !can("book.view.all")) ||
      classBooks.length === 0) {
    return (
      <div>
        <PageHeader
          title={`Tiết dạy lớp ${className}`}
          crumbs={[{ label: "Quản lý Sổ đầu bài", to: "/so-dau-bai" }, { label: className }]}
        />
        <NoPermissionState message="Bạn chỉ được xem các tiết dạy do mình phụ trách." />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={`Danh sách tiết dạy lớp ${className}`}
        description={isSchoolViewer ? `Năm học ${classBooks[0]?.year ?? "-"} · ${classBooks[0]?.semester ?? "-"}` : `Giáo viên: ${user?.fullName ?? "-"} · Năm học ${classBooks[0]?.year ?? "-"} · ${classBooks[0]?.semester ?? "-"}`}
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
        <ScrollTable>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ngày</TableHead>
                <TableHead>Thứ</TableHead>
                <TableHead>Tiết</TableHead>
                <TableHead>Môn</TableHead>
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
                  <TableCell className="max-w-[320px] truncate">{book.plannedContent}</TableCell>
                  <TableCell><LessonStatusBadge status={book.status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="ghost" size="icon" title="Xem tiết dạy">
                        <Link to="/so-dau-bai/$id" params={{ id: book.id }} search={{ mode: "view" }}>
                          <Eye className="size-4" />
                        </Link>
                      </Button>
                      {!isSchoolViewer && canUpdate && book.status !== "da_khoa" && !book.gvbmConfirm && (
                        <Button asChild variant="ghost" size="icon" title="Cập nhật tiết dạy">
                          <Link to="/so-dau-bai/$id" params={{ id: book.id }} search={{ mode: "edit" }}>
                            <Pencil className="size-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollTable>
      </TableCard>
    </div>
  );
}
