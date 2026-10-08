import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { ACCOUNTS, INITIAL_AUDIT, NAM_HOC, NOTIFICATIONS, buildLessonBooks, HOC_KY } from "./mock-data";
import { ROLE_PERMISSIONS } from "./permissions";
import type { AuditEntry, BookStatus, LessonBook, Permission, RoleCode, UserAccount } from "./types";
import { ROLE_SHORT, STATUS_LABEL } from "./types";

type Confirmation = { by: string; at: string };
type WeeklyConfirmations = Record<string, Confirmation>;

function weekKey(className: string, weekNumber: number) {
  return `${NAM_HOC}|${className}|W${weekNumber}`;
}

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
  updateProfile: (patch: Partial<UserAccount>) => void;
  deleteAccount: (id: string) => void;
  updateBook: (id: string, patch: Partial<LessonBook>, action: string, to: BookStatus, reason?: string) => void;
  confirmGvcnWeek: (className: string, weekNumber: number) => { ok: boolean; message: string };
  weeklyGvcnConfirmations: WeeklyConfirmations;
  isGvcnWeekConfirmed: (className: string, weekNumber: number) => boolean;
  bghConfirmations: Record<string, Confirmation>;
  bghConfirmed: boolean;
  bghConfirmAt: Confirmation | null;
  confirmBgh: (className: string) => { ok: boolean; message: string };
  isBghConfirmed: (className: string) => boolean;
  lockAllBooks: () => { ok: boolean; message: string };
  generated: boolean;
  setGenerated: (v: boolean) => void;
  ppctUploaded: boolean;
  setPpctUploaded: (v: boolean) => void;
  tkbUploaded: boolean;
  setTkbUploaded: (v: boolean) => void;
  year: string;
  semester: string;
  yearEndReached: boolean;
}

