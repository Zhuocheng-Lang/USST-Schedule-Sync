// ════════════════════════════════════════════════════════════════════════════
//  core/extraction/extractor.ts - 从教务系统的 DOM 中提取课程信息
// ════════════════════════════════════════════════════════════════════════════

import type { Course } from "../../types";
import { parseWeeks } from "../../utils";

export function extractCourses(): Course[] {
  const listTable = document.querySelector("#kblist_table");
  const raw = listTable ? extractFromList(listTable) : extractFromGrid();

  const seen = new Set<string>();
  return raw.filter((course) => {
    const key = `${course.name}|${course.dow}|${course.pStart}|${course.pEnd}|${course.rawWeeks}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function extractFromList(table: Element): Course[] {
  const courses: Course[] = [];

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

function extractFromGrid(): Course[] {
  const courses: Course[] = [];
  const grid = document.querySelector("#kbgrid_table_0");
  if (!grid) {
    return courses;
  }

  for (const td of Array.from(grid.querySelectorAll("td[id]"))) {
    const [dowStr] = (td as HTMLElement).id.split("-");
    const dow = Number(dowStr);
    if (!dow || dow > 7) {
      continue;
    }

    for (const con of Array.from(td.querySelectorAll(".timetable_con"))) {
      const timeEl = con.querySelector(".glyphicon-time");
      if (!timeEl) {
        continue;
      }

      const text = timeEl.parentElement?.textContent?.trim() ?? "";
      const periodMatch = text.match(/\((\d+)-(\d+)节\)/);
      if (!periodMatch) {
        continue;
      }

      const pStart = Number(periodMatch[1]);
      const pEnd = Number(periodMatch[2]);
      const rawWeeks = text.replace(/\(\d+-\d+节\)/, "").trim();
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

      const locEl = con.querySelector(".glyphicon-map-marker");
      const tchrEl = con.querySelector(".glyphicon-user");

      courses.push({
        name,
        location: locEl
          ? (locEl.parentElement?.textContent?.trim().replace(/\s+/g, " ") ??
            "")
          : "",
        teacher: tchrEl
          ? (tchrEl.parentElement?.textContent?.trim() ?? "")
          : "",
        dow,
        pStart,
        pEnd,
        weeks,
        rawWeeks,
      });
    }
  }

  return courses;
}

function parseCourseCon(
  con: Element,
  dow: number,
  pStart: number,
  pEnd: number,
): Course | null {
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

  const pText = Array.from(con.querySelectorAll("p"))
    .map((p) => p.textContent?.replace(/\s+/g, " ").trim() ?? "")
    .join(" ");

  let rawWeeks = "";
  let weeks: number[] = [];

  const labelledMatch = pText.match(
    /周数[：:]\s*([^\s校区上下]+周[（(双单）)]*)/,
  );
  if (labelledMatch) {
    rawWeeks = labelledMatch[1]?.trim() ?? "";
    weeks = parseWeeks(rawWeeks);
  }
  if (!weeks.length) {
    const bareMatch = pText.match(/(\d+-\d+周[（(双单）)]*|\d+周)/);
    if (bareMatch) {
      rawWeeks = bareMatch[1] ?? "";
      weeks = parseWeeks(rawWeeks);
    }
  }
  if (!weeks.length) {
    return null;
  }

  const locMatch = pText.match(/上课地点[：:]\s*(\S+)/);
  const tchrMatch = pText.match(/教师\s*[：:]\s*(\S+(?:[,，]\S+)*)/);

  return {
    name,
    location: locMatch?.[1] ?? "",
    teacher: tchrMatch?.[1] ?? "",
    dow,
    pStart,
    pEnd,
    weeks,
    rawWeeks,
  };
}
