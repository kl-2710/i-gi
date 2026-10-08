import { useState } from "react";
import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { CheckCircle2, Cpu, Lock, Save, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { ActionDialog } from "@/components/common/ActionDialog";
import { Pill } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/States";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/_app/so-dau-bai/$id")({
  validateSearch: (search) => ({
    mode: search.mode === "edit" ? "edit" : search.mode === "class" ? "class" : "view",
    className: typeof search.className === "string" ? search.className : "",
  }),
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
  const { mode, className } = Route.useSearch();
  const { books, can, user, role, updateBook } = useApp();

  if (mode === "class") {
    const classBooks = books
      .filter((book) => book.className === className)
      .sort((a, b) => a.date.localeCompare(b.date) || a.period - b.period);
    const schoolViewer = role === "BGH" || role === "TPT" || role === "ADMIN";

    if (!schoolViewer || !can("book.view.all") || !className || classBooks.length === 0) {
      return (
        <div>
          <PageHeader
            title="Danh sách tiết dạy"
            crumbs={[{ label: "Quản lý Sổ đầu bài", to: "/so-dau-bai" }, { label: "Danh sách tiết dạy" }]}
          />
          <EmptyState
            title="Không tìm thấy dữ liệu"
            description="Lớp không tồn tại hoặc bạn không có quyền xem dữ liệu của lớp này."
          />
        </div>
      );
    }

    return (
      <div className="space-y-5">
        <PageHeader
          title={"Danh sách tiết dạy lớp " + className}
          description={"Năm học " + (classBooks[0]?.year ?? "-") + " · " + (classBooks[0]?.semester ?? "-")}
          crumbs={[
            { label: "Quản lý Sổ đầu bài", to: "/so-dau-bai" },
            { label: "Lớp " + className },
          ]}
          actions={
            <Button asChild variant="outline">
              <Link to="/so-dau-bai">Quay lại</Link>
            </Button>
          }
        />

        <section className="rounded-xl border border-border bg-card p-4 shadow-card sm:p-6">
          <h2 className="mb-4 text-base font-semibold">Danh sách tiết dạy</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Thứ</TableHead>
                  <TableHead>Tiết</TableHead>
                  <TableHead>Môn</TableHead>
                  <TableHead>Giáo viên</TableHead>
                  <TableHead>Nội dung từ PPCT</TableHead>
                  <TableHead>Trạng thái tiết dạy</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classBooks.map((lesson) => (
                  <TableRow key={lesson.id}>
                    <TableCell>{lesson.date}</TableCell>
                    <TableCell>{lesson.weekday}</TableCell>
                    <TableCell>{"Tiết " + lesson.period}</TableCell>
                    <TableCell>{lesson.subject}</TableCell>
                    <TableCell>{lesson.teacher}</TableCell>
                    <TableCell className="max-w-[320px] truncate">{lesson.plannedContent}</TableCell>
                    <TableCell>
                      <Pill tone={lesson.gvbmConfirm ? "success" : "warning"}>
                        {lesson.gvbmConfirm ? "GVBM đã xác nhận" : "-"}
                      </Pill>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="icon" title="Xem thông tin tiết dạy">
                        <Link to="/so-dau-bai/$id" params={{ id: lesson.id }} search={{ mode: "view" }}>
                          <Eye className="size-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    );
  }

  const book = books.find((b) => b.id === id);

  const [comment, setComment] = useState(book?.comment ?? "");
  const [score, setScore] = useState(book?.score?.toString() ?? "");
  const [rank, setRank] = useState(book?.rank ?? "");
  const [absentCount, setAbsentCount] = useState(book?.absentCount?.toString() ?? "");
  const [confirmGvbm, setConfirmGvbm] = useState(false);

  if (!book) {
    return (
      <div>
        <PageHeader
          title="Chi tiết Sổ đầu bài"
          crumbs={[{ label: "Quản lý Sổ đầu bài", to: "/so-dau-bai" }, { label: "Chi tiết" }]}
        />
        <EmptyState
          title="Không tìm thấy bản ghi"
          description="Bản ghi Sổ đầu bài không tồn tại hoặc ngoài phạm vi truy cập của bạn."
        />
      </div>
    );
  }

  const locked = book.status === "da_khoa";
  const confirmedGvbm = !!book.gvbmConfirm;
  const isOwnLesson = book.teacherId === user?.teacherId;
  const editable =
    mode === "edit" &&
    can("book.edit") &&
    !locked &&
    !confirmedGvbm &&
    isOwnLesson;

  const missing: string[] = [];
  if (absentCount === "") missing.push("Số học sinh vắng");
  if (score === "") missing.push("Điểm tiết học");
  if (!rank) missing.push("Xếp loại");
  if (!comment.trim()) missing.push("Nhận xét tiết học");


  const saveDraft = () => {
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
  };

  const confirmLesson = () => {
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
  };

  const systemInfo = (
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
  );

  const updateForm = (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Số học sinh vắng</Label>
        <Input
          type="number"
          min={0}
          value={absentCount}
          disabled={!editable}
          onChange={(e) => setAbsentCount(e.target.value)}
          placeholder="Nhập số học sinh vắng"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label>Điểm tiết học</Label>
          <Input
            type="number"
            min={0}
            max={10}
            step={0.5}
            value={score}
            disabled={!editable}
            onChange={(e) => setScore(e.target.value)}
            placeholder="0 - 10"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Xếp loại tiết dạy</Label>
          <Select value={rank} onValueChange={(v) => setRank(v)} disabled={!editable}>
            <SelectTrigger><SelectValue placeholder="Chọn xếp loại" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="A">Tốt</SelectItem>
              <SelectItem value="B">Khá</SelectItem>
              <SelectItem value="C">Trung bình</SelectItem>
              <SelectItem value="D">Yếu</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Nhận xét tiết dạy</Label>
        <Textarea
          rows={4}
          maxLength={500}
          value={comment}
          disabled={!editable}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Nhập nhận xét tiết dạy"
        />
      </div>
      {editable && (
        <>
          {missing.length > 0 && (
            <p className="text-xs text-destructive">
              Còn thiếu: {missing.join(", ")}. Vui lòng hoàn thiện trước khi xác nhận.
            </p>
          )}
          <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-4">
            <Button asChild variant="outline">
              <Link to="/so-dau-bai">Hủy</Link>
            </Button>
            <Button variant="outline" onClick={saveDraft}>
              <Save className="size-4" />Lưu
            </Button>
            <Button onClick={() => setConfirmGvbm(true)} disabled={missing.length > 0}>
              <CheckCircle2 className="size-4" />Xác nhận tiết học
            </Button>
          </div>
        </>
      )}
    </div>
  );

  if (mode === "edit") {
    return (
      <div className="space-y-5">
        <PageHeader
          title="Thông tin tiết dạy"
          description={`${book.className} · Tiết ${book.period} · ${book.subject} · ${book.weekday}, ${book.date} · Giáo viên dạy: ${book.teacher}`}
          crumbs={[
            { label: "Quản lý Sổ đầu bài", to: "/so-dau-bai" },
            { label: "Cập nhật tiết dạy" },
          ]}
          actions={
            <Button asChild variant="outline">
              <Link to="/so-dau-bai">Hủy</Link>
            </Button>
          }
        />

        {locked && (
          <div className="flex items-center gap-2 rounded-xl border border-navy/25 bg-navy/5 p-4 text-sm">
            <Lock className="size-4 text-navy" />
            Sổ đầu bài đã khóa, không thể chỉnh sửa.
          </div>
        )}

        <section className="rounded-xl border border-border bg-card p-4 shadow-card sm:p-6">
          <div className="space-y-6">
            {systemInfo}
            <div className="border-t border-border pt-5">
              {updateForm}
            </div>
          </div>
        </section>

        <ActionDialog
          open={confirmGvbm}
          onOpenChange={setConfirmGvbm}
          title="Xác nhận tiết học"
          description="Sau khi xác nhận, GVBM không thể chỉnh sửa trực tiếp thông tin tiết học."
          confirmLabel="Xác nhận GVBM"
          onConfirm={confirmLesson}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={`Chi tiết Sổ đầu bài · ${book.className} · Tiết ${book.period} · ${book.subject}`}
        description={`${book.weekday}, ${book.date} · Giáo viên dạy: ${book.teacher}`}
        crumbs={[{ label: "Quản lý Sổ đầu bài", to: "/so-dau-bai" }, { label: book.code }]}
      />

      {locked && (
        <div className="flex items-center gap-2 rounded-xl border border-navy/25 bg-navy/5 p-4 text-sm">
          <Lock className="size-4 text-navy" />
          Sổ đầu bài đã khóa, không thể chỉnh sửa.
          {book.lockedBy && <span className="text-muted-foreground">(Khóa bởi {book.lockedBy.by} · {book.lockedBy.at})</span>}
        </div>
      )}

      <section className="rounded-xl border border-border bg-card p-4 shadow-card sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Cpu className="size-4 text-primary" />
          <h2 className="text-base font-semibold">Thông tin tiết dạy</h2>
        </div>
        <div className="space-y-6">
          {systemInfo}
          <div className="border-t border-border pt-5">
            {updateForm}
          </div>
        </div>
      </section>
    </div>
  );
}
