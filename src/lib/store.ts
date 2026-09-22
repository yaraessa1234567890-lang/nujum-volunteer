import { useSyncExternalStore } from "react";

export type SubmissionStatus = "pending" | "approved" | "rejected";

export type Submission = {
  id: string;
  name: string;
  year: string;
  section: string;
  opportunity: string;
  hours: number;
  date: string;
  description: string;
  status: SubmissionStatus;
  createdAt: string;
};

export type Opportunity = {
  id: string;
  title: string;
  category: string;
  hours: number;
  seats: number;
  date: string;
  description: string;
  active: boolean;
};

export type VolunteerSignup = {
  id: string;
  name: string;
  year: string;
  section: string;
  interest: string;
  contact: string;
  createdAt: string;
};

export type Idea = {
  id: string;
  name: string;
  title: string;
  details: string;
  reference: string;
  createdAt: string;
};

export type Survey = {
  id: string;
  name: string;
  satisfaction: number;
  impact: number;
  organization: number;
  notes: string;
  createdAt: string;
};

export type Role = "student" | "entity" | null;

export type AppState = {
  role: Role;
  submissions: Submission[];
  opportunities: Opportunity[];
  volunteers: VolunteerSignup[];
  ideas: Idea[];
  surveys: Survey[];
};

export const CATEGORIES = [
  "اليوم الوطني",
  "دعم الطالبات والتعليم التعاوني",
  "تحسين البيئة المدرسية",
  "التشجير والبيئة الخضراء",
  "تحسين جودة القراءة",
  "تدريب القدرات والتحصيل",
  "الشراكة المجتمعية وشراكة الأسرة",
  "المبادرات الرقمية",
];

export const ENTITY_PASSCODE = "1500";
export const IDEA_REFERENCE = "777777777777777777777";

const STORAGE_KEY = "safia-volunteering-v1";

const seededOpportunities: Opportunity[] = CATEGORIES.map((category, i) => ({
  id: `seed-${i + 1}`,
  title: category,
  category,
  hours: [6, 5, 4, 5, 4, 6, 5, 4][i],
  seats: 20,
  date: "طوال العام الدراسي",
  description:
    "مبادرة تطوعية مفتوحة لجميع طالبات المدرسة، تُنفَّذ بإشراف جهة التطوع وتُمنح عليها ساعات معتمدة وشهادة شكر رقمية.",
  active: true,
}));

const emptyState: AppState = {
  role: null,
  submissions: [],
  opportunities: [],
  volunteers: [],
  ideas: [],
  surveys: [],
};

const initialState: AppState = { ...emptyState, opportunities: seededOpportunities };

let state: AppState = initialState;
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) state = { ...initialState, ...(JSON.parse(raw) as Partial<AppState>) };
  } catch {
    /* ignore corrupt storage */
  }
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY || !event.newValue) return;
    try {
      state = { ...initialState, ...(JSON.parse(event.newValue) as Partial<AppState>) };
      listeners.forEach((l) => l());
    } catch {
      /* ignore */
    }
  });
}

function persist() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function update(mutator: (current: AppState) => AppState) {
  hydrate();
  state = mutator(state);
  persist();
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  hydrate();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useAppState(): AppState {
  return useSyncExternalStore(
    subscribe,
    () => {
      hydrate();
      return state;
    },
    () => initialState,
  );
}

const id = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export const actions = {
  setRole(role: Role) {
    update((s) => ({ ...s, role }));
  },
  addSubmission(data: Omit<Submission, "id" | "status" | "createdAt">) {
    update((s) => ({
      ...s,
      submissions: [
        { ...data, id: id(), status: "pending", createdAt: new Date().toISOString() },
        ...s.submissions,
      ],
    }));
  },
  setSubmissionStatus(submissionId: string, status: SubmissionStatus) {
    update((s) => ({
      ...s,
      submissions: s.submissions.map((sub) => (sub.id === submissionId ? { ...sub, status } : sub)),
    }));
  },
  addOpportunity(data: Omit<Opportunity, "id" | "active">) {
    update((s) => ({
      ...s,
      opportunities: [{ ...data, id: id(), active: true }, ...s.opportunities],
    }));
  },
  updateOpportunity(opportunityId: string, patch: Partial<Opportunity>) {
    update((s) => ({
      ...s,
      opportunities: s.opportunities.map((o) => (o.id === opportunityId ? { ...o, ...patch } : o)),
    }));
  },
  removeOpportunity(opportunityId: string) {
    update((s) => ({
      ...s,
      opportunities: s.opportunities.filter((o) => o.id !== opportunityId),
    }));
  },
  addVolunteer(data: Omit<VolunteerSignup, "id" | "createdAt">) {
    update((s) => ({
      ...s,
      volunteers: [{ ...data, id: id(), createdAt: new Date().toISOString() }, ...s.volunteers],
    }));
  },
  addIdea(data: Omit<Idea, "id" | "createdAt">) {
    update((s) => ({
      ...s,
      ideas: [{ ...data, id: id(), createdAt: new Date().toISOString() }, ...s.ideas],
    }));
  },
  addSurvey(data: Omit<Survey, "id" | "createdAt">) {
    update((s) => ({
      ...s,
      surveys: [{ ...data, id: id(), createdAt: new Date().toISOString() }, ...s.surveys],
    }));
  },
  resetAll() {
    update(() => ({ ...initialState }));
  },
};

export function approvedHours(submissions: Submission[]) {
  return submissions
    .filter((s) => s.status === "approved")
    .reduce((total, s) => total + (Number(s.hours) || 0), 0);
}

export function leaderboard(submissions: Submission[]) {
  const map = new Map<string, { name: string; year: string; section: string; hours: number; count: number }>();
  submissions
    .filter((s) => s.status === "approved")
    .forEach((s) => {
      const key = s.name.trim();
      const existing = map.get(key);
      if (existing) {
        existing.hours += Number(s.hours) || 0;
        existing.count += 1;
      } else {
        map.set(key, {
          name: s.name,
          year: s.year,
          section: s.section,
          hours: Number(s.hours) || 0,
          count: 1,
        });
      }
    });
  return [...map.values()].sort((a, b) => b.hours - a.hours);
}

export const statusLabels: Record<SubmissionStatus, string> = {
  pending: "قيد الانتظار",
  approved: "معتمد",
  rejected: "مرفوض",
};
