// ════════════════════════════════════════════════════════════════════════════
//  ui/export-dialog/state.ts - 导出配置状态与视图同步
// ════════════════════════════════════════════════════════════════════════════

import {
  DEFAULT_ALARM_ACTION,
  DEFAULT_ALARM_MINUTES,
  cloneConfig,
  normalizeAlarm,
  normalizeDuration,
  normalizePeriod,
} from "../../config";
import type { Alarm, Config } from "../../types";
import { addMinutes } from "../../utils";
import { makeAlarmRow, makePeriodRow } from "../builders";
import { styles } from "../css";

export interface DialogConfigStore {
  getConfig(): Config;
  setDuration(value: number | string): Pick<Config, "duration" | "periods">;
  setPeriodStart(
    index: number,
    start: string,
  ): Pick<Config, "duration" | "periods">;
  addPeriod(start: string): Pick<Config, "duration" | "periods">;
  removePeriod(index: number): Pick<Config, "duration" | "periods">;
  updateAlarm(index: number, patch: Partial<Alarm>): Alarm[];
  addAlarm(alarm?: Partial<Alarm>): Alarm[];
  removeAlarm(index: number): Alarm[];
}

export function createDialogConfigStore(initialConfig: Config): DialogConfigStore {
  const config = cloneConfig(initialConfig);

  return {
    getConfig(): Config {
      return cloneConfig(config);
    },

    setDuration(value): Pick<Config, "duration" | "periods"> {
      config.duration = normalizeDuration(value, config.duration);
      return {
        duration: config.duration,
        periods: config.periods.map((period) => ({ ...period })),
      };
    },

    setPeriodStart(index, start): Pick<Config, "duration" | "periods"> {
      const current = config.periods[index];
      if (!current) {
        return {
          duration: config.duration,
          periods: config.periods.map((period) => ({ ...period })),
        };
      }

      config.periods[index] = normalizePeriod({ start }, current.start);
      return {
        duration: config.duration,
        periods: config.periods.map((period) => ({ ...period })),
      };
    },

    addPeriod(start): Pick<Config, "duration" | "periods"> {
      config.periods.push(normalizePeriod({ start }));
      return {
        duration: config.duration,
        periods: config.periods.map((period) => ({ ...period })),
      };
    },

    removePeriod(index): Pick<Config, "duration" | "periods"> {
      if (config.periods.length <= 1) {
        return {
          duration: config.duration,
          periods: config.periods.map((period) => ({ ...period })),
        };
      }

      config.periods.splice(index, 1);
      return {
        duration: config.duration,
        periods: config.periods.map((period) => ({ ...period })),
      };
    },

    updateAlarm(index, patch): Alarm[] {
      const current = config.alarms[index];
      if (!current) {
        return config.alarms.map((alarm) => ({ ...alarm }));
      }

      config.alarms[index] = normalizeAlarm({ ...current, ...patch });
      return config.alarms.map((alarm) => ({ ...alarm }));
    },

    addAlarm(alarm = {}): Alarm[] {
      config.alarms.push(normalizeAlarm(alarm));
      return config.alarms.map((item) => ({ ...item }));
    },

    removeAlarm(index): Alarm[] {
      if (config.alarms.length <= 1) {
        return config.alarms.map((alarm) => ({ ...alarm }));
      }

      config.alarms.splice(index, 1);
      return config.alarms.map((alarm) => ({ ...alarm }));
    },
  };
}

export function renderPeriodRows(
  periodTb: HTMLTableSectionElement,
  { periods, duration }: Pick<Config, "duration" | "periods">,
): void {
  periodTb.replaceChildren(
    ...periods.map((period, index) => makePeriodRow(index, period.start, duration)),
  );
}

export function renderAlarmRows(
  alarmTb: HTMLTableSectionElement,
  alarms: Alarm[],
): void {
  alarmTb.replaceChildren(
    ...alarms.map((alarm, index) => makeAlarmRow(index, alarm)),
  );
}

export function refreshPeriodTable(
  periodTb: HTMLTableSectionElement,
  { periods, duration }: Pick<Config, "duration" | "periods">,
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
  { periods, duration }: Pick<Config, "periods" | "duration">,
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

export function refreshAlarmRows(
  alarmTb: HTMLTableSectionElement,
  alarms: Alarm[],
): void {
  Array.from(alarmTb.rows).forEach((tr, index) => {
    const alarm = alarms[index] ?? normalizeAlarm({
      enabled: false,
      minutes: DEFAULT_ALARM_MINUTES,
      action: DEFAULT_ALARM_ACTION,
    });
    tr.dataset.alarmIdx = String(index);
    tr.classList.toggle(styles.alarmOff, !alarm.enabled);

    const checkbox = tr.querySelector<HTMLInputElement>('[data-role="alarm-enabled"]');
    if (checkbox) {
      checkbox.checked = alarm.enabled;
    }

    const minutesInput = tr.querySelector<HTMLInputElement>('[data-role="alarm-minutes"]');
    if (minutesInput && minutesInput.value !== String(alarm.minutes)) {
      minutesInput.value = String(alarm.minutes);
    }

    const actionSelect = tr.querySelector<HTMLSelectElement>('[data-role="alarm-action"]');
    if (actionSelect) {
      actionSelect.value = alarm.action;
    }

    const toggleEl = tr.querySelector<HTMLElement>('[data-role="alarm-toggle"]');
    if (toggleEl) {
      toggleEl.title = alarm.enabled ? "已启用" : "已禁用";
    }
  });
}
