"use client";

import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#f7fdf8_0%,#eefbf3_100%)] px-6 py-16 text-slate-900">
      <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 shadow-[0_25px_100px_rgba(15,23,42,0.08)]">
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-semibold text-red-600">Something went wrong</h1>
            <p className="mt-2 text-sm text-slate-600">
              An unexpected error occurred. Please try again or contact support if the issue persists.
            </p>
          </div>

          {error.message && (
            <div className="rounded-lg bg-red-50 p-3">
              <p className="text-xs font-mono text-red-700">{error.message}</p>
            </div>
          )}

          {error.digest && (
            <p className="text-xs text-slate-500">Error ID: {error.digest}</p>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            onClick={reset}
            className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-lg bg-slate-100 px-4 py-2 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-200"
          >
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
