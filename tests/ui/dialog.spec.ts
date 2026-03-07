// @vitest-environment jsdom

import { afterEach, describe, expect, it } from "vitest";

import { defaultConfig } from "../../src/config/defaults";
import { createDialogElements } from "../../src/ui/export-dialog/dom";
import { makeAlarmRow } from "../../src/ui/builders";
import { readDialogConfig } from "../../src/ui/export-dialog/state";
import { createUI, setActiveTab } from "../../src/ui/dialog";

afterEach(() => {
  document.body.innerHTML = "";
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

  it("reads alarms even if row index attributes are missing", () => {
    const { durInp, periodTb, alarmTb } = createDialogElements(
      defaultConfig(),
      "2026-03-02",
    );

    for (const row of Array.from(alarmTb.rows)) {
      row.removeAttribute("data-alarm-idx");
    }

    const config = readDialogConfig(durInp, periodTb, alarmTb);

    expect(config.alarms).toHaveLength(1);
    expect(config.alarms[0]).toMatchObject({
      enabled: true,
      minutes: 15,
      action: "DISPLAY",
    });
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

    alarmBody.appendChild(
      makeAlarmRow(1, { enabled: true, minutes: 30, action: "AUDIO" }),
    );
    const firstDelete = alarmBody.querySelector('[data-action="delete-alarm"]') as HTMLButtonElement;
    firstDelete.click();

    expect(alarmBody.rows).toHaveLength(1);
  });
});