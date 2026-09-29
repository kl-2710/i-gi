import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/PageHeader";
import { NoPermissionState } from "@/components/common/States";
import { ControlTable } from "@/components/common/ControlTable";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/_app/kiem-soat/duyet")({
  head: () => ({
    meta: [
      { title: "Duyệt sổ đầu bài — THCS Khương Mai" },
      { name: "description", content: "Duyệt hoặc yêu cầu chỉnh sửa sổ đầu bài đã kiểm tra." },
      { property: "og:title", content: "Duyệt sổ đầu bài" },
      { property: "og:description", content: "Giao diện duyệt sổ đầu bài theo quyền được giao." },
    ],
  }),
  component: ApprovePage,
});

function ApprovePage() {
  const { can } = useApp();
  if (!can("ctrl.approve")) {
    return (
      <div>
        <PageHeader title="Duyệt" crumbs={[{ label: "Kiểm soát & lưu trữ" }, { label: "Duyệt" }]} />
        <NoPermissionState />
      </div>
    );
  }
  return (
    <div>
      <PageHeader
        title="Duyệt sổ đầu bài"
        description="Xem kết quả xác nhận GVBM/GVCN, kết quả kiểm tra, nhận xét và tệp đính kèm trước khi duyệt."
        crumbs={[{ label: "Kiểm soát & lưu trữ" }, { label: "Duyệt" }]}
      />
      <ControlTable
        filterFn={(b) => ["da_kiem_tra", "cho_duyet"].includes(b.status)}
        actions={["approve"]}
        allowRequestFix
      />
    </div>
  );
}
