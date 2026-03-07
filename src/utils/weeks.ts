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

export interface WeekPattern {
  firstWeek: number;
  interval: number;
  count: number;
  exdates: number[];
}

export function analyzeWeekPattern(weeks: number[]): WeekPattern | null {
  if (!weeks.length) {
    return null;
  }

  const sorted = [...new Set(weeks)].sort((left, right) => left - right);
  const firstWeek = sorted[0] ?? 1;
  const lastWeek = sorted[sorted.length - 1] ?? firstWeek;

  if (sorted.length === 1) {
    return {
      firstWeek,
      interval: 1,
      count: 1,
      exdates: [],
    };
  }

  const deltas = sorted.slice(1).map((week, index) => week - sorted[index]!);

  if (deltas.every((delta) => delta === 1)) {
    return {
      firstWeek,
      interval: 1,
      count: sorted.length,
      exdates: [],
    };
  }

  if (deltas.every((delta) => delta === 2)) {
    return {
      firstWeek,
      interval: 2,
      count: sorted.length,
      exdates: [],
    };
  }

  const sameParity = sorted.every((week) => week % 2 === firstWeek % 2);
  const interval = sameParity ? 2 : 1;
  const exdates: number[] = [];
  const weekSet = new Set(sorted);

  for (let week = firstWeek; week <= lastWeek; week += interval) {
    if (!weekSet.has(week)) {
      exdates.push(week);
    }
  }

  return {
    firstWeek,
    interval,
    count: Math.floor((lastWeek - firstWeek) / interval) + 1,
    exdates,
  };
}
