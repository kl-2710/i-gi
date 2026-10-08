import { cn } from "@/lib/utils";
import { STATUS_LABEL, type BookStatus } from "@/lib/types";

const TONES: Record<BookStatus, string> = {
  he_thong_tao: "bg-secondary text-secondary-foreground border-border",
  chua_hoan_thien: "bg-warning/15 text-warning-foreground border-warning/40",
  da_cap_nhat: "bg-info/10 text-info border-info/30",
  xac_nhan_gvbm: "bg-primary/10 text-primary border-primary/30",
  xac_nhan_gvcn: "bg-primary/15 text-primary border-primary/40",
  cho_kiem_tra: "bg-warning/15 text-warning-foreground border-warning/40",
  yeu_cau_chinh_sua: "bg-destructive/10 text-destructive border-destructive/30",
  da_kiem_tra: "bg-info/12 text-info border-info/30",
  cho_duyet: "bg-warning/15 text-warning-foreground border-warning/40",
  da_duyet: "bg-success/12 text-success border-success/30",
  da_khoa: "bg-navy/10 text-navy border-navy/30",
  da_luu_tru: "bg-muted text-muted-foreground border-border",
  da_khoi_phuc: "bg-success/12 text-success border-success/30",
};

export function StatusBadge({ status, className }: { status: BookStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium",
        TONES[status],
        className,
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
}) {
  const tones = {
    neutral: "bg-secondary text-secondary-foreground border-border",
    success: "bg-success/12 text-success border-success/30",
    warning: "bg-warning/15 text-warning-foreground border-warning/40",
    danger: "bg-destructive/10 text-destructive border-destructive/30",
    info: "bg-info/10 text-info border-info/30",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

export function LessonStatusBadge({ status }: { status: BookStatus }) {
  const confirmed = status === "xac_nhan_gvbm" || status === "xac_nhan_gvcn" || status === "xac_nhan_bgh" || status === "da_khoa";
  return (
    <span className={cn(
      "inline-flex items-center whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium",
      confirmed
        ? "bg-primary/10 text-primary border-primary/30"
        : "bg-secondary text-secondary-foreground border-border",
    )}>
      {confirmed ? "GVBM đã xác nhận" : "-"}
    </span>
  );
}
