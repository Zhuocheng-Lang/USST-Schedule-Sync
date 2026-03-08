// ════════════════════════════════════════════════════════════════════════════
//  ui/export-dialog/export.ts - 导出动作与校验
// ════════════════════════════════════════════════════════════════════════════

import { saveSemStart } from "../../config";
import { downloadICS, extractCourses, generateICS } from "../../core";
import { createTraceId, formatLogEntryForDisplay, logger } from "../../logging";
import type { Period, ReminderProgram } from "../../types";

interface ExportActionOptions {
  semKey: string | null;
  startInp: HTMLInputElement;
  readDuration: () => number;
  readPeriods: () => Period[];
  readReminderProgram: () => ReminderProgram;
  setStatus: (
    message: string,
    tone: "ok" | "error" | "info",
    detail?: string,
  ) => void;
}

const exportLogger = logger.child("ui.export");

export function handleExportAction({
  semKey,
  startInp,
  readDuration,
  readPeriods,
  readReminderProgram,
  setStatus,
}: ExportActionOptions): void {
  const semStart = startInp.value;
  const traceId = createTraceId("export");

  if (!semStart) {
    exportLogger.warn("导出被阻止：缺少学期开始日期", { traceId });
    setStatus("⚠️ 请填写学期开始日期", "error");
    startInp.focus();
    return;
  }

  const [year, month, day] = semStart.split("-").map(Number);
  const weekDay = new Date(year ?? 0, (month ?? 1) - 1, day ?? 1).getDay();
  if (weekDay !== 1) {
    const dayNames = ["日", "一", "二", "三", "四", "五", "六"];
    exportLogger.warn("导出被阻止：学期开始日期不是周一", {
      traceId,
      context: { semStart, weekDay },
    });
    setStatus(
      `⚠️ ${semStart} 是星期${dayNames[weekDay]}，请填写周一的日期`,
      "error",
    );
    startInp.focus();
    return;
  }

  exportLogger.info("开始处理导出请求", {
    traceId,
    context: { semStart, hasSemesterKey: Boolean(semKey) },
  });
  setStatus("解析课表中…", "info");

  requestAnimationFrame(() => {
    try {
      const courses = extractCourses({ traceId });
      if (!courses.length) {
        exportLogger.warn("导出中止：未提取到课程", { traceId });
        setStatus("⚠️ 未找到课程数据，请先点击「查询」加载课表", "error");
        return;
      }

      const { ics, eventCount, reminderSummary } = generateICS(
        courses,
        semStart,
        readPeriods(),
        readDuration(),
        readReminderProgram(),
        { traceId },
      );
      const filename = `上理工课表_${semStart}.ics`;

      downloadICS(ics, filename);

      if (semKey) {
        saveSemStart(semKey, semStart);
      }

      const alarmSummary = reminderSummary.activeRuleCount
        ? `${reminderSummary.presetLabel} · 每门课 ${reminderSummary.alarmsPerEvent} 条提醒`
        : "已关闭提醒";
      exportLogger.info("导出成功", {
        traceId,
        context: {
          semStart,
          courseCount: courses.length,
          eventCount,
          emittedAlarmCount: reminderSummary.emittedAlarmCount,
          presetId: reminderSummary.presetId,
        },
      });
      setStatus(
        `✅ ${courses.length} 门课 · ${eventCount} 个事件 · ${alarmSummary}`,
        "ok",
      );
    } catch (error) {
      const entry = exportLogger.error("导出失败", {
        traceId,
        context: { semStart, hasSemesterKey: Boolean(semKey) },
        error,
      });
      setStatus(
        `❌ 导出失败：${error instanceof Error ? error.message : String(error)}`,
        "error",
        formatLogEntryForDisplay(entry),
      );
    }
  });
}
