import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { ScrollTable, SearchBar, TableCard, TableToolbar } from "@/components/common/DataTable";
import { EmptyState, NoPermissionState } from "@/components/common/States";
import { Pill } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/lib/app-state";
import { SUBJECTS } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/day-hoc/mon-hoc")({
  head: () => ({
    meta: [
      { title: "Môn học — Sổ đầu bài THCS Khương Mai" },
      { name: "description", content: "Danh mục môn học áp dụng trong năm học hiện hành." },
      { property: "og:title", content: "Môn học" },
      { property: "og:description", content: "Danh mục môn học của Trường THCS Khương Mai." },
    ],
  }),
  component: SubjectPage,
});

function SubjectPage() {
  const { can } = useApp();
  const [q, setQ] = useState("");

  if (!can("setup.view")) {
    return (
      <div>
        <PageHeader title="Môn học" crumbs={[{ label: "Thiết lập dạy học" }, { label: "Môn học" }]} />
        <NoPermissionState />
      </div>
    );
  }

  const rows = SUBJECTS.filter((s) => `${s.code} ${s.name}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <PageHeader
        title="Môn học"
        description="Danh mục môn học dùng cho PPCT, TKB và sổ đầu bài."
        crumbs={[{ label: "Thiết lập dạy học" }, { label: "Môn học" }]}
        actions={
          can("setup.manage") ? (
            <Button onClick={() => toast.success("Đã mở biểu mẫu thêm môn học (dữ liệu mẫu)")}>
              <Plus className="size-4" />
              Thêm môn học
            </Button>
          ) : null
        }
      />
      <TableCard>
        <TableToolbar>
          <SearchBar value={q} onChange={setQ} placeholder="Tìm môn học..." />
        </TableToolbar>
        {rows.length === 0 ? (
          <EmptyState />
        ) : (
          <ScrollTable>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã môn</TableHead>
                  <TableHead>Tên môn</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((s) => (
                  <TableRow key={s.code}>
                    <TableCell className="font-mono text-xs">{s.code}</TableCell>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell><Pill tone="success">Đang áp dụng</Pill></TableCell>
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
