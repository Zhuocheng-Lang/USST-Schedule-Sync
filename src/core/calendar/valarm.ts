import type { Alarm } from "../../types";
import { escapeICSText } from "../../utils";

export function toAlarmTrigger(minutesBeforeStart: number): string {
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

export function buildAlarmLines(courseName: string, alarms: Alarm[]): string[] {
  const lines: string[] = [];

  for (const alarm of alarms.filter((item) => item.enabled)) {
    lines.push("BEGIN:VALARM");
    lines.push(`ACTION:${alarm.action}`);
    lines.push(`TRIGGER;RELATED=START:${toAlarmTrigger(alarm.minutes)}`);
    if (alarm.action === "DISPLAY") {
      lines.push(
        `DESCRIPTION:${escapeICSText(`${courseName} 还有 ${alarm.minutes} 分钟`)}`,
      );
    }
    lines.push("END:VALARM");
  }

  return lines;
}