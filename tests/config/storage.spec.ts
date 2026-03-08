import { afterEach, describe, expect, it, vi } from "vitest";

import { defaultConfig } from "../../src/config/defaults";
import { getLogEntries, resetLoggerForTests } from "../../src/logging";
import {
  getDuration,
  getLoggingConfig,
  getPeriods,
  getReminderProgram,
  getSemStart,
  saveDuration,
  saveLoggingConfig,
  savePeriods,
  saveReminderProgram,
  saveSemStart,
} from "../../src/config/storage";

declare global {
  var GM_getValue: ((key: string, fallback: unknown) => unknown) | undefined;
  var GM_setValue: ((key: string, value: unknown) => void) | undefined;
}

afterEach(() => {
  resetLoggerForTests();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("atomic config storage", () => {
  it("normalizes malformed reminder program payloads from the reminder_program key", () => {
    vi.stubGlobal(
      "GM_getValue",
      vi.fn((key: string) => {
        if (key === "ics_reminder_program") {
          return JSON.stringify({
            version: 1,
            data: {
              version: 2,
              rules: [
                {
                  isEnabled: true,
                  offset: { minutesBeforeStart: "15" },
                  delivery: { kind: "AUDIO" },
                },
              ],
            },
          });
        }

        return null;
      }),
    );

    const reminderProgram = getReminderProgram();

    expect(reminderProgram.rules).toHaveLength(1);
    expect(reminderProgram.presetId).toBe("custom");
    expect(reminderProgram.rules[0]).toMatchObject({
      isEnabled: true,
      offset: { minutesBeforeStart: 15 },
      delivery: { kind: "AUDIO" },
      template: { kind: "course-start-countdown" },
    });
  });

  it("preserves an explicit empty reminder rule list", () => {
    vi.stubGlobal(
      "GM_getValue",
      vi.fn((key: string) => {
        if (key === "ics_reminder_program") {
          return JSON.stringify({
            version: 1,
            data: { version: 3, presetId: "disabled", rules: [] },
          });
        }

        return null;
      }),
    );

    expect(getReminderProgram()).toEqual({
      version: 3,
      presetId: "disabled",
      rules: [],
    });
  });

  it("ignores the legacy monolithic ics_config key entirely", () => {
    vi.stubGlobal(
      "GM_getValue",
      vi.fn((key: string) => {
        if (key === "ics_config") {
          return JSON.stringify({
            version: 2,
            data: {
              duration: 99,
              periods: [{ start: "12:34" }],
              reminderProgram: { version: 3, presetId: "disabled", rules: [] },
              logging: { level: "debug", maxEntries: 500 },
            },
          });
        }

        return null;
      }),
    );

    expect(getDuration()).toBe(defaultConfig().duration);
    expect(getPeriods()).toEqual(defaultConfig().periods);
    expect(getReminderProgram()).toEqual(defaultConfig().reminderProgram);
    expect(getLoggingConfig()).toEqual(defaultConfig().logging);
    expect(getLogEntries()).toHaveLength(0);
  });

  it("round-trips each config fragment through its own storage key", () => {
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

    saveDuration(50);
    savePeriods([{ start: "08:30" }]);
    saveReminderProgram({ version: 3, presetId: "disabled", rules: [] });
    saveLoggingConfig({ level: "info", maxEntries: 256 });

    expect(JSON.parse(store.get("ics_duration") ?? "null")).toEqual({
      version: 1,
      data: 50,
    });
    expect(JSON.parse(store.get("ics_periods") ?? "null")).toEqual({
      version: 1,
      data: [{ start: "08:30" }],
    });
    expect(JSON.parse(store.get("ics_reminder_program") ?? "null")).toEqual({
      version: 1,
      data: { version: 3, presetId: "disabled", rules: [] },
    });
    expect(JSON.parse(store.get("ics_logging") ?? "null")).toEqual({
      version: 1,
      data: { level: "info", maxEntries: 256 },
    });

    expect(getDuration()).toBe(50);
    expect(getPeriods()).toEqual([{ start: "08:30" }]);
    expect(getReminderProgram()).toEqual({
      version: 3,
      presetId: "disabled",
      rules: [],
    });
    expect(getLoggingConfig()).toEqual({ level: "info", maxEntries: 256 });
  });

  it("falls back to defaults and warns when an atomic payload is invalid", () => {
    vi.stubGlobal(
      "GM_getValue",
      vi.fn((key: string) => {
        if (key === "ics_duration") {
          return JSON.stringify({ version: 999, data: "oops" });
        }
        if (key === "ics_logging") {
          return JSON.stringify({ version: 999, data: {} });
        }

        return null;
      }),
    );

    expect(getDuration()).toBe(defaultConfig().duration);
    expect(getLoggingConfig()).toEqual(defaultConfig().logging);
    expect(getLogEntries().at(-2)).toMatchObject({
      level: "warn",
      module: "config.storage",
      message: "课时长度存储内容无效，已回退到默认值",
    });
    expect(getLogEntries().at(-1)).toMatchObject({
      level: "warn",
      module: "config.storage",
      message: "日志配置存储内容无效，已回退到默认值",
    });
  });
});

describe("semester start storage", () => {
  it("reads and writes semester start values with a dedicated envelope", () => {
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

    saveSemStart("2025-1", "2025-09-01");

    expect(JSON.parse(store.get("ics_semstart_2025-1") ?? "null")).toEqual({
      version: 1,
      data: "2025-09-01",
    });
    expect(getSemStart("2025-1")).toBe("2025-09-01");
    expect(getLogEntries()).toHaveLength(0);
  });

  it("returns null for legacy unversioned semester start payloads", () => {
    vi.stubGlobal(
      "GM_getValue",
      vi.fn(() => JSON.stringify("2025-09-01")),
    );

    expect(getSemStart("2025-1")).toBeNull();
    expect(getLogEntries().at(-1)).toMatchObject({
      level: "warn",
      module: "config.storage",
      message: "学期开始日期存储内容无效，已忽略",
    });
  });

  it("returns null for unknown semester start envelope versions", () => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    vi.stubGlobal(
      "GM_getValue",
      vi.fn(() => JSON.stringify({ version: 2, data: "2025-09-01" })),
    );

    expect(getSemStart("2025-1")).toBeNull();
  });
});
