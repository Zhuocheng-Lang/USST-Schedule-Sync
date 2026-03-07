// ════════════════════════════════════════════════════════════════════════════
//  core/extraction/extractor.ts - 从教务系统的 DOM 中提取课程信息
// ════════════════════════════════════════════════════════════════════════════

import type { Course } from "../../types";
import { parseWeeks } from "../../utils";

type ExtractedCourse = Course & {
  source: "grid" | "list";
};

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

export function extractCourses(): Course[] {
  const gridCourses = dedupeCourses(extractFromGrid());
  if (gridCourses.length) {
    return stripSource(gridCourses);
  }

  const listCourses = dedupeCourses(
    Array.from(document.querySelectorAll('table[id^="kblist_table"]')).flatMap(
      (table) => extractFromList(table),
    ),
  );

  return stripSource(listCourses);
}

function extractFromList(table: Element): ExtractedCourse[] {
  const courses: ExtractedCourse[] = [];

  for (let dow = 1; dow <= 7; dow++) {
    const tbody = table.querySelector(`tbody#xq_${dow}`);
    if (!tbody || (tbody as HTMLElement).style.display === "none") {
      continue;
    }

    let pStart: number | null = null;
    let pEnd: number | null = null;

    for (const tr of Array.from(tbody.querySelectorAll("tr"))) {
      const festEl = tr.querySelector("td .festival");
      if (festEl) {
        const text = festEl.textContent?.trim() ?? "";
        const rangeMatch = text.match(/^(\d+)-(\d+)$/);
        if (rangeMatch) {
          pStart = Number(rangeMatch[1]);
          pEnd = Number(rangeMatch[2]);
        } else {
          const singleMatch = text.match(/^(\d+)$/);
          if (singleMatch) {
            pStart = Number(singleMatch[1]);
            pEnd = pStart;
          }
        }
      }

      if (pStart === null || pEnd === null) {
        continue;
      }

      for (const con of Array.from(tr.querySelectorAll(".timetable_con"))) {
        const course = parseCourseCon(con, dow, pStart, pEnd);
        if (course) {
          courses.push(course);
        }
      }
    }
  }

  return courses;
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
          location: getParagraphTextByIcon(con, ".glyphicon-map-marker"),
          teacher: getParagraphTextByIcon(con, ".glyphicon-user"),
          dow,
          pStart,
          pEnd,
          weeks,
          rawWeeks,
          source: "grid",
        });
      }
    }
  }

  return courses;
}

function parseCourseCon(
  con: Element,
  dow: number,
  pStart: number,
  pEnd: number,
): ExtractedCourse | null {
  const titleEl = con.querySelector(".title");
  if (!titleEl) {
    return null;
  }

  const name =
    titleEl.textContent
      ?.trim()
      .replace(/[★○◆◇●]/g, "")
      .trim() ?? "";
  if (!name) {
    return null;
  }

  const pText = normalizeDetailText(
    Array.from(con.querySelectorAll("p"))
      .map(getSeparatedParagraphText)
      .join(" "),
  );

  let rawWeeks = "";
  let weeks: number[] = [];

  const labelledMatch = pText.match(
    /周数[：:]\s*(\d+(?:-\d+)?周(?:[（(][单双][）)])?)/,
  );
  if (labelledMatch) {
    rawWeeks = labelledMatch[1]?.trim() ?? "";
    weeks = parseWeeks(rawWeeks);
  }
  if (!weeks.length) {
    const bareMatch = pText.match(
      /(?:^|\s)(\d+(?:-\d+)?周(?:[（(][单双][）)])?)(?=\s|$)/,
    );
    if (bareMatch) {
      rawWeeks = bareMatch[1] ?? "";
      weeks = parseWeeks(rawWeeks);
    }
  }
  if (!weeks.length) {
    return null;
  }

  const campusLocMatch = pText.match(
    new RegExp(
      `校区[：:]\\s*([^\\s]+)\\s*上课地点[：:]\\s*(.+?)(?=\\s*(?:${DETAIL_END_LABELS})\\s*[：:]|$)`,
    ),
  );
  const locMatch = pText.match(
    new RegExp(
      `上课地点[：:]\\s*(.+?)(?=\\s*(?:${DETAIL_END_LABELS})\\s*[：:]|$)`,
    ),
  );
  const tchrMatch = pText.match(
    new RegExp(
      `教师\\s*[：:]\\s*(.+?)(?=\\s*(?:${DETAIL_END_LABELS})\\s*[：:]|$)`,
    ),
  );

  const location = campusLocMatch
    ? `${campusLocMatch[1]} ${campusLocMatch[2]}`
    : (locMatch?.[1] ?? "");

  return {
    name,
    location: location.replace(/\s+/g, " ").trim(),
    teacher: (tchrMatch?.[1] ?? "").replace(/\s+/g, " ").trim(),
    dow,
    pStart,
    pEnd,
    weeks,
    rawWeeks,
    source: "list",
  };
}

function getParagraphTextByIcon(con: Element, selector: string): string {
  const icon = con.querySelector(selector);
  const text = icon?.closest("p")?.textContent ?? "";
  return text.replace(/\s+/g, " ").trim();
}

function normalizeDetailText(text: string): string {
  return text
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getSeparatedParagraphText(paragraph: Element): string {
  const parts = Array.from(paragraph.childNodes)
    .map((node) => node.textContent?.replace(/\s+/g, " ").trim() ?? "")
    .filter(Boolean);

  if (!parts.length) {
    return "";
  }

  return parts.join(" ");
}

function getCourseKey(course: Course): string {
  return `${course.name}|${course.dow}|${course.pStart}|${course.pEnd}|${course.rawWeeks}`;
}

function stripSource(courses: ExtractedCourse[]): Course[] {
  return courses.map(({ source: _source, ...course }) => course);
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
