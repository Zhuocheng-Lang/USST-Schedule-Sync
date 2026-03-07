// ════════════════════════════════════════════════════════════════════════════
//  ui/export-dialog/dom.ts - 导出对话框 DOM 结构构建
// ════════════════════════════════════════════════════════════════════════════

import type { Config } from "../../types";
import { makeAlarmRow, makePeriodRow } from "../builders";
import { cx, styles } from "../css";

function createTableHead(labels: readonly string[]): HTMLTableSectionElement {
  const thead = document.createElement("thead");
  const row = document.createElement("tr");

  for (const label of labels) {
    const th = document.createElement("th");
    th.textContent = label;
    row.appendChild(th);
  }

  thead.appendChild(row);
  return thead;
}

function createAlarmTipContent(): DocumentFragment {
  const fragment = document.createDocumentFragment();
  const code = document.createElement("code");
  code.textContent = "VALARM";
  fragment.append(
    "每条规则在每个日历事件中写入一个 ",
    code,
    "，可叠加多条。",
    document.createElement("br"),
  );

  const display = document.createElement("b");
  display.textContent = "静默通知";
  const recommended = document.createElement("i");
  recommended.textContent = "推荐";
  fragment.append(
    display,
    "：仅弹通知横幅，不响铃（",
    recommended,
    "）。",
    document.createElement("br"),
  );

  const audio = document.createElement("b");
  audio.textContent = "响铃提醒";
  fragment.append(
    audio,
    "：播放系统提示音（Apple Calendar / Outlook 支持）。",
    document.createElement("br"),
  );
  fragment.append("全部关闭 = 不写入任何提醒。");

  return fragment;
}

export interface DialogElements {
  backdrop: HTMLDivElement;
  dialog: HTMLDivElement;
  closeBtn: HTMLButtonElement;
  tabBar: HTMLDivElement;
  panelsEl: HTMLDivElement;
  startInp: HTMLInputElement;
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
  const backdrop = Object.assign(document.createElement("div"), {
    id: "ics-backdrop",
    className: styles.backdrop,
  });
  backdrop.setAttribute("aria-hidden", "true");
  document.body.appendChild(backdrop);

  const dialog = Object.assign(document.createElement("div"), {
    id: "ics-dialog",
    className: styles.dialog,
  });
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-labelledby", "ics-dialog-title");
  dialog.setAttribute("aria-hidden", "true");

  const header = document.createElement("div");
  header.className = styles.header;
  const headerTitle = document.createElement("div");
  headerTitle.className = styles.headerTitle;
  const logo = Object.assign(document.createElement("div"), {
    className: styles.logo,
    textContent: "📅",
  });
  logo.setAttribute("aria-hidden", "true");
  const titleWrap = document.createElement("div");
  const titleText = Object.assign(document.createElement("div"), {
    id: "ics-dialog-title",
    className: styles.titleText,
    textContent: "导出日历",
  });
  const titleSub = Object.assign(document.createElement("div"), {
    className: styles.titleSub,
    textContent: "Export to .ics · iCalendar RFC 5545",
  });
  titleWrap.append(titleText, titleSub);
  headerTitle.append(logo, titleWrap);
  const closeBtn = Object.assign(document.createElement("button"), {
    type: "button",
    className: styles.closeButton,
    title: "关闭 (Esc)",
    textContent: "✕",
  });
  closeBtn.setAttribute("aria-label", "关闭对话框");
  header.append(headerTitle, closeBtn);

  const tabBar = document.createElement("div");
  tabBar.className = styles.tabs;
  tabBar.setAttribute("role", "tablist");
  const tabDefs = [
    { id: "export", label: "导出设置" },
    { id: "schedule", label: "节次时间" },
    { id: "alarm", label: "课前提醒" },
  ] as const;
  for (const { id, label } of tabDefs) {
    const isActive = id === "export";
    const btn = Object.assign(document.createElement("button"), {
      type: "button",
      id: `ics-tab-btn-${id}`,
      className: cx(styles.tabButton, isActive && styles.active),
      textContent: label,
    });
    btn.dataset.tab = id;
    btn.dataset.role = "tab-button";
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", String(isActive));
    btn.setAttribute("aria-controls", `ics-tab-${id}`);
    tabBar.appendChild(btn);
  }

  const panelsEl = Object.assign(document.createElement("div"), {
    className: styles.panels,
  });

  const panelExport = Object.assign(document.createElement("div"), {
    className: cx(styles.panel, styles.active),
    id: "ics-tab-export",
  });
  panelExport.dataset.role = "tab-panel";
  panelExport.setAttribute("role", "tabpanel");
  panelExport.setAttribute("aria-labelledby", "ics-tab-btn-export");

  const twoCol = document.createElement("div");
  twoCol.className = styles.twoColumn;

