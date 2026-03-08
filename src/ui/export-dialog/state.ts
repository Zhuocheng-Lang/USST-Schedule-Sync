// ════════════════════════════════════════════════════════════════════════════
//  ui/export-dialog/state.ts - 导出配置状态与视图同步
// ════════════════════════════════════════════════════════════════════════════

import {
  clonePeriod,
  cloneReminderProgram,
  createCustomReminderRule,
  normalizeDuration,
  normalizePeriod,
  setReminderProgramPreset,
  setReminderProgramRules,
  summarizeReminderProgram,
} from "../../config";
import type {
  Period,
  ReminderDeliveryKind,
  ReminderPresetId,
  ReminderProgram,
  ReminderRule,
} from "../../types";
import { addMinutes } from "../../utils";
import { makePeriodRow, makeReminderRuleCard } from "../builders";
import { styles } from "../css";

export interface DialogConfigStore {
  getDuration(): number;
  getPeriods(): Period[];
  getReminderProgram(): ReminderProgram;
  setDuration(value: number | string): void;
  setPeriodStart(index: number, start: string): void;
  addPeriod(start: string): void;
  removePeriod(index: number): void;
  applyReminderPreset(presetId: ReminderPresetId): void;
  setReminderRuleEnabled(ruleId: string, isEnabled: boolean): void;
  setReminderRuleMinutes(ruleId: string, minutesBeforeStart: number): void;
  setReminderRuleDelivery(ruleId: string, kind: ReminderDeliveryKind): void;
  addReminderRule(rule?: Partial<ReminderRule>): void;
  removeReminderRule(ruleId: string): void;
}

function updateReminderRules(
  reminderProgram: ReminderProgram,
  recipe: (rules: ReminderRule[]) => ReminderRule[],
): ReminderProgram {
  return setReminderProgramRules(recipe(reminderProgram.rules));
}

function removeRuleById(
  rules: ReminderRule[],
  ruleId: string,
): {
  removedRule: ReminderRule | null;
  remainingRules: ReminderRule[];
} {
  const remainingRules: ReminderRule[] = [];
  let removedRule: ReminderRule | null = null;

  for (const rule of rules) {
    if (removedRule === null && rule.id === ruleId) {
      removedRule = rule;
      continue;
    }

    remainingRules.push(rule);
  }

  return {
    removedRule,
    remainingRules,
  };
}

export function createDialogConfigStore(
  initialDuration: number,
  initialPeriods: Period[],
  initialReminderProgram: ReminderProgram,
): DialogConfigStore {
  let duration = normalizeDuration(initialDuration, initialDuration);
  let periods = initialPeriods.map(clonePeriod);
  let reminderProgram = cloneReminderProgram(initialReminderProgram);

  return {
    getDuration(): number {
      return duration;
    },

    getPeriods(): Period[] {
      return periods.map(clonePeriod);
    },

    getReminderProgram(): ReminderProgram {
      return cloneReminderProgram(reminderProgram);
    },

    setDuration(value): void {
      duration = normalizeDuration(value, duration);
    },

    setPeriodStart(index, start): void {
      const current = periods[index];
      if (!current) {
        return;
      }

      periods[index] = normalizePeriod({ start }, current.start);
    },

    addPeriod(start): void {
      periods.push(normalizePeriod({ start }));
    },

    removePeriod(index): void {
      if (periods.length <= 1) {
        return;
      }

      periods.splice(index, 1);
    },

    applyReminderPreset(presetId): void {
      reminderProgram = setReminderProgramPreset(reminderProgram, presetId);
    },

    setReminderRuleEnabled(ruleId, isEnabled): void {
      reminderProgram = updateReminderRules(reminderProgram, (rules) =>
        rules.map((rule) =>
          rule.id === ruleId ? { ...rule, isEnabled } : rule,
        ),
      );
    },

    setReminderRuleMinutes(ruleId, minutesBeforeStart): void {
      reminderProgram = updateReminderRules(reminderProgram, (rules) =>
        rules.map((rule) =>
          rule.id === ruleId
            ? {
                ...rule,
                offset: {
                  minutesBeforeStart: Math.max(
                    1,
                    Number.parseInt(String(minutesBeforeStart), 10) || 1,
                  ),
                },
              }
            : rule,
        ),
      );
    },

    setReminderRuleDelivery(ruleId, kind): void {
      reminderProgram = updateReminderRules(reminderProgram, (rules) =>
        rules.map((rule) =>
          rule.id === ruleId
            ? {
                ...rule,
                delivery: { kind },
              }
            : rule,
        ),
      );
    },

    addReminderRule(rule = {}): void {
      const fallbackRule = createCustomReminderRule();
      reminderProgram = updateReminderRules(reminderProgram, (rules) => [
        ...rules,
        {
          ...fallbackRule,
          ...rule,
          offset: {
            minutesBeforeStart:
              typeof rule.offset?.minutesBeforeStart === "number"
                ? rule.offset.minutesBeforeStart
                : fallbackRule.offset.minutesBeforeStart,
          },
          delivery: {
            kind: rule.delivery?.kind === "AUDIO" ? "AUDIO" : "DISPLAY",
          },
          template: { kind: "course-start-countdown" },
        },
      ]);
    },

    removeReminderRule(ruleId): void {
      reminderProgram = updateReminderRules(
        reminderProgram,
        (rules) => removeRuleById(rules, ruleId).remainingRules,
      );
    },
  };
}

