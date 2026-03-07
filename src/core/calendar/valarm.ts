import type {
  ReminderDeliveryKind,
  ReminderProgram,
  ReminderRule,
} from "../../types";
import { escapeICSText } from "../../utils";

export interface ReminderEventContext {
  courseName: string;
}

export interface CompiledReminderAlarm {
  ruleId: string;
  action: ReminderDeliveryKind;
  trigger: string;
  description: string | null;
  lines: string[];
}

export interface ReminderCompileResult {
  nodes: CompiledReminderAlarm[];
  lines: string[];
  stats: {
    totalRuleCount: number;
    activeRuleCount: number;
    emittedAlarmCount: number;
  };
}

export function toReminderTrigger(minutesBeforeStart: number): string {
  let remainingMinutes = Math.max(1, Math.floor(minutesBeforeStart));
  const minutesPerDay = 24 * 60;
  const days = Math.floor(remainingMinutes / minutesPerDay);
  remainingMinutes %= minutesPerDay;
  const hours = Math.floor(remainingMinutes / 60);
  const minutes = remainingMinutes % 60;

  let duration = "-P";
  if (days) {
    duration += `${days}D`;
  }
  if (hours || minutes || !days) {
    duration += "T";
    if (hours) {
      duration += `${hours}H`;
    }
    if (minutes || (!days && !hours)) {
      duration += `${minutes}M`;
    }
  }

  return duration;
}

function renderReminderDescription(
  context: ReminderEventContext,
  rule: ReminderRule,
): string | null {
  if (rule.delivery.kind !== "DISPLAY") {
    return null;
  }

  return escapeICSText(
    `${context.courseName} 还有 ${rule.offset.minutesBeforeStart} 分钟`,
  );
}

export function compileReminderRule(
  rule: ReminderRule,
  context: ReminderEventContext,
): CompiledReminderAlarm | null {
  if (!rule.isEnabled) {
    return null;
  }

  const trigger = toReminderTrigger(rule.offset.minutesBeforeStart);
  const description = renderReminderDescription(context, rule);
  const lines = [
    "BEGIN:VALARM",
    `ACTION:${rule.delivery.kind}`,
    `TRIGGER;RELATED=START;VALUE=DURATION:${trigger}`,
  ];

  if (description) {
    lines.push(`DESCRIPTION:${description}`);
  }

  lines.push("END:VALARM");

  return {
    ruleId: rule.id,
    action: rule.delivery.kind,
    trigger,
    description,
    lines,
  };
}

export function compileReminderProgram(
  program: ReminderProgram,
  context: ReminderEventContext,
): ReminderCompileResult {
  const nodes = program.rules
    .map((rule) => compileReminderRule(rule, context))
    .filter((node): node is CompiledReminderAlarm => node !== null);

  return {
    nodes,
    lines: nodes.flatMap((node) => node.lines),
    stats: {
      totalRuleCount: program.rules.length,
      activeRuleCount: program.rules.filter((rule) => rule.isEnabled).length,
      emittedAlarmCount: nodes.length,
    },
  };
}