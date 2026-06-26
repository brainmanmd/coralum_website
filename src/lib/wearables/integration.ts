import type { WearableProvider } from "./types";

export interface ProviderIntegrationSkeleton {
  title: string;
  summary: string;
  steps: string[];
}

export function getProviderIntegrationSkeleton(provider: WearableProvider): ProviderIntegrationSkeleton {
  switch (provider) {
    case "oura":
      return {
        title: "Oura Ring API",
        summary: "Retrieves daily readiness, sleep stages, and resting heart rate.",
        steps: ["OAuth handshake", "token refresh", "daily metrics sync"],
      };
    case "whoop":
      return {
        title: "WHOOP API v2",
        summary: "Pulls recovery score, sleep performance, and strain cycles.",
        steps: ["OAuth handshake", "token refresh", "daily metrics sync"],
      };
    case "apple-watch":
      return {
        title: "Apple HealthKit",
        summary: "Bridges HealthKit workout, step, and heart-rate exports.",
        steps: ["HealthKit authorization", "sync cadence", "stream normalization"],
      };
    case "fitbit":
      return {
        title: "Fitbit Web API",
        summary: "Fetches daily activity, heart rate zones, and sleep summary.",
        steps: ["OAuth handshake", "token refresh", "daily metrics sync"],
      };
    case "google-fit":
      return {
        title: "Google Fit REST API",
        summary: "Reads activity sessions and aggregate fitness data from Google Health.",
        steps: ["OAuth handshake", "token refresh", "daily metrics sync"],
      };
    case "samsung-health":
      return {
        title: "Samsung Health Platform",
        summary: "Exports daily health data via Samsung Health partner SDK.",
        steps: ["SDK authorization", "sync cadence", "stream normalization"],
      };
    default:
      return {
        title: "Generic wearable integration",
        summary: "A shared placeholder for future providers.",
        steps: ["authorization", "sync", "data mapping"],
      };
  }
}
