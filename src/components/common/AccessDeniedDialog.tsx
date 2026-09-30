import { LockKeyhole } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AccessDeniedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AccessDeniedDialog({
  open,
  onOpenChange,
}: AccessDeniedDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <LockKeyhole className="size-6" />
          </div>

          <AlertDialogTitle className="text-center">
            Không có quyền truy cập
          </AlertDialogTitle>

          <AlertDialogDescription className="text-center leading-relaxed">
            Bạn không có quyền truy cập chức năng này.
            <br />
            Vui lòng liên hệ quản trị viên nếu bạn cần được cấp quyền.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogAction className="w-full sm:w-auto">
            Đã hiểu
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}