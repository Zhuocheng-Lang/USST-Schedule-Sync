// ════════════════════════════════════════════════════════════════════════════
//  utils/weeks.ts - 周次文本解析
// ════════════════════════════════════════════════════════════════════════════

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
