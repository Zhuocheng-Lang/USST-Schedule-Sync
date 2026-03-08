import type { LogLevel, LoggingConfig } from "../types";

export const DEFAULT_LOG_LEVEL: LogLevel = "warn";
export const DEFAULT_LOG_MAX_ENTRIES = 200;

export const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function cloneLoggingConfig(config: LoggingConfig): LoggingConfig {
  return {
    level: config.level,
    maxEntries: config.maxEntries,
  };
}

export function createDefaultLoggingConfig(): LoggingConfig {
  return {
    level: DEFAULT_LOG_LEVEL,
    maxEntries: DEFAULT_LOG_MAX_ENTRIES,
  };
}

export function normalizeLogLevel(
  value: unknown,
  fallback: LogLevel = DEFAULT_LOG_LEVEL,
): LogLevel {
  return value === "silent" ||
    value === "error" ||
    value === "warn" ||
    value === "info" ||
    value === "debug"
    ? value
    : fallback;
}

export function normalizeLoggingConfig(
  value: unknown,
  fallback = createDefaultLoggingConfig(),
): LoggingConfig {
  if (!isRecord(value)) {
    return cloneLoggingConfig(fallback);
  }

  const parsedMaxEntries = Number.parseInt(
    String(value.maxEntries ?? fallback.maxEntries),
    10,
  );
  const maxEntries = Number.isFinite(parsedMaxEntries)
    ? Math.max(20, Math.min(1000, parsedMaxEntries))
    : fallback.maxEntries;

  return {
    level: normalizeLogLevel(value.level, fallback.level),
    maxEntries,
  };
}
