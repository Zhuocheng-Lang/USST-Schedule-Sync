// ==UserScript==
// @name               USST Schedule Sync
// @name:zh-CN         USST 课表同步
// @namespace          https://github.com/Zhuocheng-Lang/USST-Schedule-Sync
// @version            1.0.4
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

  o(' ._backdrop_2n40w_1{display:none;position:fixed;inset:0;z-index:99998;background:#00000080}._backdrop_2n40w_1._dialogOpen_2n40w_9{display:block;animation:_backdropIn_2n40w_1 .15s linear forwards}@keyframes _backdropIn_2n40w_1{0%{opacity:0}to{opacity:1}}._dialog_2n40w_9{display:none;position:fixed;z-index:99999;top:50%;left:50%;transform:translate(-50%,-50%);width:500px;max-width:calc(100vw - 20px);max-height:calc(100vh - 20px);background:#fff;border:1px solid rgba(0,0,0,.2);border-radius:6px;box-shadow:0 5px 15px #00000080;font-family:Helvetica Neue,Helvetica,PingFang SC,Microsoft YaHei,Arial,sans-serif;font-size:14px;color:#333;flex-direction:column;background-clip:padding-box}._dialog_2n40w_9._dialogOpen_2n40w_9{display:flex;animation:_dialogIn_2n40w_1 .3s ease-out forwards}@keyframes _dialogIn_2n40w_1{0%{opacity:0;transform:translate(-50%,-50%) scale(.98)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}._header_2n40w_64{display:flex;align-items:center;justify-content:space-between;padding:15px;border-bottom:1px solid #e5e5e5;flex-shrink:0}._headerTitle_2n40w_73{display:flex;align-items:center;gap:10px}._logo_2n40w_79{width:30px;height:30px;border-radius:4px;flex-shrink:0;background:#337ab7;display:flex;align-items:center;justify-content:center;font-size:18px;color:#fff}._titleText_2n40w_92{font-size:18px;font-weight:500;line-height:1.1}._titleSub_2n40w_98{font-size:12px;color:#777;margin-top:2px}._closeButton_2n40w_104{width:24px;height:24px;background:transparent;border:none;font-size:21px;font-weight:700;color:#000;text-shadow:0 1px 0 #fff;opacity:.2;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:opacity .15s}._closeButton_2n40w_104:hover{opacity:.5}._closeButton_2n40w_104:focus-visible{outline:none;opacity:.5}._tabs_2n40w_130{display:flex;margin:15px 15px 0;flex-shrink:0;border-bottom:1px solid #ddd}._tabButton_2n40w_137{padding:10px 15px;border:1px solid transparent;background:transparent;font-size:14px;color:#337ab7;cursor:pointer;margin-bottom:-1px;border-radius:4px 4px 0 0;line-height:1.42857143}._tabButtonActive_2n40w_149{color:#555;background-color:#fff;border-color:#ddd #ddd transparent;border-bottom-color:transparent;cursor:default}._tabButton_2n40w_137:hover:not(._tabButtonActive_2n40w_149){background-color:#eee;border-color:#eee #eee #ddd}._tabButton_2n40w_137:focus-visible{outline:none}._panels_2n40w_166{overflow-y:auto;overflow-x:hidden;flex:1 1 auto;min-height:0;max-height:54vh;padding:15px}._panel_2n40w_166{display:none}._panelActive_2n40w_179{display:block}._row_2n40w_183{margin-bottom:15px}._row_2n40w_183:last-child{margin-bottom:0}._label_2n40w_191{display:inline-block;align-items:center;gap:5px;max-width:100%;margin-bottom:5px;font-weight:700;color:#333;font-size:14px}._required_2n40w_202{color:#a94442}._field_2n40w_206{display:block;width:100%;height:34px;padding:6px 12px;font-family:inherit;font-size:14px;line-height:1.42857143;color:#555;background-color:#fff;background-image:none;border:1px solid #ccc;border-radius:4px;box-shadow:inset 0 1px 1px #00000013;transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s}._field_2n40w_206:focus{border-color:#66afe9;outline:0;box-shadow:inset 0 1px 1px #00000013,0 0 8px #66afe999}._tip_2n40w_233{display:block;font-size:12px;color:#737373;margin-top:5px;margin-bottom:10px}._scheduleTip_2n40w_241{margin-top:8px}._alarmTip_2n40w_245{margin-bottom:12px}._twoColumn_2n40w_249{display:grid;grid-template-columns:1fr 1fr;gap:15px}._sectionHeading_2n40w_255{font-size:16px;font-weight:500;color:#333;margin:20px 0 10px;padding-bottom:5px;border-bottom:1px solid #eee}._sectionHeading_2n40w_255:first-child{margin-top:0}._table_2n40w_268{width:100%;max-width:100%;margin-bottom:20px;background-color:transparent;border-collapse:collapse;border-spacing:0;font-size:14px}._table_2n40w_268 th,._table_2n40w_268 td{padding:8px;line-height:1.42857143;vertical-align:middle;border-top:1px solid #ddd}._table_2n40w_268 th{text-align:left;font-weight:700;color:#333;border-bottom:2px solid #ddd}._table_2n40w_268 tbody tr:nth-of-type(odd){background-color:#f9f9f9}._cellNo_2n40w_297{color:#777;width:30px;text-align:center}._cellEnd_2n40w_303{color:#777;padding-left:5px!important;white-space:nowrap}._toggleCell_2n40w_309{width:45px;text-align:center}._timeInput_2n40w_314,._miniNumber_2n40w_315,._miniSelect_2n40w_316{display:inline-block;height:30px;padding:5px 10px;font-size:12px;line-height:1.5;color:#555;background-color:#fff;background-image:none;border:1px solid #ccc;border-radius:3px;box-shadow:inset 0 1px 1px #00000013;transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s}._timeInput_2n40w_314:focus,._miniNumber_2n40w_315:focus,._miniSelect_2n40w_316:focus{border-color:#66afe9;outline:0;box-shadow:inset 0 1px 1px #00000013,0 0 8px #66afe999}._timeInput_2n40w_314{width:80px;text-align:center}._miniNumber_2n40w_315{width:60px;text-align:center}._miniSelect_2n40w_316{cursor:pointer}._deleteButton_2n40w_357{background:none;border:none;color:#a94442;cursor:pointer;font-size:18px;line-height:1;padding:2px 5px;border-radius:3px;opacity:.6}._deleteButton_2n40w_357:hover{opacity:1}._deleteButton_2n40w_357:focus-visible{outline:none;opacity:1}._addButton_2n40w_378{display:inline-block;margin-top:10px;padding:6px 12px;margin-bottom:0;font-size:14px;font-weight:400;line-height:1.42857143;text-align:center;white-space:nowrap;vertical-align:middle;cursor:pointer;background-image:none;border:1px dashed #ccc;border-radius:4px;color:#333;background-color:#fff}._addButton_2n40w_378:hover{color:#333;background-color:#e6e6e6;border-color:#adadad}._addButton_2n40w_378:focus-visible{outline:none}._toggle_2n40w_309{position:relative;display:inline-block;width:32px;height:20px}._toggle_2n40w_309 input{position:absolute;opacity:0;width:100%;height:100%;margin:0;cursor:pointer}._toggleTrack_2n40w_423{position:absolute;inset:0;pointer-events:none;background:#ccc;border-radius:10px;transition:background .2s}._toggleTrack_2n40w_423:before{content:"";position:absolute;width:14px;height:14px;left:3px;bottom:3px;background:#fff;border-radius:50%;transition:transform .2s;box-shadow:0 1px 2px #0003}._toggle_2n40w_309 input:checked~._toggleTrack_2n40w_423{background:#337ab7}._toggle_2n40w_309 input:checked~._toggleTrack_2n40w_423:before{transform:translate(12px)}._toggle_2n40w_309 input:focus-visible~._toggleTrack_2n40w_423{outline:2px solid #66afe9;outline-offset:2px}._alarmRow_2n40w_458._alarmOff_2n40w_458 td:not(._toggleCell_2n40w_309){opacity:.5;pointer-events:none}._preview_2n40w_463{margin:6px 0 0;padding:0;display:grid;grid-template-columns:repeat(2,1fr)}._preview_2n40w_463 li{list-style:none;display:flex;gap:6px;align-items:baseline;font-size:14px;line-height:1.5}._previewIndex_2n40w_479{color:#777;width:16px;text-align:right;flex-shrink:0;font-size:12px}._previewTime_2n40w_487{color:#333;font-variant-numeric:tabular-nums}._previewEnd_2n40w_492{color:#777;font-size:12px}._footer_2n40w_497{padding:15px;border-top:1px solid #e5e5e5;display:flex;align-items:center;gap:15px;flex-shrink:0}._exportButton_2n40w_506{display:inline-block;padding:6px 12px;margin-bottom:0;font-size:14px;font-weight:400;line-height:1.42857143;text-align:center;white-space:nowrap;vertical-align:middle;cursor:pointer;background-image:none;border:1px solid transparent;border-radius:4px;color:#fff;background-color:#337ab7;border-color:#2e6da4;box-shadow:none}._exportButton_2n40w_506:hover{color:#fff;background-color:#286090;border-color:#204d74}._exportButton_2n40w_506:focus-visible{outline:thin dotted;outline:5px auto -webkit-focus-ring-color;outline-offset:-2px}._status_2n40w_538{flex:1;font-size:14px;min-height:16px;line-height:1.5;word-break:break-word}._statusOk_2n40w_546{color:#3c763d}._statusError_2n40w_550{color:#a94442}._statusInfo_2n40w_554{color:#777} ');

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
  const _encoder = new TextEncoder();
  function foldLine(line) {
    if (_encoder.encode(line).length <= 75) {
      return line;
    }
    const segments = [];
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
  function fnv1a64(text, seed) {
    let hash = seed;
    const prime = 0x100000001b3n;
    for (const char of text) {
      hash ^= BigInt(char.codePointAt(0) ?? 0);
      hash = BigInt.asUintN(64, hash * prime);
    }
    return hash.toString(16).padStart(16, "0");
  }
  function stableUid(text, domain = "usst.timetable") {
    const left = fnv1a64(text, 0xcbf29ce484222325n);
    const right = fnv1a64(text, 0x84222325cbf29cen);
    const hex = `${left}${right}`;
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}@${domain}`;
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
  function normalizeText(text) {
    return text.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
  }
  const DEFAULT_PERIOD_START = "08:00";
  const DEFAULT_REMINDER_LEAD_MINUTES = 15;
  const DEFAULT_REMINDER_DELIVERY_KIND = "DISPLAY";
  const REMINDER_DELIVERY_LABELS = {
    DISPLAY: "静默通知",
    AUDIO: "响铃提醒"
  };
  function clonePeriod(period) {
    return { ...period };
  }
  function createReminderRuleId(seed = `${Date.now()}-${Math.random()}`) {
    return stableUid(seed, "usst.reminder");
  }
  function cloneReminderRule(rule) {
    return {
      id: rule.id,
      isEnabled: rule.isEnabled,
      offset: { ...rule.offset },
      delivery: { ...rule.delivery },
      template: { ...rule.template }
    };
  }
  function cloneReminderProgram(program) {
    return {
      version: 2,
      rules: program.rules.map(cloneReminderRule)
    };
  }
  function cloneConfig(config) {
    return {
      duration: config.duration,
      periods: config.periods.map(clonePeriod),
      reminderProgram: cloneReminderProgram(config.reminderProgram)
    };
  }
  function normalizeDuration(value, fallback) {
    const normalized = Number.parseInt(String(value ?? fallback), 10);
    return Math.max(1, normalized || fallback);
  }
  function normalizePeriod(period, fallbackStart = DEFAULT_PERIOD_START) {
    return {
      start: typeof period?.start === "string" && period.start.trim() ? period.start.trim() : fallbackStart
    };
  }
  function normalizePeriods(periods, fallbackPeriods) {
    if (!Array.isArray(periods) || !periods.length) {
      return fallbackPeriods.map(clonePeriod);
    }
    return periods.map(
      (period, index) => normalizePeriod(period, fallbackPeriods[index]?.start ?? DEFAULT_PERIOD_START)
    );
  }
  function createReminderRule(draft = {}) {
    const deliveryKind = draft.delivery?.kind === "AUDIO" ? "AUDIO" : DEFAULT_REMINDER_DELIVERY_KIND;
    return {
      id: typeof draft.id === "string" && draft.id.trim() ? draft.id.trim() : createReminderRuleId(),
      isEnabled: draft.isEnabled !== false,
      offset: {
        minutesBeforeStart: normalizeDuration(
          draft.offset?.minutesBeforeStart,
          DEFAULT_REMINDER_LEAD_MINUTES
        )
      },
      delivery: {
        kind: deliveryKind
      },
      template: {
        kind: draft.template?.kind === "course-start-countdown" ? "course-start-countdown" : "course-start-countdown"
      }
    };
  }
  function normalizeReminderProgram(program, fallbackProgram) {
    if (!program || !Array.isArray(program.rules)) {
      return cloneReminderProgram(fallbackProgram);
    }
    return {
      version: 2,
      rules: program.rules.map((rule) => createReminderRule(rule))
    };
  }
  function summarizeReminderProgram(program) {
    const totalRuleCount = program.rules.length;
    const activeRuleCount = program.rules.filter((rule) => rule.isEnabled).length;
    return {
      totalRuleCount,
      activeRuleCount
    };
  }
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
  const DEFAULT_REMINDER_PROGRAM = {
    rules: [
      createReminderRule({
        id: "default-course-start-countdown",
        isEnabled: true,
        offset: { minutesBeforeStart: 15 },
        delivery: { kind: "DISPLAY" },
        template: { kind: "course-start-countdown" }
      })
    ]
  };
  const STORAGE_NAMESPACE = "ics_";
  function defaultConfig() {
    return {
      duration: DEFAULT_DURATION,
      periods: DEFAULT_PERIODS.map(clonePeriod),
      reminderProgram: cloneReminderProgram(DEFAULT_REMINDER_PROGRAM)
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
    if (saved) {
      return {
        duration: normalizeDuration(saved.duration, DEFAULT_DURATION),
        periods: normalizePeriods(saved.periods, DEFAULT_PERIODS),
        reminderProgram: normalizeReminderProgram(
          saved.reminderProgram,
          DEFAULT_REMINDER_PROGRAM
        )
      };
    }
    return defaultConfig();
  }
  const saveConfig = (cfg) => storageSet("config", cloneConfig(cfg));
  const getSemStart = (key) => storageGet("semstart_" + key, null);
  const saveSemStart = (key, value) => storageSet("semstart_" + key, value);
  function toReminderTrigger(minutesBeforeStart) {
    let remainingMinutes = Math.max(1, Math.floor(minutesBeforeStart));
    const minutesPerDay = 24 * 60;
    const days = Math.floor(remainingMinutes / minutesPerDay);
    remainingMinutes %= minutesPerDay;
    const hours = Math.floor(remainingMinutes / 60);
    const minutes = remainingMinutes % 60;
    let duration = "-P";
    if (days) {
      duration += `${days}D`;
    }
    if (hours || minutes || !days) {
      duration += "T";
      if (hours) {
        duration += `${hours}H`;
      }
      if (minutes || !days && !hours) {
        duration += `${minutes}M`;
      }
    }
    return duration;
  }
  function renderReminderDescription(context, rule) {
    if (rule.delivery.kind !== "DISPLAY") {
      return null;
    }
    return escapeICSText(
      `${context.courseName} 还有 ${rule.offset.minutesBeforeStart} 分钟`
    );
  }
  function compileReminderRule(rule, context) {
    if (!rule.isEnabled) {
      return null;
    }
    const trigger = toReminderTrigger(rule.offset.minutesBeforeStart);
    const description = renderReminderDescription(context, rule);
    const lines = [
      "BEGIN:VALARM",
      `ACTION:${rule.delivery.kind}`,
      `TRIGGER;RELATED=START;VALUE=DURATION:${trigger}`
    ];
    if (description) {
      lines.push(`DESCRIPTION:${description}`);
    }
    lines.push("END:VALARM");
    return {
      ruleId: rule.id,
      action: rule.delivery.kind,
      trigger,
      description,
      lines
    };
  }
  function compileReminderProgram(program, context) {
    const nodes = program.rules.map((rule) => compileReminderRule(rule, context)).filter((node) => node !== null);
    return {
      nodes,
      lines: nodes.flatMap((node) => node.lines),
      stats: {
        totalRuleCount: program.rules.length,
        activeRuleCount: program.rules.filter((rule) => rule.isEnabled).length,
        emittedAlarmCount: nodes.length
      }
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
  const PRODID = "-//Zhuocheng Lang//USST Schedule Sync//CN";
  const WEEK_LABEL_PATTERN = /周次[：:]\s*(.+)$/;
  function buildEventUid(course, firstMonday, firstDate) {
    const identity = [
      firstMonday,
      firstDate,
      String(course.dow),
      String(course.pStart),
      String(course.pEnd),
      course.name.trim(),
      course.location.trim(),
      course.teacher.trim(),
      [...new Set(course.weeks)].sort((left, right) => left - right).join(",")
    ].join("|");
    return stableUid(identity);
  }
  function normalizeCourseText(course) {
    let location = normalizeText(course.location).replace(/校区\s*/g, "校区 ").replace(/\s*(?:教师|周次)[：:].*$/, "").trim();
    let teacher = normalizeText(course.teacher).trim();
    let rawWeeks = normalizeText(course.rawWeeks);
    const weekFromTeacher = teacher.match(WEEK_LABEL_PATTERN);
    if (weekFromTeacher) {
      rawWeeks = rawWeeks || normalizeText(weekFromTeacher[1] ?? "");
      teacher = teacher.replace(WEEK_LABEL_PATTERN, "").trim();
    }
    if (rawWeeks && teacher.endsWith(rawWeeks)) {
      teacher = teacher.slice(0, -rawWeeks.length).trim();
    }
    teacher = teacher.replace(/周次[：:]?$/, "").trim();
    return {
      location,
      teacher,
      rawWeeks
    };
  }
  function pushOptionalDescription(lines, teacher, rawWeeks) {
    const parts = [];
    if (teacher) {
      parts.push(`教师：${escapeICSText(teacher)}`);
    }
    if (rawWeeks) {
      parts.push(`周次：${escapeICSText(rawWeeks)}`);
    }
    if (!parts.length) {
      return;
    }
    lines.push(`DESCRIPTION:${parts.join("\\n")}`);
  }
  function pushOptionalTextLine(lines, name, value) {
    const normalized = value.trim();
    if (!normalized) {
      return;
    }
    lines.push(`${name}:${escapeICSText(normalized)}`);
  }
  function generateICS(courses, firstMonday, cfg) {
    const dtstamp = ( new Date()).toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      `PRODID:${PRODID}`,
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
      const normalizedCourse = normalizeCourseText(course);
      lines.push("BEGIN:VEVENT");
      lines.push(`UID:${buildEventUid(course, firstMonday, firstDate)}`);
      lines.push(`DTSTAMP:${dtstamp}`);
      lines.push(
        `DTSTART;TZID=${TZID}:${toICSDateTime(firstDate, startPeriod.start)}`
      );
      lines.push(`DTEND;TZID=${TZID}:${toICSDateTime(firstDate, endPeriod.end)}`);
      pushOptionalTextLine(lines, "SUMMARY", course.name);
      pushOptionalTextLine(lines, "LOCATION", normalizedCourse.location);
      pushOptionalDescription(
        lines,
        normalizedCourse.teacher,
        normalizedCourse.rawWeeks
      );
      if (weekPattern.count > 1) {
        lines.push(
          `RRULE:FREQ=WEEKLY;INTERVAL=${weekPattern.interval};COUNT=${weekPattern.count}`
        );
      }
      if (weekPattern.exdates.length) {
        const exdateList = weekPattern.exdates.map((week) => semesterDate(firstMonday, week, course.dow)).sort();
        lines.push(
          `EXDATE;TZID=${TZID}:${toICSDateTimeList(exdateList, startPeriod.start)}`
        );
      }
      lines.push(
        ...compileReminderProgram(cfg.reminderProgram, {
          courseName: course.name
        }).lines
      );
      lines.push("END:VEVENT");
      eventCount++;
    }
    lines.push("END:VCALENDAR");
    return { ics: lines.map(foldLine).join("\r\n") + "\r\n", eventCount };
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
  const TRAILING_DETAIL_PATTERN = new RegExp(
    `\\s*(?:${DETAIL_END_LABELS}|周次|周数)\\s*[：:].*$`
  );
  function extractCourses() {
    return dedupeCourses(extractFromGrid());
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
            location: cleanLocationText(
              getParagraphTextByIcon(con, ".glyphicon-map-marker")
            ),
            teacher: cleanTeacherText(
              getParagraphTextByIcon(con, ".glyphicon-user"),
              rawWeeks
            ),
            dow,
            pStart,
            pEnd,
            weeks,
            rawWeeks
          });
        }
      }
    }
    return courses;
  }
  function getParagraphTextByIcon(con, selector) {
    const icon = con.querySelector(selector);
    const text = icon?.closest("p")?.textContent ?? "";
    return normalizeText(text);
  }
  function cleanLocationText(text) {
    return normalizeText(text).replace(/^上课地点\s*[：:]\s*/, "").replace(TRAILING_DETAIL_PATTERN, "").replace(/校区(?=[^\s])/g, "校区 ").trim();
  }
  function cleanTeacherText(text, rawWeeks) {
    let normalized = normalizeText(text).replace(/^教师\s*[：:]\s*/, "").replace(TRAILING_DETAIL_PATTERN, "").trim();
    if (rawWeeks) {
      normalized = normalized.replace(new RegExp(`周次\\s*[：:]\\s*${escapeRegExp(rawWeeks)}$`), "").replace(new RegExp(`${escapeRegExp(rawWeeks)}$`), "").trim();
    }
    return normalized;
  }
  function escapeRegExp(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function getCourseKey(course) {
    return `${course.name}|${course.dow}|${course.pStart}|${course.pEnd}|${course.rawWeeks}`;
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
  const backdrop = "_backdrop_2n40w_1";
  const dialogOpen = "_dialogOpen_2n40w_9";
  const dialog = "_dialog_2n40w_9";
  const header = "_header_2n40w_64";
  const headerTitle = "_headerTitle_2n40w_73";
  const logo = "_logo_2n40w_79";
  const titleText = "_titleText_2n40w_92";
  const titleSub = "_titleSub_2n40w_98";
  const closeButton = "_closeButton_2n40w_104";
  const tabs = "_tabs_2n40w_130";
  const tabButton = "_tabButton_2n40w_137";
  const tabButtonActive = "_tabButtonActive_2n40w_149";
  const panels = "_panels_2n40w_166";
  const panel = "_panel_2n40w_166";
  const panelActive = "_panelActive_2n40w_179";
  const row = "_row_2n40w_183";
  const label = "_label_2n40w_191";
  const required = "_required_2n40w_202";
  const field = "_field_2n40w_206";
  const tip = "_tip_2n40w_233";
  const scheduleTip = "_scheduleTip_2n40w_241";
  const alarmTip = "_alarmTip_2n40w_245";
  const twoColumn = "_twoColumn_2n40w_249";
  const sectionHeading = "_sectionHeading_2n40w_255";
  const table = "_table_2n40w_268";
  const cellNo = "_cellNo_2n40w_297";
  const cellEnd = "_cellEnd_2n40w_303";
  const toggleCell = "_toggleCell_2n40w_309";
  const timeInput = "_timeInput_2n40w_314";
  const miniNumber = "_miniNumber_2n40w_315";
  const miniSelect = "_miniSelect_2n40w_316";
  const deleteButton = "_deleteButton_2n40w_357";
  const addButton = "_addButton_2n40w_378";
  const toggle = "_toggle_2n40w_309";
  const toggleTrack = "_toggleTrack_2n40w_423";
  const alarmRow = "_alarmRow_2n40w_458";
  const alarmOff = "_alarmOff_2n40w_458";
  const preview = "_preview_2n40w_463";
  const previewIndex = "_previewIndex_2n40w_479";
  const previewTime = "_previewTime_2n40w_487";
  const previewEnd = "_previewEnd_2n40w_492";
  const footer = "_footer_2n40w_497";
  const exportButton = "_exportButton_2n40w_506";
  const status = "_status_2n40w_538";
  const statusOk = "_statusOk_2n40w_546";
  const statusError = "_statusError_2n40w_550";
  const statusInfo = "_statusInfo_2n40w_554";
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
    tabButtonActive,
    panels,
    panel,
    panelActive,
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
  function makeReminderRuleRow(index, rule) {
    const tr = document.createElement("tr");
    tr.className = cx(styles.alarmRow, !rule.isEnabled && styles.alarmOff);
    tr.dataset.reminderRuleId = rule.id;
    tr.dataset.reminderRuleIndex = String(index);
    const toggle2 = document.createElement("label");
    toggle2.className = styles.toggle;
    toggle2.title = rule.isEnabled ? "已启用" : "已禁用";
    toggle2.dataset.role = "reminder-rule-toggle";
    const chk = Object.assign(document.createElement("input"), {
      type: "checkbox",
      checked: rule.isEnabled
    });
    chk.dataset.role = "reminder-rule-enabled";
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
      value: String(rule.offset.minutesBeforeStart)
    });
    numInp.dataset.role = "reminder-rule-minutes";
    const tdMin = document.createElement("td");
    tdMin.append(numInp, " 分钟前");
    const select = Object.assign(document.createElement("select"), {
      className: styles.miniSelect
    });
    select.dataset.role = "reminder-rule-delivery";
    for (const [value, label2] of Object.entries(REMINDER_DELIVERY_LABELS)) {
      const option = Object.assign(document.createElement("option"), {
        value,
        textContent: label2
      });
      if (value === rule.delivery.kind) {
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
    delBtn.dataset.action = "delete-reminder-rule";
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
    code.textContent = "Reminder Program";
    fragment.append(
      "每条规则会先编译为内部提醒节点，再为每个日历事件写入一个 ",
      code,
      " → VALARM，可叠加多条。",
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
      { id: "reminder", label: "课前提醒" }
    ];
    for (const { id, label: label2 } of tabDefs) {
      const isActive = id === "export";
      const btn = Object.assign(document.createElement("button"), {
        type: "button",
        id: `ics-tab-btn-${id}`,
        className: cx(styles.tabButton, isActive && styles.tabButtonActive),
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
      className: cx(styles.panel, styles.panelActive),
      id: "ics-tab-export"
    });
    panelExport.dataset.role = "tab-panel";
    panelExport.setAttribute("role", "tabpanel");
    panelExport.setAttribute("aria-labelledby", "ics-tab-btn-export");
    panelExport.setAttribute("aria-hidden", "false");
    panelExport.hidden = false;
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
    panelSchedule.setAttribute("aria-hidden", "true");
    panelSchedule.hidden = true;
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
      id: "ics-tab-reminder"
    });
    panelAlarm.dataset.role = "tab-panel";
    panelAlarm.setAttribute("role", "tabpanel");
    panelAlarm.setAttribute("aria-labelledby", "ics-tab-btn-reminder");
    panelAlarm.setAttribute("aria-hidden", "true");
    panelAlarm.hidden = true;
    const alarmTip2 = Object.assign(document.createElement("div"), {
      className: cx(styles.tip, styles.alarmTip)
    });
    alarmTip2.appendChild(createAlarmTipContent());
    const alarmTbl = document.createElement("table");
    alarmTbl.className = styles.table;
    alarmTbl.appendChild(createTableHead(["开启", "提前时间", "提醒方式", ""]));
    const reminderRuleTb = document.createElement("tbody");
    reminderRuleTb.id = "ics-reminder-rule-tbody";
    cfg.reminderProgram.rules.forEach(
      (rule, index) => reminderRuleTb.appendChild(makeReminderRuleRow(index, rule))
    );
    alarmTbl.appendChild(reminderRuleTb);
    const addReminderRuleBtn = Object.assign(document.createElement("button"), {
      type: "button",
      id: "ics-add-reminder-rule-btn",
      className: styles.addButton,
      textContent: "＋ 添加提醒规则"
    });
    panelAlarm.append(alarmTip2, alarmTbl, addReminderRuleBtn);
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
      reminderRuleTb,
      addReminderRuleBtn,
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
      const dayNames = ["日", "一", "二", "三", "四", "五", "六"];
      setStatus(
        `⚠️ ${semStart} 是星期${dayNames[weekDay]}，请填写周一的日期`,
        "error"
      );
      startInp.focus();
      return;
    }
    setStatus("解析课表中…", "info");
    requestAnimationFrame(() => {
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
        const reminderSummary = summarizeReminderProgram(
          currentCfg.reminderProgram
        );
        const alarmSummary = reminderSummary.activeRuleCount ? `${reminderSummary.activeRuleCount} 条提醒规则` : "无提醒";
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
    });
  }
  function createDialogConfigStore(initialConfig) {
    const config = cloneConfig(initialConfig);
    return {
      getConfig() {
        return cloneConfig(config);
      },
      setDuration(value) {
        config.duration = normalizeDuration(value, config.duration);
        return cloneConfig(config);
      },
      setPeriodStart(index, start) {
        const current = config.periods[index];
        if (!current) {
          return cloneConfig(config);
        }
        config.periods[index] = normalizePeriod({ start }, current.start);
        return cloneConfig(config);
      },
      addPeriod(start) {
        config.periods.push(normalizePeriod({ start }));
        return cloneConfig(config);
      },
      removePeriod(index) {
        if (config.periods.length <= 1) {
          return cloneConfig(config);
        }
        config.periods.splice(index, 1);
        return cloneConfig(config);
      },
      setReminderRuleEnabled(ruleId, isEnabled) {
        config.reminderProgram.rules = config.reminderProgram.rules.map(
          (rule) => rule.id === ruleId ? createReminderRule({ ...rule, isEnabled }) : rule
        );
        return cloneConfig(config);
      },
      setReminderRuleMinutes(ruleId, minutesBeforeStart) {
        config.reminderProgram.rules = config.reminderProgram.rules.map(
          (rule) => rule.id === ruleId ? createReminderRule({
            ...rule,
            offset: { minutesBeforeStart }
          }) : rule
        );
        return cloneConfig(config);
      },
      setReminderRuleDelivery(ruleId, kind) {
        config.reminderProgram.rules = config.reminderProgram.rules.map(
          (rule) => rule.id === ruleId ? createReminderRule({
            ...rule,
            delivery: { kind }
          }) : rule
        );
        return cloneConfig(config);
      },
      addReminderRule(rule = {}) {
        config.reminderProgram.rules.push(createReminderRule(rule));
        return cloneConfig(config);
      },
      removeReminderRule(ruleId) {
        if (config.reminderProgram.rules.length <= 1) {
          return cloneConfig(config);
        }
        config.reminderProgram.rules = config.reminderProgram.rules.filter(
          (rule) => rule.id !== ruleId
        );
        return cloneConfig(config);
      }
    };
  }
  function renderPeriodRows(periodTb, { periods, duration }) {
    periodTb.replaceChildren(
      ...periods.map((period, index) => makePeriodRow(index, period.start, duration))
    );
  }
  function renderReminderRuleRows(reminderRuleTb, rules) {
    reminderRuleTb.replaceChildren(
      ...rules.map((rule, index) => makeReminderRuleRow(index, rule))
    );
  }
  function refreshPeriodTable(periodTb, { periods, duration }) {
    periodTb.querySelectorAll("tr[data-idx]").forEach((tr, index) => {
      const period = periods[index];
      tr.dataset.idx = String(index);
      const noEl = tr.querySelector('[data-cell="period-index"]');
      const endEl = tr.querySelector('[data-cell="period-end"]');
      const startEl = tr.querySelector(
        '[data-role="period-start"]'
      );
      if (noEl) {
        noEl.textContent = String(index + 1);
      }
      if (startEl && period && startEl.value !== period.start) {
        startEl.value = period.start;
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
  let syncExistingUI = null;
  function setActiveTab(tabBar, panelsEl, tabId) {
    for (const tabButton2 of Array.from(
      tabBar.querySelectorAll('[data-role="tab-button"]')
    )) {
      const active = tabButton2.dataset.tab === tabId;
      tabButton2.classList.toggle(styles.tabButtonActive, active);
      tabButton2.setAttribute("aria-selected", String(active));
    }
    for (const panel2 of Array.from(
      panelsEl.querySelectorAll('[data-role="tab-panel"]')
    )) {
      const active = panel2.id === `ics-tab-${tabId}`;
      panel2.classList.toggle(styles.panelActive, active);
      panel2.hidden = !active;
      panel2.setAttribute("aria-hidden", String(!active));
    }
  }
  function createUI() {
    if (document.getElementById("ics-dialog")) {
      syncExistingUI?.();
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
      reminderRuleTb,
      addReminderRuleBtn,
      exportBtn,
      statusEl
    } = createDialogElements(cfg, defaultDate);
    let store = createDialogConfigStore(cfg);
    syncExistingUI = () => {
      const latest = getConfig();
      store = createDialogConfigStore(latest);
      durInp.value = String(latest.duration);
      renderPeriodRows(periodTb, latest);
      refreshPeriodTable(periodTb, latest);
      renderReminderRuleRows(reminderRuleTb, latest.reminderProgram.rules);
      refreshPreview(previewList, latest);
    };
    function openDialog2() {
      syncExistingUI?.();
      backdrop2.classList.add(styles.dialogOpen);
      dialog2.classList.add(styles.dialogOpen);
      dialog2.setAttribute("aria-hidden", "false");
      refreshPreview(previewList, store.getConfig());
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
    document.getElementById("ics-trigger-btn")?.addEventListener("click", openDialog2);
    tabBar.addEventListener("click", (event) => {
      const btn = event.target.closest(
        '[data-role="tab-button"]'
      );
      if (!btn) {
        return;
      }
      const tabId = btn.dataset.tab;
      if (!tabId) {
        return;
      }
      setActiveTab(tabBar, panelsEl, tabId);
      if (tabId === "export") {
        refreshPreview(previewList, store.getConfig());
      }
    });
    function persistConfig() {
      const current = store.getConfig();
      saveConfig(current);
      return current;
    }
    function onPeriodChange(current = store.getConfig()) {
      saveConfig(current);
      durInp.value = String(current.duration);
      refreshPeriodTable(periodTb, current);
      refreshPreview(previewList, current);
    }
    function onReminderChange(current = store.getConfig()) {
      saveConfig(current);
      renderReminderRuleRows(reminderRuleTb, current.reminderProgram.rules);
    }
    refreshPreview(previewList, store.getConfig());
    renderReminderRuleRows(reminderRuleTb, store.getConfig().reminderProgram.rules);
    durInp.addEventListener("input", () => {
      onPeriodChange(store.setDuration(durInp.value));
    });
    periodTb.addEventListener("input", (event) => {
      const target = event.target;
      if (target.matches('[data-role="period-start"]')) {
        const row2 = target.closest("tr[data-idx]");
        const index = Number.parseInt(row2?.dataset.idx ?? "-1", 10);
        onPeriodChange(store.setPeriodStart(index, target.value));
      }
    });
    periodTb.addEventListener("click", (event) => {
      const btn = event.target.closest(
        '[data-action="delete-period"]'
      );
      if (!btn) {
        return;
      }
      const row2 = btn.closest("tr[data-idx]");
      const index = Number.parseInt(row2?.dataset.idx ?? "-1", 10);
      const next = store.removePeriod(index);
      renderPeriodRows(periodTb, next);
      onPeriodChange(next);
    });
    addPeriodBtn.addEventListener("click", () => {
      const current = store.getConfig();
      const lastStart = current.periods.at(-1)?.start ?? "08:00";
      const nextStart = addMinutes(lastStart, current.duration + 10);
      const next = store.addPeriod(nextStart);
      renderPeriodRows(periodTb, next);
      onPeriodChange(next);
    });
    reminderRuleTb.addEventListener("change", (event) => {
      const target = event.target;
      const row2 = target.closest("tr[data-reminder-rule-id]");
      const ruleId = row2?.dataset.reminderRuleId;
      if (!ruleId) {
        return;
      }
      if (target.matches('[data-role="reminder-rule-enabled"]')) {
        onReminderChange(
          store.setReminderRuleEnabled(
            ruleId,
            target.checked
          )
        );
      }
      if (target.matches('[data-role="reminder-rule-delivery"]')) {
        onReminderChange(
          store.setReminderRuleDelivery(
            ruleId,
            target.value
          )
        );
      }
    });
    reminderRuleTb.addEventListener("input", (event) => {
      const target = event.target;
      if (target.matches('[data-role="reminder-rule-minutes"]')) {
        const row2 = target.closest("tr[data-reminder-rule-id]");
        const ruleId = row2?.dataset.reminderRuleId;
        if (!ruleId) {
          return;
        }
        onReminderChange(
          store.setReminderRuleMinutes(
            ruleId,
            Number.parseInt(target.value, 10)
          )
        );
      }
    });
    reminderRuleTb.addEventListener("click", (event) => {
      const btn = event.target.closest(
        '[data-action="delete-reminder-rule"]'
      );
      if (!btn) {
        return;
      }
      const row2 = btn.closest("tr[data-reminder-rule-id]");
      const ruleId = row2?.dataset.reminderRuleId;
      if (!ruleId) {
        return;
      }
      onReminderChange(store.removeReminderRule(ruleId));
    });
    addReminderRuleBtn.addEventListener("click", () => {
      onReminderChange(store.addReminderRule());
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
      const currentCfg = persistConfig();
      handleExportAction({
        semKey,
        startInp,
        readConfig: () => currentCfg,
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
    return document.querySelector('table[id^="kbgrid_table_"] .timetable_con') !== null;
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
        alert("请先点击「查询」按钮加载表格课表，再导出日历。");
        return;
      }
      createUI();
      openDialog();
    });
  }
  function ensureUI() {
    earlyInjectButton();
    createUI();
  }
  function init() {
    if (isTimetableReady()) {
      ensureUI();
      return;
    }
    const observer = new MutationObserver(() => {
      if (document.getElementById("tb") && !document.getElementById("ics-trigger-btn")) {
        earlyInjectButton();
      }
      if (isTimetableReady()) {
        observer.disconnect();
        ensureUI();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    if (document.getElementById("tb")) {
      earlyInjectButton();
    }
  }
  init();

})();