const AppCtx = createContext<Ctx | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [role, setRoleState] = useState<RoleCode | null>(null);
  const [books, setBooks] = useState<LessonBook[]>(() => buildLessonBooks());
  const [audit, setAudit] = useState<AuditEntry[]>(INITIAL_AUDIT);
  const [accounts, setAccounts] = useState<UserAccount[]>(ACCOUNTS);
  const [weeklyGvcnConfirmations, setWeeklyGvcnConfirmations] = useState<WeeklyConfirmations>(() => {
    const seed: WeeklyConfirmations = {};
    buildLessonBooks().forEach((book) => {
      if (book.gvcnConfirm) {
        seed[weekKey(book.className, book.weekNumber)] = book.gvcnConfirm;
      }
    });
    return seed;
  });
  const [bghConfirmations, setBghConfirmations] = useState<Record<string, Confirmation>>({});
  const [generated, setGenerated] = useState(false);
  const [ppctUploaded, setPpctUploaded] = useState(true);
  const [tkbUploaded, setTkbUploaded] = useState(true);

  const login = useCallback((username: string) => {
    const found = accounts.find((a) => a.username === username.trim().toLowerCase());
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
    (p: Permission) => {
      if (!user) return false;
      if (user.roles.some((r) => ROLE_PERMISSIONS[r].includes(p))) return true;
      return role ? ROLE_PERMISSIONS[role].includes(p) : false;
    },
    [role, user],
  );

  const scopedBooks = useMemo(() => {
    if (!user || !role) return [];
    const isGvbm = user.roles.includes("GVBM") || role === "GVBM";
    const isGvcn = user.roles.includes("GVCN") || role === "GVCN";
    if (isGvbm && isGvcn) return books.filter((b) => b.teacher === user.fullName || b.className === user.homeroomClass);
    if (isGvbm) return books.filter((b) => b.teacher === user.fullName);
    if (isGvcn) return books.filter((b) => b.className === user.homeroomClass);
    if (role === "ADMIN" || role === "BGH" || role === "TPT") return books;
    return books;
  }, [books, user, role]);

  const updateBook = useCallback(
    (id: string, patch: Partial<LessonBook>, action: string, to: BookStatus, reason?: string) => {
      setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch, status: to } : b)));
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

  const confirmGvcnWeek = useCallback(
    (className: string, weekNumber: number) => {
      if (!user?.roles.includes("GVCN") && role !== "GVCN") return { ok: false, message: "Chỉ giáo viên chủ nhiệm mới được xác nhận theo tuần." };
      if (user?.homeroomClass !== className) return { ok: false, message: "Bạn chỉ được xác nhận lớp chủ nhiệm của mình." };

      const rows = books.filter((b) => b.className === className && b.weekNumber === weekNumber);
      if (rows.length === 0) return { ok: false, message: "Không tìm thấy dữ liệu của tuần." };
      if (rows.some((b) => !b.gvbmConfirm)) {
        return { ok: false, message: "Chưa thể xác nhận: tất cả tiết học trong tuần phải được GVBM xác nhận." };
      }
      if (rows.some((b) => b.status === "da_khoa")) {
        return { ok: false, message: "Tuần đã được khóa, không thể xác nhận." };
      }

      const now = new Date().toLocaleString("vi-VN", { hour12: false });
      const key = weekKey(className, weekNumber);
      setWeeklyGvcnConfirmations((prev) => ({ ...prev, [key]: { by: user.fullName, at: now } }));
      setBooks((prev) =>
        prev.map((b) =>
          b.className === className && b.weekNumber === weekNumber
            ? { ...b, status: "xac_nhan_gvcn", gvcnConfirm: { by: user.fullName, at: now } }
            : b,
        ),
      );
      setAudit((prev) => [
        {
          id: `A${Date.now()}`,
          at: now,
          actor: user.fullName,
          role,
          action: "Xác nhận Sổ đầu bài theo tuần",
          target: `Lớp ${className} - Tuần ${weekNumber}`,
          recordCode: `SDBT-${className}-W${weekNumber}`,
          from: "Các tiết đã được GVBM xác nhận",
          to: "Đã xác nhận GVCN",
          reason: "Tất cả tiết trong tuần đã được GVBM xác nhận",
        },
        ...prev,
      ]);
      return { ok: true, message: `Đã xác nhận Sổ đầu bài tuần ${weekNumber} của lớp ${className}.` };
    },
    [books, role, user],
  );

  const isGvcnWeekConfirmed = useCallback(
    (className: string, weekNumber: number) => Boolean(weeklyGvcnConfirmations[weekKey(className, weekNumber)]),
    [weeklyGvcnConfirmations],
  );

  const yearEndReached = useMemo(() => {
    const end = new Date("2027-05-31T23:59:59");
    return new Date() >= end;
  }, []);

  const classesWithBooks = useMemo(
    () => Array.from(new Set(books.map((b) => b.className))),
    [books],
  );

  const bghConfirmed = useMemo(
    () => classesWithBooks.length > 0 && classesWithBooks.every((className) => Boolean(bghConfirmations[className])),
    [classesWithBooks, bghConfirmations],
  );

  const bghConfirmAt = useMemo(() => {
    const confirmations = Object.values(bghConfirmations);
    return confirmations.length > 0 ? confirmations[confirmations.length - 1] ?? null : null;
  }, [bghConfirmations]);

  const isBghConfirmed = useCallback(
    (className: string) => Boolean(bghConfirmations[className]),
    [bghConfirmations],
  );

  const confirmBgh = useCallback(
    (className: string) => {
      if (role !== "BGH") return { ok: false, message: "Chỉ BGH được phép xác nhận Sổ đầu bài." };
      if (!yearEndReached) return { ok: false, message: "Chỉ được xác nhận Sổ đầu bài sau khi kết thúc năm học." };
      const rows = books.filter((b) => b.className === className);
      if (rows.length === 0) return { ok: false, message: "Không tìm thấy Sổ đầu bài của lớp được chọn." };
      const weeks = new Set(rows.map((b) => weekKey(b.className, b.weekNumber)));
      const missing = [...weeks].filter((key) => !weeklyGvcnConfirmations[key]);
      if (missing.length > 0) return { ok: false, message: "Chưa thể xác nhận: vẫn còn tuần chưa được GVCN xác nhận." };
      if (bghConfirmations[className]) return { ok: false, message: "Sổ đầu bài của lớp này đã được BGH xác nhận." };

      const now = new Date().toLocaleString("vi-VN", { hour12: false });
      const by = user?.fullName ?? "Ban Giám hiệu";
      setBghConfirmations((prev) => ({ ...prev, [className]: { by, at: now } }));
      setBooks((prev) => prev.map((b) => (b.className === className ? { ...b, status: "xac_nhan_bgh" } : b)));
      setAudit((prev) => [
        {
          id: `A${Date.now()}`,
          at: now,
          actor: by,
          role: "BGH",
          action: "Xác nhận Sổ đầu bài",
          target: `Lớp ${className} - Năm học ${NAM_HOC}`,
          recordCode: `SDB-${NAM_HOC}-${className}`,
          from: "Đã xác nhận GVCN đầy đủ",
          to: "Đã xác nhận BGH",
          reason: "Kết thúc năm học và các tuần đã được GVCN xác nhận",
        },
        ...prev,
      ]);
      return { ok: true, message: `Đã xác nhận Sổ đầu bài lớp ${className}.` };
    },
    [books, role, user, weeklyGvcnConfirmations, yearEndReached, bghConfirmations],
  );
  const lockAllBooks = useCallback(() => {
    if (role !== "BGH") return { ok: false, message: "Chỉ BGH được phép khóa Sổ đầu bài." };
    if (!bghConfirmed) return { ok: false, message: "Cần xác nhận Sổ đầu bài bởi BGH trước khi khóa." };

    const now = new Date().toLocaleString("vi-VN", { hour12: false });
    const by = user?.fullName ?? "Ban Giám hiệu";
    setBooks((prev) => prev.map((b) => ({ ...b, status: "da_khoa", lockedBy: { by, at: now } })));
    setAudit((prev) => [
      {
        id: `A${Date.now()}`,
        at: now,
        actor: by,
        role: "BGH",
        action: "Khóa Sổ đầu bài",
        target: `Sổ đầu bài năm học ${NAM_HOC}`,
        recordCode: `SDB-${NAM_HOC}`,
        from: "Đã xác nhận BGH",
        to: "Đã khóa",
        reason: "Thực hiện khóa sau khi BGH xác nhận",
      },
      ...prev,
    ]);
    return { ok: true, message: "Đã khóa Sổ đầu bài toàn trường." };
  }, [bghConfirmed, role, user]);

  const updateProfile = useCallback((patch: Partial<UserAccount>) => {
    if (!user) return;
    const next = { ...user, ...patch };
    setUser(next);
    setAccounts((prev) => prev.map((a) => a.id === user.id ? { ...a, ...patch, updatedAt: new Date().toLocaleDateString("vi-VN") } : a));
  }, [user]);

  const deleteAccount = useCallback((id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    setUser((current) => current?.id === id ? null : current);
  }, []);

  const notifications = useMemo(
    () => (role ? NOTIFICATIONS.filter((n) => n.roles.includes(role)) : []),
    [role],
  );

  return (
    <AppCtx.Provider
      value={{
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
        updateProfile,
        deleteAccount,
        updateBook,
        confirmGvcnWeek,
        weeklyGvcnConfirmations,
        isGvcnWeekConfirmed,
        bghConfirmations,
        bghConfirmed,
        bghConfirmAt,
        confirmBgh,
        isBghConfirmed,
        lockAllBooks,
        generated,
        setGenerated,
        ppctUploaded,
        setPpctUploaded,
        tkbUploaded,
        setTkbUploaded,
        year: NAM_HOC,
        semester: HOC_KY,
        yearEndReached,
      }}
    >
      {children}
    </AppCtx.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside AppStateProvider");
  return ctx;
}

export { ROLE_SHORT };
