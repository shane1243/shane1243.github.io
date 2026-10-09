# Agent 工作指南

## 项目定位与工作入口

这是 zhiqiangqin 的个人主页，使用原生 HTML、CSS 和 JavaScript，直接部署到 GitHub Pages。**`dist/` 是手工维护的源码和发布目录，不是生成产物；不要删除、清空或在检索时排除它。** 仓库没有 `package.json`、构建步骤、后端或自动化测试套件。

开始修改前阅读 `README.md`，运行 `git status --short`，再检查相关页面和共享文件。使用当前 checkout 的仓库根目录执行命令，不依赖 README 或旧规划里的机器绝对路径。当前实现以 `dist/` 和发布工作流为准；`.planning/` 是历史过程记录，里面的旧页面、路径、验收结果和发布授权不代表本次任务的现状或授权。

## 目录与职责

```text
.
├── AGENTS.md -> CLAUDE.md          # 同一份 agent 指南的兼容入口
├── CLAUDE.md                      # 本指南的正文，只在这里编辑
├── README.md                      # 面向使用者的预览、发布与来源说明
├── .github/workflows/deploy-pages.yml
│                                 # main 推送或手动触发，发布 dist/
├── .planning/                    # 历史计划、发现与执行记录
└── dist/
    ├── index.html                # /：个人介绍、研究方向、最新文章、联系方式
    ├── writing/
    │   ├── index.html            # /writing/：按年份组织的文章列表
    │   ├── on-happiness/index.html
    │   │                         # /writing/on-happiness/：中文文章（带插图）
    │   └── toward-the-light/index.html
    │                             # /writing/toward-the-light/：中文文章《向光而生》
    ├── app.js                    # 界面翻译、元信息、日期、语言和主题切换
    ├── styles.css                # 全站样式、响应式布局、主题与入场动画
    ├── background.js             # Canvas 坐标纸网格背景（静态，随主题和尺寸重绘）
    ├── assets/fonts/
    │   ├── inter-latin.woff2      # 本地字体
    │   └── OFL.txt                # 字体许可
    ├── assets/images/
    │   ├── happiness-quiet-moment.webp
    │   └── happiness-quiet-moment-800.webp
    │                             # 幸福文章的窗边茶杯插图（原图与窄屏版本）
    └── vendor/
        ├── antfu.LICENSE         # 已有样式和动效的来源许可
        ├── simplex-noise.js       # 保留的第三方模块，当前背景未导入它
        └── simplex-noise.LICENSE
```

现有页面是首页、Writing 列表和文章页；`/research/`、`/notes/` 已移除。首页的 `#about` 是跳转正文锚点，`#research` 是研究方向段落，不代表独立页面。

## 视觉风格参考

