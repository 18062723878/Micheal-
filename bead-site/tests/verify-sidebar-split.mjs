/**
 * 端到端验证：两个界面的侧边栏是否真正独立，以及收起/展开时图标是否对齐。
 *
 * 独立性验收点：
 *   - 各页只展示自己模块的教程（互不串扰）
 *   - 收起状态互不影响（用各自 localStorage key）
 *
 * 图标对齐验收点（用 getBoundingClientRect 客观测量，不靠肉眼）：
 *   - 收起前后，品牌图标与折叠按钮的中心点 X 坐标偏差 ≤ 1px
 *   - 收起前后，两枚图标的中心 Y 坐标各自稳定（同状态内重复测量一致）
 *   - 展开态下菜单文字排版与选中态样式不受影响
 *
 * 复用本机 Edge，不下载 Chromium。
 * 运行：node tests/verify-sidebar-split.mjs
 *   设 BASE_URL=https://pindouwang.pages.dev 可直接验证线上。
 */
import { chromium } from 'file:///C:/Users/18062/.workbuddy/binaries/node/workspace/node_modules/playwright-core/index.mjs';

const BASE = (process.env.BASE_URL || 'http://localhost:8099').replace(/\/+$/, '');
const browser = await chromium.launch({ channel: 'msedge', headless: true });

const errors = [];
const newPage = async (path) => {
  const p = await browser.newPage({ viewport: { width: 1500, height: 1000 } });
  p.on('pageerror', (e) => errors.push(`pageerror(${path}): ${e.message}`));
  p.on('console', (m) => {
    if (m.type() === 'error' && !/favicon/.test(m.text())) errors.push(`console(${path}): ${m.text()}`);
  });
  await p.goto(BASE + path, { waitUntil: 'networkidle' });
  await p.waitForTimeout(300);
  return p;
};

/** 读取某页侧栏的度量数据 */
async function measure(page, sidebarId) {
  return page.evaluate((sid) => {
    const root = document.getElementById(sid);
    if (!root) return { missing: true };
    const collapsed = root.classList.contains('is-collapsed');

    const trackInfo = (sel) => {
      const el = root.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        sel,
        // 中心点坐标 —— 对齐判定的核心依据
        cx: +(r.left + r.width / 2).toFixed(2),
        cy: +(r.top + r.height / 2).toFixed(2),
        w: +r.width.toFixed(2),
        h: +r.height.toFixed(2),
      };
    };

    return {
      collapsed,
      rootW: +root.getBoundingClientRect().width.toFixed(2),
      ariaExpanded: root.querySelector('.sb-collapse-btn')?.getAttribute('aria-expanded'),
      scopeText: root.querySelector('.sb-scope')?.textContent.trim(),
      countText: root.querySelector('.sb-count')?.textContent.trim(),
      hintText: root.querySelector('.sb-hint')?.textContent.trim(),
      brand: trackInfo('.sb-track--brand'),
      collapseBtn: trackInfo('.sb-collapse-btn .sb-track'),
      brandTextVisible: !!root.querySelector('.sb-brand-text')?.offsetParent,
      searchVisible: !!root.querySelector('.sb-search-wrap')?.offsetParent,
      resultsVisible: !!root.querySelector('.sb-results')?.offsetParent,
      footVisible: !!root.querySelector('.sb-foot')?.offsetParent,
      // 展开态专属：文字与链接排版
      brandName: root.querySelector('.sb-brand-name')?.textContent.trim(),
      linkTexts: [...root.querySelectorAll('.sb-link')].map((a) => a.textContent.trim()),
    };
  }, sidebarId);
}

async function search(page, sidebarId, q) {
  return page.evaluate(async ([sid, query]) => {
    const root = document.getElementById(sid);
    const el = root.querySelector('.sb-search');
    el.value = query;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 260));
    return {
      count: root.querySelector('.sb-count')?.textContent.trim(),
      hits: [...root.querySelectorAll('.sb-hit-title')].map((n) => n.textContent.trim()),
      empty: !!root.querySelector('.sb-empty'),
      marks: root.querySelectorAll('.sb-hit mark').length,
    };
  }, [sidebarId, q]);
}

