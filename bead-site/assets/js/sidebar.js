/**
 * sidebar.js — 创作工坊 / 白板画板各自的教程侧边栏组件
 *
 * 设计要点：
 *  1. **两个界面各持一个独立实例**。实例只认自己的 moduleId，
 *     教程数据、搜索框、展开/收起状态全部互不影响：
 *       - 教程内容：由 moduleId 决定，物理上不会取到另一个模块的条目
 *       - 收起状态：storageKey 由调用方传入，创作工坊与白板各存一份
 *  2. **表现完全一致**：两页渲染的是同一份代码与同一份 CSS，
 *     所以展开/收起、图标对齐、选中态不会有任何差异。
 *  3. **图标对齐**：所有图标都放在固定尺寸的「图标轨道」里
 *     （固定宽高 + line-height + flex 居中），收起时只隐藏文字、
 *     保留同尺寸轨道，因此图标在两种状态下像素级居中且切换不跳动。
 */

import { MODULES, TUTORIALS, countOf } from './tutorial-data.js';
import { searchTutorials, renderHighlight, escapeHtml } from './tutorial-search.js';

const ICON_TRACK = 30; // 图标轨道边长（px）——两种状态共用，保证图标位置一致

/** 在文本里定位查询词（连续子串），返回 [start,end) 区间列表 */
function findRanges(text, query) {
  const q = String(query || '').trim().toLowerCase();
  const lower = String(text || '').toLowerCase();
  if (!q) return [];
  const out = [];
  let from = 0;
  while (from <= lower.length - q.length) {
    const i = lower.indexOf(q, from);
    if (i === -1) break;
    out.push([i, i + q.length]);
    from = i + 1;
  }
  return out;
}

/** 侧边栏的完整 HTML（两页共用，保证结构与类名完全一致） */
function renderMarkup(opts) {
  const { moduleId, storageKey, homeHref, otherHref } = opts;
  const m = MODULES[moduleId];
  const other = MODULES[moduleId === 'studio' ? 'whiteboard' : 'studio'];
  return `
    <div class="sb-head">
      <span class="sb-track sb-track--brand" aria-hidden="true">${m.icon}</span>
      <span class="sb-brand-text">
        <span class="sb-brand-name">${escapeHtml(m.name)}</span>
        <span class="sb-brand-sub">教程与说明</span>
      </span>
    </div>

    <div class="sb-search-wrap">
      <span class="sb-track sb-track--search" aria-hidden="true">🔍</span>
      <input class="sb-search" type="search" autocomplete="off"
             placeholder="搜索${escapeHtml(m.name)}教程…"
             aria-label="搜索${escapeHtml(m.name)}教程" />
      <p class="sb-scope">仅搜索「${escapeHtml(m.name)}」</p>
    </div>

    <div class="sb-results" aria-live="polite"></div>

    <div class="sb-foot">
      <a class="sb-link" href="tutorial-guide.html?module=${moduleId}">完整教程目录 →</a>
      <a class="sb-link sb-link--muted" href="${otherHref || other.href}">${other.icon} 前往${escapeHtml(other.name)}</a>
      <button class="sb-collapse-btn" type="button"
              aria-expanded="true" aria-label="收起侧边栏" title="收起侧边栏">
        <span class="sb-track" aria-hidden="true"><span class="sb-chevron">‹</span></span>
        <span class="sb-collapse-label">收起侧边栏</span>
      </button>
    </div>
  `;
}

/**
 * 初始化一个教程侧边栏。
 *
 * @param {Object} opts
 * @param {HTMLElement} opts.root 侧边栏容器（组件会接管其内容）
 * @param {'studio'|'whiteboard'} opts.moduleId 本实例只服务该模块
 * @param {string} opts.storageKey 收起状态的 localStorage 键（两页必须不同）
 * @param {string} [opts.homeHref] 「返回本模块页面」的链接
 * @param {string} [opts.otherHref] 另一个模块页面的链接
 * @returns {{destroy:Function, refresh:Function, isCollapsed:Function}}
 */
export function initSidebar(opts) {
  const { root, moduleId, storageKey } = opts;
  if (!root) throw new Error('initSidebar: root 未提供');
  if (!TUTORIALS[moduleId]) throw new Error('initSidebar: 未知模块 ' + moduleId);

  const entries = TUTORIALS[moduleId];   // 只取本模块，物理隔离
  const moduleName = MODULES[moduleId].name;

  root.classList.add('sb-root');
  root.innerHTML = renderMarkup(opts);

  const btn = root.querySelector('.sb-collapse-btn');
  const chevron = root.querySelector('.sb-chevron');
  const label = root.querySelector('.sb-collapse-label');
  const input = root.querySelector('.sb-search');
  const results = root.querySelector('.sb-results');

  /* ---------- 收起 / 展开：状态存各自的 key，互不影响 ---------- */
  let collapsed = false;
  try {
    collapsed = localStorage.getItem(storageKey) === '1';
  } catch (e) { /* 隐私模式忽略 */ }

  function applyCollapsed() {
    root.classList.toggle('is-collapsed', collapsed);
    btn.setAttribute('aria-expanded', String(!collapsed));
    btn.setAttribute('aria-label', collapsed ? '展开侧边栏' : '收起侧边栏');
    btn.title = collapsed ? '展开侧边栏' : '收起侧边栏';
    chevron.textContent = collapsed ? '›' : '‹';
    label.textContent = collapsed ? '展开' : '收起';
  }

  btn.addEventListener('click', () => {
    collapsed = !collapsed;
    try { localStorage.setItem(storageKey, collapsed ? '1' : '0'); } catch (e) { /* noop */ }
    applyCollapsed();
  });

  /* ---------- 搜索：结果只来自本模块 ---------- */
  function renderResults() {
    const q = input.value.trim();

    if (!q) {
      results.innerHTML = `
        <p class="sb-count">${escapeHtml(moduleName)} · ${countOf(moduleId)} 条教程</p>
        <p class="sb-hint">在上方输入框检索本模块教程。${escapeHtml(moduleName)}与另一个模块的教程数据彼此独立，搜索结果不会混在一起。</p>`;
      return;
    }

    const hits = searchTutorials(entries, q, { limit: 20 });
    if (!hits.length) {
      results.innerHTML = `
        <p class="sb-count">0 条结果</p>
        <div class="sb-empty">
          在 <b>${escapeHtml(moduleName)}</b> 里没找到「<b>${escapeHtml(q)}</b>」。<br />
          换个关键词试试，或点下方进入完整教程目录。
        </div>`;
      return;
    }

    results.innerHTML =
      `<p class="sb-count">${hits.length} 条结果 · 仅「${escapeHtml(moduleName)}」</p>` +
      hits.map((r) => `
        <a class="sb-hit" href="tutorial-guide.html?module=${moduleId}&amp;q=${encodeURIComponent(q)}&amp;id=${encodeURIComponent(r.entry.id)}">
          <span class="sb-hit-title">${renderHighlight(r.entry.title, findRanges(r.entry.title, q))}</span>
          <span class="sb-hit-cat">${escapeHtml(r.entry.category)}</span>
          <span class="sb-hit-snip">${renderHighlight(r.snippet.text, r.snippet.ranges)}</span>
        </a>`).join('');
  }

  let timer = null;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(renderResults, 120);
  });

  applyCollapsed();
  renderResults();

  return {
    destroy() { clearTimeout(timer); root.innerHTML = ''; root.classList.remove('sb-root'); },
    refresh: renderResults,
    isCollapsed: () => collapsed,
    moduleId,
  };
}

export { ICON_TRACK };
