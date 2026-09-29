import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { NoPermissionState } from "@/components/common/States";
import { ControlTable } from "@/components/common/ControlTable";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/_app/kiem-soat/khoa-so")({
  head: () => ({
    meta: [
      { title: "Khóa / Mở khóa sổ đầu bài — THCS Khương Mai" },
      { name: "description", content: "Khóa sổ đầu bài đã duyệt và mở khóa khi cần, có ghi nhận lý do." },
      { property: "og:title", content: "Khóa / Mở khóa sổ đầu bài" },
      { property: "og:description", content: "Quản lý khóa và mở khóa sổ đầu bài." },
    ],
  }),
  component: LockPage,
});

function LockPage() {
  const { can } = useApp();
  if (!can("ctrl.lock")) {
    return (
      <div>
        <PageHeader title="Khóa / Mở khóa" crumbs={[{ label: "Kiểm soát & lưu trữ" }, { label: "Khóa / Mở khóa" }]} />
        <NoPermissionState message="Chỉ Tổng phụ trách được phép khóa và mở khóa sổ đầu bài." />
      </div>
    );
  }
  return (
    <div className="space-y-5">
      <PageHeader
        title="Khóa / Mở khóa sổ đầu bài"
        description="Bản ghi đã khóa không thể chỉnh sửa trực tiếp. Mở khóa bắt buộc nhập lý do và được ghi vào lịch sử."
        crumbs={[{ label: "Kiểm soát & lưu trữ" }, { label: "Khóa / Mở khóa" }]}
      />
      <div>
        <h2 className="mb-3 text-base font-semibold">Sổ đã duyệt - chờ khóa</h2>
        <ControlTable filterFn={(b) => b.status === "da_duyet"} actions={["lock"]} />
      </div>
      <div>
        <h2 className="mb-3 text-base font-semibold">Sổ đã khóa</h2>
        <ControlTable filterFn={(b) => b.status === "da_khoa"} actions={["unlock", "archive"]} />
      </div>
    </div>
  );
}
