// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";

import { defaultConfig } from "../../src/config/defaults";
import { getLogEntries, resetLoggerForTests } from "../../src/logging";

vi.mock("../../src/config", () => ({
  saveSemStart: vi.fn(),
}));

vi.mock("../../src/core", () => ({
  downloadICS: vi.fn(),
  extractCourses: vi.fn(() => [
    {
      name: "软件工程",
      location: "一教101",
      teacher: "张老师",
      dow: 1,
      pStart: 1,
      pEnd: 2,
      weeks: [1],
      rawWeeks: "1周",
    },
  ]),
  generateICS: vi.fn(() => ({
    ics: "BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nBEGIN:VALARM\r\nEND:VALARM\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n",
    eventCount: 1,
    reminderSummary: {
      presetId: "urgent",
      presetLabel: "临近上课",
      activeRuleCount: 2,
      alarmsPerEvent: 2,
      emittedAlarmCount: 1,
      activeRuleDescriptions: ["15 分钟前 · 静默通知", "5 分钟前 · 响铃提醒"],
    },
  })),
}));

import { handleExportAction } from "../../src/ui/export-dialog/export";
import * as coreModule from "../../src/core";

describe("handleExportAction", () => {
  beforeEach(() => {
    resetLoggerForTests();
    vi.stubGlobal("requestAnimationFrame", ((
      callback: FrameRequestCallback,
    ) => {
      callback(0);
      return 1;
    }) as typeof requestAnimationFrame);
  });

  it("shows emitted reminders in status when exported ICS contains VALARM blocks", () => {
    const startInp = document.createElement("input");
    startInp.value = "2026-03-02";

    const statuses: string[] = [];
    const config = {
      ...defaultConfig(),
      periods: [{ start: "08:00" }],
      reminderProgram: {
        version: 3 as const,
        presetId: "disabled" as const,
        rules: [],
      },
    };

    handleExportAction({
      semKey: null,
      startInp,
      readDuration: () => config.duration,
      readPeriods: () => config.periods,
      readReminderProgram: () => config.reminderProgram,
      setStatus: (message) => {
        statuses.push(message);
      },
    });

    expect(statuses.at(-1)).toContain("临近上课");
    expect(statuses.at(-1)).toContain("每门课 2 条提醒");
    expect(coreModule.generateICS).toHaveBeenCalledWith(
      expect.any(Array),
      "2026-03-02",
      config.periods,
      config.duration,
      config.reminderProgram,
      expect.objectContaining({ traceId: expect.any(String) }),
    );
  });

  it("returns a structured error detail when export throws", () => {
    vi.mocked(coreModule.generateICS).mockImplementationOnce(() => {
      throw new Error("Boom");
    });

    const startInp = document.createElement("input");
    startInp.value = "2026-03-02";

    const statuses: Array<{ message: string; detail?: string }> = [];
    const config = defaultConfig();

    handleExportAction({
      semKey: "2026-1",
      startInp,
      readDuration: () => config.duration,
      readPeriods: () => config.periods,
      readReminderProgram: () => config.reminderProgram,
      setStatus: (message, _tone, detail) => {
        statuses.push({ message, detail });
      },
    });

    expect(statuses.at(-1)?.message).toContain("Boom");
    expect(statuses.at(-1)?.detail).toContain("模块：ui.export");
    expect(statuses.at(-1)?.detail).toContain("错误：Error: Boom");
    expect(getLogEntries().at(-1)?.level).toBe("error");
  });
});
