// ════════════════════════════════════════════════════════════════════════════
//  core/calendar/ics.ts - 生成 iCalendar (.ics) 文件的核心逻辑
// ════════════════════════════════════════════════════════════════════════════

import type { Config, Course } from "../../types";
import {
  analyzeWeekPattern,
  escapeICSText,
  foldLine,
  getPeriodTime,
  normalizeText,
  semesterDate,
  stableUid,
  toICSDateTime,
  toICSDateTimeList,
} from "../../utils";
import { compileReminderProgram } from "./valarm";

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

const TZID = "Asia/Shanghai";
const PRODID = "-//Zhuocheng Lang//USST Schedule Sync//CN";
const WEEK_LABEL_PATTERN = /周次[：:]\s*(.+)$/;

function buildEventUid(
  course: Course,
  firstMonday: string,
  firstDate: string,
): string {
  const identity = [
    firstMonday,
    firstDate,
    String(course.dow),
    String(course.pStart),
    String(course.pEnd),
    course.name.trim(),
    course.location.trim(),
    course.teacher.trim(),
    [...new Set(course.weeks)].sort((left, right) => left - right).join(","),
  ].join("|");

  return stableUid(identity);
}

function normalizeCourseText(course: Course): Pick<Course, "location" | "teacher" | "rawWeeks"> {
  let location = normalizeText(course.location)
    .replace(/校区\s*/g, "校区 ")
    .replace(/\s*(?:教师|周次)[：:].*$/, "")
    .trim();
  let teacher = normalizeText(course.teacher).trim();
  let rawWeeks = normalizeText(course.rawWeeks);

  const weekFromTeacher = teacher.match(WEEK_LABEL_PATTERN);
  if (weekFromTeacher) {
    rawWeeks = rawWeeks || normalizeText(weekFromTeacher[1] ?? "");
    teacher = teacher.replace(WEEK_LABEL_PATTERN, "").trim();
  }

  if (rawWeeks && teacher.endsWith(rawWeeks)) {
    teacher = teacher.slice(0, -rawWeeks.length).trim();
  }

  teacher = teacher.replace(/周次[：:]?$/, "").trim();

  return {
    location,
    teacher,
    rawWeeks,
  };
}

function pushOptionalDescription(lines: string[], teacher: string, rawWeeks: string): void {
  const parts: string[] = [];
  if (teacher) {
    parts.push(`教师：${escapeICSText(teacher)}`);
  }
  if (rawWeeks) {
    parts.push(`周次：${escapeICSText(rawWeeks)}`);
  }

  if (!parts.length) {
    return;
  }

  lines.push(`DESCRIPTION:${parts.join("\\n")}`);
}

function pushOptionalTextLine(lines: string[], name: string, value: string): void {
  const normalized = value.trim();
  if (!normalized) {
    return;
  }

  lines.push(`${name}:${escapeICSText(normalized)}`);
}

export function generateICS(
  courses: Course[],
  firstMonday: string,
  cfg: Config,
): ICSResult {
  const dtstamp =
    new Date().toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:${PRODID}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:上理工课表",
    "X-WR-TIMEZONE:" + TZID,
    "X-WR-CALDESC:由 USST 课表导出工具生成",
  ];

  for (const line of VTIMEZONE_SHANGHAI.split("\r\n")) {
    lines.push(line);
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
    const normalizedCourse = normalizeCourseText(course);

    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${buildEventUid(course, firstMonday, firstDate)}`);
    lines.push(`DTSTAMP:${dtstamp}`);
    lines.push(
      `DTSTART;TZID=${TZID}:${toICSDateTime(firstDate, startPeriod.start)}`,
    );
    lines.push(`DTEND;TZID=${TZID}:${toICSDateTime(firstDate, endPeriod.end)}`);
    pushOptionalTextLine(lines, "SUMMARY", course.name);
    pushOptionalTextLine(lines, "LOCATION", normalizedCourse.location);
    pushOptionalDescription(
      lines,
      normalizedCourse.teacher,
      normalizedCourse.rawWeeks,
    );

    if (weekPattern.count > 1) {
      lines.push(
        `RRULE:FREQ=WEEKLY;INTERVAL=${weekPattern.interval};COUNT=${weekPattern.count}`,
      );
    }

    if (weekPattern.exdates.length) {
      const exdateList = weekPattern.exdates
        .map((week) => semesterDate(firstMonday, week, course.dow))
        .sort();
      lines.push(
        `EXDATE;TZID=${TZID}:${toICSDateTimeList(exdateList, startPeriod.start)}`,
      );
    }

    lines.push(
      ...compileReminderProgram(cfg.reminderProgram, {
        courseName: course.name,
      }).lines,
    );

    lines.push("END:VEVENT");
    eventCount++;
  }

  lines.push("END:VCALENDAR");

  return { ics: lines.map(foldLine).join("\r\n") + "\r\n", eventCount };
}
