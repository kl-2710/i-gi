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
      { name: "description", content: "Nhập và kiểm tra thời khóa biểu toàn trường theo học kỳ." },
    ],
  }),
  component: TkbPage,
});

function TkbPage() {
  const { can, setTkbUploaded } = useApp();
  const [file, setFile] = useState<string | null>("TKB_HK1_2026_2027.xlsx");
  const [validated, setValidated] = useState(true);

  if (!can("tkb.upload")) {
    return (
      <div>
        <PageHeader title="TKB" crumbs={[{ label: "Quản lý danh mục và dữ liệu dạy học" }, { label: "TKB" }]} />
        <NoPermissionState message="Chỉ BGH được phép nhập TKB." />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="TKB - Thời khóa biểu"
        description="Một học kỳ chỉ có một TKB áp dụng cho toàn trường. TKB không được quản lý theo tuần; dữ liệu tuần/ngày được hình thành từ lịch học khi sinh tiết dạy."
        crumbs={[{ label: "Quản lý danh mục và dữ liệu dạy học" }, { label: "TKB" }]}
      />

      <div className="rounded-xl border border-primary/25 bg-primary/5 p-4 text-sm">
        <p className="font-medium">Quy tắc TKB</p>
        <p className="mt-1 text-muted-foreground">TKB chứa lịch dạy từ Thứ Hai đến Thứ Sáu, 5 tiết buổi sáng. Mỗi dòng chi tiết xác định Thứ + Tiết + Lớp + Môn học + Giáo viên.</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-card sm:p-6">
        <h2 className="mb-3 text-base font-semibold">Tải tệp TKB</h2>
        <FileUpload
          suggestedName="TKB_HK1_2026_2027.xlsx"
          onUploaded={(name) => {
            setFile(name);
            setValidated(false);
            setTkbUploaded(true);
            toast.success("Tải tệp TKB thành công");
          }}
        />
      </div>

      {file && (
        <div className="rounded-xl border border-border bg-card p-4 shadow-card sm:p-6">
          <h2 className="mb-3 text-base font-semibold">Thông tin TKB</h2>
          <dl className="grid gap-3 text-sm sm:grid-cols-3">
            <div><dt className="text-muted-foreground">Tên tệp</dt><dd className="flex items-center gap-1.5 font-medium"><FileSpreadsheet className="size-4 text-success" />{file}</dd></div>
            <div><dt className="text-muted-foreground">Năm học</dt><dd className="font-medium">{NAM_HOC}</dd></div>
            <div><dt className="text-muted-foreground">Học kỳ</dt><dd className="font-medium">{HOC_KY}</dd></div>
            <div><dt className="text-muted-foreground">Ngày áp dụng</dt><dd className="font-medium">19/08/2026</dd></div>
            <div><dt className="text-muted-foreground">Phạm vi</dt><dd className="font-medium">Toàn trường</dd></div>
            <div><dt className="text-muted-foreground">Trạng thái</dt><dd><Pill tone={validated ? "success" : "warning"}>{validated ? "Đã kiểm tra dữ liệu" : "Chờ kiểm tra dữ liệu"}</Pill></dd></div>
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
              "1 dòng trùng (TKB - lớp - thứ - tiết)",
            ]}
          />
        </div>
      )}

      <TableCard>
        <div className="flex flex-col gap-2 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-semibold">Xem trước chi tiết TKB</h2>
          <Button variant="outline" size="sm" onClick={() => { setValidated(true); toast.success("Kiểm tra dữ liệu TKB hoàn tất"); }}>Kiểm tra dữ liệu</Button>
        </div>
        <ScrollTable>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thứ</TableHead>
                <TableHead>Tiết</TableHead>
                <TableHead>Lớp</TableHead>
                <TableHead>Môn</TableHead>
                <TableHead>Giáo viên</TableHead>
                <TableHead>Năm học</TableHead>
                <TableHead>Học kỳ</TableHead>
                <TableHead>Ghi chú</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TKB_ROWS.map((r, i) => (
                <TableRow key={i}>
                  <TableCell className="whitespace-nowrap">{r.weekday}</TableCell>
                  <TableCell>Tiết {r.period}</TableCell>
                  <TableCell className="font-medium">{r.className}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.subject}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.teacher}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.year}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.semester}</TableCell>
                  <TableCell>{r.error ? <Pill tone="danger">{r.error}</Pill> : <Pill tone="success">Hợp lệ</Pill>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollTable>
      </TableCard>

      {validated && (
        <div className="flex flex-col gap-3 rounded-xl border border-primary/25 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm">PPCT và TKB đã sẵn sàng để đối soát và hình thành dữ liệu tiết dạy.</p>
          <Button asChild size="sm"><Link to="/day-hoc/sinh-so-dau-bai">Hình thành dữ liệu tiết dạy<ArrowRight className="size-4" /></Link></Button>
        </div>
      )}
    </div>
  );
}
