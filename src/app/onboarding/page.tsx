import Link from "next/link";
import { getWearableProviderCatalog } from "@/lib/wearables/providers";
import { getProviderIntegrationSkeleton } from "@/lib/wearables/integration";
import type { WearableProvider } from "@/lib/wearables/types";
import { OnboardingProviderList } from "./provider-list";

interface OnboardingPageProps {
  searchParams: Promise<{ connected?: string; error?: string; reason?: string }>;
}

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const { connected, error, reason } = await searchParams;
  const providers = getWearableProviderCatalog();

  // Pre-seed the connected set from the callback redirect so the page reflects
  // real OAuth completions even before the user interacts with anything.
  const initialConnected = connected ? [connected as WearableProvider] : [];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.18),_transparent_48%),linear-gradient(135deg,#f8fffb_0%,#eefbf3_100%)] px-6 py-20 text-slate-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 rounded-3xl border border-emerald-100 bg-white/80 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-12">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
            Coralum Care
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Let&apos;s personalize your care plan.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            Connect your wearable devices to share health data. Each provider uses a secure OAuth
            handoff — your credentials never pass through our servers.
          </p>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <strong className="font-semibold">Connection failed</strong> for{" "}
            <span className="font-medium">{error}</span>
            {reason && (
              <span className="text-red-500"> ({reason.replace(/_/g, " ")})</span>
            )}
            . Please try again or contact support if the issue persists.
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Connect your wearable</h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                Authorize each device you want to use. Your connection credentials are stored in
                secure, httpOnly cookies and are never exposed to JavaScript.
              </p>
            </div>
            <div className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600">
              {providers.length} providers available
            </div>
          </div>

          <OnboardingProviderList
            providers={providers.map((p) => ({
              ...p,
              integration: getProviderIntegrationSkeleton(p.id),
            }))}
            initialConnected={initialConnected}
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/"
            className="rounded-full border border-slate-300 px-6 py-3 font-medium text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700"
          >
            Back home
          </Link>
          <button className="rounded-full bg-emerald-600 px-6 py-3 font-medium text-white transition hover:bg-emerald-700">
            Continue
          </button>
        </div>
      </div>
    </main>
  );
}
