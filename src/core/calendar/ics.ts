// ════════════════════════════════════════════════════════════════════════════
//  core/calendar/ics.ts - 生成 iCalendar (.ics) 文件的核心逻辑
// ════════════════════════════════════════════════════════════════════════════

import type { Config, Course } from "../../types";
import {
  analyzeWeekPattern,
  escapeICSText,
  foldLine,
  getPeriodTime,
  semesterDate,
  toICSDateTime,
  toICSDateTimeList,
  uuidV4,
} from "../../utils";

const VTIMEZONE_SHANGHAI = [
  "BEGIN:VTIMEZONE",
  "TZID:Asia/Shanghai",
  "X-LIC-LOCATION:Asia/Shanghai",
  "BEGIN:STANDARD",
  "TZOFFSETFROM:+0800",
  "TZOFFSETTO:+0800",
  "TZNAME:CST",
  "DTSTART:19700101T000000",
  "END:STANDARD",
  "END:VTIMEZONE",
].join("\r\n");

export interface ICSResult {
  ics: string;
  eventCount: number;
}

export function generateICS(
  courses: Course[],
  firstMonday: string,
  tzid: string,
  cfg: Config,
): ICSResult {
  const dtstamp =
    new Date().toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";
  const activeAlarms = cfg.alarms.filter((alarm) => alarm.enabled);

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//USST Timetable Exporter v4//ZF//CN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:上理工课表",
    "X-WR-TIMEZONE:" + tzid,
    "X-WR-CALDESC:由 USST 课表导出工具生成",
  ];

  if (tzid === "Asia/Shanghai") {
    for (const line of VTIMEZONE_SHANGHAI.split("\r\n")) {
      lines.push(line);
    }
  }

  let eventCount = 0;

  for (const course of courses) {
    const startPeriod = getPeriodTime(cfg.periods, cfg.duration, course.pStart);
    const endPeriod = getPeriodTime(cfg.periods, cfg.duration, course.pEnd);
    const weekPattern = analyzeWeekPattern(course.weeks);
    if (!startPeriod || !endPeriod || !weekPattern) {
      continue;
    }

    const firstDate = semesterDate(
      firstMonday,
      weekPattern.firstWeek,
      course.dow,
    );
    const descriptionParts = [];
    if (course.teacher) {
      descriptionParts.push(`教师：${course.teacher}`);
    }
    descriptionParts.push(`周次：${course.rawWeeks}`);

    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${uuidV4()}@usst.timetable`);
    lines.push(`DTSTAMP:${dtstamp}`);
    lines.push(
      `DTSTART;TZID=${tzid}:${toICSDateTime(firstDate, startPeriod.start)}`,
    );
    lines.push(`DTEND;TZID=${tzid}:${toICSDateTime(firstDate, endPeriod.end)}`);
    lines.push(`SUMMARY:${escapeICSText(course.name)}`);
    lines.push(`LOCATION:${escapeICSText(course.location)}`);
    lines.push(`DESCRIPTION:${escapeICSText(descriptionParts.join("\n"))}`);

    if (weekPattern.count > 1) {
      lines.push(
        `RRULE:FREQ=WEEKLY;INTERVAL=${weekPattern.interval};COUNT=${weekPattern.count}`,
      );
    }

    if (weekPattern.exdates.length) {
      const exdateList = weekPattern.exdates.map((week) =>
        semesterDate(firstMonday, week, course.dow),
      );
      lines.push(
        `EXDATE;TZID=${tzid}:${toICSDateTimeList(exdateList, startPeriod.start)}`,
      );
    }

    for (const alarm of activeAlarms) {
      lines.push("BEGIN:VALARM");
      lines.push(`ACTION:${alarm.action}`);
      lines.push(`TRIGGER:-PT${alarm.minutes}M`);
      if (alarm.action === "DISPLAY") {
        lines.push(
          `DESCRIPTION:${escapeICSText(`${course.name} 还有 ${alarm.minutes} 分钟`)}`,
        );
      } else {
        lines.push("ATTACH;VALUE=URI:Basso");
      }
      lines.push("END:VALARM");
    }

    lines.push("END:VEVENT");
    eventCount++;
  }

  lines.push("END:VCALENDAR");

  return { ics: lines.map(foldLine).join("\r\n"), eventCount };
}
