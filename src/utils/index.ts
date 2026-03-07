export { addMinutes, getPeriodTime, semesterDate } from "./date";
export {
  escapeICSText,
  foldLine,
  toICSDateTime,
  toICSDateTimeList,
} from "./ics";
export { stableUid } from "./id";
export { analyzeWeekPattern, parseWeeks } from "./weeks";

export function normalizeText(text: string): string {
  return text.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}
