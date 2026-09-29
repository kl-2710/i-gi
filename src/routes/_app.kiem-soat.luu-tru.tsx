import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { NoPermissionState } from "@/components/common/States";
import { ControlTable } from "@/components/common/ControlTable";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/_app/kiem-soat/luu-tru")({
  head: () => ({
    meta: [
      { title: "Lưu trữ / Khôi phục — THCS Khương Mai" },
      { name: "description", content: "Lưu trữ sổ đầu bài đã khóa và khôi phục khi cần, giữ nguyên lịch sử." },
      { property: "og:title", content: "Lưu trữ / Khôi phục sổ đầu bài" },
      { property: "og:description", content: "Quản lý lưu trữ và khôi phục sổ đầu bài." },
    ],
  }),
  component: ArchivePage,
});

function ArchivePage() {
  const { can } = useApp();
  if (!can("ctrl.archive")) {
    return (
      <div>
        <PageHeader title="Lưu trữ / Khôi phục" crumbs={[{ label: "Kiểm soát & lưu trữ" }, { label: "Lưu trữ / Khôi phục" }]} />
        <NoPermissionState message="Chỉ Tổng phụ trách được phép lưu trữ và khôi phục sổ đầu bài." />
      </div>
    );
  }
  return (
    <div className="space-y-5">
      <PageHeader
        title="Lưu trữ / Khôi phục sổ đầu bài"
        description="Thao tác lưu trữ và khôi phục đều được ghi nhận đầy đủ trong lịch sử thao tác."
        crumbs={[{ label: "Kiểm soát & lưu trữ" }, { label: "Lưu trữ / Khôi phục" }]}
      />
      <div>
        <h2 className="mb-3 text-base font-semibold">Sổ đủ điều kiện lưu trữ</h2>
        <ControlTable filterFn={(b) => b.status === "da_khoa"} actions={["archive"]} />
      </div>
      <div>
        <h2 className="mb-3 text-base font-semibold">Sổ đã lưu trữ</h2>
        <ControlTable filterFn={(b) => b.status === "da_luu_tru"} actions={["restore"]} />
      </div>
    </div>
  );
}
