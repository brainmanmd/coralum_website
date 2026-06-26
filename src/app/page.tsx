import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#f7fdf8_0%,#eefbf3_100%)] px-6 py-16 text-slate-900">
      <section className="w-full max-w-5xl overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-[0_25px_100px_rgba(15,23,42,0.08)]">
        <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:p-16">
          <div className="flex flex-col justify-center gap-6">
            <span className="w-fit rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              Digital health, reimagined
            </span>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Coralum Care
              </h1>
              <p className="max-w-xl text-lg leading-8 text-slate-600">
                A modern care experience that helps members stay connected to their wellness goals with clarity, confidence, and support.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/onboarding"
                className="rounded-full bg-emerald-600 px-6 py-3 font-medium text-white transition hover:bg-emerald-700"
              >
                Enroll Now
              </Link>
              <a
                href="#learn-more"
                className="rounded-full border border-slate-300 px-6 py-3 font-medium text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700"
              >
                Learn More
              </a>
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-slate-950 p-8 text-white sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
              Preview
            </p>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-sm text-slate-300">Daily readiness</p>
                <p className="mt-2 text-3xl font-semibold">82%</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-sm text-slate-300">Care focus</p>
                <p className="mt-2 text-lg font-medium">Recovery + sleep support</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-sm text-slate-300">Connected insights</p>
                <p className="mt-2 text-lg font-medium">Oura and Whoop ready</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