export function renderPeriodRows(
  periodTb: HTMLTableSectionElement,
  periods: Period[],
  duration: number,
): void {
  periodTb.replaceChildren(
    ...periods.map((period, index) =>
      makePeriodRow(index, period.start, duration),
    ),
  );
}

export function renderReminderRuleCards(
  reminderRuleList: HTMLDivElement,
  rules: ReminderRule[],
): void {
  if (!rules.length) {
    const empty = Object.assign(document.createElement("div"), {
      className: styles.emptyState,
      textContent:
        "当前不会导出任何课前提醒。可以直接套用预设，或手动新增自定义提醒。",
    });
    reminderRuleList.replaceChildren(empty);
    return;
  }

  reminderRuleList.replaceChildren(
    ...rules.map((rule, index) => makeReminderRuleCard(index, rule)),
  );
}

export function renderReminderSummary(
  summaryEl: HTMLDivElement,
  previewList: HTMLUListElement,
  reminderProgram: ReminderProgram,
): void {
  const summary = summarizeReminderProgram(reminderProgram);

  if (!summary.activeRuleCount) {
    summaryEl.textContent = "当前方案：已关闭提醒";
    previewList.replaceChildren();
    return;
  }

  summaryEl.textContent = `当前方案：${summary.presetLabel} · 每门课 ${summary.activeRuleCount} 条提醒`;
  previewList.replaceChildren(
    ...summary.activeRuleDescriptions.map((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      return li;
    }),
  );
}

export function refreshPeriodTable(
  periodTb: HTMLTableSectionElement,
  periods: Period[],
  duration: number,
): void {
  periodTb
    .querySelectorAll<HTMLElement>("tr[data-idx]")
    .forEach((tr, index) => {
      const period = periods[index];
      tr.dataset.idx = String(index);
      const noEl = tr.querySelector<HTMLElement>('[data-cell="period-index"]');
      const endEl = tr.querySelector<HTMLElement>('[data-cell="period-end"]');
      const startEl = tr.querySelector<HTMLInputElement>(
        '[data-role="period-start"]',
      );
      if (noEl) {
        noEl.textContent = String(index + 1);
      }
      if (startEl && period && startEl.value !== period.start) {
        startEl.value = period.start;
      }
      if (endEl && startEl) {
        endEl.textContent = "→ " + addMinutes(startEl.value, duration);
      }
    });
}

export function refreshPreview(
  previewList: HTMLUListElement,
  periods: Period[],
  duration: number,
): void {
  previewList.replaceChildren(
    ...periods.map((period, index) => {
      const li = document.createElement("li");
      const indexEl = Object.assign(document.createElement("span"), {
        className: styles.previewIndex,
        textContent: String(index + 1),
      });
      const startEl = Object.assign(document.createElement("span"), {
        className: styles.previewTime,
        textContent: period.start,
      });
      const endEl = Object.assign(document.createElement("span"), {
        className: styles.previewEnd,
        textContent: `→ ${addMinutes(period.start, duration)}`,
      });
      li.append(indexEl, startEl, endEl);
      return li;
    }),
  );
}
