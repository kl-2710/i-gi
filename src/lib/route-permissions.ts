import { NAV_GROUPS } from "@/components/layout/nav-config";
import type { Permission } from "@/lib/types";

export function getRoutePermissions(
  pathname: string,
): Permission[] | null {
  for (const group of NAV_GROUPS) {
    for (const item of group.items) {
      if (
        pathname === item.to ||
        pathname.startsWith(item.to + "/")
      ) {
        return item.perms;
      }
    }
  }

  if (pathname.startsWith("/kiem-soat/")) return ["route.hidden"];
  return null;
}