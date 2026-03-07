// ════════════════════════════════════════════════════════════════════════════
//  ui/builders.ts - 构建课程表和提醒规则的 DOM 元素
// ════════════════════════════════════════════════════════════════════════════

import type { Alarm, AlarmAction } from "../types";
import { addMinutes } from "../utils";

export const ACTION_LABELS: Record<AlarmAction, string> = {
  DISPLAY: "静默通知",
  AUDIO: "响铃提醒",
} as const;

export function makePeriodRow(
  index: number,
  start: string,
  duration: number,
): HTMLTableRowElement {
  const tr = document.createElement("tr");
  tr.dataset.idx = String(index);

  const tdNo = Object.assign(document.createElement("td"), {
    className: "tc-no",
    textContent: String(index + 1),
  });

  const input = Object.assign(document.createElement("input"), {
    type: "time",
    className: "ics-time-inp period-start",
    step: "60",
    value: start,
  });
  const tdInp = document.createElement("td");
  tdInp.appendChild(input);

  const tdEnd = Object.assign(document.createElement("td"), {
    className: "tc-end",
    textContent: "→ " + addMinutes(start, duration),
  });

  const delBtn = Object.assign(document.createElement("button"), {
    type: "button",
    className: "ics-del-btn",
    title: "删除此节",
    textContent: "×",
  });
  const tdDel = document.createElement("td");
  tdDel.appendChild(delBtn);

  tr.append(tdNo, tdInp, tdEnd, tdDel);
  return tr;
}

export function makeAlarmRow(index: number, alarm: Alarm): HTMLTableRowElement {
  const tr = document.createElement("tr");
  tr.className = "alarm-row" + (alarm.enabled ? "" : " alarm-off");
  tr.dataset.alarmIdx = String(index);

  const toggle = document.createElement("label");
  toggle.className = "ics-toggle";
  toggle.title = alarm.enabled ? "已启用" : "已禁用";

  const chk = Object.assign(document.createElement("input"), {
    type: "checkbox",
    className: "alarm-enabled",
    checked: alarm.enabled,
  });
  const track = Object.assign(document.createElement("span"), {
    className: "ics-toggle-track",
  });
  toggle.append(chk, track);

  const tdToggle = Object.assign(document.createElement("td"), {
    className: "tc-toggle",
  });
  tdToggle.appendChild(toggle);

  const numInp = Object.assign(document.createElement("input"), {
    type: "number",
    className: "ics-mini-num alarm-minutes",
    min: "1",
    max: "1440",
    value: String(alarm.minutes),
  });
  const tdMin = document.createElement("td");
  tdMin.append(numInp, " 分钟前");

  const select = Object.assign(document.createElement("select"), {
    className: "ics-mini-sel alarm-action",
  });
  for (const [value, label] of Object.entries(ACTION_LABELS)) {
    const option = Object.assign(document.createElement("option"), {
      value,
      textContent: label,
    });
    if (value === alarm.action) {
      option.selected = true;
    }
    select.appendChild(option);
  }
  const tdSel = document.createElement("td");
  tdSel.appendChild(select);

  const delBtn = Object.assign(document.createElement("button"), {
    type: "button",
    className: "ics-del-btn alarm-del-btn",
    title: "删除此规则",
    textContent: "×",
  });
  const tdDel = document.createElement("td");
  tdDel.appendChild(delBtn);

  tr.append(tdToggle, tdMin, tdSel, tdDel);
  return tr;
}
