import { describe, expect, it } from "vitest";

import { defaultConfig } from "../../src/config/defaults";
import { generateICS } from "../../src/core/calendar/ics";
import { toAlarmTrigger } from "../../src/core/calendar/valarm";
import type { Config, Course } from "../../src/types";

const baseCourse: Course = {
  name: "软件工程",
  location: "一教101",
  teacher: "张老师",
  dow: 1,
  pStart: 1,
  pEnd: 2,
  weeks: [1, 2, 3],
  rawWeeks: "1-3周",
};

function makeConfig(overrides?: Partial<Config>): Config {
  return {
    ...defaultConfig(),
    ...overrides,
  };
}

describe("generateICS alarms", () => {
  it("exports display and audio alarms with RFC-compatible triggers", () => {
    const config = makeConfig({
      alarms: [
        { enabled: true, minutes: 90, action: "DISPLAY" },
        { enabled: true, minutes: 1565, action: "AUDIO" },
      ],
    });

    const { ics } = generateICS([baseCourse], "2026-03-02", config);

    expect(ics).toContain("BEGIN:VALARM");
    expect(ics).toContain("ACTION:DISPLAY");
    expect(ics).toContain("TRIGGER;RELATED=START:-PT1H30M");
    expect(ics).toContain("DESCRIPTION:软件工程 还有 90 分钟");
    expect(ics).toContain("ACTION:AUDIO");
    expect(ics).toContain("TRIGGER;RELATED=START:-P1DT2H5M");
    expect(ics).not.toContain("ATTACH;VALUE=URI:Basso");
  });

  it("formats trigger durations across minute boundaries", () => {
    expect(toAlarmTrigger(1)).toBe("-PT1M");
    expect(toAlarmTrigger(59)).toBe("-PT59M");
    expect(toAlarmTrigger(60)).toBe("-PT1H");
    expect(toAlarmTrigger(1440)).toBe("-P1D");
    expect(toAlarmTrigger(1441)).toBe("-P1DT1M");
  });

  it("keeps UID stable across repeated exports of the same course", () => {
    const config = makeConfig({
      alarms: [],
    });

    const first = generateICS([baseCourse], "2026-03-02", config).ics;
    const second = generateICS([baseCourse], "2026-03-02", config).ics;
    const firstUid = first.match(/UID:(.+)\r\n/)?.[1];
    const secondUid = second.match(/UID:(.+)\r\n/)?.[1];

    expect(firstUid).toBeTruthy();
    expect(firstUid).toBe(secondUid);
  });

  it("omits empty optional text fields and ends the file with CRLF", () => {
    const course: Course = {
      ...baseCourse,
      location: "  ",
      teacher: "",
      rawWeeks: "",
    };

    const { ics } = generateICS([course], "2026-03-02", makeConfig({ alarms: [] }));

    expect(ics).not.toMatch(/(?:^|\r\n)LOCATION:/);
    expect(ics).not.toContain("DESCRIPTION:教师：");
    expect(ics).not.toContain("\\n周次：");
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
  });

  it("generates RRULE and sorted EXDATE values for sparse recurring weeks", () => {
    const course: Course = {
      ...baseCourse,
      weeks: [7, 1, 3],
      rawWeeks: "1-7周(单) 第5周停课",
    };

    const { ics } = generateICS([course], "2026-03-02", makeConfig({ alarms: [] }));

    expect(ics).toContain("RRULE:FREQ=WEEKLY;INTERVAL=2;COUNT=4");
    expect(ics).toContain(
      "EXDATE;TZID=Asia/Shanghai:20260330T080000",
    );
  });

  it("uses escaped text and the normalized PRODID header", () => {
    const course: Course = {
      ...baseCourse,
      name: "软件,工程;基础",
      location: "一教\\101",
      teacher: "张老师",
      rawWeeks: "1-3周",
    };

    const { ics } = generateICS([course], "2026-03-02", makeConfig({ alarms: [] }));

    expect(ics).toContain("PRODID:-//Zhuocheng Lang//USST Schedule Sync//CN");
    expect(ics).toContain(String.raw`SUMMARY:软件\,工程\;基础`);
    expect(ics).toContain(String.raw`LOCATION:一教\\101`);
  });

  it("sanitizes malformed extracted fields before writing ICS text", () => {
    const course: Course = {
      ...baseCourse,
      location: "军工路校区三教405",
      teacher: "宁爱兵周次：1-16周",
      rawWeeks: "",
      weeks: Array.from({ length: 16 }, (_, index) => index + 1),
    };

    const { ics } = generateICS([course], "2026-03-02", makeConfig());

    expect(ics).toContain("LOCATION:军工路校区 三教405");
    expect(ics).toContain(
      String.raw`DESCRIPTION:教师：宁爱兵\n周次：1-16周`,
    );
    expect(ics).toContain("BEGIN:VALARM");
  });

  it("omits VALARM blocks when runtime config contains no alarm rows", () => {
    const { ics } = generateICS(
      [baseCourse],
      "2026-03-02",
      makeConfig({ alarms: [] }),
    );

    expect(ics).not.toContain("BEGIN:VALARM");
  });

  it("omits disabled reminders from exported events", () => {
    const { ics } = generateICS(
      [baseCourse],
      "2026-03-02",
      makeConfig({
        alarms: [
          { enabled: false, minutes: 15, action: "DISPLAY" },
          { enabled: false, minutes: 30, action: "AUDIO" },
        ],
      }),
    );

    expect(ics).not.toContain("BEGIN:VALARM");
  });
});