// ════════════════════════════════════════════════════════════════════════════
//  core/semester.ts - 学期识别与开学日期推算
// ════════════════════════════════════════════════════════════════════════════

import { getSemStart } from "../config";

export function detectSemesterKey(): string | null {
  const xnm = document.getElementById("xnm") as HTMLInputElement | null;
  const xqm = document.getElementById("xqm") as HTMLSelectElement | null;
  if (!xnm?.value || !xqm) {
    return null;
  }
  return `${xnm.value}-${xqm.value === "3" ? "1" : "2"}`;
}

export function guessSemesterStart(key: string | null): string | null {
  if (!key) {
    return null;
  }

  const saved = getSemStart(key);
  if (saved) {
    return saved;
  }

  const [year, quarter] = key.split("-").map(Number);
  return quarter === 1
    ? nthMonday(year ?? 0, 8, 1)
    : nthMonday((year ?? 0) + 1, 1, 3);
}

function nthMonday(targetYear: number, month0: number, nth: number): string {
  const date = new Date(targetYear, month0, 1);
  while (date.getDay() !== 1) {
    date.setDate(date.getDate() + 1);
  }
  date.setDate(date.getDate() + (nth - 1) * 7);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}
