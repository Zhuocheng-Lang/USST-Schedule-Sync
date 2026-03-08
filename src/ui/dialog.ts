// ════════════════════════════════════════════════════════════════════════════
//  ui/dialog.ts - 导出设置对话框的构建与事件处理
// ════════════════════════════════════════════════════════════════════════════

import {
  getDuration,
  getPeriods,
  getReminderProgram,
  saveDuration,
  savePeriods,
  saveReminderProgram,
} from "../config";
import { detectSemesterKey, guessSemesterStart } from "../core";
import type {
  ReminderDeliveryKind,
  ReminderPresetId,
  ReminderRule,
} from "../types";
import { addMinutes } from "../utils";
import { cx, styles } from "./css";
import { createDialogElements } from "./export-dialog/dom";
import { handleExportAction } from "./export-dialog/export";
import {
  createDialogConfigStore,
  renderPeriodRows,
  refreshPeriodTable,
  refreshPreview,
  renderReminderRuleCards,
  renderReminderSummary,
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

  const duration = getDuration();
  const periods = getPeriods();
  const reminderProgram = getReminderProgram();
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
    reminderPresetBar,
    reminderSummaryEl,
    reminderPreviewList,
    reminderRuleList,
    addReminderRuleBtn,
    exportBtn,
    statusEl,
    statusDetailBtn,
    statusDetailEl,
  } = createDialogElements(duration, periods, reminderProgram, defaultDate);
  let store = createDialogConfigStore(duration, periods, reminderProgram);

  function clearStatusDetail(): void {
    statusDetailBtn.hidden = true;
    statusDetailBtn.textContent = "查看详情";
    statusDetailBtn.setAttribute("aria-expanded", "false");
    statusDetailEl.hidden = true;
    statusDetailEl.textContent = "";
  }

  syncExistingUI = (): void => {
    const latestDuration = getDuration();
    const latestPeriods = getPeriods();
    const latestReminderProgram = getReminderProgram();
    store = createDialogConfigStore(
      latestDuration,
      latestPeriods,
      latestReminderProgram,
    );
    durInp.value = String(latestDuration);
    renderPeriodRows(periodTb, latestPeriods, latestDuration);
    refreshPeriodTable(periodTb, latestPeriods, latestDuration);
    syncReminderPresetButtons(latestReminderProgram.presetId);
    renderReminderRuleCards(reminderRuleList, latestReminderProgram.rules);
    renderReminderSummary(
      reminderSummaryEl,
      reminderPreviewList,
      latestReminderProgram,
    );
    syncAddReminderBtn(latestReminderProgram.rules);
    refreshPreview(previewList, latestPeriods, latestDuration);
    clearStatusDetail();
  };

  function openDialog(): void {
    syncExistingUI?.();
    backdrop.classList.add(styles.dialogOpen);
    dialog.classList.add(styles.dialogOpen);
    dialog.setAttribute("aria-hidden", "false");
    refreshPreview(previewList, store.getPeriods(), store.getDuration());
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

  document
    .getElementById("ics-trigger-btn")
    ?.addEventListener("click", openDialog);

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
      refreshPreview(previewList, store.getPeriods(), store.getDuration());
    }
  });

  function persistDialogState(): void {
    saveDuration(store.getDuration());
    savePeriods(store.getPeriods());
    saveReminderProgram(store.getReminderProgram());
  }

  function onPeriodChange(): void {
    persistDialogState();
    const currentDuration = store.getDuration();
    const currentPeriods = store.getPeriods();
    durInp.value = String(currentDuration);
    refreshPeriodTable(periodTb, currentPeriods, currentDuration);
    refreshPreview(previewList, currentPeriods, currentDuration);
  }

  const MAX_REMINDER_RULES = 5;

  function syncAddReminderBtn(rules: ReminderRule[]): void {
    addReminderRuleBtn.disabled = rules.length >= MAX_REMINDER_RULES;
  }

  function syncReminderPresetButtons(presetId: ReminderPresetId): void {
    for (const button of Array.from(
      reminderPresetBar.querySelectorAll<HTMLButtonElement>(
        '[data-role="reminder-preset"]',
      ),
    )) {
      const active = button.dataset.presetId === presetId;
      button.classList.toggle(styles.presetButtonActive, active);
      button.setAttribute("aria-pressed", String(active));
    }
  }

  function onReminderChange(): void {
    persistDialogState();
    const currentReminderProgram = store.getReminderProgram();
    syncReminderPresetButtons(currentReminderProgram.presetId);
    renderReminderRuleCards(reminderRuleList, currentReminderProgram.rules);
    renderReminderSummary(
      reminderSummaryEl,
      reminderPreviewList,
      currentReminderProgram,
    );
    syncAddReminderBtn(currentReminderProgram.rules);
  }

  refreshPreview(previewList, store.getPeriods(), store.getDuration());
  const initialReminderProgram = store.getReminderProgram();
  syncReminderPresetButtons(initialReminderProgram.presetId);
  renderReminderRuleCards(reminderRuleList, initialReminderProgram.rules);
  renderReminderSummary(
    reminderSummaryEl,
    reminderPreviewList,
    initialReminderProgram,
  );
  syncAddReminderBtn(initialReminderProgram.rules);

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
    store.removePeriod(index);
    renderPeriodRows(periodTb, store.getPeriods(), store.getDuration());
    onPeriodChange();
  });
  addPeriodBtn.addEventListener("click", () => {
    const currentPeriods = store.getPeriods();
    const currentDuration = store.getDuration();
    const lastStart = currentPeriods.at(-1)?.start ?? "08:00";
    const nextStart = addMinutes(lastStart, currentDuration + 10);
    store.addPeriod(nextStart);
    renderPeriodRows(periodTb, store.getPeriods(), store.getDuration());
    onPeriodChange();
  });

  reminderPresetBar.addEventListener("click", (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>(
      '[data-role="reminder-preset"]',
    );
    const presetId = button?.dataset.presetId as ReminderPresetId | undefined;
    if (!presetId) {
      return;
    }
    store.applyReminderPreset(presetId);
    onReminderChange();
  });

  reminderRuleList.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    const row = target.closest<HTMLDivElement>("[data-reminder-rule-id]");
    const ruleId = row?.dataset.reminderRuleId;
    if (!ruleId) {
      return;
    }
    if (target.matches('[data-role="reminder-rule-enabled"]')) {
      store.setReminderRuleEnabled(
        ruleId,
        (target as HTMLInputElement).checked,
      );
      onReminderChange();
    }
    if (target.matches('[data-role="reminder-rule-delivery"]')) {
      store.setReminderRuleDelivery(
        ruleId,
        target.value as ReminderDeliveryKind,
      );
      onReminderChange();
    }
  });
  reminderRuleList.addEventListener("input", (event) => {
    const target = event.target as HTMLInputElement;
    if (target.matches('[data-role="reminder-rule-minutes"]')) {
      const row = target.closest<HTMLDivElement>("[data-reminder-rule-id]");
      const ruleId = row?.dataset.reminderRuleId;
      if (!ruleId) {
        return;
      }
      store.setReminderRuleMinutes(ruleId, Number.parseInt(target.value, 10));
      onReminderChange();
    }
  });
  reminderRuleList.addEventListener("click", (event) => {
    const btn = (event.target as Element).closest(
      '[data-action="delete-reminder-rule"]',
    );
    if (!btn) {
      return;
    }
    const row = btn.closest<HTMLDivElement>("[data-reminder-rule-id]");
    const ruleId = row?.dataset.reminderRuleId;
    if (!ruleId) {
      return;
    }
    store.removeReminderRule(ruleId);
    onReminderChange();
  });
  addReminderRuleBtn.addEventListener("click", () => {
    store.addReminderRule();
    onReminderChange();
  });

  const statusClassNames = {
    error: styles.statusError,
    info: styles.statusInfo,
    ok: styles.statusOk,
  } as const;

  const setStatus = (
    message: string,
    tone: keyof typeof statusClassNames,
    detail?: string,
  ): void => {
    statusEl.textContent = message;
    statusEl.className = cx(styles.status, statusClassNames[tone]);

    if (tone === "error" && detail) {
      statusDetailBtn.hidden = false;
      statusDetailBtn.textContent = "查看详情";
      statusDetailBtn.setAttribute("aria-expanded", "false");
      statusDetailEl.textContent = detail;
      statusDetailEl.hidden = true;
      return;
    }

    clearStatusDetail();
  };

  statusDetailBtn.addEventListener("click", () => {
    const willExpand = statusDetailEl.hidden;
    statusDetailEl.hidden = !willExpand;
    statusDetailBtn.textContent = willExpand ? "隐藏详情" : "查看详情";
    statusDetailBtn.setAttribute("aria-expanded", String(willExpand));
  });

  exportBtn.addEventListener("click", () => {
    persistDialogState();
    handleExportAction({
      semKey,
      startInp,
      readDuration: () => store.getDuration(),
      readPeriods: () => store.getPeriods(),
      readReminderProgram: () => store.getReminderProgram(),
      setStatus,
    });
  });
}
