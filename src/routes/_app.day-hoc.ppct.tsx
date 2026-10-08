import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ClipboardList, Eye, FileSpreadsheet, Plus, Upload } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { FilterField, ScrollTable, SearchBar, TableCard, TableToolbar } from "@/components/common/DataTable";
import { EmptyState, NoPermissionState } from "@/components/common/States";
import { Pill } from "@/components/common/StatusBadge";
import { FileUpload, ValidationResult } from "@/components/common/FileUpload";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/lib/app-state";
import { SUBJECTS, NAM_HOC } from "@/lib/mock-data";

type PpctDataset = {
  id: string;
  code: string;
  year: string;
  grade: string;
  subject: string;
  file: string;
  importedAt: string;
  status: "Đã nhập" | "Có lỗi cần xử lý";
  totalLessons: number;
};

type PpctDetail = {
  no: number;
  semester: "Học kỳ I" | "Học kỳ II";
  content: string;
};

const INITIAL_DATASETS: PpctDataset[] = [
  {
    id: "PPCT001",
    code: "PPCT-2024-2025-K7-TOAN",
    year: "2024 - 2025",
    grade: "Khối 7",
    subject: "Toán",
    file: "PPCT Toán 7 (Năm học 2024-2025).pdf",
    importedAt: "18/08/2024 09:15",
    status: "Đã nhập",
    totalLessons: 140,
  },
  {
    id: "PPCT002",
    code: "PPCT-2025-2026-K8-NGVAN",
    year: "2025 - 2026",
    grade: "Khối 8",
    subject: "Ngữ văn",
    file: "PPCT Ngữ văn 8 - 2025-2026.pdf",
    importedAt: "20/08/2025 10:20",
    status: "Đã nhập",
    totalLessons: 140,
  },
  {
    id: "PPCT003",
    code: "PPCT-2025-2026-K7-TOAN",
    year: "2025 - 2026",
    grade: "Khối 7",
    subject: "Toán",
    file: "PPCT Toán 7 - 2025-2026.pdf",
    importedAt: "20/08/2025 10:40",
    status: "Đã nhập",
    totalLessons: 140,
  },
];

const DETAILS: Record<string, PpctDetail[]> = {
  PPCT001: [
    { no: 1, semester: "Học kỳ I", content: "Tập hợp. Phần tử của tập hợp" },
    { no: 2, semester: "Học kỳ I", content: "Phép cộng và phép trừ số hữu tỉ" },
    { no: 3, semester: "Học kỳ I", content: "Lũy thừa với số mũ tự nhiên" },
    { no: 4, semester: "Học kỳ I", content: "Số vô tỉ. Căn bậc hai số học" },
    { no: 71, semester: "Học kỳ II", content: "Quan hệ giữa các yếu tố trong tam giác" },
    { no: 72, semester: "Học kỳ II", content: "Đại lượng tỉ lệ và ứng dụng" },
    { no: 73, semester: "Học kỳ II", content: "Ôn tập cuối năm" },
  ],
  PPCT002: [
    { no: 1, semester: "Học kỳ I", content: "Truyện ngắn và đặc điểm thể loại" },
    { no: 2, semester: "Học kỳ I", content: "Thực hành tiếng Việt" },
    { no: 70, semester: "Học kỳ II", content: "Nghị luận xã hội" },
    { no: 71, semester: "Học kỳ II", content: "Ôn tập cuối năm" },
  ],
  PPCT003: [
    { no: 1, semester: "Học kỳ I", content: "Ôn tập số hữu tỉ" },
    { no: 2, semester: "Học kỳ I", content: "Số thực" },
    { no: 71, semester: "Học kỳ II", content: "Biểu thức đại số" },
    { no: 72, semester: "Học kỳ II", content: "Ôn tập cuối năm" },
  ],
};

const YEAR_OPTIONS = Array.from({ length: 9 }, (_, index) => {
  const start = new Date().getFullYear() - 5 + index;
  return `${start} - ${start + 1}`;
});
const GRADE_OPTIONS = ["Khối 6", "Khối 7", "Khối 8", "Khối 9"];

export const Route = createFileRoute("/_app/day-hoc/ppct")({
  head: () => ({
    meta: [
      { title: "PPCT — Sổ đầu bài THCS Khương Mai" },
      { name: "description", content: "Danh sách và nhập dữ liệu phân phối chương trình theo năm học, khối và môn học." },
    ],
  }),
  component: PpctPage,
});