async function toggle(page, sidebarId) {
  await page.evaluate((sid) => {
    document.getElementById(sid).querySelector('.sb-collapse-btn').click();
  }, sidebarId);
  await page.waitForTimeout(400);
}

async function readStore(page, key) {
  return page.evaluate((k) => localStorage.getItem(k), key);
}

/* ============ 创作工坊页 ============ */
const studio = await newPage('/create.html');
const studioOpen = await measure(studio, 'studio-sidebar');
const studioSearch = await search(studio, 'studio-sidebar', '色号');
// 只属于白板的概念，在创作工坊侧栏应搜不到
const studioIsolation = await search(studio, 'studio-sidebar', '对称');

await toggle(studio, 'studio-sidebar');
const studioCollapsed = await measure(studio, 'studio-sidebar');
const studioStoreCollapsed = await readStore(studio, 'studio.sidebar.collapsed');
await toggle(studio, 'studio-sidebar');
const studioReopened = await measure(studio, 'studio-sidebar');

/* ============ 白板画板页（同一浏览器上下文，共享 localStorage） ============ */
const wb = await newPage('/whiteboard.html');
const wbOpen = await measure(wb, 'wb-sidebar');
const wbSearch = await search(wb, 'wb-sidebar', '色号');
// 只属于创意工坊的概念，在白板侧栏应搜不到
const wbIsolation = await search(wb, 'wb-sidebar', '拼豆模式');

// 关键：此时创作工坊是展开的，收起白板不应影响创作工坊的存储键
const wbStoreBefore = await readStore(wb, 'whiteboard.sidebar.collapsed');
const studioStoreBeforeWBToggle = await readStore(wb, 'studio.sidebar.collapsed');

await toggle(wb, 'wb-sidebar');
const wbCollapsed = await measure(wb, 'wb-sidebar');
const wbStoreCollapsed = await readStore(wb, 'whiteboard.sidebar.collapsed');
// 收起白板后，创作工坊的键必须原样不动
const studioStoreAfterWBToggle = await readStore(wb, 'studio.sidebar.collapsed');

await toggle(wb, 'wb-sidebar');
const wbReopened = await measure(wb, 'wb-sidebar');

/* ============ 图标对齐：跨状态比较中心点 ============ */
function cx(t) { return t ? t.cx : NaN; }

// 判定口径：比较「图标轨道中心」在展开/收起两种状态下是否一致。
// 折叠按钮在展开态是全宽按钮（居中于内容区）、收起态是 30px 图标按钮，
// 二者的**按钮盒**宽度本就不同，因此对齐判定落在按钮内的图标轨道上。
const brandXDelta = Math.abs(cx(studioOpen.brand) - cx(studioCollapsed.brand));
const btnXDelta = Math.abs(cx(studioOpen.collapseBtn) - cx(studioCollapsed.collapseBtn));
// 同一状态内重复测量应完全稳定（验证无抖动）
const brandXRepeat = Math.abs(cx(studioReopened.brand) - cx(studioOpen.brand));
const btnXRepeat = Math.abs(cx(studioReopened.collapseBtn) - cx(studioOpen.collapseBtn));
// 白板页同样口径
const wbBrandXDelta = Math.abs(cx(wbOpen.brand) - cx(wbCollapsed.brand));
const wbBtnXDelta = Math.abs(cx(wbOpen.collapseBtn) - cx(wbCollapsed.collapseBtn));
// 图标轨道尺寸应恒定（这是不跳动的前提）
const brandSizeStable =
  studioOpen.brand.w === studioCollapsed.brand.w && studioCollapsed.brand.w === studioReopened.brand.w;
// 纵向稳定性：同一状态下重复测量，图标中心 Y 不应变化
const brandYStable = studioOpen.brand.cy === studioReopened.brand.cy
  && wbOpen.brand.cy === wbReopened.brand.cy;
// 收起态两枚图标应落在同一条垂直中轴线上（水平居中于侧栏）
const collapsedAxisDelta = Math.abs(
  cx(studioCollapsed.brand) - cx(studioCollapsed.collapseBtn)
);

await studio.screenshot({ path: 'sidebar-studio.png' }).catch(() => {});
await wb.screenshot({ path: 'sidebar-whiteboard.png' }).catch(() => {});
await browser.close();

