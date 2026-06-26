import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#f7fdf8_0%,#eefbf3_100%)] px-6 py-16 text-slate-900">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_25px_100px_rgba(15,23,42,0.08)]">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Error</p>
            <h1 className="mt-2 text-4xl font-semibold">404</h1>
          </div>
          <p className="text-slate-600">
            The page you're looking for doesn't exist. It may have been removed or the URL might be incorrect.
          </p>
        </div>

        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}
