import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardList, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { ScrollTable, TableCard } from "@/components/common/DataTable";
import { NoPermissionState } from "@/components/common/States";
import { Pill } from "@/components/common/StatusBadge";
import { FileUpload, ValidationResult } from "@/components/common/FileUpload";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/lib/app-state";
import { HOC_KY, NAM_HOC, PPCT_ROWS } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/day-hoc/ppct")({
  head: () => ({
    meta: [
      { title: "PPCT — Sổ đầu bài THCS Khương Mai" },
      { name: "description", content: "Nhập, kiểm tra và xác nhận dữ liệu phân phối chương trình từ tệp Excel." },
      { property: "og:title", content: "Phân phối chương trình (PPCT)" },
      { property: "og:description", content: "Nhập dữ liệu PPCT phục vụ sinh sổ đầu bài tự động." },
    ],
  }),
  component: PpctPage,
});

function PpctPage() {
  const { can, setPpctUploaded } = useApp();
  const [file, setFile] = useState<string | null>("PPCT_HK1_2026_2027.xlsx");
  const [validated, setValidated] = useState(true);
  const [confirmed, setConfirmed] = useState(true);

  if (!can("ppct.upload")) {
    return (
      <div>
        <PageHeader title="PPCT" crumbs={[{ label: "Thiết lập dạy học" }, { label: "PPCT" }]} />
        <NoPermissionState message="Chỉ Phó Hiệu trưởng được phép nhập và xác nhận dữ liệu PPCT." />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="PPCT - Phân phối chương trình"
        description="PPCT không chỉ được lưu dưới dạng tệp: dữ liệu PPCT kết hợp với TKB để tự động sinh sổ đầu bài."
        crumbs={[{ label: "Thiết lập dạy học" }, { label: "PPCT" }]}
      />

      <div className="rounded-xl border border-border bg-card p-4 shadow-card sm:p-6">
        <h2 className="mb-3 text-base font-semibold">Tải tệp PPCT</h2>
        <FileUpload
          suggestedName="PPCT_HK1_2026_2027.xlsx"
          onUploaded={(name) => {
            setFile(name);
            setValidated(false);
            setConfirmed(false);
            setPpctUploaded(true);
            toast.success("Tải tệp PPCT thành công");
          }}
        />
      </div>

      {file && (
        <div className="rounded-xl border border-border bg-card p-4 shadow-card sm:p-6">
          <h2 className="mb-3 text-base font-semibold">Thông tin tệp</h2>
          <dl className="grid gap-3 text-sm sm:grid-cols-3">
            <div><dt className="text-muted-foreground">Tên tệp</dt><dd className="flex items-center gap-1.5 font-medium"><FileSpreadsheet className="size-4 text-success" />{file}</dd></div>
            <div><dt className="text-muted-foreground">Người tải lên</dt><dd className="font-medium">Trần Quốc Bảo - Phó Hiệu trưởng</dd></div>
            <div><dt className="text-muted-foreground">Thời gian</dt><dd className="font-medium">18/09/2026 08:12</dd></div>
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
            total={1248}
            valid={1235}
            errors={5}
            warnings={13}
            issues={[
              "5 dòng thiếu số tiết PPCT",
              "4 dòng có môn học không tồn tại trong danh mục",
              "3 dòng trùng bản ghi (tuần - môn - khối)",
              "1 dòng có học kỳ không hợp lệ",
            ]}
          />
        </div>
      )}

      <TableCard>
        <div className="flex flex-col gap-2 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="flex items-center gap-2 text-base font-semibold"><ClipboardList className="size-4 text-primary" />Xem trước dữ liệu PPCT</h2>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.info("Đang hiển thị bản xem trước dữ liệu PPCT")}>Xem trước</Button>
            <Button variant="outline" size="sm" onClick={() => { setValidated(true); toast.success("Kiểm tra dữ liệu hoàn tất: 1.235/1.248 dòng hợp lệ"); }}>Kiểm tra dữ liệu</Button>
            <Button size="sm" disabled={!validated} onClick={() => { setConfirmed(true); toast.success("Đã xác nhận nhập dữ liệu PPCT"); }}>Xác nhận nhập dữ liệu</Button>
          </div>
        </div>
        <ScrollTable>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tuần</TableHead>
                <TableHead>Tiết PPCT</TableHead>
                <TableHead>Môn</TableHead>
                <TableHead>Khối</TableHead>
                <TableHead>Nội dung</TableHead>
                <TableHead>Năm học</TableHead>
                <TableHead>Học kỳ</TableHead>
                <TableHead>Ghi chú</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PPCT_ROWS.map((r, i) => (
                <TableRow key={i}>
                  <TableCell>{r.week}</TableCell>
                  <TableCell>PPCT {r.ppct}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.subject}</TableCell>
                  <TableCell>{r.grade}</TableCell>
                  <TableCell>{r.content}</TableCell>
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
          <p className="text-sm">Dữ liệu PPCT đã sẵn sàng. Bước tiếp theo: nhập TKB và sinh dữ liệu sổ đầu bài.</p>
          <Button asChild size="sm"><Link to="/day-hoc/tkb">Tới bước nhập TKB<ArrowRight className="size-4" /></Link></Button>
        </div>
      )}
    </div>
  );
}
