// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest";

import { defaultConfig } from "../../src/config/defaults";
import { createDialogElements } from "../../src/ui/export-dialog/dom";
import { createUI, setActiveTab } from "../../src/ui/dialog";

declare global {
  var GM_setValue:
    | ((key: string, value: unknown) => void)
    | undefined;
}

afterEach(() => {
  document.body.innerHTML = "";
  vi.unstubAllGlobals();
});

describe("setActiveTab", () => {
  it("hides inactive panels when switching away from export", () => {
    const { tabBar, panelsEl } = createDialogElements(
      defaultConfig(),
      "2026-03-02",
    );

    setActiveTab(tabBar, panelsEl, "schedule");

    const exportPanel = document.getElementById("ics-tab-export") as HTMLDivElement;
    const schedulePanel = document.getElementById("ics-tab-schedule") as HTMLDivElement;
    const alarmPanel = document.getElementById("ics-tab-reminder") as HTMLDivElement;

    expect(exportPanel.hidden).toBe(true);
    expect(exportPanel.getAttribute("aria-hidden")).toBe("true");
    expect(schedulePanel.hidden).toBe(false);
    expect(schedulePanel.getAttribute("aria-hidden")).toBe("false");
    expect(alarmPanel.hidden).toBe(true);
    expect(alarmPanel.getAttribute("aria-hidden")).toBe("true");
  });

  it("does not allow deleting the final reminder rule", () => {
    const trigger = document.createElement("button");
    trigger.id = "ics-trigger-btn";
    document.body.appendChild(trigger);

    createUI();

    const alarmBody = document.getElementById("ics-reminder-rule-tbody") as HTMLTableSectionElement;
    const deleteButton = alarmBody.querySelector('[data-action="delete-reminder-rule"]') as HTMLButtonElement;

    deleteButton.click();

    expect(alarmBody.rows).toHaveLength(1);

    const addButton = document.getElementById("ics-add-reminder-rule-btn") as HTMLButtonElement;
    addButton.click();
    const firstDelete = alarmBody.querySelector('[data-action="delete-reminder-rule"]') as HTMLButtonElement;
    firstDelete.click();

    expect(alarmBody.rows).toHaveLength(1);
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

    const addButton = document.getElementById("ics-add-reminder-rule-btn") as HTMLButtonElement;
    addButton.click();

    const rows = Array.from(
      (document.getElementById("ics-reminder-rule-tbody") as HTMLTableSectionElement).rows,
    );
    const reminderRuleId = (rows.at(-1) as HTMLTableRowElement).dataset.reminderRuleId as string;

    const queryLiveRuleRow = (): HTMLTableRowElement =>
      document.querySelector(`tr[data-reminder-rule-id="${reminderRuleId}"]`) as HTMLTableRowElement;

    const minutes = queryLiveRuleRow().querySelector(
      '[data-role="reminder-rule-minutes"]',
    ) as HTMLInputElement;

    minutes.value = "35";
    minutes.dispatchEvent(new Event("input", { bubbles: true }));

    const enabled = queryLiveRuleRow().querySelector(
      '[data-role="reminder-rule-enabled"]',
    ) as HTMLInputElement;
    enabled.checked = false;
    enabled.dispatchEvent(new Event("change", { bubbles: true }));

    const action = queryLiveRuleRow().querySelector(
      '[data-role="reminder-rule-delivery"]',
    ) as HTMLSelectElement;
    action.value = "AUDIO";
    action.dispatchEvent(new Event("change", { bubbles: true }));

    const saved = JSON.parse(writes.at(-1)?.value ?? "null");

    expect(saved.reminderProgram.rules).toHaveLength(2);
    expect(saved.reminderProgram.rules[1]).toMatchObject({
      isEnabled: false,
      offset: { minutesBeforeStart: 35 },
      delivery: { kind: "AUDIO" },
      template: { kind: "course-start-countdown" },
    });
  });

  it("re-syncs reminder rows from storage when createUI runs again", () => {
    let rawConfig = JSON.stringify(defaultConfig());
    vi.stubGlobal(
      "GM_getValue",
      vi.fn((key: string) => {
        if (key === "ics_config") {
          return rawConfig;
        }
        return null;
      }),
    );

    const trigger = document.createElement("button");
    trigger.id = "ics-trigger-btn";
    document.body.appendChild(trigger);

    createUI();

    rawConfig = JSON.stringify({
      ...defaultConfig(),
      reminderProgram: {
        version: 2,
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

    const alarmBody = document.getElementById("ics-reminder-rule-tbody") as HTMLTableSectionElement;
    expect(alarmBody.rows).toHaveLength(2);

    const lastRow = alarmBody.rows[1] as HTMLTableRowElement;
    const minutes = lastRow.querySelector('[data-role="reminder-rule-minutes"]') as HTMLInputElement;
    const action = lastRow.querySelector('[data-role="reminder-rule-delivery"]') as HTMLSelectElement;

    expect(minutes.value).toBe("10");
    expect(action.value).toBe("AUDIO");
  });

  it("re-syncs reminder rows when reopening the existing dialog via trigger button", () => {
    let rawConfig = JSON.stringify(defaultConfig());
    vi.stubGlobal(
      "GM_getValue",
      vi.fn((key: string) => {
        if (key === "ics_config") {
          return rawConfig;
        }
        return null;
      }),
    );

    const trigger = document.createElement("button");
    trigger.id = "ics-trigger-btn";
    document.body.appendChild(trigger);

    createUI();

    rawConfig = JSON.stringify({
      ...defaultConfig(),
      reminderProgram: {
        version: 2,
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

    const liveTrigger = document.getElementById("ics-trigger-btn") as HTMLButtonElement;
    liveTrigger.click();

    const alarmBody = document.getElementById("ics-reminder-rule-tbody") as HTMLTableSectionElement;
    expect(alarmBody.rows).toHaveLength(2);

    const lastRow = alarmBody.rows[1] as HTMLTableRowElement;
    const minutes = lastRow.querySelector('[data-role="reminder-rule-minutes"]') as HTMLInputElement;
    const action = lastRow.querySelector('[data-role="reminder-rule-delivery"]') as HTMLSelectElement;

    expect(minutes.value).toBe("10");
    expect(action.value).toBe("AUDIO");
  });
});