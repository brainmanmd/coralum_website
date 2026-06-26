import { describe, expect, it } from "vitest";
import { getProviderIntegrationSkeleton } from "./integration";

describe("provider integration skeleton", () => {
  it("returns an Oura-specific skeleton description", () => {
    const skeleton = getProviderIntegrationSkeleton("oura");

    expect(skeleton.title).toContain("Oura");
    expect(skeleton.steps).toContain("OAuth handshake");
  });

  it("returns a Google Fit-specific skeleton description", () => {
    const skeleton = getProviderIntegrationSkeleton("google-fit");

    expect(skeleton.title).toContain("Google");
    expect(skeleton.steps).toContain("token refresh");
  });
});
