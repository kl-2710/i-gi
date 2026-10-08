import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, FileWarning, Layers, Sparkles, TriangleAlert } from "lucide-react";
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

export const Route = createFileRoute("/_app/day-hoc/sinh-so-dau-bai")({
  head: () => ({
    meta: [
      { title: "Hình thành dữ liệu tiết dạy — Sổ đầu bài THCS Khương Mai" },
      { name: "description", content: "Đối soát PPCT và TKB, loại ngày nghỉ và hình thành dữ liệu tiết dạy phục vụ Sổ đầu bài." },
    ],
  }),
  component: GeneratePage,
});

function GeneratePage() {
  const { can, books, generated, setGenerated, ppctUploaded, tkbUploaded } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const preview = books.slice(0, 15);

  if (!can("gen.confirm")) {
    return (
      <div>
        <PageHeader title="Hình thành dữ liệu tiết dạy" crumbs={[{ label: "Quản lý danh mục và dữ liệu dạy học" }, { label: "Hình thành dữ liệu tiết dạy" }]} />
        <NoPermissionState message="Chỉ BGH được phép hình thành dữ liệu tiết dạy." />
      </div>
    );
  }

  const ready = ppctUploaded && tkbUploaded;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Hình thành dữ liệu tiết dạy"
        description="Hệ thống tự động đối soát PPCT và TKB, xác định ngày dạy từ lịch học, loại ngày nghỉ và hình thành dữ liệu tiết dạy; sau đó tạo Sổ đầu bài."
        crumbs={[{ label: "Quản lý danh mục và dữ liệu dạy học" }, { label: "Hình thành dữ liệu tiết dạy" }]}
      />

      <div className="rounded-xl border border-border bg-card p-4 text-sm shadow-card sm:p-6">
        <p className="font-medium">Luồng xử lý</p>
        <p className="mt-1 text-muted-foreground">
          PPCT + TKB → Đối soát theo năm học/học kỳ/khối/lớp/môn → Xác định ngày dạy → Loại ngày nghỉ → Xác định tiết PPCT → Hình thành dữ liệu tiết dạy → Sinh Sổ đầu bài.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <DashboardCard label="PPCT" value={ppctUploaded ? "Đã nhập" : "Chưa nhập"} icon={CheckCircle2} tone={ppctUploaded ? "success" : "warning"} />
        <DashboardCard label="TKB" value={tkbUploaded ? "Đã nhập" : "Chưa nhập"} icon={CheckCircle2} tone={tkbUploaded ? "success" : "warning"} />
        <DashboardCard label="Bản ghi tiết dạy dự kiến" value={books.length} icon={Layers} tone="primary" />
        <DashboardCard label="Cần xử lý đối soát" value={9} icon={TriangleAlert} tone="warning" />
        <DashboardCard label="Bản ghi không thể hình thành" value={0} icon={FileWarning} tone="neutral" />
      </div>

      <div className="rounded-xl border border-primary/25 bg-primary/5 p-4 text-sm">
        <p className="font-medium">Kiểm tra trước khi hình thành</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          <div><Pill tone={ppctUploaded ? "success" : "warning"}>{ppctUploaded ? "✓" : "!"}</Pill> PPCT hợp lệ</div>
          <div><Pill tone={tkbUploaded ? "success" : "warning"}>{tkbUploaded ? "✓" : "!"}</Pill> TKB hợp lệ</div>
          <div><Pill tone="success">✓</Pill> Có thể đối soát</div>
        </div>
      </div>

      <TableCard>
        <div className="flex flex-col gap-2 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="flex items-center gap-2 text-base font-semibold"><Sparkles className="size-4 text-primary" />Bản ghi tiết dạy dự kiến hình thành</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate({ to: "/day-hoc/tkb" })}>Quay lại TKB</Button>
            <Button size="sm" disabled={!ready} onClick={() => setOpen(true)}>Hình thành dữ liệu</Button>
          </div>
        </div>
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
                <TableHead>Tiết PPCT</TableHead>
                <TableHead>Nội dung PPCT</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {preview.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="whitespace-nowrap">{b.date}</TableCell>
                  <TableCell>{b.weekday}</TableCell>
                  <TableCell>Tiết {b.period}</TableCell>
                  <TableCell className="font-medium">{b.className}</TableCell>
                  <TableCell className="whitespace-nowrap">{b.subject}</TableCell>
                  <TableCell className="whitespace-nowrap">{b.teacher}</TableCell>
                  <TableCell>Tiết {b.ppctNo}</TableCell>
                  <TableCell>{b.plannedContent}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollTable>
      </TableCard>

      <ActionDialog
        open={open}
        onOpenChange={setOpen}
        title="Xác nhận hình thành dữ liệu tiết dạy"
        description={`Hệ thống sẽ hình thành ${books.length} bản ghi tiết dạy từ PPCT và TKB đã kiểm tra, đồng thời tạo Sổ đầu bài tương ứng.`}
        confirmLabel="Xác nhận hình thành"
        onConfirm={() => {
          setGenerated(true);
          toast.success("Đã hình thành dữ liệu tiết dạy và Sổ đầu bài");
          navigate({ to: "/so-dau-bai" });
        }}
      />

      {!generated && (
        <p className="text-sm text-muted-foreground">Dữ liệu đang ở trạng thái dự kiến, chưa được hình thành chính thức.</p>
      )}
    </div>
  );
}
