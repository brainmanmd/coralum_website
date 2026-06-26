import { describe, expect, it } from "vitest";
import { connectWearable, fetchWearableData, fetchWearableSummaries, getWearableProviderCatalog } from "./providers";

describe("wearable provider placeholders", () => {
  it("connects oura as a placeholder provider", async () => {
    const connection = await connectWearable("oura");

    expect(connection.provider).toBe("oura");
    expect(connection.status).toBe("connected");
    expect(connection.integrationMode).toBe("placeholder");
    expect(connection.dataStreams).toContain("sleep");
  });

  it("returns structured data for whoop", async () => {
    const summary = await fetchWearableData("whoop");

    expect(summary.provider).toBe("whoop");
    expect(summary.latestData.length).toBeGreaterThan(0);
    expect(summary.latestData[0]?.stream).toBe("sleep");
  });

  it("exposes a provider catalog with the expanded placeholder providers", () => {
    const catalog = getWearableProviderCatalog();

    expect(catalog.map((provider) => provider.id)).toEqual(
      expect.arrayContaining(["apple-watch", "google-fit", "samsung-health"]),
    );
  });

  it("fetches multiple provider summaries in a single pass", async () => {
    const summaries = await fetchWearableSummaries(["oura", "whoop"]);

    expect(summaries).toHaveLength(2);
    expect(summaries.map((summary) => summary.provider)).toEqual(["oura", "whoop"]);
  });
});
