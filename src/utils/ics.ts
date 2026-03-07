// ════════════════════════════════════════════════════════════════════════════
//  utils/ics.ts - iCalendar 文本格式化工具
// ════════════════════════════════════════════════════════════════════════════

export function toICSDateTime(dateISO: string, hhmm: string): string {
  return dateISO.replace(/-/g, "") + "T" + hhmm.replace(":", "") + "00";
}

export function toICSDateTimeList(dateISOList: string[], hhmm: string): string {
  return dateISOList.map((dateISO) => toICSDateTime(dateISO, hhmm)).join(",");
}

export function escapeICSText(text: string): string {
  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n|\r|\n/g, "\\n");
}

const _encoder = new TextEncoder();

export function foldLine(line: string): string {
  if (_encoder.encode(line).length <= 75) {
    return line;
  }

  const segments: string[] = [];
  let current = "";
  let currentBytes = 0;
  let budget = 75;

  for (const char of line) {
    const charBytes = _encoder.encode(char).length;
    if (currentBytes + charBytes > budget) {
      segments.push(current);
      current = " " + char;
      currentBytes = 1 + charBytes;
      budget = 74;
    } else {
      current += char;
      currentBytes += charBytes;
    }
  }
  if (current) {
    segments.push(current);
  }
  return segments.join("\r\n");
}
