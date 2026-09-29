import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Save, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { FilterField, ScrollTable, TableCard, TableToolbar } from "@/components/common/DataTable";
import { NoPermissionState } from "@/components/common/States";
import { Pill } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/lib/app-state";
import { PERMISSION_CATEGORIES, PERMISSION_GROUPS } from "@/lib/permissions";
import { ROLE_LABEL, type RoleCode } from "@/lib/types";

export const Route = createFileRoute("/_app/nguoi-dung/phan-quyen")({
  head: () => ({
    meta: [
      { title: "Quản lý phân quyền — Sổ đầu bài THCS Khương Mai" },
      { name: "description", content: "Cấu hình quyền theo vai trò cho từng phân hệ và chức năng của hệ thống." },
      { property: "og:title", content: "Quản lý phân quyền" },
      { property: "og:description", content: "Ma trận phân quyền theo vai trò và phân hệ." },
    ],
  }),
  component: PermissionsPage,
});

function PermissionsPage() {
  const { can } = useApp();
  const [role, setRole] = useState<RoleCode>("GVBM");
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});

  if (!can("perm.manage")) {
    return (
      <div>
        <PageHeader title="Quản lý phân quyền" crumbs={[{ label: "Quản lý người dùng & phân quyền" }, { label: "Quản lý phân quyền" }]} />
        <NoPermissionState message="Chỉ Quản trị hệ thống được phép cấu hình phân quyền." />
      </div>
    );
  }

  const value = (key: string, base: boolean) => overrides[`${role}:${key}`] ?? base;

  return (
    <div>
      <PageHeader
        title="Quản lý phân quyền"
        description="Phân quyền được cấu hình tập trung theo vai trò, áp dụng cho toàn bộ hệ thống."
        crumbs={[{ label: "Quản lý người dùng & phân quyền" }, { label: "Quản lý phân quyền" }]}
        actions={<Button onClick={() => toast.success("Đã lưu cấu hình phân quyền")}><Save className="size-4" />Lưu cấu hình</Button>}
      />

      <div className="mb-4 rounded-xl border border-border bg-card p-4 shadow-card">
        <p className="text-sm font-medium">Nhóm quyền trong hệ thống</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {PERMISSION_CATEGORIES.map((c) => (
            <Pill key={c}>{c}</Pill>
          ))}
        </div>
      </div>

      <TableCard>
        <TableToolbar>
          <FilterField label="Vai trò áp dụng">
            <Select value={role} onValueChange={(v) => setRole(v as RoleCode)}>
              <SelectTrigger className="min-w-[220px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(ROLE_LABEL) as RoleCode[]).map((r) => (
                  <SelectItem key={r} value={r}>{ROLE_LABEL[r]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>
        </TableToolbar>

        <ScrollTable>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[45%]">Phân hệ / Chức năng</TableHead>
                <TableHead>Trạng thái mặc định</TableHead>
                <TableHead className="text-right">Cho phép</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PERMISSION_GROUPS.map((g) => (
                <>
                  <TableRow key={g.module} className="bg-surface">
                    <TableCell colSpan={3} className="font-semibold">{g.module}</TableCell>
                  </TableRow>
                  {g.items.map((i) => {
                    const base = i.roles.includes(role);
                    const checked = value(i.key, base);
                    return (
                      <TableRow key={`${g.module}-${i.key}`}>
                        <TableCell className="pl-8">{i.label}</TableCell>
                        <TableCell>
                          {base ? (
                            <span className="inline-flex items-center gap-1 text-sm text-success"><Check className="size-4" />Được phép</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-sm text-muted-foreground"><X className="size-4" />Không được phép</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(v) =>
                              setOverrides((p) => ({ ...p, [`${role}:${i.key}`]: Boolean(v) }))
                            }
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </>
              ))}
            </TableBody>
          </Table>
        </ScrollTable>
      </TableCard>
    </div>
  );
}
