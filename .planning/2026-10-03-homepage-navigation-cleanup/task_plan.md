# 个人主页导航与内容精简计划

PLAN_ID: `2026-10-03-homepage-navigation-cleanup`

日期：2026-10-03（Asia/Shanghai）

## 本轮目标与范围

先分析个人主页，再形成可执行的修改计划；用户现已要求按照计划实施。当前范围是完成下方页面精简、依赖清理和验收，并记录实际结果。

用户要求：

1. 去掉 About，首页已经承担个人介绍的职责。
2. 去掉首页的 Now 和 Notes。
3. 去掉底部的 `Inspired by antfu.me`。
4. 去掉 Research 底部的 `Back to home`。
5. 去掉 Notes 底部的 `What I’m doing now`。
6. 去掉顶部邮箱与 GitHub 图标入口。

## 当前阶段

阶段 6 已完成：根据用户说明，Writing 定位更新为完整的观点、经验总结和长文。阶段 1–5 保留为历史记录。

## 本轮阶段

### 阶段 1：现状分析

- [x] 检查仓库状态、已有规划和项目说明。
- [x] 核对三个页面及共享 CSS、JavaScript。
- [x] 确认重复入口、锚点依赖和全站一致性要求。
- **Status:** complete

### 阶段 2：制定实施方案

- [x] 明确逐项删除范围及保留内容。
- [x] 列出受影响文件、执行顺序和必要清理。
- [x] 写出验收标准与回归检查。
- **Status:** complete

### 阶段 3：交付规划

- [x] 复核每项用户要求均有对应修改步骤。
- [x] 确认网站代码未改动。
- [x] 提供包含分析结论的计划文件与交付路径。
- **Status:** complete

### 阶段 4：实施与验收

- [x] 完成三个页面、翻译、样式及 README 的修改。
- [x] 完成静态检查和浏览器验收。
- [x] 记录结果并交付。
- **Status:** complete

## 分析结论

首页已经承担个人介绍的职责，About 当前只是返回 `/` 的导航链接，没有独立内容。左上角 `zq.` 也返回首页，因此可以删除 About。

Now 重复学校、年级和研究方向；首页正文的 Notes 简介又重复了顶部笔记入口。删除这两块后，首页会集中呈现姓名、个人介绍、研究方向和联系方式。Research、Notes 各自负责展开独立内容。

顶部两个联系图标与正文 Contact 重复；两个子页底部的辅助跳转也可由统一导航承担。三个页面应同步精简页眉和页脚。

## 明确的修改范围

| 项目 | 计划动作 | 保留内容 |
| --- | --- | --- |
| About | 三页导航都删除 About 链接，不新增 Home 文本链接 | 左上角 `zq.` 返回首页、首页个人介绍 |
| 首页 Now | 删除整个 Now 区块，包括标题、更新时间和正文 | 原有个人介绍与研究方向 |
| 首页 Notes | 删除正文的 Notes 链接及简介段落 | 顶部 Notes 导航、独立 `/notes/` 页面 |
| 顶部邮箱与 GitHub | 三页删除两个图标锚点及 SVG | 首页正文 Contact、邮箱和 GitHub 联系方式 |
| 页脚致谢 | 三页删除整段 `Inspired by antfu.me` | `© 2026 zhiqiangqin` |
| Research 底部 | 删除整段 `Back to home` | 研究方向、模拟时序示例与说明 |
| Notes 底部 | 删除整段 `What I’m doing now` | 页面简介和“尚无公开笔记”状态 |

这里将“首页去掉 Notes”理解为去掉正文介绍；用户仍提到独立 Notes 页的修改，因此保留全站 Notes 导航。这一范围也避免首页与子页出现不同的导航结构。

## 修改后的页面结构

- **全站页眉：** 左侧 `zq.`；右侧 Research、Notes、语言切换、主题切换。
- **首页：** 姓名 → 个人介绍 → 研究方向 → 分隔线 → Contact → 版权。
- **Research：** 标题 → 研究方向 → 时序示例及说明 → 版权。
- **Notes：** 标题 → 笔记简介 → 尚无笔记状态 → 版权。

## 实施步骤

以下实施与验收清单已完成。无 JavaScript 和减少动态效果项通过静态源码核对；其余交互与响应式项通过浏览器实测。

### 1. 同步三个页面的结构

