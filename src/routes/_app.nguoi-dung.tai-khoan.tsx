import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { KeyRound, Pencil, Plus, ShieldCheck, ToggleLeft, ToggleRight, Eye } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { FilterField, ScrollTable, SearchBar, TableCard, TableToolbar } from "@/components/common/DataTable";
import { Pagination } from "@/components/common/Pagination";
import { EmptyState, NoPermissionState } from "@/components/common/States";
import { Pill } from "@/components/common/StatusBadge";
import { ActionDialog } from "@/components/common/ActionDialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/lib/app-state";
import { ROLE_LABEL, ROLE_SHORT, type RoleCode, type UserAccount } from "@/lib/types";

export const Route = createFileRoute("/_app/nguoi-dung/tai-khoan")({
  head: () => ({
    meta: [
      { title: "Quản lý tài khoản — Sổ đầu bài THCS Khương Mai" },
      { name: "description", content: "Quản lý tài khoản người dùng, trạng thái và vai trò trong hệ thống sổ đầu bài." },
      { property: "og:title", content: "Quản lý tài khoản" },
      { property: "og:description", content: "Danh sách tài khoản người dùng hệ thống sổ đầu bài." },
    ],
  }),
  component: AccountsPage,
});

const PAGE_SIZE = 8;

function AccountsPage() {
  const { can, accounts, toggleAccount } = useApp();
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<UserAccount | null>(null);
  const [resetTarget, setResetTarget] = useState<UserAccount | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = useMemo(
    () =>
      accounts.filter((a) => {
        const text = `${a.code} ${a.fullName} ${a.username} ${a.phone} ${a.position}`.toLowerCase();
        if (q && !text.includes(q.toLowerCase())) return false;
        if (roleFilter !== "all" && !a.roles.includes(roleFilter as RoleCode)) return false;
        if (statusFilter === "active" && !a.active) return false;
        if (statusFilter === "locked" && a.active) return false;
        return true;
      }),
    [accounts, q, roleFilter, statusFilter],
  );
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (!can("user.manage")) {
    return (
      <div>
        <PageHeader title="Quản lý tài khoản" crumbs={[{ label: "Quản lý người dùng & phân quyền" }, { label: "Quản lý tài khoản" }]} />
        <NoPermissionState message="Chỉ Quản trị hệ thống được phép quản lý tài khoản người dùng." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Quản lý tài khoản"
        description="Tài khoản → Vai trò → Phân quyền → Chức năng được phép thực hiện"
        crumbs={[{ label: "Quản lý người dùng & phân quyền" }, { label: "Quản lý tài khoản" }]}
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" />
            Thêm tài khoản
          </Button>
        }
      />

      <TableCard>
        <TableToolbar>
          <SearchBar value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Tìm theo tên, tên đăng nhập, số điện thoại..." />
          <FilterField label="Vai trò">
            <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(1); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả vai trò</SelectItem>
                {(Object.keys(ROLE_LABEL) as RoleCode[]).map((r) => (
                  <SelectItem key={r} value={r}>{ROLE_LABEL[r]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>
          <FilterField label="Trạng thái">
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="locked">Tạm khóa</SelectItem>
              </SelectContent>
            </Select>
          </FilterField>
        </TableToolbar>

        {pageRows.length === 0 ? (
          <EmptyState />
        ) : (
          <ScrollTable>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã tài khoản</TableHead>
                  <TableHead>Họ và tên</TableHead>
                  <TableHead>Tên đăng nhập</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Chức vụ</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày cập nhật</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageRows.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-mono text-xs">{a.code}</TableCell>
                    <TableCell className="whitespace-nowrap font-medium">{a.fullName}</TableCell>
                    <TableCell>{a.username}</TableCell>
                    <TableCell className="text-muted-foreground">{a.phone}</TableCell>
                    <TableCell className="whitespace-nowrap">{a.position}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {a.roles.map((r) => (
                          <Pill key={r} tone="info">{ROLE_SHORT[r]}</Pill>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Pill tone={a.active ? "success" : "danger"}>{a.active ? "Hoạt động" : "Tạm khóa"}</Pill>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{a.updatedAt}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" title="Xem chi tiết" onClick={() => setDetail(a)}>
                          <Eye className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Sửa" onClick={() => setDetail(a)}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Đặt lại mật khẩu" onClick={() => setResetTarget(a)}>
                          <KeyRound className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title={a.active ? "Tạm khóa" : "Kích hoạt"}
                          onClick={() => {
                            toggleAccount(a.id);
                            toast.success(a.active ? "Đã tạm khóa tài khoản" : "Đã kích hoạt tài khoản");
                          }}
                        >
                          {a.active ? <ToggleRight className="size-4 text-success" /> : <ToggleLeft className="size-4 text-muted-foreground" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollTable>
        )}
        <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onChange={setPage} />
      </TableCard>

      <Dialog open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Thông tin tài khoản</DialogTitle>
            <DialogDescription>Cập nhật thông tin và gán vai trò cho tài khoản.</DialogDescription>
          </DialogHeader>
          {detail && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Họ và tên</Label>
                <Input defaultValue={detail.fullName} maxLength={100} />
              </div>
              <div className="space-y-1.5">
                <Label>Tên đăng nhập</Label>
                <Input defaultValue={detail.username} disabled />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Số điện thoại</Label>
                <Input defaultValue={detail.phone} maxLength={255} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Chức vụ</Label>
                <Input defaultValue={detail.position} maxLength={120} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Vai trò được gán</Label>
                <div className="flex flex-wrap gap-1.5 rounded-md border border-border p-2">
                  {detail.roles.map((r) => (
                    <Pill key={r} tone="info"><ShieldCheck className="size-3" />{ROLE_LABEL[r]}</Pill>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetail(null)}>Đóng</Button>
            <Button onClick={() => { setDetail(null); toast.success("Đã lưu thông tin tài khoản"); }}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Thêm tài khoản mới</DialogTitle>
            <DialogDescription>Tài khoản mới sẽ được gán vai trò trước khi sử dụng hệ thống.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Họ và tên</Label><Input placeholder="Nguyễn Văn A" maxLength={100} /></div>
            <div className="space-y-1.5"><Label>Tên đăng nhập</Label><Input placeholder="a.nguyen" maxLength={64} /></div>
            <div className="space-y-1.5 sm:col-span-2"><Label>Số điện thoại</Label><Input placeholder="a.nguyen" maxLength={255} /></div>
            <div className="space-y-1.5 sm:col-span-2"><Label>Chức vụ</Label><Input placeholder="Giáo viên Toán" maxLength={120} /></div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Vai trò</Label>
              <Select defaultValue="GVBM">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(ROLE_LABEL) as RoleCode[]).map((r) => (
                    <SelectItem key={r} value={r}>{ROLE_LABEL[r]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Hủy</Button>
            <Button onClick={() => { setCreateOpen(false); toast.success("Đã tạo tài khoản mới (dữ liệu mẫu)"); }}>Tạo tài khoản</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ActionDialog
        open={!!resetTarget}
        onOpenChange={(v) => !v && setResetTarget(null)}
        title="Đặt lại mật khẩu"
        description={`Đặt lại mật khẩu cho tài khoản ${resetTarget?.fullName ?? ""}.`}
        confirmLabel="Đặt lại mật khẩu"
        requireReason
        reasonLabel="Lý do đặt lại"
        onConfirm={() => toast.success("Đã đặt lại mật khẩu cho tài khoản")}
      />
    </div>
  );
}
