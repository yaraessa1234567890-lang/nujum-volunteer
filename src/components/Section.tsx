import type { ReactNode } from "react";
import { LandmarkArt } from "./PalmMotif";

export function PageHeader({
  title,
  subtitle,
  badge,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
}) {
  return (
    <section className="card-surface najdi-pattern relative mb-8 overflow-hidden p-0">
      <div className="najdi-band" />
      <div className="relative bg-card/90 px-6 py-8">
        {badge && (
          <span className="mb-3 inline-block rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-secondary">
            {badge}
          </span>
        )}
        <h1 className="text-2xl sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">{subtitle}</p>}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 opacity-70">
          <LandmarkArt className="h-20 w-full" />
        </div>
      </div>
    </section>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="card-surface p-5">
      <p className="text-sm font-semibold text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-extrabold text-primary">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function Panel({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="card-surface p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
