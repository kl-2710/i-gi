import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, FileWarning, Layers, Sparkles, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { ScrollTable, TableCard } from "@/components/common/DataTable";
import { NoPermissionState } from "@/components/common/States";
import { Pill } from "@/components/common/StatusBadge";
import { DashboardCard } from "@/components/common/DashboardCard";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  const [hasRun, setHasRun] = useState(generated);

  if (!can("gen.confirm")) {
    return (
      <div>
        <PageHeader
          title="Hình thành dữ liệu tiết dạy"
          crumbs={[
            { label: "Quản lý danh mục và dữ liệu dạy học" },
            { label: "Hình thành dữ liệu tiết dạy" },
          ]}
        />
        <NoPermissionState message="Chỉ BGH được phép hình thành dữ liệu tiết dạy." />
      </div>
    );
  }

  const ready = ppctUploaded && tkbUploaded;

  const handleGenerate = () => {
    if (!ppctUploaded || !tkbUploaded) {
      toast.error("Chưa đủ dữ liệu để hình thành tiết dạy. Vui lòng kiểm tra PPCT và TKB.");
      return;
    }

    setGenerated(true);
    setHasRun(true);
    toast.success("Đã đối soát và hình thành dữ liệu tiết dạy, đồng thời cập nhật Sổ đầu bài.");
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Hình thành dữ liệu tiết dạy"
        description="Ban Giám hiệu khởi chạy chức năng để hệ thống đối soát PPCT, TKB và lịch học, sau đó hình thành dữ liệu tiết dạy và Sổ đầu bài."
        crumbs={[
          { label: "Quản lý danh mục và dữ liệu dạy học" },
          { label: "Hình thành dữ liệu tiết dạy" },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <DashboardCard
          label="PPCT"
          value={ppctUploaded ? "Đã nhập" : "Chưa nhập"}
          icon={CheckCircle2}
          tone={ppctUploaded ? "success" : "warning"}
        />
        <DashboardCard
          label="TKB"
          value={tkbUploaded ? "Đã nhập" : "Chưa nhập"}
          icon={CheckCircle2}
          tone={tkbUploaded ? "success" : "warning"}
        />
      </div>

      {!hasRun ? (
        <>
          <div className="rounded-xl border border-primary/25 bg-primary/5 p-5 text-sm">
            <p className="font-medium">Dữ liệu đầu vào</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div>
                <Pill tone={ppctUploaded ? "success" : "warning"}>{ppctUploaded ? "Đã nhập" : "Chưa nhập"}</Pill>
                <span className="ml-2">Dữ liệu PPCT</span>
              </div>
              <div>
                <Pill tone={tkbUploaded ? "success" : "warning"}>{tkbUploaded ? "Đã nhập" : "Chưa nhập"}</Pill>
                <span className="ml-2">Dữ liệu TKB</span>
              </div>
            </div>
            <p className="mt-3 text-muted-foreground">
              Khi chọn <strong>Hình thành tiết dạy</strong>, hệ thống sẽ thực hiện kiểm tra và đối soát theo dữ liệu đã thiết lập.
            </p>
          </div>

          <div className="flex justify-end">
            <Button size="lg" disabled={!ready} onClick={handleGenerate}>
              <Sparkles className="size-4" />
              Hình thành tiết dạy
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="rounded-xl border border-success/30 bg-success/5 p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-5 text-success" />
              <div>
                <p className="font-semibold">Hình thành dữ liệu tiết dạy hoàn tất</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Hệ thống đã đối soát PPCT và TKB, loại các ngày nghỉ theo lịch học và hình thành dữ liệu tiết dạy.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <DashboardCard label="Số tiết dạy đã hình thành" value={books.length} icon={Layers} tone="primary" />
            <DashboardCard label="Trạng thái" value="Hoàn tất" icon={FileWarning} tone="success" />
          </div>

          <TableCard>
            <div className="flex flex-col gap-2 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-base font-semibold">
                  <Sparkles className="size-4 text-primary" />
                  Dữ liệu tiết dạy đã hình thành
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Dữ liệu này là kết quả sau khi hệ thống thực hiện đối soát và hình thành tiết dạy.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate({ to: "/so-dau-bai" })}>
                Xem Sổ đầu bài
              </Button>
            </div>
            <ScrollTable>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Thứ</TableHead>
                    <TableHead>Tiết</TableHead>
                    <TableHead>Lớp</TableHead>
                    <TableHead>Môn học</TableHead>
                    <TableHead>Giáo viên</TableHead>
                    <TableHead>Tiết PPCT</TableHead>
                    <TableHead>Nội dung bài dạy</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {books.slice(0, 15).map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="whitespace-nowrap">{b.date}</TableCell>
                      <TableCell>{b.weekday}</TableCell>
                      <TableCell>Tiết {b.period}</TableCell>
                      <TableCell className="font-medium">{b.className}</TableCell>
                      <TableCell>{b.subject}</TableCell>
                      <TableCell>{b.teacher}</TableCell>
                      <TableCell>Tiết {b.ppctNo}</TableCell>
                      <TableCell>{b.plannedContent}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollTable>
          </TableCard>
        </>
      )}

      {hasRun && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-3 text-sm">
          <TriangleAlert className="size-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            Các bản ghi chi tiết trên chỉ là phần xem trước của kết quả đã hình thành; toàn bộ dữ liệu được quản lý trong Sổ đầu bài.
          </span>
        </div>
      )}
    </div>
  );
}