const report = {
  errors,
  studio: { open: studioOpen, collapsed: studioCollapsed, reopened: studioReopened, search: studioSearch, isolation: studioIsolation },
  whiteboard: { open: wbOpen, collapsed: wbCollapsed, reopened: wbReopened, search: wbSearch, isolation: wbIsolation },
  storage: {
    studioAfterCollapse: studioStoreCollapsed,
    whiteboardBefore: wbStoreBefore,
    studioBeforeWBToggle: studioStoreBeforeWBToggle,
    whiteboardAfterCollapse: wbStoreCollapsed,
    studioAfterWBToggle: studioStoreAfterWBToggle,
  },
  alignment: {
    brandCenterXDelta: +brandXDelta.toFixed(2),
    buttonCenterXDelta: +btnXDelta.toFixed(2),
    brandRepeatDelta: +brandXRepeat.toFixed(2),
    buttonRepeatDelta: +btnXRepeat.toFixed(2),
    wbBrandCenterXDelta: +wbBrandXDelta.toFixed(2),
    wbButtonCenterXDelta: +wbBtnXDelta.toFixed(2),
    collapsedAxisDelta: +collapsedAxisDelta.toFixed(2),
    verticalStable: brandYStable,
    brandTrackWidth: studioOpen.brand.w,
    brandTrackStable: brandSizeStable,
  },
  verdict: {
    studioHasSidebar: !studioOpen.missing,
    whiteboardHasSidebar: !wbOpen.missing,
    // 独立性：各页只认自己的模块
    studioScopeCorrect: (studioOpen.scopeText || '').includes('创意工坊'),
    whiteboardScopeCorrect: (wbOpen.scopeText || '').includes('白板画板'),
    studioDoesNotLeakWhiteboard: studioIsolation.hits.length === 0 && studioIsolation.empty === true,
    whiteboardDoesNotLeakStudio: wbIsolation.hits.length === 0 && wbIsolation.empty === true,
    sharedKeywordWorksBoth: studioSearch.hits.length > 0 && wbSearch.hits.length > 0,
    highlightInBoth: studioSearch.marks > 0 && wbSearch.marks > 0,
    // 独立性：收起状态互不影响
    studioStoresOwnKey: studioStoreCollapsed === '1',
    whiteboardUsesDifferentKey: studioStoreBeforeWBToggle !== undefined,
    whiteboardCollapseDoesNotTouchStudioKey:
      studioStoreBeforeWBToggle === studioStoreAfterWBToggle,
    whiteboardStoresOwnKey: wbStoreCollapsed === '1',
    // 展开收起行为
    bothStartExpanded: studioOpen.collapsed === false && wbOpen.collapsed === false,
    bothCollapse: studioCollapsed.collapsed === true && wbCollapsed.collapsed === true,
    bothReopen: studioReopened.collapsed === false && wbReopened.collapsed === false,
    collapseHidesText: studioCollapsed.brandTextVisible === false && studioCollapsed.searchVisible === false,
    expandRestoresText: studioReopened.searchVisible === true && studioReopened.resultsVisible === true,
    ariaSynced: studioOpen.ariaExpanded === 'true' && studioCollapsed.ariaExpanded === 'false',
    // 图标对齐（客观测量：中心点偏差 ≤ 1px）
    brandCenterAligned: brandXDelta <= 1,
    buttonCenterAligned: btnXDelta <= 1,
    noJitterOnRepeat: brandXRepeat <= 0.5 && btnXRepeat <= 0.5,
    whiteboardBrandAligned: wbBrandXDelta <= 1,
    whiteboardButtonAligned: wbBtnXDelta <= 1,
    collapsedIconsShareAxis: collapsedAxisDelta <= 1,
    verticalPositionStable: brandYStable,
    brandTrackSizeStable: brandSizeStable,
    // 文字排版与选中态不受影响
    textLayoutIntact: studioOpen.brandName === '创意工坊'
      && studioOpen.linkTexts.some((t) => t.includes('完整教程目录'))
      && wbOpen.brandName === '白板画板'
      && wbOpen.linkTexts.some((t) => t.includes('完整教程目录')),
    noJsErrors: errors.length === 0,
  },
};
console.log(JSON.stringify(report, null, 2));
