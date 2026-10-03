# 现状分析与依据

PLAN_ID: `2026-10-03-homepage-navigation-cleanup`

## 已确认的项目结构

- 工作目录：`/Users/shane/.codex/worktrees/fa50/personal-homepage`。
- 起始提交：`dd3b62660ff2d7a8b8482b91cc2a470e094cf220`，工作树为 detached HEAD，开始时无未提交改动。
- 网站是无需构建的静态站点，`dist/` 是直接维护和发布的源码目录，不是可忽略的构建产物。
- 页面文件为 `dist/index.html`、`dist/research/index.html`、`dist/notes/index.html`。
- 共享逻辑与样式为 `dist/app.js`、`dist/styles.css`，背景逻辑为 `dist/background.js`。
- README 说明网站支持中英文切换、明暗主题和减少动态效果偏好。
- GitHub Pages 工作流只发布 `dist/`，规划文件不会成为站点内容。
- README 提到第三方许可文件 `dist/vendor/antfu.LICENSE`；删除可见的致谢链接与保留已有许可文件是两个独立操作。
- 未发现已有 `.planning` 文件或根目录规划文件；父级 `/Users/shane/.codex/AGENTS.md` 为空。

## 页面与代码发现

- About 是三个页面导航中 `href="/"` 的链接，不存在独立 About 页面。左上角 `.monogram` 同样指向 `/`，删除 About 后仍有返回首页入口。
- 首页正文 `main#about` 包含个人介绍、研究方向、Now、Notes 简介、Contact 和页脚；首页跳转正文链接指向 `#about`。删除可见 About 导航无需删除这一内部 ID。
- 首页 Now 重复了个人介绍中的 USTC 大四身份和时序分析方向。它是 `section.now-section#now`，包含更新时间。
- 首页 Notes 是 `p.notes-intro`，链接到独立 `/notes/`。按用户要求将删除正文简介，保留顶部 Notes 导航和独立笔记页。
- 顶部邮箱图标实际链接到 `/#contact`，不是 `mailto:`。顶部 GitHub 图标打开 GitHub 主页。两者与首页正文 Contact 区域重复，正文仍可承担联系功能。
- 三页页眉和页脚均在 HTML 中重复维护，没有共享模板；About、两个图标及页脚致谢要同步修改三个文件。
- Research 的 `p.back-home` 指向 `/`；Notes 的底部链接指向 `/#now`，需随首页 Now 同时移除，避免失效锚点。
- `app.js` 通过 `data-i18n`、`data-i18n-label`、`data-i18n-title` 应用翻译；清理键时必须核对所有页面，并同时清理中文、英文。
- `styles.css` 有 `.now-section`、`.section-heading`、`.updated-at`、`.notes-intro`、`.back-home`、`.navigation .icon-link` 等可能随删除失去引用的规则。`.navigation svg` 仍用于主题按钮，`.email-link` 仍用于正文联系方式。
- 入场动画使用手工维护的 `--enter-stage`，删除块后应连续编号，避免空等被删除内容对应的延迟。

## 在线核对

