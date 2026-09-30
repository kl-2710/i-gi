import { useEffect } from "react";
import { Outlet, createFileRoute, useLocation, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { LoadingState } from "@/components/common/States";
import { useApp } from "@/lib/app-state";
import { AccessDeniedScreen } from "@/components/common/AccessDeniedScreen";
import { getRoutePermissions } from "@/lib/route-permissions";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const { user, can } = useApp();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate({ to: "/", replace: true });
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <LoadingState label="Đang chuyển tới trang đăng nhập..." />
      </div>
    );
  }

const requiredPermissions = getRoutePermissions(pathname);

const allowed =
  requiredPermissions === null ||
  requiredPermissions.length === 0 ||
  requiredPermissions.some((permission) => can(permission));

return (
  <AppShell>
    {allowed ? <Outlet /> : <AccessDeniedScreen />}
  </AppShell>
);
}
