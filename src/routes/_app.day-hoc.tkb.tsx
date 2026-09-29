import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { ScrollTable, TableCard } from "@/components/common/DataTable";
import { NoPermissionState } from "@/components/common/States";
import { Pill } from "@/components/common/StatusBadge";
import { FileUpload, ValidationResult } from "@/components/common/FileUpload";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/lib/app-state";
import { HOC_KY, NAM_HOC, TKB_ROWS } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/day-hoc/tkb")({
  head: () => ({
    meta: [
      { title: "TKB — Sổ đầu bài THCS Khương Mai" },
      { name: "description", content: "Nhập, kiểm tra và xác nhận thời khóa biểu từ tệp Excel." },
      { property: "og:title", content: "Thời khóa biểu (TKB)" },
      { property: "og:description", content: "Nhập dữ liệu TKB phục vụ sinh sổ đầu bài tự động." },
    ],
  }),
  component: TkbPage,
});

function TkbPage() {
  const { can, setTkbUploaded } = useApp();
  const [file, setFile] = useState<string | null>("TKB_HK1_2026_2027.xlsx");
  const [validated, setValidated] = useState(true);
  const [confirmed, setConfirmed] = useState(true);

  if (!can("tkb.upload")) {
    return (
      <div>
        <PageHeader title="TKB" crumbs={[{ label: "Thiết lập dạy học" }, { label: "TKB" }]} />
        <NoPermissionState message="Chỉ Phó Hiệu trưởng được phép nhập và xác nhận dữ liệu TKB." />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="TKB - Thời khóa biểu"
        description="TKB cung cấp ngày, tiết, lớp, môn và giáo viên để khớp với PPCT khi sinh sổ đầu bài."
        crumbs={[{ label: "Thiết lập dạy học" }, { label: "TKB" }]}
      />

      <div className="rounded-xl border border-border bg-card p-4 shadow-card sm:p-6">
        <h2 className="mb-3 text-base font-semibold">Tải tệp TKB</h2>
        <FileUpload
          suggestedName="TKB_HK1_2026_2027.xlsx"
          onUploaded={(name) => {
            setFile(name);
            setValidated(false);
            setConfirmed(false);
            setTkbUploaded(true);
            toast.success("Tải tệp TKB thành công");
          }}
        />
      </div>

      {file && (
        <div className="rounded-xl border border-border bg-card p-4 shadow-card sm:p-6">
          <h2 className="mb-3 text-base font-semibold">Thông tin tệp</h2>
          <dl className="grid gap-3 text-sm sm:grid-cols-3">
            <div><dt className="text-muted-foreground">Tên tệp</dt><dd className="flex items-center gap-1.5 font-medium"><FileSpreadsheet className="size-4 text-success" />{file}</dd></div>
            <div><dt className="text-muted-foreground">Người tải lên</dt><dd className="font-medium">Trần Quốc Bảo - Phó Hiệu trưởng</dd></div>
            <div><dt className="text-muted-foreground">Thời gian</dt><dd className="font-medium">18/09/2026 09:40</dd></div>
            <div><dt className="text-muted-foreground">Năm học</dt><dd className="font-medium">{NAM_HOC}</dd></div>
            <div><dt className="text-muted-foreground">Học kỳ</dt><dd className="font-medium">{HOC_KY}</dd></div>
            <div><dt className="text-muted-foreground">Trạng thái</dt><dd><Pill tone={confirmed ? "success" : validated ? "info" : "warning"}>{confirmed ? "Đã xác nhận nhập dữ liệu" : validated ? "Đã kiểm tra dữ liệu" : "Chờ kiểm tra dữ liệu"}</Pill></dd></div>
          </dl>
        </div>
      )}

      {file && validated && (
        <div className="rounded-xl border border-border bg-card p-4 shadow-card sm:p-6">
          <h2 className="mb-3 text-base font-semibold">Kết quả kiểm tra dữ liệu</h2>
          <ValidationResult
            total={960}
            valid={952}
            errors={3}
            warnings={8}
            issues={[
              "3 dòng không khớp giáo viên trong danh mục",
              "2 dòng không khớp lớp",
              "2 dòng không khớp môn học",
              "1 dòng trùng bản ghi (ngày - tiết - lớp)",
            ]}
          />
        </div>
      )}

      <TableCard>
        <div className="flex flex-col gap-2 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-semibold">Xem trước dữ liệu TKB</h2>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.info("Đang hiển thị bản xem trước dữ liệu TKB")}>Xem trước</Button>
            <Button variant="outline" size="sm" onClick={() => { setValidated(true); toast.success("Kiểm tra dữ liệu hoàn tất: 952/960 dòng hợp lệ"); }}>Kiểm tra dữ liệu</Button>
            <Button size="sm" disabled={!validated} onClick={() => { setConfirmed(true); toast.success("Đã xác nhận nhập dữ liệu TKB"); }}>Xác nhận nhập dữ liệu</Button>
          </div>
        </div>
        <ScrollTable>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thứ</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Tiết</TableHead>
                <TableHead>Lớp</TableHead>
                <TableHead>Môn</TableHead>
                <TableHead>Giáo viên</TableHead>
                <TableHead>Phòng học</TableHead>
                <TableHead>Năm học</TableHead>
                <TableHead>Học kỳ</TableHead>
                <TableHead>Ghi chú</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TKB_ROWS.map((r, i) => (
                <TableRow key={i}>
                  <TableCell className="whitespace-nowrap">{r.weekday}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.date}</TableCell>
                  <TableCell>Tiết {r.period}</TableCell>
                  <TableCell className="font-medium">{r.className}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.subject}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.teacher}</TableCell>
                  <TableCell>{r.room}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.year}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.semester}</TableCell>
                  <TableCell>{r.error ? <Pill tone="danger">{r.error}</Pill> : <Pill tone="success">Hợp lệ</Pill>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollTable>
      </TableCard>

      {confirmed && (
        <div className="flex flex-col gap-3 rounded-xl border border-primary/25 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm">PPCT và TKB đã sẵn sàng để khớp dữ liệu và sinh sổ đầu bài.</p>
          <Button asChild size="sm"><Link to="/day-hoc/sinh-so-dau-bai">Xem trước dữ liệu sổ được sinh<ArrowRight className="size-4" /></Link></Button>
        </div>
      )}
    </div>
  );
}
