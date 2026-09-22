import { useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { ENTITY_PASSCODE, actions, useAppState } from "@/lib/store";
import { SchoolCrest } from "./PalmMotif";

const studentLinks = [
  { to: "/", label: "الفرص والمبادرات" },
  { to: "/register", label: "سجلي تطوعك" },
  { to: "/gallery", label: "التوثيق والمعرض" },
  { to: "/achievements", label: "سجل الإنجازات" },
  { to: "/forms", label: "شاركينا والشهادات" },
  { to: "/impact", label: "التقييم وقياس الأثر" },
] as const;

export function Navbar() {
  const { role } = useAppState();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  function switchRole() {
    if (role === "entity") {
      actions.setRole("student");
      router.navigate({ to: "/" });
    } else {
      setPin("");
      setError("");
      setPinOpen(true);
    }
  }

  function submitPin(e: React.FormEvent) {
    e.preventDefault();
    if (pin.trim() === ENTITY_PASSCODE) {
      actions.setRole("entity");
      setPinOpen(false);
      router.navigate({ to: "/admin" });
    } else {
      setError("رمز الدخول غير صحيح، يرجى المحاولة مرة أخرى");
    }
  }

  return (
    <header className="no-print sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
      <div className="najdi-band" />
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <SchoolCrest />
          <span className="leading-tight">
            <span className="block text-base font-extrabold">مدرسة صفية بنت عبد المطلب</span>
            <span className="block text-xs text-muted-foreground">منصة التطوع ودعم الشراكة المجتمعية</span>
          </span>
        </Link>

        <div className="ms-auto flex items-center gap-2">
          <span className="hidden rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground sm:inline">
            {role === "entity" ? "جهة التطوع" : "طالبة متطوعة"}
          </span>
          <button className="btn-ghost text-sm" onClick={switchRole}>
            {role === "entity" ? "التبديل لواجهة الطالبات" : "التبديل لجهة التطوع"}
          </button>
          <button className="btn-ghost text-sm lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="القائمة">
            ☰
          </button>
        </div>

        <nav
          className={`${open ? "flex" : "hidden"} w-full flex-col gap-1 lg:flex lg:w-auto lg:flex-row lg:flex-wrap lg:items-center`}
        >
          {studentLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeProps={{ className: "rounded-lg px-3 py-2 text-sm font-bold bg-primary/10 text-primary" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
          {role === "entity" && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-bold text-secondary"
              activeProps={{ className: "rounded-lg bg-clay/15 px-3 py-2 text-sm font-bold text-secondary" }}
            >
              لوحة تحكم جهة التطوع
            </Link>
          )}
        </nav>
      </div>

      {pinOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/70 p-4">
          <form onSubmit={submitPin} className="card-surface w-full max-w-sm space-y-3 p-6">
            <h2 className="text-lg">رمز الدخول لجهة التطوع</h2>
            <input
              autoFocus
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError("");
              }}
              className="field text-center text-lg tracking-[0.5em]"
              placeholder="••••"
            />
            {error && (
              <p className="rounded-md bg-destructive/10 p-2 text-sm font-semibold text-destructive">{error}</p>
            )}
            <div className="flex gap-2">
              <button type="submit" className="btn-primary flex-1">
                دخول
              </button>
              <button type="button" className="btn-ghost" onClick={() => setPinOpen(false)}>
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}
    </header>
  );
}
