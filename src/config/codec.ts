import {
  DEFAULT_DURATION,
  DEFAULT_LOGGING_CONFIG,
  DEFAULT_PERIODS,
  DEFAULT_REMINDER_PROGRAM,
} from "./defaults";
import {
  normalizeDuration,
  normalizeLoggingConfig,
  normalizePeriods,
  normalizeReminderProgram,
} from "./model";
import type { LoggingConfig, Period, ReminderProgram } from "../types";

const STORED_DURATION_VERSION = 1 as const;
const STORED_PERIODS_VERSION = 1 as const;
const STORED_REMINDER_PROGRAM_VERSION = 1 as const;
const STORED_LOGGING_CONFIG_VERSION = 1 as const;
const STORED_SEMESTER_START_VERSION = 1 as const;

interface StoredDurationV1 {
  version: typeof STORED_DURATION_VERSION;
  data: unknown;
}

interface StoredPeriodsV1 {
  version: typeof STORED_PERIODS_VERSION;
  data: unknown;
}

interface StoredReminderProgramV1 {
  version: typeof STORED_REMINDER_PROGRAM_VERSION;
  data: unknown;
}

interface StoredLoggingConfigV1 {
  version: typeof STORED_LOGGING_CONFIG_VERSION;
  data: unknown;
}

interface StoredSemesterStartV1 {
  version: typeof STORED_SEMESTER_START_VERSION;
  data: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStoredDurationV1(value: unknown): value is StoredDurationV1 {
  return (
    isRecord(value) &&
    value.version === STORED_DURATION_VERSION &&
    "data" in value
  );
}

function isStoredPeriodsV1(value: unknown): value is StoredPeriodsV1 {
  return (
    isRecord(value) &&
    value.version === STORED_PERIODS_VERSION &&
    "data" in value
  );
}

function isStoredReminderProgramV1(
  value: unknown,
): value is StoredReminderProgramV1 {
  return (
    isRecord(value) &&
    value.version === STORED_REMINDER_PROGRAM_VERSION &&
    "data" in value
  );
}

function isStoredLoggingConfigV1(
  value: unknown,
): value is StoredLoggingConfigV1 {
  return (
    isRecord(value) &&
    value.version === STORED_LOGGING_CONFIG_VERSION &&
    "data" in value
  );
}

function isStoredSemesterStartV1(
  value: unknown,
): value is StoredSemesterStartV1 {
  return (
    isRecord(value) &&
    value.version === STORED_SEMESTER_START_VERSION &&
    "data" in value
  );
}

export function parseStoredDuration(raw: string | null): number | null {
  if (raw === null) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isStoredDurationV1(parsed)) {
      return null;
    }

    return normalizeDuration(
      parsed.data as number | string | null | undefined,
      DEFAULT_DURATION,
    );
  } catch {
    return null;
  }
}

export function serializeStoredDuration(value: number): string {
  return JSON.stringify({
    version: STORED_DURATION_VERSION,
    data: value,
  } satisfies StoredDurationV1);
}

export function parseStoredPeriods(raw: string | null): Period[] | null {
  if (raw === null) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isStoredPeriodsV1(parsed)) {
      return null;
    }

    return normalizePeriods(
      parsed.data as Partial<Period>[] | null | undefined,
      DEFAULT_PERIODS,
    );
  } catch {
    return null;
  }
}

export function serializeStoredPeriods(periods: Period[]): string {
  return JSON.stringify({
    version: STORED_PERIODS_VERSION,
    data: periods,
  } satisfies StoredPeriodsV1);
}

export function parseStoredReminderProgram(
  raw: string | null,
): ReminderProgram | null {
  if (raw === null) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isStoredReminderProgramV1(parsed)) {
      return null;
    }

    return normalizeReminderProgram(
      parsed.data as Partial<ReminderProgram> | null | undefined,
      DEFAULT_REMINDER_PROGRAM,
    );
  } catch {
    return null;
  }
}

export function serializeStoredReminderProgram(
  program: ReminderProgram,
): string {
  return JSON.stringify({
    version: STORED_REMINDER_PROGRAM_VERSION,
    data: program,
  } satisfies StoredReminderProgramV1);
}

export function parseStoredLoggingConfig(
  raw: string | null,
): LoggingConfig | null {
  if (raw === null) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isStoredLoggingConfigV1(parsed)) {
      return null;
    }

    return normalizeLoggingConfig(parsed.data, DEFAULT_LOGGING_CONFIG);
  } catch {
    return null;
  }
}

export function serializeStoredLoggingConfig(config: LoggingConfig): string {
  return JSON.stringify({
    version: STORED_LOGGING_CONFIG_VERSION,
    data: config,
  } satisfies StoredLoggingConfigV1);
}

export function parseStoredSemesterStart(raw: string | null): string | null {
  if (raw === null) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isStoredSemesterStartV1(parsed)) {
      return null;
    }

    return typeof parsed.data === "string" ? parsed.data : null;
  } catch {
    return null;
  }
}

export function serializeStoredSemesterStart(value: string): string {
  return JSON.stringify({
    version: STORED_SEMESTER_START_VERSION,
    data: value,
  } satisfies StoredSemesterStartV1);
}
