import { afterEach, describe, expect, it, vi } from "vitest";

import { getConfig } from "../../src/config/storage";

declare global {
  var GM_getValue: ((key: string, fallback: unknown) => unknown) | undefined;
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
});