// ════════════════════════════════════════════════════════════════════════════
//  ui/export-dialog/state.ts - 导出对话框表单状态读取与同步
// ════════════════════════════════════════════════════════════════════════════

import { DEFAULT_DURATION } from "../../config";
import type { Alarm, Config } from "../../types";
import { addMinutes } from "../../utils";
import { styles } from "../css";

function getAlarmRows(
  alarmTb: HTMLTableSectionElement,
): HTMLTableRowElement[] {
  return Array.from(alarmTb.rows);
}

export function readPeriodConfig(
  durInp: HTMLInputElement,
  periodTb: HTMLTableSectionElement,
): Pick<Config, "duration" | "periods"> {
  return {
    duration: Math.max(1, parseInt(durInp.value, 10) || DEFAULT_DURATION),
    periods: Array.from(
      periodTb.querySelectorAll<HTMLElement>("tr[data-idx]"),
    ).map((tr) => ({
      start:
        tr.querySelector<HTMLInputElement>('[data-role="period-start"]')
          ?.value ?? "08:00",
    })),
  };
}

export function readAlarms(alarmTb: HTMLTableSectionElement): Alarm[] {
  return getAlarmRows(alarmTb).map((tr) => ({
    enabled:
      tr.querySelector<HTMLInputElement>('[data-role="alarm-enabled"]')
        ?.checked ?? true,
    minutes: Math.max(
      1,
      parseInt(
        tr.querySelector<HTMLInputElement>('[data-role="alarm-minutes"]')
          ?.value ?? "15",
        10,
      ) || 15,
    ),
    action: (tr.querySelector<HTMLSelectElement>('[data-role="alarm-action"]')
      ?.value ?? "DISPLAY") as Alarm["action"],
  }));
}

export function readDialogConfig(
  durInp: HTMLInputElement,
  periodTb: HTMLTableSectionElement,
  alarmTb: HTMLTableSectionElement,
): Config {
  return {
    ...readPeriodConfig(durInp, periodTb),
    alarms: readAlarms(alarmTb),
  };
}

export function refreshPeriodTable(
  periodTb: HTMLTableSectionElement,
  duration: number,
): void {
  periodTb
    .querySelectorAll<HTMLElement>("tr[data-idx]")
    .forEach((tr, index) => {
      tr.dataset.idx = String(index);
      const noEl = tr.querySelector<HTMLElement>('[data-cell="period-index"]');
      const endEl = tr.querySelector<HTMLElement>('[data-cell="period-end"]');
      const startEl = tr.querySelector<HTMLInputElement>(
        '[data-role="period-start"]',
      );
      if (noEl) {
        noEl.textContent = String(index + 1);
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

export function refreshAlarmRows(alarmTb: HTMLTableSectionElement): void {
  getAlarmRows(alarmTb).forEach((tr, index) => {
      tr.dataset.alarmIdx = String(index);
      const enabled =
        tr.querySelector<HTMLInputElement>('[data-role="alarm-enabled"]')
          ?.checked ?? false;
      tr.classList.toggle(styles.alarmOff, !enabled);
      const toggleEl = tr.querySelector<HTMLElement>(
        '[data-role="alarm-toggle"]',
      );
      if (toggleEl) {
        toggleEl.title = enabled ? "已启用" : "已禁用";
      }
    });
}
