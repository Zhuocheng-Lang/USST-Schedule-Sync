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
// @grant              GM_getValue
// @grant              GM_setValue
// @run-at             document-idle
// @noframes
// ==/UserScript==

(function () {
  'use strict';

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
  function generateICS(courses, firstMonday, tzid, cfg) {
    const dtstamp = ( new Date()).toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";
    const activeAlarms = cfg.alarms.filter((alarm) => alarm.enabled);
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//USST Timetable Exporter v4//ZF//CN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:上理工课表",
      "X-WR-TIMEZONE:" + tzid,
      "X-WR-CALDESC:由 USST 课表导出工具生成"
    ];
    if (tzid === "Asia/Shanghai") {
      for (const line of VTIMEZONE_SHANGHAI.split("\r\n")) {
        lines.push(line);
      }
    }
    let eventCount = 0;
    for (const course of courses) {
      const startPeriod = getPeriodTime(cfg.periods, cfg.duration, course.pStart);
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
          `DTSTART;TZID=${tzid}:${toICSDateTime(dateStr, startPeriod.start)}`
        );
        lines.push(`DTEND;TZID=${tzid}:${toICSDateTime(dateStr, endPeriod.end)}`);
        lines.push(`SUMMARY:${escapeICSText(course.name)}`);
        lines.push(`LOCATION:${escapeICSText(course.location)}`);
        lines.push(
          `DESCRIPTION:${escapeICSText(`教师：${course.teacher}
第${week}周（${course.rawWeeks}）`)}`
        );
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
  function extractFromList(table) {
    const courses = [];
    for (let dow = 1; dow <= 7; dow++) {
      const tbody = table.querySelector(`tbody#xq_${dow}`);
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
        const name = titleEl.textContent?.trim().replace(/[★○◆◇●]/g, "").trim() ?? "";
        if (!name) {
          continue;
        }
        const locEl = con.querySelector(".glyphicon-map-marker");
        const tchrEl = con.querySelector(".glyphicon-user");
        courses.push({
          name,
          location: locEl ? locEl.parentElement?.textContent?.trim().replace(/\s+/g, " ") ?? "" : "",
          teacher: tchrEl ? tchrEl.parentElement?.textContent?.trim() ?? "" : "",
          dow,
          pStart,
          pEnd,
          weeks,
          rawWeeks
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
    const name = titleEl.textContent?.trim().replace(/[★○◆◇●]/g, "").trim() ?? "";
    if (!name) {
      return null;
    }
    const pText = Array.from(con.querySelectorAll("p")).map((p) => p.textContent?.replace(/\s+/g, " ").trim() ?? "").join(" ");
    let rawWeeks = "";
    let weeks = [];
    const labelledMatch = pText.match(
      /周数[：:]\s*([^\s校区上下]+周[（(双单）)]*)/
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
      rawWeeks
    };
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
  const ACTION_LABELS = {
    DISPLAY: "静默通知",
    AUDIO: "响铃提醒"
  };
  function makePeriodRow(index, start, duration) {
    const tr = document.createElement("tr");
    tr.dataset.idx = String(index);
    const tdNo = Object.assign(document.createElement("td"), {
      className: "tc-no",
      textContent: String(index + 1)
    });
    const input = Object.assign(document.createElement("input"), {
      type: "time",
      className: "ics-time-inp period-start",
      step: "60",
      value: start
    });
    const tdInp = document.createElement("td");
    tdInp.appendChild(input);
    const tdEnd = Object.assign(document.createElement("td"), {
      className: "tc-end",
      textContent: "→ " + addMinutes(start, duration)
    });
    const delBtn = Object.assign(document.createElement("button"), {
      type: "button",
      className: "ics-del-btn",
      title: "删除此节",
      textContent: "×"
    });
    const tdDel = document.createElement("td");
    tdDel.appendChild(delBtn);
    tr.append(tdNo, tdInp, tdEnd, tdDel);
    return tr;
  }
  function makeAlarmRow(index, alarm) {
    const tr = document.createElement("tr");
    tr.className = "alarm-row" + (alarm.enabled ? "" : " alarm-off");
    tr.dataset.alarmIdx = String(index);
    const toggle = document.createElement("label");
    toggle.className = "ics-toggle";
    toggle.title = alarm.enabled ? "已启用" : "已禁用";
    const chk = Object.assign(document.createElement("input"), {
      type: "checkbox",
      className: "alarm-enabled",
      checked: alarm.enabled
    });
    const track = Object.assign(document.createElement("span"), {
      className: "ics-toggle-track"
    });
    toggle.append(chk, track);
    const tdToggle = Object.assign(document.createElement("td"), {
      className: "tc-toggle"
    });
    tdToggle.appendChild(toggle);
    const numInp = Object.assign(document.createElement("input"), {
      type: "number",
      className: "ics-mini-num alarm-minutes",
      min: "1",
      max: "1440",
      value: String(alarm.minutes)
    });
    const tdMin = document.createElement("td");
    tdMin.append(numInp, " 分钟前");
    const select = Object.assign(document.createElement("select"), {
      className: "ics-mini-sel alarm-action"
    });
    for (const [value, label] of Object.entries(ACTION_LABELS)) {
      const option = Object.assign(document.createElement("option"), {
        value,
        textContent: label
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
      className: "ics-del-btn alarm-del-btn",
      title: "删除此规则",
      textContent: "×"
    });
    const tdDel = document.createElement("td");
    tdDel.appendChild(delBtn);
    tr.append(tdToggle, tdMin, tdSel, tdDel);
    return tr;
  }
  const CSS = `
/* ── toolbar trigger button — styled by Bootstrap 3, no overrides needed ── */

/* ── modal backdrop ─────────────────────────────────────────────────── */
#ics-backdrop {
display: none; position: fixed; inset: 0; z-index: 99998;
background: rgba(10,18,35,.5); backdrop-filter: blur(3px);
}
#ics-backdrop.ics-open {
display: block;
animation: icsBackdropIn .2s ease forwards;
}
@keyframes icsBackdropIn { from { opacity: 0; } to { opacity: 1; } }

/* ── dialog ─────────────────────────────────────────────────────────── */
#ics-dialog {
display: none; position: fixed; z-index: 99999;
top: 50%; left: 50%;
transform: translate(-50%, -50%);
width: 480px; max-width: calc(100vw - 32px); max-height: calc(100vh - 48px);
background: #fff; border-radius: 16px;
box-shadow: 0 24px 64px rgba(10,18,35,.22), 0 4px 16px rgba(10,18,35,.08);
font-family: -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
font-size: 13px; color: #1a1a2e;
flex-direction: column;
}
#ics-dialog.ics-open {
display: flex;
animation: icsDialogIn .22s cubic-bezier(.34,1.36,.64,1) forwards;
}
@keyframes icsDialogIn {
    from { opacity: 0; transform: translate(-50%, -50%) scale(.94); }
    to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

/* ── dialog sections ─────────────────────────────────────────────────── */
.ics-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 22px 0; flex-shrink: 0;
}
.ics-header-title { display: flex; align-items: center; gap: 10px; }
.ics-logo {
    width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
    background: linear-gradient(135deg, #1a73e8, #0d47a1);
    display: flex; align-items: center; justify-content: center; font-size: 18px;
}
.ics-title-text { font-size: 15px; font-weight: 700; line-height: 1.2; }
.ics-title-sub  { font-size: 11px; color: #9aa0ad; margin-top: 2px; }

.ics-close-btn {
    width: 30px; height: 30px; border-radius: 50%; border: none; flex-shrink: 0;
    background: #f0f2f5; color: #666; cursor: pointer; font-size: 16px;
    display: flex; align-items: center; justify-content: center;
    transition: background .15s, color .15s;
}
.ics-close-btn:hover { background: #e0e4ea; color: #222; }
.ics-close-btn:focus-visible { outline: 2px solid #1a73e8; outline-offset: 2px; }

/* ── tabs ───────────────────────────────────────────────────────────── */
.ics-tabs {
    display: flex; margin: 14px 22px 0; flex-shrink: 0;
    border-bottom: 2px solid #f0f2f5;
}
.ics-tab-btn {
    padding: 8px 16px; border: none; background: none;
    font-size: 13px; font-weight: 600; color: #888; cursor: pointer;
    border-bottom: 2px solid transparent; margin-bottom: -2px;
    transition: color .15s, border-color .15s;
}
.ics-tab-btn.active          { color: #1a73e8; border-bottom-color: #1a73e8; }
.ics-tab-btn:hover:not(.active) { color: #444; }
.ics-tab-btn:focus-visible   { outline: 2px solid #1a73e8; outline-offset: -2px; }

/* ── panels (scrollable body) ───────────────────────────────────────── */
.ics-panels {
    overflow-y: auto; overflow-x: hidden;
    flex: 1 1 auto; min-height: 0;
    max-height: 54vh;
    padding: 18px 22px;
    overscroll-behavior: contain;
}
.ics-panel { display: none; }
.ics-panel.active { display: block; }

/* ── form atoms ─────────────────────────────────────────────────────── */
.ics-row { margin-bottom: 14px; }
.ics-row:last-child { margin-bottom: 0; }

.ics-label {
    display: flex; align-items: center; gap: 5px;
    margin-bottom: 6px; font-weight: 600; color: #444;
    font-size: 11.5px; text-transform: uppercase; letter-spacing: .4px;
}
.ics-req { color: #e74c3c; }

.ics-field {
    width: 100%; padding: 8px 11px; box-sizing: border-box;
    border: 1.5px solid #dde1e9; border-radius: 8px;
    font-size: 13px; color: #222; outline: none; background: #fafbfc;
    transition: border-color .15s, background .15s;
    font-family: inherit;
}
.ics-field:focus { border-color: #1a73e8; background: #fff; }

.ics-tip { font-size: 11.5px; color: #9aa0ad; margin-top: 5px; line-height: 1.55; }

/* ── export tab layout ──────────────────────────────────────────────── */
.ics-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

.ics-section-hd {
    font-size: 11px; font-weight: 700; color: #9aa0ad;
    text-transform: uppercase; letter-spacing: .5px;
    margin: 18px 0 8px; padding-bottom: 6px; border-bottom: 1px solid #f0f2f5;
}
.ics-section-hd:first-child { margin-top: 0; }

/* ── period/alarm table ─────────────────────────────────────────────── */
.ics-tbl { width: 100%; border-collapse: collapse; font-size: 12px; }
.ics-tbl th {
    text-align: left; font-weight: 700; color: #9aa0ad;
    font-size: 10.5px; text-transform: uppercase; letter-spacing: .3px;
    padding: 0 6px 7px; border-bottom: 1px solid #eef0f4;
}
.ics-tbl td { padding: 4px 3px; vertical-align: middle; }
.tc-no   { color: #c8cdd8; width: 22px; text-align: center; font-size: 11px; }
.tc-end  { color: #c0c8d5; font-size: 11.5px; padding-left: 5px !important; white-space: nowrap; }
.tc-toggle { width: 36px; text-align: center; }

.ics-time-inp, .ics-mini-num, .ics-mini-sel {
    padding: 5px 7px; font-size: 12px; font-family: inherit;
    border: 1.5px solid #dde1e9; border-radius: 6px; outline: none;
    background: #fafbfc; box-sizing: border-box; transition: border-color .15s;
}
.ics-time-inp:focus, .ics-mini-num:focus, .ics-mini-sel:focus { border-color: #1a73e8; }
.ics-time-inp  { width: 90px; text-align: center; }
.ics-mini-num  { width: 54px; text-align: center; }
.ics-mini-sel  { cursor: pointer; }

.ics-del-btn {
    background: none; border: none; color: #d0d5de; cursor: pointer;
    font-size: 17px; line-height: 1; padding: 2px 5px; border-radius: 5px;
    transition: color .15s;
}
.ics-del-btn:hover       { color: #e74c3c; }
.ics-del-btn:focus-visible { outline: 2px solid #e74c3c; outline-offset: 2px; }

.ics-add-btn {
    margin-top: 9px; width: 100%; padding: 7px;
    border: 1.5px dashed #c8cdd8; border-radius: 8px;
    background: none; color: #9aa0ad; font-size: 12px; cursor: pointer;
    font-family: inherit; transition: border-color .15s, color .15s;
}
.ics-add-btn:hover       { border-color: #1a73e8; color: #1a73e8; }
.ics-add-btn:focus-visible { outline: 2px solid #1a73e8; outline-offset: 2px; }

/* ── toggle switch ──────────────────────────────────────────────────── */
.ics-toggle { position: relative; display: inline-block; width: 32px; height: 18px; }
.ics-toggle input { position: absolute; opacity: 0; width: 100%; height: 100%; margin: 0; cursor: pointer; }
.ics-toggle-track {
    position: absolute; inset: 0; pointer-events: none;
    background: #d0d5de; border-radius: 18px; transition: background .2s;
}
.ics-toggle-track::before {
    content: ''; position: absolute;
    width: 12px; height: 12px; left: 3px; bottom: 3px;
    background: #fff; border-radius: 50%; transition: transform .2s;
    box-shadow: 0 1px 3px rgba(0,0,0,.15);
}
.ics-toggle input:checked ~ .ics-toggle-track              { background: #1a73e8; }
.ics-toggle input:checked ~ .ics-toggle-track::before      { transform: translateX(14px); }
.ics-toggle input:focus-visible ~ .ics-toggle-track        { outline: 2px solid #1a73e8; outline-offset: 2px; }

tr.alarm-row.alarm-off td:not(.tc-toggle) { opacity: .32; pointer-events: none; }

/* ── period preview grid ────────────────────────────────────────────── */
.ics-preview { margin: 6px 0 0; padding: 0; display: grid; grid-template-columns: repeat(2, 1fr); }
.ics-preview li {
    list-style: none; display: flex; gap: 6px; align-items: baseline;
    font-size: 12px; line-height: 1.9;
}
.ics-preview .pn { color: #c0c8d5; width: 16px; text-align: right; flex-shrink: 0; font-size: 11px; }
.ics-preview .pt { color: #222; font-variant-numeric: tabular-nums; }
.ics-preview .pe { color: #c0c8d5; font-size: 11.5px; }

/* ── dialog footer ──────────────────────────────────────────────────── */
.ics-footer {
    padding: 14px 22px 18px; border-top: 1px solid #f0f2f5;
    display: flex; align-items: center; gap: 12px; flex-shrink: 0;
}
#ics-export-btn {
flex: 0 0 auto; padding: 10px 22px;
background: linear-gradient(135deg, #1a73e8, #0d5bba);
color: #fff; border: none; border-radius: 9px;
font-size: 14px; font-weight: 700; cursor: pointer; letter-spacing: .3px;
font-family: inherit;
box-shadow: 0 3px 10px rgba(26,115,232,.3);
transition: opacity .15s, box-shadow .15s;
}
#ics-export-btn:hover       { opacity: .9; box-shadow: 0 5px 16px rgba(26,115,232,.42); }
#ics-export-btn:focus-visible { outline: 2px solid #fff; outline-offset: -4px; }

#ics-status {
flex: 1; font-size: 12px; min-height: 16px; line-height: 1.5;
word-break: break-word;
}
.ics-ok  { color: #166534; }
.ics-err { color: #991b1b; }
.ics-inf { color: #64748b; }
`;
  const CSS_BUTTON_ONLY = "";
  function createDialogElements(cfg, defaultDate) {
    const styleEl = Object.assign(document.createElement("style"), {
      textContent: CSS
    });
    document.head.appendChild(styleEl);
    const backdrop = Object.assign(document.createElement("div"), {
      id: "ics-backdrop"
    });
    backdrop.setAttribute("aria-hidden", "true");
    document.body.appendChild(backdrop);
    const dialog = Object.assign(document.createElement("div"), {
      id: "ics-dialog"
    });
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "ics-dialog-title");
    const header = document.createElement("div");
    header.className = "ics-header";
    header.innerHTML = `<div class="ics-header-title"><div class="ics-logo" aria-hidden="true">📅</div><div><div class="ics-title-text" id="ics-dialog-title">导出日历</div><div class="ics-title-sub">Export to .ics · iCalendar RFC 5545</div></div></div>`;
    const closeBtn = Object.assign(document.createElement("button"), {
      type: "button",
      className: "ics-close-btn",
      title: "关闭 (Esc)",
      textContent: "✕"
    });
    header.appendChild(closeBtn);
    const tabBar = document.createElement("div");
    tabBar.className = "ics-tabs";
    tabBar.setAttribute("role", "tablist");
    const tabDefs = [
      { id: "export", label: "导出设置" },
      { id: "schedule", label: "节次时间" },
      { id: "alarm", label: "课前提醒" }
    ];
    for (const { id, label } of tabDefs) {
      const btn = Object.assign(document.createElement("button"), {
        type: "button",
        className: "ics-tab-btn" + (id === "export" ? " active" : ""),
        textContent: label
      });
      btn.dataset.tab = id;
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", String(id === "export"));
      btn.setAttribute("aria-controls", `ics-tab-${id}`);
      tabBar.appendChild(btn);
    }
    const panelsEl = Object.assign(document.createElement("div"), {
      className: "ics-panels"
    });
    const panelExport = Object.assign(document.createElement("div"), {
      className: "ics-panel active",
      id: "ics-tab-export"
    });
    panelExport.setAttribute("role", "tabpanel");
    panelExport.setAttribute("aria-labelledby", "tab-export");
    const twoCol = document.createElement("div");
    twoCol.className = "ics-two-col";
    const rowDate = document.createElement("div");
    rowDate.className = "ics-row";
    const lblDate = document.createElement("div");
    lblDate.className = "ics-label";
    lblDate.innerHTML = `学期第 1 周周一 <span class="ics-req" aria-label="必填">*</span>`;
    const startInp = Object.assign(document.createElement("input"), {
      type: "date",
      id: "ics-semester-start",
      className: "ics-field",
      value: defaultDate
    });
    startInp.setAttribute("aria-required", "true");
    const tipDate = Object.assign(document.createElement("div"), {
      className: "ics-tip",
      textContent: "第一教学周的周一日期"
    });
    rowDate.append(lblDate, startInp, tipDate);
    const rowTz = document.createElement("div");
    rowTz.className = "ics-row";
    const lblTz = Object.assign(document.createElement("div"), {
      className: "ics-label",
      textContent: "时区"
    });
    const tzSel = Object.assign(document.createElement("select"), {
      id: "ics-tzid",
      className: "ics-field"
    });
    for (const [value, label] of [
      ["Asia/Shanghai", "北京时间 (CST +8)"],
      ["Asia/Hong_Kong", "香港 (HKT +8)"],
      ["Asia/Taipei", "台北 (CST +8)"]
    ]) {
      const option = Object.assign(document.createElement("option"), {
        value,
        textContent: label
      });
      if (value === "Asia/Shanghai") {
        option.selected = true;
      }
      tzSel.appendChild(option);
    }
    rowTz.append(lblTz, tzSel);
    twoCol.append(rowDate, rowTz);
    const previewHd = Object.assign(document.createElement("div"), {
      className: "ics-section-hd",
      textContent: "节次时间预览"
    });
    const previewList = Object.assign(document.createElement("ul"), {
      className: "ics-preview",
      id: "ics-preview-list"
    });
    panelExport.append(twoCol, previewHd, previewList);
    const panelSchedule = Object.assign(document.createElement("div"), {
      className: "ics-panel",
      id: "ics-tab-schedule"
    });
    panelSchedule.setAttribute("role", "tabpanel");
    panelSchedule.setAttribute("aria-labelledby", "tab-schedule");
    const rowDur = document.createElement("div");
    rowDur.className = "ics-row";
    const lblDur = Object.assign(document.createElement("div"), {
      className: "ics-label",
      textContent: "每节课时长（分钟）"
    });
    const durInp = Object.assign(document.createElement("input"), {
      type: "number",
      id: "ics-duration",
      className: "ics-field",
      min: "1",
      max: "240",
      value: String(cfg.duration)
    });
    const tipDur = Object.assign(document.createElement("div"), {
      className: "ics-tip",
      textContent: "结束时间 = 开始时间 + 时长，课间休息不需要单独填写"
    });
    rowDur.append(lblDur, durInp, tipDur);
    const scheduleHd = Object.assign(document.createElement("div"), {
      className: "ics-section-hd",
      textContent: "各节次开始时间"
    });
    const periodTbl = document.createElement("table");
    periodTbl.className = "ics-tbl";
    periodTbl.innerHTML = `<thead><tr><th>节</th><th>开始</th><th>结束</th><th></th></tr></thead>`;
    const periodTb = document.createElement("tbody");
    periodTb.id = "ics-period-tbody";
    cfg.periods.forEach(
      (period, index) => periodTb.appendChild(makePeriodRow(index, period.start, cfg.duration))
    );
    periodTbl.appendChild(periodTb);
    const addPeriodBtn = Object.assign(document.createElement("button"), {
      type: "button",
      id: "ics-add-period-btn",
      className: "ics-add-btn",
      textContent: "＋ 添加节次"
    });
    const tipSchedule = Object.assign(document.createElement("div"), {
      className: "ics-tip",
      style: "margin-top:8px",
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
      className: "ics-panel",
      id: "ics-tab-alarm"
    });
    panelAlarm.setAttribute("role", "tabpanel");
    panelAlarm.setAttribute("aria-labelledby", "tab-alarm");
    const alarmTip = Object.assign(document.createElement("div"), {
      className: "ics-tip"
    });
    alarmTip.style.marginBottom = "12px";
    alarmTip.innerHTML = `每条规则在每个日历事件中写入一个 <code>VALARM</code>，可叠加多条。<br><b>静默通知</b>：仅弹通知横幅，不响铃（<i>推荐</i>）。<br><b>响铃提醒</b>：播放系统提示音（Apple Calendar / Outlook 支持）。<br>全部关闭 = 不写入任何提醒。`;
    const alarmTbl = document.createElement("table");
    alarmTbl.className = "ics-tbl";
    alarmTbl.innerHTML = `<thead><tr><th>开启</th><th>提前时间</th><th>提醒方式</th><th></th></tr></thead>`;
    const alarmTb = document.createElement("tbody");
    alarmTb.id = "ics-alarm-tbody";
    cfg.alarms.forEach(
      (alarm, index) => alarmTb.appendChild(makeAlarmRow(index, alarm))
    );
    alarmTbl.appendChild(alarmTb);
    const addAlarmBtn = Object.assign(document.createElement("button"), {
      type: "button",
      id: "ics-add-alarm-btn",
      className: "ics-add-btn",
      textContent: "＋ 添加提醒规则"
    });
    panelAlarm.append(alarmTip, alarmTbl, addAlarmBtn);
    panelsEl.append(panelExport, panelSchedule, panelAlarm);
    const footer = document.createElement("div");
    footer.className = "ics-footer";
    const exportBtn = Object.assign(document.createElement("button"), {
      type: "button",
      id: "ics-export-btn",
      textContent: "⬇ 导出 .ics"
    });
    const statusEl = Object.assign(document.createElement("div"), {
      id: "ics-status",
      className: "ics-inf"
    });
    statusEl.setAttribute("aria-live", "polite");
    footer.append(exportBtn, statusEl);
    dialog.append(header, tabBar, panelsEl, footer);
    document.body.appendChild(dialog);
    return {
      backdrop,
      dialog,
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
      statusEl
    };
  }
  function handleExportAction({
    semKey,
    startInp,
    tzSel,
    readConfig,
    setStatus
  }) {
    const semStart = startInp.value;
    const tzid = tzSel.value;
    if (!semStart) {
      setStatus("⚠️ 请填写学期开始日期", "ics-err");
      startInp.focus();
      return;
    }
    const [year, month, day] = semStart.split("-").map(Number);
    const weekDay = new Date(year ?? 0, (month ?? 1) - 1, day ?? 1).getDay();
    if (weekDay !== 1) {
      const dayNames = "日一二三四五六";
      setStatus(
        `⚠️ ${semStart} 是星期${dayNames[weekDay]}，请填写周一的日期`,
        "ics-err"
      );
      startInp.focus();
      return;
    }
    setStatus("解析课表中…", "ics-inf");
    setTimeout(() => {
      try {
        const courses = extractCourses();
        if (!courses.length) {
          setStatus("⚠️ 未找到课程数据，请先点击「查询」加载课表", "ics-err");
          return;
        }
        const currentCfg = readConfig();
        const { ics, eventCount } = generateICS(
          courses,
          semStart,
          tzid,
          currentCfg
        );
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
          "ics-ok"
        );
      } catch (error) {
        setStatus(
          `❌ 导出失败：${error instanceof Error ? error.message : String(error)}`,
          "ics-err"
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
        start: tr.querySelector(".period-start")?.value ?? "08:00"
      }))
    };
  }
  function readAlarms(alarmTb) {
    return Array.from(
      alarmTb.querySelectorAll("tr[data-alarm-idx]")
    ).map((tr) => ({
      enabled: tr.querySelector(".alarm-enabled")?.checked ?? false,
      minutes: Math.max(
        1,
        parseInt(
          tr.querySelector(".alarm-minutes")?.value ?? "15",
          10
        ) || 15
      ),
      action: tr.querySelector(".alarm-action")?.value ?? "DISPLAY"
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
      const noEl = tr.querySelector(".tc-no");
      const endEl = tr.querySelector(".tc-end");
      const startEl = tr.querySelector(".period-start");
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
        li.innerHTML = `<span class="pn">${index + 1}</span><span class="pt">${period.start}</span><span class="pe">→ ${addMinutes(period.start, duration)}</span>`;
        return li;
      })
    );
  }
  function refreshAlarmRows(alarmTb) {
    alarmTb.querySelectorAll("tr[data-alarm-idx]").forEach((tr, index) => {
      tr.dataset.alarmIdx = String(index);
      const enabled = tr.querySelector(".alarm-enabled")?.checked ?? false;
      tr.classList.toggle("alarm-off", !enabled);
      const toggleEl = tr.querySelector(".ics-toggle");
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
      backdrop,
      dialog,
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
      statusEl
    } = createDialogElements(cfg, defaultDate);
    function openDialog2() {
      backdrop.classList.add("ics-open");
      dialog.classList.add("ics-open");
      dialog.setAttribute("aria-hidden", "false");
      refreshPreview(previewList, readPeriodCfg());
      requestAnimationFrame(() => startInp.focus());
    }
    function closeDialog() {
      backdrop.classList.remove("ics-open");
      dialog.classList.remove("ics-open");
      dialog.setAttribute("aria-hidden", "true");
      document.getElementById("ics-trigger-btn")?.focus();
    }
    closeBtn.addEventListener("click", closeDialog);
    backdrop.addEventListener("click", closeDialog);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && dialog.classList.contains("ics-open")) {
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
        ".ics-tab-btn"
      );
      if (!btn) {
        return;
      }
      const tabId = btn.dataset.tab;
      for (const tabButton of Array.from(
        tabBar.querySelectorAll(".ics-tab-btn")
      )) {
        const active = tabButton.dataset.tab === tabId;
        tabButton.classList.toggle("active", active);
        tabButton.setAttribute("aria-selected", String(active));
      }
      for (const panel of Array.from(panelsEl.querySelectorAll(".ics-panel"))) {
        panel.classList.toggle("active", panel.id === `ics-tab-${tabId}`);
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
      if (event.target.classList.contains("period-start")) {
        onPeriodChange();
      }
    });
    periodTb.addEventListener("click", (event) => {
      const btn = event.target.closest(".ics-del-btn");
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
      if (target.classList.contains("alarm-enabled") || target.classList.contains("alarm-action")) {
        onAlarmChange();
      }
    });
    alarmTb.addEventListener("input", (event) => {
      if (event.target.classList.contains("alarm-minutes")) {
        onAlarmChange();
      }
    });
    alarmTb.addEventListener("click", (event) => {
      const btn = event.target.closest(".alarm-del-btn");
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
    const setStatus = (message, className) => {
      statusEl.textContent = message;
      statusEl.className = className;
    };
    exportBtn.addEventListener("click", () => {
      handleExportAction({
        semKey,
        startInp,
        tzSel,
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
    document.getElementById("ics-backdrop")?.classList.add("ics-open");
    document.getElementById("ics-dialog")?.classList.add("ics-open");
  }
  function earlyInjectButton() {
    if (!document.getElementById("ics-btn-style")) {
      const style = Object.assign(document.createElement("style"), {
        id: "ics-btn-style",
        textContent: CSS_BUTTON_ONLY
      });
      document.head.appendChild(style);
    }
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