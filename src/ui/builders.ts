// ════════════════════════════════════════════════════════════════════════════
//  ui/builders.ts - 构建课程表和提醒规则的 DOM 元素
// ════════════════════════════════════════════════════════════════════════════

import {
  REMINDER_DELIVERY_LABELS,
  describeReminderRule,
  formatReminderLeadTime,
} from "../config";
import type { ReminderRule } from "../types";
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

export function makeReminderRuleCard(
  index: number,
  rule: ReminderRule,
): HTMLDivElement {
  const card = document.createElement("div");
  card.className = cx(
    styles.reminderCard,
    !rule.isEnabled && styles.reminderCardOff,
  );
  card.dataset.reminderRuleId = rule.id;
  card.dataset.reminderRuleIndex = String(index);

  const toggle = document.createElement("label");
  toggle.className = styles.toggle;
  toggle.title = rule.isEnabled ? "已启用" : "已禁用";
  toggle.dataset.role = "reminder-rule-toggle";

  const chk = Object.assign(document.createElement("input"), {
    type: "checkbox",
    checked: rule.isEnabled,
  });
  chk.dataset.role = "reminder-rule-enabled";
  const track = Object.assign(document.createElement("span"), {
    className: styles.toggleTrack,
  });
  toggle.append(chk, track);

  const header = Object.assign(document.createElement("div"), {
    className: styles.reminderCardHeader,
  });
  const titleWrap = document.createElement("div");
  titleWrap.className = styles.reminderCardTitleWrap;
  const title = Object.assign(document.createElement("div"), {
    className: styles.reminderCardTitle,
    textContent: `提醒 ${index + 1}`,
  });
  const meta = Object.assign(document.createElement("div"), {
    className: styles.reminderCardMeta,
    textContent: describeReminderRule(rule),
  });
  titleWrap.append(title, meta);

  const headerActions = Object.assign(document.createElement("div"), {
    className: styles.reminderCardActions,
  });

  const delBtn = Object.assign(document.createElement("button"), {
    type: "button",
    className: styles.deleteButton,
    title: "删除此提醒",
    textContent: "×",
  });
  delBtn.dataset.action = "delete-reminder-rule";
  headerActions.append(toggle, delBtn);
  header.append(titleWrap, headerActions);

  const form = Object.assign(document.createElement("div"), {
    className: styles.reminderCardForm,
  });

  const minuteField = Object.assign(document.createElement("label"), {
    className: styles.compactField,
  });
  const minuteLabel = Object.assign(document.createElement("span"), {
    className: styles.compactFieldLabel,
    textContent: "提前时间",
  });
  const minuteControl = Object.assign(document.createElement("div"), {
    className: styles.compactFieldControl,
  });

  const numInp = Object.assign(document.createElement("input"), {
    type: "number",
    className: styles.miniNumber,
    min: "1",
    max: "1440",
    value: String(rule.offset.minutesBeforeStart),
  });
  numInp.dataset.role = "reminder-rule-minutes";
  const minuteSuffix = Object.assign(document.createElement("span"), {
    className: styles.compactFieldSuffix,
    textContent: formatReminderLeadTime(rule.offset.minutesBeforeStart),
  });
  minuteControl.append(numInp, minuteSuffix);
  minuteField.append(minuteLabel, minuteControl);

  const deliveryField = Object.assign(document.createElement("label"), {
    className: styles.compactField,
  });
  const deliveryLabel = Object.assign(document.createElement("span"), {
    className: styles.compactFieldLabel,
    textContent: "提醒方式",
  });

  const select = Object.assign(document.createElement("select"), {
    className: styles.miniSelect,
  });
  select.dataset.role = "reminder-rule-delivery";
  for (const [value, label] of Object.entries(REMINDER_DELIVERY_LABELS)) {
    const option = Object.assign(document.createElement("option"), {
      value,
      textContent: label,
    });
    if (value === rule.delivery.kind) {
      option.selected = true;
    }
    select.appendChild(option);
  }
  deliveryField.append(deliveryLabel, select);

  form.append(minuteField, deliveryField);

  const hint = Object.assign(document.createElement("div"), {
    className: styles.reminderCardHint,
    textContent: rule.isEnabled
      ? `导出后会写入 1 个 VALARM：${describeReminderRule(rule)}`
      : "当前已禁用，不会写入 ICS。",
  });

  card.append(header, form, hint);
  return card;
}
