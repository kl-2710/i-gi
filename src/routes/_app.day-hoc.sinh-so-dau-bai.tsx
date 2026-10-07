import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { ScrollTable, TableCard } from "@/components/common/DataTable";
import { NoPermissionState } from "@/components/common/States";
import { Pill } from "@/components/common/StatusBadge";
import { DashboardCard } from "@/components/common/DashboardCard";
import { ActionDialog } from "@/components/common/ActionDialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/lib/app-state";
import { CheckCircle2, FileWarning, Layers, TriangleAlert } from "lucide-react";

export const Route = createFileRoute("/_app/day-hoc/sinh-so-dau-bai")({
  head: () => ({
    meta: [
      { title: "Hình thành tiết học từ PPCT và TKB — THCS Khương Mai" },
      { name: "description", content: "Khớp PPCT và TKB, xem trước và xác nhận sinh dữ liệu sổ đầu bài tự động." },
      { property: "og:title", content: "Hình thành tiết học" },
      { property: "og:description", content: "Xem trước bản ghi sổ đầu bài được hệ thống sinh từ PPCT và TKB." },
    ],
  }),
  component: GeneratePage,
});

function GeneratePage() {
  const { can, books, generated, setGenerated } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const preview = books.slice(0, 15);

  if (!can("gen.confirm")) {
    return (
      <div>
        <PageHeader title="Hình thành tiết học" crumbs={[{ label: "Thiết lập dạy học" }, { label: "Hình thành tiết học" }]} />
        <NoPermissionState message="Chỉ Phó Hiệu trưởng được phép xác nhận sinh dữ liệu sổ đầu bài." />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Hình thành tiết học từ PPCT và TKB"
        description="Hệ thống khớp năm học, học kỳ, lớp, môn, giáo viên, ngày, tiết và tiết PPCT để hình thành dữ liệu tiết học và Sổ đầu bài."
        crumbs={[{ label: "Thiết lập dạy học" }, { label: "Hình thành tiết học" }]}
      />

      <div className="rounded-xl border border-border bg-card p-4 text-sm shadow-card">
        <p className="font-medium">Luồng xử lý</p>
        <p className="mt-1 text-muted-foreground">
          Upload PPCT + Upload TKB → Kiểm tra dữ liệu → Khớp dữ liệu → Xem trước → Phó Hiệu trưởng xác nhận → Hệ thống tự động hình thành dữ liệu tiết học và Sổ đầu bài.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <DashboardCard label="Tổng số bản ghi dự kiến" value={books.length} icon={Layers} tone="primary" />
        <DashboardCard label="Tạo thành công" value={books.length - 9} icon={CheckCircle2} tone="success" />
        <DashboardCard label="Cần kiểm tra" value={5} icon={TriangleAlert} tone="warning" />
        <DashboardCard label="Không khớp" value={3} icon={FileWarning} tone="danger" />
        <DashboardCard label="Thiếu dữ liệu" value={1} icon={FileWarning} tone="neutral" />
      </div>

      <TableCard>
        <div className="flex flex-col gap-2 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="flex items-center gap-2 text-base font-semibold"><Sparkles className="size-4 text-primary" />Bản ghi sổ đầu bài dự kiến</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate({ to: "/day-hoc/tkb" })}>Hủy</Button>
            <Button size="sm" onClick={() => setOpen(true)}>Xác nhận hình thành tiết học</Button>
          </div>
        </div>
        <ScrollTable>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ngày</TableHead>
                <TableHead>Tiết</TableHead>
                <TableHead>Lớp</TableHead>
                <TableHead>Môn</TableHead>
                <TableHead>Giáo viên</TableHead>
                <TableHead>Tiết PPCT</TableHead>
                <TableHead>Nội dung dự kiến</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {preview.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="whitespace-nowrap">{b.date}</TableCell>
                  <TableCell>Tiết {b.period}</TableCell>
                  <TableCell className="font-medium">{b.className}</TableCell>
                  <TableCell className="whitespace-nowrap">{b.subject}</TableCell>
                  <TableCell className="whitespace-nowrap">{b.teacher}</TableCell>
                  <TableCell>PPCT {b.ppctNo}</TableCell>
                  <TableCell>{b.plannedContent}</TableCell>
                  <TableCell><Pill tone={generated ? "success" : "info"}>{generated ? "Đã tạo" : "Dự kiến tạo"}</Pill></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollTable>
      </TableCard>

      <ActionDialog
        open={open}
        onOpenChange={setOpen}
        title="Xác nhận hình thành tiết học"
        description={`Hệ thống sẽ hình thành ${books.length} dữ liệu tiết học sổ đầu bài từ dữ liệu PPCT và TKB đã kiểm tra.`}
        confirmLabel="Xác nhận hình thành tiết học"
        onConfirm={() => {
          setGenerated(true);
          toast.success("Hệ thống đã hình thành dữ liệu tiết học và Sổ đầu bài thành công");
          navigate({ to: "/so-dau-bai" });
        }}
      />
    </div>
  );
}
