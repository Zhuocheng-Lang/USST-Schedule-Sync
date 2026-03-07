// ════════════════════════════════════════════════════════════════════════════
//  ui/export-dialog/export.ts - 导出动作与校验
// ════════════════════════════════════════════════════════════════════════════

import { saveSemStart } from "../../config";
import { downloadICS, extractCourses, generateICS } from "../../core";
import type { Config } from "../../types";

interface ExportActionOptions {
  semKey: string | null;
  startInp: HTMLInputElement;
  tzSel: HTMLSelectElement;
  readConfig: () => Config;
  setStatus: (message: string, className: string) => void;
}

export function handleExportAction({
  semKey,
  startInp,
  tzSel,
  readConfig,
  setStatus,
}: ExportActionOptions): void {
  const semStart = startInp.value;
  const tzid = tzSel.value;

  if (!semStart) {
    setStatus("⚠️ 请填写学期开始日期", "ics-err");
    startInp.focus();
    return;
  }

  const [year, month, day] = semStart.split("-").map(Number);
  const weekDay = new Date(year ?? 0, (month ?? 1) - 1, day ?? 1).getDay();
  if (weekDay !== 1) {
    const dayNames = "日一二三四五六";
    setStatus(
      `⚠️ ${semStart} 是星期${dayNames[weekDay]}，请填写周一的日期`,
      "ics-err",
    );
    startInp.focus();
    return;
  }

  setStatus("解析课表中…", "ics-inf");

  setTimeout(() => {
    try {
      const courses = extractCourses();
      if (!courses.length) {
        setStatus("⚠️ 未找到课程数据，请先点击「查询」加载课表", "ics-err");
        return;
      }

      const currentCfg = readConfig();
      const { ics, eventCount } = generateICS(
        courses,
        semStart,
        tzid,
        currentCfg,
      );
      const filename = `上理工课表_${semStart}.ics`;

      downloadICS(ics, filename);

      if (semKey) {
        saveSemStart(semKey, semStart);
      }

      const alarmCount = currentCfg.alarms.filter(
        (alarm) => alarm.enabled,
      ).length;
      const alarmSummary = alarmCount ? `${alarmCount} 条提醒` : "无提醒";
      setStatus(
        `✅ ${courses.length} 门课 · ${eventCount} 个事件 · ${alarmSummary}`,
        "ics-ok",
      );
    } catch (error) {
      setStatus(
        `❌ 导出失败：${error instanceof Error ? error.message : String(error)}`,
        "ics-err",
      );
      console.error("[ICS Exporter]", error);
    }
  }, 0);
}
