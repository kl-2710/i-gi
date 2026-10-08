import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, Plus, ShieldCheck, Trash2 } from "lucide-react";
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
import { useApp } from "@/lib/app-state";
import { ROLE_LABEL, type RoleCode } from "@/lib/types";
import { PERMISSION_GROUPS } from "@/lib/permissions";

type PermissionProfile = {
  key: string;
  label: string;
  description: string;
  roles: RoleCode[];
};

const PROFILES: PermissionProfile[] = [
  { key: "ADMIN", label: "Quản trị viên", description: "Quản lý tài khoản, phân quyền và quyền của hệ thống.", roles: ["ADMIN"] },
  { key: "BGH", label: "Ban Giám hiệu", description: "Thiết lập dữ liệu dạy học, hình thành và xác nhận Sổ đầu bài.", roles: ["BGH"] },
  { key: "TPT", label: "Tổng phụ trách", description: "Theo dõi Sổ đầu bài và báo cáo, thống kê theo phạm vi được phân quyền.", roles: ["TPT"] },
  { key: "GVBM", label: "Giáo viên bộ môn", description: "Xem, cập nhật và xác nhận các tiết dạy do giáo viên bộ môn thực hiện.", roles: ["GVBM"] },
  { key: "GVBM_GVCN", label: "Giáo viên chủ nhiệm kiêm giáo viên bộ môn", description: "Có toàn bộ quyền của Giáo viên bộ môn và bổ sung quyền của giáo viên chủ nhiệm.", roles: ["GVBM", "GVCN"] },
];

export const Route = createFileRoute("/_app/nguoi-dung/vai-tro")({
  head: () => ({ meta: [{ title: "Quản lý phân quyền — Sổ đầu bài THCS Khương Mai" }, { name: "description", content: "Danh sách các phân quyền và quyền thao tác được gắn với từng phân quyền." }] }),
  component: PermissionProfilesPage,
});

function PermissionProfilesPage() {
  const { can, accounts } = useApp();
  const [q, setQ] = useState("");
  const [detail, setDetail] = useState<PermissionProfile | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleted, setDeleted] = useState<Record<string, boolean>>({});
  const [deleteTarget, setDeleteTarget] = useState<PermissionProfile | null>(null);

  if (!can("role.manage")) {
    return <div><PageHeader title="Quản lý phân quyền" crumbs={[{ label: "Quản trị hệ thống" }, { label: "Quản lý phân quyền" }]} /><NoPermissionState message="Chỉ Quản trị viên được phép quản lý phân quyền." /></div>;
  }

  const profiles = PROFILES.filter((p) => !deleted[p.key] && p.label.toLowerCase().includes(q.toLowerCase()));


  return <div>
    <PageHeader title="Quản lý phân quyền" description="Danh sách phân quyền được sử dụng trong hệ thống." crumbs={[{ label: "Quản trị hệ thống" }, { label: "Quản lý phân quyền" }]} actions={<Button onClick={() => setCreateOpen(true)}><Plus className="size-4" />Thêm phân quyền</Button>} />
    <TableCard>
      <TableToolbar><SearchBar value={q} onChange={setQ} placeholder="Tìm phân quyền..." /></TableToolbar>
      {profiles.length === 0 ? <EmptyState /> : <ScrollTable><Table><TableHeader><TableRow>
        <TableHead>Phân quyền</TableHead><TableHead className="text-right">Thao tác</TableHead>
      </TableRow></TableHeader><TableBody>
        {profiles.map((p) => { return <TableRow key={p.key}>
          <TableCell className="whitespace-nowrap font-medium"><span className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary" />{p.label}</span></TableCell>
          <TableCell><div className="flex items-center justify-end gap-1">
            <Button variant="ghost" size="icon" title="Xem chi tiết" onClick={() => setDetail(p)}>
              <Eye className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Xóa phân quyền" onClick={() => setDeleteTarget(p)}>
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div></TableCell>
        </TableRow>; })}
      </TableBody></Table></ScrollTable>}
    </TableCard>

    <Dialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Xóa phân quyền</DialogTitle>
          <DialogDescription>
            Bạn có chắc muốn xóa phân quyền "{deleteTarget?.label ?? ""}" khỏi hệ thống?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>Hủy</Button>
          <Button variant="destructive" onClick={() => {
            if (deleteTarget) {
              setDeleted((prev) => ({ ...prev, [deleteTarget.key]: true }));
              setDeleteTarget(null);
              toast.success("Đã xóa phân quyền");
            }
          }}>Xóa phân quyền</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog open={!!detail} onOpenChange={(v) => !v && setDetail(null)}><DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
      <DialogHeader><DialogTitle>{detail?.label}</DialogTitle><DialogDescription>{detail?.description}</DialogDescription></DialogHeader>
      <div className="space-y-4">{PERMISSION_GROUPS.map((g) => { const items = g.items.filter((i) => detail?.roles.some((r) => i.roles.includes(r))); return items.length ? <div key={g.module}><p className="text-sm font-medium">{g.module}</p><div className="mt-1.5 flex flex-wrap gap-1.5">{items.map((i) => <Pill key={i.key} tone="success">{i.label}</Pill>)}</div></div> : null; })}</div>
      <DialogFooter><Button variant="outline" onClick={() => setDetail(null)}>Đóng</Button></DialogFooter>
    </DialogContent></Dialog>

    <Dialog open={createOpen} onOpenChange={setCreateOpen}><DialogContent className="sm:max-w-lg">
      <DialogHeader><DialogTitle>Thêm phân quyền</DialogTitle><DialogDescription>Tạo phân quyền mới để cấu hình các quyền được phép thực hiện.</DialogDescription></DialogHeader>
      <div className="space-y-3"><div className="space-y-1.5"><Label>Tên phân quyền</Label><Input placeholder="Nhập tên phân quyền" maxLength={80} /></div><div className="space-y-1.5"><Label>Mô tả</Label><Textarea rows={3} placeholder="Mô tả phạm vi thao tác của phân quyền" maxLength={300} /></div></div>
      <DialogFooter><Button variant="outline" onClick={() => setCreateOpen(false)}>Hủy</Button><Button onClick={() => { setCreateOpen(false); toast.success("Đã tạo phân quyền mới (dữ liệu mẫu)"); }}>Tạo phân quyền</Button></DialogFooter>
    </DialogContent></Dialog>
  </div>;
}