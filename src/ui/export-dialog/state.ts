// ════════════════════════════════════════════════════════════════════════════
//  ui/export-dialog/state.ts - 导出配置状态与视图同步
// ════════════════════════════════════════════════════════════════════════════

import {
  cloneConfig,
  createReminderRule,
  normalizeDuration,
  normalizePeriod,
} from "../../config";
import type { Config, ReminderDeliveryKind, ReminderRule } from "../../types";
import { addMinutes } from "../../utils";
import { makePeriodRow, makeReminderRuleRow } from "../builders";
import { styles } from "../css";

export interface DialogConfigStore {
  getConfig(): Config;
  setDuration(value: number | string): Config;
  setPeriodStart(index: number, start: string): Config;
  addPeriod(start: string): Config;
  removePeriod(index: number): Config;
  setReminderRuleEnabled(ruleId: string, isEnabled: boolean): Config;
  setReminderRuleMinutes(ruleId: string, minutesBeforeStart: number): Config;
  setReminderRuleDelivery(ruleId: string, kind: ReminderDeliveryKind): Config;
  addReminderRule(rule?: Partial<ReminderRule>): Config;
  removeReminderRule(ruleId: string): Config;
}

export function createDialogConfigStore(initialConfig: Config): DialogConfigStore {
  const config = cloneConfig(initialConfig);

  return {
    getConfig(): Config {
      return cloneConfig(config);
    },

    setDuration(value): Config {
      config.duration = normalizeDuration(value, config.duration);
      return cloneConfig(config);
    },

    setPeriodStart(index, start): Config {
      const current = config.periods[index];
      if (!current) {
        return cloneConfig(config);
      }

      config.periods[index] = normalizePeriod({ start }, current.start);
      return cloneConfig(config);
    },

    addPeriod(start): Config {
      config.periods.push(normalizePeriod({ start }));
      return cloneConfig(config);
    },

    removePeriod(index): Config {
      if (config.periods.length <= 1) {
        return cloneConfig(config);
      }

      config.periods.splice(index, 1);
      return cloneConfig(config);
    },

    setReminderRuleEnabled(ruleId, isEnabled): Config {
      config.reminderProgram.rules = config.reminderProgram.rules.map((rule) =>
        rule.id === ruleId ? createReminderRule({ ...rule, isEnabled }) : rule,
      );
      return cloneConfig(config);
    },

    setReminderRuleMinutes(ruleId, minutesBeforeStart): Config {
      config.reminderProgram.rules = config.reminderProgram.rules.map((rule) =>
        rule.id === ruleId
          ? createReminderRule({
              ...rule,
              offset: { minutesBeforeStart },
            })
          : rule,
      );
      return cloneConfig(config);
    },

    setReminderRuleDelivery(ruleId, kind): Config {
      config.reminderProgram.rules = config.reminderProgram.rules.map((rule) =>
        rule.id === ruleId
          ? createReminderRule({
              ...rule,
              delivery: { kind },
            })
          : rule,
      );
      return cloneConfig(config);
    },

    addReminderRule(rule = {}): Config {
      config.reminderProgram.rules.push(createReminderRule(rule));
      return cloneConfig(config);
    },

    removeReminderRule(ruleId): Config {
      if (config.reminderProgram.rules.length <= 1) {
        return cloneConfig(config);
      }

      config.reminderProgram.rules = config.reminderProgram.rules.filter(
        (rule) => rule.id !== ruleId,
      );
      return cloneConfig(config);
    },
  };
}

export function renderPeriodRows(
  periodTb: HTMLTableSectionElement,
  { periods, duration }: Config,
): void {
  periodTb.replaceChildren(
    ...periods.map((period, index) => makePeriodRow(index, period.start, duration)),
  );
}

export function renderReminderRuleRows(
  reminderRuleTb: HTMLTableSectionElement,
  rules: ReminderRule[],
): void {
  reminderRuleTb.replaceChildren(
    ...rules.map((rule, index) => makeReminderRuleRow(index, rule)),
  );
}

export function refreshPeriodTable(
  periodTb: HTMLTableSectionElement,
  { periods, duration }: Config,
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
  { periods, duration }: Config,
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
