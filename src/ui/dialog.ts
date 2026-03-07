// ════════════════════════════════════════════════════════════════════════════
//  ui/dialog.ts - 导出设置对话框的构建与事件处理
// ════════════════════════════════════════════════════════════════════════════

import { getConfig, saveConfig } from "../config";
import { detectSemesterKey, guessSemesterStart } from "../core";
import type { Config } from "../types";
import { addMinutes } from "../utils";
import { cx, styles } from "./css";
import { createDialogElements } from "./export-dialog/dom";
import { handleExportAction } from "./export-dialog/export";
import {
  createDialogConfigStore,
  renderAlarmRows,
  renderPeriodRows,
  refreshAlarmRows,
  refreshPeriodTable,
  refreshPreview,
} from "./export-dialog/state";

export function setActiveTab(
  tabBar: HTMLDivElement,
  panelsEl: HTMLDivElement,
  tabId: string,
): void {
  for (const tabButton of Array.from(
    tabBar.querySelectorAll<HTMLElement>('[data-role="tab-button"]'),
  )) {
    const active = tabButton.dataset.tab === tabId;
    tabButton.classList.toggle(styles.tabButtonActive, active);
    tabButton.setAttribute("aria-selected", String(active));
  }

  for (const panel of Array.from(
    panelsEl.querySelectorAll<HTMLElement>('[data-role="tab-panel"]'),
  )) {
    const active = panel.id === `ics-tab-${tabId}`;
    panel.classList.toggle(styles.panelActive, active);
    panel.hidden = !active;
    panel.setAttribute("aria-hidden", String(!active));
  }
}

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
  const store = createDialogConfigStore(cfg);

  function openDialog(): void {
    backdrop.classList.add(styles.dialogOpen);
    dialog.classList.add(styles.dialogOpen);
    dialog.setAttribute("aria-hidden", "false");
    refreshPreview(previewList, store.getConfig());
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

    if (!tabId) {
      return;
    }

    setActiveTab(tabBar, panelsEl, tabId);
    if (tabId === "export") {
      refreshPreview(previewList, store.getConfig());
    }
  });

  function persistConfig(): Config {
    const current = store.getConfig();
    saveConfig(current);
    return current;
  }

  function onPeriodChange(): void {
    const current = persistConfig();
    durInp.value = String(current.duration);
    refreshPeriodTable(periodTb, current);
    refreshPreview(previewList, current);
  }

  function onAlarmChange(): void {
    const current = persistConfig();
    refreshAlarmRows(alarmTb, current.alarms);
  }

  refreshPreview(previewList, store.getConfig());
  refreshAlarmRows(alarmTb, store.getConfig().alarms);

  durInp.addEventListener("input", () => {
    store.setDuration(durInp.value);
    onPeriodChange();
  });

  periodTb.addEventListener("input", (event) => {
    const target = event.target as HTMLInputElement;
    if (target.matches('[data-role="period-start"]')) {
      const row = target.closest<HTMLTableRowElement>("tr[data-idx]");
      const index = Number.parseInt(row?.dataset.idx ?? "-1", 10);
      store.setPeriodStart(index, target.value);
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
    const row = btn.closest<HTMLTableRowElement>("tr[data-idx]");
    const index = Number.parseInt(row?.dataset.idx ?? "-1", 10);
    const next = store.removePeriod(index);
    renderPeriodRows(periodTb, next);
    onPeriodChange();
  });
  addPeriodBtn.addEventListener("click", () => {
    const current = store.getConfig();
    const lastStart = current.periods.at(-1)?.start ?? "08:00";
    const nextStart = addMinutes(lastStart, current.duration + 10);
    renderPeriodRows(periodTb, store.addPeriod(nextStart));
    onPeriodChange();
  });

  alarmTb.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    const row = target.closest<HTMLTableRowElement>("tr[data-alarm-idx]");
    const index = Number.parseInt(row?.dataset.alarmIdx ?? "-1", 10);
    if (target.matches('[data-role="alarm-enabled"]')) {
      store.updateAlarm(index, { enabled: (target as HTMLInputElement).checked });
      onAlarmChange();
    }
    if (target.matches('[data-role="alarm-action"]')) {
      store.updateAlarm(index, { action: target.value as Config["alarms"][number]["action"] });
      onAlarmChange();
    }
  });
  alarmTb.addEventListener("input", (event) => {
    const target = event.target as HTMLInputElement;
    if (target.matches('[data-role="alarm-minutes"]')) {
      const row = target.closest<HTMLTableRowElement>("tr[data-alarm-idx]");
      const index = Number.parseInt(row?.dataset.alarmIdx ?? "-1", 10);
      store.updateAlarm(index, { minutes: Number.parseInt(target.value, 10) });
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
    const row = btn.closest<HTMLTableRowElement>("tr[data-alarm-idx]");
    const index = Number.parseInt(row?.dataset.alarmIdx ?? "-1", 10);
    renderAlarmRows(alarmTb, store.removeAlarm(index));
    onAlarmChange();
  });
  addAlarmBtn.addEventListener("click", () => {
    renderAlarmRows(alarmTb, store.addAlarm());
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
    const currentCfg = persistConfig();
    handleExportAction({
      semKey,
      startInp,
      readConfig: () => currentCfg,
      setStatus,
    });
  });
}
