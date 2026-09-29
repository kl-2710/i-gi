import { useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface ActionDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  confirmLabel: string;
  requireReason?: boolean;
  reasonLabel?: string;
  destructive?: boolean;
  children?: ReactNode;
  onConfirm: (reason: string) => void;
}

/** Dùng chung cho: xác nhận, duyệt, yêu cầu chỉnh sửa, khóa, mở khóa, lưu trữ, khôi phục. */
export function ActionDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  requireReason = false,
  reasonLabel = "Lý do",
  destructive = false,
  children,
  onConfirm,
}: ActionDialogProps) {
  const [reason, setReason] = useState("");
  const [touched, setTouched] = useState(false);
  const invalid = requireReason && reason.trim().length < 5;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) {
          setReason("");
          setTouched(false);
        }
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        {requireReason && (
          <div className="space-y-2">
            <Label htmlFor="reason">
              {reasonLabel} <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="reason"
              rows={3}
              placeholder="Nhập lý do (tối thiểu 5 ký tự)..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              onBlur={() => setTouched(true)}
              maxLength={300}
            />
            {touched && invalid && (
              <p className="text-xs text-destructive">Vui lòng nhập lý do hợp lệ.</p>
            )}
            <p className="text-xs text-muted-foreground">
              Thao tác này sẽ được ghi vào lịch sử thao tác của hệ thống.
            </p>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            variant={destructive ? "destructive" : "default"}
            disabled={invalid}
            onClick={() => {
              onConfirm(reason.trim() || "-");
              onOpenChange(false);
              setReason("");
            }}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
