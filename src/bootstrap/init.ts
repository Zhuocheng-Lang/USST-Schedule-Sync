// ════════════════════════════════════════════════════════════════════════════
//  bootstrap/init.ts - 页面初始化与按钮注入编排
// ════════════════════════════════════════════════════════════════════════════

import { createUI } from "../ui/dialog";
import { CSS_BUTTON_ONLY } from "../ui/css";
import { injectTriggerButton } from "../ui/toolbar";

function isTimetableReady(): boolean {
  return (
    document.querySelector('#kblist_table tbody[id^="xq_"] .timetable_con') !==
      null || document.querySelector("#kbgrid_table_0 .timetable_con") !== null
  );
}

function openDialog(): void {
  document.getElementById("ics-backdrop")?.classList.add("ics-open");
  document.getElementById("ics-dialog")?.classList.add("ics-open");
}

function earlyInjectButton(): void {
  if (!document.getElementById("ics-btn-style")) {
    const style = Object.assign(document.createElement("style"), {
      id: "ics-btn-style",
      textContent: CSS_BUTTON_ONLY,
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

export function init(): void {
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