- [x] 在三个 HTML 中删除导航的 About、邮箱图标、GitHub 图标，以及页脚致谢。
- [x] 在首页删除 `section.now-section#now` 和 `p.notes-intro`，不留空容器。
- [x] 在 Research 和 Notes 中删除各自的 `p.back-home`。
- [x] 保留三个页面的 `zq.` 首页链接；Research 和 Notes 的当前页面标识保持正确，首页不误标这两个子页。
- [x] 保留首页 `main#about` 与对应 `href="#about"` 的跳转正文链接。内部 ID 不呈现为导航文字，无需为删除 About 导航而改动。
- [x] 保留首页 `#contact`、正文两个联系链接、语言和主题按钮。

### 2. 清理删除内容的依赖

- [x] `app.js` 的中英文 messages 同步删除这 10 个无引用键：`about`、`backHome`、`nowTitle`、`updatedOn`、`nowStudy`、`nowResearchLead`、`notesHomeSummary`、`viewNow`、`inspired`、`referenceLink`。
- [x] 核对所有 HTML 的三类翻译属性及 JavaScript 动态引用；保留 `notesNav`、`githubProfile`、`contact` 等仍在使用的键。
- [x] CSS 删除 `.back-home`、两处 `.navigation .icon-link`、`.now-section`、`.section-heading`、`.updated-at`、`.notes-intro` 及相应子规则。
- [x] 删除所有页脚链接后，清理无引用的 `.site-footer a` 和 `.site-footer a:hover`；保留版权容器样式。
- [x] 保留主题按钮仍依赖的 `.navigation svg`、正文联系区依赖的 `.email-link`，以及 Notes 独立页的样式。
- [x] 首页 `--enter-stage` 连续调整为 1–5；Research 和 Notes 页脚由 4 调整为 3，避免删除内容后仍等待原来的延迟。
- [x] 保留当前字体、内容宽度、背景、主题动画和响应式布局；仅在验收发现删除导致空隙异常时调整相关间距。

### 3. 同步项目说明

- [x] README 的 Sections 将 `Home / About` 改为 `Home`，去掉 Now 描述，准确说明首页保留个人介绍、研究方向和联系方式。
- [x] 保留 README Credits、来源注释、第三方许可文件和字体资源。

### 4. 验收并记录

- [x] 完成下方静态检查、页面交互和视觉验收，将实际结果写入 progress.md。
- [x] 复核差异只涉及约定的六个文件及本规划目录，无新增依赖或架构改造。

## 预计改动文件

| 文件 | 改动 |
| --- | --- |
| `dist/index.html` | 导航、Now、Notes 简介、页脚、动画序号 |
| `dist/research/index.html` | 导航、返回首页链接、页脚、动画序号 |
| `dist/notes/index.html` | 导航、近况链接、页脚、动画序号 |
| `dist/app.js` | 中英文失效翻译键 |
| `dist/styles.css` | 已删除元素的专用规则 |
| `README.md` | 首页结构描述 |

这是一个无需构建的静态站点，直接维护 `dist/`。无需引入框架、组件化页眉、安装包或建立新的测试工程。

## 验收标准

### 内容与引用

- [x] 三页导航都只有 Research、Notes 和两个切换按钮；没有 About 或顶部邮箱/GitHub 图标链接。
- [x] 首页正文没有 Now、更新时间或 Notes 简介；个人介绍、研究方向与正文联系方式完整。
- [x] 三页页脚只呈现现有版权文字，不出现 `Inspired by` / `设计参考` 或 antfu.me 链接。
- [x] Research 没有 `Back to home` / `返回首页`；Notes 没有 `What I’m doing now` / `看看我的近况`。
- [x] 所有 HTML 中没有 `#now` 链接、删除区块的 ID/样式类或失效翻译属性；中英文所有仍用键都有值。
- [x] 不要求全仓库删除 `antfu` 或 `about` 字符串：来源注释、许可和首页无障碍内部锚点仍有用途。

### 导航与交互

- [x] 在三页点击 `zq.` 都返回 `/`，Research 和 Notes 导航可互相访问；三条路由直接打开也正常。
- [x] 首页 GitHub 链接和 `mailto:` 邮箱仍可用。
- [x] 三页中英文切换正常；切换后无 `undefined`、空白标题或错误提示，刷新保留语言偏好。
- [x] 三页明暗主题及主题按钮 SVG 正常，刷新保留主题偏好；浏览器控制台无本次改动造成的错误。
- [x] 键盘跳转正文仍可聚焦 `main`，Tab 顺序中没有被删除链接的残留焦点。
- [x] 无 JavaScript 时仍有完整静态内容和有效链接，切换按钮按现有逻辑隐藏。

