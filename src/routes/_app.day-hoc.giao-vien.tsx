import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, UsersRound } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState, NoPermissionState } from "@/components/common/States";
import { TableCard, TableToolbar, ScrollTable, SearchBar } from "@/components/common/DataTable";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/_app/day-hoc/giao-vien")({
  head: () => ({ meta: [{ title: "Theo dõi giáo viên — Sổ đầu bài THCS Khương Mai" }] }),
  component: TeachersPage,
});

function TeachersPage() {
  const { can, accounts } = useApp();
  const [q, setQ] = useState("");

  const teachers = useMemo(
    () => accounts.filter((a) => a.teacherId && `${a.code} ${a.fullName} ${a.phone} ${a.position} ${(a.subjects ?? []).join(" ")}`.toLowerCase().includes(q.toLowerCase())),
    [accounts, q],
  );

  if (!can("setup.view")) {
    return <div><PageHeader title="Theo dõi giáo viên" crumbs={[{ label: "Quản lý danh mục và dữ liệu dạy học" }, { label: "Theo dõi giáo viên" }]} /><NoPermissionState message="Bạn không có quyền xem danh sách giáo viên." /></div>;
  }

  return <div>
    <PageHeader title="Theo dõi giáo viên" description="Danh sách giáo viên được hình thành từ hồ sơ giáo viên gắn với tài khoản." crumbs={[{ label: "Quản lý danh mục và dữ liệu dạy học" }, { label: "Theo dõi giáo viên" }]} />
    <TableCard>
      <TableToolbar><SearchBar value={q} onChange={setQ} placeholder="Tìm theo mã giáo viên, họ tên, số điện thoại, môn học..." /></TableToolbar>
      {teachers.length === 0 ? <EmptyState title="Không có giáo viên phù hợp" /> : <ScrollTable>
        <Table><TableHeader><TableRow>
          <TableHead>Mã giáo viên</TableHead><TableHead>Họ và tên</TableHead><TableHead>Số điện thoại</TableHead><TableHead>Chức vụ</TableHead><TableHead>Môn giảng dạy</TableHead><TableHead>Lớp chủ nhiệm</TableHead>
        </TableRow></TableHeader>
        <TableBody>{teachers.map((t) => <TableRow key={t.id}>
          <TableCell className="font-mono text-xs">{t.teacherId}</TableCell>
          <TableCell className="whitespace-nowrap font-medium"><span className="flex items-center gap-2"><UsersRound className="size-4 text-primary" />{t.fullName}</span></TableCell>
          <TableCell>{t.phone}</TableCell>
          <TableCell>{t.position}</TableCell>
          <TableCell>{t.subjects?.join(", ") || "-"}</TableCell>
          <TableCell>{t.homeroomClass || "-"}</TableCell>
        </TableRow>)}</TableBody></Table>
      </ScrollTable>}
    </TableCard>
  </div>;
}
