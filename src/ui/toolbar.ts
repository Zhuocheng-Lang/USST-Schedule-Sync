// ════════════════════════════════════════════════════════════════════════════
//  ui/toolbar.ts - 注入触发导出日历功能的按钮到教务系统的工具栏
// ════════════════════════════════════════════════════════════════════════════

export function injectTriggerButton(onClick: () => void): void {
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
