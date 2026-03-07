import { describe, expect, it } from "vitest";

import { escapeICSText, foldLine } from "../../src/utils/ics";

describe("ICS utils", () => {
  it("escapes RFC 5545 TEXT reserved characters", () => {
    expect(escapeICSText("A\\B;C,D\nE")).toBe("A\\\\B\\;C\\,D\\nE");
  });

  it("folds long UTF-8 content lines within 75 octets", () => {
    const line = `SUMMARY:${"数据结构".repeat(10)}`;
    const folded = foldLine(line);

    for (const segment of folded.split("\r\n")) {
      expect(new TextEncoder().encode(segment).length).toBeLessThanOrEqual(75);
    }

    expect(folded).toContain("\r\n ");
  });
});