### 排版与动画

- [x] 本地预览首页、Research、Notes，分别检查中英文和明暗主题。
- [x] 至少检查桌面 1440px、手机 390px 和窄屏 320px；导航不遮挡标识、不横向溢出，正文和邮箱正常换行。
- [x] 删除区块后介绍、分隔线、Contact 和版权之间没有空容器形成的异常空隙；Notes 空状态和 Research 图表排版正常。
- [x] 入场顺序连续；减少动态效果偏好仍生效。

可使用 `python3 -m http.server 4173 --bind 127.0.0.1 --directory dist` 预览，并做临时的 HTML 引用检查、JavaScript 语法检查（运行时可用时）和 `git diff --check`。本次是可逆的静态内容精简，不新增模仿实现的测试文件。

## 本轮产物

- `task_plan.md`：范围、方案、文件清单和验收标准。
- `findings.md`：源码定位、依赖分析和在线 HTML 核对结果。
- `progress.md`：本轮执行记录、检查结果和工具限制。

## 错误与限制

| 项目 | 次数 | 处理 |
| --- | --- | --- |
| 初次文件检索排除 dist/ | 1 | README 与 Git 文件树确认它就是网站源码，后续已直接检查该目录。 |
| 网页读取工具无法打开三个站点 URL | 1 次批量请求 | 改用直接 HTTP 请求，三页均返回 200 且 HTML 与本地一致。 |
| 浏览器自动化创建标签页超时 | 1 | 未取得截图，分析以源码为准；视觉和交互验收列为实施后工作。 |

## 实施验收结果

- 修改仅涉及约定的六个实现/说明文件和本规划目录。
- JavaScript 语法、HTML 嵌套、中英文引用、内部路由/锚点、动画编号及差异空白检查通过。
- 三页在 1440/390/320px 下，中英文、明暗主题共 36 组检查通过；刷新保留偏好，无横向溢出或导航遮挡。
- 页面跳转、当前页标识、正文联系 href 和键盘跳转正文通过，控制台无错误。
- 已复核首页、Research 桌面截图和 Notes 窄屏截图。
- 无 JavaScript 与减少动态效果为静态核对，未在浏览器中禁用 JavaScript 或更改系统动态效果偏好。
- 本地预览：`http://127.0.0.1:4175/`。
- 已实现本地修改；本任务未提交、推送或发布。

实施过程中：4173 被已有服务占用，改用 4175；主题首次断言早于异步提交，改为等待 DOM 主题属性后验证，全部通过。

## 阶段 5：以 Writing 替换 Research 与 Notes

- [x] 首页导航改为单个 Writing 入口，页面路径为 `/writing/`。
- [x] 新建 Writing 页面，沿用当前笔记页的简洁结构，提供中英文标题、简介和暂无文章状态，不虚构文章。
- [x] 删除 Research、Notes 页面，首页研究方向保留为普通文字，不再链接旧页面。
- [x] 清理旧页面翻译键与图表样式，将笔记页样式重命名用于 Writing，同步 README。
- [x] 验证首页和 Writing 的导航、翻译、主题、移动布局及静态引用，并记录结果。
- **Status:** complete

### 阶段 5 验收结果

- 首页与 Writing 导航、翻译引用、动态标题、动画顺序及本地路由检查通过。
- 新旧路由核对：首页和 `/writing/` 为 200，旧 `/research/`、`/notes/` 为 404。
- 两页在三个宽度、中英文、明暗主题共 24 组检查通过；刷新保存偏好，无横向溢出，控制台无错误。
- Writing 的键盘跳转正文聚焦 `main#main`；Writing 当前页面标识、返回首页及从首页进入 Writing 正常。
- 手机和桌面截图排版复核通过。预览：`http://127.0.0.1:4175/writing/`。
- 所有修改保留在本地工作树，尚未提交或发布。

## 阶段 6：明确 Writing 定位

- 用户说明 Writing 用于完整的观点、经验总结和长文。
- [x] 更新中英文页面简介、页面描述及 README，不增加虚构文章。
- [x] 浏览器核对两种语言的正文简介和 meta description。
- [x] JavaScript 语法和差异空白检查通过。
- **Status:** complete
