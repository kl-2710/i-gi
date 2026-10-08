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
      { name: "description", content: "Nhập và kiểm tra phân phối chương trình theo năm học, học kỳ, khối và môn học." },
    ],
  }),
  component: PpctPage,
});

function PpctPage() {
  const { can, setPpctUploaded } = useApp();
  const [file, setFile] = useState<string | null>("PPCT_HK1_2026_2027.xlsx");
  const [validated, setValidated] = useState(true);

  if (!can("ppct.upload")) {
    return (
      <div>
        <PageHeader title="PPCT" crumbs={[{ label: "Quản lý danh mục và dữ liệu dạy học" }, { label: "PPCT" }]} />
        <NoPermissionState message="Chỉ BGH được phép nhập PPCT." />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="PPCT - Phân phối chương trình"
        description="Một dòng chi tiết PPCT tương ứng với một tiết trong tiến trình giảng dạy; PPCT là dữ liệu đầu vào để đối chiếu với TKB."
        crumbs={[{ label: "Quản lý danh mục và dữ liệu dạy học" }, { label: "PPCT" }]}
      />

      <div className="rounded-xl border border-border bg-card p-4 shadow-card sm:p-6">
        <h2 className="mb-3 text-base font-semibold">Tải tệp PPCT</h2>
        <FileUpload
          suggestedName="PPCT_HK1_2026_2027.xlsx"
          onUploaded={(name) => {
            setFile(name);
            setValidated(false);
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
            <div><dt className="text-muted-foreground">Năm học</dt><dd className="font-medium">{NAM_HOC}</dd></div>
            <div><dt className="text-muted-foreground">Học kỳ</dt><dd className="font-medium">{HOC_KY}</dd></div>
            <div><dt className="text-muted-foreground">Trạng thái</dt><dd><Pill tone={validated ? "success" : "warning"}>{validated ? "Đã kiểm tra dữ liệu" : "Chờ kiểm tra dữ liệu"}</Pill></dd></div>
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
              "3 dòng thiếu nội dung bài dạy",
              "4 dòng có môn học không tồn tại trong danh mục",
              "3 dòng trùng khóa (PPCT - số thứ tự tiết)",
              "1 dòng không phù hợp năm học/học kỳ",
            ]}
          />
        </div>
      )}

      <TableCard>
        <div className="flex flex-col gap-2 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="flex items-center gap-2 text-base font-semibold"><ClipboardList className="size-4 text-primary" />Xem trước chi tiết PPCT</h2>
          <Button variant="outline" size="sm" onClick={() => { setValidated(true); toast.success("Kiểm tra dữ liệu PPCT hoàn tất"); }}>Kiểm tra dữ liệu</Button>
        </div>
        <ScrollTable>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Số thứ tự tiết</TableHead>
                <TableHead>Môn</TableHead>
                <TableHead>Khối</TableHead>
                <TableHead>Nội dung bài dạy</TableHead>
                <TableHead>Năm học</TableHead>
                <TableHead>Học kỳ</TableHead>
                <TableHead>Ghi chú</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PPCT_ROWS.map((r, i) => (
                <TableRow key={i}>
                  <TableCell>Tiết {r.soThuTuTiet}</TableCell>
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

      {validated && (
        <div className="flex flex-col gap-3 rounded-xl border border-primary/25 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm">PPCT đã sẵn sàng để đối chiếu với TKB.</p>
          <Button asChild size="sm"><Link to="/day-hoc/tkb">Tới nhập TKB<ArrowRight className="size-4" /></Link></Button>
        </div>
      )}
    </div>
  );
}
