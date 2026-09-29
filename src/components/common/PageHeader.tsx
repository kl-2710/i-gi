import { Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";
import type { ReactNode } from "react";
import { useApp } from "@/lib/app-state";

export interface Crumb {
  label: string;
  to?: string;
}

export function PageHeader({
  title,
  description,
  crumbs = [],
  actions,
  showContext = true,
}: {
  title: string;
  description?: string;
  crumbs?: Crumb[];
  actions?: ReactNode;
  showContext?: boolean;
}) {
  const { year, semester } = useApp();
  return (
    <div className="mb-6 space-y-3">
      <nav className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
        <Link to="/dashboard" className="flex items-center gap-1 hover:text-primary">
          <Home className="size-3.5" />
          Trang chủ
        </Link>
        {crumbs.map((c) => (
          <span key={c.label} className="flex items-center gap-1">
            <ChevronRight className="size-3.5" />
            {c.to ? (
              <Link to={c.to} className="hover:text-primary">
                {c.label}
              </Link>
            ) : (
              <span className="text-foreground">{c.label}</span>
            )}
          </span>
        ))}
      </nav>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
          {showContext && (
            <p className="mt-1 text-xs text-muted-foreground">
              Năm học {year} · {semester}
            </p>
          )}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
