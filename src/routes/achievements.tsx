import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, StatCard } from "@/components/Section";
import { approvedHours, leaderboard, useAppState } from "@/lib/store";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "سجل الإنجازات ولوحة الشرف | مدرسة صفية بنت عبد المطلب" },
      {
        name: "description",
        content: "لوحة شرف المتطوعات الأعلى في الساعات المعتمدة ومؤشرات المستفيدين وقصص النجاح.",
      },
      { property: "og:title", content: "سجل الإنجازات ولوحة الشرف" },
      { property: "og:description", content: "ترتيب تلقائي للمتطوعات حسب الساعات المعتمدة من جهة التطوع." },
    ],
  }),
  component: AchievementsPage,
});

function AchievementsPage() {
  const { submissions } = useAppState();
  const ranks = leaderboard(submissions);
  const total = approvedHours(submissions);

  return (
    <>
      <PageHeader
        badge="سجل الإنجازات 🏆"
        title="لوحة شرف المتطوعات"
        subtitle="ترتيب تلقائي يُحدَّث لحظياً بعد اعتماد جهة التطوع لساعات كل طالبة."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="إجمالي الساعات المعتمدة" value={total} />
        <StatCard label="عدد المتطوعات المكرَّمات" value={ranks.length} />
        <StatCard label="المستفيدون من المبادرات" value={total * 3} hint="مؤشر تقديري: 3 مستفيدين لكل ساعة" />
      </div>

      <Panel title="الترتيب حسب الساعات المعتمدة">
        {ranks.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            لا توجد ساعات معتمدة بعد. تظهر أسماء المتطوعات هنا مباشرة بعد اعتماد جهة التطوع لسجلاتهن.
          </p>
        ) : (
          <ol className="space-y-3">
            {ranks.map((r, i) => (
              <li key={r.name} className="flex flex-wrap items-center gap-3 rounded-xl border border-border p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-base font-extrabold text-primary-foreground">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="font-bold">{r.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.year} · الفصل {r.section} · {r.count} مشاركة معتمدة
                  </p>
                </div>
                <span className="rounded-full bg-gold/15 px-3 py-1 text-sm font-extrabold text-secondary">
                  {r.hours} ساعة
                </span>
                {i === 0 && <span className="text-xl">🥇</span>}
                {i === 1 && <span className="text-xl">🥈</span>}
                {i === 2 && <span className="text-xl">🥉</span>}
              </li>
            ))}
          </ol>
        )}
      </Panel>

      <div className="mt-6">
        <Panel title="قصص نجاح">
          {ranks.length === 0 ? (
            <p className="text-sm text-muted-foreground">تُعرض قصص نجاح المتطوعات هنا مع بداية اعتماد المشاركات.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {ranks.slice(0, 3).map((r) => (
                <article key={r.name} className="rounded-xl bg-muted p-4 text-sm">
                  <p className="font-bold text-primary">{r.name}</p>
                  <p className="mt-2 text-muted-foreground">
                    أسهمت بـ {r.hours} ساعة تطوعية معتمدة عبر {r.count} مشاركة، وكان لها أثر واضح في نجاح مبادرات
                    المدرسة والشراكة المجتمعية.
                  </p>
                </article>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </>
  );
}
