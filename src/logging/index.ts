export {
  clearLogEntries,
  configureLogger,
  createTraceId,
  formatLogEntryForDisplay,
  getLastErrorEntry,
  getLogEntries,
  logger,
  resetLoggerForTests,
} from "./logger";
export {
  cloneLoggingConfig,
  createDefaultLoggingConfig,
  DEFAULT_LOG_LEVEL,
  DEFAULT_LOG_MAX_ENTRIES,
  LOG_LEVEL_PRIORITY,
  normalizeLogLevel,
  normalizeLoggingConfig,
} from "./shared";
export type {
  LogEntry,
  LoggerScope,
  LogOptions,
  SerializedError,
} from "./logger";
