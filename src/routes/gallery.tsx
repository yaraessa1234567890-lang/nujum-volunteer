import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/Section";
import { LandmarkArt, PalmIcon } from "@/components/PalmMotif";
import { useAppState } from "@/lib/store";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "التوثيق والمعرض | مدرسة صفية بنت عبد المطلب" },
      {
        name: "description",
        content: "معرض صور وتقارير الأنشطة التطوعية والنماذج المشاركة في مدرسة صفية بنت عبد المطلب.",
      },
      { property: "og:title", content: "التوثيق والمعرض" },
      { property: "og:description", content: "توثيق مرئي لفعاليات التطوع والشراكة المجتمعية بالمدرسة." },
    ],
  }),
  component: GalleryPage,
});

const albums = [
  { title: "احتفال اليوم الوطني", note: "فعاليات وطنية داخل ساحة المدرسة" },
  { title: "مبادرة التشجير المدرسي", note: "غرس الأشجار وتجميل الأحواض" },
  { title: "ورش تحسين جودة القراءة", note: "قراءة تشاركية بين الطالبات" },
  { title: "تحسين البيئة المدرسية", note: "أعمال تجميل وصيانة بسيطة" },
  { title: "ملتقى شراكة الأسرة", note: "لقاءات أولياء الأمور والمجتمع" },
  { title: "المبادرات الرقمية", note: "تصميم محتوى توعوي رقمي" },
];

const reports = [
  "تقرير فعاليات اليوم الوطني.pdf",
  "تقرير أثر مبادرة التشجير.pdf",
  "نموذج توثيق مشاركة متطوعة.pdf",
  "تقرير الشراكة المجتمعية الفصلي.pdf",
];

function GalleryPage() {
  const { submissions } = useAppState();

  return (
    <>
      <PageHeader
        badge="التوثيق والمعرض"
        title="سجل مرئي لأعمال المتطوعات"
        subtitle="صور الفعاليات، النماذج المشاركة، وتقارير الأنشطة القابلة للتحميل."
      />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {albums.map((a) => (
          <figure key={a.title} className="card-surface overflow-hidden">
            <div className="najdi-pattern flex h-40 items-end justify-center bg-accent/40">
              <LandmarkArt className="h-28 w-full" />
            </div>
            <figcaption className="p-4">
              <h3 className="flex items-center gap-2 text-base">
                <PalmIcon className="h-5 w-5 text-primary" />
                {a.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{a.note}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Panel title="تقارير الأنشطة (نماذج قابلة للتحميل)">
          <ul className="space-y-2">
            {reports.map((r) => (
              <li key={r} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
                <span>{r}</span>
                <button className="btn-ghost text-xs" onClick={() => window.print()}>
                  تحميل / طباعة
                </button>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="آخر المشاركات الموثقة">
          {submissions.length === 0 ? (
            <p className="text-sm text-muted-foreground">لم يتم توثيق مشاركات بعد، ستظهر هنا مباشرة عند التسجيل.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {submissions.slice(0, 6).map((s) => (
                <li key={s.id} className="rounded-lg border border-border p-3">
                  <span className="font-bold">{s.name}</span> — {s.opportunity} · {s.hours} ساعات · {s.date}
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