  const rowDate = document.createElement("div");
  rowDate.className = styles.row;
  const lblDate = document.createElement("div");
  lblDate.className = styles.label;
  lblDate.append("学期第 1 周周一 ");
  const req = Object.assign(document.createElement("span"), {
    className: styles.required,
    textContent: "*",
  });
  req.setAttribute("aria-label", "必填");
  lblDate.appendChild(req);
  const startInp = Object.assign(document.createElement("input"), {
    type: "date",
    id: "ics-semester-start",
    className: styles.field,
    value: defaultDate,
  });
  startInp.setAttribute("aria-required", "true");
  const tipDate = Object.assign(document.createElement("div"), {
    className: styles.tip,
    textContent: "第一教学周的周一日期",
  });
  rowDate.append(lblDate, startInp, tipDate);

  twoCol.append(rowDate);

  const previewHd = Object.assign(document.createElement("div"), {
    className: styles.sectionHeading,
    textContent: "节次时间预览",
  });
  const previewList = Object.assign(document.createElement("ul"), {
    className: styles.preview,
    id: "ics-preview-list",
  });

  panelExport.append(twoCol, previewHd, previewList);

  const panelSchedule = Object.assign(document.createElement("div"), {
    className: styles.panel,
    id: "ics-tab-schedule",
  });
  panelSchedule.dataset.role = "tab-panel";
  panelSchedule.setAttribute("role", "tabpanel");
  panelSchedule.setAttribute("aria-labelledby", "ics-tab-btn-schedule");

  const rowDur = document.createElement("div");
  rowDur.className = styles.row;
  const lblDur = Object.assign(document.createElement("div"), {
    className: styles.label,
    textContent: "每节课时长（分钟）",
  });
  const durInp = Object.assign(document.createElement("input"), {
    type: "number",
    id: "ics-duration",
    className: styles.field,
    min: "1",
    max: "240",
    value: String(cfg.duration),
  });
  const tipDur = Object.assign(document.createElement("div"), {
    className: styles.tip,
    textContent: "结束时间 = 开始时间 + 时长，课间休息不需要单独填写",
  });
  rowDur.append(lblDur, durInp, tipDur);

  const scheduleHd = Object.assign(document.createElement("div"), {
    className: styles.sectionHeading,
    textContent: "各节次开始时间",
  });

  const periodTbl = document.createElement("table");
  periodTbl.className = styles.table;
  periodTbl.appendChild(createTableHead(["节", "开始", "结束", ""]));
  const periodTb = document.createElement("tbody");
  periodTb.id = "ics-period-tbody";
  cfg.periods.forEach((period, index) =>
    periodTb.appendChild(makePeriodRow(index, period.start, cfg.duration)),
  );
  periodTbl.appendChild(periodTb);

  const addPeriodBtn = Object.assign(document.createElement("button"), {
    type: "button",
    id: "ics-add-period-btn",
    className: styles.addButton,
    textContent: "＋ 添加节次",
  });
  const tipSchedule = Object.assign(document.createElement("div"), {
    className: cx(styles.tip, styles.scheduleTip),
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
    className: styles.panel,
    id: "ics-tab-alarm",
  });
  panelAlarm.dataset.role = "tab-panel";
  panelAlarm.setAttribute("role", "tabpanel");
  panelAlarm.setAttribute("aria-labelledby", "ics-tab-btn-alarm");

  const alarmTip = Object.assign(document.createElement("div"), {
    className: cx(styles.tip, styles.alarmTip),
  });
  alarmTip.appendChild(createAlarmTipContent());

  const alarmTbl = document.createElement("table");
  alarmTbl.className = styles.table;
  alarmTbl.appendChild(createTableHead(["开启", "提前时间", "提醒方式", ""]));
  const alarmTb = document.createElement("tbody");
  alarmTb.id = "ics-alarm-tbody";
  cfg.alarms.forEach((alarm, index) =>
    alarmTb.appendChild(makeAlarmRow(index, alarm)),
  );
  alarmTbl.appendChild(alarmTb);

  const addAlarmBtn = Object.assign(document.createElement("button"), {
    type: "button",
    id: "ics-add-alarm-btn",
    className: styles.addButton,
    textContent: "＋ 添加提醒规则",
  });
  panelAlarm.append(alarmTip, alarmTbl, addAlarmBtn);

  panelsEl.append(panelExport, panelSchedule, panelAlarm);

  const footer = document.createElement("div");
  footer.className = styles.footer;
  const exportBtn = Object.assign(document.createElement("button"), {
    type: "button",
    id: "ics-export-btn",
    className: styles.exportButton,
    textContent: "⬇ 导出 .ics",
  });
  const statusEl = Object.assign(document.createElement("div"), {
    id: "ics-status",
    className: cx(styles.status, styles.statusInfo),
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
