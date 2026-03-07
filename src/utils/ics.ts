// ════════════════════════════════════════════════════════════════════════════
//  utils/ics.ts - iCalendar 文本格式化工具
// ════════════════════════════════════════════════════════════════════════════

export function toICSDateTime(dateISO: string, hhmm: string): string {
  return dateISO.replace(/-/g, "") + "T" + hhmm.replace(":", "") + "00";
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
