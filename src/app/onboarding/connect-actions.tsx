"use client";

import { useCallback, useMemo, useState } from "react";
import type { WearableProvider } from "@/lib/wearables/types";

interface ConnectActionProps {
  providerId: WearableProvider;
  providerLabel: string;
  connectRoute: string;
  isConnected: boolean;
  onConnect: (provider: WearableProvider) => void;
}

type ButtonStatus = "idle" | "authorizing" | "connected" | "error";

// Memoized to avoid recreation on every render
const authorizationCopy: Record<WearableProvider, Record<ButtonStatus, string>> = {
  oura: {
    idle: "Authorize Oura to share sleep, readiness, and recovery insights.",
    authorizing: "Redirecting to Oura for secure consent…",
    connected: "Oura connected. Your wellness data is ready to sync.",
    error: "Could not connect to Oura. Please try again.",
  },
  whoop: {
    idle: "Authorize WHOOP to share recovery, strain, and sleep data.",
    authorizing: "Redirecting to WHOOP for secure consent…",
    connected: "WHOOP connected. Your performance metrics are ready to sync.",
    error: "Could not connect to WHOOP. Please try again.",
  },
  "apple-watch": {
    idle: "Authorize Apple Health to share activity and heart-rate data.",
    authorizing: "Redirecting to Apple for secure consent…",
    connected: "Apple Health connected. Your activity data is ready to sync.",
    error: "Could not connect to Apple Health. Please try again.",
  },
  fitbit: {
    idle: "Authorize Fitbit to share activity, heart rate, and sleep data.",
    authorizing: "Redirecting to Fitbit for secure consent…",
    connected: "Fitbit connected. Your health data is ready to sync.",
    error: "Could not connect to Fitbit. Please try again.",
  },
  "google-fit": {
    idle: "Authorize Google Health to share fitness and activity data.",
    authorizing: "Redirecting to Google for secure consent…",
    connected: "Google Health connected. Your fitness data is ready to sync.",
    error: "Could not connect to Google Health. Please try again.",
  },
  "samsung-health": {
    idle: "Authorize Samsung Health to share activity and sleep data.",
    authorizing: "Redirecting to Samsung Health for secure consent…",
    connected: "Samsung Health connected. Your health data is ready to sync.",
    error: "Could not connect to Samsung Health. Please try again.",
  },
  unknown: {
    idle: "Authorize this provider to begin sharing wearable data.",
    authorizing: "Opening authorization…",
    connected: "Connected. Your wearable data is ready to sync.",
    error: "Could not connect. Please try again.",
  },
};

export function ConnectAction({ providerId, providerLabel, connectRoute, isConnected, onConnect }: ConnectActionProps) {
  const [status, setStatus] = useState<ButtonStatus>(isConnected ? "connected" : "idle");

  const handleClick = useCallback(async () => {
    if (status === "connected") return;

    setStatus("authorizing");

    try {
      const response = await fetch(connectRoute);
      const data = (await response.json()) as { authorizationUrl?: string; error?: string };

      if (!response.ok || !data.authorizationUrl) {
        throw new Error(data.error ?? `Unable to start ${providerLabel} authorization`);
      }

      // Redirect the browser to the provider's OAuth consent screen.
      // The state cookie set by the connect route is already in the browser
      // (fetch processes Set-Cookie headers), so the callback can validate it.
      window.location.assign(data.authorizationUrl);
    } catch (err) {
      console.error(`${providerLabel} authorization failed`, err);
      setStatus("error");
    }
  }, [status, connectRoute, providerLabel]);

  const { buttonClass, buttonLabel } = useMemo(() => {
    const buttonClass =
      status === "connected"
        ? "bg-emerald-600 text-white cursor-default"
        : status === "authorizing"
          ? "bg-amber-500 text-white cursor-wait"
          : status === "error"
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-emerald-600 text-white hover:bg-emerald-700";

    const buttonLabel =
      status === "connected"
        ? `Connected to ${providerLabel}`
        : status === "authorizing"
          ? `Connecting to ${providerLabel}…`
          : status === "error"
            ? `Retry ${providerLabel}`
            : `Connect ${providerLabel}`;

    return { buttonClass, buttonLabel };
  }, [status, providerLabel]);

  const copyText = useMemo(() => authorizationCopy[providerId][status], [providerId, status]);

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={status === "authorizing"}
        className={`rounded-full px-4 py-2 text-sm font-medium transition ${buttonClass}`}
      >
        {buttonLabel}
      </button>
      <p className="max-w-xs text-right text-xs leading-5 text-slate-500">{copyText}</p>
    </div>
  );
}
