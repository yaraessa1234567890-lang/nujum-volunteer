import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { actions, statusLabels, useAppState } from "@/lib/store";
import { PageHeader, Panel } from "@/components/Section";

type Search = { opp: string };

export const Route = createFileRoute("/register")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    opp: typeof search["opp"] === "string" ? (search["opp"] as string) : "",
  }),
  head: () => ({
    meta: [
      { title: "سجلي ساعات تطوعك | مدرسة صفية بنت عبد المطلب" },
      {
        name: "description",
        content: "نموذج تسجيل الساعات التطوعية للطالبات، يُرسل تلقائياً إلى لوحة جهة التطوع للاعتماد.",
      },
      { property: "og:title", content: "سجلي ساعات تطوعك" },
      { property: "og:description", content: "أرسلي ساعاتك التطوعية لتُعتمد مباشرة من جهة التطوع." },
    ],
  }),
  component: RegisterPage,
});

const YEARS = ["الصف الأول المتوسط", "الصف الثاني المتوسط", "الصف الثالث المتوسط", "الأول الثانوي", "الثاني الثانوي", "الثالث الثانوي"];

function RegisterPage() {
  const { opp } = Route.useSearch();
  const { opportunities, submissions } = useAppState();
  const [form, setForm] = useState({
    name: "",
    year: "",
    section: "",
    opportunity: opp ?? "",
    hours: "",
    date: new Date().toISOString().slice(0, 10),
    description: "",
  });
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    actions.addSubmission({
      name: form.name.trim(),
      year: form.year,
      section: form.section.trim(),
      opportunity: form.opportunity,
      hours: Number(form.hours) || 0,
      date: form.date,
      description: form.description.trim(),
    });
    setSent(true);
    setForm((f) => ({ ...f, hours: "", description: "" }));
    setTimeout(() => setSent(false), 5000);
  }

  const mine = submissions.filter((s) => s.name === form.name.trim() && form.name.trim().length > 0);

  return (
    <>
      <PageHeader
        badge="سجلي تطوعك"
        title="تسجيل الساعات التطوعية"
        subtitle="بمجرد الإرسال تُنقل بياناتك تلقائياً ولحظياً إلى لوحة تحكم جهة التطوع بحالة «قيد الانتظار»."
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Panel title="نموذج تسجيل الساعات">
          {sent && (
            <p className="mb-4 rounded-lg bg-primary/10 p-3 text-sm font-semibold text-primary">
              تم إرسال سجلك بنجاح إلى جهة التطوع، حالته الآن: قيد الانتظار.
            </p>
          )}
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={submit}>
            <label className="sm:col-span-2 text-sm font-semibold">
              اسم الطالبة الثلاثي
              <input required className="field mt-1" value={form.name} onChange={set("name")} />
            </label>
            <label className="text-sm font-semibold">
              السنة الدراسية
              <select required className="field mt-1" value={form.year} onChange={set("year")}>
                <option value="">اختاري السنة</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold">
              الفصل / الشعبة
              <input required className="field mt-1" value={form.section} onChange={set("section")} placeholder="مثال: ٢/٣" />
            </label>
            <label className="text-sm font-semibold">
              المجال / الفرصة التطوعية
              <select required className="field mt-1" value={form.opportunity} onChange={set("opportunity")}>
                <option value="">اختاري الفرصة</option>
                {opportunities.map((o) => (
                  <option key={o.id} value={o.title}>
                    {o.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold">
              عدد الساعات التطوعية
              <input required type="number" min="1" step="0.5" className="field mt-1" value={form.hours} onChange={set("hours")} />
            </label>
            <label className="text-sm font-semibold">
              تاريخ المشاركة
              <input required type="date" className="field mt-1" value={form.date} onChange={set("date")} />
            </label>
            <label className="sm:col-span-2 text-sm font-semibold">
              وصف المهمة التطوعية
              <textarea required rows={4} className="field mt-1" value={form.description} onChange={set("description")} />
            </label>
            <button className="btn-primary sm:col-span-2" type="submit">
              إرسال السجل لجهة التطوع
            </button>
          </form>
        </Panel>

        <Panel title="حالة سجلاتي">
          {mine.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              اكتبي اسمك في النموذج لتظهر هنا حالة سجلاتك السابقة بشكل مباشر.
            </p>
          ) : (
            <ul className="space-y-3">
              {mine.map((s) => (
                <li key={s.id} className="rounded-lg border border-border p-3 text-sm">
                  <p className="font-bold">{s.opportunity}</p>
                  <p className="text-muted-foreground">
                    {s.hours} ساعات · {s.date}
                  </p>
                  <span
                    className={
                      s.status === "approved"
                        ? "mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary"
                        : s.status === "rejected"
                          ? "mt-2 inline-block rounded-full bg-destructive/10 px-3 py-1 text-xs font-bold text-destructive"
                          : "mt-2 inline-block rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-secondary"
                    }
                  >
                    {statusLabels[s.status]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
