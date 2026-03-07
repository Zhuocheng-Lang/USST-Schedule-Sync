// ════════════════════════════════════════════════════════════════════════════
//  ui/builders.ts - 构建课程表和提醒规则的 DOM 元素
// ════════════════════════════════════════════════════════════════════════════

import { ALARM_ACTION_LABELS } from "../config";
import type { Alarm } from "../types";
import { addMinutes } from "../utils";
import { cx, styles } from "./css";

export function makePeriodRow(
  index: number,
  start: string,
  duration: number,
): HTMLTableRowElement {
  const tr = document.createElement("tr");
  tr.dataset.idx = String(index);

  const tdNo = Object.assign(document.createElement("td"), {
    className: styles.cellNo,
    textContent: String(index + 1),
  });
  tdNo.dataset.cell = "period-index";

  const input = Object.assign(document.createElement("input"), {
    type: "time",
    className: styles.timeInput,
    step: "60",
    value: start,
  });
  input.dataset.role = "period-start";
  const tdInp = document.createElement("td");
  tdInp.appendChild(input);

  const tdEnd = Object.assign(document.createElement("td"), {
    className: styles.cellEnd,
    textContent: "→ " + addMinutes(start, duration),
  });
  tdEnd.dataset.cell = "period-end";

  const delBtn = Object.assign(document.createElement("button"), {
    type: "button",
    className: styles.deleteButton,
    title: "删除此节",
    textContent: "×",
  });
  delBtn.dataset.action = "delete-period";
  const tdDel = document.createElement("td");
  tdDel.appendChild(delBtn);

  tr.append(tdNo, tdInp, tdEnd, tdDel);
  return tr;
}

export function makeAlarmRow(index: number, alarm: Alarm): HTMLTableRowElement {
  const tr = document.createElement("tr");
  tr.className = cx(styles.alarmRow, !alarm.enabled && styles.alarmOff);
  tr.dataset.alarmIdx = String(index);

  const toggle = document.createElement("label");
  toggle.className = styles.toggle;
  toggle.title = alarm.enabled ? "已启用" : "已禁用";
  toggle.dataset.role = "alarm-toggle";

  const chk = Object.assign(document.createElement("input"), {
    type: "checkbox",
    checked: alarm.enabled,
  });
  chk.dataset.role = "alarm-enabled";
  const track = Object.assign(document.createElement("span"), {
    className: styles.toggleTrack,
  });
  toggle.append(chk, track);

  const tdToggle = Object.assign(document.createElement("td"), {
    className: styles.toggleCell,
  });
  tdToggle.appendChild(toggle);

  const numInp = Object.assign(document.createElement("input"), {
    type: "number",
    className: styles.miniNumber,
    min: "1",
    max: "1440",
    value: String(alarm.minutes),
  });
  numInp.dataset.role = "alarm-minutes";
  const tdMin = document.createElement("td");
  tdMin.append(numInp, " 分钟前");

  const select = Object.assign(document.createElement("select"), {
    className: styles.miniSelect,
  });
  select.dataset.role = "alarm-action";
  for (const [value, label] of Object.entries(ALARM_ACTION_LABELS)) {
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
    className: styles.deleteButton,
    title: "删除此规则",
    textContent: "×",
  });
  delBtn.dataset.action = "delete-alarm";
  const tdDel = document.createElement("td");
  tdDel.appendChild(delBtn);

  tr.append(tdToggle, tdMin, tdSel, tdDel);
  return tr;
}
