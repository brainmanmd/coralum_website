export function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 14 14" fill="none" className={className} aria-hidden="true">
      <path d="M2.917 7h8.166M7.583 3.5 11.083 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 15 15" fill="none" className={className} aria-hidden="true">
      <path d="M9.375 3.125 4.5 7.5l4.875 4.375" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path d="M7 16.5 13 22l12-13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckSmallIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 9" fill="none" className={className} aria-hidden="true">
      <path d="M1 4.5 4.2 7.7 11 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ZapIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" fill="none" className={className} aria-hidden="true">
      <path d="M9.75 1.5 3 10.5h5.25L8.25 16.5 15 7.5H9.75L9.75 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BarChartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" fill="none" className={className} aria-hidden="true">
      <path d="M3 15.75V8.25M9 15.75V2.25M15 15.75v-5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HomeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" fill="none" className={className} aria-hidden="true">
      <path d="M2.25 8.25 9 2.25l6.75 6V15a.75.75 0 0 1-.75.75h-3.375a.375.375 0 0 1-.375-.375V12a1.5 1.5 0 0 0-1.5-1.5h-1.5a1.5 1.5 0 0 0-1.5 1.5v3.375a.375.375 0 0 1-.375.375H3a.75.75 0 0 1-.75-.75Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function UsersIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" fill="none" className={className} aria-hidden="true">
      <path d="M12.75 15.75v-1.5a3 3 0 0 0-3-3h-4.5a3 3 0 0 0-3 3v1.5M16.5 15.75v-1.5a3 3 0 0 0-2.25-2.9M11.063 2.973a3 3 0 0 1 0 5.555M7.5 8.25a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LinkedInBadge({ className }: { className?: string }) {
  return (
    <span
      className={`flex size-[28px] shrink-0 items-center justify-center rounded-[6px] bg-[#0a66c2] font-body text-[15px] font-medium text-coralum-cream ${className ?? ""}`}
      aria-label="LinkedIn"
    >
      in
    </span>
  );
}
