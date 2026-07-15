"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { freqToTimesPerDay } from "@/lib/dashboard/patient-review-data";
import type { QueuePatient, CurrentClinician } from "@/lib/dashboard/queries";
import { ReasonIcon, MessageIcon, CallIcon, PharmacyIcon } from "./icons";
import { TimeDomainChart, PsdChart } from "./sensor-charts";

type Phase = "idle" | "leaving" | "entering";

type DecisionKind = "approved" | "deferred";

interface Decision {
  label: string;
  mark: string;
  color: string;
  bg: string;
  border: string;
  sub: string;
}

interface Dose {
  cd: string;
  ld: string;
  freq: string;
}

const DECISION_MAP: Record<DecisionKind, Decision> = {
  approved: {
    label: "Order Sent to Pharmacy and Patient Notified",
    mark: "✓",
    color: "#3F7A5C",
    bg: "#E9F2EC",
    border: "#CBE0D3",
    sub: "Signed · just now",
  },
  deferred: {
    label: "Deferred — more information requested",
    mark: "⏱",
    color: "#B07A2E",
    bg: "#FAF1E2",
    border: "#EFE0C3",
    sub: "Flagged for follow-up · patient will continue current regimen",
  },
};

const URGENCY_STYLE = {
  Routine: { color: "#3F7A5C", bg: "#E9F2EC" },
  "Priority review": { color: "#B07A2E", bg: "#FAF1E2" },
  Urgent: { color: "#C2453B", bg: "#FBEDEC" },
} as const;

const CONFIDENCE_COLOR = {
  "High confidence": "#3F7A5C",
  "Moderate confidence": "#B07A2E",
  "Low confidence": "#C2453B",
} as const;

const DEFER_QUICK_OPTIONS = [
  { label: "2 days", days: 2 },
  { label: "1 week", days: 7 },
  { label: "2 weeks", days: 14 },
];
const CAL_WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function formatChange(current: { ld: number; times: number }, rec: Dose) {
  const curDaily = current.ld * current.times;
  const newDaily = parseFloat(rec.ld) * (freqToTimesPerDay[rec.freq] || 3);
  if (!newDaily || !curDaily || newDaily === curDaily) return { arrow: "→", text: "Dose adjustment" };
  if (newDaily < curDaily) {
    return { arrow: "↓", text: `~${Math.round((1 - newDaily / curDaily) * 100)}% levodopa reduction` };
  }
  return { arrow: "↑", text: `~${Math.round((newDaily / curDaily - 1) * 100)}% daily levodopa increase` };
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function toIsoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

// Module-scope helper (not inline in the component) so this impure Date.now()
// read is clearly an event-handler-time computation, not a render-time one.
function isoDateDaysFromNow(days: number): string {
  return toIsoDate(new Date(Date.now() + days * 24 * 60 * 60 * 1000));
}

function initialsFromName(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface CalendarCell {
  blank?: boolean;
  date?: Date;
  day?: number;
  isToday?: boolean;
  disabled?: boolean;
}

function buildCalendar(offset: number): { label: string; cells: CalendarCell[] } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const base = new Date(today.getFullYear(), today.getMonth() + offset, 1);
  const label = base.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const firstDow = base.getDay();
  const daysInMonth = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
  const cells: CalendarCell[] = [];
  for (let i = 0; i < firstDow; i++) cells.push({ blank: true });
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(base.getFullYear(), base.getMonth(), d);
    cells.push({
      date,
      day: d,
      isToday: date.getTime() === today.getTime(),
      disabled: date.getTime() < today.getTime(),
    });
  }
  while (cells.length % 7 !== 0) cells.push({ blank: true });
  return { label, cells };
}

const pillButton =
  "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors";

interface DecisionResult {
  ok: boolean;
  error?: string;
}

