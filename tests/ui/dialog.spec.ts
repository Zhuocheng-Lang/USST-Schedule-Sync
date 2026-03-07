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
    const alarmPanel = document.getElementById("ics-tab-alarm") as HTMLDivElement;

    expect(exportPanel.hidden).toBe(true);
    expect(exportPanel.getAttribute("aria-hidden")).toBe("true");
    expect(schedulePanel.hidden).toBe(false);
    expect(schedulePanel.getAttribute("aria-hidden")).toBe("false");
    expect(alarmPanel.hidden).toBe(true);
    expect(alarmPanel.getAttribute("aria-hidden")).toBe("true");
  });

  it("does not allow deleting the final alarm rule", () => {
    const trigger = document.createElement("button");
    trigger.id = "ics-trigger-btn";
    document.body.appendChild(trigger);

    createUI();

    const alarmBody = document.getElementById("ics-alarm-tbody") as HTMLTableSectionElement;
    const deleteButton = alarmBody.querySelector('[data-action="delete-alarm"]') as HTMLButtonElement;

    deleteButton.click();

    expect(alarmBody.rows).toHaveLength(1);

    const addButton = document.getElementById("ics-add-alarm-btn") as HTMLButtonElement;
    addButton.click();
    const firstDelete = alarmBody.querySelector('[data-action="delete-alarm"]') as HTMLButtonElement;
    firstDelete.click();

    expect(alarmBody.rows).toHaveLength(1);
  });

  it("persists alarm edits from the in-memory state", () => {
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

    const addButton = document.getElementById("ics-add-alarm-btn") as HTMLButtonElement;
    addButton.click();

    const rows = Array.from(
      (document.getElementById("ics-alarm-tbody") as HTMLTableSectionElement).rows,
    );
    const lastRow = rows.at(-1) as HTMLTableRowElement;
    const minutes = lastRow.querySelector('[data-role="alarm-minutes"]') as HTMLInputElement;
    const enabled = lastRow.querySelector('[data-role="alarm-enabled"]') as HTMLInputElement;
    const action = lastRow.querySelector('[data-role="alarm-action"]') as HTMLSelectElement;

    minutes.value = "35";
    minutes.dispatchEvent(new Event("input", { bubbles: true }));
    enabled.checked = false;
    enabled.dispatchEvent(new Event("change", { bubbles: true }));
    action.value = "AUDIO";
    action.dispatchEvent(new Event("change", { bubbles: true }));

    const saved = JSON.parse(writes.at(-1)?.value ?? "null");

    expect(saved.alarms).toHaveLength(2);
    expect(saved.alarms[1]).toEqual({
      enabled: false,
      minutes: 35,
      action: "AUDIO",
    });
  });
});