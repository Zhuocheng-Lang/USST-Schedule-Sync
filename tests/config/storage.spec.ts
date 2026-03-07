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
  it("normalizes malformed reminder program config", () => {
    vi.stubGlobal(
      "GM_getValue",
      vi.fn(() =>
        JSON.stringify({
          duration: 45,
          periods: [{ start: "08:00" }],
          reminderProgram: {
            version: 2,
            rules: [
              {
                isEnabled: true,
                offset: { minutesBeforeStart: "15" },
                delivery: { kind: "AUDIO" },
              },
            ],
          },
        }),
      ),
    );

    const config = getConfig();

    expect(config.reminderProgram.rules).toHaveLength(1);
    expect(config.reminderProgram.rules[0]).toMatchObject({
      isEnabled: true,
      offset: { minutesBeforeStart: 15 },
      delivery: { kind: "AUDIO" },
      template: { kind: "course-start-countdown" },
    });
  });

  it("preserves an explicit empty reminder rule list", () => {
    vi.stubGlobal(
      "GM_getValue",
      vi.fn(() =>
        JSON.stringify({
          duration: 45,
          periods: [{ start: "08:00" }],
          reminderProgram: { version: 2, rules: [] },
        }),
      ),
    );

    const config = getConfig();

    expect(config.reminderProgram.rules).toEqual([]);
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
      reminderProgram: { version: 2, rules: [] },
    });

    expect(getConfig()).toEqual({
      duration: 50,
      periods: [{ start: "08:30" }],
      reminderProgram: { version: 2, rules: [] },
    });
  });
});