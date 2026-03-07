// ==UserScript==
// @name               USST Schedule Sync
// @name:zh-CN         USST 课表同步
// @namespace          https://github.com/Zhuocheng-Lang/USST-Schedule-Sync
// @version            1.0.0
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
  "use strict";

  const d = new Set();
  const o = async (e) => {
    d.has(e) ||
      (d.add(e),
      ((t) => {
        typeof GM_addStyle == "function"
          ? GM_addStyle(t)
          : (document.head || document.documentElement)
              .appendChild(document.createElement("style"))
              .append(t);
      })(e));
  };

  o(
    ' ._backdrop_13k50_1{display:none;position:fixed;inset:0;z-index:99998;background:#0a122380;-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px)}._backdrop_13k50_1._dialogOpen_13k50_19{display:block;animation:_backdropIn_13k50_1 .2s ease forwards}@keyframes _backdropIn_13k50_1{0%{opacity:0}to{opacity:1}}._dialog_13k50_19{display:none;position:fixed;z-index:99999;top:50%;left:50%;transform:translate(-50%,-50%);width:480px;max-width:calc(100vw - 32px);max-height:calc(100vh - 48px);background:#fff;border-radius:16px;box-shadow:0 24px 64px #0a122338,0 4px 16px #0a122314;font-family:-apple-system,PingFang SC,Microsoft YaHei,sans-serif;font-size:13px;color:#1a1a2e;flex-direction:column}._dialog_13k50_19._dialogOpen_13k50_19{display:flex;animation:_dialogIn_13k50_1 .22s cubic-bezier(.34,1.36,.64,1) forwards}@keyframes _dialogIn_13k50_1{0%{opacity:0;transform:translate(-50%,-50%) scale(.94)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}._header_13k50_121{display:flex;align-items:center;justify-content:space-between;padding:18px 22px 0;flex-shrink:0}._headerTitle_13k50_137{display:flex;align-items:center;gap:10px}._logo_13k50_149{width:34px;height:34px;border-radius:9px;flex-shrink:0;background:linear-gradient(135deg,#1a73e8,#0d47a1);display:flex;align-items:center;justify-content:center;font-size:18px}._titleText_13k50_173{font-size:15px;font-weight:700;line-height:1.2}._titleSub_13k50_185{font-size:11px;color:#9aa0ad;margin-top:2px}._closeButton_13k50_197{width:30px;height:30px;border-radius:50%;border:none;flex-shrink:0;background:#f0f2f5;color:#666;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:background .15s,color .15s}._closeButton_13k50_197:hover{background:#e0e4ea;color:#222}._closeButton_13k50_197:focus-visible{outline:2px solid #1a73e8;outline-offset:2px}._tabs_13k50_249{display:flex;margin:14px 22px 0;flex-shrink:0;border-bottom:2px solid #f0f2f5}._tabButton_13k50_263{padding:8px 16px;border:none;background:none;font-size:13px;font-weight:600;color:#888;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-2px;transition:color .15s,border-color .15s}._tabButton_13k50_263._active_13k50_289{color:#1a73e8;border-bottom-color:#1a73e8}._tabButton_13k50_263:hover:not(._active_13k50_289){color:#444}._tabButton_13k50_263:focus-visible{outline:2px solid #1a73e8;outline-offset:-2px}._panels_13k50_317{overflow-y:auto;overflow-x:hidden;flex:1 1 auto;min-height:0;max-height:54vh;padding:18px 22px;overscroll-behavior:contain}._panel_13k50_317{display:none}._panel_13k50_317._active_13k50_289{display:block}._row_13k50_353{margin-bottom:14px}._row_13k50_353:last-child{margin-bottom:0}._label_13k50_369{display:flex;align-items:center;gap:5px;margin-bottom:6px;font-weight:600;color:#444;font-size:11.5px;text-transform:uppercase;letter-spacing:.4px}._required_13k50_393{color:#e74c3c}._field_13k50_401{width:100%;padding:8px 11px;box-sizing:border-box;border:1.5px solid #dde1e9;border-radius:8px;font-size:13px;color:#222;outline:none;background:#fafbfc;transition:border-color .15s,background .15s;font-family:inherit}._field_13k50_401:focus{border-color:#1a73e8;background:#fff}._tip_13k50_439{font-size:11.5px;color:#9aa0ad;margin-top:5px;line-height:1.55}._scheduleTip_13k50_453{margin-top:8px}._alarmTip_13k50_461{margin-bottom:12px}._twoColumn_13k50_469{display:grid;grid-template-columns:1fr 1fr;gap:12px}._sectionHeading_13k50_481{font-size:11px;font-weight:700;color:#9aa0ad;text-transform:uppercase;letter-spacing:.5px;margin:18px 0 8px;padding-bottom:6px;border-bottom:1px solid #f0f2f5}._sectionHeading_13k50_481:first-child{margin-top:0}._table_13k50_511{width:100%;border-collapse:collapse;font-size:12px}._table_13k50_511 th{text-align:left;font-weight:700;color:#9aa0ad;font-size:10.5px;text-transform:uppercase;letter-spacing:.3px;padding:0 6px 7px;border-bottom:1px solid #eef0f4}._table_13k50_511 td{padding:4px 3px;vertical-align:middle}._cellNo_13k50_555{color:#c8cdd8;width:22px;text-align:center;font-size:11px}._cellEnd_13k50_569{color:#c0c8d5;font-size:11.5px;padding-left:5px!important;white-space:nowrap}._toggleCell_13k50_583{width:36px;text-align:center}._timeInput_13k50_593,._miniNumber_13k50_595,._miniSelect_13k50_597{padding:5px 7px;font-size:12px;font-family:inherit;border:1.5px solid #dde1e9;border-radius:6px;outline:none;background:#fafbfc;box-sizing:border-box;transition:border-color .15s}._timeInput_13k50_593:focus,._miniNumber_13k50_595:focus,._miniSelect_13k50_597:focus{border-color:#1a73e8}._timeInput_13k50_593{width:90px;text-align:center}._miniNumber_13k50_595{width:54px;text-align:center}._miniSelect_13k50_597{cursor:pointer}._deleteButton_13k50_661{background:none;border:none;color:#d0d5de;cursor:pointer;font-size:17px;line-height:1;padding:2px 5px;border-radius:5px;transition:color .15s}._deleteButton_13k50_661:hover{color:#e74c3c}._deleteButton_13k50_661:focus-visible{outline:2px solid #e74c3c;outline-offset:2px}._addButton_13k50_703{margin-top:9px;width:100%;padding:7px;border:1.5px dashed #c8cdd8;border-radius:8px;background:none;color:#9aa0ad;font-size:12px;cursor:pointer;font-family:inherit;transition:border-color .15s,color .15s}._addButton_13k50_703:hover{border-color:#1a73e8;color:#1a73e8}._addButton_13k50_703:focus-visible{outline:2px solid #1a73e8;outline-offset:2px}._toggle_13k50_583{position:relative;display:inline-block;width:32px;height:18px}._toggle_13k50_583 input{position:absolute;opacity:0;width:100%;height:100%;margin:0;cursor:pointer}._toggleTrack_13k50_783{position:absolute;inset:0;pointer-events:none;background:#d0d5de;border-radius:18px;transition:background .2s}._toggleTrack_13k50_783:before{content:"";position:absolute;width:12px;height:12px;left:3px;bottom:3px;background:#fff;border-radius:50%;transition:transform .2s;box-shadow:0 1px 3px #00000026}._toggle_13k50_583 input:checked~._toggleTrack_13k50_783{background:#1a73e8}._toggle_13k50_583 input:checked~._toggleTrack_13k50_783:before{transform:translate(14px)}._toggle_13k50_583 input:focus-visible~._toggleTrack_13k50_783{outline:2px solid #1a73e8;outline-offset:2px}._alarmRow_13k50_853._alarmOff_13k50_853 td:not(._toggleCell_13k50_583){opacity:.32;pointer-events:none}._preview_13k50_863{margin:6px 0 0;padding:0;display:grid;grid-template-columns:repeat(2,1fr)}._preview_13k50_863 li{list-style:none;display:flex;gap:6px;align-items:baseline;font-size:12px;line-height:1.9}._previewIndex_13k50_895{color:#c0c8d5;width:16px;text-align:right;flex-shrink:0;font-size:11px}._previewTime_13k50_911{color:#222;font-variant-numeric:tabular-nums}._previewEnd_13k50_921{color:#c0c8d5;font-size:11.5px}._footer_13k50_931{padding:14px 22px 18px;border-top:1px solid #f0f2f5;display:flex;align-items:center;gap:12px;flex-shrink:0}._exportButton_13k50_949{flex:0 0 auto;padding:10px 22px;background:linear-gradient(135deg,#1a73e8,#0d5bba);color:#fff;border:none;border-radius:9px;font-size:14px;font-weight:700;cursor:pointer;letter-spacing:.3px;font-family:inherit;box-shadow:0 3px 10px #1a73e84d;transition:opacity .15s,box-shadow .15s}._exportButton_13k50_949:hover{opacity:.9;box-shadow:0 5px 16px #1a73e86b}._exportButton_13k50_949:focus-visible{outline:2px solid #fff;outline-offset:-4px}._status_13k50_1001{flex:1;font-size:12px;min-height:16px;line-height:1.5;word-break:break-word}._statusOk_13k50_1017{color:#166534}._statusError_13k50_1025{color:#991b1b}._statusInfo_13k50_1033{color:#64748b} ',
  );

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
    { start: "19:40" },
  ];
  const DEFAULT_DURATION = 45;
  const DEFAULT_ALARMS = [{ enabled: true, minutes: 15, action: "DISPLAY" }];
  const STORAGE_NAMESPACE = "ics_";
  function defaultConfig() {
    return {
      duration: DEFAULT_DURATION,
      periods: DEFAULT_PERIODS.map((period) => ({ ...period })),
      alarms: DEFAULT_ALARMS.map((alarm) => ({ ...alarm })),
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
      23 * 60 + 59,
    );
    return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
  }
  function getPeriodTime(periods, duration, no) {
    const period = periods[no - 1];
    return period
      ? { start: period.start, end: addMinutes(period.start, duration) }
      : null;
  }
  function semesterDate(firstMonday, weekNo, dow) {
    const [year, month, day] = firstMonday.split("-").map(Number);
    const base = new Date(year ?? 0, (month ?? 1) - 1, day ?? 1);
    base.setDate(base.getDate() + (weekNo - 1) * 7 + (dow - 1));
    return [
      base.getFullYear(),
      String(base.getMonth() + 1).padStart(2, "0"),
      String(base.getDate()).padStart(2, "0"),
    ].join("-");
  }
  function toICSDateTime(dateISO, hhmm) {
    return dateISO.replace(/-/g, "") + "T" + hhmm.replace(":", "") + "00";
  }
  function escapeICSText(text) {
    return String(text)
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\r\n|\r|\n/g, "\\n");
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
    bytes[6] = (bytes[6] & 15) | 64;
    bytes[8] = (bytes[8] & 63) | 128;
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
    "END:VTIMEZONE",
  ].join("\r\n");
  function generateICS(courses, firstMonday, tzid, cfg) {
    const dtstamp =
      new Date().toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";
    const activeAlarms = cfg.alarms.filter((alarm) => alarm.enabled);
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//USST Timetable Exporter v4//ZF//CN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:上理工课表",
      "X-WR-TIMEZONE:" + tzid,
      "X-WR-CALDESC:由 USST 课表导出工具生成",
    ];
    if (tzid === "Asia/Shanghai") {
      for (const line of VTIMEZONE_SHANGHAI.split("\r\n")) {
        lines.push(line);
      }
    }
    let eventCount = 0;
    for (const course of courses) {
      const startPeriod = getPeriodTime(
        cfg.periods,
        cfg.duration,
        course.pStart,
      );
      const endPeriod = getPeriodTime(cfg.periods, cfg.duration, course.pEnd);
      if (!startPeriod || !endPeriod) {
        continue;
      }
      for (const week of course.weeks) {
        const dateStr = semesterDate(firstMonday, week, course.dow);
        lines.push("BEGIN:VEVENT");
        lines.push(`UID:${uuidV4()}@usst.timetable`);
        lines.push(`DTSTAMP:${dtstamp}`);
        lines.push(
          `DTSTART;TZID=${tzid}:${toICSDateTime(dateStr, startPeriod.start)}`,
        );
        lines.push(
          `DTEND;TZID=${tzid}:${toICSDateTime(dateStr, endPeriod.end)}`,
        );
        lines.push(`SUMMARY:${escapeICSText(course.name)}`);
        lines.push(`LOCATION:${escapeICSText(course.location)}`);
        lines.push(
          `DESCRIPTION:${escapeICSText(`教师：${course.teacher}
第${week}周（${course.rawWeeks}）`)}`,
        );
        for (const alarm of activeAlarms) {
          lines.push("BEGIN:VALARM");
          lines.push(`ACTION:${alarm.action}`);
          lines.push(`TRIGGER:-PT${alarm.minutes}M`);
          if (alarm.action === "DISPLAY") {
            lines.push(
              `DESCRIPTION:${escapeICSText(`${course.name} 还有 ${alarm.minutes} 分钟`)}`,
            );
          } else {
            lines.push("ATTACH;VALUE=URI:Basso");
          }
          lines.push("END:VALARM");
        }
        lines.push("END:VEVENT");
        eventCount++;
      }
    }
    lines.push("END:VCALENDAR");
    return { ics: lines.map(foldLine).join("\r\n"), eventCount };
  }
  function extractCourses() {
    const listTable = document.querySelector("#kblist_table");
    const raw = listTable ? extractFromList(listTable) : extractFromGrid();
    const seen = new Set();
    return raw.filter((course) => {
      const key = `${course.name}|${course.dow}|${course.pStart}|${course.pEnd}|${course.rawWeeks}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
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
    const grid = document.querySelector("#kbgrid_table_0");
    if (!grid) {
      return courses;
    }
    for (const td of Array.from(grid.querySelectorAll("td[id]"))) {
      const [dowStr] = td.id.split("-");
      const dow = Number(dowStr);
      if (!dow || dow > 7) {
        continue;
      }
      for (const con of Array.from(td.querySelectorAll(".timetable_con"))) {
        const timeEl = con.querySelector(".glyphicon-time");
        if (!timeEl) {
          continue;
        }
        const text = timeEl.parentElement?.textContent?.trim() ?? "";
        const periodMatch = text.match(/\((\d+)-(\d+)节\)/);
        if (!periodMatch) {
          continue;
        }
        const pStart = Number(periodMatch[1]);
        const pEnd = Number(periodMatch[2]);
        const rawWeeks = text.replace(/\(\d+-\d+节\)/, "").trim();
        const weeks = parseWeeks(rawWeeks);
        if (!weeks.length) {
          continue;
        }
        const titleEl = con.querySelector(".title");
        if (!titleEl) {
          continue;
        }
        const name =
          titleEl.textContent
            ?.trim()
            .replace(/[★○◆◇●]/g, "")
            .trim() ?? "";
        if (!name) {
          continue;
        }
        const locEl = con.querySelector(".glyphicon-map-marker");
        const tchrEl = con.querySelector(".glyphicon-user");
        courses.push({
          name,
          location: locEl
            ? (locEl.parentElement?.textContent?.trim().replace(/\s+/g, " ") ??
              "")
            : "",
          teacher: tchrEl
            ? (tchrEl.parentElement?.textContent?.trim() ?? "")
            : "",
          dow,
          pStart,
          pEnd,
          weeks,
          rawWeeks,
        });
      }
    }
    return courses;
  }
  function parseCourseCon(con, dow, pStart, pEnd) {
    const titleEl = con.querySelector(".title");
    if (!titleEl) {
      return null;
    }
    const name =
      titleEl.textContent
        ?.trim()
        .replace(/[★○◆◇●]/g, "")
        .trim() ?? "";
    if (!name) {
      return null;
    }
    const pText = Array.from(con.querySelectorAll("p"))
      .map((p) => p.textContent?.replace(/\s+/g, " ").trim() ?? "")
      .join(" ");
    let rawWeeks = "";
    let weeks = [];
    const labelledMatch = pText.match(
      /周数[：:]\s*([^\s校区上下]+周[（(双单）)]*)/,
    );
    if (labelledMatch) {
      rawWeeks = labelledMatch[1]?.trim() ?? "";
      weeks = parseWeeks(rawWeeks);
    }
    if (!weeks.length) {
      const bareMatch = pText.match(/(\d+-\d+周[（(双单）)]*|\d+周)/);
      if (bareMatch) {
        rawWeeks = bareMatch[1] ?? "";
        weeks = parseWeeks(rawWeeks);
      }
    }
    if (!weeks.length) {
      return null;
    }
    const locMatch = pText.match(/上课地点[：:]\s*(\S+)/);
    const tchrMatch = pText.match(/教师\s*[：:]\s*(\S+(?:[,，]\S+)*)/);
    return {
      name,
      location: locMatch?.[1] ?? "",
      teacher: tchrMatch?.[1] ?? "",
      dow,
      pStart,
      pEnd,
      weeks,
      rawWeeks,
    };
  }
  function downloadICS(content, filename) {
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    try {
      const anchor = Object.assign(document.createElement("a"), {
        href: url,
        download: filename,
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
    return quarter === 1
      ? nthMonday(year ?? 0, 8, 1)
      : nthMonday((year ?? 0) + 1, 1, 3);
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
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
  }
  const backdrop = "_backdrop_13k50_1";
  const dialogOpen = "_dialogOpen_13k50_19";
  const dialog = "_dialog_13k50_19";
  const header = "_header_13k50_121";
  const headerTitle = "_headerTitle_13k50_137";
  const logo = "_logo_13k50_149";
  const titleText = "_titleText_13k50_173";
  const titleSub = "_titleSub_13k50_185";
  const closeButton = "_closeButton_13k50_197";
  const tabs = "_tabs_13k50_249";
  const tabButton = "_tabButton_13k50_263";
  const active = "_active_13k50_289";
  const panels = "_panels_13k50_317";
  const panel = "_panel_13k50_317";
  const row = "_row_13k50_353";
  const label = "_label_13k50_369";
  const required = "_required_13k50_393";
  const field = "_field_13k50_401";
  const tip = "_tip_13k50_439";
  const scheduleTip = "_scheduleTip_13k50_453";
  const alarmTip = "_alarmTip_13k50_461";
  const twoColumn = "_twoColumn_13k50_469";
  const sectionHeading = "_sectionHeading_13k50_481";
  const table = "_table_13k50_511";
  const cellNo = "_cellNo_13k50_555";
  const cellEnd = "_cellEnd_13k50_569";
  const toggleCell = "_toggleCell_13k50_583";
  const timeInput = "_timeInput_13k50_593";
  const miniNumber = "_miniNumber_13k50_595";
  const miniSelect = "_miniSelect_13k50_597";
  const deleteButton = "_deleteButton_13k50_661";
  const addButton = "_addButton_13k50_703";
  const toggle = "_toggle_13k50_583";
  const toggleTrack = "_toggleTrack_13k50_783";
  const alarmRow = "_alarmRow_13k50_853";
  const alarmOff = "_alarmOff_13k50_853";
  const preview = "_preview_13k50_863";
  const previewIndex = "_previewIndex_13k50_895";
  const previewTime = "_previewTime_13k50_911";
  const previewEnd = "_previewEnd_13k50_921";
  const footer = "_footer_13k50_931";
  const exportButton = "_exportButton_13k50_949";
  const status = "_status_13k50_1001";
  const statusOk = "_statusOk_13k50_1017";
  const statusError = "_statusError_13k50_1025";
  const statusInfo = "_statusInfo_13k50_1033";
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
    statusInfo,
  };
  function cx(...tokens) {
    return tokens.filter((token) => Boolean(token)).join(" ");
  }
  const ACTION_LABELS = {
    DISPLAY: "静默通知",
    AUDIO: "响铃提醒",
  };
  function makePeriodRow(index, start, duration) {
    const tr = document.createElement("tr");
    tr.dataset.idx = String(index);
    const tdNo = Object.assign(document.createElement("td"), {
      className: styles.cellNo,
      textContent: String(index + 1),
    });
    tdNo.dataset.cell = "period-index";
    const input = Object.assign(document.createElement("input"), {
      type: "time",
      className: styles.timeInput,
      step: "60",
      value: start,
    });
    input.dataset.role = "period-start";
    const tdInp = document.createElement("td");
    tdInp.appendChild(input);
    const tdEnd = Object.assign(document.createElement("td"), {
      className: styles.cellEnd,
      textContent: "→ " + addMinutes(start, duration),
    });
    tdEnd.dataset.cell = "period-end";
    const delBtn = Object.assign(document.createElement("button"), {
      type: "button",
      className: styles.deleteButton,
      title: "删除此节",
      textContent: "×",
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
      checked: alarm.enabled,
    });
    chk.dataset.role = "alarm-enabled";
    const track = Object.assign(document.createElement("span"), {
      className: styles.toggleTrack,
    });
    toggle2.append(chk, track);
    const tdToggle = Object.assign(document.createElement("td"), {
      className: styles.toggleCell,
    });
    tdToggle.appendChild(toggle2);
    const numInp = Object.assign(document.createElement("input"), {
      type: "number",
      className: styles.miniNumber,
      min: "1",
      max: "1440",
      value: String(alarm.minutes),
    });
    numInp.dataset.role = "alarm-minutes";
    const tdMin = document.createElement("td");
    tdMin.append(numInp, " 分钟前");
    const select = Object.assign(document.createElement("select"), {
      className: styles.miniSelect,
    });
    select.dataset.role = "alarm-action";
    for (const [value, label2] of Object.entries(ACTION_LABELS)) {
      const option = Object.assign(document.createElement("option"), {
        value,
        textContent: label2,
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
      textContent: "×",
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
      document.createElement("br"),
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
      document.createElement("br"),
    );
    const audio = document.createElement("b");
    audio.textContent = "响铃提醒";
    fragment.append(
      audio,
      "：播放系统提示音（Apple Calendar / Outlook 支持）。",
      document.createElement("br"),
    );
    fragment.append("全部关闭 = 不写入任何提醒。");
    return fragment;
  }
  function createDialogElements(cfg, defaultDate) {
    const backdrop2 = Object.assign(document.createElement("div"), {
      id: "ics-backdrop",
      className: styles.backdrop,
    });
    backdrop2.setAttribute("aria-hidden", "true");
    document.body.appendChild(backdrop2);
    const dialog2 = Object.assign(document.createElement("div"), {
      id: "ics-dialog",
      className: styles.dialog,
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
      textContent: "📅",
    });
    logo2.setAttribute("aria-hidden", "true");
    const titleWrap = document.createElement("div");
    const titleText2 = Object.assign(document.createElement("div"), {
      id: "ics-dialog-title",
      className: styles.titleText,
      textContent: "导出日历",
    });
    const titleSub2 = Object.assign(document.createElement("div"), {
      className: styles.titleSub,
      textContent: "Export to .ics · iCalendar RFC 5545",
    });
    titleWrap.append(titleText2, titleSub2);
    headerTitle2.append(logo2, titleWrap);
    const closeBtn = Object.assign(document.createElement("button"), {
      type: "button",
      className: styles.closeButton,
      title: "关闭 (Esc)",
      textContent: "✕",
    });
    closeBtn.setAttribute("aria-label", "关闭对话框");
    header2.append(headerTitle2, closeBtn);
    const tabBar = document.createElement("div");
    tabBar.className = styles.tabs;
    tabBar.setAttribute("role", "tablist");
    const tabDefs = [
      { id: "export", label: "导出设置" },
      { id: "schedule", label: "节次时间" },
      { id: "alarm", label: "课前提醒" },
    ];
    for (const { id, label: label2 } of tabDefs) {
      const isActive = id === "export";
      const btn = Object.assign(document.createElement("button"), {
        type: "button",
        id: `ics-tab-btn-${id}`,
        className: cx(styles.tabButton, isActive && styles.active),
        textContent: label2,
      });
      btn.dataset.tab = id;
      btn.dataset.role = "tab-button";
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", String(isActive));
      btn.setAttribute("aria-controls", `ics-tab-${id}`);
      tabBar.appendChild(btn);
    }
    const panelsEl = Object.assign(document.createElement("div"), {
      className: styles.panels,
    });
    const panelExport = Object.assign(document.createElement("div"), {
      className: cx(styles.panel, styles.active),
      id: "ics-tab-export",
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
      textContent: "*",
    });
    req.setAttribute("aria-label", "必填");
    lblDate.appendChild(req);
    const startInp = Object.assign(document.createElement("input"), {
      type: "date",
      id: "ics-semester-start",
      className: styles.field,
      value: defaultDate,
    });
    startInp.setAttribute("aria-required", "true");
    const tipDate = Object.assign(document.createElement("div"), {
      className: styles.tip,
      textContent: "第一教学周的周一日期",
    });
    rowDate.append(lblDate, startInp, tipDate);
    const rowTz = document.createElement("div");
    rowTz.className = styles.row;
    const lblTz = Object.assign(document.createElement("div"), {
      className: styles.label,
      textContent: "时区",
    });
    const tzSel = Object.assign(document.createElement("select"), {
      id: "ics-tzid",
      className: styles.field,
    });
    for (const [value, label2] of [
      ["Asia/Shanghai", "北京时间 (CST +8)"],
      ["Asia/Hong_Kong", "香港 (HKT +8)"],
      ["Asia/Taipei", "台北 (CST +8)"],
    ]) {
      const option = Object.assign(document.createElement("option"), {
        value,
        textContent: label2,
      });
      if (value === "Asia/Shanghai") {
        option.selected = true;
      }
      tzSel.appendChild(option);
    }
    rowTz.append(lblTz, tzSel);
    twoCol.append(rowDate, rowTz);
    const previewHd = Object.assign(document.createElement("div"), {
      className: styles.sectionHeading,
      textContent: "节次时间预览",
    });
    const previewList = Object.assign(document.createElement("ul"), {
      className: styles.preview,
      id: "ics-preview-list",
    });
    panelExport.append(twoCol, previewHd, previewList);
    const panelSchedule = Object.assign(document.createElement("div"), {
      className: styles.panel,
      id: "ics-tab-schedule",
    });
    panelSchedule.dataset.role = "tab-panel";
    panelSchedule.setAttribute("role", "tabpanel");
    panelSchedule.setAttribute("aria-labelledby", "ics-tab-btn-schedule");
    const rowDur = document.createElement("div");
    rowDur.className = styles.row;
    const lblDur = Object.assign(document.createElement("div"), {
      className: styles.label,
      textContent: "每节课时长（分钟）",
    });
    const durInp = Object.assign(document.createElement("input"), {
      type: "number",
      id: "ics-duration",
      className: styles.field,
      min: "1",
      max: "240",
      value: String(cfg.duration),
    });
    const tipDur = Object.assign(document.createElement("div"), {
      className: styles.tip,
      textContent: "结束时间 = 开始时间 + 时长，课间休息不需要单独填写",
    });
    rowDur.append(lblDur, durInp, tipDur);
    const scheduleHd = Object.assign(document.createElement("div"), {
      className: styles.sectionHeading,
      textContent: "各节次开始时间",
    });
    const periodTbl = document.createElement("table");
    periodTbl.className = styles.table;
    periodTbl.appendChild(createTableHead(["节", "开始", "结束", ""]));
    const periodTb = document.createElement("tbody");
    periodTb.id = "ics-period-tbody";
    cfg.periods.forEach((period, index) =>
      periodTb.appendChild(makePeriodRow(index, period.start, cfg.duration)),
    );
    periodTbl.appendChild(periodTb);
    const addPeriodBtn = Object.assign(document.createElement("button"), {
      type: "button",
      id: "ics-add-period-btn",
      className: styles.addButton,
      textContent: "＋ 添加节次",
    });
    const tipSchedule = Object.assign(document.createElement("div"), {
      className: cx(styles.tip, styles.scheduleTip),
      textContent: "配置自动保存，刷新页面后仍然有效",
    });
    panelSchedule.append(
      rowDur,
      scheduleHd,
      periodTbl,
      addPeriodBtn,
      tipSchedule,
    );
    const panelAlarm = Object.assign(document.createElement("div"), {
      className: styles.panel,
      id: "ics-tab-alarm",
    });
    panelAlarm.dataset.role = "tab-panel";
    panelAlarm.setAttribute("role", "tabpanel");
    panelAlarm.setAttribute("aria-labelledby", "ics-tab-btn-alarm");
    const alarmTip2 = Object.assign(document.createElement("div"), {
      className: cx(styles.tip, styles.alarmTip),
    });
    alarmTip2.appendChild(createAlarmTipContent());
    const alarmTbl = document.createElement("table");
    alarmTbl.className = styles.table;
    alarmTbl.appendChild(createTableHead(["开启", "提前时间", "提醒方式", ""]));
    const alarmTb = document.createElement("tbody");
    alarmTb.id = "ics-alarm-tbody";
    cfg.alarms.forEach((alarm, index) =>
      alarmTb.appendChild(makeAlarmRow(index, alarm)),
    );
    alarmTbl.appendChild(alarmTb);
    const addAlarmBtn = Object.assign(document.createElement("button"), {
      type: "button",
      id: "ics-add-alarm-btn",
      className: styles.addButton,
      textContent: "＋ 添加提醒规则",
    });
    panelAlarm.append(alarmTip2, alarmTbl, addAlarmBtn);
    panelsEl.append(panelExport, panelSchedule, panelAlarm);
    const footer2 = document.createElement("div");
    footer2.className = styles.footer;
    const exportBtn = Object.assign(document.createElement("button"), {
      type: "button",
      id: "ics-export-btn",
      className: styles.exportButton,
      textContent: "⬇ 导出 .ics",
    });
    const statusEl = Object.assign(document.createElement("div"), {
      id: "ics-status",
      className: cx(styles.status, styles.statusInfo),
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
      tzSel,
      previewList,
      durInp,
      periodTb,
      addPeriodBtn,
      alarmTb,
      addAlarmBtn,
      exportBtn,
      statusEl,
    };
  }
  function handleExportAction({
    semKey,
    startInp,
    tzSel,
    readConfig,
    setStatus,
  }) {
    const semStart = startInp.value;
    const tzid = tzSel.value;
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
        "error",
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
        const { ics, eventCount } = generateICS(
          courses,
          semStart,
          tzid,
          currentCfg,
        );
        const filename = `上理工课表_${semStart}.ics`;
        downloadICS(ics, filename);
        if (semKey) {
          saveSemStart(semKey, semStart);
        }
        const alarmCount = currentCfg.alarms.filter(
          (alarm) => alarm.enabled,
        ).length;
        const alarmSummary = alarmCount ? `${alarmCount} 条提醒` : "无提醒";
        setStatus(
          `✅ ${courses.length} 门课 · ${eventCount} 个事件 · ${alarmSummary}`,
          "ok",
        );
      } catch (error) {
        setStatus(
          `❌ 导出失败：${error instanceof Error ? error.message : String(error)}`,
          "error",
        );
        console.error("[ICS Exporter]", error);
      }
    }, 0);
  }
  function readPeriodConfig(durInp, periodTb) {
    return {
      duration: Math.max(1, parseInt(durInp.value, 10) || DEFAULT_DURATION),
      periods: Array.from(periodTb.querySelectorAll("tr[data-idx]")).map(
        (tr) => ({
          start:
            tr.querySelector('[data-role="period-start"]')?.value ?? "08:00",
        }),
      ),
    };
  }
  function readAlarms(alarmTb) {
    return Array.from(alarmTb.querySelectorAll("tr[data-alarm-idx]")).map(
      (tr) => ({
        enabled:
          tr.querySelector('[data-role="alarm-enabled"]')?.checked ?? false,
        minutes: Math.max(
          1,
          parseInt(
            tr.querySelector('[data-role="alarm-minutes"]')?.value ?? "15",
            10,
          ) || 15,
        ),
        action:
          tr.querySelector('[data-role="alarm-action"]')?.value ?? "DISPLAY",
      }),
    );
  }
  function readDialogConfig(durInp, periodTb, alarmTb) {
    return {
      ...readPeriodConfig(durInp, periodTb),
      alarms: readAlarms(alarmTb),
    };
  }
  function refreshPeriodTable(periodTb, duration) {
    periodTb.querySelectorAll("tr[data-idx]").forEach((tr, index) => {
      tr.dataset.idx = String(index);
      const noEl = tr.querySelector('[data-cell="period-index"]');
      const endEl = tr.querySelector('[data-cell="period-end"]');
      const startEl = tr.querySelector('[data-role="period-start"]');
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
          textContent: String(index + 1),
        });
        const startEl = Object.assign(document.createElement("span"), {
          className: styles.previewTime,
          textContent: period.start,
        });
        const endEl = Object.assign(document.createElement("span"), {
          className: styles.previewEnd,
          textContent: `→ ${addMinutes(period.start, duration)}`,
        });
        li.append(indexEl, startEl, endEl);
        return li;
      }),
    );
  }
  function refreshAlarmRows(alarmTb) {
    alarmTb.querySelectorAll("tr[data-alarm-idx]").forEach((tr, index) => {
      tr.dataset.alarmIdx = String(index);
      const enabled =
        tr.querySelector('[data-role="alarm-enabled"]')?.checked ?? false;
      tr.classList.toggle(styles.alarmOff, !enabled);
      const toggleEl = tr.querySelector('[data-role="alarm-toggle"]');
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
    const defaultDate =
      guessSemesterStart(semKey) ?? `${new Date().getFullYear()}-02-17`;
    const {
      backdrop: backdrop2,
      dialog: dialog2,
      closeBtn,
      tabBar,
      panelsEl,
      startInp,
      tzSel,
      previewList,
      durInp,
      periodTb,
      addPeriodBtn,
      alarmTb,
      addAlarmBtn,
      exportBtn,
      statusEl,
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
      if (
        event.key === "Escape" &&
        dialog2.classList.contains(styles.dialogOpen)
      ) {
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
      const btn = event.target.closest('[data-role="tab-button"]');
      if (!btn) {
        return;
      }
      const tabId = btn.dataset.tab;
      for (const tabButton2 of Array.from(
        tabBar.querySelectorAll('[data-role="tab-button"]'),
      )) {
        const active2 = tabButton2.dataset.tab === tabId;
        tabButton2.classList.toggle(styles.active, active2);
        tabButton2.setAttribute("aria-selected", String(active2));
      }
      for (const panel2 of Array.from(
        panelsEl.querySelectorAll('[data-role="tab-panel"]'),
      )) {
        panel2.classList.toggle(
          styles.active,
          panel2.id === `ics-tab-${tabId}`,
        );
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
    refreshPreview(previewList, {
      periods: cfg.periods,
      duration: cfg.duration,
    });
    durInp.addEventListener("input", onPeriodChange);
    periodTb.addEventListener("input", (event) => {
      if (event.target.matches('[data-role="period-start"]')) {
        onPeriodChange();
      }
    });
    periodTb.addEventListener("click", (event) => {
      const btn = event.target.closest('[data-action="delete-period"]');
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
      if (
        target.matches('[data-role="alarm-enabled"]') ||
        target.matches('[data-role="alarm-action"]')
      ) {
        onAlarmChange();
      }
    });
    alarmTb.addEventListener("input", (event) => {
      if (event.target.matches('[data-role="alarm-minutes"]')) {
        onAlarmChange();
      }
    });
    alarmTb.addEventListener("click", (event) => {
      const btn = event.target.closest('[data-action="delete-alarm"]');
      if (!btn) {
        return;
      }
      btn.closest("tr")?.remove();
      onAlarmChange();
    });
    addAlarmBtn.addEventListener("click", () => {
      const index = alarmTb.querySelectorAll("tr").length;
      alarmTb.appendChild(
        makeAlarmRow(index, { enabled: true, minutes: 15, action: "DISPLAY" }),
      );
      onAlarmChange();
    });
    const statusClassNames = {
      error: styles.statusError,
      info: styles.statusInfo,
      ok: styles.statusOk,
    };
    const setStatus = (message, tone) => {
      statusEl.textContent = message;
      statusEl.className = cx(styles.status, statusClassNames[tone]);
    };
    exportBtn.addEventListener("click", () => {
      handleExportAction({
        semKey,
        startInp,
        tzSel,
        readConfig: readCfg,
        setStatus,
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
    const toolbar =
      document.getElementById("tb") ?? document.querySelector(".btn-toolbar");
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
    return (
      document.querySelector(
        '#kblist_table tbody[id^="xq_"] .timetable_con',
      ) !== null ||
      document.querySelector("#kbgrid_table_0 .timetable_con") !== null
    );
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
      if (
        document.getElementById("tb") &&
        !document.getElementById("ics-trigger-btn")
      ) {
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
