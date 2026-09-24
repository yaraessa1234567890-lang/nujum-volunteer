import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CATEGORIES, actions, approvedHours, statusLabels, useAppState } from "@/lib/store";
import { PageHeader, Panel, StatCard } from "@/components/Section";
import { RoleGate } from "@/components/RoleGate";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "لوحة تحكم جهة التطوع | مدرسة صفية بنت عبد المطلب" },
      {
        name: "description",
        content: "إدارة سجلات الطالبات واعتماد الساعات وطرح الفرص التطوعية ومتابعة المؤشرات لحظياً.",
      },
      { property: "og:title", content: "لوحة تحكم جهة التطوع" },
      { property: "og:description", content: "اعتماد ساعات الطالبات وإدارة الفرص التطوعية بشكل مباشر." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { role, submissions, opportunities, volunteers, ideas } = useAppState();

  if (role !== "entity") {
    return (
      <>
        <PageHeader
          badge="جهة التطوع"
          title="هذه اللوحة مخصصة لجهة التطوع"
          subtitle="يرجى الدخول برمز جهة التطوع للوصول إلى سجلات الطالبات وإدارة الفرص."
        />
        <RoleGate />
      </>
    );
  }

  const pending = submissions.filter((s) => s.status === "pending");
  const volunteerNames = new Set([
    ...submissions.map((s) => s.name.trim()),
    ...volunteers.map((v) => v.name.trim()),
  ]);

  return (
    <>
      <PageHeader
        badge="لوحة تحكم جهة التطوع"
        title="إدارة سجلات الطالبات والفرص التطوعية"
        subtitle="تصل سجلات الطالبات تلقائياً ولحظياً دون تحديث الصفحة، ويُحدَّث سجل الإنجازات فور الاعتماد."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="طلبات قيد الانتظار" value={pending.length} />
        <StatCard label="إجمالي الساعات المعتمدة" value={approvedHours(submissions)} />
        <StatCard label="عدد المتطوعات المسجلات" value={volunteerNames.size} />
      </div>

      <Panel
        title="جدول طلبات وسجلات الطالبات"
        action={
          <button
            className="btn-ghost text-xs"
            onClick={() => {
              if (window.confirm("سيتم حذف جميع السجلات والبيانات. هل تريدين المتابعة؟")) actions.resetAll();
            }}
          >
            تصفير البيانات للعرض
          </button>
        }
      >
        {submissions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            لا توجد سجلات بعد. عند إرسال أي طالبة لساعاتها ستظهر هنا مباشرة بحالة «قيد الانتظار».
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-right text-sm">
              <thead>
                <tr className="bg-muted text-xs">
                  {["الطالبة", "السنة الدراسية", "الفصل", "الفرصة", "الساعات", "التاريخ", "الوصف", "حالة الطلب", "إجراءات"].map(
                    (h) => (
                      <th key={h} className="p-3 font-bold">
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {submissions.map((s) => (
                  <tr key={s.id} className="border-b border-border align-top">
                    <td className="p-3 font-bold">{s.name}</td>
                    <td className="p-3">{s.year}</td>
                    <td className="p-3">{s.section}</td>
                    <td className="p-3">{s.opportunity}</td>
                    <td className="p-3 font-bold text-primary">{s.hours}</td>
                    <td className="p-3">{s.date}</td>
                    <td className="max-w-[240px] p-3 text-muted-foreground">{s.description}</td>
                    <td className="p-3">
                      <span
                        className={
                          s.status === "approved"
                            ? "rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary"
                            : s.status === "rejected"
                              ? "rounded-full bg-destructive/10 px-3 py-1 text-xs font-bold text-destructive"
                              : "rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-secondary"
                        }
                      >
                        {statusLabels[s.status]}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          className="btn-primary px-3 py-1 text-xs"
                          onClick={() => actions.setSubmissionStatus(s.id, "approved")}
                        >
                          اعتماد
                        </button>
                        <button
                          className="btn-ghost px-3 py-1 text-xs text-destructive"
                          onClick={() => actions.setSubmissionStatus(s.id, "rejected")}
                        >
                          رفض
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <OpportunityForm />
        <Panel title={`الفرص المطروحة (${opportunities.length})`}>
          <ul className="space-y-3">
            {opportunities.map((o) => (
              <li key={o.id} className="rounded-xl border border-border p-4 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-bold">{o.title}</p>
                  <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-bold text-accent-foreground">
                    {o.category}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {o.hours} ساعات · {o.seats} مقعد · {o.date}
                </p>
                <p className="mt-2 text-muted-foreground">{o.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    className="btn-ghost px-3 py-1 text-xs"
                    onClick={() => actions.updateOpportunity(o.id, { active: !o.active })}
                  >
                    {o.active ? "إيقاف الإتاحة" : "إتاحة الفرصة"}
                  </button>
                  <button
                    className="btn-ghost px-3 py-1 text-xs"
                    onClick={() => {
                      const hours = window.prompt("عدد الساعات الممنوحة", String(o.hours));
                      const seats = window.prompt("عدد المقاعد المتاحة", String(o.seats));
                      actions.updateOpportunity(o.id, {
                        hours: Number(hours) || o.hours,
                        seats: Number(seats) || o.seats,
                      });
                    }}
                  >
                    تعديل
                  </button>
                  <button
                    className="btn-ghost px-3 py-1 text-xs text-destructive"
                    onClick={() => actions.removeOpportunity(o.id)}
                  >
                    حذف
                  </button>
                  <span className={o.active ? "text-xs font-bold text-primary" : "text-xs font-bold text-muted-foreground"}>
                    {o.active ? "متاحة" : "موقوفة"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-6">
        <Panel title={`الأفكار والمبادرات المقترحة من الطالبات (${ideas.length})`}>
          {ideas.length === 0 ? (
            <p className="text-sm text-muted-foreground">لا توجد مقترحات بعد.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {ideas.map((i) => (
                <li key={i.id} className="rounded-lg border border-border p-3">
                  <p className="font-bold">
                    {i.title} — <span className="font-normal text-muted-foreground">{i.name}</span>
                  </p>
                  <p className="mt-1 text-muted-foreground">{i.details}</p>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground" dir="ltr">
                    {i.reference}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}

function OpportunityForm() {
  const [f, setF] = useState({
    title: "",
    category: CATEGORIES[0] ?? "",
    hours: "4",
    seats: "20",
    date: "طوال العام الدراسي",
    description: "",
  });
  const [done, setDone] = useState(false);

  return (
    <Panel title="طرح فرصة تطوعية جديدة">
      {done && <p className="mb-4 rounded-lg bg-primary/10 p-3 text-sm font-semibold text-primary">تم طرح الفرصة للطالبات.</p>}
      <form
        className="grid gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          actions.addOpportunity({
            title: f.title.trim(),
            category: f.category,
            hours: Number(f.hours) || 0,
            seats: Number(f.seats) || 0,
            date: f.date,
            description: f.description.trim(),
          });
          setF({ ...f, title: "", description: "" });
          setDone(true);
          setTimeout(() => setDone(false), 4000);
        }}
      >
        <label className="text-sm font-semibold">
          عنوان الفرصة
          <input required className="field mt-1" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
        </label>
        <label className="text-sm font-semibold">
          المجال / التصنيف
          <select className="field mt-1" value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            الساعات الممنوحة
            <input required type="number" min="1" className="field mt-1" value={f.hours} onChange={(e) => setF({ ...f, hours: e.target.value })} />
          </label>
          <label className="text-sm font-semibold">
            المقاعد المتاحة
            <input required type="number" min="1" className="field mt-1" value={f.seats} onChange={(e) => setF({ ...f, seats: e.target.value })} />
          </label>
        </div>
        <label className="text-sm font-semibold">
          تاريخ التنفيذ
          <input required className="field mt-1" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} />
        </label>
        <label className="text-sm font-semibold">
          وصف الفرصة
          <textarea required rows={4} className="field mt-1" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
        </label>
        <button className="btn-primary" type="submit">
          طرح الفرصة
        </button>
      </form>
    </Panel>
  );
}
