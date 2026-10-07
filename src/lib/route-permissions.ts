import { NAV_GROUPS } from "@/components/layout/nav-config";
import type { Permission } from "@/lib/types";

const BLOCKED_LEGACY_ROUTES = [
  "/kiem-soat",
  "/nguoi-dung/vai-tro",
];

export function getRoutePermissions(pathname: string): Permission[] | null {
  if (BLOCKED_LEGACY_ROUTES.some((prefix) => pathname === prefix || pathname.startsWith(prefix + "/"))) {
    return ["blocked.route"];
  }

  for (const group of NAV_GROUPS) {
    for (const item of group.items) {
      const route = item.to.split("?")[0];
      if (pathname === route || pathname.startsWith(route + "/")) return item.perms;
    }
  }

  return null;
}
