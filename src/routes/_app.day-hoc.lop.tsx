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
  const [open, setOpen] = useState(false);
  const [classCode, setClassCode] = useState("");
  const [className, setClassName] = useState("");
  const [classGrade, setClassGrade] = useState("Khối 6");

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
      (grade === "all" || c.grade === grade) &&
      `${c.code} ${c.name} ${c.gvcn}`.toLowerCase().includes(q.toLowerCase()),
  );

  const resetForm = () => {
    setClassCode("");
    setClassName("");
    setClassGrade("Khối 6");
  };

  const openAdd = () => {
    resetForm();
    setOpen(true);
  };

  const saveClass = () => {
    const code = classCode.trim().toUpperCase();
    const name = className.trim();

    if (!code || !name || !classGrade) {
      toast.error("Vui lòng nhập đầy đủ mã lớp, tên lớp và khối.");
      return;
    }

    if (!/^L(?:6|7|8|9)[A-Z0-9]{1,4}$/.test(code)) {
      toast.error("Mã lớp không đúng định dạng mẫu, ví dụ L6A1 hoặc L9A2.");
      return;
    }

    if (availableClassNames.includes(name.toLowerCase()) || rows.some((r) => r.code.toLowerCase() === code.toLowerCase())) {
      toast.error("Mã lớp hoặc tên lớp đã tồn tại trong năm học hiện tại.");
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
        description="Danh sách lớp học trong năm học hiện hành."
        crumbs={[{ label: "Quản lý danh mục và dữ liệu dạy học" }, { label: "Lớp" }]}
        actions={
          can("setup.manage") ? (
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
            <DialogDescription>
              Tạo lớp học thuộc năm học hiện hành. GVCN không nhập tại đây; thông tin GVCN được hình thành từ dữ liệu TKB theo quy ước của nhà trường.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="class-code">Mã lớp</Label>
              <Input id="class-code" value={classCode} onChange={(e) => setClassCode(e.target.value)} placeholder="Ví dụ: L6A3" maxLength={10} />
              <p className="text-xs text-muted-foreground">Mã lớp phải là duy nhất trong năm học.</p>
            </div>

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

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
            <p className="font-medium">GVCN</p>
            <p className="mt-1 text-muted-foreground">
              Hệ thống không yêu cầu nhập GVCN khi thêm lớp. Thông tin GVCN được lấy theo dữ liệu TKB.
            </p>
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
