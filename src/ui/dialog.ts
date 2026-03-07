// ════════════════════════════════════════════════════════════════════════════
//  ui/dialog.ts - 导出设置对话框的构建与事件处理
// ════════════════════════════════════════════════════════════════════════════

import { getConfig, saveConfig } from "../config";
import { detectSemesterKey, guessSemesterStart } from "../core";
import type { Config } from "../types";
import { addMinutes } from "../utils";
import { makeAlarmRow, makePeriodRow } from "./builders";
import { cx, styles } from "./css";
import { createDialogElements } from "./export-dialog/dom";
import { handleExportAction } from "./export-dialog/export";
import {
  readDialogConfig,
  readPeriodConfig,
  refreshAlarmRows,
  refreshPeriodTable,
  refreshPreview,
} from "./export-dialog/state";

export function createUI(): void {
  if (document.getElementById("ics-dialog")) {
    return;
  }

  const cfg = getConfig();
  const semKey = detectSemesterKey();
  const defaultDate =
    guessSemesterStart(semKey) ?? `${new Date().getFullYear()}-02-17`;
  const {
    backdrop,
    dialog,
    closeBtn,
    tabBar,
    panelsEl,
    startInp,
    previewList,
    durInp,
    periodTb,
    addPeriodBtn,
    alarmTb,
    addAlarmBtn,
    exportBtn,
    statusEl,
  } = createDialogElements(cfg, defaultDate);

  function openDialog(): void {
    backdrop.classList.add(styles.dialogOpen);
    dialog.classList.add(styles.dialogOpen);
    dialog.setAttribute("aria-hidden", "false");
    refreshPreview(previewList, readPeriodCfg());
    requestAnimationFrame(() => startInp.focus());
  }

  function closeDialog(): void {
    backdrop.classList.remove(styles.dialogOpen);
    dialog.classList.remove(styles.dialogOpen);
    dialog.setAttribute("aria-hidden", "true");
    (document.getElementById("ics-trigger-btn") as HTMLElement | null)?.focus();
  }

  closeBtn.addEventListener("click", closeDialog);
  backdrop.addEventListener("click", closeDialog);
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      dialog.classList.contains(styles.dialogOpen)
    ) {
      event.preventDefault();
      closeDialog();
    }
  });

  const triggerBtn = document.getElementById("ics-trigger-btn");
  if (triggerBtn) {
    const fresh = triggerBtn.cloneNode(true) as HTMLElement;
    triggerBtn.replaceWith(fresh);
    fresh.addEventListener("click", openDialog);
  }

  tabBar.addEventListener("click", (event) => {
    const btn = (event.target as Element).closest(
      '[data-role="tab-button"]',
    ) as HTMLElement | null;
    if (!btn) {
      return;
    }
    const tabId = btn.dataset.tab;

    for (const tabButton of Array.from(
      tabBar.querySelectorAll<HTMLElement>('[data-role="tab-button"]'),
    )) {
      const active = tabButton.dataset.tab === tabId;
      tabButton.classList.toggle(styles.active, active);
      tabButton.setAttribute("aria-selected", String(active));
    }
    for (const panel of Array.from(
      panelsEl.querySelectorAll<HTMLElement>('[data-role="tab-panel"]'),
    )) {
      panel.classList.toggle(styles.active, panel.id === `ics-tab-${tabId}`);
    }
    if (tabId === "export") {
      refreshPreview(previewList, readPeriodCfg());
    }
  });

  function readPeriodCfg(): Pick<Config, "duration" | "periods"> {
    return readPeriodConfig(durInp, periodTb);
  }

  const readCfg = (): Config => readDialogConfig(durInp, periodTb, alarmTb);

  function onPeriodChange(): void {
    const config = readPeriodCfg();
    refreshPeriodTable(periodTb, config.duration);
    refreshPreview(previewList, config);
    saveConfig(readCfg());
  }

  function onAlarmChange(): void {
    refreshAlarmRows(alarmTb);
    saveConfig(readCfg());
  }

  refreshPreview(previewList, { periods: cfg.periods, duration: cfg.duration });

  durInp.addEventListener("input", onPeriodChange);

  periodTb.addEventListener("input", (event) => {
    if ((event.target as Element).matches('[data-role="period-start"]')) {
      onPeriodChange();
    }
  });
  periodTb.addEventListener("click", (event) => {
    const btn = (event.target as Element).closest(
      '[data-action="delete-period"]',
    );
    if (!btn) {
      return;
    }
    if (periodTb.querySelectorAll("tr").length <= 1) {
      return;
    }
    btn.closest("tr")?.remove();
    onPeriodChange();
  });
  addPeriodBtn.addEventListener("click", () => {
    const { duration, periods } = readPeriodCfg();
    const lastStart = periods.at(-1)?.start ?? "08:00";
    const nextStart = addMinutes(lastStart, duration + 10);
    periodTb.appendChild(makePeriodRow(periods.length, nextStart, duration));
    onPeriodChange();
  });

  alarmTb.addEventListener("change", (event) => {
    const target = event.target as Element;
    if (
      target.matches('[data-role="alarm-enabled"]') ||
      target.matches('[data-role="alarm-action"]')
    ) {
      onAlarmChange();
    }
  });
  alarmTb.addEventListener("input", (event) => {
    if ((event.target as Element).matches('[data-role="alarm-minutes"]')) {
      onAlarmChange();
    }
  });
  alarmTb.addEventListener("click", (event) => {
    const btn = (event.target as Element).closest(
      '[data-action="delete-alarm"]',
    );
    if (!btn) {
      return;
    }
    btn.closest("tr")?.remove();
    onAlarmChange();
  });
  addAlarmBtn.addEventListener("click", () => {
    const index = alarmTb.querySelectorAll("tr").length;
    alarmTb.appendChild(
      makeAlarmRow(index, { enabled: true, minutes: 15, action: "DISPLAY" }),
    );
    onAlarmChange();
  });

  const statusClassNames = {
    error: styles.statusError,
    info: styles.statusInfo,
    ok: styles.statusOk,
  } as const;

  const setStatus = (
    message: string,
    tone: keyof typeof statusClassNames,
  ): void => {
    statusEl.textContent = message;
    statusEl.className = cx(styles.status, statusClassNames[tone]);
  };

  exportBtn.addEventListener("click", () => {
    handleExportAction({
      semKey,
      startInp,
      readConfig: readCfg,
      setStatus,
    });
  });
}
