const root = document.documentElement;
const toggle = document.getElementById('theme-toggle');
const languageToggle = document.getElementById('language-toggle');
const themeColor = document.querySelector('meta[name="theme-color"]');
const description = document.querySelector('meta[name="description"]');
const page = root.dataset.page || 'home';
const systemTheme = matchMedia('(prefers-color-scheme: dark)');
const messages = {
  zh: {
    skip: '跳转到正文', home: 'zhiqiangqin 首页', navigation: '主导航',
    about: '关于', researchNav: '研究', contact: '联系我', backHome: '返回首页',
    notesNav: '笔记', nowTitle: '近况', updatedOn: '更新于 ',
    nowStudy: '目前在中国科学技术大学读大四。', nowResearchLead: '研究方向：',
    notesSummary: '论文阅读、时序分析与学习记录。',
    notesHomeSummary: ' · 论文阅读、时序分析与学习记录。',
    notesEmpty: '还没有公开的笔记。', viewNow: '看看我的近况',
    notesDescription: 'zhiqiangqin 的笔记：论文阅读、时序分析与学习记录。',
    researchDescription: 'zhiqiangqin 的研究方向与时序分析示例。',
    greeting: '你好！我是 ', greetingEnd: '，', studentLead: '目前是',
    university: '中国科学技术大学（USTC）', studentEnd: '的大四本科生。',
    researchLead: '我的研究方向是', researchField: '时序分析', sentenceEnd: '。',
    githubProfile: 'GitHub：shane1243（在新标签页打开）',
    contactMessage: '可以在 GitHub 找到我，或通过邮件联系。', inspired: '设计参考 ',
    referenceLink: 'Anthony Fu 的网站，在新标签页打开',
    languageChoice: 'EN', languageAction: '切换到英文', languageStatus: '已切换为中文。',
    lightTheme: '切换为浅色模式', darkTheme: '切换为深色模式',
    description: 'zhiqiangqin，中国科学技术大学（USTC）大四本科生，研究方向为时序分析。',
    exampleLabel: '研究示例', exampleTitle: '时序异常检测',
    exampleDescription: '以一段具有周期变化的模拟序列为例，标出偏离常态的两个时间点。',
    seriesLegend: '模拟序列', anomalyLegend: '异常点', timeSteps: '时间步',
    chartTitle: '带有两个异常点的模拟时间序列',
    chartDescription: '60 个时间点组成的周期性模拟序列，第 20 和第 47 个时间步被标为示例异常，分别表现为突增和突降。',
    exampleCaption: '仅为展示示例，使用模拟数据，不代表实际实验结果。'
  },
  en: {
    skip: 'Skip to content', home: 'zhiqiangqin home', navigation: 'Main navigation',
    about: 'About', researchNav: 'Research', contact: 'Contact', backHome: 'Back to home',
    notesNav: 'Notes', nowTitle: 'Now', updatedOn: 'Updated ',
    nowStudy: 'Currently a senior undergraduate at USTC.', nowResearchLead: 'Research focus: ',
    notesSummary: 'Paper reading, time series analysis, and learning notes.',
    notesHomeSummary: ' · Paper reading, time series analysis, and learning notes.',
    notesEmpty: 'No published notes yet.', viewNow: 'What I’m doing now',
    notesDescription: 'Notes by zhiqiangqin: paper reading, time series analysis, and learning.',
    researchDescription: 'Research interests and an illustrative time-series analysis example by zhiqiangqin.',
    greeting: "Hi! I'm ", greetingEnd: '. ', studentLead: "I'm a senior undergraduate at ",
    university: 'the University of Science and Technology of China (USTC)', studentEnd: '.',
    researchLead: 'My research focuses on ', researchField: 'time series analysis', sentenceEnd: '.',
    githubProfile: 'GitHub: shane1243 (opens in a new tab)',
    contactMessage: 'Find me on GitHub, or get in touch by email.', inspired: 'Inspired by ',
    referenceLink: "Anthony Fu's website, opens in a new tab",
    languageChoice: '中文', languageAction: 'Switch to Chinese', languageStatus: 'Switched to English.',
    lightTheme: 'Switch to light mode', darkTheme: 'Switch to dark mode',
    description: 'zhiqiangqin is a senior undergraduate at the University of Science and Technology of China (USTC), focusing on time series analysis.',
    exampleLabel: 'Illustrative example', exampleTitle: 'Time-series anomaly detection',
    exampleDescription: 'A simulated seasonal signal with two unusual observations highlighted.',
    seriesLegend: 'Simulated signal', anomalyLegend: 'Anomalies', timeSteps: 'Time step',
    chartTitle: 'Simulated time series with two anomalies',
    chartDescription: 'A seasonal series of 60 simulated observations. Time steps 20 and 47 are marked as illustrative anomalies: an upward spike and a downward drop.',
    exampleCaption: 'Illustration only. The data are simulated and do not represent experimental results.'
  }
};
let language = 'zh';
let hasPreference = false;
try {
  const savedTheme = localStorage.getItem('zhiqiangqin-theme');
  hasPreference = savedTheme === 'light' || savedTheme === 'dark';
  const savedLanguage = localStorage.getItem('zhiqiangqin-language');
  if (savedLanguage === 'zh' || savedLanguage === 'en') language = savedLanguage;
} catch {}

