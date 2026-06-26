export default function OnboardingLoading() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.18),_transparent_48%),linear-gradient(135deg,#f8fffb_0%,#eefbf3_100%)] px-6 py-20 text-slate-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 rounded-3xl border border-emerald-100 bg-white/80 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-12">
        <div className="space-y-4">
          <div className="h-4 w-32 animate-pulse rounded-full bg-slate-200" />
          <div className="h-10 w-48 animate-pulse rounded-lg bg-slate-200" />
          <div className="space-y-2">
            <div className="h-5 w-full max-w-2xl animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-5/6 max-w-2xl animate-pulse rounded bg-slate-200" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
              <div className="mt-2 h-4 w-full max-w-2xl animate-pulse rounded bg-slate-200" />
            </div>
            <div className="h-8 w-32 animate-pulse rounded-full bg-slate-200" />
          </div>

          <div className="mt-6 space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="h-5 w-20 animate-pulse rounded bg-slate-200" />
                    <div className="mt-2 h-4 w-32 animate-pulse rounded bg-slate-200" />
                  </div>
                  <div className="h-6 w-24 animate-pulse rounded-full bg-slate-200" />
                </div>
                <div className="mt-4 h-32 animate-pulse rounded-2xl bg-slate-100" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="h-12 w-32 animate-pulse rounded-full bg-slate-200" />
          <div className="h-12 w-32 animate-pulse rounded-full bg-slate-200" />
        </div>
      </div>
    </main>
  );
}
