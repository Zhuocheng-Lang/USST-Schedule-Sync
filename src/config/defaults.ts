// ════════════════════════════════════════════════════════════════════════════
//  config/defaults.ts - 默认配置与存储命名空间
// ════════════════════════════════════════════════════════════════════════════

import type { Config, LoggingConfig, Period, ReminderProgram } from "../types";
import { createDefaultLoggingConfig } from "../logging";
import {
  cloneLoggingConfig,
  clonePeriod,
  cloneReminderProgram,
  createReminderProgramFromPreset,
} from "./model";

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

export const DEFAULT_REMINDER_PROGRAM: ReminderProgram =
  createReminderProgramFromPreset("standard");

export const DEFAULT_LOGGING_CONFIG: LoggingConfig =
  createDefaultLoggingConfig();

export const STORAGE_NAMESPACE = "ics_";

export function defaultConfig(): Config {
  return {
    duration: DEFAULT_DURATION,
    periods: DEFAULT_PERIODS.map(clonePeriod),
    reminderProgram: cloneReminderProgram(DEFAULT_REMINDER_PROGRAM),
    logging: cloneLoggingConfig(DEFAULT_LOGGING_CONFIG),
  };
}
