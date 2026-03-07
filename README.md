# USST-Schedule-Sync

将 USST 教务系统课表导出为标准 `.ics` 日历文件。

## 开发

- 安装依赖：`pnpm install`
- 启动开发：`pnpm dev`
- 生产构建：`pnpm build`

### 关于 `pnpm dev` 的说明

本项目使用 Vite + vite-plugin-monkey 开发 userscript。

`pnpm dev` 启动后，脚本管理器安装到的通常不是最终打包后的 `dist/usst-schedule-sync.user.js`，而是 vite-plugin-monkey 自动生成的开发加载器。这种脚本通常会表现为：

- 脚本名变成 `server:USST Schedule Sync`
- `@grant` 比生产版本更多
- 脚本主体包含类似 `__vite-plugin-monkey.entry.js` 的开发入口
- 安装页看到的源码更像一个 loader，而不是最终 bundle

这属于开发模式的正常行为，不代表打包结果错误。

### 什么时候用 `pnpm dev`

`pnpm dev` 适合在本地调试源码改动，验证页面注入、DOM 提取和弹窗交互是否正常。

如果你只是看到安装页里的脚本内容和 `dist/usst-schedule-sync.user.js` 不一样，这本身不是 bug，而是开发模式和生产构建的差异。

### 什么时候看 `dist/usst-schedule-sync.user.js`

如果你需要下面这些结果，请运行 `pnpm build`，并以 `dist/usst-schedule-sync.user.js` 为准：

- 查看最终发布时实际安装的 userscript 内容
- 确认 `@grant`、脚本头和脚本主体是否为生产版本
- 在 ScriptCat 中安装一个更接近最终发布形态的脚本
- 排查“开发加载器”和“真实产物”之间的差异

也就是说：

- `pnpm dev` 对应的是开发加载器
- `pnpm build` 产出的 `dist/usst-schedule-sync.user.js` 才是最终 bundle

## 当前实现

- 项目使用 Vite 和 vite-plugin-monkey 构建 userscript
- 当前脚本入口位于 [src/main.ts](src/main.ts)
- 课表提取、ICS 生成、配置存储和导出对话框均已从旧版脚本迁移到 [src](src)

## 生效页面

- 当前 userscript 精确匹配页面为 `*://jwgl.usst.edu.cn/jwglxt/kbcx/xskbcx_cxXskbcxIndex.html*`
- 代码中的课表提取逻辑依赖教务系统课表页面常见元素，例如 `#kblist_table`、`#kbgrid_table_0`、`#tb`、`#xnm`、`#xqm`

如果实际课表页 URL 发生变化，可以调整 [vite.config.ts](vite.config.ts) 中的 `match` 配置。
