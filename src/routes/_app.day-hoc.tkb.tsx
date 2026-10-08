import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, FileSpreadsheet, Plus, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { FilterField, ScrollTable, SearchBar, TableCard, TableToolbar } from "@/components/common/DataTable";
import { EmptyState, NoPermissionState } from "@/components/common/States";
import { Pill } from "@/components/common/StatusBadge";
import { FileUpload } from "@/components/common/FileUpload";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/lib/app-state";
import { HOC_KY, NAM_HOC } from "@/lib/mock-data";

type TkbDataset = {
  id: string;
  code: string;
  year: string;
  semester: string;
  file: string;
  importedAt: string;
  effectiveFrom: string;
  effectiveTo: string;
  status: "Đã nhập" | "Có lỗi cần xử lý";
  totalRows: number;
  validRows: number;
  errorRows: number;
  warningRows: number;
  issues: string[];
};

type TkbDetail = {
  weekday: string;
  period: number;
  className: string;
  subject: string;
  teacher: string;
};

const INITIAL_DATASETS: TkbDataset[] = [
  {
    id: "TKB001",
    code: "TKB0000001",
    year: "2025 - 2026",
    semester: "Học kỳ I",
    file: "TKB_HKI_2025_2026.xlsx",
    importedAt: "18/08/2025 08:40",
    effectiveFrom: "05/09/2025",
    effectiveTo: "15/01/2026",
    status: "Đã nhập",
    totalRows: 960,
    validRows: 960,
    errorRows: 0,
    warningRows: 0,
    issues: [],
  },
  {
    id: "TKB002",
    code: "TKB0000002",
    year: "2025 - 2026",
    semester: "Học kỳ II",
    file: "TKB_HKII_2025_2026.xlsx",
    importedAt: "16/01/2026 09:10",
    effectiveFrom: "19/01/2026",
    effectiveTo: "31/05/2026",
    status: "Đã nhập",
    totalRows: 960,
    validRows: 958,
    errorRows: 1,
    warningRows: 1,
    issues: ["1 dòng trùng (lớp - thứ - tiết)", "1 dòng thiếu giáo viên"],
  },
  {
    id: "TKB003",
    code: "TKB0000003",
    year: "2026 - 2027",
    semester: "Học kỳ I",
    file: "TKB_HKI_2026_2027.xlsx",
    importedAt: "18/08/2026 09:20",
    effectiveFrom: "05/09/2026",
    effectiveTo: "15/01/2027",
    status: "Đã nhập",
    totalRows: 960,
    validRows: 952,
    errorRows: 3,
    warningRows: 8,
    issues: [
      "3 dòng không khớp giáo viên trong danh mục",
      "2 dòng không khớp lớp",
      "2 dòng không khớp môn học",
      "1 dòng trùng (lớp - thứ - tiết)",
    ],
  },
];

const DETAIL_ROWS: Record<string, TkbDetail[]> = {
  TKB001: [
    { weekday: "Thứ Hai", period: 1, className: "6A1", subject: "Ngữ văn", teacher: "Trần Thị Bích Ngọc" },
    { weekday: "Thứ Hai", period: 2, className: "6A2", subject: "Toán", teacher: "Nguyễn Văn An" },
    { weekday: "Thứ Ba", period: 1, className: "7A1", subject: "Tiếng Anh", teacher: "Lê Thị Minh Thu" },
    { weekday: "Thứ Tư", period: 3, className: "8A1", subject: "Sinh học", teacher: "Nguyễn Thị Lan Anh" },
    { weekday: "Thứ Năm", period: 4, className: "9A1", subject: "GDCD", teacher: "Hoàng Thị Mai" },
  ],
  TKB002: [
    { weekday: "Thứ Hai", period: 1, className: "6A1", subject: "Toán", teacher: "Nguyễn Văn An" },
    { weekday: "Thứ Hai", period: 2, className: "6A2", subject: "Ngữ văn", teacher: "Trần Thị Bích Ngọc" },
    { weekday: "Thứ Ba", period: 2, className: "7A2", subject: "Hóa học", teacher: "Đỗ Văn Hùng" },
    { weekday: "Thứ Tư", period: 4, className: "8A2", subject: "Lịch sử và Địa lý", teacher: "Vũ Quang Huy" },
    { weekday: "Thứ Sáu", period: 5, className: "9A2", subject: "Tin học", teacher: "Bùi Đức Thắng" },
  ],
  TKB003: [
    { weekday: "Thứ Hai", period: 1, className: "6A1", subject: "Ngữ văn", teacher: "Trần Thị Bích Ngọc" },
    { weekday: "Thứ Hai", period: 2, className: "6A2", subject: "Vật lý", teacher: "Phạm Thu Hằng" },
    { weekday: "Thứ Tư", period: 3, className: "7A1", subject: "Sinh học", teacher: "Nguyễn Thị Lan Anh" },
    { weekday: "Thứ Năm", period: 4, className: "7A2", subject: "GDCD", teacher: "Hoàng Thị Mai" },
    { weekday: "Thứ Sáu", period: 5, className: "9A1", subject: "Toán", teacher: "Nguyễn Văn An" },
  ],
};

