import type { ReasonIconKind } from "@/lib/dashboard/patient-review-data";

const common = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function PhoneIcon() {
  return (
    <svg {...common} stroke="#D98B54" aria-hidden="true">
      <rect x={7} y={2} width={10} height={20} rx={2.2} />
      <line x1={11} y1={18} x2={13} y2={18} />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg {...common} stroke="#D98B54" aria-hidden="true">
      <circle cx={12} cy={12} r={9} />
      <polyline points="12 7 12 12 15.5 14" />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg {...common} stroke="#2E80D8" aria-hidden="true">
      <polyline points="3 12 7 12 10 4 14 20 17 12 21 12" />
    </svg>
  );
}

export function ReasonIcon({ kind }: { kind: ReasonIconKind }) {
  if (kind === "phone") return <PhoneIcon />;
  if (kind === "clock") return <ClockIcon />;
  return <ActivityIcon />;
}

export function MessageIcon({ className }: { className?: string }) {
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function CallIcon({ className }: { className?: string }) {
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L7.6 9.8a16 16 0 0 0 6 6l1.4-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z" />
    </svg>
  );
}

export function PharmacyIcon({ className }: { className?: string }) {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#8798A8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}
