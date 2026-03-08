import { stableUid } from "../utils";
import type { LogLevel, LoggingConfig } from "../types";
import {
  cloneLoggingConfig,
  createDefaultLoggingConfig,
  LOG_LEVEL_PRIORITY,
} from "./shared";

type ActiveLogLevel = Exclude<LogLevel, "silent">;

export interface SerializedError {
  name: string;
  message: string;
  stack?: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: ActiveLogLevel;
  module: string;
  message: string;
  traceId?: string;
  context?: Record<string, unknown>;
  error?: SerializedError;
}

export interface LogOptions {
  traceId?: string;
  context?: Record<string, unknown>;
  error?: unknown;
}

export interface LoggerScope {
  debug: (message: string, options?: LogOptions) => LogEntry | null;
  info: (message: string, options?: LogOptions) => LogEntry | null;
  warn: (message: string, options?: LogOptions) => LogEntry | null;
  error: (message: string, options?: LogOptions) => LogEntry | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function cloneContext(
  context: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
  return context ? { ...context } : undefined;
}

function serializeError(error: unknown): SerializedError | undefined {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  if (typeof error === "string") {
    return {
      name: "Error",
      message: error,
    };
  }

  if (isRecord(error)) {
    return {
      name:
        typeof error.name === "string" && error.name.trim()
          ? error.name
          : "Error",
      message:
        typeof error.message === "string" && error.message.trim()
          ? error.message
          : JSON.stringify(error),
      stack: typeof error.stack === "string" ? error.stack : undefined,
    };
  }

  if (error === undefined) {
    return undefined;
  }

  return {
    name: "Error",
    message: String(error),
  };
}

function shouldLog(config: LoggingConfig, level: ActiveLogLevel): boolean {
  return (
    config.level !== "silent" &&
    LOG_LEVEL_PRIORITY[level] <= LOG_LEVEL_PRIORITY[config.level]
  );
}

function consoleMethod(
  level: ActiveLogLevel,
): "debug" | "info" | "warn" | "error" {
  if (level === "error") {
    return "error";
  }
  if (level === "warn") {
    return "warn";
  }
  if (level === "info") {
    return "info";
  }
  return "debug";
}

class RootLogger {
  private config = createDefaultLoggingConfig();
  private entries: LogEntry[] = [];

  setConfig(config: LoggingConfig): void {
    this.config = cloneLoggingConfig(config);
    this.trimEntries();
  }

  getConfig(): LoggingConfig {
    return cloneLoggingConfig(this.config);
  }

  child(
    moduleName: string,
    baseContext?: Record<string, unknown>,
  ): LoggerScope {
    const buildOptions = (options?: LogOptions): LogOptions => ({
      traceId: options?.traceId,
      error: options?.error,
      context: {
        ...(baseContext ?? {}),
        ...(options?.context ?? {}),
      },
    });

    return {
      debug: (message, options) =>
        this.write("debug", moduleName, message, buildOptions(options)),
      info: (message, options) =>
        this.write("info", moduleName, message, buildOptions(options)),
      warn: (message, options) =>
        this.write("warn", moduleName, message, buildOptions(options)),
      error: (message, options) =>
        this.write("error", moduleName, message, buildOptions(options)),
    };
  }

  write(
    level: ActiveLogLevel,
    moduleName: string,
    message: string,
    options: LogOptions = {},
  ): LogEntry | null {
    if (!shouldLog(this.config, level)) {
      return null;
    }

    const entry: LogEntry = {
      id: this.createTraceId("log"),
      timestamp: new Date().toISOString(),
      level,
      module: moduleName,
      message,
      traceId: options.traceId,
      context: cloneContext(options.context),
      error: serializeError(options.error),
    };

    this.entries.push(entry);
    this.trimEntries();
    this.writeConsole(entry);

    return {
      ...entry,
      context: cloneContext(entry.context),
      error: entry.error ? { ...entry.error } : undefined,
    };
  }

  getEntries(): LogEntry[] {
    return this.entries.map((entry) => ({
      ...entry,
      context: cloneContext(entry.context),
      error: entry.error ? { ...entry.error } : undefined,
    }));
  }

  getLastError(): LogEntry | null {
    for (let index = this.entries.length - 1; index >= 0; index -= 1) {
      const entry = this.entries[index];
      if (entry.level === "error") {
        return {
          ...entry,
          context: cloneContext(entry.context),
          error: entry.error ? { ...entry.error } : undefined,
        };
      }
    }

    return null;
  }

  clear(): void {
    this.entries = [];
  }

  createTraceId(scope = "trace"): string {
    return stableUid(
      `${scope}:${Date.now()}:${Math.random()}:${this.entries.length}`,
      `usst.${scope}`,
    ).split("@")[0];
  }

  private trimEntries(): void {
    if (this.entries.length <= this.config.maxEntries) {
      return;
    }

    this.entries.splice(0, this.entries.length - this.config.maxEntries);
  }

  private writeConsole(entry: LogEntry): void {
    const prefix = [
      "[USST Schedule Sync]",
      `[${entry.level}]`,
      `[${entry.module}]`,
      entry.traceId ? `[${entry.traceId}]` : "",
    ].join("");

    const extra: unknown[] = [];
    if (entry.context && Object.keys(entry.context).length) {
      extra.push(entry.context);
    }
    if (entry.error) {
      extra.push(entry.error);
    }

    console[consoleMethod(entry.level)](`${prefix} ${entry.message}`, ...extra);
  }
}

const rootLogger = new RootLogger();

export function configureLogger(config: LoggingConfig): void {
  rootLogger.setConfig(config);
}

export function createTraceId(scope?: string): string {
  return rootLogger.createTraceId(scope);
}

export function getLogEntries(): LogEntry[] {
  return rootLogger.getEntries();
}

export function getLastErrorEntry(): LogEntry | null {
  return rootLogger.getLastError();
}

export function clearLogEntries(): void {
  rootLogger.clear();
}

export function resetLoggerForTests(): void {
  rootLogger.clear();
  rootLogger.setConfig(createDefaultLoggingConfig());
}

export function formatLogEntryForDisplay(entry: LogEntry | null): string {
  if (!entry) {
    return "";
  }

  const lines = [
    `时间：${entry.timestamp}`,
    `级别：${entry.level.toUpperCase()}`,
    `模块：${entry.module}`,
  ];

  if (entry.traceId) {
    lines.push(`追踪 ID：${entry.traceId}`);
  }

  lines.push(`消息：${entry.message}`);

  if (entry.context && Object.keys(entry.context).length) {
    lines.push(`上下文：${JSON.stringify(entry.context, null, 2)}`);
  }

  if (entry.error) {
    lines.push(`错误：${entry.error.name}: ${entry.error.message}`);
    if (entry.error.stack) {
      lines.push(`堆栈：\n${entry.error.stack}`);
    }
  }

  return lines.join("\n");
}

export const logger = {
  child: (moduleName: string, baseContext?: Record<string, unknown>) =>
    rootLogger.child(moduleName, baseContext),
  debug: (moduleName: string, message: string, options?: LogOptions) =>
    rootLogger.write("debug", moduleName, message, options),
  info: (moduleName: string, message: string, options?: LogOptions) =>
    rootLogger.write("info", moduleName, message, options),
  warn: (moduleName: string, message: string, options?: LogOptions) =>
    rootLogger.write("warn", moduleName, message, options),
  error: (moduleName: string, message: string, options?: LogOptions) =>
    rootLogger.write("error", moduleName, message, options),
};
