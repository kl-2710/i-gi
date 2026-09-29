import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BookMarked, Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/lib/app-state";
import { DEMO_LOGINS } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Đăng nhập — Hệ thống quản lý sổ đầu bài THCS Khương Mai" },
      {
        name: "description",
        content:
          "Đăng nhập hệ thống quản lý sổ đầu bài Trường THCS Khương Mai dành cho giáo viên và cán bộ quản lý.",
      },
      { property: "og:title", content: "Đăng nhập — Hệ thống quản lý sổ đầu bài" },
      {
        property: "og:description",
        content: "Cổng đăng nhập hệ thống quản lý sổ đầu bài Trường THCS Khương Mai.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const ok = login(username);
      setLoading(false);
      if (ok) {
        toast.success("Đăng nhập thành công");
        navigate({ to: "/dashboard" });
      } else {
        setError("Tên đăng nhập không tồn tại hoặc tài khoản đang bị tạm khóa.");
      }
    }, 600);
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="flex min-h-[72px] items-center bg-navy px-4 py-3 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-white/10">
            <BookMarked className="size-5 text-navy-foreground" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight text-navy-foreground sm:text-base">
              HỆ THỐNG QUẢN LÝ SỔ ĐẦU BÀI
            </p>
            <p className="text-xs text-navy-foreground/75">TRƯỜNG THCS KHƯƠNG MAI</p>
            <p className="text-[11px] text-navy-foreground/55">
              Đoàn kết – Trách nhiệm – Sáng tạo – Phát triển
            </p>
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-[480px]">
          <div className="rounded-xl border border-border bg-card p-6 shadow-panel sm:p-8">
            <div className="flex flex-col items-center text-center">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                <BookMarked className="size-6 text-primary" />
              </div>
              <h1 className="mt-3 text-xl font-semibold tracking-tight">Đăng nhập</h1>
              <p className="mt-1 text-sm text-muted-foreground">Hệ thống quản lý sổ đầu bài</p>
              <p className="text-sm text-muted-foreground">Trường THCS Khương Mai</p>
            </div>

            <form className="mt-6 space-y-4" onSubmit={submit}>
              <div className="space-y-2">
                <Label htmlFor="username">Tên đăng nhập</Label>
                <Input
                  id="username"
                  value={username}
                  maxLength={64}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập tên đăng nhập"
                  autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={show ? "text" : "password"}
                    value={password}
                    maxLength={64}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
                    aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Checkbox checked={remember} onCheckedChange={(v) => setRemember(Boolean(v))} />
                  Ghi nhớ đăng nhập
                </label>
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                  onClick={() => toast.info("Vui lòng liên hệ quản trị hệ thống để đặt lại mật khẩu.")}
                >
                  Quên mật khẩu?
                </button>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
                Đăng nhập
              </Button>
            </form>

            <div className="mt-6 rounded-lg border border-border bg-surface p-3">
              <p className="text-xs font-medium text-foreground">Tài khoản dùng thử (mật khẩu bất kỳ)</p>
              <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
                {DEMO_LOGINS.map((d) => (
                  <button
                    key={d.username}
                    type="button"
                    onClick={() => {
                      setUsername(d.username);
                      setPassword("123456");
                    }}
                    className="flex items-center justify-between rounded-md border border-border bg-card px-2.5 py-1.5 text-left text-xs hover:border-primary/50"
                  >
                    <span className="font-medium">{d.username}</span>
                    <span className="text-muted-foreground">{d.role}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-navy px-4 py-4 text-center text-xs text-navy-foreground/80">
        © 2026 Trường THCS Khương Mai
      </footer>
    </div>
  );
}
