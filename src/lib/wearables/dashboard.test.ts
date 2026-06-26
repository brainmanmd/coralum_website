import { describe, expect, it } from "vitest";
import { summarizeMetrics } from "./dashboard";

describe("wearable dashboard summarizer", () => {
  it("builds dashboard metrics from a wearable summary", () => {
    const summary: import("./types").ConnectedWearableSummary = {
      provider: "oura",
      status: "connected",
      latestData: [
        { provider: "oura", stream: "sleep", value: 7.2, unit: "hrs", timestamp: "now" },
      ],
    };

    const metrics = summarizeMetrics(summary);

    expect(metrics[0]?.label).toBe("Primary stream");
    expect(metrics[1]?.value).toContain("7.2");
    expect(metrics[2]?.value).toBe("oura");
  });
});
