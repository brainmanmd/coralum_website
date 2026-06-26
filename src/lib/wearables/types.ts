export type WearableProvider =
  | "oura"
  | "whoop"
  | "apple-watch"
  | "fitbit"
  | "google-fit"
  | "samsung-health"
  | "unknown";

export type WearableConnectionStatus = "disconnected" | "connecting" | "connected" | "error";
export type WearableIntegrationMode = "placeholder" | "live";

export interface WearableDataPoint {
  provider: WearableProvider;
  stream: string;
  value: number | string | null;
  unit?: string;
  timestamp: string;
}

export interface WearableConnection {
  provider: WearableProvider;
  status: WearableConnectionStatus;
  integrationMode: WearableIntegrationMode;
  connectedAt?: string;
  lastSyncedAt?: string;
  dataStreams: string[];
}

export interface ConnectedWearableSummary {
  provider: WearableProvider;
  status: WearableConnectionStatus;
  latestData: WearableDataPoint[];
}
