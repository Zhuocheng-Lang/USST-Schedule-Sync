// ════════════════════════════════════════════════════════════════════════════
//  core/extraction/extractor.ts - 从教务系统的 DOM 中提取课程信息
// ════════════════════════════════════════════════════════════════════════════

import type { Course } from "../../types";
import { normalizeText, parseWeeks } from "../../utils";

type ExtractedCourse = Course;

const DETAIL_LABELS = [
  "课程学时组成",
  "课程总学时",
  "教学班名称",
  "教学班组成",
  "授课方式名称",
  "上课地点",
  "考核方式",
  "考试方式",
  "选课备注",
  "授课方式",
  "重修标记",
  "课程性质",
  "课程标记",
  "周学时",
  "总学时",
  "学分",
  "周数",
  "校区",
  "教师",
  "教学班",
].sort((left, right) => right.length - left.length);

const DETAIL_END_LABELS = DETAIL_LABELS.filter(
  (label) => label !== "校区" && label !== "上课地点",
).join("|");

const TRAILING_DETAIL_PATTERN = new RegExp(
  `\\s*(?:${DETAIL_END_LABELS}|周次|周数)\\s*[：:].*$`,
);

export function extractCourses(): Course[] {
  return dedupeCourses(extractFromGrid());
}

function extractFromGrid(): ExtractedCourse[] {
  const courses: ExtractedCourse[] = [];

  for (const grid of Array.from(
    document.querySelectorAll('table[id^="kbgrid_table_"]'),
  )) {
    for (const td of Array.from(grid.querySelectorAll<HTMLElement>("td[id]"))) {
      const match = td.id.match(/^(\d+)-(\d+)$/);
      const dow = Number(match?.[1]);
      if (!dow || dow > 7) {
        continue;
      }

      for (const con of Array.from(td.querySelectorAll(".timetable_con"))) {
        const timeText = getParagraphTextByIcon(con, ".glyphicon-time");
        if (!timeText) {
          continue;
        }

        const periodMatch = timeText.match(/\((\d+)-(\d+)节\)/);
        if (!periodMatch) {
          continue;
        }

        const pStart = Number(periodMatch[1]);
        const pEnd = Number(periodMatch[2]);
        const rawWeeks = timeText.replace(/\(\d+-\d+节\)/, "").trim();
        const weeks = parseWeeks(rawWeeks);
        if (!weeks.length) {
          continue;
        }

        const titleEl = con.querySelector(".title");
        if (!titleEl) {
          continue;
        }
        const name =
          titleEl.textContent
            ?.trim()
            .replace(/[★○◆◇●]/g, "")
            .trim() ?? "";
        if (!name) {
          continue;
        }

        courses.push({
          name,
          location: cleanLocationText(
            getParagraphTextByIcon(con, ".glyphicon-map-marker"),
          ),
          teacher: cleanTeacherText(
            getParagraphTextByIcon(con, ".glyphicon-user"),
            rawWeeks,
          ),
          dow,
          pStart,
          pEnd,
          weeks,
          rawWeeks,
        });
      }
    }
  }

  return courses;
}

function getParagraphTextByIcon(con: Element, selector: string): string {
  const icon = con.querySelector(selector);
  const text = icon?.closest("p")?.textContent ?? "";
  return normalizeText(text);
}

function cleanLocationText(text: string): string {
  return normalizeText(text)
    .replace(/^上课地点\s*[：:]\s*/, "")
    .replace(TRAILING_DETAIL_PATTERN, "")
    .replace(/校区(?=[^\s])/g, "校区 ")
    .trim();
}

function cleanTeacherText(text: string, rawWeeks: string): string {
  let normalized = normalizeText(text)
    .replace(/^教师\s*[：:]\s*/, "")
    .replace(TRAILING_DETAIL_PATTERN, "")
    .trim();

  if (rawWeeks) {
    normalized = normalized
      .replace(new RegExp(`周次\\s*[：:]\\s*${escapeRegExp(rawWeeks)}$`), "")
      .replace(new RegExp(`${escapeRegExp(rawWeeks)}$`), "")
      .trim();
  }

  return normalized;
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getCourseKey(course: Course): string {
  return `${course.name}|${course.dow}|${course.pStart}|${course.pEnd}|${course.rawWeeks}`;
}

function dedupeCourses(courses: ExtractedCourse[]): ExtractedCourse[] {
  const merged = new Map<string, ExtractedCourse>();

  for (const course of courses) {
    const key = getCourseKey(course);
    const existing = merged.get(key);
    if (!existing || isHigherQualityCourse(course, existing)) {
      merged.set(key, course);
    }
  }

  return Array.from(merged.values());
}

function isHigherQualityCourse(
  candidate: ExtractedCourse,
  existing: ExtractedCourse,
): boolean {
  return scoreCourse(candidate) > scoreCourse(existing);
}

function scoreCourse(course: ExtractedCourse): number {
  let score = course.weeks.length;

  if (course.location) {
    score += 3;
  }
  if (course.teacher) {
    score += 3;
  }
  if (course.location.includes("校区")) {
    score += 2;
  }
  if (!course.location.includes("教师")) {
    score += 4;
  }
  if (!course.location.includes("教学班")) {
    score += 2;
  }

  return score;
}