async function postDecision(
  recommendationId: number,
  action: "approved" | "deferred" | "declined" | "undo",
  extra?: Record<string, unknown>,
): Promise<DecisionResult> {
  try {
    const response = await fetch(`/api/dashboard/recommendations/${recommendationId}/decision`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...extra }),
    });
    const data = await response.json();
    if (!response.ok) {
      return { ok: false, error: data.error ?? "Something went wrong" };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error — please try again" };
  }
}

export default function PatientReviewDashboard({
  initialQueue,
  clinician,
}: {
  initialQueue: QueuePatient[];
  clinician: CurrentClinician | null;
}) {
  const router = useRouter();
  const [queue] = useState(initialQueue);
  const [patientIdx, setPatientIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [expanded, setExpanded] = useState(false);
  const [decision, setDecisionState] = useState<Decision | null>(null);
  const [modifying, setModifying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [deferPopupOpen, setDeferPopupOpen] = useState(false);
  const [deferShowCalendar, setDeferShowCalendar] = useState(false);
  const [calMonthOffset, setCalMonthOffset] = useState(0);
  const [declineTipOpen, setDeclineTipOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const cur = queue.length > 0 ? queue[patientIdx % queue.length] : null;
  const [rec, setRec] = useState<Dose>(cur ? { ...cur.rec } : { cd: "", ld: "", freq: "three times daily" });
  const [draft, setDraft] = useState<Dose>(cur ? { ...cur.rec } : { cd: "", ld: "", freq: "three times daily" });

  const cal = useMemo(() => buildCalendar(calMonthOffset), [calMonthOffset]);

  const clinicianName = clinician?.fullName ?? "Clinician";
  const clinicianSpecialty = clinician?.specialty ?? "";
  const clinicianInitials = initialsFromName(clinicianName);

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  if (!cur) {
    return (
      <div className="font-body flex min-h-screen flex-col bg-[#F6F5F1] text-[#10243D] antialiased">
        <header className="flex h-[66px] shrink-0 items-center justify-between border-b border-[#EAE7DE] bg-white px-8">
          <span className="font-serif text-[22px] font-semibold tracking-[-0.01em] text-[#10243D]">Coralum</span>
          <div className="flex items-center gap-3">
            <div className="text-right leading-tight">
              <div className="text-[13px] font-semibold">{clinicianName}</div>
              <div className="text-[11px] text-[#8798A8]">{clinicianSpecialty}</div>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="text-xs font-semibold text-[#51677C] hover:text-[#10243D]"
            >
              Sign out
            </button>
          </div>
        </header>
        <main className="flex flex-1 items-center justify-center px-8">
          <div className="rounded-2xl bg-white px-10 py-8 text-center shadow-[0_6px_26px_rgba(16,36,61,0.06)]">
            <h1 className="font-serif text-xl font-semibold text-[#10243D]">All caught up</h1>
            <p className="mt-2 text-sm text-[#51677C]">There are no pending medication recommendations to review.</p>
          </div>
        </main>
      </div>
    );
  }

  const urgencyStyle = URGENCY_STYLE[cur.urgency];
  const confidenceColor = CONFIDENCE_COLOR[cur.confidence];
  const change = formatChange(cur.current, rec);

  function setDecision(kind: DecisionKind, subOverride?: string) {
    const entry = { ...DECISION_MAP[kind] };
    if (subOverride) entry.sub = subOverride;
    setDecisionState(entry);
    setModifying(false);
    setDeferPopupOpen(false);
  }

  function advanceToNextPatient() {
    if (phase !== "idle") return;
    setPhase("leaving");
    setTimeout(() => {
      const next = (patientIdx + 1) % queue.length;
      const np = queue[next];
      setPatientIdx(next);
      setRec({ ...np.rec });
      setDraft({ ...np.rec });
      setDecisionState(null);
      setModifying(false);
      setShowTranscript(false);
      setExpanded(false);
      setApiError(null);
      setPhase("entering");
      setTimeout(() => setPhase("idle"), 40);
    }, 430);
  }

  async function handleApprove() {
    setApiError(null);
    setSubmitting(true);
    const result = await postDecision(cur!.recommendationId, "approved", { dose: rec });
    setSubmitting(false);
    if (!result.ok) {
      setApiError(result.error ?? "Could not save this decision");
      return;
    }
    setDecision("approved", `Signed by ${clinicianName} · just now`);
  }

  async function handleDeferQuick(label: string, days: number) {
    setApiError(null);
    setSubmitting(true);
    const deferredUntil = isoDateDaysFromNow(days);
    const note = `Flagged for follow-up in ${label} · patient will continue current regimen`;
    const result = await postDecision(cur!.recommendationId, "deferred", { deferredUntil, note });
    setSubmitting(false);
    if (!result.ok) {
      setApiError(result.error ?? "Could not save this decision");
      return;
    }
    setDecision("deferred", note);
  }

  async function handleDeferDate(date: Date) {
    setApiError(null);
    setSubmitting(true);
    const note = `Flagged for follow-up on ${formatDate(date)} · patient will continue current regimen`;
    const result = await postDecision(cur!.recommendationId, "deferred", { deferredUntil: toIsoDate(date), note });
    setSubmitting(false);
    if (!result.ok) {
      setApiError(result.error ?? "Could not save this decision");
      return;
    }
    setDecision("deferred", note);
  }

  async function handleDecline() {
    if (phase !== "idle" || submitting) return;
    setApiError(null);
    setSubmitting(true);
    const result = await postDecision(cur!.recommendationId, "declined");
    setSubmitting(false);
    if (!result.ok) {
      setApiError(result.error ?? "Could not save this decision");
      return;
    }
    advanceToNextPatient();
  }

  async function handleUndo() {
    setApiError(null);
    setSubmitting(true);
    const result = await postDecision(cur!.recommendationId, "undo");
    setSubmitting(false);
    if (!result.ok) {
      setApiError(result.error ?? "Could not undo this decision");
      return;
    }
    setDecisionState(null);
  }

  const swapStyle: React.CSSProperties =
    phase === "leaving"
      ? { opacity: 0, transform: "translateY(16px) scale(0.985)" }
      : phase === "entering"
        ? { opacity: 0, transform: "translateY(-16px)" }
        : { opacity: 1, transform: "none" };

  const deferOptions = [
    ...DEFER_QUICK_OPTIONS.map(({ label, days }) => ({
      label,
      onSelect: () => handleDeferQuick(label, days),
    })),
    { label: "Other…", onSelect: () => setDeferShowCalendar(true) },
  ];

  return (
    <div className="font-body flex min-h-screen flex-col bg-[#F6F5F1] text-[#10243D] antialiased">
      {/* Top nav */}
      <header className="flex h-[66px] shrink-0 items-center justify-between border-b border-[#EAE7DE] bg-white px-8">
        <div className="flex items-baseline gap-2.5">
          <span className="font-serif text-[22px] font-semibold tracking-[-0.01em] text-[#10243D]">Coralum</span>
        </div>
        <nav className="flex items-center gap-7.5 text-sm text-[#51677C]">
          <span>Worklist</span>
          <span className="-mb-6 border-b-2 border-[#2E80D8] pb-5.5 font-semibold text-[#10243D]">Patient Review</span>
          <span>Insights</span>
        </nav>
        <div className="flex items-center gap-3">
          <div className="text-right leading-tight">
            <div className="text-[13px] font-semibold">{clinicianName}</div>
            <div className="text-[11px] text-[#8798A8]">{clinicianSpecialty}</div>
          </div>
          <div className="flex size-9 items-center justify-center rounded-full bg-[#E3EFFA] text-[13px] font-semibold text-[#2468B4]">
            {clinicianInitials}
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="text-xs font-semibold text-[#51677C] hover:text-[#10243D]"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="flex flex-1 flex-col transition-[opacity,transform] duration-[400ms] ease-[ease]" style={swapStyle}>
        {/* Patient header strip */}
        <section className="border-b border-[#EAE7DE] bg-white px-8 py-5">
          <div className="mx-auto flex max-w-[1240px] flex-wrap items-start justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex size-[54px] items-center justify-center rounded-full border border-[#E5E2D9] bg-[#EFEEE9] text-lg font-semibold text-[#51677C]">
                {cur.initials}
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="font-serif text-[26px] font-semibold tracking-[-0.01em] text-[#10243D]">{cur.name}</h1>
                  <span className="font-label rounded-full border border-[#DED9CB] px-2.5 py-[3px] text-[10px] text-[#A6ABA0]">
                    SAMPLE PATIENT
                  </span>
                </div>
                <div className="mt-1 text-[13px] text-[#6E8091]">{cur.meta}</div>
              </div>
            </div>
            <div className="flex flex-wrap items-start gap-8">
              <div className="min-w-[150px]">
                <div className="font-label mb-1 text-xs uppercase tracking-[0.14em] text-[#A6ABA0]">Diagnosis</div>
                <div className="text-sm font-semibold">{cur.diag}</div>
                <div className="text-xs text-[#8798A8]">{cur.diagSub}</div>
              </div>
              <div className="min-w-[150px]">
                <div className="font-label mb-1 text-xs uppercase tracking-[0.14em] text-[#A6ABA0]">Active problems</div>
                <div className="flex flex-wrap gap-1.5">
                  {cur.problems.map((prob) => (
                    <span key={prob} className="rounded-full bg-[#F1EFEA] px-2.5 py-[3px] text-xs text-[#51677C]">
                      {prob}
                    </span>
                  ))}
                </div>
              </div>
              <div className="min-w-[100px]">
                <div className="font-label mb-1 text-xs uppercase tracking-[0.14em] text-[#A6ABA0]">Last visit</div>
                <div className="text-sm font-semibold">{cur.lastVisit}</div>
                <div className="text-xs text-[#8798A8]">{cur.wearable}</div>
              </div>
              <div className="flex items-center gap-2.5 pt-0.5">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#10243D] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#10243D] transition-colors hover:bg-[#10243D] hover:text-white"
                >
                  <MessageIcon />
                  Message
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#D6D3C9] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#10243D] transition-colors hover:border-[#10243D]"
                >
                  <CallIcon />
                  Call
                </button>
              </div>
            </div>
          </div>
        </section>

        <main className="flex-1 px-8 py-7.5">
          <div className="mx-auto flex max-w-[1240px] flex-col gap-5.5">
            {/* Decision banner */}
            {decision && (
              <div
                className="flex items-center gap-3 rounded-2xl border px-5 py-4"
                style={{ background: decision.bg, borderColor: decision.border }}
              >
                <div
                  className="flex size-7 items-center justify-center rounded-full text-[15px] font-bold text-white"
                  style={{ background: decision.color }}
                >
                  {decision.mark}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold" style={{ color: decision.color }}>
                    {decision.label}
                  </div>
                  <div className="text-xs text-[#51677C]">{decision.sub}</div>
                </div>
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={submitting}
                  className="rounded-full border bg-transparent px-4 py-[7px] text-[13px] font-semibold disabled:opacity-60"
                  style={{ borderColor: decision.border, color: decision.color }}
                >
                  Undo
                </button>
              </div>
            )}

            {apiError && (
              <div className="rounded-2xl border border-[#F2CFCC] bg-[#FBEDEC] px-5 py-3 text-sm font-medium text-[#C2453B]">
                {apiError}
              </div>
            )}

            {/* Two-column: recommendation hero + reasoning */}
            <div className="grid items-start gap-5.5 lg:grid-cols-[1.2fr_1fr]">
              {/* Recommendation card */}
              <div className="overflow-hidden rounded-[18px] bg-white shadow-[0_6px_26px_rgba(16,36,61,0.06)]">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F0EEE8] px-6.5 py-5.5">
                  <div className="flex items-center gap-3">
                    <span className="font-label text-xs uppercase tracking-[0.14em] text-[#2E80D8]">Recommendation</span>
                    <span
                      className="rounded-full px-2.5 py-[3px] text-[11px] font-semibold"
                      style={{ color: urgencyStyle.color, background: urgencyStyle.bg }}
                    >
                      {cur.urgency}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: confidenceColor }}>
                    <span className="size-2 rounded-full" style={{ background: confidenceColor }} />
                    {cur.confidence}
                  </span>
                </div>

                <div className="p-6.5">
                  <div className="font-label mb-2.5 text-xs uppercase tracking-[0.14em] text-[#A6ABA0]">
                    Recommended Medication Adjustment
                  </div>
                  <div className="font-serif text-[26px] font-semibold leading-tight tracking-[-0.01em] text-[#10243D]">
                    {cur.drug}
                  </div>
                  <div className="mt-0.5 text-[15px] text-[#51677C]">{cur.drugSub}</div>

                  <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-stretch gap-4.5">
                    <div className="rounded-2xl bg-[#F7F6F2] px-5.5 py-5">
                      <div className="font-label mb-2 text-[11px] uppercase tracking-[0.14em] text-[#9DA7B2]">Current</div>
                      <div className="font-label text-[27px] font-medium tracking-[-0.02em] text-[#51677C]">
                        {cur.current.dose}
                      </div>
                      <div className="mt-0.5 text-[13px] text-[#8798A8]">mg · {cur.current.freq}</div>
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="text-[26px] text-[#C6C2B6]">→</span>
                    </div>
                    <div className="rounded-2xl border border-[#CFE1F6] bg-[#EDF4FC] px-5.5 py-5">
                      <div className="font-label mb-2 text-[11px] uppercase tracking-[0.14em] text-[#2E80D8]">
                        Recommended
                      </div>
                      <div className="font-label text-[27px] font-medium tracking-[-0.02em] text-[#10243D]">
                        {rec.cd}/{rec.ld}
                      </div>
                      <div className="mt-0.5 text-[13px] text-[#2468B4]">mg · {rec.freq}</div>
                    </div>
                  </div>
                  <div className="mt-3.5 inline-flex items-center gap-1.5 rounded-full bg-[#EAF3FB] px-3.5 py-1.5 text-xs font-semibold text-[#2468B4]">
                    {change.arrow} {change.text}
                  </div>

                  {/* Modify inline */}
                  {modifying && (
                    <div className="mt-5 rounded-2xl border border-[#CFE1F6] bg-[#F6FAFF] p-4.5 [animation:drawerIn_0.18s_ease]">
                      <div className="font-label mb-3.5 text-xs uppercase tracking-[0.14em] text-[#2E80D8]">
                        Modify recommended dose
                      </div>
                      <div className="flex flex-wrap items-end gap-3.5">
                        <label className="flex flex-col gap-1.5 text-[13px] font-medium text-[#51677C]">
                          Carbidopa (mg)
                          <input
                            type="number"
                            step={0.25}
                            value={draft.cd}
                            onChange={(e) => setDraft((d) => ({ ...d, cd: e.target.value }))}
                            className="font-label w-[120px] rounded-[10px] border border-[#D8D4CA] px-3 py-2.5 text-sm"
                          />
                        </label>
                        <label className="flex flex-col gap-1.5 text-[13px] font-medium text-[#51677C]">
                          Levodopa (mg)
                          <input
                            type="number"
                            step={1}
                            value={draft.ld}
                            onChange={(e) => setDraft((d) => ({ ...d, ld: e.target.value }))}
                            className="font-label w-[120px] rounded-[10px] border border-[#D8D4CA] px-3 py-2.5 text-sm"
                          />
                        </label>
                        <label className="flex flex-col gap-1.5 text-[13px] font-medium text-[#51677C]">
                          Frequency
                          <select
                            value={draft.freq}
                            onChange={(e) => setDraft((d) => ({ ...d, freq: e.target.value }))}
                            className="rounded-[10px] border border-[#D8D4CA] bg-white px-3 py-2.5 text-sm"
                          >
                            <option>once daily</option>
                            <option>twice daily</option>
                            <option>three times daily</option>
                            <option>four times daily</option>
                          </select>
                        </label>
                      </div>
                      <div className="mt-4 flex gap-2.5">
                        <button
                          type="button"
                          onClick={() => {
                            setRec({ ...draft });
                            setModifying(false);
                          }}
                          className="rounded-full bg-[#10243D] px-5.5 py-2.5 text-[13px] font-semibold text-white"
                        >
                          Save changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setModifying(false)}
                          className="rounded-full border border-[#D6D3C9] bg-white px-5.5 py-2.5 text-[13px] font-semibold text-[#10243D]"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-6.5 flex flex-col gap-4.5">
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={handleApprove}
                        disabled={submitting}
                        className={`${pillButton} bg-[#10243D] px-7.5 py-3.5 text-sm text-white hover:bg-[#1C3959] disabled:opacity-60`}
                      >
                        Approve recommendation
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setModifying(true);
                          setDraft({ ...rec });
                        }}
                        disabled={submitting}
                        className="rounded-full border border-[#10243D] bg-white px-5.5 py-3 text-sm font-semibold text-[#10243D] transition-colors hover:bg-[#F7F6F2] disabled:opacity-60"
                      >
                        Modify dose
                      </button>
                      <div className="relative inline-block">
                        <button
                          type="button"
                          onClick={() => {
                            setDeferPopupOpen((o) => !o);
                            setDeferShowCalendar(false);
                            setCalMonthOffset(0);
                          }}
                          disabled={submitting}
                          className="rounded-full border border-[#D6D3C9] bg-white px-5.5 py-3 text-sm font-semibold text-[#10243D] transition-colors hover:border-[#10243D] disabled:opacity-60"
                        >
                          Defer
                        </button>
                        {deferPopupOpen && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute top-[calc(100%+8px)] left-0 z-20 w-70 min-h-65 rounded-2xl border border-[#E5E2D9] bg-white p-4 shadow-[0_16px_36px_rgba(16,36,61,0.16)] [animation:drawerIn_0.15s_ease]"
                          >
                            {deferShowCalendar ? (
                              <div>
                                <div className="flex items-center gap-2 px-0.5 pb-3">
                                  <button
                                    type="button"
                                    onClick={() => setDeferShowCalendar(false)}
                                    className="-m-1 p-1 text-[15px] leading-none text-[#51677C] hover:text-[#10243D]"
                                  >
                                    ←
                                  </button>
                                  <span className="font-label text-xs uppercase tracking-[0.14em] text-[#A6ABA0]">
                                    Choose a follow-up date
                                  </span>
                                </div>
                                <div className="flex items-center justify-between px-0.5 pb-2.5">
                                  <button
                                    type="button"
                                    onClick={() => setCalMonthOffset((o) => Math.max(0, o - 1))}
                                    className="px-2 py-1 text-[15px] text-[#51677C] hover:text-[#10243D]"
                                  >
                                    ‹
                                  </button>
                                  <span className="text-[13.5px] font-semibold text-[#10243D]">{cal.label}</span>
                                  <button
                                    type="button"
                                    onClick={() => setCalMonthOffset((o) => o + 1)}
                                    className="px-2 py-1 text-[15px] text-[#51677C] hover:text-[#10243D]"
                                  >
                                    ›
                                  </button>
                                </div>
                                <div className="grid grid-cols-7 gap-0.5 px-0.5 pb-1">
                                  {CAL_WEEKDAYS.map((wd, i) => (
                                    <div key={i} className="font-label text-center text-[10px] text-[#A6ABA0]">
                                      {wd}
                                    </div>
                                  ))}
                                </div>
                                <div className="grid grid-cols-7 gap-0.5 px-0.5">
                                  {cal.cells.map((c, i) =>
                                    c.blank ? (
                                      <div key={i} className="aspect-square" />
                                    ) : (
                                      <button
                                        key={i}
                                        type="button"
                                        disabled={c.disabled || submitting}
                                        onClick={() => !c.disabled && handleDeferDate(c.date as Date)}
                                        className="aspect-square rounded-lg text-[12.5px] hover:bg-[#EAF3FB]"
                                        style={{
                                          background: c.isToday ? "#EDF4FC" : "transparent",
                                          color: c.disabled ? "#C9C5B9" : c.isToday ? "#2468B4" : "#24384E",
                                          fontWeight: c.isToday ? 700 : 500,
                                        }}
                                      >
                                        {c.day}
                                      </button>
                                    ),
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div className="font-label px-2.5 pb-3 pt-1 text-xs uppercase tracking-[0.14em] text-[#A6ABA0]">
                                  Follow up in
                                </div>
                                {deferOptions.map((opt) => (
                                  <button
                                    key={opt.label}
                                    type="button"
                                    disabled={submitting}
                                    onClick={opt.onSelect}
                                    className="w-full rounded-[9px] px-2.5 py-3 text-left text-sm font-medium text-[#24384E] hover:bg-[#F1EFEA] disabled:opacity-60"
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="relative inline-block">
                        <button
                          type="button"
                          onClick={handleDecline}
                          disabled={submitting}
                          onMouseEnter={() => setDeclineTipOpen(true)}
                          onMouseLeave={() => setDeclineTipOpen(false)}
                          className="rounded-full border-[1.5px] border-[#C2453B] bg-transparent px-5.5 py-3 text-sm font-semibold text-[#C2453B] transition-colors hover:bg-[#FBEDEC] disabled:opacity-60"
                        >
                          Decline
                        </button>
                        {declineTipOpen && (
                          <div className="absolute top-1/2 left-[calc(100%+12px)] w-55 -translate-y-1/2 rounded-[10px] bg-[#10243D] px-3.5 py-2.5 text-[12.5px] leading-snug font-medium text-white shadow-[0_10px_24px_rgba(16,36,61,0.22)]">
                            This will keep the current medication dosage the same.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5.5 flex items-center gap-2.5 border-t border-[#F0EEE8] pt-4">
                    <PharmacyIcon />
                    <span className="text-[13px] text-[#6E8091]">
                      Pharmacy on file ·{" "}
                      <span className="font-medium text-[#24384E]">
                        {cur.pharmacyName ?? "No pharmacy on file"}
                        {cur.pharmacyAddress ? `, ${cur.pharmacyAddress}` : ""}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Reasoning card */}
              <div className="self-stretch rounded-[18px] border border-[#EDEAE1] bg-[#FBFAF6] p-6.5 shadow-[0_6px_26px_rgba(16,36,61,0.06)]">
                <h2 className="font-serif mb-5 text-[22px] font-semibold tracking-[-0.01em] text-[#10243D]">Reasoning</h2>
                <div className="flex flex-col gap-4.5">
                  {cur.reasons.map((r, i) => (
                    <div key={i} className="flex items-start gap-3.5">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-[11px]" style={{ background: r.chip }}>
                        <ReasonIcon kind={r.icon} />
                      </div>
                      <div className="pt-0.5">
                        <div className="text-[15.5px] leading-snug text-[#24384E]">{r.text}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5.5 border-t border-[#ECE9E0] pt-5">
                  <div className="font-label mb-2.5 text-xs uppercase tracking-[0.14em] text-[#2E80D8]">
                    Summarized Transcript Notes
                  </div>
                  <ul className="m-0 flex flex-col gap-1.5 pl-4.5">
                    {cur.transcriptHighlights.map((hl, i) => (
                      <li key={i} className="text-[13.5px] leading-snug text-[#24384E]">
                        {hl}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => setShowTranscript(true)}
                    className="mt-3.5 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[#2E80D8] hover:underline"
                  >
                    <MessageIcon />
                    View conversation transcript
                  </button>
                </div>
              </div>
            </div>

            {/* Sensor data drawer */}
            <div className="overflow-hidden rounded-[18px] bg-white shadow-[0_6px_26px_rgba(16,36,61,0.06)]">
              <button
                type="button"
                onClick={() => setExpanded((e) => !e)}
                className="flex w-full items-center gap-3 px-6.5 py-5 text-left hover:bg-[#F8F7F3]"
              >
                <span
                  className="flex size-6.5 shrink-0 items-center justify-center rounded-full bg-[#EDF4FC] text-xs text-[#2E80D8] transition-transform"
                  style={{ transform: `rotate(${expanded ? 0 : -90}deg)` }}
                >
                  ▼
                </span>
                <span className="font-serif text-[19px] font-semibold tracking-[-0.01em] text-[#10243D]">
                  Wearable Movement Tracking Data
                </span>
                <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#2E80D8]">
                  {expanded ? "" : "Click to expand ›"}
                </span>
                <span className="font-label ml-auto text-[11px] text-[#A6ABA0]">
                  {expanded ? cur.drawerLabel : "Placeholder data"}
                </span>
              </button>

              {expanded && (
                <div className="border-t border-[#F0EEE8] px-6.5 pb-7 [animation:drawerIn_0.2s_ease]">
                  <div className="mt-5 flex flex-wrap items-start gap-6.5">
                    <div className="min-w-[420px] flex-1">
                      <div className="font-label mb-2 text-[11px] uppercase tracking-[0.14em] text-[#A6ABA0]">
                        Accelerometer · time domain
                      </div>
                      <TimeDomainChart />
                    </div>
                    <div className="min-w-[440px] flex-1">
                      <div className="font-label mb-2 text-[11px] uppercase tracking-[0.14em] text-[#A6ABA0]">
                        Power spectral density
                      </div>
                      <PsdChart />
                    </div>
                  </div>
                  <div className="mt-4.5 flex flex-wrap items-center gap-6 text-xs text-[#51677C]">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-[3px] w-4 rounded bg-[#E1875A]" />
                      Baseline
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-[3px] w-4 rounded bg-[#2E80D8]" />
                      Recording · Jul 1, 2026 (7 days ago)
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-0 w-3.5 border-t-2 border-dotted border-[#2E80D8]" />
                      Dyskinesia range (3.5–9 Hz)
                    </span>
                    <span className="font-label ml-auto text-[#A6ABA0]">Placeholder · pending live data integration</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Transcript modal */}
      {showTranscript && (
        <div
          onClick={() => setShowTranscript(false)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(16,36,61,0.42)] p-7 [animation:drawerIn_0.16s_ease]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[82vh] w-full max-w-145 flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_24px_60px_rgba(16,36,61,0.28)]"
          >
            <div className="flex items-start justify-between gap-3 border-b border-[#F0EEE8] px-6.5 py-5.5">
              <div>
                <div className="font-label mb-1.5 text-xs uppercase tracking-[0.14em] text-[#2E80D8]">Patient report</div>
                <h3 className="font-serif text-[22px] font-semibold text-[#10243D]">Conversation transcript</h3>
                <div className="mt-1 text-[12.5px] text-[#8798A8]">
                  Coralum Care · {cur.name} · {cur.transcriptDate}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTranscript(false)}
                className="flex size-8.5 shrink-0 items-center justify-center rounded-full border border-[#E5E2D9] bg-white text-[15px] leading-none text-[#51677C] hover:border-[#10243D] hover:text-[#10243D]"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-4 overflow-y-auto bg-[#FBFAF6] px-6.5 py-5.5">
              {cur.transcript.map((m, i) => (
                <div key={i} className={`flex flex-col gap-1.5 ${m.patient ? "items-end" : "items-start"}`}>
                  <div
                    className="max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-snug text-[#24384E]"
                    style={{ background: m.patient ? "#EDF4FC" : "#F1EFE8" }}
                  >
                    {m.text}
                  </div>
                  <div className="font-label px-1 text-[10.5px] text-[#A6ABA0]">
                    {m.name} · {m.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
