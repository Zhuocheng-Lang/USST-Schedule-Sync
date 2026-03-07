// ════════════════════════════════════════════════════════════════════════════
//  ui/css.ts - 日历导出界面的样式入口与 className 辅助函数
// ════════════════════════════════════════════════════════════════════════════

import styles from "./css.module.css";

type ClassNameToken = string | false | null | undefined;

export { styles };

export function cx(...tokens: ClassNameToken[]): string {
  return tokens.filter((token): token is string => Boolean(token)).join(" ");
}
