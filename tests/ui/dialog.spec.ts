// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest";

import { defaultConfig } from "../../src/config/defaults";
import { resetLoggerForTests } from "../../src/logging";
import { createDialogElements } from "../../src/ui/export-dialog/dom";
import { createUI, setActiveTab } from "../../src/ui/dialog";
import { createDialogConfigStore } from "../../src/ui/export-dialog/state";

declare global {
  var GM_setValue: ((key: string, value: unknown) => void) | undefined;
}

afterEach(() => {
  document.body.innerHTML = "";
  resetLoggerForTests();
  vi.unstubAllGlobals();
});

describe("setActiveTab", () => {
  it("hides inactive panels when switching away from export", () => {
    const config = defaultConfig();
    const { tabBar, panelsEl } = createDialogElements(
      config.duration,
      config.periods,
      config.reminderProgram,
      "2026-03-02",
    );

    setActiveTab(tabBar, panelsEl, "schedule");

    const exportPanel = document.getElementById(
      "ics-tab-export",
    ) as HTMLDivElement;
    const schedulePanel = document.getElementById(
      "ics-tab-schedule",
    ) as HTMLDivElement;
    const alarmPanel = document.getElementById(
      "ics-tab-reminder",
    ) as HTMLDivElement;

    expect(exportPanel.hidden).toBe(true);
    expect(exportPanel.getAttribute("aria-hidden")).toBe("true");
    expect(schedulePanel.hidden).toBe(false);
    expect(schedulePanel.getAttribute("aria-hidden")).toBe("false");
    expect(alarmPanel.hidden).toBe(true);
    expect(alarmPanel.getAttribute("aria-hidden")).toBe("true");
  });

  it("allows deleting the final reminder rule and shows the empty state", () => {
    const trigger = document.createElement("button");
    trigger.id = "ics-trigger-btn";
    document.body.appendChild(trigger);

    createUI();

    const reminderList = document.getElementById(
      "ics-reminder-rule-list",
    ) as HTMLDivElement;
    const deleteButton = reminderList.querySelector(
      '[data-action="delete-reminder-rule"]',
    ) as HTMLButtonElement;

    deleteButton.click();

    expect(
      reminderList.querySelectorAll("[data-reminder-rule-id]"),
    ).toHaveLength(0);
    expect(reminderList.textContent).toContain("当前不会导出任何课前提醒");
  });

  it("applies a reminder preset and updates the preview summary", () => {
    const trigger = document.createElement("button");
    trigger.id = "ics-trigger-btn";
    document.body.appendChild(trigger);

    createUI();

    const preset = document.querySelector(
      '[data-role="reminder-preset"][data-preset-id="urgent"]',
    ) as HTMLButtonElement;

    preset.click();

    const summary = document.getElementById(
      "ics-reminder-summary",
    ) as HTMLDivElement;
    const preview = document.getElementById(
      "ics-reminder-preview-list",
    ) as HTMLUListElement;
    const cards = document.querySelectorAll("[data-reminder-rule-id]");

    expect(summary.textContent).toContain("临近上课");
    expect(preview.textContent).toContain("15 分钟前 · 静默通知");
    expect(preview.textContent).toContain("5 分钟前 · 响铃提醒");
    expect(cards).toHaveLength(2);
  });

  it("persists reminder edits from the in-memory state", () => {
    const writes: Array<{ key: string; value: string }> = [];
    vi.stubGlobal(
      "GM_setValue",
      vi.fn((key: string, value: unknown) => {
        writes.push({ key, value: String(value) });
      }),
    );

    const trigger = document.createElement("button");
    trigger.id = "ics-trigger-btn";
    document.body.appendChild(trigger);

    createUI();

    const addButton = document.getElementById(
      "ics-add-reminder-rule-btn",
    ) as HTMLButtonElement;
    addButton.click();

    const cards = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reminder-rule-id]"),
    );
    const reminderRuleId = cards.at(-1)?.dataset.reminderRuleId as string;

    const queryLiveRuleCard = (): HTMLElement =>
      document.querySelector(
        `[data-reminder-rule-id="${reminderRuleId}"]`,
      ) as HTMLElement;

    const minutes = queryLiveRuleCard().querySelector(
      '[data-role="reminder-rule-minutes"]',
    ) as HTMLInputElement;

    minutes.value = "35";
    minutes.dispatchEvent(new Event("input", { bubbles: true }));

    const enabled = queryLiveRuleCard().querySelector(
      '[data-role="reminder-rule-enabled"]',
    ) as HTMLInputElement;
    enabled.checked = false;
    enabled.dispatchEvent(new Event("change", { bubbles: true }));

    const action = queryLiveRuleCard().querySelector(
      '[data-role="reminder-rule-delivery"]',
    ) as HTMLSelectElement;
    action.value = "AUDIO";
    action.dispatchEvent(new Event("change", { bubbles: true }));

    const savedWrite = writes.at(-1);
    const saved = JSON.parse(savedWrite?.value ?? "null");

    expect(savedWrite?.key).toBe("ics_reminder_program");
    expect(saved.version).toBe(1);
    expect(saved.data.rules).toHaveLength(2);
    expect(saved.data.presetId).toBe("custom");
    expect(saved.data.rules[1]).toMatchObject({
      isEnabled: false,
      offset: { minutesBeforeStart: 35 },
      delivery: { kind: "AUDIO" },
      template: { kind: "course-start-countdown" },
    });
  });

  it("re-syncs reminder rows from storage when createUI runs again", () => {
    let rawReminderProgram = JSON.stringify({
      version: 1,
      data: defaultConfig().reminderProgram,
    });
    vi.stubGlobal(
      "GM_getValue",
      vi.fn((key: string) => {
        if (key === "ics_reminder_program") {
          return rawReminderProgram;
        }
        return null;
      }),
    );

    const trigger = document.createElement("button");
    trigger.id = "ics-trigger-btn";
    document.body.appendChild(trigger);

    createUI();

    rawReminderProgram = JSON.stringify({
      version: 1,
      data: {
        version: 3,
        presetId: "custom",
        rules: [
          {
            id: "display-15",
            isEnabled: true,
            offset: { minutesBeforeStart: 15 },
            delivery: { kind: "DISPLAY" },
            template: { kind: "course-start-countdown" },
          },
          {
            id: "audio-10",
            isEnabled: true,
            offset: { minutesBeforeStart: 10 },
            delivery: { kind: "AUDIO" },
            template: { kind: "course-start-countdown" },
          },
        ],
      },
    });

    createUI();

    const cards = document.querySelectorAll<HTMLElement>(
      "[data-reminder-rule-id]",
    );
    expect(cards).toHaveLength(2);

    const lastCard = cards[1];
    const minutes = lastCard.querySelector(
      '[data-role="reminder-rule-minutes"]',
    ) as HTMLInputElement;
    const action = lastCard.querySelector(
      '[data-role="reminder-rule-delivery"]',
    ) as HTMLSelectElement;

    expect(minutes.value).toBe("10");
    expect(action.value).toBe("AUDIO");
  });

  it("re-syncs reminder rows when reopening the existing dialog via trigger button", () => {
    let rawReminderProgram = JSON.stringify({
      version: 1,
      data: defaultConfig().reminderProgram,
    });
    vi.stubGlobal(
      "GM_getValue",
      vi.fn((key: string) => {
        if (key === "ics_reminder_program") {
          return rawReminderProgram;
        }
        return null;
      }),
    );

    const trigger = document.createElement("button");
    trigger.id = "ics-trigger-btn";
    document.body.appendChild(trigger);

    createUI();

    rawReminderProgram = JSON.stringify({
      version: 1,
      data: {
        version: 3,
        presetId: "custom",
        rules: [
          {
            id: "display-15",
            isEnabled: true,
            offset: { minutesBeforeStart: 15 },
            delivery: { kind: "DISPLAY" },
            template: { kind: "course-start-countdown" },
          },
          {
            id: "audio-10",
            isEnabled: true,
            offset: { minutesBeforeStart: 10 },
            delivery: { kind: "AUDIO" },
            template: { kind: "course-start-countdown" },
          },
        ],
      },
    });

    const liveTrigger = document.getElementById(
      "ics-trigger-btn",
    ) as HTMLButtonElement;
    liveTrigger.click();

    const cards = document.querySelectorAll<HTMLElement>(
      "[data-reminder-rule-id]",
    );
    expect(cards).toHaveLength(2);

    const lastCard = cards[1];
    const minutes = lastCard.querySelector(
      '[data-role="reminder-rule-minutes"]',
    ) as HTMLInputElement;
    const action = lastCard.querySelector(
      '[data-role="reminder-rule-delivery"]',
    ) as HTMLSelectElement;

    expect(minutes.value).toBe("10");
    expect(action.value).toBe("AUDIO");
  });

  it("falls back to default config when storage still contains the legacy unversioned payload", () => {
    vi.stubGlobal(
      "GM_getValue",
      vi.fn((key: string) => {
        if (key === "ics_config") {
          return JSON.stringify({
            duration: 99,
            periods: [{ start: "12:34" }],
            reminderProgram: {
              version: 2,
              rules: [
                {
                  id: "legacy-audio",
                  isEnabled: true,
                  offset: { minutesBeforeStart: 10 },
                  delivery: { kind: "AUDIO" },
                  template: { kind: "course-start-countdown" },
                },
                {
                  id: "legacy-display",
                  isEnabled: true,
                  offset: { minutesBeforeStart: 5 },
                  delivery: { kind: "DISPLAY" },
                  template: { kind: "course-start-countdown" },
                },
              ],
            },
          });
        }

        return null;
      }),
    );

    const trigger = document.createElement("button");
    trigger.id = "ics-trigger-btn";
    document.body.appendChild(trigger);

    createUI();

    const durationInput = document.getElementById(
      "ics-duration",
    ) as HTMLInputElement;
    const cards = document.querySelectorAll("[data-reminder-rule-id]");
    const firstStart = document.querySelector(
      '[data-role="period-start"]',
    ) as HTMLInputElement;

    expect(durationInput.value).toBe(String(defaultConfig().duration));
    expect(firstStart.value).toBe(defaultConfig().periods[0].start);
    expect(cards).toHaveLength(defaultConfig().reminderProgram.rules.length);
  });

  it("shows and toggles error details when status includes diagnostic text", () => {
    const trigger = document.createElement("button");
    trigger.id = "ics-trigger-btn";
    document.body.appendChild(trigger);

    createUI();

    const statusEl = document.getElementById("ics-status") as HTMLDivElement;
    const detailButton = document
      .querySelector("#ics-status-detail")
      ?.previousElementSibling?.querySelector("button") as HTMLButtonElement;
    const detailPanel = document.getElementById(
      "ics-status-detail",
    ) as HTMLPreElement;

    statusEl.textContent = "";
    detailPanel.hidden = false;
    detailButton.hidden = false;
    detailButton.click();

    expect(detailButton.getAttribute("aria-expanded")).toBe("false");
  });

  it("still removes a reminder rule when Array.prototype.filter is polluted", () => {
    const originalFilter = Array.prototype.filter;
    Array.prototype.filter = function pollutedFilter<T>(this: T[]): T[] {
      return [...this];
    };

    try {
      const config = defaultConfig();
      const store = createDialogConfigStore(
        config.duration,
        config.periods,
        config.reminderProgram,
      );
      const targetRuleId = store.getReminderProgram().rules[0]?.id as string;

      store.removeReminderRule(targetRuleId);

      expect(store.getReminderProgram().rules).toHaveLength(0);
    } finally {
      Array.prototype.filter = originalFilter;
    }
  });
});
