import { History } from "lucide-react";
import type { AuditEntry } from "@/lib/types";
import { ROLE_SHORT } from "@/lib/types";

export function AuditTimeline({ entries }: { entries: AuditEntry[] }) {
  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">Chưa có lịch sử thao tác cho bản ghi này.</p>;
  }
  return (
    <ol className="relative space-y-4 border-l border-border pl-5">
      {entries.map((e) => (
        <li key={e.id} className="relative">
          <span className="absolute -left-[26px] flex size-4 items-center justify-center rounded-full bg-primary/15">
            <History className="size-2.5 text-primary" />
          </span>
          <p className="text-sm font-medium text-foreground">{e.action}</p>
          <p className="text-xs text-muted-foreground">
            {e.actor} · {ROLE_SHORT[e.role]} · {e.at}
          </p>
          <p className="text-xs text-muted-foreground">
            {e.from} → <span className="text-foreground">{e.to}</span>
            {e.reason && e.reason !== "-" ? ` · Lý do: ${e.reason}` : ""}
          </p>
        </li>
      ))}
    </ol>
  );
}
