import type {
  ConnectedWearableSummary,
  WearableConnection,
  WearableDataPoint,
  WearableIntegrationMode,
  WearableProvider,
} from "./types";

export interface WearableProviderMetadata {
  id: WearableProvider;
  label: string;
  description: string;
  connectRoute: string;
  exampleStreams: string[];
}

export interface WearableProviderAdapter {
  readonly provider: WearableProvider;
  connect(): Promise<WearableConnection>;
  fetchLatestData(): Promise<WearableDataPoint[]>;
}

class PlaceholderAdapter implements WearableProviderAdapter {
  constructor(readonly provider: WearableProvider) {}

  async connect(): Promise<WearableConnection> {
    return {
      provider: this.provider,
      status: "connected",
      integrationMode: this.getIntegrationMode(),
      connectedAt: new Date().toISOString(),
      lastSyncedAt: new Date().toISOString(),
      dataStreams: this.getStreams(),
    };
  }

  async fetchLatestData(): Promise<WearableDataPoint[]> {
    const now = new Date().toISOString();
    return this.getStreams().map((stream, index) => ({
      provider: this.provider,
      stream,
      value: this.getSampleValue(stream, index),
      unit: this.getUnit(stream),
      timestamp: now,
    }));
  }

  private getStreams(): string[] {
    switch (this.provider) {
      case "oura":
        return ["sleep", "readiness", "heart-rate"];
      case "whoop":
        return ["sleep", "recovery", "cycles"];
      case "apple-watch":
        return ["steps", "heart-rate", "workout"];
      case "fitbit":
        return ["steps", "heart-rate", "sleep"];
      case "google-fit":
        return ["steps", "activity", "sleep"];
      case "samsung-health":
        return ["steps", "heart-rate", "sleep"];
      default:
        return ["sleep", "recovery"];
    }
  }

  private getSampleValue(stream: string, index: number): number {
    const sampleValues: Record<string, number[]> = {
      sleep: [7.2, 6.8, 7.8, 6.5, 7.1],
      readiness: [83, 79, 81, 77, 80],
      recovery: [83, 79, 81, 77, 80],
      cycles: [11, 14, 12, 13, 10],
      steps: [10240, 8760, 11420, 9530, 10890],
      activity: [45, 52, 49, 58, 51],
      "heart-rate": [66, 71, 68, 72, 69],
      workout: [45, 38, 55, 42, 47],
    };
    return sampleValues[stream]?.[index] ?? 0;
  }

  private getIntegrationMode(): WearableIntegrationMode {
    return "placeholder";
  }

  private getUnit(stream: string): string | undefined {
    switch (stream) {
      case "sleep":
        return "hrs";
      case "readiness":
      case "recovery":
        return "%";
      case "cycles":
        return "strain";
      case "steps":
        return "steps";
      case "activity":
      case "workout":
        return "mins";
      case "heart-rate":
        return "bpm";
      default:
        return undefined;
    }
  }
}

export const wearableProviders: Record<WearableProvider, WearableProviderAdapter> = {
  oura: new PlaceholderAdapter("oura"),
  whoop: new PlaceholderAdapter("whoop"),
  "apple-watch": new PlaceholderAdapter("apple-watch"),
  fitbit: new PlaceholderAdapter("fitbit"),
  "google-fit": new PlaceholderAdapter("google-fit"),
  "samsung-health": new PlaceholderAdapter("samsung-health"),
  unknown: new PlaceholderAdapter("unknown"),
};

export async function connectWearable(provider: WearableProvider): Promise<WearableConnection> {
  return wearableProviders[provider].connect();
}

export async function fetchWearableData(provider: WearableProvider): Promise<ConnectedWearableSummary> {
  const connection = await connectWearable(provider);
  const latestData = await wearableProviders[provider].fetchLatestData();
  return { provider, status: connection.status, latestData };
}

export async function fetchWearableSummaries(providers: WearableProvider[]): Promise<ConnectedWearableSummary[]> {
  return Promise.all(providers.map(fetchWearableData));
}

export function getWearableProviderCatalog(): WearableProviderMetadata[] {
  return [
    {
      id: "oura",
      label: "Oura",
      description: "Sleep, readiness, and recovery insights from the Oura Ring.",
      connectRoute: "/api/oura/connect",
      exampleStreams: ["sleep", "readiness", "heart-rate"],
    },
    {
      id: "whoop",
      label: "WHOOP",
      description: "Recovery, strain, and sleep performance from WHOOP.",
      connectRoute: "/api/whoop/connect",
      exampleStreams: ["sleep", "recovery", "cycles"],
    },
    {
      id: "apple-watch",
      label: "Apple Watch",
      description: "Activity, workouts, and heart rate from Apple Health.",
      connectRoute: "/api/apple/connect",
      exampleStreams: ["steps", "heart-rate", "workout"],
    },
    {
      id: "fitbit",
      label: "Fitbit",
      description: "Activity, heart rate, and sleep data from Fitbit.",
      connectRoute: "/api/fitbit/connect",
      exampleStreams: ["steps", "heart-rate", "sleep"],
    },
    {
      id: "google-fit",
      label: "Google Health",
      description: "Activity and sleep data from Google Fit.",
      connectRoute: "/api/google/connect",
      exampleStreams: ["steps", "activity", "sleep"],
    },
    {
      id: "samsung-health",
      label: "Samsung Health",
      description: "Daily movement, heart rate, and sleep from Samsung Health.",
      connectRoute: "/api/samsung/connect",
      exampleStreams: ["steps", "heart-rate", "sleep"],
    },
  ];
}
