// ════════════════════════════════════════════════════════════════════════════
//  bootstrap/init.ts - 页面初始化与按钮注入编排
// ════════════════════════════════════════════════════════════════════════════

import { createUI } from "./ui/dialog";
import { styles } from "./ui/css";
import { injectTriggerButton } from "./ui/toolbar";

function isTimetableReady(): boolean {
  return document.querySelector('table[id^="kbgrid_table_"] .timetable_con') !== null;
}

function openDialog(): void {
  document.getElementById("ics-backdrop")?.classList.add(styles.dialogOpen);
  const dialog = document.getElementById("ics-dialog");
  dialog?.classList.add(styles.dialogOpen);
  dialog?.setAttribute("aria-hidden", "false");
}

function earlyInjectButton(): void {
  injectTriggerButton(() => {
    if (!isTimetableReady()) {
      alert("请先点击「查询」按钮加载表格课表，再导出日历。");
      return;
    }
    createUI();
    openDialog();
  });
}

function ensureUI(): void {
  earlyInjectButton();
  createUI();
}

export function init(): void {
  if (isTimetableReady()) {
    ensureUI();
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
      ensureUI();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  if (document.getElementById("tb")) {
    earlyInjectButton();
  }
}

init();
