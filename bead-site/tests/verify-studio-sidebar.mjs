/**
 * 侧边栏与教程检索的端到端验证：
 *  - 侧边栏可收缩/展开，初始状态为展开
 *  - 两个导航项切换后主内容区显示对应工作区
 *  - 搜索只命中当前模块的教程，两个模块数据互不混淆
 *  - 命中片段高亮、无结果空状态、可跳转完整教程目录
 * 复用本机 Edge，不下载 Chromium。
 */
import { chromium } from 'file:///C:/Users/18062/.workbuddy/binaries/node/workspace/node_modules/playwright-core/index.mjs';

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width: 1500, height: 1000 } });
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' && !/favicon/.test(m.text())) errors.push('console: ' + m.text()); });

await page.goto('http://localhost:8099/create.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);

/* 1. 初始展开 */
const initial = await page.evaluate(() => ({
  collapsed: document.getElementById('studio-shell').classList.contains('is-collapsed'),
  ariaExpanded: document.getElementById('sb-collapse').getAttribute('aria-expanded'),
  navItems: [...document.querySelectorAll('#sb-nav .sb-nav-item')].map((b) => b.textContent.replace(/\s+/g, ' ').trim()),
  studioVisible: !document.getElementById('pane-studio').hidden,
  wbVisible: !document.getElementById('pane-whiteboard').hidden,
}));

/* 2. 收缩 / 展开 */
const collapse = await page.evaluate(async () => {
  const wait = () => new Promise((r) => setTimeout(r, 350));
  const shell = document.getElementById('studio-shell');
  document.getElementById('sb-collapse').click();
  await wait();
  const collapsedState = {
    collapsed: shell.classList.contains('is-collapsed'),
    ariaExpanded: document.getElementById('sb-collapse').getAttribute('aria-expanded'),
    searchVisible: !!document.getElementById('sb-search').offsetParent,
  };
  document.getElementById('sb-collapse').click();
  await wait();
  return { collapsedState, backToExpanded: !shell.classList.contains('is-collapsed') };
});

/* 3. 切换到白板画板 */
const switchToWb = await page.evaluate(async () => {
  const wait = (t = 600) => new Promise((r) => setTimeout(r, t));
  const btns = [...document.querySelectorAll('#sb-nav .sb-nav-item')];
  btns[1].click();
  await wait();
  return {
    studioHidden: document.getElementById('pane-studio').hidden,
    wbVisible: !document.getElementById('pane-whiteboard').hidden,
    scopeLabel: document.getElementById('sb-scope').textContent.trim(),
    frameSrc: document.getElementById('whiteboard-frame').getAttribute('src'),
    allLink: document.getElementById('sb-all-link').getAttribute('href'),
  };
});

/* 4. 在白板模块下搜索 —— 关键：不得出现创意工坊的条目 */
const searchInWb = await page.evaluate(async () => {
  const wait = (t = 260) => new Promise((r) => setTimeout(r, t));
  const el = document.getElementById('sb-search');
  el.value = '色号';
  el.dispatchEvent(new Event('input', { bubbles: true }));
  await wait();
  const hits = [...document.querySelectorAll('#sb-results .sb-hit-title')].map((n) => n.textContent.trim());
  return {
    hits,
    head: document.querySelector('#sb-results .sb-results-head')?.textContent.trim(),
    marks: document.querySelectorAll('#sb-results mark').length,
    allLink: document.getElementById('sb-all-link').getAttribute('href'),
  };
});

/* 5. 搜一个只属于创意工坊的关键词（在白板模块下应为空状态） */
const isolation = await page.evaluate(async () => {
  const wait = (t = 260) => new Promise((r) => setTimeout(r, t));
  const el = document.getElementById('sb-search');
  el.value = '拼豆模式';
  el.dispatchEvent(new Event('input', { bubbles: true }));
  await wait();
  return {
    hits: [...document.querySelectorAll('#sb-results .sb-hit-title')].map((n) => n.textContent.trim()),
    empty: !!document.querySelector('#sb-results .sb-empty'),
    emptyText: document.querySelector('#sb-results .sb-empty')?.textContent.replace(/\s+/g, ' ').trim().slice(0, 60),
  };
});

/* 6. 切回创意工坊再搜同一个词 —— 应该有结果（证明数据源独立且完整） */
const isolationBack = await page.evaluate(async () => {
  const wait = (t = 300) => new Promise((r) => setTimeout(r, t));
  document.querySelectorAll('#sb-nav .sb-nav-item')[0].click();
  await wait();
  const el = document.getElementById('sb-search');
  el.value = '拼豆模式';
  el.dispatchEvent(new Event('input', { bubbles: true }));
  await wait();
  return {
    scope: document.getElementById('sb-scope').textContent.trim(),
    hits: [...document.querySelectorAll('#sb-results .sb-hit-title')].map((n) => n.textContent.trim()),
    empty: !!document.querySelector('#sb-results .sb-empty'),
  };
});

/* 7. 完整教程目录页：模块切换 + 高亮 + 定位 */
const guide = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
guide.on('pageerror', (e) => errors.push('guide pageerror: ' + e.message));
await guide.goto('http://localhost:8099/tutorial-guide.html', { waitUntil: 'networkidle' });
const guideStudio = await guide.evaluate(() => ({
  count: document.getElementById('td-count').textContent.trim(),
  cats: [...document.querySelectorAll('.td-cat > h2')].map((h) => h.textContent.trim()),
  entries: document.querySelectorAll('.td-entry').length,
  tables: document.querySelectorAll('.td-ctrl-table').length,
}));

// 搜「色号」：两个模块都应有结果（该词确实同时出现在两套教程里）
const guideSearch = await guide.evaluate(async () => {
  const wait = (t = 300) => new Promise((r) => setTimeout(r, t));
  const el = document.getElementById('td-search');
  el.value = '色号';
  el.dispatchEvent(new Event('input', { bubbles: true }));
  await wait();
  return {
    count: document.getElementById('td-count').textContent.trim(),
    marks: document.querySelectorAll('mark').length,
    entries: document.querySelectorAll('.td-entry').length,
  };
});

// 搜「对称」：这是白板画板独有的概念 —— 创意工坊下必须是空状态（证明数据源隔离）
const guideIsolation = await guide.evaluate(async () => {
  const wait = (t = 300) => new Promise((r) => setTimeout(r, t));
  const el = document.getElementById('td-search');
  el.value = '对称';
  el.dispatchEvent(new Event('input', { bubbles: true }));
  await wait();
  const studioState = {
    entries: document.querySelectorAll('.td-entry').length,
    emptyShown: !!document.querySelector('.td-empty'),
  };
  // 切到白板画板，同一个词应当命中
  document.querySelectorAll('#td-switch button')[1].click();
  await wait();
  const wbState = {
    entries: document.querySelectorAll('.td-entry').length,
    marks: document.querySelectorAll('mark').length,
    titles: [...document.querySelectorAll('.td-entry h3')].map((h) => h.textContent.trim()),
  };
  return { studioState, wbState };
});

const guideSwitch = await guide.evaluate(() => ({
  title: document.getElementById('td-title').textContent.trim(),
  cats: [...document.querySelectorAll('.td-cat > h2')].map((h) => h.textContent.trim()),
  note: document.getElementById('td-note').textContent.trim(),
}));
/* 侧栏点「查看完整教程目录」跳转，验证参数透传 */
await page.evaluate(() => { document.getElementById('sb-search').value = '色号'; document.getElementById('sb-search').dispatchEvent(new Event('input', { bubbles: true })); });
await page.waitForTimeout(300);
const jumpHref = await page.evaluate(() => document.getElementById('sb-all-link').getAttribute('href'));
await page.goto('http://localhost:8099/' + jumpHref, { waitUntil: 'networkidle' });
await page.waitForTimeout(300);
const jumpResult = await page.evaluate(() => ({
  count: document.getElementById('td-count').textContent.trim(),
  title: document.getElementById('td-title').textContent.trim(),
  marked: document.querySelectorAll('.td-entry.is-hit').length,
}));

await browser.close();
const changed = (a, b) => JSON.stringify(a) !== JSON.stringify(b);
const report = {
  errors,
  initial,
  collapse,
  switchToWb,
  searchInWb,
  isolation,
  isolationBack,
  guide: { studio: guideStudio, search: guideSearch, isolation: guideIsolation, switchModule: guideSwitch, jump: jumpResult, jumpHref },
  verdict: {
    sidebarStartsExpanded: initial.collapsed === false && initial.ariaExpanded === 'true',
    twoNavItems: initial.navItems.length === 2,
    startsOnStudio: initial.studioVisible && !initial.wbVisible,
    collapseWorks: collapse.collapsedState.collapsed === true && collapse.backToExpanded === true,
    searchHiddenWhenCollapsed: collapse.collapsedState.searchVisible === false,
    switchShowsWhiteboard: switchToWb.wbVisible && switchToWb.studioHidden,
    scopeFollowsModule: switchToWb.scopeLabel.includes('白板画板'),
    whiteboardSearchWorks: searchInWb.hits.length > 0,
    highlightRendered: searchInWb.marks > 0,
    whiteboardResultDoesNotLeakStudio: isolation.hits.length === 0 && isolation.empty === true,
    sameQueryFindsStudioResult: isolationBack.hits.length > 0 && isolationBack.empty === false,
    guidePageHasAllCategories: guideStudio.cats.length >= 4,
    guidePageHasControlTables: guideStudio.tables > 0,
    guideSearchHighlights: guideSearch.marks > 0,
    guideIsolationStudio: guideIsolation.studioState.entries === 0 && guideIsolation.studioState.emptyShown === true,
    guideIsolationWhiteboard: guideIsolation.wbState.entries > 0 && guideIsolation.wbState.marks > 0,
    guideModuleSwitch: guideSwitch.title.includes('白板画板'),
    sidebarJumpPassesQuery: jumpResult.marked > 0 && jumpResult.title.includes('创意工坊'),
    noJsErrors: errors.length === 0,
  },
};
console.log(JSON.stringify(report, null, 2));
