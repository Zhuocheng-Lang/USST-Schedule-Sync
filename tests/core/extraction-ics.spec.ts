// @vitest-environment jsdom

import fs from "node:fs";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { defaultConfig } from "../../src/config/defaults";
import { generateICS } from "../../src/core/calendar/ics";
import { extractCourses } from "../../src/core/extraction/extractor";

const fixturePath = path.resolve(process.cwd(), "fetch/complete-form.html");
const originalBody = document.body.innerHTML;

beforeEach(() => {
  document.body.innerHTML = fs.readFileSync(fixturePath, "utf8");
});

afterEach(() => {
  document.body.innerHTML = originalBody;
});

describe("complete-form extraction to ICS", () => {
  it("keeps teacher and weeks separated and writes default VALARM blocks", () => {
    const courses = extractCourses();
    const algorithm = courses.find((course) => course.name === "算法导论A(13007630)");

    expect(algorithm).toBeDefined();
    expect(algorithm?.location).toBe("军工路校区 三教405");
    expect(algorithm?.teacher).toBe("宁爱兵(副教授)(主讲)");
    expect(algorithm?.rawWeeks).toBe("1-16周");

    const { ics } = generateICS(courses, "2026-03-02", defaultConfig());

    expect(ics).toContain("BEGIN:VALARM");
    expect(ics).toContain("TRIGGER;RELATED=START:-PT15M");
    expect(ics).toContain(
      String.raw`DESCRIPTION:教师：宁爱兵(副教授)(主讲)\n周次：1-16周`,
    );
  });
});