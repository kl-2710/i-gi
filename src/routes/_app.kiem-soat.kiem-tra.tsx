import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { NoPermissionState } from "@/components/common/States";
import { ControlTable } from "@/components/common/ControlTable";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/_app/kiem-soat/kiem-tra")({
  head: () => ({
    meta: [
      { title: "Kiểm tra sổ đầu bài — THCS Khương Mai" },
      { name: "description", content: "Kiểm tra sổ đầu bài đã được GVBM và GVCN xác nhận." },
      { property: "og:title", content: "Kiểm tra sổ đầu bài" },
      { property: "og:description", content: "Danh sách sổ đầu bài cần kiểm tra theo phạm vi vai trò." },
    ],
  }),
  component: CheckPage,
});

function CheckPage() {
  const { can } = useApp();
  if (!can("ctrl.check")) {
    return (
      <div>
        <PageHeader title="Kiểm tra" crumbs={[{ label: "Kiểm soát & lưu trữ" }, { label: "Kiểm tra" }]} />
        <NoPermissionState />
      </div>
    );
  }
  return (
    <div>
      <PageHeader
        title="Kiểm tra sổ đầu bài"
        description="Phạm vi dữ liệu hiển thị theo vai trò và quyền được giao."
        crumbs={[{ label: "Kiểm soát & lưu trữ" }, { label: "Kiểm tra" }]}
      />
      <ControlTable
        filterFn={(b) => ["xac_nhan_gvcn", "cho_kiem_tra", "xac_nhan_gvbm"].includes(b.status)}
        actions={["check"]}
        allowRequestFix
      />
    </div>
  );
}
