import { afterEach, describe, expect, it, vi } from "vitest";

import { getConfig, saveConfig } from "../../src/config/storage";

declare global {
  var GM_getValue: ((key: string, fallback: unknown) => unknown) | undefined;
  var GM_setValue:
    | ((key: string, value: unknown) => void)
    | undefined;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getConfig", () => {
  it("normalizes malformed legacy alarm config", () => {
    vi.stubGlobal(
      "GM_getValue",
      vi.fn(() =>
        JSON.stringify({
          duration: 45,
          periods: [{ start: "08:00" }],
          alarms: [{ minutes: "15", action: "AUDIO" }],
        }),
      ),
    );

    const config = getConfig();

    expect(config.alarms).toEqual([
      { enabled: true, minutes: 15, action: "AUDIO" },
    ]);
  });

  it("preserves an explicit empty alarm list", () => {
    vi.stubGlobal(
      "GM_getValue",
      vi.fn(() =>
        JSON.stringify({
          duration: 45,
          periods: [{ start: "08:00" }],
          alarms: [],
        }),
      ),
    );

    const config = getConfig();

    expect(config.alarms).toEqual([]);
  });

  it("round-trips the normalized export config through storage", () => {
    const store = new Map<string, string>();
    vi.stubGlobal(
      "GM_setValue",
      vi.fn((key: string, value: unknown) => {
        store.set(key, String(value));
      }),
    );
    vi.stubGlobal(
      "GM_getValue",
      vi.fn((key: string) => store.get(key) ?? null),
    );

    saveConfig({
      duration: 50,
      periods: [{ start: "08:30" }],
      alarms: [],
    });

    expect(getConfig()).toEqual({
      duration: 50,
      periods: [{ start: "08:30" }],
      alarms: [],
    });
  });
});