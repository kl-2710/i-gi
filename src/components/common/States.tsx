import { AlertTriangle, Inbox, Loader2, ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  title = "Không có dữ liệu",
  description = "Chưa có bản ghi nào phù hợp với bộ lọc hiện tại.",
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
      <div className="rounded-full bg-muted p-3">
        <Inbox className="size-6 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      {action}
    </div>
  );
}

export function LoadingState({ label = "Đang tải dữ liệu..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 px-6 py-14 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" />
      {label}
    </div>
  );
}

export function ErrorState({
  title = "Không tải được dữ liệu",
  description = "Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
      <div className="rounded-full bg-destructive/10 p-3">
        <AlertTriangle className="size-6 text-destructive" />
      </div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-2" onClick={onRetry}>
          Thử lại
        </Button>
      )}
    </div>
  );
}

export function NoPermissionState({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-16 text-center shadow-card">
      <div className="rounded-full bg-warning/15 p-3">
        <ShieldAlert className="size-6 text-warning-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground">Bạn không có quyền truy cập chức năng này</p>
      <p className="max-w-md text-sm text-muted-foreground">
        {message ?? "Vui lòng chuyển sang vai trò phù hợp hoặc liên hệ quản trị hệ thống."}
      </p>
    </div>
  );
}
