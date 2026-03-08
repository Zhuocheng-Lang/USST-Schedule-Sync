// ==UserScript==
// @name               USST Schedule Sync
// @name:zh-CN         USST 课表同步
// @namespace          https://github.com/Zhuocheng-Lang/USST-Schedule-Sync
// @version            1.1.0
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

  o(' ._backdrop_1548o_1{display:none;position:fixed;inset:0;z-index:99998;background:#00000080}._backdrop_1548o_1._dialogOpen_1548o_9{display:block;animation:_backdropIn_1548o_1 .15s linear forwards}@keyframes _backdropIn_1548o_1{0%{opacity:0}to{opacity:1}}._dialog_1548o_9{display:none;position:fixed;z-index:99999;top:50%;left:50%;transform:translate(-50%,-50%);width:500px;max-width:calc(100vw - 20px);max-height:calc(100vh - 20px);background:#fff;border:1px solid rgba(0,0,0,.2);border-radius:6px;box-shadow:0 5px 15px #00000080;font-family:Helvetica Neue,Helvetica,PingFang SC,Microsoft YaHei,Arial,sans-serif;font-size:14px;color:#333;flex-direction:column;background-clip:padding-box}._dialog_1548o_9._dialogOpen_1548o_9{display:flex;animation:_dialogIn_1548o_1 .3s ease-out forwards}@keyframes _dialogIn_1548o_1{0%{opacity:0;transform:translate(-50%,-50%) scale(.98)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}._header_1548o_64{display:flex;align-items:center;justify-content:space-between;padding:15px;border-bottom:1px solid #e5e5e5;flex-shrink:0}._headerTitle_1548o_73{display:flex;align-items:center;gap:10px}._logo_1548o_79{width:30px;height:30px;border-radius:4px;flex-shrink:0;background:#337ab7;display:flex;align-items:center;justify-content:center;font-size:18px;color:#fff}._titleText_1548o_92{font-size:18px;font-weight:500;line-height:1.1}._titleSub_1548o_98{font-size:12px;color:#777;margin-top:2px}._closeButton_1548o_104{width:24px;height:24px;background:transparent;border:none;font-size:21px;font-weight:700;color:#000;text-shadow:0 1px 0 #fff;opacity:.2;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:opacity .15s}._closeButton_1548o_104:hover{opacity:.5}._closeButton_1548o_104:focus-visible{outline:none;opacity:.5}._tabs_1548o_130{display:flex;margin:15px 15px 0;flex-shrink:0;border-bottom:1px solid #ddd}._tabButton_1548o_137{padding:10px 15px;border:1px solid transparent;background:transparent;font-size:14px;color:#337ab7;cursor:pointer;margin-bottom:-1px;border-radius:4px 4px 0 0;line-height:1.42857143}._tabButtonActive_1548o_149{color:#555;background-color:#fff;border-color:#ddd #ddd transparent;border-bottom-color:transparent;cursor:default}._tabButton_1548o_137:hover:not(._tabButtonActive_1548o_149){background-color:#eee;border-color:#eee #eee #ddd}._tabButton_1548o_137:focus-visible{outline:none}._panels_1548o_166{overflow-y:auto;overflow-x:hidden;flex:1 1 auto;min-height:0;max-height:54vh;padding:15px}._panel_1548o_166{display:none}._panelActive_1548o_179{display:block}._row_1548o_183{margin-bottom:15px}._row_1548o_183:last-child{margin-bottom:0}._label_1548o_191{display:inline-block;align-items:center;gap:5px;max-width:100%;margin-bottom:5px;font-weight:700;color:#333;font-size:14px}._required_1548o_202{color:#a94442}._field_1548o_206{display:block;width:100%;height:34px;padding:6px 12px;font-family:inherit;font-size:14px;line-height:1.42857143;color:#555;background-color:#fff;background-image:none;border:1px solid #ccc;border-radius:4px;box-shadow:inset 0 1px 1px #00000013;transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s}._field_1548o_206:focus{border-color:#66afe9;outline:0;box-shadow:inset 0 1px 1px #00000013,0 0 8px #66afe999}._tip_1548o_233{display:block;font-size:12px;color:#737373;margin-top:5px;margin-bottom:10px}._scheduleTip_1548o_241{margin-top:8px}._alarmTip_1548o_245{margin-bottom:12px}._presetGrid_1548o_249{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}._presetButton_1548o_255{display:flex;flex-direction:column;align-items:flex-start;gap:4px;min-height:78px;padding:10px 12px;border:1px solid #d9e3ec;border-radius:6px;background:#fafcfe;color:#2f4858;cursor:pointer;text-align:left}._presetButton_1548o_255:hover{border-color:#8db3cf;background:#f3f8fc}._presetButtonActive_1548o_275{border-color:#337ab7;background:#eaf4fb;box-shadow:inset 0 0 0 1px #337ab726}._presetButtonTitle_1548o_281{font-size:14px;font-weight:600;color:#1f3a4d}._presetButtonDesc_1548o_287{font-size:12px;line-height:1.5;color:#5e6f7d}._reminderSummary_1548o_293{padding:10px 12px;border:1px solid #dbe5eb;border-radius:6px;background:#f8fbfd;color:#284051;font-size:13px}._reminderPreviewList_1548o_302{margin:8px 0 0;padding-left:18px;color:#52606d;font-size:13px}._reminderPreviewList_1548o_302 li+li{margin-top:4px}._reminderCardList_1548o_313{display:grid;gap:10px}._reminderCard_1548o_313{padding:12px;border:1px solid #dfe7ed;border-radius:6px;background:#fff}._reminderCardOff_1548o_325{background:#f8f8f8}._reminderCardOff_1548o_325 ._reminderCardForm_1548o_329,._reminderCardOff_1548o_325 ._reminderCardHint_1548o_330,._reminderCardOff_1548o_325 ._reminderCardMeta_1548o_331{opacity:.55}._reminderCardHeader_1548o_335{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}._reminderCardTitleWrap_1548o_342{min-width:0}._reminderCardTitle_1548o_342{font-size:14px;font-weight:600;color:#243746}._reminderCardMeta_1548o_331{margin-top:2px;font-size:12px;color:#647786}._reminderCardActions_1548o_358{display:flex;align-items:center;gap:10px}._reminderCardForm_1548o_329{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:12px}._compactField_1548o_371{display:flex;flex-direction:column;gap:6px}._compactFieldLabel_1548o_377{font-size:12px;color:#5f6b76}._compactFieldControl_1548o_382{display:flex;align-items:center;gap:8px}._compactFieldSuffix_1548o_388{font-size:12px;color:#60717f}._reminderCardHint_1548o_330{margin-top:10px;font-size:12px;line-height:1.5;color:#6a7782}._emptyState_1548o_400{padding:14px 16px;border:1px dashed #c8d4dd;border-radius:6px;background:#fbfcfd;color:#60717f;font-size:13px;line-height:1.6}._twoColumn_1548o_410{display:grid;grid-template-columns:1fr 1fr;gap:15px}._sectionHeading_1548o_416{font-size:16px;font-weight:500;color:#333;margin:20px 0 10px;padding-bottom:5px;border-bottom:1px solid #eee}._sectionHeading_1548o_416:first-child{margin-top:0}._table_1548o_429{width:100%;max-width:100%;margin-bottom:20px;background-color:transparent;border-collapse:collapse;border-spacing:0;font-size:14px}._table_1548o_429 th,._table_1548o_429 td{padding:8px;line-height:1.42857143;vertical-align:middle;border-top:1px solid #ddd}._table_1548o_429 th{text-align:left;font-weight:700;color:#333;border-bottom:2px solid #ddd}._table_1548o_429 tbody tr:nth-of-type(odd){background-color:#f9f9f9}._cellNo_1548o_458{color:#777;width:30px;text-align:center}._cellEnd_1548o_464{color:#777;padding-left:5px!important;white-space:nowrap}._toggleCell_1548o_470{width:45px;text-align:center}._timeInput_1548o_475,._miniNumber_1548o_476,._miniSelect_1548o_477{display:inline-block;height:30px;padding:5px 10px;font-size:12px;line-height:1.5;color:#555;background-color:#fff;background-image:none;border:1px solid #ccc;border-radius:3px;box-shadow:inset 0 1px 1px #00000013;transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s}._timeInput_1548o_475:focus,._miniNumber_1548o_476:focus,._miniSelect_1548o_477:focus{border-color:#66afe9;outline:0;box-shadow:inset 0 1px 1px #00000013,0 0 8px #66afe999}._timeInput_1548o_475{width:80px;text-align:center}._miniNumber_1548o_476{width:60px;text-align:center}._miniSelect_1548o_477{cursor:pointer}._deleteButton_1548o_518{background:none;border:none;color:#a94442;cursor:pointer;font-size:18px;line-height:1;padding:2px 5px;border-radius:3px;opacity:.6}._deleteButton_1548o_518:hover{opacity:1}._deleteButton_1548o_518:focus-visible{outline:none;opacity:1}._addButton_1548o_539{display:inline-block;margin-top:10px;padding:6px 12px;margin-bottom:0;font-size:14px;font-weight:400;line-height:1.42857143;text-align:center;white-space:nowrap;vertical-align:middle;cursor:pointer;background-image:none;border:1px dashed #ccc;border-radius:4px;color:#333;background-color:#fff}._addButton_1548o_539:hover{color:#333;background-color:#e6e6e6;border-color:#adadad}._addButton_1548o_539:focus-visible{outline:none}._toggle_1548o_470{position:relative;display:inline-block;width:32px;height:20px}._toggle_1548o_470 input{position:absolute;opacity:0;width:100%;height:100%;margin:0;cursor:pointer}._toggleTrack_1548o_584{position:absolute;inset:0;pointer-events:none;background:#ccc;border-radius:10px;transition:background .2s}._toggleTrack_1548o_584:before{content:"";position:absolute;width:14px;height:14px;left:3px;bottom:3px;background:#fff;border-radius:50%;transition:transform .2s;box-shadow:0 1px 2px #0003}._toggle_1548o_470 input:checked~._toggleTrack_1548o_584{background:#337ab7}._toggle_1548o_470 input:checked~._toggleTrack_1548o_584:before{transform:translate(12px)}._toggle_1548o_470 input:focus-visible~._toggleTrack_1548o_584{outline:2px solid #66afe9;outline-offset:2px}._preview_1548o_619{margin:6px 0 0;padding:0;display:grid;grid-template-columns:repeat(2,1fr)}._preview_1548o_619 li{list-style:none;display:flex;gap:6px;align-items:baseline;font-size:14px;line-height:1.5}._previewIndex_1548o_635{color:#777;width:16px;text-align:right;flex-shrink:0;font-size:12px}._previewTime_1548o_643{color:#333;font-variant-numeric:tabular-nums}._previewEnd_1548o_648{color:#777;font-size:12px}._footer_1548o_653{padding:15px;border-top:1px solid #e5e5e5;display:flex;align-items:center;gap:15px;flex-shrink:0}._exportButton_1548o_662{display:inline-block;padding:6px 12px;margin-bottom:0;font-size:14px;font-weight:400;line-height:1.42857143;text-align:center;white-space:nowrap;vertical-align:middle;cursor:pointer;background-image:none;border:1px solid transparent;border-radius:4px;color:#fff;background-color:#337ab7;border-color:#2e6da4;box-shadow:none}._exportButton_1548o_662:hover{color:#fff;background-color:#286090;border-color:#204d74}._exportButton_1548o_662:focus-visible{outline:thin dotted;outline:5px auto -webkit-focus-ring-color;outline-offset:-2px}._status_1548o_694{flex:1;font-size:14px;min-height:16px;line-height:1.5;word-break:break-word}._statusWrap_1548o_702{flex:1;min-width:0}._statusActions_1548o_707{display:flex;justify-content:flex-end;margin-top:6px}._statusDetailButton_1548o_713{padding:0;border:0;background:transparent;color:#337ab7;cursor:pointer;font-size:12px}._statusDetailButton_1548o_713:hover{color:#23527c;text-decoration:underline}._statusDetailButton_1548o_713:focus-visible{outline:2px solid #23527c;outline-offset:2px}._statusDetail_1548o_713{margin:8px 0 0;padding:10px 12px;border-radius:4px;background:#f8f8f8;border:1px solid #e5e5e5;color:#444;font-size:12px;line-height:1.5;white-space:pre-wrap;word-break:break-word;overflow-x:auto}._statusOk_1548o_746{color:#3c763d}._statusError_1548o_750{color:#a94442}._statusInfo_1548o_754{color:#777}@media(max-width:640px){._twoColumn_1548o_410,._presetGrid_1548o_249,._reminderCardForm_1548o_329,._preview_1548o_619{grid-template-columns:1fr}._footer_1548o_653{flex-direction:column;align-items:stretch}} ');

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
  const DEFAULT_LOG_LEVEL = "warn";
  const DEFAULT_LOG_MAX_ENTRIES = 200;
  const LOG_LEVEL_PRIORITY = {
    silent: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4
  };
  function isRecord$2(value) {
    return typeof value === "object" && value !== null;
  }
  function cloneLoggingConfig$1(config) {
    return {
      level: config.level,
      maxEntries: config.maxEntries
    };
  }
  function createDefaultLoggingConfig() {
    return {
      level: DEFAULT_LOG_LEVEL,
      maxEntries: DEFAULT_LOG_MAX_ENTRIES
    };
  }
  function normalizeLogLevel(value, fallback = DEFAULT_LOG_LEVEL) {
    return value === "silent" || value === "error" || value === "warn" || value === "info" || value === "debug" ? value : fallback;
  }
  function normalizeLoggingConfig$1(value, fallback = createDefaultLoggingConfig()) {
    if (!isRecord$2(value)) {
      return cloneLoggingConfig$1(fallback);
    }
    const parsedMaxEntries = Number.parseInt(
      String(value.maxEntries ?? fallback.maxEntries),
      10
    );
    const maxEntries = Number.isFinite(parsedMaxEntries) ? Math.max(20, Math.min(1e3, parsedMaxEntries)) : fallback.maxEntries;
    return {
      level: normalizeLogLevel(value.level, fallback.level),
      maxEntries
    };
  }
  function isRecord$1(value) {
    return typeof value === "object" && value !== null;
  }
  function cloneContext(context) {
    return context ? { ...context } : void 0;
  }
  function serializeError(error) {
    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack
      };
    }
    if (typeof error === "string") {
      return {
        name: "Error",
        message: error
      };
    }
    if (isRecord$1(error)) {
      return {
        name: typeof error.name === "string" && error.name.trim() ? error.name : "Error",
        message: typeof error.message === "string" && error.message.trim() ? error.message : JSON.stringify(error),
        stack: typeof error.stack === "string" ? error.stack : void 0
      };
    }
    if (error === void 0) {
      return void 0;
    }
    return {
      name: "Error",
      message: String(error)
    };
  }
  function shouldLog(config, level) {
    return config.level !== "silent" && LOG_LEVEL_PRIORITY[level] <= LOG_LEVEL_PRIORITY[config.level];
  }
  function consoleMethod(level) {
    if (level === "error") {
      return "error";
    }
    if (level === "warn") {
      return "warn";
    }
    if (level === "info") {
      return "info";
    }
    return "debug";
  }
  class RootLogger {
    config = createDefaultLoggingConfig();
    entries = [];
    setConfig(config) {
      this.config = cloneLoggingConfig$1(config);
      this.trimEntries();
    }
    getConfig() {
      return cloneLoggingConfig$1(this.config);
    }
    child(moduleName, baseContext) {
      const buildOptions = (options) => ({
        traceId: options?.traceId,
        error: options?.error,
        context: {
          ...baseContext ?? {},
          ...options?.context ?? {}
        }
      });
      return {
        debug: (message, options) => this.write("debug", moduleName, message, buildOptions(options)),
        info: (message, options) => this.write("info", moduleName, message, buildOptions(options)),
        warn: (message, options) => this.write("warn", moduleName, message, buildOptions(options)),
        error: (message, options) => this.write("error", moduleName, message, buildOptions(options))
      };
    }
    write(level, moduleName, message, options = {}) {
      if (!shouldLog(this.config, level)) {
        return null;
      }
      const entry = {
        id: this.createTraceId("log"),
        timestamp: ( new Date()).toISOString(),
        level,
        module: moduleName,
        message,
        traceId: options.traceId,
        context: cloneContext(options.context),
        error: serializeError(options.error)
      };
      this.entries.push(entry);
      this.trimEntries();
      this.writeConsole(entry);
      return {
        ...entry,
        context: cloneContext(entry.context),
        error: entry.error ? { ...entry.error } : void 0
      };
    }
    getEntries() {
      return this.entries.map((entry) => ({
        ...entry,
        context: cloneContext(entry.context),
        error: entry.error ? { ...entry.error } : void 0
      }));
    }
    getLastError() {
      for (let index = this.entries.length - 1; index >= 0; index -= 1) {
        const entry = this.entries[index];
        if (entry.level === "error") {
          return {
            ...entry,
            context: cloneContext(entry.context),
            error: entry.error ? { ...entry.error } : void 0
          };
        }
      }
      return null;
    }
    clear() {
      this.entries = [];
    }
    createTraceId(scope = "trace") {
      return stableUid(
        `${scope}:${Date.now()}:${Math.random()}:${this.entries.length}`,
        `usst.${scope}`
      ).split("@")[0];
    }
    trimEntries() {
      if (this.entries.length <= this.config.maxEntries) {
        return;
      }
      this.entries.splice(0, this.entries.length - this.config.maxEntries);
    }
    writeConsole(entry) {
      const prefix = [
        "[USST Schedule Sync]",
        `[${entry.level}]`,
        `[${entry.module}]`,
        entry.traceId ? `[${entry.traceId}]` : ""
      ].join("");
      const extra = [];
      if (entry.context && Object.keys(entry.context).length) {
        extra.push(entry.context);
      }
      if (entry.error) {
        extra.push(entry.error);
      }
      console[consoleMethod(entry.level)](`${prefix} ${entry.message}`, ...extra);
    }
  }
  const rootLogger = new RootLogger();
  function configureLogger(config) {
    rootLogger.setConfig(config);
  }
  function createTraceId(scope) {
    return rootLogger.createTraceId(scope);
  }
  function formatLogEntryForDisplay(entry) {
    if (!entry) {
      return "";
    }
    const lines = [
      `时间：${entry.timestamp}`,
      `级别：${entry.level.toUpperCase()}`,
      `模块：${entry.module}`
    ];
    if (entry.traceId) {
      lines.push(`追踪 ID：${entry.traceId}`);
    }
    lines.push(`消息：${entry.message}`);
    if (entry.context && Object.keys(entry.context).length) {
      lines.push(`上下文：${JSON.stringify(entry.context, null, 2)}`);
    }
    if (entry.error) {
      lines.push(`错误：${entry.error.name}: ${entry.error.message}`);
      if (entry.error.stack) {
        lines.push(`堆栈：
${entry.error.stack}`);
      }
    }
    return lines.join("\n");
  }
  const logger = {
    child: (moduleName, baseContext) => rootLogger.child(moduleName, baseContext),
    debug: (moduleName, message, options) => rootLogger.write("debug", moduleName, message, options),
    info: (moduleName, message, options) => rootLogger.write("info", moduleName, message, options),
    warn: (moduleName, message, options) => rootLogger.write("warn", moduleName, message, options),
    error: (moduleName, message, options) => rootLogger.write("error", moduleName, message, options)
  };
  const DEFAULT_PERIOD_START = "08:00";
  const DEFAULT_REMINDER_LEAD_MINUTES = 15;
  const DEFAULT_REMINDER_DELIVERY_KIND = "DISPLAY";
  const DEFAULT_REMINDER_PRESET_ID = "standard";
  const REMINDER_DELIVERY_LABELS = {
    DISPLAY: "静默通知",
    AUDIO: "响铃提醒"
  };
  const REMINDER_PRESET_DEFINITIONS = [
    {
      id: "disabled",
      label: "关闭提醒",
      description: "不导出任何 VALARM 节点。",
      rules: []
    },
    {
      id: "standard",
      label: "标准方案",
      description: "开课前 15 分钟发一条静默通知。",
      rules: [
        {
          isEnabled: true,
          offset: { minutesBeforeStart: 15 },
          delivery: { kind: "DISPLAY" }
        }
      ]
    },
    {
      id: "focus",
      label: "双提醒方案",
      description: "开课前 30 分钟和 10 分钟各提醒一次。",
      rules: [
        {
          isEnabled: true,
          offset: { minutesBeforeStart: 30 },
          delivery: { kind: "DISPLAY" }
        },
        {
          isEnabled: true,
          offset: { minutesBeforeStart: 10 },
          delivery: { kind: "DISPLAY" }
        }
      ]
    },
    {
      id: "urgent",
      label: "临近上课",
      description: "先静默提醒，再在上课前 5 分钟响铃。",
      rules: [
        {
          isEnabled: true,
          offset: { minutesBeforeStart: 15 },
          delivery: { kind: "DISPLAY" }
        },
        {
          isEnabled: true,
          offset: { minutesBeforeStart: 5 },
          delivery: { kind: "AUDIO" }
        }
      ]
    }
  ];
  const REMINDER_PRESET_MAP = new Map(
    REMINDER_PRESET_DEFINITIONS.map((preset) => [preset.id, preset])
  );
  function isReminderPresetId(value) {
    return value === "disabled" || value === "standard" || value === "focus" || value === "urgent" || value === "custom";
  }
  function ruleSignature(rule) {
    return [
      String(rule.isEnabled),
      String(rule.offset.minutesBeforeStart),
      rule.delivery.kind,
      rule.template.kind
    ].join("|");
  }
  function findReminderPresetDefinition(presetId) {
    return REMINDER_PRESET_MAP.get(presetId) ?? REMINDER_PRESET_MAP.get(DEFAULT_REMINDER_PRESET_ID);
  }
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
      version: 3,
      presetId: program.presetId,
      rules: program.rules.map(cloneReminderRule)
    };
  }
  function cloneLoggingConfig(config) {
    return cloneLoggingConfig$1(config);
  }
  function normalizeLoggingConfig(value, fallback = createDefaultLoggingConfig()) {
    return normalizeLoggingConfig$1(value, fallback);
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
      (period, index) => normalizePeriod(
        period,
        fallbackPeriods[index]?.start ?? DEFAULT_PERIOD_START
      )
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
      template: { kind: "course-start-countdown" }
    };
  }
  function formatReminderLeadTime(minutesBeforeStart) {
    let remainingMinutes = Math.max(1, Math.floor(minutesBeforeStart));
    const days = Math.floor(remainingMinutes / (24 * 60));
    remainingMinutes -= days * 24 * 60;
    const hours = Math.floor(remainingMinutes / 60);
    remainingMinutes -= hours * 60;
    const parts = [];
    if (days) {
      parts.push(`${days} 天`);
    }
    if (hours) {
      parts.push(`${hours} 小时`);
    }
    if (remainingMinutes || !parts.length) {
      parts.push(`${remainingMinutes} 分钟`);
    }
    return `${parts.join(" ")}前`;
  }
  function describeReminderRule(rule) {
    return `${formatReminderLeadTime(rule.offset.minutesBeforeStart)} · ${REMINDER_DELIVERY_LABELS[rule.delivery.kind]}`;
  }
  function createReminderProgramFromPreset(presetId) {
    const preset = findReminderPresetDefinition(presetId);
    return {
      version: 3,
      presetId,
      rules: preset.rules.map((rule) => createReminderRule(rule))
    };
  }
  function detectReminderPresetId(rules) {
    const target = rules.map(ruleSignature);
    for (const preset of REMINDER_PRESET_DEFINITIONS) {
      const source = preset.rules.map(
        (rule) => ruleSignature(createReminderRule(rule))
      );
      if (source.length === target.length && source.every((signature, index) => signature === target[index])) {
        return preset.id;
      }
    }
    return "custom";
  }
  function createReminderProgram(draft = {}) {
    const normalizedRules = Array.isArray(draft.rules) ? draft.rules.map((rule) => createReminderRule(rule)) : void 0;
    const preferredPresetId = isReminderPresetId(draft.presetId) ? draft.presetId : void 0;
    const preferredConcretePresetId = preferredPresetId && preferredPresetId !== "custom" ? preferredPresetId : void 0;
    if (preferredConcretePresetId && !normalizedRules) {
      return createReminderProgramFromPreset(preferredConcretePresetId);
    }
    const rules = normalizedRules ?? cloneReminderProgram(
      createReminderProgramFromPreset(DEFAULT_REMINDER_PRESET_ID)
    ).rules;
    const detectedPresetId = detectReminderPresetId(rules);
    const presetId = preferredPresetId === "custom" ? "custom" : preferredConcretePresetId && detectedPresetId === preferredConcretePresetId ? preferredConcretePresetId : detectedPresetId;
    return {
      version: 3,
      presetId,
      rules
    };
  }
  function normalizeReminderProgram(program, fallbackProgram) {
    if (!program) {
      return cloneReminderProgram(fallbackProgram);
    }
    const draft = program;
    if (!Array.isArray(draft.rules)) {
      return cloneReminderProgram(fallbackProgram);
    }
    return createReminderProgram({
      version: draft.version,
      presetId: draft.presetId,
      rules: draft.rules
    });
  }
  function summarizeReminderProgram(program) {
    const totalRuleCount = program.rules.length;
    const activeRules = program.rules.filter((rule) => rule.isEnabled);
    const presetLabel = program.presetId === "custom" ? "自定义方案" : findReminderPresetDefinition(program.presetId).label;
    return {
      presetId: program.presetId,
      presetLabel,
      totalRuleCount,
      activeRuleCount: activeRules.length,
      activeRuleDescriptions: activeRules.map(describeReminderRule)
    };
  }
  function createCustomReminderRule() {
    return createReminderRule({
      isEnabled: true,
      offset: { minutesBeforeStart: 10 },
      delivery: { kind: "DISPLAY" }
    });
  }
  function setReminderProgramPreset(program, presetId) {
    if (presetId === "custom") {
      return createReminderProgram({
        presetId,
        rules: program.rules
      });
    }
    return createReminderProgramFromPreset(presetId);
  }
  function setReminderProgramRules(rules, presetId = "custom") {
    return createReminderProgram({
      presetId,
      rules
    });
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
  const DEFAULT_REMINDER_PROGRAM = createReminderProgramFromPreset("standard");
  const DEFAULT_LOGGING_CONFIG = createDefaultLoggingConfig();
  const STORAGE_NAMESPACE = "ics_";
  const STORED_DURATION_VERSION = 1;
  const STORED_PERIODS_VERSION = 1;
  const STORED_REMINDER_PROGRAM_VERSION = 1;
  const STORED_LOGGING_CONFIG_VERSION = 1;
  const STORED_SEMESTER_START_VERSION = 1;
  function isRecord(value) {
    return typeof value === "object" && value !== null;
  }
  function isStoredDurationV1(value) {
    return isRecord(value) && value.version === STORED_DURATION_VERSION && "data" in value;
  }
  function isStoredPeriodsV1(value) {
    return isRecord(value) && value.version === STORED_PERIODS_VERSION && "data" in value;
  }
  function isStoredReminderProgramV1(value) {
    return isRecord(value) && value.version === STORED_REMINDER_PROGRAM_VERSION && "data" in value;
  }
  function isStoredLoggingConfigV1(value) {
    return isRecord(value) && value.version === STORED_LOGGING_CONFIG_VERSION && "data" in value;
  }
  function isStoredSemesterStartV1(value) {
    return isRecord(value) && value.version === STORED_SEMESTER_START_VERSION && "data" in value;
  }
  function parseStoredDuration(raw) {
    if (raw === null) {
      return null;
    }
    try {
      const parsed = JSON.parse(raw);
      if (!isStoredDurationV1(parsed)) {
        return null;
      }
      return normalizeDuration(
        parsed.data,
        DEFAULT_DURATION
      );
    } catch {
      return null;
    }
  }
  function serializeStoredDuration(value) {
    return JSON.stringify({
      version: STORED_DURATION_VERSION,
      data: value
    });
  }
  function parseStoredPeriods(raw) {
    if (raw === null) {
      return null;
    }
    try {
      const parsed = JSON.parse(raw);
      if (!isStoredPeriodsV1(parsed)) {
        return null;
      }
      return normalizePeriods(
        parsed.data,
        DEFAULT_PERIODS
      );
    } catch {
      return null;
    }
  }
  function serializeStoredPeriods(periods) {
    return JSON.stringify({
      version: STORED_PERIODS_VERSION,
      data: periods
    });
  }
  function parseStoredReminderProgram(raw) {
    if (raw === null) {
      return null;
    }
    try {
      const parsed = JSON.parse(raw);
      if (!isStoredReminderProgramV1(parsed)) {
        return null;
      }
      return normalizeReminderProgram(
        parsed.data,
        DEFAULT_REMINDER_PROGRAM
      );
    } catch {
      return null;
    }
  }
  function serializeStoredReminderProgram(program) {
    return JSON.stringify({
      version: STORED_REMINDER_PROGRAM_VERSION,
      data: program
    });
  }
  function parseStoredLoggingConfig(raw) {
    if (raw === null) {
      return null;
    }
    try {
      const parsed = JSON.parse(raw);
      if (!isStoredLoggingConfigV1(parsed)) {
        return null;
      }
      return normalizeLoggingConfig(parsed.data, DEFAULT_LOGGING_CONFIG);
    } catch {
      return null;
    }
  }
  function parseStoredSemesterStart(raw) {
    if (raw === null) {
      return null;
    }
    try {
      const parsed = JSON.parse(raw);
      if (!isStoredSemesterStartV1(parsed)) {
        return null;
      }
      return typeof parsed.data === "string" ? parsed.data : null;
    } catch {
      return null;
    }
  }
  function serializeStoredSemesterStart(value) {
    return JSON.stringify({
      version: STORED_SEMESTER_START_VERSION,
      data: value
    });
  }
  const DURATION_STORAGE_KEY = "duration";
  const PERIODS_STORAGE_KEY = "periods";
  const REMINDER_PROGRAM_STORAGE_KEY = "reminder_program";
  const LOGGING_STORAGE_KEY = "logging";
  const SEMESTER_START_STORAGE_PREFIX = "semstart_";
  const storageLogger = logger.child("config.storage");
  function readStoredString(key) {
    if (typeof GM_getValue !== "function") {
      return null;
    }
    try {
      const raw = GM_getValue(STORAGE_NAMESPACE + key, null);
      return typeof raw === "string" ? raw : null;
    } catch (error) {
      storageLogger.warn("读取 Tampermonkey 存储失败", {
        context: { storageKey: STORAGE_NAMESPACE + key },
        error
      });
      return null;
    }
  }
  function writeStoredRawString(key, value) {
    if (typeof GM_setValue !== "function") {
      return;
    }
    try {
      GM_setValue(STORAGE_NAMESPACE + key, value);
    } catch (error) {
      storageLogger.warn("写入 Tampermonkey 存储失败", {
        context: { storageKey: STORAGE_NAMESPACE + key },
        error
      });
    }
  }
  function warnInvalidStoredValue(key, label2) {
    storageLogger.warn(`${label2}存储内容无效，已回退到默认值`, {
      context: { storageKey: STORAGE_NAMESPACE + key }
    });
  }
  function getDuration() {
    const raw = readStoredString(DURATION_STORAGE_KEY);
    const duration = parseStoredDuration(raw);
    if (duration !== null) {
      return duration;
    }
    if (raw !== null) {
      warnInvalidStoredValue(DURATION_STORAGE_KEY, "课时长度");
    }
    return DEFAULT_DURATION;
  }
  function saveDuration(value) {
    const normalized = normalizeDuration(value, DEFAULT_DURATION);
    writeStoredRawString(
      DURATION_STORAGE_KEY,
      serializeStoredDuration(normalized)
    );
  }
  function getPeriods() {
    const raw = readStoredString(PERIODS_STORAGE_KEY);
    const periods = parseStoredPeriods(raw);
    if (periods !== null) {
      return periods;
    }
    if (raw !== null) {
      warnInvalidStoredValue(PERIODS_STORAGE_KEY, "节次时间");
    }
    return DEFAULT_PERIODS.map(clonePeriod);
  }
  function savePeriods(periods) {
    const normalized = normalizePeriods(periods, DEFAULT_PERIODS);
    writeStoredRawString(PERIODS_STORAGE_KEY, serializeStoredPeriods(normalized));
  }
  function getReminderProgram() {
    const raw = readStoredString(REMINDER_PROGRAM_STORAGE_KEY);
    const program = parseStoredReminderProgram(raw);
    if (program !== null) {
      return program;
    }
    if (raw !== null) {
      warnInvalidStoredValue(REMINDER_PROGRAM_STORAGE_KEY, "提醒配置");
    }
    return cloneReminderProgram(DEFAULT_REMINDER_PROGRAM);
  }
  function saveReminderProgram(program) {
    const normalized = normalizeReminderProgram(
      program,
      DEFAULT_REMINDER_PROGRAM
    );
    writeStoredRawString(
      REMINDER_PROGRAM_STORAGE_KEY,
      serializeStoredReminderProgram(normalized)
    );
  }
  function getLoggingConfig() {
    const raw = readStoredString(LOGGING_STORAGE_KEY);
    const loggingConfig = parseStoredLoggingConfig(raw);
    if (loggingConfig !== null) {
      return loggingConfig;
    }
    if (raw !== null) {
      warnInvalidStoredValue(LOGGING_STORAGE_KEY, "日志配置");
    }
    return cloneLoggingConfig(DEFAULT_LOGGING_CONFIG);
  }
  function getSemStart(key) {
    const raw = readStoredString(SEMESTER_START_STORAGE_PREFIX + key);
    const semStart = parseStoredSemesterStart(raw);
    if (semStart !== null) {
      return semStart;
    }
    if (raw !== null) {
      storageLogger.warn("学期开始日期存储内容无效，已忽略", {
        context: {
          storageKey: STORAGE_NAMESPACE + SEMESTER_START_STORAGE_PREFIX + key
        }
      });
    }
    return null;
  }
  function saveSemStart(key, value) {
    writeStoredRawString(
      SEMESTER_START_STORAGE_PREFIX + key,
      serializeStoredSemesterStart(value)
    );
  }
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
    const summary = summarizeReminderProgram(program);
    const nodes = program.rules.map((rule) => compileReminderRule(rule, context)).filter((node) => node !== null);
    return {
      nodes,
      lines: nodes.flatMap((node) => node.lines),
      stats: {
        presetId: summary.presetId,
        presetLabel: summary.presetLabel,
        totalRuleCount: summary.totalRuleCount,
        activeRuleCount: summary.activeRuleCount,
        alarmsPerEvent: nodes.length,
        emittedAlarmCount: nodes.length,
        activeRuleDescriptions: summary.activeRuleDescriptions
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
  const calendarLogger = logger.child("core.calendar.ics");
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
  function generateICS(courses, firstMonday, periods, duration, reminderProgram, options = {}) {
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
    let emittedAlarmCount = 0;
    let skippedCourseCount = 0;
    const reminderSummary2 = compileReminderProgram(reminderProgram, {
      courseName: ""
    }).stats;
    for (const course of courses) {
      const startPeriod = getPeriodTime(periods, duration, course.pStart);
      const endPeriod = getPeriodTime(periods, duration, course.pEnd);
      const weekPattern = analyzeWeekPattern(course.weeks);
      if (!startPeriod || !endPeriod || !weekPattern) {
        skippedCourseCount++;
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
      const compiledReminders = compileReminderProgram(reminderProgram, {
        courseName: course.name
      });
      lines.push(...compiledReminders.lines);
      emittedAlarmCount += compiledReminders.stats.emittedAlarmCount;
      lines.push("END:VEVENT");
      eventCount++;
    }
    lines.push("END:VCALENDAR");
    if (skippedCourseCount) {
      calendarLogger.warn("部分课程因节次或周次信息无效被跳过", {
        traceId: options.traceId,
        context: {
          courseCount: courses.length,
          skippedCourseCount
        }
      });
    }
    calendarLogger.info("ICS 生成完成", {
      traceId: options.traceId,
      context: {
        courseCount: courses.length,
        eventCount,
        skippedCourseCount,
        emittedAlarmCount,
        presetId: reminderSummary2.presetId
      }
    });
    return {
      ics: lines.map(foldLine).join("\r\n") + "\r\n",
      eventCount,
      reminderSummary: {
        presetId: reminderSummary2.presetId,
        presetLabel: reminderSummary2.presetLabel,
        activeRuleCount: reminderSummary2.activeRuleCount,
        alarmsPerEvent: reminderSummary2.alarmsPerEvent,
        emittedAlarmCount,
        activeRuleDescriptions: reminderSummary2.activeRuleDescriptions
      }
    };
  }
  const extractionLogger = logger.child("core.extraction");
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
  function extractCourses(options = {}) {
    const gridCount = document.querySelectorAll(
      'table[id^="kbgrid_table_"]'
    ).length;
    const extracted = dedupeCourses(extractFromGrid());
    if (!gridCount) {
      extractionLogger.warn("未找到课表网格容器", {
        traceId: options.traceId,
        context: { selector: 'table[id^="kbgrid_table_"]' }
      });
      return extracted;
    }
    if (!extracted.length) {
      extractionLogger.warn("课表提取完成，但未发现可导出的课程", {
        traceId: options.traceId,
        context: { gridCount }
      });
      return extracted;
    }
    extractionLogger.info("课表提取完成", {
      traceId: options.traceId,
      context: { gridCount, courseCount: extracted.length }
    });
    return extracted;
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
  const backdrop = "_backdrop_1548o_1";
  const dialogOpen = "_dialogOpen_1548o_9";
  const dialog = "_dialog_1548o_9";
  const header = "_header_1548o_64";
  const headerTitle = "_headerTitle_1548o_73";
  const logo = "_logo_1548o_79";
  const titleText = "_titleText_1548o_92";
  const titleSub = "_titleSub_1548o_98";
  const closeButton = "_closeButton_1548o_104";
  const tabs = "_tabs_1548o_130";
  const tabButton = "_tabButton_1548o_137";
  const tabButtonActive = "_tabButtonActive_1548o_149";
  const panels = "_panels_1548o_166";
  const panel = "_panel_1548o_166";
  const panelActive = "_panelActive_1548o_179";
  const row = "_row_1548o_183";
  const label = "_label_1548o_191";
  const required = "_required_1548o_202";
  const field = "_field_1548o_206";
  const tip = "_tip_1548o_233";
  const scheduleTip = "_scheduleTip_1548o_241";
  const alarmTip = "_alarmTip_1548o_245";
  const presetGrid = "_presetGrid_1548o_249";
  const presetButton = "_presetButton_1548o_255";
  const presetButtonActive = "_presetButtonActive_1548o_275";
  const presetButtonTitle = "_presetButtonTitle_1548o_281";
  const presetButtonDesc = "_presetButtonDesc_1548o_287";
  const reminderSummary = "_reminderSummary_1548o_293";
  const reminderPreviewList = "_reminderPreviewList_1548o_302";
  const reminderCardList = "_reminderCardList_1548o_313";
  const reminderCard = "_reminderCard_1548o_313";
  const reminderCardOff = "_reminderCardOff_1548o_325";
  const reminderCardForm = "_reminderCardForm_1548o_329";
  const reminderCardHint = "_reminderCardHint_1548o_330";
  const reminderCardMeta = "_reminderCardMeta_1548o_331";
  const reminderCardHeader = "_reminderCardHeader_1548o_335";
  const reminderCardTitleWrap = "_reminderCardTitleWrap_1548o_342";
  const reminderCardTitle = "_reminderCardTitle_1548o_342";
  const reminderCardActions = "_reminderCardActions_1548o_358";
  const compactField = "_compactField_1548o_371";
  const compactFieldLabel = "_compactFieldLabel_1548o_377";
  const compactFieldControl = "_compactFieldControl_1548o_382";
  const compactFieldSuffix = "_compactFieldSuffix_1548o_388";
  const emptyState = "_emptyState_1548o_400";
  const twoColumn = "_twoColumn_1548o_410";
  const sectionHeading = "_sectionHeading_1548o_416";
  const table = "_table_1548o_429";
  const cellNo = "_cellNo_1548o_458";
  const cellEnd = "_cellEnd_1548o_464";
  const timeInput = "_timeInput_1548o_475";
  const miniNumber = "_miniNumber_1548o_476";
  const miniSelect = "_miniSelect_1548o_477";
  const deleteButton = "_deleteButton_1548o_518";
  const addButton = "_addButton_1548o_539";
  const toggle = "_toggle_1548o_470";
  const toggleTrack = "_toggleTrack_1548o_584";
  const preview = "_preview_1548o_619";
  const previewIndex = "_previewIndex_1548o_635";
  const previewTime = "_previewTime_1548o_643";
  const previewEnd = "_previewEnd_1548o_648";
  const footer = "_footer_1548o_653";
  const exportButton = "_exportButton_1548o_662";
  const status = "_status_1548o_694";
  const statusWrap = "_statusWrap_1548o_702";
  const statusActions = "_statusActions_1548o_707";
  const statusDetailButton = "_statusDetailButton_1548o_713";
  const statusDetail = "_statusDetail_1548o_713";
  const statusOk = "_statusOk_1548o_746";
  const statusError = "_statusError_1548o_750";
  const statusInfo = "_statusInfo_1548o_754";
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
    presetGrid,
    presetButton,
    presetButtonActive,
    presetButtonTitle,
    presetButtonDesc,
    reminderSummary,
    reminderPreviewList,
    reminderCardList,
    reminderCard,
    reminderCardOff,
    reminderCardForm,
    reminderCardHint,
    reminderCardMeta,
    reminderCardHeader,
    reminderCardTitleWrap,
    reminderCardTitle,
    reminderCardActions,
    compactField,
    compactFieldLabel,
    compactFieldControl,
    compactFieldSuffix,
    emptyState,
    twoColumn,
    sectionHeading,
    table,
    cellNo,
    cellEnd,
    timeInput,
    miniNumber,
    miniSelect,
    deleteButton,
    addButton,
    toggle,
    toggleTrack,
    preview,
    previewIndex,
    previewTime,
    previewEnd,
    footer,
    exportButton,
    status,
    statusWrap,
    statusActions,
    statusDetailButton,
    statusDetail,
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
  function makeReminderRuleCard(index, rule) {
    const card = document.createElement("div");
    card.className = cx(
      styles.reminderCard,
      !rule.isEnabled && styles.reminderCardOff
    );
    card.dataset.reminderRuleId = rule.id;
    card.dataset.reminderRuleIndex = String(index);
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
    const header2 = Object.assign(document.createElement("div"), {
      className: styles.reminderCardHeader
    });
    const titleWrap = document.createElement("div");
    titleWrap.className = styles.reminderCardTitleWrap;
    const title = Object.assign(document.createElement("div"), {
      className: styles.reminderCardTitle,
      textContent: `提醒 ${index + 1}`
    });
    const meta = Object.assign(document.createElement("div"), {
      className: styles.reminderCardMeta,
      textContent: describeReminderRule(rule)
    });
    titleWrap.append(title, meta);
    const headerActions = Object.assign(document.createElement("div"), {
      className: styles.reminderCardActions
    });
    const delBtn = Object.assign(document.createElement("button"), {
      type: "button",
      className: styles.deleteButton,
      title: "删除此提醒",
      textContent: "×"
    });
    delBtn.dataset.action = "delete-reminder-rule";
    headerActions.append(toggle2, delBtn);
    header2.append(titleWrap, headerActions);
    const form = Object.assign(document.createElement("div"), {
      className: styles.reminderCardForm
    });
    const minuteField = Object.assign(document.createElement("label"), {
      className: styles.compactField
    });
    const minuteLabel = Object.assign(document.createElement("span"), {
      className: styles.compactFieldLabel,
      textContent: "提前时间"
    });
    const minuteControl = Object.assign(document.createElement("div"), {
      className: styles.compactFieldControl
    });
    const numInp = Object.assign(document.createElement("input"), {
      type: "number",
      className: styles.miniNumber,
      min: "1",
      max: "1440",
      value: String(rule.offset.minutesBeforeStart)
    });
    numInp.dataset.role = "reminder-rule-minutes";
    const minuteSuffix = Object.assign(document.createElement("span"), {
      className: styles.compactFieldSuffix,
      textContent: formatReminderLeadTime(rule.offset.minutesBeforeStart)
    });
    minuteControl.append(numInp, minuteSuffix);
    minuteField.append(minuteLabel, minuteControl);
    const deliveryField = Object.assign(document.createElement("label"), {
      className: styles.compactField
    });
    const deliveryLabel = Object.assign(document.createElement("span"), {
      className: styles.compactFieldLabel,
      textContent: "提醒方式"
    });
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
    deliveryField.append(deliveryLabel, select);
    form.append(minuteField, deliveryField);
    const hint = Object.assign(document.createElement("div"), {
      className: styles.reminderCardHint,
      textContent: rule.isEnabled ? `导出后会写入 1 个 VALARM：${describeReminderRule(rule)}` : "当前已禁用，不会写入 ICS。"
    });
    card.append(header2, form, hint);
    return card;
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
    fragment.append(
      "提醒会在导出时为每个课程事件写入一个或多个 VALARM，可叠加。",
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
      "：使用日历客户端默认提示音，兼容性取决于客户端。",
      document.createElement("br")
    );
    fragment.append("你可以先套用快捷方案，再按需改成自定义。");
    return fragment;
  }
  function createDialogElements(duration, periods, reminderProgram, defaultDate) {
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
      value: String(duration)
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
    periods.forEach(
      (period, index) => periodTb.appendChild(makePeriodRow(index, period.start, duration))
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
    const presetHeading = Object.assign(document.createElement("div"), {
      className: styles.sectionHeading,
      textContent: "快捷方案"
    });
    const reminderPresetBar = Object.assign(document.createElement("div"), {
      className: styles.presetGrid,
      id: "ics-reminder-preset-bar"
    });
    for (const preset of REMINDER_PRESET_DEFINITIONS) {
      const isActive = reminderProgram.presetId === preset.id;
      const btn = Object.assign(document.createElement("button"), {
        type: "button",
        className: cx(styles.presetButton, isActive && styles.presetButtonActive)
      });
      btn.dataset.role = "reminder-preset";
      btn.dataset.presetId = preset.id;
      btn.setAttribute("aria-pressed", String(isActive));
      const name = Object.assign(document.createElement("span"), {
        className: styles.presetButtonTitle,
        textContent: preset.label
      });
      const desc = Object.assign(document.createElement("span"), {
        className: styles.presetButtonDesc,
        textContent: preset.description
      });
      btn.append(name, desc);
      reminderPresetBar.appendChild(btn);
    }
    const summaryHeading = Object.assign(document.createElement("div"), {
      className: styles.sectionHeading,
      textContent: "导出预览"
    });
    const reminderSummaryEl = Object.assign(document.createElement("div"), {
      className: styles.reminderSummary,
      id: "ics-reminder-summary"
    });
    const reminderPreviewList2 = Object.assign(document.createElement("ul"), {
      className: styles.reminderPreviewList,
      id: "ics-reminder-preview-list"
    });
    const editorHeading = Object.assign(document.createElement("div"), {
      className: styles.sectionHeading,
      textContent: "自定义提醒"
    });
    const reminderRuleList = Object.assign(document.createElement("div"), {
      className: styles.reminderCardList,
      id: "ics-reminder-rule-list"
    });
    reminderProgram.rules.forEach(
      (rule, index) => reminderRuleList.appendChild(makeReminderRuleCard(index, rule))
    );
    const addReminderRuleBtn = Object.assign(document.createElement("button"), {
      type: "button",
      id: "ics-add-reminder-rule-btn",
      className: styles.addButton,
      textContent: "＋ 新增自定义提醒"
    });
    panelAlarm.append(
      alarmTip2,
      presetHeading,
      reminderPresetBar,
      summaryHeading,
      reminderSummaryEl,
      reminderPreviewList2,
      editorHeading,
      reminderRuleList,
      addReminderRuleBtn
    );
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
    const statusWrap2 = Object.assign(document.createElement("div"), {
      className: styles.statusWrap
    });
    const statusActions2 = Object.assign(document.createElement("div"), {
      className: styles.statusActions
    });
    const statusDetailBtn = Object.assign(document.createElement("button"), {
      type: "button",
      className: styles.statusDetailButton,
      textContent: "查看详情",
      hidden: true
    });
    statusDetailBtn.setAttribute("aria-controls", "ics-status-detail");
    statusDetailBtn.setAttribute("aria-expanded", "false");
    const statusDetailEl = Object.assign(document.createElement("pre"), {
      id: "ics-status-detail",
      className: styles.statusDetail,
      hidden: true
    });
    statusActions2.appendChild(statusDetailBtn);
    statusWrap2.append(statusEl, statusActions2, statusDetailEl);
    footer2.append(exportBtn, statusWrap2);
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
      reminderPresetBar,
      reminderSummaryEl,
      reminderPreviewList: reminderPreviewList2,
      reminderRuleList,
      addReminderRuleBtn,
      exportBtn,
      statusEl,
      statusDetailBtn,
      statusDetailEl
    };
  }
  const exportLogger = logger.child("ui.export");
  function handleExportAction({
    semKey,
    startInp,
    readDuration,
    readPeriods,
    readReminderProgram,
    setStatus
  }) {
    const semStart = startInp.value;
    const traceId = createTraceId("export");
    if (!semStart) {
      exportLogger.warn("导出被阻止：缺少学期开始日期", { traceId });
      setStatus("⚠️ 请填写学期开始日期", "error");
      startInp.focus();
      return;
    }
    const [year, month, day] = semStart.split("-").map(Number);
    const weekDay = new Date(year ?? 0, (month ?? 1) - 1, day ?? 1).getDay();
    if (weekDay !== 1) {
      const dayNames = ["日", "一", "二", "三", "四", "五", "六"];
      exportLogger.warn("导出被阻止：学期开始日期不是周一", {
        traceId,
        context: { semStart, weekDay }
      });
      setStatus(
        `⚠️ ${semStart} 是星期${dayNames[weekDay]}，请填写周一的日期`,
        "error"
      );
      startInp.focus();
      return;
    }
    exportLogger.info("开始处理导出请求", {
      traceId,
      context: { semStart, hasSemesterKey: Boolean(semKey) }
    });
    setStatus("解析课表中…", "info");
    requestAnimationFrame(() => {
      try {
        const courses = extractCourses({ traceId });
        if (!courses.length) {
          exportLogger.warn("导出中止：未提取到课程", { traceId });
          setStatus("⚠️ 未找到课程数据，请先点击「查询」加载课表", "error");
          return;
        }
        const { ics, eventCount, reminderSummary: reminderSummary2 } = generateICS(
          courses,
          semStart,
          readPeriods(),
          readDuration(),
          readReminderProgram(),
          { traceId }
        );
        const filename = `上理工课表_${semStart}.ics`;
        downloadICS(ics, filename);
        if (semKey) {
          saveSemStart(semKey, semStart);
        }
        const alarmSummary = reminderSummary2.activeRuleCount ? `${reminderSummary2.presetLabel} · 每门课 ${reminderSummary2.alarmsPerEvent} 条提醒` : "已关闭提醒";
        exportLogger.info("导出成功", {
          traceId,
          context: {
            semStart,
            courseCount: courses.length,
            eventCount,
            emittedAlarmCount: reminderSummary2.emittedAlarmCount,
            presetId: reminderSummary2.presetId
          }
        });
        setStatus(
          `✅ ${courses.length} 门课 · ${eventCount} 个事件 · ${alarmSummary}`,
          "ok"
        );
      } catch (error) {
        const entry = exportLogger.error("导出失败", {
          traceId,
          context: { semStart, hasSemesterKey: Boolean(semKey) },
          error
        });
        setStatus(
          `❌ 导出失败：${error instanceof Error ? error.message : String(error)}`,
          "error",
          formatLogEntryForDisplay(entry)
        );
      }
    });
  }
  function updateReminderRules(reminderProgram, recipe) {
    return setReminderProgramRules(recipe(reminderProgram.rules));
  }
  function removeRuleById(rules, ruleId) {
    const remainingRules = [];
    let removedRule = null;
    for (const rule of rules) {
      if (removedRule === null && rule.id === ruleId) {
        removedRule = rule;
        continue;
      }
      remainingRules.push(rule);
    }
    return {
      removedRule,
      remainingRules
    };
  }
  function createDialogConfigStore(initialDuration, initialPeriods, initialReminderProgram) {
    let duration = normalizeDuration(initialDuration, initialDuration);
    let periods = initialPeriods.map(clonePeriod);
    let reminderProgram = cloneReminderProgram(initialReminderProgram);
    return {
      getDuration() {
        return duration;
      },
      getPeriods() {
        return periods.map(clonePeriod);
      },
      getReminderProgram() {
        return cloneReminderProgram(reminderProgram);
      },
      setDuration(value) {
        duration = normalizeDuration(value, duration);
      },
      setPeriodStart(index, start) {
        const current = periods[index];
        if (!current) {
          return;
        }
        periods[index] = normalizePeriod({ start }, current.start);
      },
      addPeriod(start) {
        periods.push(normalizePeriod({ start }));
      },
      removePeriod(index) {
        if (periods.length <= 1) {
          return;
        }
        periods.splice(index, 1);
      },
      applyReminderPreset(presetId) {
        reminderProgram = setReminderProgramPreset(reminderProgram, presetId);
      },
      setReminderRuleEnabled(ruleId, isEnabled) {
        reminderProgram = updateReminderRules(
          reminderProgram,
          (rules) => rules.map(
            (rule) => rule.id === ruleId ? { ...rule, isEnabled } : rule
          )
        );
      },
      setReminderRuleMinutes(ruleId, minutesBeforeStart) {
        reminderProgram = updateReminderRules(
          reminderProgram,
          (rules) => rules.map(
            (rule) => rule.id === ruleId ? {
              ...rule,
              offset: {
                minutesBeforeStart: Math.max(
                  1,
                  Number.parseInt(String(minutesBeforeStart), 10) || 1
                )
              }
            } : rule
          )
        );
      },
      setReminderRuleDelivery(ruleId, kind) {
        reminderProgram = updateReminderRules(
          reminderProgram,
          (rules) => rules.map(
            (rule) => rule.id === ruleId ? {
              ...rule,
              delivery: { kind }
            } : rule
          )
        );
      },
      addReminderRule(rule = {}) {
        const fallbackRule = createCustomReminderRule();
        reminderProgram = updateReminderRules(reminderProgram, (rules) => [
          ...rules,
          {
            ...fallbackRule,
            ...rule,
            offset: {
              minutesBeforeStart: typeof rule.offset?.minutesBeforeStart === "number" ? rule.offset.minutesBeforeStart : fallbackRule.offset.minutesBeforeStart
            },
            delivery: {
              kind: rule.delivery?.kind === "AUDIO" ? "AUDIO" : "DISPLAY"
            },
            template: { kind: "course-start-countdown" }
          }
        ]);
      },
      removeReminderRule(ruleId) {
        reminderProgram = updateReminderRules(
          reminderProgram,
          (rules) => removeRuleById(rules, ruleId).remainingRules
        );
      }
    };
  }
  function renderPeriodRows(periodTb, periods, duration) {
    periodTb.replaceChildren(
      ...periods.map(
        (period, index) => makePeriodRow(index, period.start, duration)
      )
    );
  }
  function renderReminderRuleCards(reminderRuleList, rules) {
    if (!rules.length) {
      const empty = Object.assign(document.createElement("div"), {
        className: styles.emptyState,
        textContent: "当前不会导出任何课前提醒。可以直接套用预设，或手动新增自定义提醒。"
      });
      reminderRuleList.replaceChildren(empty);
      return;
    }
    reminderRuleList.replaceChildren(
      ...rules.map((rule, index) => makeReminderRuleCard(index, rule))
    );
  }
  function renderReminderSummary(summaryEl, previewList, reminderProgram) {
    const summary = summarizeReminderProgram(reminderProgram);
    if (!summary.activeRuleCount) {
      summaryEl.textContent = "当前方案：已关闭提醒";
      previewList.replaceChildren();
      return;
    }
    summaryEl.textContent = `当前方案：${summary.presetLabel} · 每门课 ${summary.activeRuleCount} 条提醒`;
    previewList.replaceChildren(
      ...summary.activeRuleDescriptions.map((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        return li;
      })
    );
  }
  function refreshPeriodTable(periodTb, periods, duration) {
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
  function refreshPreview(previewList, periods, duration) {
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
    const duration = getDuration();
    const periods = getPeriods();
    const reminderProgram = getReminderProgram();
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
      reminderPresetBar,
      reminderSummaryEl,
      reminderPreviewList: reminderPreviewList2,
      reminderRuleList,
      addReminderRuleBtn,
      exportBtn,
      statusEl,
      statusDetailBtn,
      statusDetailEl
    } = createDialogElements(duration, periods, reminderProgram, defaultDate);
    let store = createDialogConfigStore(duration, periods, reminderProgram);
    function clearStatusDetail() {
      statusDetailBtn.hidden = true;
      statusDetailBtn.textContent = "查看详情";
      statusDetailBtn.setAttribute("aria-expanded", "false");
      statusDetailEl.hidden = true;
      statusDetailEl.textContent = "";
    }
    syncExistingUI = () => {
      const latestDuration = getDuration();
      const latestPeriods = getPeriods();
      const latestReminderProgram = getReminderProgram();
      store = createDialogConfigStore(
        latestDuration,
        latestPeriods,
        latestReminderProgram
      );
      durInp.value = String(latestDuration);
      renderPeriodRows(periodTb, latestPeriods, latestDuration);
      refreshPeriodTable(periodTb, latestPeriods, latestDuration);
      syncReminderPresetButtons(latestReminderProgram.presetId);
      renderReminderRuleCards(reminderRuleList, latestReminderProgram.rules);
      renderReminderSummary(
        reminderSummaryEl,
        reminderPreviewList2,
        latestReminderProgram
      );
      syncAddReminderBtn(latestReminderProgram.rules);
      refreshPreview(previewList, latestPeriods, latestDuration);
      clearStatusDetail();
    };
    function openDialog2() {
      syncExistingUI?.();
      backdrop2.classList.add(styles.dialogOpen);
      dialog2.classList.add(styles.dialogOpen);
      dialog2.setAttribute("aria-hidden", "false");
      refreshPreview(previewList, store.getPeriods(), store.getDuration());
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
        refreshPreview(previewList, store.getPeriods(), store.getDuration());
      }
    });
    function persistDialogState() {
      saveDuration(store.getDuration());
      savePeriods(store.getPeriods());
      saveReminderProgram(store.getReminderProgram());
    }
    function onPeriodChange() {
      persistDialogState();
      const currentDuration = store.getDuration();
      const currentPeriods = store.getPeriods();
      durInp.value = String(currentDuration);
      refreshPeriodTable(periodTb, currentPeriods, currentDuration);
      refreshPreview(previewList, currentPeriods, currentDuration);
    }
    const MAX_REMINDER_RULES = 5;
    function syncAddReminderBtn(rules) {
      addReminderRuleBtn.disabled = rules.length >= MAX_REMINDER_RULES;
    }
    function syncReminderPresetButtons(presetId) {
      for (const button of Array.from(
        reminderPresetBar.querySelectorAll(
          '[data-role="reminder-preset"]'
        )
      )) {
        const active = button.dataset.presetId === presetId;
        button.classList.toggle(styles.presetButtonActive, active);
        button.setAttribute("aria-pressed", String(active));
      }
    }
    function onReminderChange() {
      persistDialogState();
      const currentReminderProgram = store.getReminderProgram();
      syncReminderPresetButtons(currentReminderProgram.presetId);
      renderReminderRuleCards(reminderRuleList, currentReminderProgram.rules);
      renderReminderSummary(
        reminderSummaryEl,
        reminderPreviewList2,
        currentReminderProgram
      );
      syncAddReminderBtn(currentReminderProgram.rules);
    }
    refreshPreview(previewList, store.getPeriods(), store.getDuration());
    const initialReminderProgram = store.getReminderProgram();
    syncReminderPresetButtons(initialReminderProgram.presetId);
    renderReminderRuleCards(reminderRuleList, initialReminderProgram.rules);
    renderReminderSummary(
      reminderSummaryEl,
      reminderPreviewList2,
      initialReminderProgram
    );
    syncAddReminderBtn(initialReminderProgram.rules);
    durInp.addEventListener("input", () => {
      store.setDuration(durInp.value);
      onPeriodChange();
    });
    periodTb.addEventListener("input", (event) => {
      const target = event.target;
      if (target.matches('[data-role="period-start"]')) {
        const row2 = target.closest("tr[data-idx]");
        const index = Number.parseInt(row2?.dataset.idx ?? "-1", 10);
        store.setPeriodStart(index, target.value);
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
      const row2 = btn.closest("tr[data-idx]");
      const index = Number.parseInt(row2?.dataset.idx ?? "-1", 10);
      store.removePeriod(index);
      renderPeriodRows(periodTb, store.getPeriods(), store.getDuration());
      onPeriodChange();
    });
    addPeriodBtn.addEventListener("click", () => {
      const currentPeriods = store.getPeriods();
      const currentDuration = store.getDuration();
      const lastStart = currentPeriods.at(-1)?.start ?? "08:00";
      const nextStart = addMinutes(lastStart, currentDuration + 10);
      store.addPeriod(nextStart);
      renderPeriodRows(periodTb, store.getPeriods(), store.getDuration());
      onPeriodChange();
    });
    reminderPresetBar.addEventListener("click", (event) => {
      const button = event.target.closest(
        '[data-role="reminder-preset"]'
      );
      const presetId = button?.dataset.presetId;
      if (!presetId) {
        return;
      }
      store.applyReminderPreset(presetId);
      onReminderChange();
    });
    reminderRuleList.addEventListener("change", (event) => {
      const target = event.target;
      const row2 = target.closest("[data-reminder-rule-id]");
      const ruleId = row2?.dataset.reminderRuleId;
      if (!ruleId) {
        return;
      }
      if (target.matches('[data-role="reminder-rule-enabled"]')) {
        store.setReminderRuleEnabled(
          ruleId,
          target.checked
        );
        onReminderChange();
      }
      if (target.matches('[data-role="reminder-rule-delivery"]')) {
        store.setReminderRuleDelivery(
          ruleId,
          target.value
        );
        onReminderChange();
      }
    });
    reminderRuleList.addEventListener("input", (event) => {
      const target = event.target;
      if (target.matches('[data-role="reminder-rule-minutes"]')) {
        const row2 = target.closest("[data-reminder-rule-id]");
        const ruleId = row2?.dataset.reminderRuleId;
        if (!ruleId) {
          return;
        }
        store.setReminderRuleMinutes(ruleId, Number.parseInt(target.value, 10));
        onReminderChange();
      }
    });
    reminderRuleList.addEventListener("click", (event) => {
      const btn = event.target.closest(
        '[data-action="delete-reminder-rule"]'
      );
      if (!btn) {
        return;
      }
      const row2 = btn.closest("[data-reminder-rule-id]");
      const ruleId = row2?.dataset.reminderRuleId;
      if (!ruleId) {
        return;
      }
      store.removeReminderRule(ruleId);
      onReminderChange();
    });
    addReminderRuleBtn.addEventListener("click", () => {
      store.addReminderRule();
      onReminderChange();
    });
    const statusClassNames = {
      error: styles.statusError,
      info: styles.statusInfo,
      ok: styles.statusOk
    };
    const setStatus = (message, tone, detail) => {
      statusEl.textContent = message;
      statusEl.className = cx(styles.status, statusClassNames[tone]);
      if (tone === "error" && detail) {
        statusDetailBtn.hidden = false;
        statusDetailBtn.textContent = "查看详情";
        statusDetailBtn.setAttribute("aria-expanded", "false");
        statusDetailEl.textContent = detail;
        statusDetailEl.hidden = true;
        return;
      }
      clearStatusDetail();
    };
    statusDetailBtn.addEventListener("click", () => {
      const willExpand = statusDetailEl.hidden;
      statusDetailEl.hidden = !willExpand;
      statusDetailBtn.textContent = willExpand ? "隐藏详情" : "查看详情";
      statusDetailBtn.setAttribute("aria-expanded", String(willExpand));
    });
    exportBtn.addEventListener("click", () => {
      persistDialogState();
      handleExportAction({
        semKey,
        startInp,
        readDuration: () => store.getDuration(),
        readPeriods: () => store.getPeriods(),
        readReminderProgram: () => store.getReminderProgram(),
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
  const initLogger = logger.child("bootstrap.init");
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
        initLogger.warn("课表尚未加载，阻止导出", {
          context: { reason: "timetable-not-ready" }
        });
        alert("请先点击「查询」按钮加载表格课表，再导出日历。");
        return;
      }
      initLogger.info("用户点击导出按钮，打开导出对话框");
      createUI();
      openDialog();
    });
  }
  function ensureUI() {
    earlyInjectButton();
    createUI();
  }
  function init() {
    configureLogger(getLoggingConfig());
    initLogger.debug("开始初始化脚本", {
      context: { timetableReady: isTimetableReady() }
    });
    if (isTimetableReady()) {
      initLogger.info("检测到课表已加载，直接初始化 UI");
      ensureUI();
      return;
    }
    const observer = new MutationObserver(() => {
      if (document.getElementById("tb") && !document.getElementById("ics-trigger-btn")) {
        initLogger.debug("检测到工具栏容器，提前注入导出按钮");
        earlyInjectButton();
      }
      if (isTimetableReady()) {
        initLogger.info("检测到课表已加载，停止观察并初始化 UI");
        observer.disconnect();
        ensureUI();
      }
    });
    initLogger.debug("开始观察页面加载状态");
    observer.observe(document.body, { childList: true, subtree: true });
    if (document.getElementById("tb")) {
      initLogger.debug("工具栏已存在，立即注入导出按钮");
      earlyInjectButton();
    }
  }
  init();

})();