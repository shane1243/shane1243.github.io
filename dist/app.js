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
    writingNav: '写作', contact: '联系我',
    writingSummary: '完整的观点、经验总结与长文。',
    writingEmpty: '还没有公开的文章。',
    writingDescription: 'zhiqiangqin 的写作：完整的观点、经验总结与长文。',
    greeting: '你好！我是 ', greetingEnd: '，', studentLead: '目前是',
    university: '中国科学技术大学（USTC）', studentEnd: '的大四本科生。',
    researchLead: '我的研究方向是', researchField: '时序分析', sentenceEnd: '。',
    githubProfile: 'GitHub：shane1243（在新标签页打开）',
    contactMessage: '可以在 GitHub 找到我，或通过邮件联系。',
    languageChoice: 'EN', languageAction: '切换到英文', languageStatus: '已切换为中文。',
    lightTheme: '切换为浅色模式', darkTheme: '切换为深色模式',
    description: 'zhiqiangqin，中国科学技术大学（USTC）大四本科生，研究方向为时序分析。',
  },
  en: {
    skip: 'Skip to content', home: 'zhiqiangqin home', navigation: 'Main navigation',
    writingNav: 'Writing', contact: 'Contact',
    writingSummary: 'Perspectives, lessons learned, and long-form essays.',
    writingEmpty: 'No published articles yet.',
    writingDescription: 'Writing by zhiqiangqin: perspectives, lessons learned, and long-form essays.',
    greeting: "Hi! I'm ", greetingEnd: '. ', studentLead: "I'm a senior undergraduate at ",
    university: 'the University of Science and Technology of China (USTC)', studentEnd: '.',
    researchLead: 'My research focuses on ', researchField: 'time series analysis', sentenceEnd: '.',
    githubProfile: 'GitHub: shane1243 (opens in a new tab)',
    contactMessage: 'Find me on GitHub, or get in touch by email.',
    languageChoice: '中文', languageAction: 'Switch to Chinese', languageStatus: 'Switched to English.',
    lightTheme: 'Switch to light mode', darkTheme: 'Switch to dark mode',
    description: 'zhiqiangqin is a senior undergraduate at the University of Science and Technology of China (USTC), focusing on time series analysis.',
  }
};
let language = 'en';
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
  const pageDetails = { home: ['description', null], writing: ['writingDescription', 'writingNav'] };
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
