import type { ConnectedWearableSummary, WearableDataPoint } from "./types";

export interface WearableDashboardMetric {
  label: string;
  value: string;
  trend: string;
}

export function summarizeMetrics(summary: ConnectedWearableSummary): WearableDashboardMetric[] {
  const metrics = summary.latestData.reduce<Record<string, WearableDataPoint>>((acc, item) => {
    acc[item.stream] = item;
    return acc;
  }, {});

  return [
    {
      label: "Primary stream",
      value: summary.latestData[0]?.stream ?? "none",
      trend: "placeholder",
    },
    {
      label: "Latest value",
      value: `${summary.latestData[0]?.value ?? 0}${summary.latestData[0]?.unit ? ` ${summary.latestData[0].unit}` : ""}`,
      trend: "stable",
    },
    {
      label: "Provider",
      value: summary.provider,
      trend: metrics.sleep ? "connected" : "pending",
    },
  ];
}
