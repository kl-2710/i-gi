import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { ScrollTable, SearchBar, TableCard, TableToolbar } from "@/components/common/DataTable";
import { EmptyState, NoPermissionState } from "@/components/common/States";
import { Pill } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useApp } from "@/lib/app-state";
import { ROLE_LABEL, type RoleCode } from "@/lib/types";
import { PERMISSION_GROUPS } from "@/lib/permissions";

export const Route = createFileRoute("/_app/nguoi-dung/vai-tro")({
  head: () => ({
    meta: [
      { title: "Quản lý vai trò — Sổ đầu bài THCS Khương Mai" },
      { name: "description", content: "Danh sách vai trò hệ thống và các quyền gắn với từng vai trò." },
      { property: "og:title", content: "Quản lý vai trò" },
      { property: "og:description", content: "Quản lý vai trò người dùng trong hệ thống sổ đầu bài." },
    ],
  }),
  component: RolesPage,
});

const DESCRIPTIONS: Record<RoleCode, string> = {
  ADMIN: "Quản trị hệ thống: tài khoản, vai trò, phân quyền.",
  BGH: "Thiết lập dạy học, nhập PPCT/TKB, sinh dữ liệu sổ đầu bài, kiểm tra và duyệt sổ đầu bài toàn trường.",
  TPT: "Kiểm tra, duyệt, khóa/mở khóa, lưu trữ/khôi phục sổ đầu bài.",
  GVBM: "Cập nhật và xác nhận thông tin tiết dạy của mình.",
  GVCN: "Theo dõi và xác nhận sổ đầu bài lớp chủ nhiệm.",
  PHT: "Quản lý danh mục dữ liệu dạy học, nhập PPCT/TKB và hình thành tiết học.",
};

function RolesPage() {
  const { can, accounts } = useApp();
  const [q, setQ] = useState("");
  const [detail, setDetail] = useState<RoleCode | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [active, setActive] = useState<Record<string, boolean>>({});

  if (!can("perm.manage")) {
    return (
      <div>
        <PageHeader title="Quản lý vai trò" crumbs={[{ label: "Quản lý người dùng & phân quyền" }, { label: "Quản lý vai trò" }]} />
        <NoPermissionState message="Chỉ Quản trị hệ thống được phép quản lý vai trò." />
      </div>
    );
  }

  const roles = (Object.keys(ROLE_LABEL) as RoleCode[]).filter((r) =>
    `${ROLE_LABEL[r]} ${DESCRIPTIONS[r]}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div>
      <PageHeader
        title="Quản lý vai trò"
        description="Mỗi tài khoản được gán một hoặc nhiều vai trò, vai trò quyết định phân quyền."
        crumbs={[{ label: "Quản lý người dùng & phân quyền" }, { label: "Quản lý vai trò" }]}
        actions={<Button onClick={() => setCreateOpen(true)}><Plus className="size-4" />Thêm vai trò</Button>}
      />

      <TableCard>
        <TableToolbar>
          <SearchBar value={q} onChange={setQ} placeholder="Tìm vai trò..." />
        </TableToolbar>
        {roles.length === 0 ? (
          <EmptyState />
        ) : (
          <ScrollTable>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên vai trò</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Số tài khoản</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((r) => {
                  const enabled = active[r] ?? true;
                  return (
                    <TableRow key={r}>
                      <TableCell className="whitespace-nowrap font-medium">
                        <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary" />{ROLE_LABEL[r]}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{DESCRIPTIONS[r]}</TableCell>
                      <TableCell className="tabular-nums">{accounts.filter((a) => a.roles.includes(r)).length}</TableCell>
                      <TableCell><Pill tone={enabled ? "success" : "danger"}>{enabled ? "Đang áp dụng" : "Ngừng áp dụng"}</Pill></TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => setDetail(r)}>Chi tiết</Button>
                          <Switch
                            checked={enabled}
                            onCheckedChange={(v) => {
                              setActive((p) => ({ ...p, [r]: v }));
                              toast.success(v ? "Đã kích hoạt vai trò" : "Đã ngừng áp dụng vai trò");
                            }}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollTable>
        )}
      </TableCard>

      <Dialog open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{detail ? ROLE_LABEL[detail] : ""}</DialogTitle>
            <DialogDescription>{detail ? DESCRIPTIONS[detail] : ""}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {PERMISSION_GROUPS.map((g) => {
              const items = g.items.filter((i) => detail && i.roles.includes(detail));
              if (items.length === 0) return null;
              return (
                <div key={g.module}>
                  <p className="text-sm font-medium">{g.module}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {items.map((i) => (
                      <Pill key={i.key} tone="success">{i.label}</Pill>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetail(null)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Thêm vai trò</DialogTitle>
            <DialogDescription>Vai trò mới cần được cấu hình phân quyền sau khi tạo.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label>Tên vai trò</Label><Input placeholder="Nhập tên vai trò" maxLength={80} /></div>
            <div className="space-y-1.5"><Label>Mô tả</Label><Textarea rows={3} placeholder="Mô tả trách nhiệm của vai trò" maxLength={300} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Hủy</Button>
            <Button onClick={() => { setCreateOpen(false); toast.success("Đã tạo vai trò mới (dữ liệu mẫu)"); }}>Tạo vai trò</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