function PpctPage() {
  const { can, setPpctUploaded } = useApp();
  const [datasets, setDatasets] = useState<PpctDataset[]>(INITIAL_DATASETS);
  const [yearFilter, setYearFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [importOpen, setImportOpen] = useState(false);
  const [selected, setSelected] = useState<PpctDataset | null>(null);
  const [importYear, setImportYear] = useState(NAM_HOC);
  const [importGrade, setImportGrade] = useState("Khối 6");
  const [importSubject, setImportSubject] = useState(SUBJECTS[0]?.name ?? "Toán");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [validated, setValidated] = useState(false);

  const filtered = useMemo(
    () =>
      datasets.filter((row) => {
        if (yearFilter !== "all" && row.year !== yearFilter) return false;
        if (gradeFilter !== "all" && row.grade !== gradeFilter) return false;
        if (subjectFilter !== "all" && row.subject !== subjectFilter) return false;
        return `${row.code} ${row.subject} ${row.grade} ${row.year} ${row.file}`.toLowerCase().includes(query.toLowerCase());
      }),
    [datasets, yearFilter, gradeFilter, subjectFilter, query],
  );

  if (!can("ppct.upload")) {
    return (
      <div>
        <PageHeader title="PPCT" crumbs={[{ label: "Quản lý danh mục và dữ liệu dạy học" }, { label: "PPCT" }]} />
        <NoPermissionState message="Chỉ BGH được phép nhập PPCT." />
      </div>
    );
  }

  const openImport = () => {
    setImportYear(NAM_HOC);
    setImportGrade("Khối 6");
    setImportSubject(SUBJECTS[0]?.name ?? "Toán");
    setUploadedFile(null);
    setValidated(false);
    setImportOpen(true);
  };

  const validateFile = () => {
    if (!uploadedFile) {
      toast.error("Vui lòng tải tệp PPCT trước khi kiểm tra.");
      return;
    }
    setValidated(true);
    toast.success("Đã nhận diện và chuẩn hóa cấu trúc PPCT.");
  };

  const saveImport = () => {
    if (!uploadedFile || !validated) {
      toast.error("Vui lòng tải và kiểm tra tệp PPCT trước khi lưu.");
      return;
    }

    const duplicate = datasets.some(
      (d) => d.year === importYear && d.grade === importGrade && d.subject === importSubject,
    );
    if (duplicate) {
      toast.error("PPCT của năm học, khối và môn học đã tồn tại. Hãy xem dữ liệu đã nhập thay vì nhập trùng.");
      return;
    }

    const id = `PPCT${String(datasets.length + 1).padStart(3, "0")}`;
    const created: PpctDataset = {
      id,
      code: `PPCT-${importYear.replace(" - ", "-")}-${importGrade.replace("Khối ", "K")}-${importSubject.toUpperCase().replace(/\s+/g, "")}`,
      year: importYear,
      grade: importGrade,
      subject: importSubject,
      file: uploadedFile,
      importedAt: new Date().toLocaleString("vi-VN", { hour12: false }),
      status: "Đã nhập",
      totalLessons: 140,
    };
    setDatasets((prev) => [created, ...prev]);
    setPpctUploaded(importYear === NAM_HOC);
    setImportOpen(false);
    setSelected(created);
    toast.success("Đã lưu PPCT và hình thành dữ liệu chi tiết.");
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="PPCT - Phân phối chương trình"
        description="Mỗi tệp PPCT thuộc một môn học và một khối của một năm học, áp dụng cho cả Học kỳ I và Học kỳ II."
        crumbs={[{ label: "Quản lý danh mục và dữ liệu dạy học" }, { label: "PPCT" }]}
        actions={
          <Button onClick={openImport}>
            <Plus className="size-4" />
            Nhập PPCT
          </Button>
        }
      />

      <TableCard>
        <div className="border-b border-border p-4">
          <h2 className="text-base font-semibold">Danh sách dữ liệu PPCT đã nhập</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Mỗi dòng tương ứng với một tệp PPCT đã được hệ thống tiếp nhận và chuẩn hóa.
          </p>
        </div>
        <TableToolbar>
          <SearchBar value={query} onChange={setQuery} placeholder="Tìm theo mã PPCT, môn, khối, năm học, tên tệp..." />
          <FilterField label="Năm học">
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả năm học</SelectItem>
                {YEAR_OPTIONS.map((year) => <SelectItem key={year} value={year}>{year}</SelectItem>)}
              </SelectContent>
            </Select>
          </FilterField>
          <FilterField label="Khối">
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả khối</SelectItem>
                {GRADE_OPTIONS.map((grade) => <SelectItem key={grade} value={grade}>{grade}</SelectItem>)}
              </SelectContent>
            </Select>
          </FilterField>
          <FilterField label="Môn học">
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả môn học</SelectItem>
                {SUBJECTS.map((s) => <SelectItem key={s.code} value={s.name}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </FilterField>
        </TableToolbar>

        {filtered.length === 0 ? (
          <EmptyState title="Chưa có dữ liệu PPCT phù hợp" description="Hãy điều chỉnh bộ lọc hoặc nhập một tệp PPCT mới." />
        ) : (
          <ScrollTable>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã PPCT</TableHead>
                  <TableHead>Năm học</TableHead>
                  <TableHead>Khối</TableHead>
                  <TableHead>Môn học</TableHead>
                  <TableHead>Phạm vi</TableHead>
                  <TableHead>Tệp nguồn</TableHead>
                  <TableHead>Số tiết</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-mono text-xs">{row.code}</TableCell>
                    <TableCell>{row.year}</TableCell>
                    <TableCell>{row.grade}</TableCell>
                    <TableCell className="font-medium">{row.subject}</TableCell>
                    <TableCell>Cả năm (HK I + HK II)</TableCell>
                    <TableCell className="max-w-[260px]"><div className="flex items-center gap-2"><FileSpreadsheet className="size-4 shrink-0 text-success" /><span className="truncate">{row.file}</span></div></TableCell>
                    <TableCell>{row.totalLessons}</TableCell>
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
            <DialogTitle>Nhập PPCT</DialogTitle>
            <DialogDescription>Chọn năm học, khối, môn học và tải tệp PPCT lên. Một tệp áp dụng cho cả hai học kỳ.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Năm học</Label>
              <Select value={importYear} onValueChange={setImportYear}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{YEAR_OPTIONS.map((year) => <SelectItem key={year} value={year}>{year}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="space-y-1.5">
              <Label>Khối lớp</Label>
              <Select value={importGrade} onValueChange={setImportGrade}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{GRADE_OPTIONS.map((grade) => <SelectItem key={grade} value={grade}>{grade}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="space-y-1.5">
              <Label>Môn học</Label>
              <Select value={importSubject} onValueChange={setImportSubject}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{SUBJECTS.map((s) => <SelectItem key={s.code} value={s.name}>{s.name}</SelectItem>)}</SelectContent></Select>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
            <span className="font-medium">Phạm vi PPCT:</span> Cả năm học, gồm Học kỳ I và Học kỳ II.
          </div>
          <div className="space-y-3">
            <Label>Tệp PPCT</Label>
            <FileUpload
              suggestedName={`PPCT_${importSubject.replace(/\s+/g, "_")}_${importGrade.replace("Khối ", "K")}_${importYear.replace(/\s/g, "")}.pdf`}
              onUploaded={(name) => { setUploadedFile(name); setValidated(false); }}
            />
            {uploadedFile && validated && (
              <ValidationResult total={140} valid={140} errors={0} warnings={0} issues={[]} />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportOpen(false)}>Hủy</Button>
            <Button variant="outline" disabled={!uploadedFile} onClick={validateFile}><Upload className="size-4" />Nhận diện & kiểm tra</Button>
            <Button disabled={!uploadedFile || !validated} onClick={saveImport}><ClipboardList className="size-4" />Lưu PPCT</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>{selected?.subject} · {selected?.grade} · {selected?.year}</DialogTitle>
            <DialogDescription>
              Chi tiết dữ liệu đã được hệ thống chuẩn hóa từ tệp {selected?.file}. Phạm vi: cả năm học.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-4">
            <div><p className="text-xs text-muted-foreground">Mã PPCT</p><p className="font-medium">{selected?.code}</p></div>
            <div><p className="text-xs text-muted-foreground">Số tiết</p><p className="font-medium">{selected?.totalLessons}</p></div>
            <div><p className="text-xs text-muted-foreground">Ngày nhập</p><p className="font-medium">{selected?.importedAt}</p></div>
            <div><p className="text-xs text-muted-foreground">Trạng thái</p><Pill tone="success">{selected?.status}</Pill></div>
          </div>
          <ScrollTable>
            <Table>
              <TableHeader><TableRow><TableHead>STT tiết</TableHead><TableHead>Học kỳ</TableHead><TableHead>Nội dung bài dạy</TableHead></TableRow></TableHeader>
              <TableBody>
                {(selected ? DETAILS[selected.id] ?? [] : []).map((d) => (
                  <TableRow key={d.no}><TableCell>Tiết {d.no}</TableCell><TableCell>{d.semester}</TableCell><TableCell>{d.content}</TableCell></TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollTable>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col gap-3 rounded-xl border border-primary/25 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm">Dữ liệu PPCT được dùng làm nguồn xác định nội dung và số thứ tự tiết khi hình thành dữ liệu tiết dạy.</p>
        <Button asChild size="sm"><Link to="/day-hoc/tkb">Tới nhập TKB<ArrowRight className="size-4" /></Link></Button>
      </div>
    </div>
  );
}
