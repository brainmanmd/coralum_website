"use client";

import { useMemo, useState } from "react";
import type { WearableProvider } from "@/lib/wearables/types";
import type { WearableProviderMetadata } from "@/lib/wearables/providers";
import type { ProviderIntegrationSkeleton } from "@/lib/wearables/integration";
import { ConnectAction } from "./connect-actions";

interface ProviderEntry extends WearableProviderMetadata {
  integration: ProviderIntegrationSkeleton;
}

interface OnboardingProviderListProps {
  providers: ProviderEntry[];
  initialConnected: WearableProvider[];
}

export function OnboardingProviderList({ providers, initialConnected }: OnboardingProviderListProps) {
  const [connectedProviders, setConnectedProviders] = useState<WearableProvider[]>(initialConnected);

  const providerEntries = useMemo(
    () =>
      providers.map((provider) => ({
        ...provider,
        isConnected: connectedProviders.includes(provider.id),
      })),
    [connectedProviders, providers],
  );

  const handleConnect = (provider: WearableProvider) => {
    setConnectedProviders((current) => (current.includes(provider) ? current : [...current, provider]));
  };

  return (
    <div className="mt-6 space-y-3">
      {providerEntries.map((provider) => {
        return (
          <div key={provider.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-900">{provider.label}</p>
                <p className="mt-1 text-sm text-slate-600">{provider.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex h-3 w-3 rounded-full ${provider.isConnected ? "bg-emerald-500" : "bg-slate-300"}`}
                />
                <span className={`text-sm font-medium ${provider.isConnected ? "text-emerald-700" : "text-slate-500"}`}>
                  {provider.isConnected ? "Connected" : "Not connected"}
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex-1">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Connection flow</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{provider.integration.title}</p>
                <p className="mt-1 text-sm text-slate-600">{provider.integration.summary}</p>
                <ul className="mt-2 space-y-1 text-xs text-slate-500">
                  {provider.integration.steps.map((step) => (
                    <li key={step}>• {step}</li>
                  ))}
                </ul>
              </div>
              <ConnectAction
                providerId={provider.id}
                providerLabel={provider.label}
                connectRoute={provider.connectRoute}
                isConnected={provider.isConnected}
                onConnect={handleConnect}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