[Anthony Fu 的个人网站（antfu.me）](https://antfu.me/) 是本项目的默认风格模板。涉及视觉设计时，参考其排版层级、内容宽度、留白、导航、文章列表、明暗主题和动效，并适配本站的中英文阅读与移动端布局。

修改对应区域前先查看参考站的相关页面，以用户要求和本站内容结构为准；具体实现沿用本仓库的原生 HTML、CSS 和 JavaScript。

## 本地预览与检查命令

在仓库根目录启动预览：

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

打开 `http://127.0.0.1:4173/`。端口被占用时换一个空闲端口，不结束已有服务。资源和导航使用 `/styles.css`、`/writing/` 等根路径，必须把 `dist/` 作为 HTTP 根目录；直接用 `file://` 打开 HTML 不能正确预览。

```sh
# JavaScript 改动时，若本机已有 Node.js，可做语法检查
node --check dist/app.js
node --check dist/background.js
# 检查已跟踪文件的差异空白；新文件也要单独检查
git diff --check
```

没有 `npm test`、`npm run build` 或独立 lint 命令。语法检查不替代浏览器验证；单纯文档改动只需核对引用、命令和差异。

## 修改约定

- 保持无需构建的结构，沿用现有原生实现与文件风格；除非任务需要，不引入框架、包管理器、打包器或测试工程。
- 页眉、导航、主题初始化脚本和页脚重复写在各个 HTML 中，没有模板生成器。修改共享结构时搜索所有 `dist/**/*.html` 并同步处理；共享样式放在 `styles.css`，交互放在 `app.js`。
- `app.js` 直接依赖 `#theme-toggle`、`#language-toggle`、`#language-status` 以及 `theme-color`、`description` 元标签；`background.js` 依赖 `#ambient-background`、`#ambient-canvas`。沿用这些脚本的页面必须保留对应节点。
- `html[data-page]` 目前使用 `home`、`writing`、`article`。增加页面类型时检查 `applyLanguage()` 中的元信息映射，否则未知类型会使用首页标题和描述。
- 界面文案在 `app.js` 的 `messages.zh` 与 `messages.en` 中成对维护；核对 `data-i18n`、`data-i18n-label`、`data-i18n-title` 和动态引用。`data-i18n` 会替换节点的整个 `textContent`，不要加在需要保留子元素的容器上。HTML 本身也要保留可读的默认文案。
- 文章标题、正文和摘要保持文章原语言，不随界面语言翻译。保留文章及列表标题的 `lang`；`data-page="article"` 会保留 HTML 中的文档标题和 description。
- 浏览器偏好键是 `zhiqiangqin-language`（`zh` / `en`）和 `zhiqiangqin-theme`（`light` / `dark`）。默认界面为英文；未保存主题时跟随系统。保留存储不可用时的容错，以及各 HTML 中用于避免主题闪烁的初始化逻辑。
- 保留跳转正文、目标的 `tabindex="-1"`、按钮标签、`aria-pressed`、语言状态播报和 Writing 区域的 `aria-current="page"`。禁用 JavaScript 时正文和链接仍应可用，切换按钮由 `noscript` 隐藏。
- 保留减少动态效果偏好与不支持 View Transition 时的主题切换回退。背景是静态坐标纸网格，主线对齐正文列左缘，颜色取自 `--ambient-line` 并在主题切换和窗口缩放时重绘，正文列区域由遮罩留白，窄屏只在四周淡淡显示；若改回动画背景，需在页面隐藏时暂停并在减少动态效果时静态绘制。增删入场区块后连续调整 `--enter-stage`。
- 保留第三方许可、来源注释及 README Credits；修改站点展示文字不等于删除来源文件。个人资料、联系方式与文章内容以用户提供的信息为准，不自行编造。

## 新增或修改文章

1. 参考 `dist/writing/on-happiness/index.html`，在 `dist/writing/<slug>/index.html` 创建页面，使用小写连字符 slug，并保留共享结构及 `data-page="article"`。
2. 更新 `<title>`、description、`article[lang]`、文章标题和正文；保持 `aria-labelledby`、跳转正文链接及目标 ID 对应，返回链接指向 `/writing/`。
3. 在 `dist/writing/index.html` 的对应年份分组中手动添加列表项，并同步首页 `#latest-writing` 中的最新文章；没有年份分组时按现有结构新增，并使用唯一的标题 ID。列表不会自动扫描文章目录。
4. 列表和文章页同步维护 `<time datetime="YYYY-MM-DD">` 与 `data-reading-minutes`。日期表示添加日期；列表用 `data-post-date`，文章页用 `data-post-date="full"`。日期格式和阅读时长文案由脚本本地化，阅读分钟数需要手动填写。
5. 核对列表链接、原文语言标记、返回 Writing 和新增页面的直接访问；涉及站点结构、预览或发布方式的变化时同步 `README.md` 与本指南。

## 验证范围

按改动选择检查；修改共享 HTML、CSS 或 JavaScript 时覆盖全部现有页面：

- 直接访问 `/`、`/writing/`、`/writing/on-happiness/`、`/writing/toward-the-light/`，检查 `zq.` 返回首页、列表到文章及文章返回列表。核对内部链接、锚点、字体、样式和脚本资源。
- 检查中英文、明暗主题及刷新后的偏好保持；界面和元信息正确变化，文章原文不变。主题切换可能异步提交，应等待 `data-theme` 达到目标状态再断言。
- 在 1440px、390px 和 320px 宽度检查布局；确认无横向溢出、导航遮挡、文章标题或元信息异常换行，并查看浏览器控制台。
- 涉及交互或动画时检查键盘导航、跳转正文、减少动态效果及无 JavaScript 的阅读体验。只做源码核对时明确说明，不能报告成浏览器实测。
- 提交前检查差异；交付时说明修改内容、实际验证及未验证项，不复用历史规划里的通过结果。

## 发布与文档维护

`.github/workflows/deploy-pages.yml` 在推送 `main` 或 `workflow_dispatch` 时运行，直接上传 `dist/` 并部署 GitHub Pages，没有安装或构建阶段。根目录文档和 `.planning/` 不进入网站发布包。只有本次任务包含发布授权时才推送或触发部署；本地修改完成不等于上线。

保持本指南简短、反映当前源码；过程记录归 `.planning/`，不要把历史验收或临时服务端口写成长期约定。`AGENTS.md` 保持为指向 `CLAUDE.md` 的相对软链接，避免两份规则内容分叉。
