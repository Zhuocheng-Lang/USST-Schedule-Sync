// ════════════════════════════════════════════════════════════════════════════
//  ui/css.ts - 定义日历导出界面的 CSS 样式
// ════════════════════════════════════════════════════════════════════════════

export const CSS = `
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

// The trigger button relies on Bootstrap 3 classes already present on the
// page and requires no additional rules of its own.
export const CSS_BUTTON_ONLY = "";
