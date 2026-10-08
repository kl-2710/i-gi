import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { FilterField, ScrollTable, SearchBar, TableCard, TableToolbar } from "@/components/common/DataTable";
import { EmptyState, NoPermissionState } from "@/components/common/States";
import { Pill } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/lib/app-state";
import { CLASSES, NAM_HOC } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/day-hoc/lop")({
  head: () => ({
    meta: [
      { title: "Danh sách lớp — Sổ đầu bài THCS Khương Mai" },
      { name: "description", content: "Danh sách lớp học, khối và giáo viên chủ nhiệm theo năm học, học kỳ." },
      { property: "og:title", content: "Danh sách lớp" },
      { property: "og:description", content: "Quản lý lớp học của Trường THCS Khương Mai." },
    ],
  }),
  component: ClassPage,
});

function ClassPage() {
  const { can } = useApp();
  const [q, setQ] = useState("");
  const [grade, setGrade] = useState("all");

  if (!can("setup.view")) {
    return (
      <div>
        <PageHeader title="Lớp" crumbs={[{ label: "Thiết lập dạy học" }, { label: "Lớp" }]} />
        <NoPermissionState />
      </div>
    );
  }

  const rows = CLASSES.filter(
    (c) =>
      (grade === "all" || c.grade === grade) &&
      `${c.code} ${c.name} ${c.gvcn}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div>
      <PageHeader
        title="Lớp"
        description="Danh sách lớp học trong năm học hiện hành."
        crumbs={[{ label: "Thiết lập dạy học" }, { label: "Lớp" }]}
        actions={
          can("setup.manage") ? (
            <Button onClick={() => toast.success("Đã mở biểu mẫu thêm lớp (dữ liệu mẫu)")}>
              <Plus className="size-4" />
              Thêm lớp
            </Button>
          ) : null
        }
      />
      <TableCard>
        <TableToolbar>
          <SearchBar value={q} onChange={setQ} placeholder="Tìm theo mã lớp, tên lớp, GVCN..." />
          <FilterField label="Khối">
            <Select value={grade} onValueChange={setGrade}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả khối</SelectItem>
                {["Khối 6", "Khối 7", "Khối 8", "Khối 9"].map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>
        </TableToolbar>
        {rows.length === 0 ? (
          <EmptyState />
        ) : (
          <ScrollTable>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã lớp</TableHead>
                  <TableHead>Tên lớp</TableHead>
                  <TableHead>Khối</TableHead>
                  <TableHead>Giáo viên chủ nhiệm</TableHead>
                  <TableHead>Năm học</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((c) => (
                  <TableRow key={c.code}>
                    <TableCell className="font-mono text-xs">{c.code}</TableCell>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.grade}</TableCell>
                    <TableCell className="whitespace-nowrap">{c.gvcn}</TableCell>
                    <TableCell>{NAM_HOC}</TableCell>
                    <TableCell><Pill tone="success">Đang hoạt động</Pill></TableCell>
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
