// ════════════════════════════════════════════════════════════════════════════
//  ui/export-dialog/export.ts - 导出动作与校验
// ════════════════════════════════════════════════════════════════════════════

import { saveSemStart } from "../../config";
import { downloadICS, extractCourses, generateICS } from "../../core";
import type { Config } from "../../types";

interface ExportActionOptions {
  semKey: string | null;
  startInp: HTMLInputElement;
  readConfig: () => Config;
  setStatus: (message: string, tone: "ok" | "error" | "info") => void;
}

export function handleExportAction({
  semKey,
  startInp,
  readConfig,
  setStatus,
}: ExportActionOptions): void {
  const semStart = startInp.value;

  if (!semStart) {
    setStatus("⚠️ 请填写学期开始日期", "error");
    startInp.focus();
    return;
  }

  const [year, month, day] = semStart.split("-").map(Number);
  const weekDay = new Date(year ?? 0, (month ?? 1) - 1, day ?? 1).getDay();
  if (weekDay !== 1) {
    const dayNames = ["日", "一", "二", "三", "四", "五", "六"];
    setStatus(
      `⚠️ ${semStart} 是星期${dayNames[weekDay]}，请填写周一的日期`,
      "error",
    );
    startInp.focus();
    return;
  }

  setStatus("解析课表中…", "info");

  requestAnimationFrame(() => {
    try {
      const courses = extractCourses();
      if (!courses.length) {
        setStatus("⚠️ 未找到课程数据，请先点击「查询」加载课表", "error");
        return;
      }

      const currentCfg = readConfig();
      const { ics, eventCount } = generateICS(courses, semStart, currentCfg);
      const filename = `上理工课表_${semStart}.ics`;

      downloadICS(ics, filename);

      if (semKey) {
        saveSemStart(semKey, semStart);
      }

      const activeAlarms = currentCfg.alarms.filter(
        (alarm) => alarm.enabled,
      ).length;
      const alarmSummary = activeAlarms
        ? `${activeAlarms} 条提醒`
        : "无提醒";
      setStatus(
        `✅ ${courses.length} 门课 · ${eventCount} 个事件 · ${alarmSummary}`,
        "ok",
      );
    } catch (error) {
      setStatus(
        `❌ 导出失败：${error instanceof Error ? error.message : String(error)}`,
        "error",
      );
      console.error("[ICS Exporter]", error);
    }
  });
}
