// ════════════════════════════════════════════════════════════════════════════
//  ui/export-dialog/state.ts - 导出对话框表单状态读取与同步
// ════════════════════════════════════════════════════════════════════════════

import { DEFAULT_DURATION } from "../../config";
import type { Alarm, Config } from "../../types";
import { addMinutes } from "../../utils";

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
        tr.querySelector<HTMLInputElement>(".period-start")?.value ?? "08:00",
    })),
  };
}

export function readAlarms(alarmTb: HTMLTableSectionElement): Alarm[] {
  return Array.from(
    alarmTb.querySelectorAll<HTMLElement>("tr[data-alarm-idx]"),
  ).map((tr) => ({
    enabled:
      tr.querySelector<HTMLInputElement>(".alarm-enabled")?.checked ?? false,
    minutes: Math.max(
      1,
      parseInt(
        tr.querySelector<HTMLInputElement>(".alarm-minutes")?.value ?? "15",
        10,
      ) || 15,
    ),
    action: (tr.querySelector<HTMLSelectElement>(".alarm-action")?.value ??
      "DISPLAY") as Alarm["action"],
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
      const noEl = tr.querySelector<HTMLElement>(".tc-no");
      const endEl = tr.querySelector<HTMLElement>(".tc-end");
      const startEl = tr.querySelector<HTMLInputElement>(".period-start");
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
      li.innerHTML =
        `<span class="pn">${index + 1}</span>` +
        `<span class="pt">${period.start}</span>` +
        `<span class="pe">→ ${addMinutes(period.start, duration)}</span>`;
      return li;
    }),
  );
}

export function refreshAlarmRows(alarmTb: HTMLTableSectionElement): void {
  alarmTb
    .querySelectorAll<HTMLElement>("tr[data-alarm-idx]")
    .forEach((tr, index) => {
      tr.dataset.alarmIdx = String(index);
      const enabled =
        tr.querySelector<HTMLInputElement>(".alarm-enabled")?.checked ?? false;
      tr.classList.toggle("alarm-off", !enabled);
      const toggleEl = tr.querySelector<HTMLElement>(".ics-toggle");
      if (toggleEl) {
        toggleEl.title = enabled ? "已启用" : "已禁用";
      }
    });
}
