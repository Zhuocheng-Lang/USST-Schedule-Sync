// ════════════════════════════════════════════════════════════════════════════
//  config/storage.ts - Tampermonkey 存储读写与配置缓存
// ════════════════════════════════════════════════════════════════════════════

import {
  DEFAULT_DURATION,
  DEFAULT_LOGGING_CONFIG,
  DEFAULT_PERIODS,
  DEFAULT_REMINDER_PROGRAM,
  STORAGE_NAMESPACE,
} from "./defaults";
import {
  parseStoredDuration,
  parseStoredLoggingConfig,
  parseStoredPeriods,
  parseStoredReminderProgram,
  parseStoredSemesterStart,
  serializeStoredDuration,
  serializeStoredLoggingConfig,
  serializeStoredPeriods,
  serializeStoredReminderProgram,
  serializeStoredSemesterStart,
} from "./codec";
import {
  cloneLoggingConfig,
  clonePeriod,
  cloneReminderProgram,
  normalizeDuration,
  normalizeLoggingConfig,
  normalizePeriods,
  normalizeReminderProgram,
} from "./model";
import { configureLogger, logger } from "../logging";
import type { LoggingConfig, Period, ReminderProgram } from "../types";

const DURATION_STORAGE_KEY = "duration";
const PERIODS_STORAGE_KEY = "periods";
const REMINDER_PROGRAM_STORAGE_KEY = "reminder_program";
const LOGGING_STORAGE_KEY = "logging";
const SEMESTER_START_STORAGE_PREFIX = "semstart_";
const storageLogger = logger.child("config.storage");

function readStoredString(key: string): string | null {
  if (typeof GM_getValue !== "function") {
    return null;
  }

  try {
    const raw = GM_getValue(STORAGE_NAMESPACE + key, null);
    return typeof raw === "string" ? raw : null;
  } catch (error) {
    storageLogger.warn("读取 Tampermonkey 存储失败", {
      context: { storageKey: STORAGE_NAMESPACE + key },
      error,
    });
    return null;
  }
}

function writeStoredRawString(key: string, value: string): void {
  if (typeof GM_setValue !== "function") {
    return;
  }

  try {
    GM_setValue(STORAGE_NAMESPACE + key, value);
  } catch (error) {
    storageLogger.warn("写入 Tampermonkey 存储失败", {
      context: { storageKey: STORAGE_NAMESPACE + key },
      error,
    });
  }
}

function warnInvalidStoredValue(key: string, label: string): void {
  storageLogger.warn(`${label}存储内容无效，已回退到默认值`, {
    context: { storageKey: STORAGE_NAMESPACE + key },
  });
}

export function getDuration(): number {
  const raw = readStoredString(DURATION_STORAGE_KEY);
  const duration = parseStoredDuration(raw);

  if (duration !== null) {
    return duration;
  }

  if (raw !== null) {
    warnInvalidStoredValue(DURATION_STORAGE_KEY, "课时长度");
  }

  return DEFAULT_DURATION;
}

export function saveDuration(value: number): void {
  const normalized = normalizeDuration(value, DEFAULT_DURATION);
  writeStoredRawString(
    DURATION_STORAGE_KEY,
    serializeStoredDuration(normalized),
  );
}

export function getPeriods(): Period[] {
  const raw = readStoredString(PERIODS_STORAGE_KEY);
  const periods = parseStoredPeriods(raw);

  if (periods !== null) {
    return periods;
  }

  if (raw !== null) {
    warnInvalidStoredValue(PERIODS_STORAGE_KEY, "节次时间");
  }

  return DEFAULT_PERIODS.map(clonePeriod);
}

export function savePeriods(periods: Period[]): void {
  const normalized = normalizePeriods(periods, DEFAULT_PERIODS);
  writeStoredRawString(PERIODS_STORAGE_KEY, serializeStoredPeriods(normalized));
}

export function getReminderProgram(): ReminderProgram {
  const raw = readStoredString(REMINDER_PROGRAM_STORAGE_KEY);
  const program = parseStoredReminderProgram(raw);

  if (program !== null) {
    return program;
  }

  if (raw !== null) {
    warnInvalidStoredValue(REMINDER_PROGRAM_STORAGE_KEY, "提醒配置");
  }

  return cloneReminderProgram(DEFAULT_REMINDER_PROGRAM);
}

export function saveReminderProgram(program: ReminderProgram): void {
  const normalized = normalizeReminderProgram(
    program,
    DEFAULT_REMINDER_PROGRAM,
  );
  writeStoredRawString(
    REMINDER_PROGRAM_STORAGE_KEY,
    serializeStoredReminderProgram(normalized),
  );
}

export function getLoggingConfig(): LoggingConfig {
  const raw = readStoredString(LOGGING_STORAGE_KEY);
  const loggingConfig = parseStoredLoggingConfig(raw);

  if (loggingConfig !== null) {
    return loggingConfig;
  }

  if (raw !== null) {
    warnInvalidStoredValue(LOGGING_STORAGE_KEY, "日志配置");
  }

  return cloneLoggingConfig(DEFAULT_LOGGING_CONFIG);
}

export function saveLoggingConfig(config: LoggingConfig): void {
  const normalized = normalizeLoggingConfig(config, DEFAULT_LOGGING_CONFIG);
  configureLogger(normalized);
  writeStoredRawString(
    LOGGING_STORAGE_KEY,
    serializeStoredLoggingConfig(normalized),
  );
}

export function getSemStart(key: string): string | null {
  const raw = readStoredString(SEMESTER_START_STORAGE_PREFIX + key);
  const semStart = parseStoredSemesterStart(raw);

  if (semStart !== null) {
    return semStart;
  }

  if (raw !== null) {
    storageLogger.warn("学期开始日期存储内容无效，已忽略", {
      context: {
        storageKey: STORAGE_NAMESPACE + SEMESTER_START_STORAGE_PREFIX + key,
      },
    });
  }

  return null;
}

export function saveSemStart(key: string, value: string): void {
  writeStoredRawString(
    SEMESTER_START_STORAGE_PREFIX + key,
    serializeStoredSemesterStart(value),
  );
}
