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
  renderPeriodRows,
  refreshPeriodTable,
  refreshPreview,
  renderReminderRuleRows,
} from "./export-dialog/state";

let syncExistingUI: (() => void) | null = null;

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
    syncExistingUI?.();
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
    reminderRuleTb,
    addReminderRuleBtn,
    exportBtn,
    statusEl,
  } = createDialogElements(cfg, defaultDate);
  let store = createDialogConfigStore(cfg);

  syncExistingUI = (): void => {
    const latest = getConfig();
    store = createDialogConfigStore(latest);
    durInp.value = String(latest.duration);
    renderPeriodRows(periodTb, latest);
    refreshPeriodTable(periodTb, latest);
    renderReminderRuleRows(reminderRuleTb, latest.reminderProgram.rules);
    refreshPreview(previewList, latest);
  };

  function openDialog(): void {
    syncExistingUI?.();
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

  document.getElementById("ics-trigger-btn")?.addEventListener("click", openDialog);

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

  function onPeriodChange(current = store.getConfig()): void {
    saveConfig(current);
    durInp.value = String(current.duration);
    refreshPeriodTable(periodTb, current);
    refreshPreview(previewList, current);
  }

  function onReminderChange(current = store.getConfig()): void {
    saveConfig(current);
    renderReminderRuleRows(reminderRuleTb, current.reminderProgram.rules);
  }

  refreshPreview(previewList, store.getConfig());
  renderReminderRuleRows(reminderRuleTb, store.getConfig().reminderProgram.rules);

  durInp.addEventListener("input", () => {
    onPeriodChange(store.setDuration(durInp.value));
  });

  periodTb.addEventListener("input", (event) => {
    const target = event.target as HTMLInputElement;
    if (target.matches('[data-role="period-start"]')) {
      const row = target.closest<HTMLTableRowElement>("tr[data-idx]");
      const index = Number.parseInt(row?.dataset.idx ?? "-1", 10);
      onPeriodChange(store.setPeriodStart(index, target.value));
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
    onPeriodChange(next);
  });
  addPeriodBtn.addEventListener("click", () => {
    const current = store.getConfig();
    const lastStart = current.periods.at(-1)?.start ?? "08:00";
    const nextStart = addMinutes(lastStart, current.duration + 10);
    const next = store.addPeriod(nextStart);
    renderPeriodRows(periodTb, next);
    onPeriodChange(next);
  });

  reminderRuleTb.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    const row = target.closest<HTMLTableRowElement>("tr[data-reminder-rule-id]");
    const ruleId = row?.dataset.reminderRuleId;
    if (!ruleId) {
      return;
    }
    if (target.matches('[data-role="reminder-rule-enabled"]')) {
      onReminderChange(
        store.setReminderRuleEnabled(
          ruleId,
          (target as HTMLInputElement).checked,
        ),
      );
    }
    if (target.matches('[data-role="reminder-rule-delivery"]')) {
      onReminderChange(
        store.setReminderRuleDelivery(
          ruleId,
          target.value as Config["reminderProgram"]["rules"][number]["delivery"]["kind"],
        ),
      );
    }
  });
  reminderRuleTb.addEventListener("input", (event) => {
    const target = event.target as HTMLInputElement;
    if (target.matches('[data-role="reminder-rule-minutes"]')) {
      const row = target.closest<HTMLTableRowElement>("tr[data-reminder-rule-id]");
      const ruleId = row?.dataset.reminderRuleId;
      if (!ruleId) {
        return;
      }
      onReminderChange(
        store.setReminderRuleMinutes(
          ruleId,
          Number.parseInt(target.value, 10),
        ),
      );
    }
  });
  reminderRuleTb.addEventListener("click", (event) => {
    const btn = (event.target as Element).closest(
      '[data-action="delete-reminder-rule"]',
    );
    if (!btn) {
      return;
    }
    const row = btn.closest<HTMLTableRowElement>("tr[data-reminder-rule-id]");
    const ruleId = row?.dataset.reminderRuleId;
    if (!ruleId) {
      return;
    }
    onReminderChange(store.removeReminderRule(ruleId));
  });
  addReminderRuleBtn.addEventListener("click", () => {
    onReminderChange(store.addReminderRule());
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
