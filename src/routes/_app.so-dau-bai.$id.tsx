import { useMemo, useState } from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { CheckCircle2, Cpu, FileUp, Lock, Paperclip, Save, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge, Pill } from "@/components/common/StatusBadge";
import { ActionDialog } from "@/components/common/ActionDialog";
import { EmptyState } from "@/components/common/States";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/_app/so-dau-bai/$id")({
  head: () => ({
    meta: [
      { title: "Chi tiết Sổ đầu bài — THCS Khương Mai" },
      { name: "description", content: "Chi tiết tiết học và quy trình xác nhận Sổ đầu bài." },
    ],
  }),
  component: BookDetailPage,
});

function BookDetailPage() {
  const { id } = useParams({ from: "/_app/so-dau-bai/$id" });
  const {
    books, can, user, role, updateBook, confirmWeekGvcn, confirmClassBgh, toggleClassLock,
  } = useApp();
  const book = books.find((b) => b.id === id);
  const [actual, setActual] = useState(book?.actualContent ?? "");
  const [comment, setComment] = useState(book?.comment ?? "");
  const [score, setScore] = useState(book?.score?.toString() ?? "");
  const [rank, setRank] = useState(book?.rank ?? "");
  const [absentNames, setAbsentNames] = useState(book?.absents.map((a) => a.name).join(", ") ?? "");
  const [confirmGvbm, setConfirmGvbm] = useState(false);

  if (!book) {
    return (
      <div>
        <PageHeader title="Chi tiết Sổ đầu bài" crumbs={[{ label: "Quản lý Sổ đầu bài", to: "/so-dau-bai" }, { label: "Chi tiết" }]} />
        <EmptyState title="Không tìm thấy bản ghi" description="Bản ghi không tồn tại hoặc ngoài phạm vi truy cập." />
      </div>
    );
  }

  const locked = book.status === "da_khoa";
  const weekBooks = useMemo(
    () => books.filter((b) => b.className === book.className && b.week === book.week && b.year === book.year && b.semester === book.semester),
    [books, book.className, book.week, book.year, book.semester],
  );
  const allGvbmConfirmed = weekBooks.length > 0 && weekBooks.every((b) => !!b.gvbmConfirm);
  const classBooks = useMemo(
    () => books.filter((b) => b.className === book.className && b.year === book.year && b.semester === book.semester),
    [books, book.className, book.year, book.semester],
  );
  const allGvcnConfirmed = classBooks.length > 0 && classBooks.every((b) => !!b.gvcnConfirm);

  const canEdit = can("book.edit") && !locked && !book.gvbmConfirm && book.teacher === user?.fullName;
  const missing: string[] = [];
  if (!actual.trim()) missing.push("Nội dung thực tế");
  if (!score) missing.push("Điểm tiết học");
  if (!rank) missing.push("Xếp loại");

  const save = (nextStatus: "da_cap_nhat" | "xac_nhan_gvbm") => {
    const names = absentNames.split(",").map((name) => name.trim()).filter(Boolean);
    updateBook(
      book.id,
      {
        actualContent: actual,
        comment,
        score: score ? Number(score) : null,
        rank: (rank || null) as typeof book.rank,
        absents: names.map((name) => ({ name, reason: "Chưa cập nhật lý do" })),
      },
      nextStatus === "da_cap_nhat" ? "Cập nhật thông tin tiết học" : "Xác nhận Sổ đầu bài của GVBM",
      nextStatus,
    );
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title={`Sổ đầu bài ${book.className} · Tiết ${book.period} · ${book.subject}`}
        description={`${book.weekday}, ${book.date} · Tuần ${book.week} · Giáo viên: ${book.teacher}`}
        crumbs={[{ label: "Quản lý Sổ đầu bài", to: "/so-dau-bai" }, { label: book.code }]}
        actions={<StatusBadge status={book.status} />}
      />

      {locked && (
        <div className="flex items-center gap-2 rounded-xl border border-navy/25 bg-navy/5 p-4 text-sm">
          <Lock className="size-4 text-navy" />
          Sổ đầu bài đã khóa; không thể chỉnh sửa thông thường.
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <section className="rounded-xl border border-border bg-card p-4 shadow-card sm:p-6">
            <div className="mb-3 flex items-center gap-2">
              <Cpu className="size-4 text-primary" />
              <h2 className="text-base font-semibold">Thông tin hệ thống hình thành</h2>
              <Pill tone="info">Nguồn: PPCT + TKB</Pill>
            </div>
            <dl className="grid gap-3 text-sm sm:grid-cols-3">
              <div><dt className="text-muted-foreground">Ngày</dt><dd className="font-medium">{book.date}</dd></div>
              <div><dt className="text-muted-foreground">Thứ</dt><dd className="font-medium">{book.weekday}</dd></div>
              <div><dt className="text-muted-foreground">Tiết</dt><dd className="font-medium">Tiết {book.period}</dd></div>
              <div><dt className="text-muted-foreground">Lớp</dt><dd className="font-medium">{book.className}</dd></div>
              <div><dt className="text-muted-foreground">Môn</dt><dd className="font-medium">{book.subject}</dd></div>
              <div><dt className="text-muted-foreground">Giáo viên</dt><dd className="font-medium">{book.teacher}</dd></div>
              <div><dt className="text-muted-foreground">Tiết PPCT</dt><dd className="font-medium">PPCT {book.ppctNo}</dd></div>
              <div><dt className="text-muted-foreground">Năm học</dt><dd className="font-medium">{book.year}</dd></div>
              <div><dt className="text-muted-foreground">Học kỳ</dt><dd className="font-medium">{book.semester}</dd></div>
              <div className="sm:col-span-3"><dt className="text-muted-foreground">Nội dung theo PPCT</dt><dd className="mt-1 rounded-md border border-info/30 bg-info/5 px-3 py-2">{book.plannedContent}</dd></div>
            </dl>
          </section>

          <section className="rounded-xl border border-border bg-card p-4 shadow-card sm:p-6">
            <div className="mb-3 flex items-center gap-2">
              <UserCheck className="size-4 text-success" />
              <h2 className="text-base font-semibold">Thông tin thực tế của tiết học</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Nội dung thực tế</Label>
                <Textarea rows={3} maxLength={500} value={actual} disabled={!canEdit} onChange={(e) => setActual(e.target.value)} placeholder="Nhập nội dung thực tế đã dạy" />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label>Điểm tiết học</Label>
                  <Input type="number" min={0} max={10} step={1} value={score} disabled={!canEdit} onChange={(e) => setScore(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Xếp loại</Label>
                  <Select value={rank} onValueChange={setRank} disabled={!canEdit}>
                    <SelectTrigger><SelectValue placeholder="Chọn xếp loại" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A - Tốt</SelectItem><SelectItem value="B">B - Khá</SelectItem>
                      <SelectItem value="C">C - Trung bình</SelectItem><SelectItem value="D">D - Yếu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Sĩ số</Label>
                  <Input value={book.totalStudents} disabled />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Học sinh vắng</Label>
                <Input value={absentNames} disabled={!canEdit} onChange={(e) => setAbsentNames(e.target.value)} placeholder="Nhập tên, ngăn cách bằng dấu phẩy" />
              </div>
              <div className="space-y-1.5">
                <Label>Nhận xét</Label>
                <Textarea rows={2} maxLength={500} value={comment} disabled={!canEdit} onChange={(e) => setComment(e.target.value)} placeholder="Nhập nhận xét tiết học" />
              </div>

              <div>
                <p className="mb-2 flex items-center gap-2 text-sm font-medium"><Paperclip className="size-4" />Tệp đính kèm</p>
                <Button variant="outline" size="sm" disabled={!canEdit} onClick={() => toast.success("Đã tải tệp đính kèm (dữ liệu mẫu)")}>
                  <FileUp className="size-4" />Tải tệp lên
                </Button>
              </div>

              {canEdit && (
                <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                  <Button variant="outline" onClick={() => { save("da_cap_nhat"); toast.success("Đã cập nhật thông tin tiết học"); }}>
                    <Save className="size-4" />Lưu cập nhật
                  </Button>
                  <Button onClick={() => setConfirmGvbm(true)} disabled={missing.length > 0}>
                    <CheckCircle2 className="size-4" />Xác nhận GVBM
                  </Button>
                  {missing.length > 0 && <p className="w-full text-xs text-destructive">Còn thiếu: {missing.join(", ")}</p>}
                </div>
              )}

              {role === "GVCN" && can("book.confirm.gvcn") && !locked && !book.gvcnConfirm && (
                <div className="border-t border-border pt-4">
                  <p className="mb-2 text-sm text-muted-foreground">
                    Xác nhận được thực hiện theo tuần. Tuần {book.week}: {weekBooks.filter((b) => b.gvbmConfirm).length}/{weekBooks.length} tiết đã được GVBM xác nhận.
                  </p>
                  <Button
                    disabled={!allGvbmConfirmed}
                    onClick={() => {
                      if (confirmWeekGvcn(book.className, book.week)) toast.success(`Đã xác nhận Sổ đầu bài tuần ${book.week} của lớp ${book.className}`);
                      else toast.error("Chưa thể xác nhận: vẫn còn tiết chưa được GVBM xác nhận.");
                    }}
                  >
                    <CheckCircle2 className="size-4" />Xác nhận GVCN theo tuần
                  </Button>
                </div>
              )}

              {role === "BGH" && can("book.confirm.bgh") && !locked && !book.bghConfirm && (
                <div className="border-t border-border pt-4">
                  <p className="mb-2 text-sm text-muted-foreground">
                    Sổ lớp chỉ được BGH xác nhận sau khi các tiết thuộc lớp đã được GVCN xác nhận.
                  </p>
                  <Button
                    disabled={!allGvcnConfirmed}
                    onClick={() => {
                      if (confirmClassBgh(book.className)) toast.success(`Đã xác nhận Sổ đầu bài lớp ${book.className}`);
                      else toast.error("Chưa thể xác nhận: Sổ đầu bài lớp chưa hoàn tất xác nhận GVCN.");
                    }}
                  >
                    <CheckCircle2 className="size-4" />Xác nhận BGH
                  </Button>
                </div>
              )}

              {role === "BGH" && can("book.lock") && (
                <div className="border-t border-border pt-4">
                  <Button
                    variant={locked ? "outline" : "default"}
                    disabled={!locked && !book.bghConfirm}
                    onClick={() => {
                      const ok = toggleClassLock(book.className, !locked);
                      if (ok) toast.success(locked ? "Đã mở khóa Sổ đầu bài" : "Đã khóa Sổ đầu bài");
                      else toast.error("Chưa đủ điều kiện để thực hiện thao tác.");
                    }}
                  >
                    <Lock className="size-4" />{locked ? "Mở khóa Sổ đầu bài" : "Khóa Sổ đầu bài"}
                  </Button>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-xl border border-border bg-card p-4 shadow-card">
            <h2 className="mb-3 text-base font-semibold">Trạng thái xác nhận</h2>
            <ul className="space-y-2 text-sm">
              <li>GVBM: {book.gvbmConfirm ? <span className="text-success">Đã xác nhận</span> : <span className="text-muted-foreground">Chưa xác nhận</span>}</li>
              <li>GVCN: {book.gvcnConfirm ? <span className="text-success">Đã xác nhận</span> : <span className="text-muted-foreground">Chưa xác nhận</span>}</li>
              <li>BGH: {book.bghConfirm ? <span className="text-success">Đã xác nhận</span> : <span className="text-muted-foreground">Chưa xác nhận</span>}</li>
              <li>Khóa: {book.lockedBy ? <span className="text-success">Đã khóa</span> : <span className="text-muted-foreground">Chưa khóa</span>}</li>
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-card p-4 shadow-card">
            <h2 className="mb-3 text-base font-semibold">Tiến độ tuần</h2>
            <p className="text-sm text-muted-foreground">Tuần {book.week} · {book.className}</p>
            <p className="mt-2 text-2xl font-semibold">{weekBooks.filter((b) => b.gvbmConfirm).length}/{weekBooks.length}</p>
            <p className="text-xs text-muted-foreground">tiết đã được GVBM xác nhận</p>
          </section>

          <section className="rounded-xl border border-border bg-card p-4 shadow-card">
            <h2 className="mb-3 text-base font-semibold">Học sinh vắng</h2>
            {book.absents.length === 0 ? <p className="text-sm text-muted-foreground">Không có học sinh vắng.</p> : (
              <Table>
                <TableHeader><TableRow><TableHead>Học sinh</TableHead><TableHead>Lý do</TableHead></TableRow></TableHeader>
                <TableBody>{book.absents.map((a) => <TableRow key={a.name}><TableCell>{a.name}</TableCell><TableCell>{a.reason}</TableCell></TableRow>)}</TableBody>
              </Table>
            )}
          </section>
        </div>
      </div>

      <ActionDialog
        open={confirmGvbm}
        onOpenChange={setConfirmGvbm}
        title="Xác nhận Sổ đầu bài của GVBM"
        description="Sau khi xác nhận, GVBM không thể chỉnh sửa trực tiếp tiết học này."
        confirmLabel="Xác nhận"
        onConfirm={() => {
          save("xac_nhan_gvbm");
          toast.success("Đã xác nhận Sổ đầu bài của GVBM");
        }}
      />
    </div>
  );
}
