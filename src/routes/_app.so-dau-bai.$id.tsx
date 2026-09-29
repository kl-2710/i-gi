import { useState } from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { CheckCircle2, Cpu, FileUp, Lock, Paperclip, Save, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge, Pill } from "@/components/common/StatusBadge";
import { AuditTimeline } from "@/components/common/AuditTimeline";
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
      { title: "Chi tiết sổ đầu bài — THCS Khương Mai" },
      { name: "description", content: "Chi tiết tiết học: thông tin hệ thống sinh và thông tin giáo viên cập nhật." },
      { property: "og:title", content: "Chi tiết sổ đầu bài" },
      { property: "og:description", content: "Xem và cập nhật thông tin thực tế của tiết học." },
    ],
  }),
  component: BookDetailPage,
});

function BookDetailPage() {
  const { id } = useParams({ from: "/_app/so-dau-bai/$id" });
  const { books, audit, can, user, role, updateBook } = useApp();
  const book = books.find((b) => b.id === id);
  const [actual, setActual] = useState(book?.actualContent ?? "");
  const [comment, setComment] = useState(book?.comment ?? "");
  const [score, setScore] = useState(book?.score?.toString() ?? "");
  const [rank, setRank] = useState(book?.rank ?? "");
  const [confirmGvbm, setConfirmGvbm] = useState(false);
  const [confirmGvcn, setConfirmGvcn] = useState(false);

  if (!book) {
    return (
      <div>
        <PageHeader title="Chi tiết sổ đầu bài" crumbs={[{ label: "Quản lý sổ đầu bài", to: "/so-dau-bai" }, { label: "Chi tiết" }]} />
        <EmptyState title="Không tìm thấy bản ghi" description="Bản ghi sổ đầu bài không tồn tại hoặc ngoài phạm vi truy cập của bạn." />
      </div>
    );
  }

  const locked = ["da_khoa", "da_luu_tru"].includes(book.status);
  const confirmedGvbm = !!book.gvbmConfirm;
  const editable = can("book.edit") && !locked && !confirmedGvbm && book.teacher === user?.fullName;
  const missing: string[] = [];
  if (!actual.trim()) missing.push("Nội dung thực tế");
  if (!score) missing.push("Điểm tiết học");
  if (!rank) missing.push("Xếp loại");

  const entries = audit.filter((a) => a.recordCode === book.code);

  return (
    <div className="space-y-5">
      <PageHeader
        title={`Sổ đầu bài ${book.className} · Tiết ${book.period} · ${book.subject}`}
        description={`${book.weekday}, ${book.date} · Giáo viên: ${book.teacher}`}
        crumbs={[{ label: "Quản lý sổ đầu bài", to: "/so-dau-bai" }, { label: book.code }]}
        actions={<StatusBadge status={book.status} />}
      />

      {locked && (
        <div className="flex items-center gap-2 rounded-xl border border-navy/25 bg-navy/5 p-4 text-sm">
          <Lock className="size-4 text-navy" />
          Bản ghi đã được xác nhận/khóa và không thể chỉnh sửa trực tiếp.
          {book.lockedBy && <span className="text-muted-foreground">(Khóa bởi {book.lockedBy.by} · {book.lockedBy.at})</span>}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <section className="rounded-xl border border-border bg-card p-4 shadow-card sm:p-6">
            <div className="mb-3 flex items-center gap-2">
              <Cpu className="size-4 text-primary" />
              <h2 className="text-base font-semibold">Thông tin do hệ thống sinh</h2>
              <Pill tone="info">Nguồn: TKB + PPCT</Pill>
            </div>
            <dl className="grid gap-3 text-sm sm:grid-cols-3">
              <div><dt className="text-muted-foreground">Ngày</dt><dd className="font-medium">{book.date}</dd></div>
              <div><dt className="text-muted-foreground">Tiết</dt><dd className="font-medium">Tiết {book.period}</dd></div>
              <div><dt className="text-muted-foreground">Lớp</dt><dd className="font-medium">{book.className}</dd></div>
              <div><dt className="text-muted-foreground">Môn</dt><dd className="font-medium">{book.subject}</dd></div>
              <div><dt className="text-muted-foreground">Giáo viên</dt><dd className="font-medium">{book.teacher}</dd></div>
              <div><dt className="text-muted-foreground">Tiết PPCT</dt><dd className="font-medium">PPCT {book.ppctNo}</dd></div>
              <div className="sm:col-span-3"><dt className="text-muted-foreground">Nội dung dự kiến từ PPCT</dt><dd className="mt-1 rounded-md border border-info/30 bg-info/5 px-3 py-2">{book.plannedContent}</dd></div>
              <div><dt className="text-muted-foreground">Năm học</dt><dd className="font-medium">{book.year}</dd></div>
              <div><dt className="text-muted-foreground">Học kỳ</dt><dd className="font-medium">{book.semester}</dd></div>
              <div><dt className="text-muted-foreground">Phòng học</dt><dd className="font-medium">{book.room}</dd></div>
            </dl>
          </section>

          <section className="rounded-xl border border-border bg-card p-4 shadow-card sm:p-6">
            <div className="mb-3 flex items-center gap-2">
              <UserCheck className="size-4 text-success" />
              <h2 className="text-base font-semibold">Thông tin giáo viên cập nhật</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Nội dung thực tế của tiết học</Label>
                <Textarea rows={3} maxLength={500} value={actual} disabled={!editable} onChange={(e) => setActual(e.target.value)} placeholder="Nhập nội dung thực tế đã dạy" />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label>Điểm tiết học</Label>
                  <Input type="number" min={0} max={10} step={1} value={score} disabled={!editable} onChange={(e) => setScore(e.target.value)} placeholder="0 - 10" />
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
                <div className="space-y-1.5">
                  <Label>Sĩ số / Vắng</Label>
                  <Input value={`${book.totalStudents} / ${book.absents.length}`} disabled />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Nhận xét tiết học</Label>
                <Textarea rows={2} maxLength={500} value={comment} disabled={!editable} onChange={(e) => setComment(e.target.value)} placeholder="Nhận xét về tiết học" />
              </div>

              <div>
                <p className="mb-2 text-sm font-medium">Học sinh vắng</p>
                {book.absents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Không có học sinh vắng.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow><TableHead>Họ và tên</TableHead><TableHead>Lý do</TableHead></TableRow>
                    </TableHeader>
                    <TableBody>
                      {book.absents.map((a) => (
                        <TableRow key={a.name}><TableCell>{a.name}</TableCell><TableCell className="text-muted-foreground">{a.reason}</TableCell></TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="flex items-center gap-2 text-sm font-medium"><Paperclip className="size-4" />Tệp đính kèm</p>
                  <Button variant="outline" size="sm" disabled={!editable} onClick={() => toast.success("Đã tải tệp đính kèm lên (dữ liệu mẫu)")}>
                    <FileUp className="size-4" />Tải tệp lên
                  </Button>
                </div>
                {book.attachments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Chưa có tệp đính kèm.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow><TableHead>Tên tệp</TableHead><TableHead>Loại</TableHead><TableHead>Dung lượng</TableHead><TableHead>Người tải</TableHead><TableHead>Thời gian</TableHead></TableRow>
                    </TableHeader>
                    <TableBody>
                      {book.attachments.map((f) => (
                        <TableRow key={f.id}>
                          <TableCell className="font-medium">{f.name}</TableCell>
                          <TableCell>{f.type}</TableCell>
                          <TableCell>{f.size}</TableCell>
                          <TableCell>{f.uploadedBy}</TableCell>
                          <TableCell>{f.uploadedAt}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              {editable && (
                <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      updateBook(book.id, { actualContent: actual, comment, score: score ? Number(score) : null, rank: (rank || null) as typeof book.rank }, "Cập nhật nội dung tiết học", "da_cap_nhat");
                      toast.success("Đã lưu thông tin tiết học");
                    }}
                  >
                    <Save className="size-4" />Lưu
                  </Button>
                  <Button onClick={() => setConfirmGvbm(true)} disabled={missing.length > 0}>
                    <CheckCircle2 className="size-4" />Xác nhận GVBM
                  </Button>
                  {missing.length > 0 && (
                    <p className="w-full text-xs text-destructive">Còn thiếu: {missing.join(", ")}. Vui lòng hoàn thiện trước khi xác nhận.</p>
                  )}
                </div>
              )}

              {can("book.confirm.gvcn") && !book.gvcnConfirm && confirmedGvbm && !locked && (
                <div className="border-t border-border pt-4">
                  <Button onClick={() => setConfirmGvcn(true)}><CheckCircle2 className="size-4" />Xác nhận GVCN</Button>
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
              <li>GVCN: {book.gvcnConfirm ? <span className="text-success">Đã xác nhận bởi {book.gvcnConfirm.by} · {book.gvcnConfirm.at}</span> : <span className="text-muted-foreground">Chưa xác nhận</span>}</li>
              <li>Kiểm tra: {book.checkedBy ? <span className="text-success">{book.checkedBy.by} · {book.checkedBy.at}</span> : <span className="text-muted-foreground">Chưa kiểm tra</span>}</li>
              <li>Duyệt: {book.approvedBy ? <span className="text-success">{book.approvedBy.by} · {book.approvedBy.at}</span> : <span className="text-muted-foreground">Chưa duyệt</span>}</li>
              <li>Khóa: {book.lockedBy ? <span className="text-success">{book.lockedBy.by} · {book.lockedBy.at}</span> : <span className="text-muted-foreground">Chưa khóa</span>}</li>
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
        title="Xác nhận GVBM"
        description="Sau khi xác nhận, bản ghi sẽ chuyển sang trạng thái Đã xác nhận GVBM và không thể chỉnh sửa trực tiếp."
        confirmLabel="Xác nhận GVBM"
        onConfirm={() => {
          const now = new Date().toLocaleString("vi-VN", { hour12: false });
          updateBook(
            book.id,
            {
              actualContent: actual,
              comment,
              score: score ? Number(score) : null,
              rank: (rank || null) as typeof book.rank,
              gvbmConfirm: { by: user?.fullName ?? "", at: now },
            },
            "Xác nhận GVBM",
            "xac_nhan_gvbm",
          );
          toast.success("Đã xác nhận GVBM");
        }}
      />

      <ActionDialog
        open={confirmGvcn}
        onOpenChange={setConfirmGvcn}
        title="Xác nhận GVCN"
        description={`Xác nhận sổ đầu bài của lớp ${book.className}.`}
        confirmLabel="Xác nhận GVCN"
        onConfirm={() => {
          const now = new Date().toLocaleString("vi-VN", { hour12: false });
          updateBook(book.id, { gvcnConfirm: { by: user?.fullName ?? "", at: now } }, "Xác nhận GVCN", "xac_nhan_gvcn");
          toast.success("Đã xác nhận GVCN");
        }}
      />
      {role === "GVCN" && book.gvcnConfirm && <span className="sr-only">Đã xác nhận</span>}
    </div>
  );
}
