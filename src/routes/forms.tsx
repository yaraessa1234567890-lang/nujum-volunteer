import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { IDEA_REFERENCE, actions, useAppState } from "@/lib/store";
import { PageHeader, Panel } from "@/components/Section";
import { SchoolCrest } from "@/components/PalmMotif";

export const Route = createFileRoute("/forms")({
  head: () => ({
    meta: [
      { title: "شاركينا والشهادات | مدرسة صفية بنت عبد المطلب" },
      {
        name: "description",
        content:
          "تسجيل متطوعة جديدة، اقتراح مبادرة، استبيان قياس الأثر، وإصدار شهادة شكر رقمية قابلة للطباعة.",
      },
      { property: "og:title", content: "شاركينا والشهادات" },
      { property: "og:description", content: "نماذج المشاركة ومركز إصدار الشهادات الرقمية للمتطوعات." },
    ],
  }),
  component: FormsPage,
});

const TABS = [
  { id: "signup", label: "تسجيل متطوعة جديدة" },
  { id: "idea", label: "اقتراح مبادرة" },
  { id: "survey", label: "استبيان تجربة التطوع" },
  { id: "certificate", label: "مركز الشهادات الرقمية" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const YEARS = [
  "الصف الأول المتوسط",
  "الصف الثاني المتوسط",
  "الصف الثالث المتوسط",
  "الأول الثانوي",
  "الثاني الثانوي",
  "الثالث الثانوي",
];

function FormsPage() {
  const [tab, setTab] = useState<TabId>("signup");

  return (
    <>
      <PageHeader
        badge="شاركينا والشهادات 💡"
        title="نماذج المشاركة ومركز الشهادات"
        subtitle="سجّلي انضمامك، اقترحي مبادرة، قيّمي تجربتك، وأصدري شهادة شكر رسمية باسمك."
      />

      <div className="no-print mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={
              tab === t.id
                ? "rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground sm:text-sm"
                : "rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted sm:text-sm"
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "signup" && <SignupForm />}
      {tab === "idea" && <IdeaForm />}
      {tab === "survey" && <SurveyForm />}
      {tab === "certificate" && <CertificateCenter />}
    </>
  );
}

function Success({ show, text }: { show: boolean; text: string }) {
  if (!show) return null;
  return <p className="mb-4 rounded-lg bg-primary/10 p-3 text-sm font-semibold text-primary">{text}</p>;
}

function SignupForm() {
  const { opportunities, volunteers } = useAppState();
  const [done, setDone] = useState(false);
  const [f, setF] = useState({ name: "", year: "", section: "", interest: "", contact: "" });

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <Panel title="نموذج تسجيل متطوعة جديدة">
        <Success show={done} text="تم تسجيلك كمتطوعة جديدة، ووصلت بياناتك إلى جهة التطوع." />
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            actions.addVolunteer(f);
            setF({ name: "", year: "", section: "", interest: "", contact: "" });
            setDone(true);
            setTimeout(() => setDone(false), 5000);
          }}
        >
          <label className="sm:col-span-2 text-sm font-semibold">
            اسم الطالبة الثلاثي
            <input required className="field mt-1" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          </label>
          <label className="text-sm font-semibold">
            السنة الدراسية
            <select required className="field mt-1" value={f.year} onChange={(e) => setF({ ...f, year: e.target.value })}>
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
            <input required className="field mt-1" value={f.section} onChange={(e) => setF({ ...f, section: e.target.value })} />
          </label>
          <label className="text-sm font-semibold">
            المجال التطوعي المفضل
            <select required className="field mt-1" value={f.interest} onChange={(e) => setF({ ...f, interest: e.target.value })}>
              <option value="">اختاري المجال</option>
              {opportunities.map((o) => (
                <option key={o.id} value={o.title}>
                  {o.title}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold">
            وسيلة التواصل
            <input required className="field mt-1" value={f.contact} onChange={(e) => setF({ ...f, contact: e.target.value })} />
          </label>
          <button className="btn-primary sm:col-span-2" type="submit">
            تسجيل الانضمام
          </button>
        </form>
      </Panel>
      <Panel title={`المتطوعات المسجلات (${volunteers.length})`}>
        {volunteers.length === 0 ? (
          <p className="text-sm text-muted-foreground">لا يوجد تسجيل بعد.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {volunteers.map((v) => (
              <li key={v.id} className="rounded-lg border border-border p-3">
                <span className="font-bold">{v.name}</span> — {v.year} · {v.section} · {v.interest}
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

function IdeaForm() {
  const { ideas } = useAppState();
  const [done, setDone] = useState(false);
  const [f, setF] = useState({ name: "", title: "", details: "", reference: IDEA_REFERENCE });

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <Panel title="نموذج اقتراح مبادرة / فكرة تطوعية جديدة">
        <Success show={done} text="تم إرسال فكرتك إلى جهة التطوع لدراستها." />
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            actions.addIdea(f);
            setF({ name: "", title: "", details: "", reference: IDEA_REFERENCE });
            setDone(true);
            setTimeout(() => setDone(false), 5000);
          }}
        >
          <label className="text-sm font-semibold">
            اسم مقدمة الفكرة
            <input required className="field mt-1" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          </label>
          <label className="text-sm font-semibold">
            عنوان المبادرة المقترحة
            <input required className="field mt-1" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
          </label>
          <label className="text-sm font-semibold">
            تفاصيل الفكرة وآلية التنفيذ
            <textarea required rows={5} className="field mt-1" value={f.details} onChange={(e) => setF({ ...f, details: e.target.value })} />
          </label>
          <label className="text-sm font-semibold">
            الرقم المرجعي للنموذج (إلزامي)
            <input
              required
              className="field mt-1 font-mono"
              dir="ltr"
              value={f.reference}
              onChange={(e) => setF({ ...f, reference: e.target.value })}
            />
            <span className="mt-1 block text-xs text-muted-foreground">
              ملاحظة إلزامية: يُرفق هذا النموذج بالرقم المرجعي {IDEA_REFERENCE}
            </span>
          </label>
          <button className="btn-primary" type="submit">
            إرسال الفكرة
          </button>
        </form>
      </Panel>
      <Panel title={`الأفكار المقترحة (${ideas.length})`}>
        {ideas.length === 0 ? (
          <p className="text-sm text-muted-foreground">لا توجد أفكار مقترحة بعد.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {ideas.map((i) => (
              <li key={i.id} className="rounded-lg border border-border p-3">
                <p className="font-bold">{i.title}</p>
                <p className="text-muted-foreground">{i.name}</p>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground" dir="ltr">
                  {i.reference}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

function SurveyForm() {
  const [done, setDone] = useState(false);
  const [f, setF] = useState({ name: "", satisfaction: 5, impact: 5, organization: 5, notes: "" });

  const scale = (
    label: string,
    key: "satisfaction" | "impact" | "organization",
  ) => (
    <label className="text-sm font-semibold">
      {label}: <span className="text-primary">{f[key]} / 5</span>
      <input
        type="range"
        min={1}
        max={5}
        value={f[key]}
        onChange={(e) => setF({ ...f, [key]: Number(e.target.value) })}
        className="mt-2 w-full accent-[var(--primary)]"
      />
    </label>
  );

  return (
    <Panel title="استبيان تقييم تجربة التطوع وقياس الأثر">
      <Success show={done} text="شكراً لك، تم احتساب تقييمك في لوحة قياس الأثر لحظياً." />
      <form
        className="grid gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          actions.addSurvey(f);
          setF({ name: "", satisfaction: 5, impact: 5, organization: 5, notes: "" });
          setDone(true);
          setTimeout(() => setDone(false), 5000);
        }}
      >
        <label className="text-sm font-semibold">
          الاسم (اختياري)
          <input className="field mt-1" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        </label>
        {scale("درجة الرضا عن تجربة التطوع", "satisfaction")}
        {scale("الأثر الملموس على المدرسة والمجتمع", "impact")}
        {scale("جودة التنظيم والإشراف", "organization")}
        <label className="text-sm font-semibold">
          مقترحات التحسين
          <textarea rows={4} className="field mt-1" value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} />
        </label>
        <button className="btn-primary" type="submit">
          إرسال التقييم
        </button>
      </form>
    </Panel>
  );
}

function CertificateCenter() {
  const { submissions } = useAppState();
  const approved = submissions.filter((s) => s.status === "approved");
  const names = [...new Set(approved.map((s) => s.name))];
  const [name, setName] = useState("");
  const [initiative, setInitiative] = useState("");
  const [issued, setIssued] = useState(false);

  const studentRecords = approved.filter((s) => s.name === name);
  const hours = studentRecords
    .filter((s) => !initiative || s.opportunity === initiative)
    .reduce((t, s) => t + Number(s.hours || 0), 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
      <Panel title="مركز إصدار الشهادات الرقمية">
        {approved.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            تُصدر الشهادات للمشاركات المعتمدة فقط. بعد اعتماد جهة التطوع لساعاتك سيظهر اسمك هنا تلقائياً.
          </p>
        ) : (
          <form
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              setIssued(true);
            }}
          >
            <label className="text-sm font-semibold">
              اسم الطالبة (المشاركات المعتمدة)
              <select
                required
                className="field mt-1"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setInitiative("");
                  setIssued(false);
                }}
              >
                <option value="">اختاري الاسم</option>
                {names.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold">
              المبادرة المعتمدة
              <select
                required
                className="field mt-1"
                value={initiative}
                onChange={(e) => {
                  setInitiative(e.target.value);
                  setIssued(false);
                }}
                disabled={!name}
              >
                <option value="">اختاري المبادرة</option>
                {[...new Set(studentRecords.map((s) => s.opportunity))].map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex flex-wrap gap-2">
              <button className="btn-primary" type="submit">
                إصدار الشهادة
              </button>
              <button type="button" className="btn-ghost" disabled={!issued} onClick={() => window.print()}>
                طباعة / حفظ PDF
              </button>
            </div>
          </form>
        )}
      </Panel>

      <section className="print-area card-surface najdi-pattern p-2">
        <div className="rounded-xl border-4 border-double border-[var(--gold)] bg-card p-6 text-center">
          <div className="najdi-band mb-4 rounded" />
          <div className="flex justify-center">
            <SchoolCrest className="h-16 w-16" />
          </div>
          <p className="mt-3 text-xs font-bold tracking-widest text-secondary">المملكة العربية السعودية · وزارة التعليم</p>
          <h2 className="mt-2 text-2xl text-primary">شهادة شكر وتقدير</h2>
          <p className="mt-1 text-sm font-semibold">مدرسة صفية بنت عبد المطلب</p>
          <p className="mt-6 text-sm text-muted-foreground">تتقدم جهة التطوع بالشكر والتقدير للطالبة</p>
          <p className="mt-2 text-xl font-extrabold">{issued && name ? name : "................................"}</p>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            لمشاركتها الفاعلة في مبادرة{" "}
            <span className="font-bold text-foreground">{issued && initiative ? initiative : "..................."}</span>{" "}
            بعدد <span className="font-bold text-foreground">{issued ? hours : "—"}</span> ساعة تطوعية معتمدة، سائلين الله
            لها دوام التوفيق والعطاء.
          </p>
          <div className="mt-8 flex justify-between text-xs font-semibold text-muted-foreground">
            <span>التاريخ: {new Date().toLocaleDateString("ar-SA")}</span>
            <span>قائدة المدرسة / جهة التطوع</span>
          </div>
          <div className="najdi-band mt-4 rounded" />
        </div>
      </section>
    </div>
  );
}
