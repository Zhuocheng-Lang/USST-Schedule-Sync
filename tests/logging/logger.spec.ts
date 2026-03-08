import { describe, expect, it } from "vitest";

import {
  configureLogger,
  createDefaultLoggingConfig,
  formatLogEntryForDisplay,
  getLogEntries,
  logger,
  resetLoggerForTests,
} from "../../src/logging";

describe("logger", () => {
  it("keeps only the most recent entries within the configured ring buffer", () => {
    resetLoggerForTests();
    configureLogger({
      ...createDefaultLoggingConfig(),
      level: "debug",
      maxEntries: 2,
    });

    logger.info("test.logger", "first");
    logger.info("test.logger", "second");
    logger.info("test.logger", "third");

    expect(getLogEntries().map((entry) => entry.message)).toEqual([
      "second",
      "third",
    ]);
  });

  it("formats error entries into a user-readable detail block", () => {
    resetLoggerForTests();
    configureLogger({
      ...createDefaultLoggingConfig(),
      level: "debug",
    });

    const entry = logger.error("test.logger", "broken", {
      traceId: "trace-123",
      context: { courseCount: 3 },
      error: new Error("Boom"),
    });

    expect(formatLogEntryForDisplay(entry)).toContain("追踪 ID：trace-123");
    expect(formatLogEntryForDisplay(entry)).toContain("消息：broken");
    expect(formatLogEntryForDisplay(entry)).toContain('"courseCount": 3');
    expect(formatLogEntryForDisplay(entry)).toContain("错误：Error: Boom");
  });
});
