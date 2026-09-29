import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { ScrollTable, SearchBar, TableCard, TableToolbar } from "@/components/common/DataTable";
import { EmptyState, NoPermissionState } from "@/components/common/States";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/lib/app-state";
import { ROLE_SHORT } from "@/lib/types";

export const Route = createFileRoute("/_app/kiem-soat/lich-su")({
  head: () => ({
    meta: [
      { title: "Lịch sử thao tác — THCS Khương Mai" },
      { name: "description", content: "Nhật ký toàn bộ thao tác quan trọng trên hệ thống sổ đầu bài." },
      { property: "og:title", content: "Lịch sử thao tác" },
      { property: "og:description", content: "Theo dõi ai đã làm gì, khi nào và với bản ghi nào." },
    ],
  }),
  component: AuditPage,
});

function AuditPage() {
  const { can, audit } = useApp();
  const [q, setQ] = useState("");

  if (!can("audit.view")) {
    return (
      <div>
        <PageHeader title="Lịch sử thao tác" crumbs={[{ label: "Kiểm soát & lưu trữ" }, { label: "Lịch sử thao tác" }]} />
        <NoPermissionState />
      </div>
    );
  }

  const rows = audit.filter((a) =>
    `${a.actor} ${a.action} ${a.target} ${a.recordCode}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div>
      <PageHeader
        title="Lịch sử thao tác"
        description="Mọi thao tác quan trọng đều được ghi nhận: người thực hiện, vai trò, trạng thái trước và sau."
        crumbs={[{ label: "Kiểm soát & lưu trữ" }, { label: "Lịch sử thao tác" }]}
      />
      <TableCard>
        <TableToolbar>
          <SearchBar value={q} onChange={setQ} placeholder="Tìm theo người thực hiện, hành động, mã bản ghi..." />
        </TableToolbar>
        {rows.length === 0 ? (
          <EmptyState />
        ) : (
          <ScrollTable>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Người thực hiện</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Hành động</TableHead>
                  <TableHead>Đối tượng</TableHead>
                  <TableHead>Mã bản ghi</TableHead>
                  <TableHead>Trạng thái trước</TableHead>
                  <TableHead>Trạng thái sau</TableHead>
                  <TableHead>Lý do</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="whitespace-nowrap">{a.at}</TableCell>
                    <TableCell className="whitespace-nowrap font-medium">{a.actor}</TableCell>
                    <TableCell>{ROLE_SHORT[a.role]}</TableCell>
                    <TableCell className="whitespace-nowrap">{a.action}</TableCell>
                    <TableCell>{a.target}</TableCell>
                    <TableCell className="font-mono text-xs">{a.recordCode}</TableCell>
                    <TableCell className="text-muted-foreground">{a.from}</TableCell>
                    <TableCell>{a.to}</TableCell>
                    <TableCell className="text-muted-foreground">{a.reason}</TableCell>
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
