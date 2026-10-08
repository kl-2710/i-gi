import { useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  BookMarked,
  ChevronDown,
  LogOut,
  LockKeyhole,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  UserCog,
  X,
  UserCircle,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useApp } from "@/lib/app-state";
import { ROLE_LABEL, ROLE_SHORT } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AccessDeniedDialog } from "@/components/common/AccessDeniedDialog";
import { NAV_GROUPS } from "./nav-config";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Brand({ compact }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/90">
        <BookMarked className="size-5 text-primary-foreground" />
      </div>
      {!compact && (
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight text-navy-foreground">
            HỆ THỐNG QUẢN LÝ SỔ ĐẦU BÀI
          </p>
          <p className="text-[11px] text-navy-foreground/70">TRƯỜNG THCS KHƯƠNG MAI</p>
        </div>
      )}
    </div>
  );
}

function SidebarNav({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const { can } = useApp();
  const { pathname } = useLocation();
  const [accessDeniedOpen, setAccessDeniedOpen] = useState(false);

  const canAccess = (
    perms: typeof NAV_GROUPS[number]["items"][number]["perms"]
  ) => perms.length === 0 || perms.some((p) => can(p));

  const itemCls = (active: boolean) =>
    cn(
      "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
      active
        ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
        : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
    );

  return (
    <ScrollArea className="h-full">
      <nav className="space-y-5 p-3">

        {/* 4 MODULES */}
        {NAV_GROUPS.map((g) => (
          <div key={g.label} className="space-y-1">

            {!collapsed ? (
              <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-sidebar-foreground/50">
                {g.label}
              </p>
            ) : (
              <div className="mx-auto my-2 h-px w-6 bg-sidebar-border" />
            )}

            {g.items.map((i) => {
              const allowed = canAccess(i.perms);
              const active =
                pathname === i.to ||
                pathname.startsWith(i.to + "/");

              return (
                <Link
                  key={i.to}
                  to={i.to}
                  onClick={(event) => {
                    if (!allowed) {
                      event.preventDefault();
                      setAccessDeniedOpen(true);
                      return;
                    }

                    onNavigate?.();
                  }}
                  title={
                    allowed
                      ? i.label
                      : `${i.label} - Không có quyền truy cập`
                  }
                  className={cn(
                    itemCls(active),
                    !allowed && "opacity-65",
                  )}
                >
                  <i.icon className="size-4 shrink-0" />

                  {!collapsed && (
                    <span className="truncate">
                      {i.label}
                    </span>
                  )}

                  {!allowed && (
                    <LockKeyhole className="ml-auto size-3.5 shrink-0" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <AccessDeniedDialog
        open={accessDeniedOpen}
        onOpenChange={setAccessDeniedOpen}
      />
    </ScrollArea>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user, role, logout, notifications, year, semester, updateProfile } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [passwordOpen, setPasswordOpen] = useState(false);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user || !role) return null;

  const openProfile = () => { setProfileName(user.fullName); setProfilePhone(user.phone); setProfileOpen(true); };

  const initials = user.fullName
    .split(" ")
    .slice(-2)
    .map((s) => s[0])
    .join("");

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 bg-navy px-3 sm:px-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-navy-foreground hover:bg-white/10 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Mở menu"
          >
            <Menu className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden text-navy-foreground hover:bg-white/10 lg:inline-flex"
            onClick={() => setCollapsed((v) => !v)}
            aria-label="Thu gọn menu"
          >
            {collapsed ? <PanelLeftOpen className="size-5" /> : <PanelLeftClose className="size-5" />}
          </Button>
          <Brand />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden text-right text-[11px] leading-tight text-navy-foreground/80 md:block">
            <p>Năm học {year}</p>
            <p>{semester}</p>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-navy-foreground hover:bg-white/10"
                aria-label="Thông báo"
              >
                <Bell className="size-5" />
                {notifications.length > 0 && (
                  <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-destructive-foreground">
                    {notifications.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <div className="border-b border-border px-4 py-3">
                <p className="text-sm font-semibold">Trung tâm thông báo</p>
                <p className="text-xs text-muted-foreground">
                  Thông báo dành cho phân quyền {user.roles.includes("GVBM") && user.roles.includes("GVCN") ? "Giáo viên chủ nhiệm kiêm giáo viên bộ môn" : ROLE_LABEL[role]}
                </p>
              </div>
              <ScrollArea className="max-h-80">
                <ul className="divide-y divide-border">
                  {notifications.map((n) => (
                    <li key={n.id} className="px-4 py-3">
                      <div className="flex items-start gap-2">
                        <span
                          className={cn(
                            "mt-1.5 size-2 shrink-0 rounded-full",
                            n.type === "warning" && "bg-warning",
                            n.type === "success" && "bg-success",
                            n.type === "info" && "bg-info",
                          )}
                        />
                        <div>
                          <p className="text-sm text-foreground">{n.title}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{n.time}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                  {notifications.length === 0 && (
                    <li className="px-4 py-8 text-center text-sm text-muted-foreground">
                      Không có thông báo mới
                    </li>
                  )}
                </ul>
              </ScrollArea>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg px-1.5 py-1 text-left hover:bg-white/10">
                <span className="flex size-8 items-center justify-center rounded-full bg-white/15 text-xs font-semibold text-navy-foreground">
                  {initials}
                </span>
                <span className="hidden leading-tight sm:block">
                  <span className="block text-xs font-medium text-navy-foreground">{user.fullName}</span>
                  <span className="block text-[11px] text-navy-foreground/70">{ROLE_LABEL[role]}</span>
                </span>
                <ChevronDown className="size-4 text-navy-foreground/70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel>
                <p className="text-sm">{user.fullName}</p>
                <p className="text-xs font-normal text-muted-foreground">{user.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                Phân quyền: {user.roles.includes("GVBM") && user.roles.includes("GVCN") ? "Giáo viên chủ nhiệm kiêm giáo viên bộ môn" : ROLE_LABEL[role]}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={openProfile}><UserCircle className="size-4" />Hồ sơ cá nhân</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPasswordOpen(true)}><KeyRound className="size-4" />Thay đổi mật khẩu</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  logout();
                  navigate({ to: "/" });
                }}
              >
                <LogOut className="size-4" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex">
        <aside
          className={cn(
            "sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 border-r border-sidebar-border bg-sidebar transition-all lg:block",
            collapsed ? "w-16" : "w-72",
          )}
        >
          <SidebarNav collapsed={collapsed} />
        </aside>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />
            <div className="absolute left-0 top-0 h-full w-72 bg-sidebar">
              <div className="flex items-center justify-between border-b border-sidebar-border px-3 py-3">
                <Brand />
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-navy-foreground hover:bg-white/10"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Đóng menu"
                >
                  <X className="size-5" />
                </Button>
              </div>
              <div className="h-[calc(100%-3.5rem)]">
                <SidebarNav collapsed={false} onNavigate={() => setMobileOpen(false)} />
              </div>
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 p-4 sm:p-6">{children}</main>

        <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>Hồ sơ cá nhân</DialogTitle><DialogDescription>Xem và cập nhật thông tin cá nhân của người dùng đang đăng nhập.</DialogDescription></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5"><Label>Họ và tên</Label><Input value={profileName} onChange={(e) => setProfileName(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Tên đăng nhập</Label><Input value={user.username} disabled /></div>
              <div className="space-y-1.5"><Label>Số điện thoại</Label><Input value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Phân quyền</Label><Input value={ROLE_LABEL[role]} disabled /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setProfileOpen(false)}>Hủy</Button><Button onClick={() => { updateProfile({ fullName: profileName.trim(), phone: profilePhone.trim() }); setProfileOpen(false); }}>Lưu thay đổi</Button></DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>Thay đổi mật khẩu</DialogTitle><DialogDescription>Nhập mật khẩu mới để cập nhật mật khẩu tài khoản.</DialogDescription></DialogHeader>
            <div className="space-y-3"><div className="space-y-1.5"><Label>Mật khẩu mới</Label><Input type="password" /></div><div className="space-y-1.5"><Label>Xác nhận mật khẩu</Label><Input type="password" /></div></div>
            <DialogFooter><Button variant="outline" onClick={() => setPasswordOpen(false)}>Hủy</Button><Button onClick={() => { setPasswordOpen(false); }}>Lưu mật khẩu</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
