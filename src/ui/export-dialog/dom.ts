// ════════════════════════════════════════════════════════════════════════════
//  ui/export-dialog/dom.ts - 导出对话框 DOM 结构构建
// ════════════════════════════════════════════════════════════════════════════

import type { Config } from "../../types";
import { makeAlarmRow, makePeriodRow } from "../builders";
import { CSS } from "../css";

export interface DialogElements {
  backdrop: HTMLDivElement;
  dialog: HTMLDivElement;
  closeBtn: HTMLButtonElement;
  tabBar: HTMLDivElement;
  panelsEl: HTMLDivElement;
  startInp: HTMLInputElement;
  tzSel: HTMLSelectElement;
  previewList: HTMLUListElement;
  durInp: HTMLInputElement;
  periodTb: HTMLTableSectionElement;
  addPeriodBtn: HTMLButtonElement;
  alarmTb: HTMLTableSectionElement;
  addAlarmBtn: HTMLButtonElement;
  exportBtn: HTMLButtonElement;
  statusEl: HTMLDivElement;
}

export function createDialogElements(
  cfg: Config,
  defaultDate: string,
): DialogElements {
  const styleEl = Object.assign(document.createElement("style"), {
    textContent: CSS,
  });
  document.head.appendChild(styleEl);

  const backdrop = Object.assign(document.createElement("div"), {
    id: "ics-backdrop",
  });
  backdrop.setAttribute("aria-hidden", "true");
  document.body.appendChild(backdrop);

  const dialog = Object.assign(document.createElement("div"), {
    id: "ics-dialog",
  });
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-labelledby", "ics-dialog-title");

  const header = document.createElement("div");
  header.className = "ics-header";
  header.innerHTML =
    `<div class="ics-header-title">` +
    `<div class="ics-logo" aria-hidden="true">📅</div>` +
    `<div><div class="ics-title-text" id="ics-dialog-title">导出日历</div>` +
    `<div class="ics-title-sub">Export to .ics · iCalendar RFC 5545</div></div>` +
    `</div>`;
  const closeBtn = Object.assign(document.createElement("button"), {
    type: "button",
    className: "ics-close-btn",
    title: "关闭 (Esc)",
    textContent: "✕",
  });
  header.appendChild(closeBtn);

  const tabBar = document.createElement("div");
  tabBar.className = "ics-tabs";
  tabBar.setAttribute("role", "tablist");
  const tabDefs = [
    { id: "export", label: "导出设置" },
    { id: "schedule", label: "节次时间" },
    { id: "alarm", label: "课前提醒" },
  ] as const;
  for (const { id, label } of tabDefs) {
    const btn = Object.assign(document.createElement("button"), {
      type: "button",
      className: "ics-tab-btn" + (id === "export" ? " active" : ""),
      textContent: label,
    });
    btn.dataset.tab = id;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", String(id === "export"));
    btn.setAttribute("aria-controls", `ics-tab-${id}`);
    tabBar.appendChild(btn);
  }

  const panelsEl = Object.assign(document.createElement("div"), {
    className: "ics-panels",
  });

  const panelExport = Object.assign(document.createElement("div"), {
    className: "ics-panel active",
    id: "ics-tab-export",
  });
  panelExport.setAttribute("role", "tabpanel");
  panelExport.setAttribute("aria-labelledby", "tab-export");

  const twoCol = document.createElement("div");
  twoCol.className = "ics-two-col";

  const rowDate = document.createElement("div");
  rowDate.className = "ics-row";
  const lblDate = document.createElement("div");
  lblDate.className = "ics-label";
  lblDate.innerHTML = `学期第 1 周周一 <span class="ics-req" aria-label="必填">*</span>`;
  const startInp = Object.assign(document.createElement("input"), {
    type: "date",
    id: "ics-semester-start",
    className: "ics-field",
    value: defaultDate,
  });
  startInp.setAttribute("aria-required", "true");
  const tipDate = Object.assign(document.createElement("div"), {
    className: "ics-tip",
    textContent: "第一教学周的周一日期",
  });
  rowDate.append(lblDate, startInp, tipDate);

  const rowTz = document.createElement("div");
  rowTz.className = "ics-row";
  const lblTz = Object.assign(document.createElement("div"), {
    className: "ics-label",
    textContent: "时区",
  });
  const tzSel = Object.assign(document.createElement("select"), {
    id: "ics-tzid",
    className: "ics-field",
  });
  for (const [value, label] of [
    ["Asia/Shanghai", "北京时间 (CST +8)"],
    ["Asia/Hong_Kong", "香港 (HKT +8)"],
    ["Asia/Taipei", "台北 (CST +8)"],
  ] as const) {
    const option = Object.assign(document.createElement("option"), {
      value,
      textContent: label,
    });
    if (value === "Asia/Shanghai") {
      option.selected = true;
    }
    tzSel.appendChild(option);
  }
  rowTz.append(lblTz, tzSel);

  twoCol.append(rowDate, rowTz);

  const previewHd = Object.assign(document.createElement("div"), {
    className: "ics-section-hd",
    textContent: "节次时间预览",
  });
  const previewList = Object.assign(document.createElement("ul"), {
    className: "ics-preview",
    id: "ics-preview-list",
  });

  panelExport.append(twoCol, previewHd, previewList);

  const panelSchedule = Object.assign(document.createElement("div"), {
    className: "ics-panel",
    id: "ics-tab-schedule",
  });
  panelSchedule.setAttribute("role", "tabpanel");
  panelSchedule.setAttribute("aria-labelledby", "tab-schedule");

  const rowDur = document.createElement("div");
  rowDur.className = "ics-row";
  const lblDur = Object.assign(document.createElement("div"), {
    className: "ics-label",
    textContent: "每节课时长（分钟）",
  });
  const durInp = Object.assign(document.createElement("input"), {
    type: "number",
    id: "ics-duration",
    className: "ics-field",
    min: "1",
    max: "240",
    value: String(cfg.duration),
  });
  const tipDur = Object.assign(document.createElement("div"), {
    className: "ics-tip",
    textContent: "结束时间 = 开始时间 + 时长，课间休息不需要单独填写",
  });
  rowDur.append(lblDur, durInp, tipDur);

  const scheduleHd = Object.assign(document.createElement("div"), {
    className: "ics-section-hd",
    textContent: "各节次开始时间",
  });

  const periodTbl = document.createElement("table");
  periodTbl.className = "ics-tbl";
  periodTbl.innerHTML = `<thead><tr><th>节</th><th>开始</th><th>结束</th><th></th></tr></thead>`;
  const periodTb = document.createElement("tbody");
  periodTb.id = "ics-period-tbody";
  cfg.periods.forEach((period, index) =>
    periodTb.appendChild(makePeriodRow(index, period.start, cfg.duration)),
  );
  periodTbl.appendChild(periodTb);

  const addPeriodBtn = Object.assign(document.createElement("button"), {
    type: "button",
    id: "ics-add-period-btn",
    className: "ics-add-btn",
    textContent: "＋ 添加节次",
  });
  const tipSchedule = Object.assign(document.createElement("div"), {
    className: "ics-tip",
    style: "margin-top:8px",
    textContent: "配置自动保存，刷新页面后仍然有效",
  });
  panelSchedule.append(
    rowDur,
    scheduleHd,
    periodTbl,
    addPeriodBtn,
    tipSchedule,
  );

  const panelAlarm = Object.assign(document.createElement("div"), {
    className: "ics-panel",
    id: "ics-tab-alarm",
  });
  panelAlarm.setAttribute("role", "tabpanel");
  panelAlarm.setAttribute("aria-labelledby", "tab-alarm");

  const alarmTip = Object.assign(document.createElement("div"), {
    className: "ics-tip",
  });
  alarmTip.style.marginBottom = "12px";
  alarmTip.innerHTML =
    `每条规则在每个日历事件中写入一个 <code>VALARM</code>，可叠加多条。<br>` +
    `<b>静默通知</b>：仅弹通知横幅，不响铃（<i>推荐</i>）。<br>` +
    `<b>响铃提醒</b>：播放系统提示音（Apple Calendar / Outlook 支持）。<br>` +
    `全部关闭 = 不写入任何提醒。`;

  const alarmTbl = document.createElement("table");
  alarmTbl.className = "ics-tbl";
  alarmTbl.innerHTML = `<thead><tr><th>开启</th><th>提前时间</th><th>提醒方式</th><th></th></tr></thead>`;
  const alarmTb = document.createElement("tbody");
  alarmTb.id = "ics-alarm-tbody";
  cfg.alarms.forEach((alarm, index) =>
    alarmTb.appendChild(makeAlarmRow(index, alarm)),
  );
  alarmTbl.appendChild(alarmTb);

  const addAlarmBtn = Object.assign(document.createElement("button"), {
    type: "button",
    id: "ics-add-alarm-btn",
    className: "ics-add-btn",
    textContent: "＋ 添加提醒规则",
  });
  panelAlarm.append(alarmTip, alarmTbl, addAlarmBtn);

  panelsEl.append(panelExport, panelSchedule, panelAlarm);

  const footer = document.createElement("div");
  footer.className = "ics-footer";
  const exportBtn = Object.assign(document.createElement("button"), {
    type: "button",
    id: "ics-export-btn",
    textContent: "⬇ 导出 .ics",
  });
  const statusEl = Object.assign(document.createElement("div"), {
    id: "ics-status",
    className: "ics-inf",
  });
  statusEl.setAttribute("aria-live", "polite");
  footer.append(exportBtn, statusEl);

  dialog.append(header, tabBar, panelsEl, footer);
  document.body.appendChild(dialog);

  return {
    backdrop,
    dialog,
    closeBtn,
    tabBar,
    panelsEl,
    startInp,
    tzSel,
    previewList,
    durInp,
    periodTb,
    addPeriodBtn,
    alarmTb,
    addAlarmBtn,
    exportBtn,
    statusEl,
  };
}
