import { defineConfig } from "vite";
import monkey from "vite-plugin-monkey";

export default defineConfig({
  plugins: [
    monkey({
      entry: "src/main.ts",
      userscript: {
        name: { "": "USST Schedule Sync", "zh-CN": "USST 课表同步" },
        description: {
          "": "Export USST timetable to standard `.ics` calendar file",
          "zh-CN": "将 USST 教务系统课表导出为标准 `.ics` 日历文件",
        },
        author: "Zhuocheng Lang",
        license: "MIT",
        icon: "https://www.usst.edu.cn/_upload/tpl/00/40/64/template64/favicon.ico",
        namespace: "https://github.com/Zhuocheng-Lang/USST-Schedule-Sync",
        match: ["*://jwgl.usst.edu.cn/jwglxt/kbcx/xskbcx_cxXskbcxIndex.html*"],
        grant: ["GM_getValue", "GM_setValue"],
      },
    }),
  ],
});