- 2026-10-03 尝试用网页读取工具打开首页、Research、Notes，三者均返回工具不可访问；这不能作为站点离线的结论。
- 浏览器自动化创建标签页超时，未获得页面截图。
- 随后使用直接 HTTP 请求核对，[首页](https://shane1243.github.io/)、[Research](https://shane1243.github.io/research/)、[Notes](https://shane1243.github.io/notes/) 均返回 HTTP 200，响应 HTML 与当前工作树对应文件逐字节一致。
- 当前分析依据为本地 HTML/CSS/JavaScript 与线上 HTML 对照，不包含浏览器截图或实际交互验收；这些应在实施后进行。

## 精确定位（基于 dd3b626，修改后行号会变化）

| 用户要求 | 当前定位 | 影响说明 |
| --- | --- | --- |
| 去掉 About | 三个 HTML 的第 32 行 | 都指向 `/`；第 30 行的 `zq.` 同样返回首页。 |
| 去掉首页 Now | `dist/index.html:58` 起的 section | 包括标题、更新时间和两段重复介绍。 |
| 去掉首页 Notes | `dist/index.html:67` | 只删除正文简介；导航和独立页仍承担笔记入口职责。 |
| 去掉底部致谢 | 首页第 88 行、Research 第 74 行、Notes 第 60 行 | 三页均删除相同片段，保留版权行。 |
| 去掉 Research 返回首页 | `dist/research/index.html:71` | 删除整段 `p.back-home`。 |
| 去掉 Notes 近况链接 | `dist/notes/index.html:57` | 当前是站内唯一的 `/#now` 链接。 |
| 去掉顶部邮箱与 GitHub 图标 | 三个 HTML 的第 35–40 行 | 删除整个锚点及其 SVG，不只是隐藏图标。 |
| 保留正文联系方式 | `dist/index.html:71` 起的 Contact | 保留 GitHub 和邮箱地址及其图标；用户指定的是顶部图标。 |
| 中英文资源清理 | `dist/app.js:8` 起的 messages | 只清理删除后确实无人使用的键。 |
| 样式清理 | `dist/styles.css:46`、`:48`、`:82`–`:87`、`:100`–`:101`、`:132` | 去掉仅为被删元素服务的规则；保留共享规则。 |
| 项目说明 | `README.md:9` | 将 Home / About 与 Now 的旧描述更新为实际首页结构。 |

## 翻译、样式和动画依赖

删除后可清理的 10 个翻译键（中英文一起处理）：`about`、`backHome`、`nowTitle`、`updatedOn`、`nowStudy`、`nowResearchLead`、`notesHomeSummary`、`viewNow`、`inspired`、`referenceLink`。

仍在使用的键包括 `notesNav`、`notesSummary`、`notesEmpty`、`notesDescription`、`contact`、`contactMessage`、`githubProfile`、`home`、`researchField` 等。尤其 `githubProfile` 仍用于正文 GitHub 链接，`notesNav` 仍用于导航、页面标题和动态文档标题。

可清理的专用 CSS 规则是 `.back-home`、两处 `.navigation .icon-link`、`.now-section` 及其段落规则、`.section-heading` 及其 h2 规则、`.updated-at`、`.notes-intro`，以及删除所有页脚链接后无引用的 `.site-footer a` / `.site-footer a:hover`。

保留 `.navigation svg`（主题按钮仍使用）、`.email-link`（正文联系链接仍使用）、`.section-divider`（介绍与联系方式之间的分隔线）、`.site-footer`、`.notes-description`、`.notes-empty` 和背景、主题、减少动态效果相关规则。

首页现有动画序号为 1–7，删除 Now 和 Notes 简介后调整为 1–5：个人介绍、研究方向、分隔线、Contact、版权。Research 和 Notes 均删除序号 3 的底部链接，页脚由序号 4 调整为 3。

## 信息结构判断

1. 首页已经清楚回答“我是谁、研究什么、如何联系”，About 导航没有提供新内容，左上角标识足以返回首页。
2. Now 只重复首页已有信息，正文 Notes 又与导航入口重复。删除后首页内容更集中，无需新增替代模块。
3. Research 和 Notes 保持独立页面，三个页面共享同一套精简导航；不用每页设置不同的导航项。
4. Contact 是保留下来的联系入口。用户没有要求删除正文联系方式或研究内容。
5. 内部 `#about` 不等于可见的 About 导航。保留现有 `main#about` 和跳转正文链接，可以避免无关的锚点兼容性变化。
6. 删除可见的 `Inspired by` 不涉及背景、字体、主题动效或第三方许可文件。现有来源注释与 README Credits 可继续保留。

## 实施发现

- 2026-10-03：按计划完成六个文件的修改，没有额外重构。
- 本地 4173 端口已占用，浏览器验收将使用新启动的 4175 端口。

- 浏览器实测 36 组页面/宽度/语言/主题组合通过；主题切换使用 View Transition，验收应等待主题 DOM 状态再断言。

- 最终视觉核对：首页与 Research 桌面布局、Notes 窄屏中文深色布局正常；左上标识、导航、正文、版权及保留图表都正确显示。
- 无 JavaScript 与减少动态效果仅做静态源码核对，浏览器没有禁用 JavaScript 或更改系统偏好。

## Writing 替换范围

- 用户最新要求移除 Research 和 Notes 模块，增加 Writing。
- 当前 Notes 没有已发布笔记，因此 Writing 采用真实的空列表状态，不生成示例文章。
- Research 的模拟图表随模块移除；首页原有研究方向仍属个人介绍，保留文字，移除指向旧页面的链接。
- Writing 保持现有中英文、主题和布局，路径为 `/writing/`。

- 删除旧页面时需一起移除空目录，否则 Python 本地预览会展示目录列表；此问题已修正，旧路径返回 404。

- Writing 的中文导航/标题为“写作”，页面沿用空状态排版；英文标题及动态文档标题均为 Writing。

- 新版本 24 组浏览器验收通过，Writing 标题、翻译、主题及响应式边界正常。

- 完成状态：旧两页已移除，Writing 新页、首页入口及全部相关资源已更新；桌面/手机截图和键盘/路由验收通过。

## Writing 的正式定位

- 用户明确：完整的观点、经验总结、长文。已以此替换最初的研究/阅读记录简介。
- 中文简介：完整的观点、经验总结与长文。英文简介：Perspectives, lessons learned, and long-form essays.
- 页面描述和 README 已同步，浏览器中英文验证通过。
