// ════════════════════════════════════════════════════════════════════════════
//  download.ts - 处理文件下载的实用函数
// ════════════════════════════════════════════════════════════════════════════

export function downloadICS(content: string, filename: string): void {
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