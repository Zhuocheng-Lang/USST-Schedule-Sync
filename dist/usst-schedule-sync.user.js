// ==UserScript==
// @name               USST Schedule Sync
// @name:zh-CN         USST 课表同步
// @namespace          https://github.com/Zhuocheng-Lang/USST-Schedule-Sync
// @version            1.0.2
// @author             Zhuocheng Lang
// @description        Export USST timetable to standard .ics calendar files
// @description:zh-CN  将 USST 教务系统课表导出为标准 `.ics` 日历文件
// @license            MIT
// @icon               https://www.usst.edu.cn/_upload/tpl/00/40/64/template64/favicon.ico
// @homepage           https://github.com/Zhuocheng-Lang/USST-Schedule-Sync
// @homepageURL        https://github.com/Zhuocheng-Lang/USST-Schedule-Sync
// @source             https://github.com/Zhuocheng-Lang/USST-Schedule-Sync.git
// @supportURL         https://github.com/Zhuocheng-Lang/USST-Schedule-Sync/issues
// @downloadURL        https://github.com/Zhuocheng-Lang/USST-Schedule-Sync/blob/main/dist/usst-schedule-sync.user.js
// @updateURL          https://github.com/Zhuocheng-Lang/USST-Schedule-Sync/blob/main/dist/usst-schedule-sync.user.js
// @match              *://jwgl.usst.edu.cn/jwglxt/kbcx/xskbcx_cxXskbcxIndex.html*
// @grant              GM_addStyle
// @grant              GM_getValue
// @grant              GM_setValue
// @run-at             document-idle
// @noframes
// ==/UserScript==

