import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CATEGORIES, useAppState } from "@/lib/store";
import { PageHeader, StatCard } from "@/components/Section";
import { PalmIcon } from "@/components/PalmMotif";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "الفرص والمبادرات التطوعية | مدرسة صفية بنت عبد المطلب" },
      {
        name: "description",
        content: "استعرضي الفرص والمبادرات التطوعية المتاحة للطالبات وسجلي مشاركتك بساعات معتمدة.",
      },
      { property: "og:title", content: "الفرص والمبادرات التطوعية" },
      {
        property: "og:description",
        content: "فرص تطوعية متنوعة: اليوم الوطني، التشجير، القراءة، المبادرات الرقمية والشراكة المجتمعية.",
      },
    ],
  }),
  component: OpportunitiesPage,
});

function OpportunitiesPage() {
  const { opportunities, submissions, volunteers } = useAppState();
  const [filter, setFilter] = useState("الكل");
  const navigate = useNavigate();

  const visible = opportunities.filter((o) => o.active && (filter === "الكل" || o.category === filter));

  return (
    <>
      <PageHeader
        badge="الفرص والمبادرات"
        title="ابدئي رحلتك التطوعية في مدرسة صفية بنت عبد المطلب"
        subtitle="فرص تطوعية متنوعة طوال العام الدراسي، بساعات معتمدة وشهادات شكر رقمية تُصدر فور اعتماد مشاركتك."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="الفرص المتاحة حالياً" value={opportunities.filter((o) => o.active).length} />
        <StatCard label="المشاركات المسجلة" value={submissions.length} />
        <StatCard label="المتطوعات المسجلات" value={volunteers.length} />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {["الكل", ...CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={
              filter === c
                ? "rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
                : "rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
            }
          >
            {c}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="card-surface p-8 text-center text-sm text-muted-foreground">
          لا توجد فرص مطابقة لهذا التصنيف حالياً.
        </p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((o) => (
            <article key={o.id} className="card-surface flex flex-col p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-bold text-accent-foreground">
                  {o.category}
                </span>
                <PalmIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-3 text-lg leading-snug">{o.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{o.description}</p>
              <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-muted p-2">
                  <dt className="text-muted-foreground">الساعات الممنوحة</dt>
                  <dd className="font-bold text-primary">{o.hours} ساعات</dd>
                </div>
                <div className="rounded-lg bg-muted p-2">
                  <dt className="text-muted-foreground">المدة الزمنية</dt>
                  <dd className="font-bold">{o.date}</dd>
                </div>
                <div className="rounded-lg bg-muted p-2">
                  <dt className="text-muted-foreground">المقاعد المتاحة</dt>
                  <dd className="font-bold">{o.seats}</dd>
                </div>
                <div className="rounded-lg bg-muted p-2">
                  <dt className="text-muted-foreground">الجهة</dt>
                  <dd className="font-bold">جهة التطوع بالمدرسة</dd>
                </div>
              </dl>
              <button
                className="btn-primary mt-4"
                onClick={() => navigate({ to: "/register", search: { opp: o.title } })}
              >
                سجلي الآن
              </button>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
