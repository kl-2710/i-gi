import { useRef, useState } from "react";
import { CheckCircle2, FileSpreadsheet, TriangleAlert, Upload, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function FileUpload({
  accept = ".xlsx,.xls",
  hint = "Chỉ hỗ trợ tệp Excel (.xlsx, .xls), dung lượng tối đa 10MB",
  suggestedName,
  onUploaded,
}: {
  accept?: string;
  hint?: string;
  suggestedName: string;
  onUploaded: (fileName: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);

  const simulate = (name: string) => {
    setProgress(0);
    let p = 0;
    const timer = setInterval(() => {
      p += 12;
      setProgress(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setProgress(null);
          onUploaded(name);
        }, 300);
      }
    }, 120);
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const f = e.dataTransfer.files?.[0];
          simulate(f?.name ?? suggestedName);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-surface px-6 py-10 text-center transition-colors hover:border-primary/60",
          drag && "border-primary bg-primary/5",
        )}
      >
        <div className="rounded-full bg-primary/10 p-3">
          <Upload className="size-6 text-primary" />
        </div>
        <p className="text-sm font-medium text-foreground">Kéo thả tệp vào đây hoặc chọn tệp từ máy tính</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          <FileSpreadsheet className="size-4" />
          Chọn tệp
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => simulate(e.target.files?.[0]?.name ?? suggestedName)}
        />
      </div>
      {progress !== null && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Đang tải tệp lên hệ thống...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
      )}
    </div>
  );
}

export function ValidationResult({
  total,
  valid,
  errors,
  warnings,
  issues,
}: {
  total: number;
  valid: number;
  errors: number;
  warnings: number;
  issues: string[];
}) {
  const items = [
    { label: "Tổng số dòng", value: total, tone: "text-foreground", icon: FileSpreadsheet },
    { label: "Dòng hợp lệ", value: valid, tone: "text-success", icon: CheckCircle2 },
    { label: "Dòng lỗi", value: errors, tone: "text-destructive", icon: XCircle },
    { label: "Cảnh báo", value: warnings, tone: "text-warning-foreground", icon: TriangleAlert },
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {items.map((i) => (
          <div key={i.label} className="rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <i.icon className="size-4" />
              {i.label}
            </div>
            <p className={cn("mt-1 text-2xl font-semibold tabular-nums", i.tone)}>
              {i.value.toLocaleString("vi-VN")}
            </p>
          </div>
        ))}
      </div>
      {issues.length > 0 && (
        <div className="rounded-xl border border-warning/40 bg-warning/10 p-4">
          <p className="text-sm font-medium text-foreground">Các vấn đề cần kiểm tra</p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {issues.map((s) => (
              <li key={s} className="flex items-start gap-2">
                <TriangleAlert className="mt-0.5 size-3.5 shrink-0 text-warning-foreground" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