(function () {
  'use strict';

  const d=new Set;const o = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):(document.head||document.documentElement).appendChild(document.createElement("style")).append(t);})(e));};

  o(' ._backdrop_a6mgg_1{display:none;position:fixed;inset:0;z-index:99998;background:#00000080}._backdrop_a6mgg_1._dialogOpen_a6mgg_9{display:block;animation:_backdropIn_a6mgg_1 .15s linear forwards}@keyframes _backdropIn_a6mgg_1{0%{opacity:0}to{opacity:1}}._dialog_a6mgg_9{display:none;position:fixed;z-index:99999;top:50%;left:50%;transform:translate(-50%,-50%);width:500px;max-width:calc(100vw - 20px);max-height:calc(100vh - 20px);background:#fff;border:1px solid rgba(0,0,0,.2);border-radius:6px;box-shadow:0 5px 15px #00000080;font-family:Helvetica Neue,Helvetica,PingFang SC,Microsoft YaHei,Arial,sans-serif;font-size:14px;color:#333;flex-direction:column;background-clip:padding-box}._dialog_a6mgg_9._dialogOpen_a6mgg_9{display:flex;animation:_dialogIn_a6mgg_1 .3s ease-out forwards}@keyframes _dialogIn_a6mgg_1{0%{opacity:0;transform:translate(-50%,-50%) scale(.98)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}._header_a6mgg_64{display:flex;align-items:center;justify-content:space-between;padding:15px;border-bottom:1px solid #e5e5e5;flex-shrink:0}._headerTitle_a6mgg_73{display:flex;align-items:center;gap:10px}._logo_a6mgg_79{width:30px;height:30px;border-radius:4px;flex-shrink:0;background:#337ab7;display:flex;align-items:center;justify-content:center;font-size:18px;color:#fff}._titleText_a6mgg_92{font-size:18px;font-weight:500;line-height:1.1}._titleSub_a6mgg_98{font-size:12px;color:#777;margin-top:2px}._closeButton_a6mgg_104{width:24px;height:24px;background:transparent;border:none;font-size:21px;font-weight:700;color:#000;text-shadow:0 1px 0 #fff;opacity:.2;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:opacity .15s}._closeButton_a6mgg_104:hover{opacity:.5}._closeButton_a6mgg_104:focus-visible{outline:none;opacity:.5}._tabs_a6mgg_130{display:flex;margin:15px 15px 0;flex-shrink:0;border-bottom:1px solid #ddd}._tabButton_a6mgg_137{padding:10px 15px;border:1px solid transparent;background:transparent;font-size:14px;color:#337ab7;cursor:pointer;margin-bottom:-1px;border-radius:4px 4px 0 0;line-height:1.42857143}._tabButton_a6mgg_137._active_a6mgg_149{color:#555;background-color:#fff;border-color:#ddd #ddd transparent;border-bottom-color:transparent;cursor:default}._tabButton_a6mgg_137:hover:not(._active_a6mgg_149){background-color:#eee;border-color:#eee #eee #ddd}._tabButton_a6mgg_137:focus-visible{outline:none}._panels_a6mgg_166{overflow-y:auto;overflow-x:hidden;flex:1 1 auto;min-height:0;max-height:54vh;padding:15px}._panel_a6mgg_166{display:none}._panel_a6mgg_166._active_a6mgg_149{display:block}._row_a6mgg_183{margin-bottom:15px}._row_a6mgg_183:last-child{margin-bottom:0}._label_a6mgg_191{display:inline-block;align-items:center;gap:5px;max-width:100%;margin-bottom:5px;font-weight:700;color:#333;font-size:14px}._required_a6mgg_202{color:#a94442}._field_a6mgg_206{display:block;width:100%;height:34px;padding:6px 12px;font-family:inherit;font-size:14px;line-height:1.42857143;color:#555;background-color:#fff;background-image:none;border:1px solid #ccc;border-radius:4px;box-shadow:inset 0 1px 1px #00000013;transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s}._field_a6mgg_206:focus{border-color:#66afe9;outline:0;box-shadow:inset 0 1px 1px #00000013,0 0 8px #66afe999}._tip_a6mgg_233{display:block;font-size:12px;color:#737373;margin-top:5px;margin-bottom:10px}._scheduleTip_a6mgg_241{margin-top:8px}._alarmTip_a6mgg_245{margin-bottom:12px}._twoColumn_a6mgg_249{display:grid;grid-template-columns:1fr 1fr;gap:15px}._sectionHeading_a6mgg_255{font-size:16px;font-weight:500;color:#333;margin:20px 0 10px;padding-bottom:5px;border-bottom:1px solid #eee}._sectionHeading_a6mgg_255:first-child{margin-top:0}._table_a6mgg_268{width:100%;max-width:100%;margin-bottom:20px;background-color:transparent;border-collapse:collapse;border-spacing:0;font-size:14px}._table_a6mgg_268 th,._table_a6mgg_268 td{padding:8px;line-height:1.42857143;vertical-align:middle;border-top:1px solid #ddd}._table_a6mgg_268 th{text-align:left;font-weight:700;color:#333;border-bottom:2px solid #ddd}._table_a6mgg_268 tbody tr:nth-of-type(odd){background-color:#f9f9f9}._cellNo_a6mgg_297{color:#777;width:30px;text-align:center}._cellEnd_a6mgg_303{color:#777;padding-left:5px!important;white-space:nowrap}._toggleCell_a6mgg_309{width:45px;text-align:center}._timeInput_a6mgg_314,._miniNumber_a6mgg_315,._miniSelect_a6mgg_316{display:inline-block;height:30px;padding:5px 10px;font-size:12px;line-height:1.5;color:#555;background-color:#fff;background-image:none;border:1px solid #ccc;border-radius:3px;box-shadow:inset 0 1px 1px #00000013;transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s}._timeInput_a6mgg_314:focus,._miniNumber_a6mgg_315:focus,._miniSelect_a6mgg_316:focus{border-color:#66afe9;outline:0;box-shadow:inset 0 1px 1px #00000013,0 0 8px #66afe999}._timeInput_a6mgg_314{width:80px;text-align:center}._miniNumber_a6mgg_315{width:60px;text-align:center}._miniSelect_a6mgg_316{cursor:pointer}._deleteButton_a6mgg_357{background:none;border:none;color:#a94442;cursor:pointer;font-size:18px;line-height:1;padding:2px 5px;border-radius:3px;opacity:.6}._deleteButton_a6mgg_357:hover{opacity:1}._deleteButton_a6mgg_357:focus-visible{outline:none;opacity:1}._addButton_a6mgg_378{display:inline-block;margin-top:10px;padding:6px 12px;margin-bottom:0;font-size:14px;font-weight:400;line-height:1.42857143;text-align:center;white-space:nowrap;vertical-align:middle;cursor:pointer;background-image:none;border:1px dashed #ccc;border-radius:4px;color:#333;background-color:#fff}._addButton_a6mgg_378:hover{color:#333;background-color:#e6e6e6;border-color:#adadad}._addButton_a6mgg_378:focus-visible{outline:none}._toggle_a6mgg_309{position:relative;display:inline-block;width:32px;height:20px}._toggle_a6mgg_309 input{position:absolute;opacity:0;width:100%;height:100%;margin:0;cursor:pointer}._toggleTrack_a6mgg_423{position:absolute;inset:0;pointer-events:none;background:#ccc;border-radius:10px;transition:background .2s}._toggleTrack_a6mgg_423:before{content:"";position:absolute;width:14px;height:14px;left:3px;bottom:3px;background:#fff;border-radius:50%;transition:transform .2s;box-shadow:0 1px 2px #0003}._toggle_a6mgg_309 input:checked~._toggleTrack_a6mgg_423{background:#337ab7}._toggle_a6mgg_309 input:checked~._toggleTrack_a6mgg_423:before{transform:translate(12px)}._toggle_a6mgg_309 input:focus-visible~._toggleTrack_a6mgg_423{outline:2px solid #66afe9;outline-offset:2px}._alarmRow_a6mgg_458._alarmOff_a6mgg_458 td:not(._toggleCell_a6mgg_309){opacity:.5;pointer-events:none}._preview_a6mgg_463{margin:6px 0 0;padding:0;display:grid;grid-template-columns:repeat(2,1fr)}._preview_a6mgg_463 li{list-style:none;display:flex;gap:6px;align-items:baseline;font-size:14px;line-height:1.5}._previewIndex_a6mgg_479{color:#777;width:16px;text-align:right;flex-shrink:0;font-size:12px}._previewTime_a6mgg_487{color:#333;font-variant-numeric:tabular-nums}._previewEnd_a6mgg_492{color:#777;font-size:12px}._footer_a6mgg_497{padding:15px;border-top:1px solid #e5e5e5;display:flex;align-items:center;gap:15px;flex-shrink:0}._exportButton_a6mgg_506{display:inline-block;padding:6px 12px;margin-bottom:0;font-size:14px;font-weight:400;line-height:1.42857143;text-align:center;white-space:nowrap;vertical-align:middle;cursor:pointer;background-image:none;border:1px solid transparent;border-radius:4px;color:#fff;background-color:#337ab7;border-color:#2e6da4;box-shadow:none}._exportButton_a6mgg_506:hover{color:#fff;background-color:#286090;border-color:#204d74}._exportButton_a6mgg_506:focus-visible{outline:thin dotted;outline:5px auto -webkit-focus-ring-color;outline-offset:-2px}._status_a6mgg_538{flex:1;font-size:14px;min-height:16px;line-height:1.5;word-break:break-word}._statusOk_a6mgg_546{color:#3c763d}._statusError_a6mgg_550{color:#a94442}._statusInfo_a6mgg_554{color:#777} ');

  const DEFAULT_PERIODS = [
    { start: "08:00" },
    { start: "08:50" },
    { start: "09:55" },
    { start: "10:45" },
    { start: "11:35" },
    { start: "13:15" },
    { start: "14:05" },
    { start: "15:05" },
    { start: "15:55" },
    { start: "18:00" },
    { start: "18:50" },
    { start: "19:40" }
  ];
  const DEFAULT_DURATION = 45;
  const DEFAULT_ALARMS = [
    { enabled: true, minutes: 15, action: "DISPLAY" }
  ];
  const STORAGE_NAMESPACE = "ics_";
  function defaultConfig() {
    return {
      duration: DEFAULT_DURATION,
      periods: DEFAULT_PERIODS.map((period) => ({ ...period })),
      alarms: DEFAULT_ALARMS.map((alarm) => ({ ...alarm }))
    };
  }
  function storageGet(key, fallback) {
    try {
      const raw = GM_getValue(STORAGE_NAMESPACE + key, null);
      return raw !== null ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }
  function storageSet(key, value) {
    try {
      GM_setValue(STORAGE_NAMESPACE + key, JSON.stringify(value));
    } catch (error) {
      console.warn("[ICS] storage write failed:", error);
    }
  }
  function getConfig() {
    const saved = storageGet("config", null);
    if (saved && Array.isArray(saved.periods) && saved.periods.length) {
      if (!Array.isArray(saved.alarms)) {
        saved.alarms = DEFAULT_ALARMS.map((alarm) => ({ ...alarm }));
      }
      if (typeof saved.duration !== "number") {
        saved.duration = DEFAULT_DURATION;
      }
      return saved;
    }
    return defaultConfig();
  }
  const saveConfig = (cfg) => storageSet("config", cfg);
  const getSemStart = (key) => storageGet("semstart_" + key, null);
  const saveSemStart = (key, value) => storageSet("semstart_" + key, value);
  function addMinutes(hhmm, mins) {
    const [hours, minutes] = hhmm.split(":").map(Number);
    const total = Math.min(
      (hours ?? 0) * 60 + (minutes ?? 0) + mins,
      23 * 60 + 59
    );
    return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
  }
  function getPeriodTime(periods, duration, no) {
    const period = periods[no - 1];
    return period ? { start: period.start, end: addMinutes(period.start, duration) } : null;
  }
  function semesterDate(firstMonday, weekNo, dow) {
    const [year, month, day] = firstMonday.split("-").map(Number);
    const base = new Date(year ?? 0, (month ?? 1) - 1, day ?? 1);
    base.setDate(base.getDate() + (weekNo - 1) * 7 + (dow - 1));
    return [
      base.getFullYear(),
      String(base.getMonth() + 1).padStart(2, "0"),
      String(base.getDate()).padStart(2, "0")
    ].join("-");
  }
  function toICSDateTime(dateISO, hhmm) {
    return dateISO.replace(/-/g, "") + "T" + hhmm.replace(":", "") + "00";
  }
  function toICSDateTimeList(dateISOList, hhmm) {
    return dateISOList.map((dateISO) => toICSDateTime(dateISO, hhmm)).join(",");
  }
  function escapeICSText(text) {
    return String(text).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r\n|\r|\n/g, "\\n");
  }
  function foldLine(line) {
    const encoder = new TextEncoder();
    if (encoder.encode(line).length <= 75) {
      return line;
    }
    const segments = [];
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
  function uuidV4() {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = bytes[6] & 15 | 64;
    bytes[8] = bytes[8] & 63 | 128;
    const hex = [...bytes].map((value) => value.toString(16).padStart(2, "0"));
    return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10).join("")}`;
  }
  function parseWeeks(text) {
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
    const weeks = [];
    for (let week = Number(startWeek); week <= Number(endWeek); week++) {
      if (!parity || parity === "单" && week % 2 === 1 || parity === "双" && week % 2 === 0) {
        weeks.push(week);
      }
    }
    return weeks;
  }
  function analyzeWeekPattern(weeks) {
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
        exdates: []
      };
    }
    const deltas = sorted.slice(1).map((week, index) => week - sorted[index]);
    if (deltas.every((delta) => delta === 1)) {
      return {
        firstWeek,
        interval: 1,
        count: sorted.length,
        exdates: []
      };
    }
    if (deltas.every((delta) => delta === 2)) {
      return {
        firstWeek,
        interval: 2,
        count: sorted.length,
        exdates: []
      };
    }
    const sameParity = sorted.every((week) => week % 2 === firstWeek % 2);
    const interval = sameParity ? 2 : 1;
    const exdates = [];
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
      exdates
    };
  }
  const VTIMEZONE_SHANGHAI = [
    "BEGIN:VTIMEZONE",
    "TZID:Asia/Shanghai",
    "X-LIC-LOCATION:Asia/Shanghai",
    "BEGIN:STANDARD",
    "TZOFFSETFROM:+0800",
    "TZOFFSETTO:+0800",
    "TZNAME:CST",
    "DTSTART:19700101T000000",
    "END:STANDARD",
    "END:VTIMEZONE"
  ].join("\r\n");
  const TZID = "Asia/Shanghai";
  function generateICS(courses, firstMonday, cfg) {
    const dtstamp = ( new Date()).toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";
    const activeAlarms = cfg.alarms.filter((alarm) => alarm.enabled);
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//USST Timetable Exporter v4//ZF//CN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:上理工课表",
      "X-WR-TIMEZONE:" + TZID,
      "X-WR-CALDESC:由 USST 课表导出工具生成"
    ];
    for (const line of VTIMEZONE_SHANGHAI.split("\r\n")) {
      lines.push(line);
    }
    let eventCount = 0;
    for (const course of courses) {
      const startPeriod = getPeriodTime(cfg.periods, cfg.duration, course.pStart);
      const endPeriod = getPeriodTime(cfg.periods, cfg.duration, course.pEnd);
      const weekPattern = analyzeWeekPattern(course.weeks);
      if (!startPeriod || !endPeriod || !weekPattern) {
        continue;
      }
      const firstDate = semesterDate(
        firstMonday,
        weekPattern.firstWeek,
        course.dow
      );
      const descriptionParts = [];
      if (course.teacher) {
        descriptionParts.push(`教师：${course.teacher}`);
      }
      descriptionParts.push(`周次：${course.rawWeeks}`);
      lines.push("BEGIN:VEVENT");
      lines.push(`UID:${uuidV4()}@usst.timetable`);
      lines.push(`DTSTAMP:${dtstamp}`);
      lines.push(
        `DTSTART;TZID=${TZID}:${toICSDateTime(firstDate, startPeriod.start)}`
      );
      lines.push(`DTEND;TZID=${TZID}:${toICSDateTime(firstDate, endPeriod.end)}`);
      lines.push(`SUMMARY:${escapeICSText(course.name)}`);
      lines.push(`LOCATION:${escapeICSText(course.location)}`);
      lines.push(`DESCRIPTION:${escapeICSText(descriptionParts.join("\n"))}`);
      if (weekPattern.count > 1) {
        lines.push(
          `RRULE:FREQ=WEEKLY;INTERVAL=${weekPattern.interval};COUNT=${weekPattern.count}`
        );
      }
      if (weekPattern.exdates.length) {
        const exdateList = weekPattern.exdates.map(
          (week) => semesterDate(firstMonday, week, course.dow)
        );
        lines.push(
          `EXDATE;TZID=${TZID}:${toICSDateTimeList(exdateList, startPeriod.start)}`
        );
      }
      for (const alarm of activeAlarms) {
        lines.push("BEGIN:VALARM");
        lines.push(`ACTION:${alarm.action}`);
        lines.push(`TRIGGER:-PT${alarm.minutes}M`);
        if (alarm.action === "DISPLAY") {
          lines.push(
            `DESCRIPTION:${escapeICSText(`${course.name} 还有 ${alarm.minutes} 分钟`)}`
          );
        } else {
          lines.push("ATTACH;VALUE=URI:Basso");
        }
        lines.push("END:VALARM");
      }
      lines.push("END:VEVENT");
      eventCount++;
    }
    lines.push("END:VCALENDAR");
    return { ics: lines.map(foldLine).join("\r\n"), eventCount };
  }
  const DETAIL_LABELS = [
    "课程学时组成",
    "课程总学时",
    "教学班名称",
    "教学班组成",
    "授课方式名称",
    "上课地点",
    "考核方式",
    "考试方式",
    "选课备注",
    "授课方式",
    "重修标记",
    "课程性质",
    "课程标记",
    "周学时",
    "总学时",
    "学分",
    "周数",
    "校区",
    "教师",
    "教学班"
  ].sort((left, right) => right.length - left.length);
  const DETAIL_END_LABELS = DETAIL_LABELS.filter(
    (label2) => label2 !== "校区" && label2 !== "上课地点"
  ).join("|");
  function extractCourses() {
    const gridCourses = dedupeCourses(extractFromGrid());
    if (gridCourses.length) {
      return stripSource(gridCourses);
    }
    const listCourses = dedupeCourses(
      Array.from(document.querySelectorAll('table[id^="kblist_table"]')).flatMap(
        (table2) => extractFromList(table2)
      )
    );
    return stripSource(listCourses);
  }
  function extractFromList(table2) {
    const courses = [];
    for (let dow = 1; dow <= 7; dow++) {
      const tbody = table2.querySelector(`tbody#xq_${dow}`);
      if (!tbody || tbody.style.display === "none") {
        continue;
      }
      let pStart = null;
      let pEnd = null;
      for (const tr of Array.from(tbody.querySelectorAll("tr"))) {
        const festEl = tr.querySelector("td .festival");
        if (festEl) {
          const text = festEl.textContent?.trim() ?? "";
          const rangeMatch = text.match(/^(\d+)-(\d+)$/);
          if (rangeMatch) {
            pStart = Number(rangeMatch[1]);
            pEnd = Number(rangeMatch[2]);
          } else {
            const singleMatch = text.match(/^(\d+)$/);
            if (singleMatch) {
              pStart = Number(singleMatch[1]);
              pEnd = pStart;
            }
          }
        }
        if (pStart === null || pEnd === null) {
          continue;
        }
        for (const con of Array.from(tr.querySelectorAll(".timetable_con"))) {
          const course = parseCourseCon(con, dow, pStart, pEnd);
          if (course) {
            courses.push(course);
          }
        }
      }
    }
    return courses;
  }
  function extractFromGrid() {
    const courses = [];
    for (const grid of Array.from(
      document.querySelectorAll('table[id^="kbgrid_table_"]')
    )) {
      for (const td of Array.from(grid.querySelectorAll("td[id]"))) {
        const match = td.id.match(/^(\d+)-(\d+)$/);
        const dow = Number(match?.[1]);
        if (!dow || dow > 7) {
          continue;
        }
        for (const con of Array.from(td.querySelectorAll(".timetable_con"))) {
          const timeText = getParagraphTextByIcon(con, ".glyphicon-time");
          if (!timeText) {
            continue;
          }
          const periodMatch = timeText.match(/\((\d+)-(\d+)节\)/);
          if (!periodMatch) {
            continue;
          }
          const pStart = Number(periodMatch[1]);
          const pEnd = Number(periodMatch[2]);
          const rawWeeks = timeText.replace(/\(\d+-\d+节\)/, "").trim();
          const weeks = parseWeeks(rawWeeks);
          if (!weeks.length) {
            continue;
          }
          const titleEl = con.querySelector(".title");
          if (!titleEl) {
            continue;
          }
          const name = titleEl.textContent?.trim().replace(/[★○◆◇●]/g, "").trim() ?? "";
          if (!name) {
            continue;
          }
          courses.push({
            name,
            location: getParagraphTextByIcon(con, ".glyphicon-map-marker"),
            teacher: getParagraphTextByIcon(con, ".glyphicon-user"),
            dow,
            pStart,
            pEnd,
            weeks,
            rawWeeks,
            source: "grid"
          });
        }
      }
    }
    return courses;
  }
  function parseCourseCon(con, dow, pStart, pEnd) {
    const titleEl = con.querySelector(".title");
    if (!titleEl) {
      return null;
    }
    const name = titleEl.textContent?.trim().replace(/[★○◆◇●]/g, "").trim() ?? "";
    if (!name) {
      return null;
    }
    const pText = normalizeDetailText(
      Array.from(con.querySelectorAll("p")).map(getSeparatedParagraphText).join(" ")
    );
    let rawWeeks = "";
    let weeks = [];
    const labelledMatch = pText.match(
      /周数[：:]\s*(\d+(?:-\d+)?周(?:[（(][单双][）)])?)/
    );
    if (labelledMatch) {
      rawWeeks = labelledMatch[1]?.trim() ?? "";
      weeks = parseWeeks(rawWeeks);
    }
    if (!weeks.length) {
      const bareMatch = pText.match(
        /(?:^|\s)(\d+(?:-\d+)?周(?:[（(][单双][）)])?)(?=\s|$)/
      );
      if (bareMatch) {
        rawWeeks = bareMatch[1] ?? "";
        weeks = parseWeeks(rawWeeks);
      }
    }
    if (!weeks.length) {
      return null;
    }
    const campusLocMatch = pText.match(
      new RegExp(
        `校区[：:]\\s*([^\\s]+)\\s*上课地点[：:]\\s*(.+?)(?=\\s*(?:${DETAIL_END_LABELS})\\s*[：:]|$)`
      )
    );
    const locMatch = pText.match(
      new RegExp(
        `上课地点[：:]\\s*(.+?)(?=\\s*(?:${DETAIL_END_LABELS})\\s*[：:]|$)`
      )
    );
    const tchrMatch = pText.match(
      new RegExp(
        `教师\\s*[：:]\\s*(.+?)(?=\\s*(?:${DETAIL_END_LABELS})\\s*[：:]|$)`
      )
    );
    const location = campusLocMatch ? `${campusLocMatch[1]} ${campusLocMatch[2]}` : locMatch?.[1] ?? "";
    return {
      name,
      location: location.replace(/\s+/g, " ").trim(),
      teacher: (tchrMatch?.[1] ?? "").replace(/\s+/g, " ").trim(),
      dow,
      pStart,
      pEnd,
      weeks,
      rawWeeks,
      source: "list"
    };
  }
  function getParagraphTextByIcon(con, selector) {
    const icon = con.querySelector(selector);
    const text = icon?.closest("p")?.textContent ?? "";
    return text.replace(/\s+/g, " ").trim();
  }
  function normalizeDetailText(text) {
    return text.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
  }
  function getSeparatedParagraphText(paragraph) {
    const parts = Array.from(paragraph.childNodes).map((node) => node.textContent?.replace(/\s+/g, " ").trim() ?? "").filter(Boolean);
    if (!parts.length) {
      return "";
    }
    return parts.join(" ");
  }
  function getCourseKey(course) {
    return `${course.name}|${course.dow}|${course.pStart}|${course.pEnd}|${course.rawWeeks}`;
  }
  function stripSource(courses) {
    return courses.map(({ source: _source, ...course }) => course);
  }
  function dedupeCourses(courses) {
    const merged = new Map();
    for (const course of courses) {
      const key = getCourseKey(course);
      const existing = merged.get(key);
      if (!existing || isHigherQualityCourse(course, existing)) {
        merged.set(key, course);
      }
    }
    return Array.from(merged.values());
  }
  function isHigherQualityCourse(candidate, existing) {
    return scoreCourse(candidate) > scoreCourse(existing);
  }
  function scoreCourse(course) {
    let score = course.weeks.length;
    if (course.location) {
      score += 3;
    }
    if (course.teacher) {
      score += 3;
    }
    if (course.location.includes("校区")) {
      score += 2;
    }
    if (!course.location.includes("教师")) {
      score += 4;
    }
    if (!course.location.includes("教学班")) {
      score += 2;
    }
    return score;
  }
  function downloadICS(content, filename) {
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    try {
      const anchor = Object.assign(document.createElement("a"), {
        href: url,
        download: filename
      });
      anchor.style.display = "none";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  function detectSemesterKey() {
    const xnm = document.getElementById("xnm");
    const xqm = document.getElementById("xqm");
    if (!xnm?.value || !xqm) {
      return null;
    }
    return `${xnm.value}-${xqm.value === "3" ? "1" : "2"}`;
  }
  function guessSemesterStart(key) {
    if (!key) {
      return null;
    }
    const saved = getSemStart(key);
    if (saved) {
      return saved;
    }
    const [year, quarter] = key.split("-").map(Number);
    return quarter === 1 ? nthMonday(year ?? 0, 8, 1) : nthMonday((year ?? 0) + 1, 1, 3);
  }
  function nthMonday(targetYear, month0, nth) {
    const date = new Date(targetYear, month0, 1);
    while (date.getDay() !== 1) {
      date.setDate(date.getDate() + 1);
    }
    date.setDate(date.getDate() + (nth - 1) * 7);
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0")
    ].join("-");
  }
  const backdrop = "_backdrop_a6mgg_1";
  const dialogOpen = "_dialogOpen_a6mgg_9";
  const dialog = "_dialog_a6mgg_9";
  const header = "_header_a6mgg_64";
  const headerTitle = "_headerTitle_a6mgg_73";
  const logo = "_logo_a6mgg_79";
  const titleText = "_titleText_a6mgg_92";
  const titleSub = "_titleSub_a6mgg_98";
  const closeButton = "_closeButton_a6mgg_104";
  const tabs = "_tabs_a6mgg_130";
  const tabButton = "_tabButton_a6mgg_137";
  const active = "_active_a6mgg_149";
  const panels = "_panels_a6mgg_166";
  const panel = "_panel_a6mgg_166";
  const row = "_row_a6mgg_183";
  const label = "_label_a6mgg_191";
  const required = "_required_a6mgg_202";
  const field = "_field_a6mgg_206";
  const tip = "_tip_a6mgg_233";
  const scheduleTip = "_scheduleTip_a6mgg_241";
  const alarmTip = "_alarmTip_a6mgg_245";
  const twoColumn = "_twoColumn_a6mgg_249";
  const sectionHeading = "_sectionHeading_a6mgg_255";
  const table = "_table_a6mgg_268";
  const cellNo = "_cellNo_a6mgg_297";
  const cellEnd = "_cellEnd_a6mgg_303";
  const toggleCell = "_toggleCell_a6mgg_309";
  const timeInput = "_timeInput_a6mgg_314";
  const miniNumber = "_miniNumber_a6mgg_315";
  const miniSelect = "_miniSelect_a6mgg_316";
  const deleteButton = "_deleteButton_a6mgg_357";
  const addButton = "_addButton_a6mgg_378";
  const toggle = "_toggle_a6mgg_309";
  const toggleTrack = "_toggleTrack_a6mgg_423";
  const alarmRow = "_alarmRow_a6mgg_458";
  const alarmOff = "_alarmOff_a6mgg_458";
  const preview = "_preview_a6mgg_463";
  const previewIndex = "_previewIndex_a6mgg_479";
  const previewTime = "_previewTime_a6mgg_487";
  const previewEnd = "_previewEnd_a6mgg_492";
  const footer = "_footer_a6mgg_497";
  const exportButton = "_exportButton_a6mgg_506";
  const status = "_status_a6mgg_538";
  const statusOk = "_statusOk_a6mgg_546";
  const statusError = "_statusError_a6mgg_550";
  const statusInfo = "_statusInfo_a6mgg_554";
  const styles = {
    backdrop,
    dialogOpen,
    dialog,
    header,
    headerTitle,
    logo,
    titleText,
    titleSub,
    closeButton,
    tabs,
    tabButton,
    active,
    panels,
    panel,
    row,
    label,
    required,
    field,
    tip,
    scheduleTip,
    alarmTip,
    twoColumn,
    sectionHeading,
    table,
    cellNo,
    cellEnd,
    toggleCell,
    timeInput,
    miniNumber,
    miniSelect,
    deleteButton,
    addButton,
    toggle,
    toggleTrack,
    alarmRow,
    alarmOff,
    preview,
    previewIndex,
    previewTime,
    previewEnd,
    footer,
    exportButton,
    status,
    statusOk,
    statusError,
    statusInfo
  };
  function cx(...tokens) {
    return tokens.filter((token) => Boolean(token)).join(" ");
  }
  const ACTION_LABELS = {
    DISPLAY: "静默通知",
    AUDIO: "响铃提醒"
  };
  function makePeriodRow(index, start, duration) {
    const tr = document.createElement("tr");
    tr.dataset.idx = String(index);
    const tdNo = Object.assign(document.createElement("td"), {
      className: styles.cellNo,
      textContent: String(index + 1)
    });
    tdNo.dataset.cell = "period-index";
    const input = Object.assign(document.createElement("input"), {
      type: "time",
      className: styles.timeInput,
      step: "60",
      value: start
    });
    input.dataset.role = "period-start";
    const tdInp = document.createElement("td");
    tdInp.appendChild(input);
    const tdEnd = Object.assign(document.createElement("td"), {
      className: styles.cellEnd,
      textContent: "→ " + addMinutes(start, duration)
    });
    tdEnd.dataset.cell = "period-end";
    const delBtn = Object.assign(document.createElement("button"), {
      type: "button",
      className: styles.deleteButton,
      title: "删除此节",
      textContent: "×"
    });
    delBtn.dataset.action = "delete-period";
    const tdDel = document.createElement("td");
    tdDel.appendChild(delBtn);
    tr.append(tdNo, tdInp, tdEnd, tdDel);
    return tr;
  }
  function makeAlarmRow(index, alarm) {
    const tr = document.createElement("tr");
    tr.className = cx(styles.alarmRow, !alarm.enabled && styles.alarmOff);
    tr.dataset.alarmIdx = String(index);
    const toggle2 = document.createElement("label");
    toggle2.className = styles.toggle;
    toggle2.title = alarm.enabled ? "已启用" : "已禁用";
    toggle2.dataset.role = "alarm-toggle";
    const chk = Object.assign(document.createElement("input"), {
      type: "checkbox",
      checked: alarm.enabled
    });
    chk.dataset.role = "alarm-enabled";
    const track = Object.assign(document.createElement("span"), {
      className: styles.toggleTrack
    });
    toggle2.append(chk, track);
    const tdToggle = Object.assign(document.createElement("td"), {
      className: styles.toggleCell
    });
    tdToggle.appendChild(toggle2);
    const numInp = Object.assign(document.createElement("input"), {
      type: "number",
      className: styles.miniNumber,
      min: "1",
      max: "1440",
      value: String(alarm.minutes)
    });
    numInp.dataset.role = "alarm-minutes";
    const tdMin = document.createElement("td");
    tdMin.append(numInp, " 分钟前");
    const select = Object.assign(document.createElement("select"), {
      className: styles.miniSelect
    });
    select.dataset.role = "alarm-action";
    for (const [value, label2] of Object.entries(ACTION_LABELS)) {
      const option = Object.assign(document.createElement("option"), {
        value,
        textContent: label2
      });
      if (value === alarm.action) {
        option.selected = true;
      }
      select.appendChild(option);
    }
    const tdSel = document.createElement("td");
    tdSel.appendChild(select);
    const delBtn = Object.assign(document.createElement("button"), {
      type: "button",
      className: styles.deleteButton,
      title: "删除此规则",
      textContent: "×"
    });
    delBtn.dataset.action = "delete-alarm";
    const tdDel = document.createElement("td");
    tdDel.appendChild(delBtn);
    tr.append(tdToggle, tdMin, tdSel, tdDel);
    return tr;
  }
  function createTableHead(labels) {
    const thead = document.createElement("thead");
    const row2 = document.createElement("tr");
    for (const label2 of labels) {
      const th = document.createElement("th");
      th.textContent = label2;
      row2.appendChild(th);
    }
    thead.appendChild(row2);
    return thead;
  }
  function createAlarmTipContent() {
    const fragment = document.createDocumentFragment();
    const code = document.createElement("code");
    code.textContent = "VALARM";
    fragment.append(
      "每条规则在每个日历事件中写入一个 ",
      code,
      "，可叠加多条。",
      document.createElement("br")
    );
    const display = document.createElement("b");
    display.textContent = "静默通知";
    const recommended = document.createElement("i");
    recommended.textContent = "推荐";
    fragment.append(
      display,
      "：仅弹通知横幅，不响铃（",
      recommended,
      "）。",
      document.createElement("br")
    );
    const audio = document.createElement("b");
    audio.textContent = "响铃提醒";
    fragment.append(
      audio,
      "：播放系统提示音（Apple Calendar / Outlook 支持）。",
      document.createElement("br")
    );
    fragment.append("全部关闭 = 不写入任何提醒。");
    return fragment;
  }
  function createDialogElements(cfg, defaultDate) {
    const backdrop2 = Object.assign(document.createElement("div"), {
      id: "ics-backdrop",
      className: styles.backdrop
    });
    backdrop2.setAttribute("aria-hidden", "true");
    document.body.appendChild(backdrop2);
    const dialog2 = Object.assign(document.createElement("div"), {
      id: "ics-dialog",
      className: styles.dialog
    });
    dialog2.setAttribute("role", "dialog");
    dialog2.setAttribute("aria-modal", "true");
    dialog2.setAttribute("aria-labelledby", "ics-dialog-title");
    dialog2.setAttribute("aria-hidden", "true");
    const header2 = document.createElement("div");
    header2.className = styles.header;
    const headerTitle2 = document.createElement("div");
    headerTitle2.className = styles.headerTitle;
    const logo2 = Object.assign(document.createElement("div"), {
      className: styles.logo,
      textContent: "📅"
    });
    logo2.setAttribute("aria-hidden", "true");
    const titleWrap = document.createElement("div");
    const titleText2 = Object.assign(document.createElement("div"), {
      id: "ics-dialog-title",
      className: styles.titleText,
      textContent: "导出日历"
    });
    const titleSub2 = Object.assign(document.createElement("div"), {
      className: styles.titleSub,
      textContent: "Export to .ics · iCalendar RFC 5545"
    });
    titleWrap.append(titleText2, titleSub2);
    headerTitle2.append(logo2, titleWrap);
    const closeBtn = Object.assign(document.createElement("button"), {
      type: "button",
      className: styles.closeButton,
      title: "关闭 (Esc)",
      textContent: "✕"
    });
    closeBtn.setAttribute("aria-label", "关闭对话框");
    header2.append(headerTitle2, closeBtn);
    const tabBar = document.createElement("div");
    tabBar.className = styles.tabs;
    tabBar.setAttribute("role", "tablist");
    const tabDefs = [
      { id: "export", label: "导出设置" },
      { id: "schedule", label: "节次时间" },
      { id: "alarm", label: "课前提醒" }
    ];
    for (const { id, label: label2 } of tabDefs) {
      const isActive = id === "export";
      const btn = Object.assign(document.createElement("button"), {
        type: "button",
        id: `ics-tab-btn-${id}`,
        className: cx(styles.tabButton, isActive && styles.active),
        textContent: label2
      });
      btn.dataset.tab = id;
      btn.dataset.role = "tab-button";
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", String(isActive));
      btn.setAttribute("aria-controls", `ics-tab-${id}`);
      tabBar.appendChild(btn);
    }
    const panelsEl = Object.assign(document.createElement("div"), {
      className: styles.panels
    });
    const panelExport = Object.assign(document.createElement("div"), {
      className: cx(styles.panel, styles.active),
      id: "ics-tab-export"
    });
    panelExport.dataset.role = "tab-panel";
    panelExport.setAttribute("role", "tabpanel");
    panelExport.setAttribute("aria-labelledby", "ics-tab-btn-export");
    const twoCol = document.createElement("div");
    twoCol.className = styles.twoColumn;
    const rowDate = document.createElement("div");
    rowDate.className = styles.row;
    const lblDate = document.createElement("div");
    lblDate.className = styles.label;
    lblDate.append("学期第 1 周周一 ");
    const req = Object.assign(document.createElement("span"), {
      className: styles.required,
      textContent: "*"
    });
    req.setAttribute("aria-label", "必填");
    lblDate.appendChild(req);
    const startInp = Object.assign(document.createElement("input"), {
      type: "date",
      id: "ics-semester-start",
      className: styles.field,
      value: defaultDate
    });
    startInp.setAttribute("aria-required", "true");
    const tipDate = Object.assign(document.createElement("div"), {
      className: styles.tip,
      textContent: "第一教学周的周一日期"
    });
    rowDate.append(lblDate, startInp, tipDate);
    twoCol.append(rowDate);
    const previewHd = Object.assign(document.createElement("div"), {
      className: styles.sectionHeading,
      textContent: "节次时间预览"
    });
    const previewList = Object.assign(document.createElement("ul"), {
      className: styles.preview,
      id: "ics-preview-list"
    });
    panelExport.append(twoCol, previewHd, previewList);
    const panelSchedule = Object.assign(document.createElement("div"), {
      className: styles.panel,
      id: "ics-tab-schedule"
    });
    panelSchedule.dataset.role = "tab-panel";
    panelSchedule.setAttribute("role", "tabpanel");
    panelSchedule.setAttribute("aria-labelledby", "ics-tab-btn-schedule");
    const rowDur = document.createElement("div");
    rowDur.className = styles.row;
    const lblDur = Object.assign(document.createElement("div"), {
      className: styles.label,
      textContent: "每节课时长（分钟）"
    });
    const durInp = Object.assign(document.createElement("input"), {
      type: "number",
      id: "ics-duration",
      className: styles.field,
      min: "1",
      max: "240",
      value: String(cfg.duration)
    });
    const tipDur = Object.assign(document.createElement("div"), {
      className: styles.tip,
      textContent: "结束时间 = 开始时间 + 时长，课间休息不需要单独填写"
    });
    rowDur.append(lblDur, durInp, tipDur);
    const scheduleHd = Object.assign(document.createElement("div"), {
      className: styles.sectionHeading,
      textContent: "各节次开始时间"
    });
    const periodTbl = document.createElement("table");
    periodTbl.className = styles.table;
    periodTbl.appendChild(createTableHead(["节", "开始", "结束", ""]));
    const periodTb = document.createElement("tbody");
    periodTb.id = "ics-period-tbody";
    cfg.periods.forEach(
      (period, index) => periodTb.appendChild(makePeriodRow(index, period.start, cfg.duration))
    );
    periodTbl.appendChild(periodTb);
    const addPeriodBtn = Object.assign(document.createElement("button"), {
      type: "button",
      id: "ics-add-period-btn",
      className: styles.addButton,
      textContent: "＋ 添加节次"
    });
    const tipSchedule = Object.assign(document.createElement("div"), {
      className: cx(styles.tip, styles.scheduleTip),
      textContent: "配置自动保存，刷新页面后仍然有效"
    });
    panelSchedule.append(
      rowDur,
      scheduleHd,
      periodTbl,
      addPeriodBtn,
      tipSchedule
    );
    const panelAlarm = Object.assign(document.createElement("div"), {
      className: styles.panel,
      id: "ics-tab-alarm"
    });
    panelAlarm.dataset.role = "tab-panel";
    panelAlarm.setAttribute("role", "tabpanel");
    panelAlarm.setAttribute("aria-labelledby", "ics-tab-btn-alarm");
    const alarmTip2 = Object.assign(document.createElement("div"), {
      className: cx(styles.tip, styles.alarmTip)
    });
    alarmTip2.appendChild(createAlarmTipContent());
    const alarmTbl = document.createElement("table");
    alarmTbl.className = styles.table;
    alarmTbl.appendChild(createTableHead(["开启", "提前时间", "提醒方式", ""]));
    const alarmTb = document.createElement("tbody");
    alarmTb.id = "ics-alarm-tbody";
    cfg.alarms.forEach(
      (alarm, index) => alarmTb.appendChild(makeAlarmRow(index, alarm))
    );
    alarmTbl.appendChild(alarmTb);
    const addAlarmBtn = Object.assign(document.createElement("button"), {
      type: "button",
      id: "ics-add-alarm-btn",
      className: styles.addButton,
      textContent: "＋ 添加提醒规则"
    });
    panelAlarm.append(alarmTip2, alarmTbl, addAlarmBtn);
    panelsEl.append(panelExport, panelSchedule, panelAlarm);
    const footer2 = document.createElement("div");
    footer2.className = styles.footer;
    const exportBtn = Object.assign(document.createElement("button"), {
      type: "button",
      id: "ics-export-btn",
      className: styles.exportButton,
      textContent: "⬇ 导出 .ics"
    });
    const statusEl = Object.assign(document.createElement("div"), {
      id: "ics-status",
      className: cx(styles.status, styles.statusInfo)
    });
    statusEl.setAttribute("aria-live", "polite");
    footer2.append(exportBtn, statusEl);
    dialog2.append(header2, tabBar, panelsEl, footer2);
    document.body.appendChild(dialog2);
    return {
      backdrop: backdrop2,
      dialog: dialog2,
      closeBtn,
      tabBar,
      panelsEl,
      startInp,
      previewList,
      durInp,
      periodTb,
      addPeriodBtn,
      alarmTb,
      addAlarmBtn,
      exportBtn,
      statusEl
    };
  }
  function handleExportAction({
    semKey,
    startInp,
    readConfig,
    setStatus
  }) {
    const semStart = startInp.value;
    if (!semStart) {
      setStatus("⚠️ 请填写学期开始日期", "error");
      startInp.focus();
      return;
    }
    const [year, month, day] = semStart.split("-").map(Number);
    const weekDay = new Date(year ?? 0, (month ?? 1) - 1, day ?? 1).getDay();
    if (weekDay !== 1) {
      const dayNames = "日一二三四五六";
      setStatus(
        `⚠️ ${semStart} 是星期${dayNames[weekDay]}，请填写周一的日期`,
        "error"
      );
      startInp.focus();
      return;
    }
    setStatus("解析课表中…", "info");
    setTimeout(() => {
      try {
        const courses = extractCourses();
        if (!courses.length) {
          setStatus("⚠️ 未找到课程数据，请先点击「查询」加载课表", "error");
          return;
        }
        const currentCfg = readConfig();
        const { ics, eventCount } = generateICS(courses, semStart, currentCfg);
        const filename = `上理工课表_${semStart}.ics`;
        downloadICS(ics, filename);
        if (semKey) {
          saveSemStart(semKey, semStart);
        }
        const alarmCount = currentCfg.alarms.filter(
          (alarm) => alarm.enabled
        ).length;
        const alarmSummary = alarmCount ? `${alarmCount} 条提醒` : "无提醒";
        setStatus(
          `✅ ${courses.length} 门课 · ${eventCount} 个事件 · ${alarmSummary}`,
          "ok"
        );
      } catch (error) {
        setStatus(
          `❌ 导出失败：${error instanceof Error ? error.message : String(error)}`,
          "error"
        );
        console.error("[ICS Exporter]", error);
      }
    }, 0);
  }
  function readPeriodConfig(durInp, periodTb) {
    return {
      duration: Math.max(1, parseInt(durInp.value, 10) || DEFAULT_DURATION),
      periods: Array.from(
        periodTb.querySelectorAll("tr[data-idx]")
      ).map((tr) => ({
        start: tr.querySelector('[data-role="period-start"]')?.value ?? "08:00"
      }))
    };
  }
  function readAlarms(alarmTb) {
    return Array.from(
      alarmTb.querySelectorAll("tr[data-alarm-idx]")
    ).map((tr) => ({
      enabled: tr.querySelector('[data-role="alarm-enabled"]')?.checked ?? false,
      minutes: Math.max(
        1,
        parseInt(
          tr.querySelector('[data-role="alarm-minutes"]')?.value ?? "15",
          10
        ) || 15
      ),
      action: tr.querySelector('[data-role="alarm-action"]')?.value ?? "DISPLAY"
    }));
  }
  function readDialogConfig(durInp, periodTb, alarmTb) {
    return {
      ...readPeriodConfig(durInp, periodTb),
      alarms: readAlarms(alarmTb)
    };
  }
  function refreshPeriodTable(periodTb, duration) {
    periodTb.querySelectorAll("tr[data-idx]").forEach((tr, index) => {
      tr.dataset.idx = String(index);
      const noEl = tr.querySelector('[data-cell="period-index"]');
      const endEl = tr.querySelector('[data-cell="period-end"]');
      const startEl = tr.querySelector(
        '[data-role="period-start"]'
      );
      if (noEl) {
        noEl.textContent = String(index + 1);
      }
      if (endEl && startEl) {
        endEl.textContent = "→ " + addMinutes(startEl.value, duration);
      }
    });
  }
  function refreshPreview(previewList, { periods, duration }) {
    previewList.replaceChildren(
      ...periods.map((period, index) => {
        const li = document.createElement("li");
        const indexEl = Object.assign(document.createElement("span"), {
          className: styles.previewIndex,
          textContent: String(index + 1)
        });
        const startEl = Object.assign(document.createElement("span"), {
          className: styles.previewTime,
          textContent: period.start
        });
        const endEl = Object.assign(document.createElement("span"), {
          className: styles.previewEnd,
          textContent: `→ ${addMinutes(period.start, duration)}`
        });
        li.append(indexEl, startEl, endEl);
        return li;
      })
    );
  }
  function refreshAlarmRows(alarmTb) {
    alarmTb.querySelectorAll("tr[data-alarm-idx]").forEach((tr, index) => {
      tr.dataset.alarmIdx = String(index);
      const enabled = tr.querySelector('[data-role="alarm-enabled"]')?.checked ?? false;
      tr.classList.toggle(styles.alarmOff, !enabled);
      const toggleEl = tr.querySelector(
        '[data-role="alarm-toggle"]'
      );
      if (toggleEl) {
        toggleEl.title = enabled ? "已启用" : "已禁用";
      }
    });
  }
  function createUI() {
    if (document.getElementById("ics-dialog")) {
      return;
    }
    const cfg = getConfig();
    const semKey = detectSemesterKey();
    const defaultDate = guessSemesterStart(semKey) ?? `${( new Date()).getFullYear()}-02-17`;
    const {
      backdrop: backdrop2,
      dialog: dialog2,
      closeBtn,
      tabBar,
      panelsEl,
      startInp,
      previewList,
      durInp,
      periodTb,
      addPeriodBtn,
      alarmTb,
      addAlarmBtn,
      exportBtn,
      statusEl
    } = createDialogElements(cfg, defaultDate);
    function openDialog2() {
      backdrop2.classList.add(styles.dialogOpen);
      dialog2.classList.add(styles.dialogOpen);
      dialog2.setAttribute("aria-hidden", "false");
      refreshPreview(previewList, readPeriodCfg());
      requestAnimationFrame(() => startInp.focus());
    }
    function closeDialog() {
      backdrop2.classList.remove(styles.dialogOpen);
      dialog2.classList.remove(styles.dialogOpen);
      dialog2.setAttribute("aria-hidden", "true");
      document.getElementById("ics-trigger-btn")?.focus();
    }
    closeBtn.addEventListener("click", closeDialog);
    backdrop2.addEventListener("click", closeDialog);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && dialog2.classList.contains(styles.dialogOpen)) {
        event.preventDefault();
        closeDialog();
      }
    });
    const triggerBtn = document.getElementById("ics-trigger-btn");
    if (triggerBtn) {
      const fresh = triggerBtn.cloneNode(true);
      triggerBtn.replaceWith(fresh);
      fresh.addEventListener("click", openDialog2);
    }
    tabBar.addEventListener("click", (event) => {
      const btn = event.target.closest(
        '[data-role="tab-button"]'
      );
      if (!btn) {
        return;
      }
      const tabId = btn.dataset.tab;
      for (const tabButton2 of Array.from(
        tabBar.querySelectorAll('[data-role="tab-button"]')
      )) {
        const active2 = tabButton2.dataset.tab === tabId;
        tabButton2.classList.toggle(styles.active, active2);
        tabButton2.setAttribute("aria-selected", String(active2));
      }
      for (const panel2 of Array.from(
        panelsEl.querySelectorAll('[data-role="tab-panel"]')
      )) {
        panel2.classList.toggle(styles.active, panel2.id === `ics-tab-${tabId}`);
      }
      if (tabId === "export") {
        refreshPreview(previewList, readPeriodCfg());
      }
    });
    function readPeriodCfg() {
      return readPeriodConfig(durInp, periodTb);
    }
    const readCfg = () => readDialogConfig(durInp, periodTb, alarmTb);
    function onPeriodChange() {
      const config = readPeriodCfg();
      refreshPeriodTable(periodTb, config.duration);
      refreshPreview(previewList, config);
      saveConfig(readCfg());
    }
    function onAlarmChange() {
      refreshAlarmRows(alarmTb);
      saveConfig(readCfg());
    }
    refreshPreview(previewList, { periods: cfg.periods, duration: cfg.duration });
    durInp.addEventListener("input", onPeriodChange);
    periodTb.addEventListener("input", (event) => {
      if (event.target.matches('[data-role="period-start"]')) {
        onPeriodChange();
      }
    });
    periodTb.addEventListener("click", (event) => {
      const btn = event.target.closest(
        '[data-action="delete-period"]'
      );
      if (!btn) {
        return;
      }
      if (periodTb.querySelectorAll("tr").length <= 1) {
        return;
      }
      btn.closest("tr")?.remove();
      onPeriodChange();
    });
    addPeriodBtn.addEventListener("click", () => {
      const { duration, periods } = readPeriodCfg();
      const lastStart = periods.at(-1)?.start ?? "08:00";
      const nextStart = addMinutes(lastStart, duration + 10);
      periodTb.appendChild(makePeriodRow(periods.length, nextStart, duration));
      onPeriodChange();
    });
    alarmTb.addEventListener("change", (event) => {
      const target = event.target;
      if (target.matches('[data-role="alarm-enabled"]') || target.matches('[data-role="alarm-action"]')) {
        onAlarmChange();
      }
    });
    alarmTb.addEventListener("input", (event) => {
      if (event.target.matches('[data-role="alarm-minutes"]')) {
        onAlarmChange();
      }
    });
    alarmTb.addEventListener("click", (event) => {
      const btn = event.target.closest(
        '[data-action="delete-alarm"]'
      );
      if (!btn) {
        return;
      }
      btn.closest("tr")?.remove();
      onAlarmChange();
    });
    addAlarmBtn.addEventListener("click", () => {
      const index = alarmTb.querySelectorAll("tr").length;
      alarmTb.appendChild(
        makeAlarmRow(index, { enabled: true, minutes: 15, action: "DISPLAY" })
      );
      onAlarmChange();
    });
    const statusClassNames = {
      error: styles.statusError,
      info: styles.statusInfo,
      ok: styles.statusOk
    };
    const setStatus = (message, tone) => {
      statusEl.textContent = message;
      statusEl.className = cx(styles.status, statusClassNames[tone]);
    };
    exportBtn.addEventListener("click", () => {
      handleExportAction({
        semKey,
        startInp,
        readConfig: readCfg,
        setStatus
      });
    });
  }
  function injectTriggerButton(onClick) {
    if (document.getElementById("ics-trigger-btn")) {
      return;
    }
    const btn = document.createElement("button");
    btn.type = "button";
    btn.id = "ics-trigger-btn";
    btn.className = "btn btn-primary";
    btn.setAttribute("aria-haspopup", "dialog");
    const icon = document.createElement("span");
    icon.className = "bigger-120 glyphicon glyphicon-calendar";
    icon.setAttribute("aria-hidden", "true");
    btn.appendChild(icon);
    btn.appendChild(document.createTextNode(" 导出日历"));
    btn.addEventListener("click", onClick);
    const pdfBtn = document.getElementById("shcPDF");
    const toolbar = document.getElementById("tb") ?? document.querySelector(".btn-toolbar");
    if (pdfBtn) {
      pdfBtn.before(btn);
    } else if (toolbar) {
      toolbar.prepend(btn);
    } else {
      const fallback = document.querySelector(".sl_add_btn .col-sm-12");
      (fallback ?? document.body).prepend(btn);
    }
  }
  function isTimetableReady() {
    return document.querySelector('#kblist_table tbody[id^="xq_"] .timetable_con') !== null || document.querySelector("#kbgrid_table_0 .timetable_con") !== null;
  }
  function openDialog() {
    document.getElementById("ics-backdrop")?.classList.add(styles.dialogOpen);
    const dialog2 = document.getElementById("ics-dialog");
    dialog2?.classList.add(styles.dialogOpen);
    dialog2?.setAttribute("aria-hidden", "false");
  }
  function earlyInjectButton() {
    injectTriggerButton(() => {
      if (!isTimetableReady()) {
        alert("请先点击「查询」按钮加载课表，再导出日历。");
        return;
      }
      createUI();
      openDialog();
    });
  }
  function init() {
    if (isTimetableReady()) {
      createUI();
      return;
    }
    const observer = new MutationObserver(() => {
      if (document.getElementById("tb") && !document.getElementById("ics-trigger-btn")) {
        earlyInjectButton();
      }
      if (isTimetableReady()) {
        observer.disconnect();
        createUI();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    if (document.getElementById("tb")) {
      earlyInjectButton();
    }
  }
  init();

})();