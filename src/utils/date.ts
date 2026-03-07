// ════════════════════════════════════════════════════════════════════════════
//  utils/date.ts - 时间与学期日期计算
// ════════════════════════════════════════════════════════════════════════════

import type { Period, PeriodTime } from "../types";

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
