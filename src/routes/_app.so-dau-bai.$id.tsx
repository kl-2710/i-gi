import { useState } from "react";
import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { CheckCircle2, Cpu, Lock, Save, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge, Pill } from "@/components/common/StatusBadge";
import { AuditTimeline } from "@/components/common/AuditTimeline";
import { EmptyState } from "@/components/common/States";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/_app/so-dau-bai/$id")({
  head: () => ({
    meta: [
      { title: "Chi tiết Sổ đầu bài — THCS Khương Mai" },
      { name: "description", content: "Chi tiết dữ liệu tiết dạy được hình thành từ TKB và PPCT và các thông tin do GVBM cập nhật." },
    ],
  }),
  component: BookDetailPage,
});

function BookDetailPage() {
  const { id } = useParams({ from: "/_app/so-dau-bai/$id" });
  const { books, audit, can, user, role, updateBook, isGvcnWeekConfirmed } = useApp();
  const book = books.find((b) => b.id === id);
  const [comment, setComment] = useState(book?.comment ?? "");
  const [score, setScore] = useState(book?.score?.toString() ?? "");
  const [rank, setRank] = useState(book?.rank ?? "");
  const [absentCount, setAbsentCount] = useState(book?.absentCount?.toString() ?? "");
  const [confirmGvbm, setConfirmGvbm] = useState(false);

  if (!book) {
    return (
      <div>
        <PageHeader title="Chi tiết Sổ đầu bài" crumbs={[{ label: "Quản lý Sổ đầu bài", to: "/so-dau-bai" }, { label: "Chi tiết" }]} />
        <EmptyState title="Không tìm thấy bản ghi" description="Bản ghi Sổ đầu bài không tồn tại hoặc ngoài phạm vi truy cập của bạn." />
      </div>
    );
  }

  const locked = book.status === "da_khoa";
  const confirmedGvbm = !!book.gvbmConfirm;
  const weeklyConfirmed = isGvcnWeekConfirmed(book.className, book.weekNumber);
  const editable = can("book.edit") && !locked && !confirmedGvbm && book.teacherId === user?.teacherId;
  const missing: string[] = [];
  if (absentCount === "") missing.push("Số học sinh vắng");
  if (score === "") missing.push("Điểm tiết học");
  if (!rank) missing.push("Xếp loại");
  if (!comment.trim()) missing.push("Nhận xét tiết học");

  const entries = audit.filter((a) => a.recordCode === book.code);

  return (
    <div className="space-y-5">
      <PageHeader
        title={`Sổ đầu bài ${book.className} · Tiết ${book.period} · ${book.subject}`}
        description={`${book.weekday}, ${book.date} · Giáo viên dạy: ${book.teacher}`}
        crumbs={[{ label: "Quản lý Sổ đầu bài", to: "/so-dau-bai" }, { label: book.code }]}
        actions={<StatusBadge status={book.status} />}
      />

      {locked && (
        <div className="flex items-center gap-2 rounded-xl border border-navy/25 bg-navy/5 p-4 text-sm">
          <Lock className="size-4 text-navy" />
          Sổ đầu bài đã khóa, không thể chỉnh sửa.
          {book.lockedBy && <span className="text-muted-foreground">(Khóa bởi {book.lockedBy.by} · {book.lockedBy.at})</span>}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <section className="rounded-xl border border-border bg-card p-4 shadow-card sm:p-6">
            <div className="mb-3 flex items-center gap-2">
              <Cpu className="size-4 text-primary" />
              <h2 className="text-base font-semibold">Thông tin do hệ thống hình thành</h2>
              <Pill tone="info">Nguồn: TKB + PPCT</Pill>
            </div>
            <dl className="grid gap-3 text-sm sm:grid-cols-3">
              <div><dt className="text-muted-foreground">Ngày</dt><dd className="font-medium">{book.date}</dd></div>
              <div><dt className="text-muted-foreground">Thứ</dt><dd className="font-medium">{book.weekday}</dd></div>
              <div><dt className="text-muted-foreground">Tiết</dt><dd className="font-medium">Tiết {book.period}</dd></div>
              <div><dt className="text-muted-foreground">Lớp</dt><dd className="font-medium">{book.className}</dd></div>
              <div><dt className="text-muted-foreground">Môn</dt><dd className="font-medium">{book.subject}</dd></div>
              <div><dt className="text-muted-foreground">Giáo viên dạy</dt><dd className="font-medium">{book.teacher}</dd></div>
              <div><dt className="text-muted-foreground">Tiết PPCT</dt><dd className="font-medium">Tiết {book.ppctNo}</dd></div>
              <div className="sm:col-span-3"><dt className="text-muted-foreground">Nội dung bài dạy từ PPCT</dt><dd className="mt-1 rounded-md border border-info/30 bg-info/5 px-3 py-2">{book.plannedContent}</dd></div>
              <div><dt className="text-muted-foreground">Năm học</dt><dd className="font-medium">{book.year}</dd></div>
              <div><dt className="text-muted-foreground">Học kỳ</dt><dd className="font-medium">{book.semester}</dd></div>
            </dl>
          </section>

          <section className="rounded-xl border border-border bg-card p-4 shadow-card sm:p-6">
            <div className="mb-3 flex items-center gap-2">
              <UserCheck className="size-4 text-success" />
              <h2 className="text-base font-semibold">Thông tin GVBM cập nhật</h2>
              <Pill tone="info">Thực hiện theo từng tiết</Pill>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Số học sinh vắng</Label>
                <Input type="number" min={0} value={absentCount} disabled={!editable} onChange={(e) => setAbsentCount(e.target.value)} placeholder="Nhập số học sinh vắng" />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label>Điểm tiết học</Label>
                  <Input type="number" min={0} max={10} step={0.5} value={score} disabled={!editable} onChange={(e) => setScore(e.target.value)} placeholder="0 - 10" />
                </div>
                <div className="space-y-1.5">
                  <Label>Xếp loại</Label>
                  <Select value={rank} onValueChange={(v) => setRank(v as typeof rank)} disabled={!editable}>
                    <SelectTrigger><SelectValue placeholder="Chọn xếp loại" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A - Tốt</SelectItem>
                      <SelectItem value="B">B - Khá</SelectItem>
                      <SelectItem value="C">C - Trung bình</SelectItem>
                      <SelectItem value="D">D - Yếu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Nhận xét tiết học</Label>
                <Textarea rows={3} maxLength={500} value={comment} disabled={!editable} onChange={(e) => setComment(e.target.value)} placeholder="Nhập nhận xét tiết học" />
              </div>

              {editable && (
                <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      updateBook(
                        book.id,
                        {
                          absentCount: absentCount === "" ? null : Number(absentCount),
                          comment,
                          score: score === "" ? null : Number(score),
                          rank: (rank || null) as typeof book.rank,
                        },
                        "Cập nhật thông tin tiết dạy",
                        "da_cap_nhat",
                      );
                      toast.success("Đã lưu thông tin tiết dạy");
                    }}
                  >
                    <Save className="size-4" />Lưu
                  </Button>
                  <Button onClick={() => setConfirmGvbm(true)} disabled={missing.length > 0}>
                    <CheckCircle2 className="size-4" />Xác nhận tiết học
                  </Button>
                  {missing.length > 0 && (
                    <p className="w-full text-xs text-destructive">Còn thiếu: {missing.join(", ")}. Vui lòng hoàn thiện trước khi xác nhận.</p>
                  )}
                </div>
              )}

              {role === "GVCN" && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
                  <p className="font-medium">Xác nhận GVCN theo tuần</p>
                  <p className="mt-1 text-muted-foreground">
                    {weeklyConfirmed
                      ? `Tuần ${book.weekNumber} của lớp ${book.className} đã được xác nhận.`
                      : `GVCN không xác nhận tại từng tiết. Hãy quay lại danh sách để xác nhận toàn bộ tuần ${book.weekNumber} khi tất cả tiết đã được GVBM xác nhận.`}
                  </p>
                  {!weeklyConfirmed && <Link className="mt-2 inline-block text-primary hover:underline" to="/so-dau-bai">Tới xác nhận theo tuần</Link>}
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-xl border border-border bg-card p-4 shadow-card">
            <h2 className="mb-3 text-base font-semibold">Trạng thái xác nhận</h2>
            <ul className="space-y-2 text-sm">
              <li>GVBM: {book.gvbmConfirm ? <span className="text-success">Đã xác nhận bởi {book.gvbmConfirm.by} · {book.gvbmConfirm.at}</span> : <span className="text-muted-foreground">Chưa xác nhận</span>}</li>
              <li>GVCN: {weeklyConfirmed ? <span className="text-success">Đã xác nhận theo tuần ${book.weekNumber}</span> : <span className="text-muted-foreground">Chưa xác nhận tuần ${book.weekNumber}</span>}</li>
              <li>BGH: {book.status === "xac_nhan_bgh" ? <span className="text-success">Đã xác nhận</span> : <span className="text-muted-foreground">Chưa xác nhận</span>}</li>
              <li>Khóa: {book.status === "da_khoa" ? <span className="text-success">Đã khóa</span> : <span className="text-muted-foreground">Chưa khóa</span>}</li>
            </ul>
            {book.fixReason && (
              <p className="mt-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                Yêu cầu chỉnh sửa: {book.fixReason}
              </p>
            )}
          </section>

          <section className="rounded-xl border border-border bg-card p-4 shadow-card">
            <h2 className="mb-3 text-base font-semibold">Lịch sử thao tác</h2>
            <AuditTimeline entries={entries} />
          </section>
        </div>
      </div>

      <ActionDialog
        open={confirmGvbm}
        onOpenChange={setConfirmGvbm}
        title="Xác nhận tiết học"
        description="Sau khi xác nhận, GVBM không thể chỉnh sửa trực tiếp thông tin tiết học."
        confirmLabel="Xác nhận GVBM"
        onConfirm={() => {
          const now = new Date().toLocaleString("vi-VN", { hour12: false });
          updateBook(
            book.id,
            {
              absentCount: absentCount === "" ? null : Number(absentCount),
              comment,
              score: score === "" ? null : Number(score),
              rank: (rank || null) as typeof book.rank,
              gvbmConfirm: { by: user?.fullName ?? "", at: now },
            },
            "Xác nhận GVBM",
            "xac_nhan_gvbm",
          );
          toast.success("Đã xác nhận tiết học");
        }}
      />
    </div>
  );
}
