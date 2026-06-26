import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ConnectAction } from "./connect-actions";

describe("ConnectAction", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("requests an Oura authorization URL when the user connects", async () => {
    const onConnect = vi.fn();
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ authorizationUrl: "https://example.com/authorize" }),
    });

    vi.stubGlobal("fetch", fetchSpy);
    vi.stubGlobal("location", { assign: vi.fn() });

    render(
      <ConnectAction
        providerId="oura"
        providerLabel="Oura"
        connectRoute="/api/oura/connect"
        isConnected={false}
        onConnect={onConnect}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Connect Oura" }));

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith("/api/oura/connect");
    });

    expect(screen.getByRole("button", { name: "Connecting to Oura…" })).toBeInTheDocument();
  });

  it("requests a WHOOP authorization URL when the user connects", async () => {
    const onConnect = vi.fn();
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ authorizationUrl: "https://example.com/whoop" }),
    });

    vi.stubGlobal("fetch", fetchSpy);
    vi.stubGlobal("location", { assign: vi.fn() });

    render(
      <ConnectAction
        providerId="whoop"
        providerLabel="WHOOP"
        connectRoute="/api/whoop/connect"
        isConnected={false}
        onConnect={onConnect}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Connect WHOOP" }));

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith("/api/whoop/connect");
    });

    expect(screen.getByRole("button", { name: "Connecting to WHOOP…" })).toBeInTheDocument();
  });

  it("requests a Fitbit authorization URL when the user connects", async () => {
    const onConnect = vi.fn();
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ authorizationUrl: "https://example.com/fitbit" }),
    });

    vi.stubGlobal("fetch", fetchSpy);
    vi.stubGlobal("location", { assign: vi.fn() });

    render(
      <ConnectAction
        providerId="fitbit"
        providerLabel="Fitbit"
        connectRoute="/api/fitbit/connect"
        isConnected={false}
        onConnect={onConnect}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Connect Fitbit" }));

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith("/api/fitbit/connect");
    });

    expect(screen.getByRole("button", { name: "Connecting to Fitbit…" })).toBeInTheDocument();
  });

  it("requests a Samsung authorization URL when the user connects", async () => {
    const onConnect = vi.fn();
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ authorizationUrl: "https://example.com/samsung" }),
    });

    vi.stubGlobal("fetch", fetchSpy);
    vi.stubGlobal("location", { assign: vi.fn() });

    render(
      <ConnectAction
        providerId="samsung-health"
        providerLabel="Samsung Health"
        connectRoute="/api/samsung/connect"
        isConnected={false}
        onConnect={onConnect}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Connect Samsung Health" }));

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith("/api/samsung/connect");
    });

    expect(screen.getByRole("button", { name: "Connecting to Samsung Health…" })).toBeInTheDocument();
  });

  it("requests an Apple authorization URL when the user connects", async () => {
    const onConnect = vi.fn();
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ authorizationUrl: "https://example.com/apple" }),
    });

    vi.stubGlobal("fetch", fetchSpy);
    vi.stubGlobal("location", { assign: vi.fn() });

    render(
      <ConnectAction
        providerId="apple-watch"
        providerLabel="Apple Health"
        connectRoute="/api/apple/connect"
        isConnected={false}
        onConnect={onConnect}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Connect Apple Health" }));

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith("/api/apple/connect");
    });

    expect(screen.getByRole("button", { name: "Connecting to Apple Health…" })).toBeInTheDocument();
  });

  it("shows an error state when the connect route fails", async () => {
    const onConnect = vi.fn();
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "credentials_missing" }),
    });

    vi.stubGlobal("fetch", fetchSpy);
    vi.stubGlobal("location", { assign: vi.fn() });

    render(
      <ConnectAction
        providerId="oura"
        providerLabel="Oura"
        connectRoute="/api/oura/connect"
        isConnected={false}
        onConnect={onConnect}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Connect Oura" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Retry Oura" })).toBeInTheDocument();
    });
  });
});
