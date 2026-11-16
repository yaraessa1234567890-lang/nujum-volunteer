import { useState } from "react";
import { SchoolCrest } from "@/components/PalmMotif";
import { checkPasscode, setUnlockedClient } from "@/lib/site-gate";

export function PasscodeScreen({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (checkPasscode(code)) {
      setUnlockedClient();
      onUnlock();
    } else setError(true);
  }

  return (
    <div dir="rtl" className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="card-surface najdi-pattern w-full max-w-md overflow-hidden p-0">
        <div className="najdi-band" />
        <form onSubmit={onSubmit} className="bg-card/95 p-7 text-center">
          <div className="flex justify-center"><SchoolCrest className="h-16 w-16" /></div>
          <h1 className="mt-4 text-2xl">منصة التطوع ودعم الشراكة المجتمعية</h1>
          <p className="mt-1 font-semibold text-primary">مدرسة صفية بنت عبد المطلب</p>
          <label className="mt-6 block text-right text-sm font-semibold">الرمز السري للدخول</label>
          <input
            autoFocus
            type="password"
            inputMode="numeric"
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(false); }}
            className="field mt-2 text-center text-lg tracking-[0.5em]"
            placeholder="••••"
            aria-label="الرمز السري"
          />
          {error && <p className="mt-3 rounded-md bg-destructive/10 p-2 text-sm font-semibold text-destructive">الرمز غير صحيح، حاولي مرة أخرى</p>}
          <button type="submit" disabled={!code} className="btn-primary mt-4 w-full py-3">دخول</button>
        </form>
      </div>
    </div>
  );
}
