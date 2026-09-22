import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, StatCard } from "@/components/Section";
import { approvedHours, useAppState } from "@/lib/store";

export const Route = createFileRoute("/impact")({
  head: () => ({
    meta: [
      { title: "التقييم وقياس الأثر | مدرسة صفية بنت عبد المطلب" },
      {
        name: "description",
        content: "نسب الرضا ونتائج قياس أثر العمل التطوعي وتوصيات التحسين المستمر في المدرسة.",
      },
      { property: "og:title", content: "التقييم وقياس الأثر" },
      { property: "og:description", content: "مؤشرات رضا المتطوعات ونتائج الأثر المجتمعي للمبادرات." },
    ],
  }),
  component: ImpactPage,
});

function avg(values: number[]) {
  if (values.length === 0) return 0;
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 20);
}

function Bar({ label, percent }: { label: string; percent: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm font-semibold">
        <span>{label}</span>
        <span className="text-primary">{percent}%</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function ImpactPage() {
  const { surveys, submissions } = useAppState();
  const satisfaction = avg(surveys.map((s) => s.satisfaction));
  const impact = avg(surveys.map((s) => s.impact));
  const organization = avg(surveys.map((s) => s.organization));

  return (
    <>
      <PageHeader
        badge="التقييم وقياس الأثر"
        title="مؤشرات الرضا والأثر المجتمعي"
        subtitle="تُحسب النسب تلقائياً من استبيانات الطالبات ومن الساعات المعتمدة من جهة التطوع."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="نسبة الرضا العام" value={`${satisfaction}%`} hint={`عدد المشاركات في الاستبيان: ${surveys.length}`} />
        <StatCard label="الساعات المعتمدة" value={approvedHours(submissions)} />
        <StatCard label="إجمالي السجلات المستلمة" value={submissions.length} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="نتائج الاستبيان">
          {surveys.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              لم تُستلم استبيانات بعد. ستظهر النسب هنا لحظياً عند تعبئة استبيان تجربة التطوع.
            </p>
          ) : (
            <div className="space-y-4">
              <Bar label="الرضا عن تجربة التطوع" percent={satisfaction} />
              <Bar label="الأثر الملموس على المدرسة والمجتمع" percent={impact} />
              <Bar label="جودة التنظيم والإشراف" percent={organization} />
            </div>
          )}
        </Panel>

        <Panel title="أبرز النتائج والتوصيات">
          <ul className="space-y-3 text-sm">
            <li className="rounded-lg bg-muted p-3">تنويع الفرص التطوعية بين الميداني والرقمي لزيادة المشاركة.</li>
            <li className="rounded-lg bg-muted p-3">تكريم المتطوعات دورياً عبر لوحة الشرف والشهادات الرقمية.</li>
            <li className="rounded-lg bg-muted p-3">تعزيز شراكة الأسرة والمجتمع في المبادرات الوطنية والبيئية.</li>
            <li className="rounded-lg bg-muted p-3">تسريع اعتماد الساعات لضمان تحفيز الطالبات واستمرارية العطاء.</li>
          </ul>
        </Panel>
      </div>

      {surveys.length > 0 && (
        <div className="mt-6">
          <Panel title="ملاحظات المتطوعات">
            <ul className="space-y-2 text-sm">
              {surveys.slice(0, 8).map((s) => (
                <li key={s.id} className="rounded-lg border border-border p-3">
                  <span className="font-bold">{s.name || "متطوعة"}:</span> {s.notes || "—"}
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      )}
    </>
  );
}
