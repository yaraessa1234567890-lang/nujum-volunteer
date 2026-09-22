import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { ENTITY_PASSCODE, actions, useAppState } from "@/lib/store";
import { PalmIcon, SchoolCrest } from "./PalmMotif";

export function RoleGate() {
  const { role } = useAppState();
  const router = useRouter();
  const [mode, setMode] = useState<"choose" | "pin">("choose");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  if (role) return null;

  function submitPin(e: React.FormEvent) {
    e.preventDefault();
    if (pin.trim() === ENTITY_PASSCODE) {
      actions.setRole("entity");
      setPin("");
      setError("");
      router.navigate({ to: "/admin" });
    } else {
      setError("رمز الدخول غير صحيح، يرجى المحاولة مرة أخرى");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/70 p-4 backdrop-blur-sm">
      <div className="card-surface najdi-pattern w-full max-w-xl overflow-hidden p-0">
        <div className="najdi-band" />
        <div className="bg-card/95 p-7 text-center">
          <div className="flex justify-center">
            <SchoolCrest className="h-16 w-16" />
          </div>
          <h1 className="mt-4 text-2xl leading-snug">
            منصة التطوع ودعم الشراكة المجتمعية
          </h1>
          <p className="mt-1 font-semibold text-primary">مدرسة صفية بنت عبد المطلب</p>

          {mode === "choose" ? (
            <div className="mt-7 grid gap-3">
              <button className="btn-primary w-full py-3 text-base" onClick={() => actions.setRole("student")}>
                <PalmIcon className="h-5 w-5" />
                دخول كـ طالبة متطوعة
              </button>
              <button className="btn-clay w-full py-3 text-base" onClick={() => setMode("pin")}>
                دخول كـ جهة التطوع
              </button>
              <p className="text-xs text-muted-foreground">
                دخول جهة التطوع محمي برمز خاص، أما دخول الطالبات فمباشر بدون رمز.
              </p>
            </div>
          ) : (
            <form className="mt-7 space-y-3 text-right" onSubmit={submitPin}>
              <label className="block text-sm font-semibold">رمز الدخول لجهة التطوع</label>
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
                <button type="submit" className="btn-primary flex-1">تحقق ودخول</button>
                <button type="button" className="btn-ghost" onClick={() => setMode("choose")}>
                  رجوع
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
