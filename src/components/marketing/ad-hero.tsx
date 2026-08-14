import Link from 'next/link';
import { ArrowRightIcon } from './icons';
import MedicareBadge from './medicare-badge';

export default function AdHero({
  headingPlain,
  headingHighlight,
  subhead,
  source,
}: {
  headingPlain: string;
  headingHighlight: string;
  subhead: string;
  source: string;
}) {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_50%_30%,rgba(131,188,169,0.14),rgba(66,94,85,0.07)_35%,transparent_70%)] py-24">
      <div className="pointer-events-none absolute -right-24 top-32 size-96 rounded-full bg-coralum-peach opacity-20 blur-[100px]" />
      <div className="pointer-events-none absolute -left-24 top-24 size-72 rounded-full bg-coralum-blue opacity-10 blur-[80px]" />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <h1 className="font-serif text-3xl tracking-tight text-coralum-navy sm:text-5xl lg:text-6xl">
          {headingPlain} <span className="text-coralum-blue">{headingHighlight}</span>
        </h1>

        <p className="mt-5 max-w-2xl font-serif text-lg italic text-coralum-navy/70 sm:text-xl lg:text-2xl">
          {subhead}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:mt-10">
          <a
            href="#how-it-works"
            className="rounded-full border border-coralum-navy/10 px-7 py-3.5 font-body text-sm font-medium text-coralum-navy transition hover:bg-white"
          >
            How it works
          </a>
          <Link
            href={`/waitlist?source=${encodeURIComponent(source)}`}
            className="flex items-center gap-2.5 rounded-full bg-coralum-navy px-7 py-3.5 font-body text-sm font-medium text-white transition hover:bg-coralum-navy/90"
          >
            Join the Waitlist
            <ArrowRightIcon className="size-3.5" />
          </Link>
        </div>

        <div className="mt-8 sm:mt-10">
          <MedicareBadge />
        </div>
      </div>
    </section>
  );
}