const YEAR_OPTIONS = Array.from({ length: 9 }, (_, index) => {
  const start = new Date().getFullYear() - 5 + index;
  return `${start} - ${start + 1}`;
});
const SEMESTER_OPTIONS = ["Học kỳ I", "Học kỳ II"];

export const Route = createFileRoute("/_app/day-hoc/tkb")({
  head: () => ({
    meta: [
      { title: "TKB — Sổ đầu bài THCS Khương Mai" },
      { name: "description", content: "Danh sách và nhập thời khóa biểu theo năm học và học kỳ." },
    ],
  }),
  component: TkbPage,
});

function TkbPage() {
  const { can } = useApp();
  const [datasets, setDatasets] = useState<TkbDataset[]>(INITIAL_DATASETS);
  const [yearFilter, setYearFilter] = useState("all");
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [importOpen, setImportOpen] = useState(false);
  const [selected, setSelected] = useState<TkbDataset | null>(null);
  const [importYear, setImportYear] = useState(NAM_HOC);
  const [importSemester, setImportSemester] = useState(HOC_KY);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      datasets.filter((row) => {
        if (yearFilter !== "all" && row.year !== yearFilter) return false;
        if (semesterFilter !== "all" && row.semester !== semesterFilter) return false;
        return `${row.code} ${row.year} ${row.semester} ${row.file}`.toLowerCase().includes(query.toLowerCase());
      }),
    [datasets, yearFilter, semesterFilter, query],
  );

  if (!can("tkb.upload")) {
    return (
      <div>
        <PageHeader title="TKB" crumbs={[{ label: "Quản lý danh mục và dữ liệu dạy học" }, { label: "TKB" }]} />
        <NoPermissionState message="Chỉ BGH được phép nhập TKB." />
      </div>
    );
  }

  const openImport = () => {
    setImportYear(NAM_HOC);
    setImportSemester(HOC_KY);
    setUploadedFile(null);
    setImportOpen(true);
  };

  const saveImport = () => {
    if (!uploadedFile) {
      toast.error("Thông tin không hợp lệ");
      return;
    }
    if (!/\.(xlsx|xls)$/i.test(uploadedFile)) {
      toast.error("Thông tin không hợp lệ");
      return;
    }

    const duplicate = datasets.some((d) => d.year === importYear && d.semester === importSemester);
    if (duplicate) {
      toast.error("Thông tin không hợp lệ");
      return;
    }

    const sequence = datasets.length + 1;
    const code = `TKB${String(sequence).padStart(7, "0")}`;
    const startYear = Number(importYear.slice(0, 4));
    const created: TkbDataset = {
      id: code,
      code,
      year: importYear,
      semester: importSemester,
      file: uploadedFile,
      importedAt: new Date().toLocaleString("vi-VN", { hour12: false }),
      effectiveFrom: importSemester === "Học kỳ I" ? `05/09/${startYear}` : `19/01/${startYear + 1}`,
      effectiveTo: importSemester === "Học kỳ I" ? `15/01/${startYear + 1}` : `31/05/${startYear + 1}`,
      status: "Đã nhập",
      totalRows: 960,
      validRows: 960,
      errorRows: 0,
      warningRows: 0,
      issues: [],
    };

    setDatasets((prev) => [created, ...prev]);
    setImportOpen(false);
    setSelected(created);
    toast.success("Đã kiểm tra và lưu TKB thành công.");
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="TKB - Thời khóa biểu"
        description="Danh sách TKB đã nhập theo năm học và học kỳ."
        crumbs={[{ label: "Quản lý danh mục và dữ liệu dạy học" }, { label: "TKB" }]}
        actions={
          <Button onClick={openImport}>
            <Plus className="size-4" />
            Nhập TKB
          </Button>
        }
      />

      <TableCard>
        <div className="border-b border-border p-4">
          <h2 className="text-base font-semibold">Danh sách TKB đã nhập</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Mỗi dòng tương ứng với một tệp TKB đã được nhập cho một năm học và một học kỳ.
          </p>
        </div>

        <TableToolbar>
          <SearchBar value={query} onChange={setQuery} placeholder="Tìm theo mã TKB, năm học, học kỳ, tên tệp..." />
          <FilterField label="Năm học">
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả năm học</SelectItem>
                {YEAR_OPTIONS.map((year) => <SelectItem key={year} value={year}>{year}</SelectItem>)}
              </SelectContent>
            </Select>
          </FilterField>
          <FilterField label="Học kỳ">
            <Select value={semesterFilter} onValueChange={setSemesterFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả học kỳ</SelectItem>
                {SEMESTER_OPTIONS.map((semester) => <SelectItem key={semester} value={semester}>{semester}</SelectItem>)}
              </SelectContent>
            </Select>
          </FilterField>
        </TableToolbar>

        {filtered.length === 0 ? (
          <EmptyState title="Chưa có TKB phù hợp" description="Hãy điều chỉnh bộ lọc hoặc nhập một TKB mới." />
        ) : (
          <ScrollTable>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã TKB</TableHead>
                  <TableHead>Năm học</TableHead>
                  <TableHead>Học kỳ</TableHead>
                  <TableHead>Tệp nguồn</TableHead>
                  <TableHead>Ngày nhập</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-mono text-xs">{row.code}</TableCell>
                    <TableCell>{row.year}</TableCell>
                    <TableCell>{row.semester}</TableCell>
                    <TableCell className="max-w-[280px]">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="size-4 shrink-0 text-success" />
                        <span className="truncate">{row.file}</span>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{row.importedAt}</TableCell>
                    <TableCell><Pill tone={row.status === "Đã nhập" ? "success" : "danger"}>{row.status}</Pill></TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => setSelected(row)}>
                        <Eye className="size-4" />Xem
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollTable>
        )}
      </TableCard>

      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nhập TKB</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Năm học</Label>
              <Select value={importYear} onValueChange={setImportYear}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {YEAR_OPTIONS.map((year) => <SelectItem key={year} value={year}>{year}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Học kỳ</Label>
              <Select value={importSemester} onValueChange={setImportSemester}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SEMESTER_OPTIONS.map((semester) => <SelectItem key={semester} value={semester}>{semester}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Tệp TKB</Label>
            <FileUpload
              accept=".xlsx,.xls"
              hint="Chỉ hỗ trợ tệp Excel (.xlsx, .xls), dung lượng tối đa 10MB"
              suggestedName={`TKB_${importSemester.replace("Học kỳ ", "HK")}_${importYear.replace(/\s/g, "")}.xlsx`}
              onUploaded={setUploadedFile}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setImportOpen(false)}>Hủy</Button>
            <Button disabled={!uploadedFile} onClick={saveImport}>
              <ClipboardList className="size-4" />
              Lưu TKB
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="sm:max-w-6xl">
          <DialogHeader>
            <DialogTitle>{selected?.year} · {selected?.semester}</DialogTitle>
            <DialogDescription>Thông tin TKB đã nhập và kết quả kiểm tra dữ liệu.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 sm:grid-cols-3">
            <div><p className="text-xs text-muted-foreground">Mã TKB</p><p className="font-medium">{selected?.code}</p></div>
            <div><p className="text-xs text-muted-foreground">Tên tệp</p><p className="font-medium">{selected?.file}</p></div>
            <div><p className="text-xs text-muted-foreground">Ngày nhập</p><p className="font-medium">{selected?.importedAt}</p></div>
            <div><p className="text-xs text-muted-foreground">Ngày áp dụng</p><p className="font-medium">{selected?.effectiveFrom}</p></div>
            <div><p className="text-xs text-muted-foreground">Ngày kết thúc</p><p className="font-medium">{selected?.effectiveTo}</p></div>
            <div><p className="text-xs text-muted-foreground">Trạng thái</p><Pill tone={selected?.status === "Đã nhập" ? "success" : "danger"}>{selected?.status}</Pill></div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold"><ClipboardList className="size-4 text-primary" />Kết quả kiểm tra dữ liệu</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div><p className="text-xs text-muted-foreground">Tổng số dòng</p><p className="text-xl font-semibold">{selected?.totalRows?.toLocaleString("vi-VN")}</p></div>
              <div><p className="text-xs text-muted-foreground">Dòng hợp lệ</p><p className="text-xl font-semibold text-success">{selected?.validRows?.toLocaleString("vi-VN")}</p></div>
              <div><p className="text-xs text-muted-foreground">Dòng lỗi</p><p className="text-xl font-semibold text-destructive">{selected?.errorRows}</p></div>
              <div><p className="text-xs text-muted-foreground">Cảnh báo</p><p className="text-xl font-semibold">{selected?.warningRows}</p></div>
            </div>
            {selected?.issues.length ? (
              <div className="mt-3 space-y-1 rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm">
                {selected.issues.map((issue) => <p key={issue}>{issue}</p>)}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">Không có lỗi hoặc cảnh báo.</p>
            )}
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Xem trước chi tiết TKB</h3>
            <ScrollTable>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Thứ</TableHead>
                    <TableHead>Tiết</TableHead>
                    <TableHead>Lớp</TableHead>
                    <TableHead>Môn học</TableHead>
                    <TableHead>Giáo viên</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(selected ? DETAIL_ROWS[selected.id] ?? [] : []).map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.weekday}</TableCell>
                      <TableCell>Tiết {row.period}</TableCell>
                      <TableCell className="font-medium">{row.className}</TableCell>
                      <TableCell>{row.subject}</TableCell>
                      <TableCell>{row.teacher}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollTable>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
