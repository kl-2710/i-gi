import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { NoPermissionState } from "@/components/common/States";
import { ScrollTable, TableCard } from "@/components/common/DataTable";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/lib/app-state";
import { TEACHERS, CLASSES } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/day-hoc/giao-vien")({
  head: () => ({
    meta: [
      { title: "Theo dõi giáo viên — Sổ đầu bài THCS Khương Mai" },
      { name: "description", content: "Theo dõi giáo viên, môn giảng dạy và lớp đang tham gia trong năm học hiện hành." },
    ],
  }),
  component: TeacherTrackingPage,
});

function TeacherTrackingPage() {
  const { can } = useApp();
  if (!can("setup.view")) {
    return <><PageHeader title="Theo dõi giáo viên" crumbs={[{ label: "Quản lý danh mục và dữ liệu dạy học" }, { label: "Theo dõi giáo viên" }]} /><NoPermissionState /></>;
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Theo dõi giáo viên"
        description="Theo dõi danh sách giáo viên, môn học phụ trách và phạm vi lớp giảng dạy trong năm học hiện hành."
        crumbs={[{ label: "Quản lý danh mục và dữ liệu dạy học" }, { label: "Theo dõi giáo viên" }]}
      />
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">
        <div className="flex items-center gap-2 font-medium"><Users className="size-4 text-primary" />Thông tin theo dõi được lấy từ dữ liệu giáo viên và TKB.</div>
        <p className="mt-1 text-muted-foreground">Màn hình này chỉ theo dõi, không thực hiện phân công nhiệm vụ chuyên môn.</p>
      </div>
      <TableCard>
        <ScrollTable>
          <Table>
            <TableHeader><TableRow><TableHead>Mã GV</TableHead><TableHead>Họ và tên</TableHead><TableHead>Môn học</TableHead><TableHead>Lớp đang giảng dạy</TableHead><TableHead>Trạng thái</TableHead></TableRow></TableHeader>
            <TableBody>
              {TEACHERS.map((teacher) => {
                const classes = CLASSES.filter((_, i) => i % TEACHERS.length === Number(teacher.id.slice(2)) % TEACHERS.length).map((c) => c.name);
                return <TableRow key={teacher.id}>
                  <TableCell className="font-mono text-xs">{teacher.id}</TableCell>
                  <TableCell className="font-medium">{teacher.name}</TableCell>
                  <TableCell>{teacher.subject}</TableCell>
                  <TableCell>{classes.length ? classes.join(", ") : "Theo TKB"}</TableCell>
                  <TableCell className="text-success">Đang giảng dạy</TableCell>
                </TableRow>;
              })}
            </TableBody>
          </Table>
        </ScrollTable>
      </TableCard>
    </div>
  );
}
