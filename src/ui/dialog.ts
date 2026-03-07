// ════════════════════════════════════════════════════════════════════════════
//  ui/dialog.ts - 导出设置对话框的构建与事件处理
// ════════════════════════════════════════════════════════════════════════════

import { DEFAULT_DURATION } from "../constants";
import { downloadICS } from "../download";
import { extractCourses } from "../extractor";
import { generateICS } from "../ics";
import { detectSemesterKey, guessSemesterStart } from "../semester";
import { getConfig, saveConfig, saveSemStart } from "../storage";
import type { Alarm, Config } from "../types";
import { addMinutes } from "../utils";
import { makeAlarmRow, makePeriodRow } from "./builders";
import { CSS } from "./css";

export function createUI(): void {
  if (document.getElementById("ics-dialog")) {
    return;
  }

  const cfg = getConfig();
  const semKey = detectSemesterKey();
  const defaultDate =
    guessSemesterStart(semKey) ?? `${new Date().getFullYear()}-02-17`;

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
  panelSchedule.append(rowDur, scheduleHd, periodTbl, addPeriodBtn, tipSchedule);

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

  function openDialog(): void {
    backdrop.classList.add("ics-open");
    dialog.classList.add("ics-open");
    dialog.setAttribute("aria-hidden", "false");
    refreshPreview(readPeriodCfg());
    requestAnimationFrame(() => startInp.focus());
  }

  function closeDialog(): void {
    backdrop.classList.remove("ics-open");
    dialog.classList.remove("ics-open");
    dialog.setAttribute("aria-hidden", "true");
    (document.getElementById("ics-trigger-btn") as HTMLElement | null)?.focus();
  }

  closeBtn.addEventListener("click", closeDialog);
  backdrop.addEventListener("click", closeDialog);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && dialog.classList.contains("ics-open")) {
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
    const btn = (event.target as Element).closest(".ics-tab-btn") as HTMLElement | null;
    if (!btn) {
      return;
    }
    const tabId = btn.dataset.tab;

    for (const tabButton of Array.from(
      tabBar.querySelectorAll<HTMLElement>(".ics-tab-btn"),
    )) {
      const active = tabButton.dataset.tab === tabId;
      tabButton.classList.toggle("active", active);
      tabButton.setAttribute("aria-selected", String(active));
    }
    for (const panel of Array.from(panelsEl.querySelectorAll(".ics-panel"))) {
      panel.classList.toggle("active", panel.id === `ics-tab-${tabId}`);
    }
    if (tabId === "export") {
      refreshPreview(readPeriodCfg());
    }
  });

  function readPeriodCfg(): Pick<Config, "duration" | "periods"> {
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

  function readAlarms(): Alarm[] {
    return Array.from(
      alarmTb.querySelectorAll<HTMLElement>("tr[data-alarm-idx]"),
    ).map((tr) => ({
        enabled: tr.querySelector<HTMLInputElement>(".alarm-enabled")?.checked ?? false,
        minutes:
          Math.max(
            1,
            parseInt(
              tr.querySelector<HTMLInputElement>(".alarm-minutes")?.value ?? "15",
              10,
            ) || 15,
          ),
        action:
          (tr.querySelector<HTMLSelectElement>(".alarm-action")?.value ??
            "DISPLAY") as Alarm["action"],
      }));
  }

  const readCfg = (): Config => ({ ...readPeriodCfg(), alarms: readAlarms() });

  function refreshPeriodTable({ duration }: Pick<Config, "duration">): void {
    periodTb.querySelectorAll<HTMLElement>("tr[data-idx]").forEach((tr, index) => {
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

  function refreshPreview({
    periods,
    duration,
  }: Pick<Config, "periods" | "duration">): void {
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

  function refreshAlarmRows(): void {
    alarmTb.querySelectorAll<HTMLElement>("tr[data-alarm-idx]").forEach((tr, index) => {
      tr.dataset.alarmIdx = String(index);
      const enabled = tr.querySelector<HTMLInputElement>(".alarm-enabled")?.checked ?? false;
      tr.classList.toggle("alarm-off", !enabled);
      const toggleEl = tr.querySelector<HTMLElement>(".ics-toggle");
      if (toggleEl) {
        toggleEl.title = enabled ? "已启用" : "已禁用";
      }
    });
  }

  function onPeriodChange(): void {
    const config = readPeriodCfg();
    refreshPeriodTable(config);
    refreshPreview(config);
    saveConfig(readCfg());
  }

  function onAlarmChange(): void {
    refreshAlarmRows();
    saveConfig(readCfg());
  }

  refreshPreview({ periods: cfg.periods, duration: cfg.duration });

  durInp.addEventListener("input", onPeriodChange);

  periodTb.addEventListener("input", (event) => {
    if ((event.target as Element).classList.contains("period-start")) {
      onPeriodChange();
    }
  });
  periodTb.addEventListener("click", (event) => {
    const btn = (event.target as Element).closest(".ics-del-btn");
    if (!btn) {
      return;
    }
    if (periodTb.querySelectorAll("tr").length <= 1) {
      return;
    }
    btn.closest("tr")?.remove();
    onPeriodChange();
  });
  addPeriodBtn.addEventListener("click", () => {
    const { duration, periods } = readPeriodCfg();
    const lastStart = periods.at(-1)?.start ?? "08:00";
    const nextStart = addMinutes(lastStart, duration + 10);
    periodTb.appendChild(makePeriodRow(periods.length, nextStart, duration));
    onPeriodChange();
  });

  alarmTb.addEventListener("change", (event) => {
    const target = event.target as Element;
    if (
      target.classList.contains("alarm-enabled") ||
      target.classList.contains("alarm-action")
    ) {
      onAlarmChange();
    }
  });
  alarmTb.addEventListener("input", (event) => {
    if ((event.target as Element).classList.contains("alarm-minutes")) {
      onAlarmChange();
    }
  });
  alarmTb.addEventListener("click", (event) => {
    const btn = (event.target as Element).closest(".alarm-del-btn");
    if (!btn) {
      return;
    }
    btn.closest("tr")?.remove();
    onAlarmChange();
  });
  addAlarmBtn.addEventListener("click", () => {
    const index = alarmTb.querySelectorAll("tr").length;
    alarmTb.appendChild(
      makeAlarmRow(index, { enabled: true, minutes: 15, action: "DISPLAY" }),
    );
    onAlarmChange();
  });

  const setStatus = (message: string, className: string): void => {
    statusEl.textContent = message;
    statusEl.className = className;
  };

  exportBtn.addEventListener("click", () => {
    const semStart = startInp.value;
    const tzid = tzSel.value;

    if (!semStart) {
      setStatus("⚠️ 请填写学期开始日期", "ics-err");
      startInp.focus();
      return;
    }

    const [year, month, day] = semStart.split("-").map(Number);
    const weekDay = new Date(year ?? 0, (month ?? 1) - 1, day ?? 1).getDay();
    if (weekDay !== 1) {
      const dayNames = "日一二三四五六";
      setStatus(
        `⚠️ ${semStart} 是星期${dayNames[weekDay]}，请填写周一的日期`,
        "ics-err",
      );
      startInp.focus();
      return;
    }

    setStatus("解析课表中…", "ics-inf");

    setTimeout(() => {
      try {
        const courses = extractCourses();
        if (!courses.length) {
          setStatus("⚠️ 未找到课程数据，请先点击「查询」加载课表", "ics-err");
          return;
        }

        const currentCfg = readCfg();
        const { ics, eventCount } = generateICS(
          courses,
          semStart,
          tzid,
          currentCfg,
        );
        const filename = `上理工课表_${semStart}.ics`;

        downloadICS(ics, filename);

        if (semKey) {
          saveSemStart(semKey, semStart);
        }

        const alarmCount = currentCfg.alarms.filter((alarm) => alarm.enabled).length;
        const alarmSummary = alarmCount ? `${alarmCount} 条提醒` : "无提醒";
        setStatus(
          `✅ ${courses.length} 门课 · ${eventCount} 个事件 · ${alarmSummary}`,
          "ics-ok",
        );
      } catch (error) {
        setStatus(
          `❌ 导出失败：${error instanceof Error ? error.message : String(error)}`,
          "ics-err",
        );
        console.error("[ICS Exporter]", error);
      }
    }, 0);
  });
}