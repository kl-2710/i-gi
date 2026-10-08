import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, FileWarning, Layers, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { ScrollTable, TableCard } from "@/components/common/DataTable";
import { NoPermissionState } from "@/components/common/States";
import { Pill } from "@/components/common/StatusBadge";
import { DashboardCard } from "@/components/common/DashboardCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [schoolYear, setSchoolYear] = useState("2026 - 2027");
  const [semester, setSemester] = useState("Học kỳ I");
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

  const isHistorical = schoolYear !== "2026 - 2027";
  const isCurrentSemesterGenerated = schoolYear === "2026 - 2027" && semester === "Học kỳ I" && hasRun;
  const historicalGenerated = isHistorical;
  const showGenerated = historicalGenerated || isCurrentSemesterGenerated;
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
        crumbs={[
          { label: "Quản lý danh mục và dữ liệu dạy học" },
          { label: "Hình thành dữ liệu tiết dạy" },
        ]}
      />

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Năm học</Label>
            <Select value={schoolYear} onValueChange={(v) => { setSchoolYear(v); setSemester("Học kỳ I"); setHasRun(v !== "2026 - 2027"); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2026 - 2027">2026 - 2027</SelectItem>
                <SelectItem value="2025 - 2026">2025 - 2026</SelectItem>
                <SelectItem value="2024 - 2025">2024 - 2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Học kỳ</Label>
            <Select value={semester} onValueChange={(v) => setSemester(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Học kỳ I">Học kỳ I</SelectItem>
                <SelectItem value="Học kỳ II">Học kỳ II</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <DashboardCard
          label="PPCT"
          value={showGenerated || ready ? "Đã nhập" : "Chưa nhập"}
          icon={CheckCircle2}
          tone={showGenerated || ready ? "success" : "warning"}
        />
        <DashboardCard
          label="TKB"
          value={showGenerated || ready ? "Đã nhập" : "Chưa nhập"}
          icon={CheckCircle2}
          tone={showGenerated || ready ? "success" : "warning"}
        />
      </div>

      {!showGenerated ? (
        <>
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
                <p className="font-semibold">Đã hình thành dữ liệu tiết dạy</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {schoolYear} · {semester}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <DashboardCard label="Số tiết dạy đã hình thành" value={books.length} icon={Layers} tone="primary" />
            <DashboardCard label="PPCT" value="Đã nhập" icon={CheckCircle2} tone="success" />
            <DashboardCard label="TKB" value="Đã nhập" icon={CheckCircle2} tone="success" />
          </div>

          <TableCard>
            <div className="flex flex-col gap-2 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-base font-semibold">
                  <Sparkles className="size-4 text-primary" />
                  Dữ liệu tiết dạy đã hình thành
                </h2>
              </div>
              <Button variant="outline" size="sm" onClick={() => window.location.assign("/so-dau-bai")}>
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
                      <TableCell className="whitespace-nowrap">{isHistorical ? b.date.replace("/09/2026", schoolYear.slice(0,4) + "-09") : b.date}</TableCell>
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
    </div>
  );
}
