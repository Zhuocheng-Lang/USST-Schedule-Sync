// ════════════════════════════════════════════════════════════════════════════
//  constants.ts - 定义默认的课程时间段、持续时间和提醒设置
// ════════════════════════════════════════════════════════════════════════════

import type { Alarm, Config, Period } from "./types";

export const DEFAULT_PERIODS: Period[] = [
  { start: "08:00" },
  { start: "08:50" },
  { start: "09:55" },
  { start: "10:45" },
  { start: "11:35" },
  { start: "13:15" },
  { start: "14:05" },
  { start: "15:05" },
  { start: "15:55" },
  { start: "18:00" },
  { start: "18:50" },
  { start: "19:40" },
];

export const DEFAULT_DURATION = 45;

export const DEFAULT_ALARMS: Alarm[] = [
  { enabled: true, minutes: 15, action: "DISPLAY" },
];

export const NS = "ics_";

export function defaultConfig(): Config {
  return {
    duration: DEFAULT_DURATION,
    periods: DEFAULT_PERIODS.map((period) => ({ ...period })),
    alarms: DEFAULT_ALARMS.map((alarm) => ({ ...alarm })),
  };
}
