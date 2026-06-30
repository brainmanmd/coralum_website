import Link from 'next/link';
import { ArrowRightIcon } from './icons';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_50%_30%,rgba(131,188,169,0.14),rgba(66,94,85,0.07)_35%,transparent_70%)] py-24">
      <div className="pointer-events-none absolute -right-24 top-32 size-96 rounded-full bg-coralum-peach opacity-20 blur-[100px]" />
      <div className="pointer-events-none absolute -left-24 top-24 size-72 rounded-full bg-coralum-blue opacity-10 blur-[80px]" />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-coralum-navy/10 bg-white px-3.5 py-1.5">
          <span className="size-1.5 rounded-full bg-coralum-sage" />
          <span className="font-label text-xs text-coralum-slate">
            AI-enabled care for Parkinson&apos;s Disease
          </span>
        </span>

        <h1 className="mt-8 font-serif text-5xl tracking-tight text-coralum-navy sm:text-6xl lg:text-7xl">
          Closing the Parkinson&apos;s{' '}
          <span className="text-coralum-blue">Care Loop</span>
        </h1>

        <p className="mt-5 max-w-2xl font-serif text-xl italic text-coralum-navy/70 sm:text-2xl">
          Real-time insights and interventions beyond the clinic walls
        </p>

        <p className="mt-3 max-w-md font-body text-lg text-coralum-slate">
          Care that reaches you, anytime, anywhere
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#how-it-works"
            className="rounded-full border border-coralum-navy/10 px-7 py-3.5 font-body text-sm font-medium text-coralum-navy transition hover:bg-white"
          >
            How it works
          </a>
          <Link
            href="/waitlist"
            className="flex items-center gap-2.5 rounded-full bg-coralum-navy px-7 py-3.5 font-body text-sm font-medium text-white transition hover:bg-coralum-navy/90"
          >
            Join the Waitlist
            <ArrowRightIcon className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
