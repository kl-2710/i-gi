import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  ACCOUNTS,
  INITIAL_AUDIT,
  NOTIFICATIONS,
  buildLessonBooks,
  HOC_KY,
  NAM_HOC,
} from "./mock-data";
import { ROLE_PERMISSIONS } from "./permissions";
import type {
  AuditEntry,
  BookStatus,
  LessonBook,
  Permission,
  RoleCode,
  UserAccount,
} from "./types";
import { ROLE_SHORT, STATUS_LABEL } from "./types";

interface Ctx {
  user: UserAccount | null;
  role: RoleCode | null;
  login: (username: string) => boolean;
  logout: () => void;
  setRole: (r: RoleCode) => void;
  can: (p: Permission) => boolean;
  books: LessonBook[];
  scopedBooks: LessonBook[];
  audit: AuditEntry[];
  notifications: typeof NOTIFICATIONS;
  accounts: UserAccount[];
  toggleAccount: (id: string) => void;
  updateBook: (id: string, patch: Partial<LessonBook>, action: string, to: BookStatus, reason?: string) => void;
  generated: boolean;
  setGenerated: (v: boolean) => void;
  ppctUploaded: boolean;
  setPpctUploaded: (v: boolean) => void;
  tkbUploaded: boolean;
  setTkbUploaded: (v: boolean) => void;
  year: string;
  semester: string;
}

const AppCtx = createContext<Ctx | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [role, setRoleState] = useState<RoleCode | null>(null);
  const [books, setBooks] = useState<LessonBook[]>(() => buildLessonBooks());
  const [audit, setAudit] = useState<AuditEntry[]>(INITIAL_AUDIT);
  const [accounts, setAccounts] = useState<UserAccount[]>(ACCOUNTS);
  const [generated, setGenerated] = useState(true);
  const [ppctUploaded, setPpctUploaded] = useState(true);
  const [tkbUploaded, setTkbUploaded] = useState(true);

  const login = useCallback((username: string) => {
    const found = accounts.find((a) => a.username === username.trim().toLowerCase() && a.active);
    if (!found) return false;
    setUser(found);
    setRoleState(found.roles[0] ?? null);
    return true;
  }, [accounts]);

  const logout = useCallback(() => {
    setUser(null);
    setRoleState(null);
  }, []);

  const can = useCallback(
    (p: Permission) => (role ? ROLE_PERMISSIONS[role].includes(p) : false),
    [role],
  );

  const scopedBooks = useMemo(() => {
    if (!user || !role) return [];
    if (role === "GVBM") return books.filter((b) => b.teacher === user.fullName);
    if (role === "GVCN") return books.filter((b) => b.className === user.homeroomClass);
    if (role === "ADMIN") return [];
    return books;
  }, [books, user, role]);

  const updateBook = useCallback(
    (id: string, patch: Partial<LessonBook>, action: string, to: BookStatus, reason?: string) => {
      setBooks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...patch, status: to } : b)),
      );
      const target = books.find((b) => b.id === id);
      if (target && user && role) {
        setAudit((prev) => [
          {
            id: `A${Date.now()}`,
            at: new Date().toLocaleString("vi-VN", { hour12: false }),
            actor: user.fullName,
            role,
            action,
            target: `Tiết ${target.period} - ${target.className} - ${target.subject}`,
            recordCode: target.code,
            from: STATUS_LABEL[target.status],
            to: STATUS_LABEL[to],
            reason: reason ?? "-",
          },
          ...prev,
        ]);
      }
    },
    [books, user, role],
  );

  const toggleAccount = useCallback((id: string) => {
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a)));
  }, []);

  const notifications = useMemo(
    () => (role ? NOTIFICATIONS.filter((n) => n.roles.includes(role)) : []),
    [role],
  );

  const value: Ctx = {
    user,
    role,
    login,
    logout,
    setRole: setRoleState,
    can,
    books,
    scopedBooks,
    audit,
    notifications,
    accounts,
    toggleAccount,
    updateBook,
    generated,
    setGenerated,
    ppctUploaded,
    setPpctUploaded,
    tkbUploaded,
    setTkbUploaded,
    year: NAM_HOC,
    semester: HOC_KY,
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside AppStateProvider");
  return ctx;
}

export { ROLE_SHORT };
