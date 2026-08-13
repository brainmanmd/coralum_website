import Link from 'next/link';
import { ArrowRightIcon } from './icons';
import MedicareBadge from './medicare-badge';

export default function ForCaregivers({
  showMedicareBadge = false,
}: {
  showMedicareBadge?: boolean;
}) {
  return (
    <section className="border-t border-coralum-navy/10 py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-2xl bg-coralum-navy px-6 py-12 sm:px-14 sm:py-16">
          <div className="pointer-events-none absolute -top-16 right-0 size-64 rounded-full bg-coralum-sage opacity-20 blur-[60px]" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 size-48 rounded-full bg-coralum-peach opacity-15 blur-[50px]" />

          <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
            <div className="max-w-xl">
              <p className="font-label text-xs uppercase tracking-[0.1em] text-coralum-peach">
                Join the waitlist
              </p>
              <h2 className="mt-4 font-serif text-4xl text-white">
                Be the first to experience better Parkinson&apos;s care
              </h2>
              <p className="mt-4 font-body text-base leading-relaxed text-white/60">
                Coralum connects you with a specialized care team between
                visits, so care happens continuously, not just at your next
                appointment. Join the waitlist to be among the first patients
                and caregivers to try it.
              </p>
              {showMedicareBadge && (
                <div className="mt-6">
                  <MedicareBadge />
                </div>
              )}
            </div>

            <Link
              href="/waitlist"
              className="flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-body text-sm font-medium text-coralum-navy transition hover:bg-white/90 sm:w-auto"
            >
              Join the Waitlist
              <ArrowRightIcon className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