function applyTheme(theme) {
  root.dataset.theme = theme;
  const isDark = theme === 'dark';
  const label = messages[language][isDark ? 'lightTheme' : 'darkTheme'];
  toggle.setAttribute('aria-label', label);
  toggle.setAttribute('title', label);
  toggle.setAttribute('aria-pressed', String(isDark));
  themeColor.setAttribute('content', isDark ? '#050505' : '#ffffff');
}

function applyLanguage(next) {
  language = next;
  const text = messages[language];
  root.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    node.textContent = text[node.dataset.i18n];
  });
  document.querySelectorAll('[data-i18n-label]').forEach((node) => {
    node.setAttribute('aria-label', text[node.dataset.i18nLabel]);
  });
  document.querySelectorAll('[data-i18n-title]').forEach((node) => {
    node.setAttribute('title', text[node.dataset.i18nTitle]);
  });
  const pageDetails = { home: ['description', null], research: ['researchDescription', 'researchNav'], notes: ['notesDescription', 'notesNav'] };
  const [descriptionKey, titleKey] = pageDetails[page] || pageDetails.home;
  description.setAttribute('content', text[descriptionKey]);
  document.title = titleKey ? `${text[titleKey]} · zhiqiangqin` : 'zhiqiangqin';
  languageToggle.textContent = text.languageChoice;
  languageToggle.setAttribute('aria-label', text.languageAction);
  languageToggle.setAttribute('title', text.languageAction);
  applyTheme(root.dataset.theme);
}

applyLanguage(language);
Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 500))])
  .then(() => requestAnimationFrame(() => root.classList.add('ready')));
languageToggle.addEventListener('click', () => {
  applyLanguage(language === 'zh' ? 'en' : 'zh');
  try { localStorage.setItem('zhiqiangqin-language', language); } catch {}
  document.getElementById('language-status').textContent = messages[language].languageStatus;
});
// Circular theme reveal adapted from antfu.me (MIT), vendor/antfu.LICENSE.
let themeTransitionActive = false;
toggle.addEventListener('click', async (event) => {
  if (themeTransitionActive) return;
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  const commitTheme = () => {
    applyTheme(next);
    hasPreference = true;
    try { localStorage.setItem('zhiqiangqin-theme', next); } catch {}
  };
  if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    commitTheme();
    return;
  }
  const box = toggle.getBoundingClientRect();
  const x = event.detail ? event.clientX : box.left + box.width / 2;
  const y = event.detail ? event.clientY : box.top + box.height / 2;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  themeTransitionActive = true;
  const transition = document.startViewTransition(commitTheme);
  try {
    await transition.ready;
    const circle = [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`];
    const animation = root.animate({ clipPath: next === 'dark' ? [...circle].reverse() : circle }, {
      duration: 400, easing: 'ease-out', fill: 'forwards',
      pseudoElement: next === 'dark' ? '::view-transition-old(root)' : '::view-transition-new(root)'
    });
    await animation.finished;
  } catch {
    commitTheme();
  } finally {
    themeTransitionActive = false;
  }
});
systemTheme.addEventListener('change', (event) => {
  if (!hasPreference) applyTheme(event.matches ? 'dark' : 'light');
});
