// ════════════════════════════════════════════════════════════════════════════
//  utils.ts - 各种实用函数：时间计算、字符串处理、UUID 生成等
// ════════════════════════════════════════════════════════════════════════════

import type { Period, PeriodTime } from "./types";

export function addMinutes(hhmm: string, mins: number): string {
  const [hours, minutes] = hhmm.split(":").map(Number);
  const total = Math.min(
    (hours ?? 0) * 60 + (minutes ?? 0) + mins,
    23 * 60 + 59,
  );
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export function getPeriodTime(
  periods: Period[],
  duration: number,
  no: number,
): PeriodTime | null {
  const period = periods[no - 1];
  return period
    ? { start: period.start, end: addMinutes(period.start, duration) }
    : null;
}

export function toICSDateTime(dateISO: string, hhmm: string): string {
  return dateISO.replace(/-/g, "") + "T" + hhmm.replace(":", "") + "00";
}

export function semesterDate(
  firstMonday: string,
  weekNo: number,
  dow: number,
): string {
  const [year, month, day] = firstMonday.split("-").map(Number);
  const base = new Date(year ?? 0, (month ?? 1) - 1, day ?? 1);
  base.setDate(base.getDate() + (weekNo - 1) * 7 + (dow - 1));
  return [
    base.getFullYear(),
    String(base.getMonth() + 1).padStart(2, "0"),
    String(base.getDate()).padStart(2, "0"),
  ].join("-");
}

export function uuidV4(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const hex = [...bytes].map((value) => value.toString(16).padStart(2, "0"));
  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10).join("")}`;
}

export function parseWeeks(text: string): number[] {
  if (!text) {
    return [];
  }
  const trimmed = text.trim();

  const single = trimmed.match(/^(\d+)周$/);
  if (single) {
    return [Number(single[1])];
  }

  const range = trimmed.match(/(\d+)-(\d+)周[（(]?([单双])?[）)]?/);
  if (!range) {
    return [];
  }

  const [, startWeek, endWeek, parity] = range;
  const weeks: number[] = [];
  for (let week = Number(startWeek); week <= Number(endWeek); week++) {
    if (
      !parity ||
      (parity === "单" && week % 2 === 1) ||
      (parity === "双" && week % 2 === 0)
    ) {
      weeks.push(week);
    }
  }
  return weeks;
}

export function escapeICSText(text: string): string {
  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n|\r|\n/g, "\\n");
}

export function foldLine(line: string): string {
  const encoder = new TextEncoder();
  if (encoder.encode(line).length <= 75) {
    return line;
  }

  const segments: string[] = [];
  let current = "";
  let budget = 75;

  for (const char of line) {
    const encoded = encoder.encode(char).length;
    if (encoder.encode(current).length + encoded > budget) {
      segments.push(current);
      current = " " + char;
      budget = 74;
    } else {
      current += char;
    }
  }
  if (current) {
    segments.push(current);
  }
  return segments.join("\r\n");
}