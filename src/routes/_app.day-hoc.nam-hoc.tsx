import { createFileRoute } from "@tanstack/react-router";
import { CalendarRange } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { ScrollTable, TableCard } from "@/components/common/DataTable";
import { Pill } from "@/components/common/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NoPermissionState } from "@/components/common/States";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/_app/day-hoc/nam-hoc")({
  head: () => ({
    meta: [
      { title: "Năm học / Học kỳ — Sổ đầu bài THCS Khương Mai" },
      { name: "description", content: "Thiết lập năm học và học kỳ làm ngữ cảnh cho PPCT, TKB và sổ đầu bài." },
      { property: "og:title", content: "Năm học / Học kỳ" },
      { property: "og:description", content: "Danh sách năm học và học kỳ của nhà trường." },
    ],
  }),
  component: YearPage,
});

const ROWS = [
  { year: "2026 - 2027", term: "Học kỳ I", from: "05/09/2026", to: "15/01/2027", status: "Đang áp dụng" },
  { year: "2026 - 2027", term: "Học kỳ II", from: "18/01/2027", to: "31/05/2027", status: "Chưa bắt đầu" },
  { year: "2025 - 2026", term: "Học kỳ I", from: "05/09/2025", to: "15/01/2026", status: "Đã kết thúc" },
  { year: "2025 - 2026", term: "Học kỳ II", from: "19/01/2026", to: "31/05/2026", status: "Đã kết thúc" },
];

function YearPage() {
  const { can } = useApp();
  if (!can("setup.view")) {
    return (
      <div>
        <PageHeader title="Năm học / Học kỳ" crumbs={[{ label: "Thiết lập dạy học" }, { label: "Năm học / Học kỳ" }]} />
        <NoPermissionState />
      </div>
    );
  }
  return (
    <div>
      <PageHeader
        title="Năm học / Học kỳ"
        description="Năm học và học kỳ là ngữ cảnh nền tảng cho PPCT, TKB và toàn bộ sổ đầu bài."
        crumbs={[{ label: "Thiết lập dạy học" }, { label: "Năm học / Học kỳ" }]}
      />
      <div className="mb-4 flex items-center gap-3 rounded-xl border border-primary/25 bg-primary/5 p-4">
        <CalendarRange className="size-5 text-primary" />
        <p className="text-sm text-foreground">
          Ngữ cảnh đang áp dụng: <strong>Năm học 2026 - 2027 · Học kỳ I</strong>
        </p>
      </div>
      <TableCard>
        <ScrollTable>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Năm học</TableHead>
                <TableHead>Học kỳ</TableHead>
                <TableHead>Ngày bắt đầu</TableHead>
                <TableHead>Ngày kết thúc</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ROWS.map((r) => (
                <TableRow key={r.year + r.term}>
                  <TableCell className="font-medium">{r.year}</TableCell>
                  <TableCell>{r.term}</TableCell>
                  <TableCell>{r.from}</TableCell>
                  <TableCell>{r.to}</TableCell>
                  <TableCell>
                    <Pill tone={r.status === "Đang áp dụng" ? "success" : r.status === "Chưa bắt đầu" ? "info" : "neutral"}>
                      {r.status}
                    </Pill>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollTable>
      </TableCard>
    </div>
  );
}
