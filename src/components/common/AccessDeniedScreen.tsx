import { LockKeyhole } from "lucide-react";

export function AccessDeniedScreen() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-sm">

        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <LockKeyhole className="size-7" />
        </div>

        <h1 className="mt-5 text-xl font-semibold text-foreground">
          Không có quyền truy cập
        </h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Bạn không có quyền truy cập chức năng này.
          <br />
          Vui lòng liên hệ quản trị viên nếu bạn cần được cấp quyền.
        </p>

      </div>
    </div>
  );
}