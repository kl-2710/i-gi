import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Save } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { FilterField, ScrollTable, SearchBar, TableCard, TableToolbar } from "@/components/common/DataTable";
import { EmptyState, NoPermissionState } from "@/components/common/States";
import { Pill } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/lib/app-state";
import { CLASSES, NAM_HOC } from "@/lib/mock-data";

type ClassRow = {
  code: string;
  name: string;
  grade: string;
  gvcn: string;
  year: string;
  active: boolean;
};

export const Route = createFileRoute("/_app/day-hoc/lop")({
  head: () => ({
    meta: [
      { title: "Danh sách lớp — Sổ đầu bài THCS Khương Mai" },
      { name: "description", content: "Danh sách lớp học, khối và giáo viên chủ nhiệm theo năm học." },
      { property: "og:title", content: "Danh sách lớp" },
      { property: "og:description", content: "Quản lý lớp học của Trường THCS Khương Mai." },
    ],
  }),
  component: ClassPage,
});

const HISTORICAL_ROWS: ClassRow[] = [
  ...CLASSES.map((c) => ({
    code: c.code,
    name: c.name,
    grade: c.grade,
    gvcn: c.gvcn,
    year: "2025 - 2026",
    active: false,
  })),
  ...CLASSES.map((c) => ({
    code: c.code.replace(/^L/, "H"),
    name: c.name,
    grade: c.grade,
    gvcn: c.gvcn,
    year: "2024 - 2025",
    active: false,
  })),
];

const INITIAL_ROWS: ClassRow[] = CLASSES.map((c) => ({
  code: c.code,
  name: c.name,
  grade: c.grade,
  gvcn: c.gvcn,
  year: NAM_HOC,
  active: true,
}));

const GRADE_OPTIONS = ["Khối 6", "Khối 7", "Khối 8", "Khối 9"];

function ClassPage() {
  const { can } = useApp();
  const [rows, setRows] = useState<ClassRow[]>(INITIAL_ROWS);
  const [q, setQ] = useState("");
  const [grade, setGrade] = useState("all");
  const [selectedYear, setSelectedYear] = useState(NAM_HOC);
  const [open, setOpen] = useState(false);
  const [className, setClassName] = useState("");
  const [classGrade, setClassGrade] = useState("Khối 6");

  const allRows = useMemo(() => [...INITIAL_ROWS, ...HISTORICAL_ROWS], []);
  const availableYears = useMemo(
    () => Array.from(new Set(allRows.map((r) => r.year))).sort((a, b) => b.localeCompare(a)),
    [allRows],
  );

  const availableClassNames = useMemo(
    () => rows.map((r) => r.name.toLowerCase()),
    [rows],
  );

  if (!can("setup.view")) {
    return (
      <div>
        <PageHeader title="Lớp" crumbs={[{ label: "Quản lý danh mục và dữ liệu dạy học" }, { label: "Lớp" }]} />
        <NoPermissionState />
      </div>
    );
  }

  const filteredRows = rows.filter(
    (c) =>
      c.year === selectedYear &&
      (grade === "all" || c.grade === grade) &&
      `${c.code} ${c.name} ${c.gvcn}`.toLowerCase().includes(q.toLowerCase()),
  );

  const resetForm = () => {
    setClassName("");
    setClassGrade("Khối 6");
  };

  const openAdd = () => {
    resetForm();
    setOpen(true);
  };

  const saveClass = () => {
    const name = className.trim();
    const gradeNumber = classGrade.replace(/\D/g, "");
    const normalizedName = name.replace(/\s+/g, "").toUpperCase();
    const code = normalizedName.startsWith(gradeNumber)
      ? `L${normalizedName}`
      : `L${gradeNumber}${normalizedName}`;

    if (!name || !classGrade) {
      toast.error("Thông tin không hợp lệ");
      return;
    }

    if (availableClassNames.includes(name.toLowerCase()) || rows.some((r) => r.code.toLowerCase() === code.toLowerCase())) {
      toast.error("Thông tin không hợp lệ");
      return;
    }

    setRows((prev) => [
      ...prev,
      {
        code,
        name,
        grade: classGrade,
        // GVCN được hình thành từ dữ liệu TKB, không nhập lại tại biểu mẫu thêm lớp.
        gvcn: "Chưa xác định",
        year: NAM_HOC,
        active: true,
      },
    ]);
    setOpen(false);
    toast.success(`Đã thêm lớp ${name} vào năm học ${NAM_HOC}.`);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Lớp"
        description={`Danh sách lớp học của năm học ${selectedYear}.`}
        crumbs={[{ label: "Quản lý danh mục và dữ liệu dạy học" }, { label: "Lớp" }]}
        actions={
          can("setup.manage") && selectedYear === NAM_HOC ? (
            <Button onClick={openAdd}>
              <Plus className="size-4" />
              Thêm lớp
            </Button>
          ) : null
        }
      />

      <TableCard>
        <TableToolbar>
          <SearchBar value={q} onChange={setQ} placeholder="Tìm theo mã lớp, tên lớp, GVCN..." />
          <FilterField label="Năm học">
            <Select value={selectedYear} onValueChange={(v) => { setSelectedYear(v); setGrade("all"); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {availableYears.map((y) => (
                  <SelectItem key={y} value={y}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>
          <FilterField label="Khối">
            <Select value={grade} onValueChange={setGrade}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả khối</SelectItem>
                {GRADE_OPTIONS.map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>
        </TableToolbar>

        {filteredRows.length === 0 ? (
          <EmptyState />
        ) : (
          <ScrollTable>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã lớp</TableHead>
                  <TableHead>Tên lớp</TableHead>
                  <TableHead>Khối</TableHead>
                  <TableHead>Giáo viên chủ nhiệm</TableHead>
                  <TableHead>Năm học</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRows.map((c) => (
                  <TableRow key={c.code}>
                    <TableCell className="font-mono text-xs">{c.code}</TableCell>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.grade}</TableCell>
                    <TableCell className="whitespace-nowrap">{c.gvcn}</TableCell>
                    <TableCell>{c.year}</TableCell>
                    <TableCell><Pill tone={c.active ? "success" : "danger"}>{c.active ? "Đang hoạt động" : "Ngừng hoạt động"}</Pill></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollTable>
        )}
      </TableCard>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Thêm lớp</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="class-name">Tên lớp</Label>
              <Input id="class-name" value={className} onChange={(e) => setClassName(e.target.value)} placeholder="Ví dụ: 6A3" maxLength={20} />
            </div>

            <div className="space-y-1.5">
              <Label>Khối</Label>
              <Select value={classGrade} onValueChange={setClassGrade}>
                <SelectTrigger><SelectValue placeholder="Chọn khối" /></SelectTrigger>
                <SelectContent>
                  {GRADE_OPTIONS.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Năm học</Label>
              <Input value={NAM_HOC} disabled />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Hủy</Button>
            <Button onClick={saveClass}>
              <Save className="size-4" />
              Lưu lớp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
