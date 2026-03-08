// ════════════════════════════════════════════════════════════════════════════
//  bootstrap/init.ts - 页面初始化与按钮注入编排
// ════════════════════════════════════════════════════════════════════════════

import { getLoggingConfig } from "./config";
import { configureLogger, logger } from "./logging";
import { createUI } from "./ui/dialog";
import { styles } from "./ui/css";
import { injectTriggerButton } from "./ui/toolbar";

const initLogger = logger.child("bootstrap.init");

function isTimetableReady(): boolean {
  return (
    document.querySelector('table[id^="kbgrid_table_"] .timetable_con') !== null
  );
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
      initLogger.warn("课表尚未加载，阻止导出", {
        context: { reason: "timetable-not-ready" },
      });
      alert("请先点击「查询」按钮加载表格课表，再导出日历。");
      return;
    }

    initLogger.info("用户点击导出按钮，打开导出对话框");
    createUI();
    openDialog();
  });
}

function ensureUI(): void {
  earlyInjectButton();
  createUI();
}

export function init(): void {
  configureLogger(getLoggingConfig());
  initLogger.debug("开始初始化脚本", {
    context: { timetableReady: isTimetableReady() },
  });

  if (isTimetableReady()) {
    initLogger.info("检测到课表已加载，直接初始化 UI");
    ensureUI();
    return;
  }

  const observer = new MutationObserver(() => {
    if (
      document.getElementById("tb") &&
      !document.getElementById("ics-trigger-btn")
    ) {
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
