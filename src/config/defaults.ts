// ════════════════════════════════════════════════════════════════════════════
//  config/defaults.ts - 默认配置与存储命名空间
// ════════════════════════════════════════════════════════════════════════════

import type { Alarm, Config, Period } from "../types";
import { cloneAlarm, clonePeriod } from "./model";

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

export const STORAGE_NAMESPACE = "ics_";

export function defaultConfig(): Config {
  return {
    duration: DEFAULT_DURATION,
    periods: DEFAULT_PERIODS.map(clonePeriod),
    alarms: DEFAULT_ALARMS.map(cloneAlarm),
  };
}
