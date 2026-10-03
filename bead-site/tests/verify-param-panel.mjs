/**
 * 参数面板改造的回归验证。
 *
 * 核心验收点：**参数取值与事件绑定完全没变**。
 * 做法是把「每个控件的 type/min/max/step/value + 能否触发原有效果」列成基线，
 * 在分组收纳打开 / 折叠 / 面板收起三种状态下各测一遍，要求完全一致。
 *
 * 另外验证：分组收纳生效、面板可收起可展开、宽度可调、
 * 以及 1440×900 / 1280×800 / 390×844 三档屏幕下画布/图纸的可用性。
 *
 * 复用本机 Edge，不下载 Chromium。
 * 运行：node tests/verify-param-panel.mjs
 *   设 BASE_URL=https://pindouwang.pages.dev 可直接验证线上。
 */
import { chromium } from 'file:///C:/Users/18062/.workbuddy/binaries/node/workspace/node_modules/playwright-core/index.mjs';

const BASE = (process.env.BASE_URL || 'http://localhost:8099').replace(/\/+$/, '');
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const errors = [];

const newPage = async (path, viewport = { width: 1440, height: 900 }) => {
  const p = await browser.newPage({ viewport });
  p.on('pageerror', (e) => errors.push(`pageerror(${path}): ${e.message}`));
  p.on('console', (m) => {
    if (m.type() === 'error' && !/favicon/.test(m.text())) errors.push(`console(${path}): ${m.text()}`);
  });
  await p.goto(BASE + path, { waitUntil: 'networkidle' });
  await p.waitForTimeout(700);
  return p;
};

/** 读取一组控件的完整规格（type/min/max/step/value/checked/selectedIndex） */
async function spec(page, ids) {
  return page.evaluate((list) => {
    const out = {};
    for (const id of list) {
      const el = document.getElementById(id);
      if (!el) { out[id] = 'MISSING'; continue; }
      const v = el.value;
      out[id] = [
        el.tagName.toLowerCase(),
        el.type || '',
        el.min ?? '', el.max ?? '', el.step ?? '',
        Array.isArray(v) ? v.join(',') : v,
        el.checked ?? '',
        el.selectedIndex ?? '',
      ].join('|');
    }
    return out;
  }, ids);
}

/* ================= 白板画板 ================= */
const WB_IDS = [
  'wb-board-size-select', 'wb-size-slider', 'wb-bright-range', 'wb-contrast-range', 'wb-saturate-range',
  'tool-pen', 'tool-bucket', 'tool-eraser', 'tool-picker', 'tool-rect', 'tool-line', 'tool-move',
  'symmetry-mode', 'btn-undo', 'btn-redo', 'btn-clear', 'btn-hflip', 'btn-vflip', 'btn-rotate',
  'btn-import-grid', 'btn-import-ref', 'image-input', 'ref-image-toggle', 'ref-alpha',
  'btn-toggle-grid', 'btn-toggle-ruler', 'btn-toggle-code',
  'palette-select', 'palette-search', 'active-color-dot', 'active-color-name',
];

const wb = await newPage('/whiteboard.html');
const wbBaseline = await spec(wb, WB_IDS);

// 分组结构
const wbGroups = await wb.evaluate(() => {
  const sb = document.querySelector('.draw-sidebar');
  return {
    isPanel: sb.classList.contains('is-param-panel'),
    handle: !!sb.querySelector('.pp-resize-handle'),
    head: !!sb.querySelector('.pp-head-title'),
    groups: [...sb.querySelectorAll('.pp-group')].map((g) => ({
      title: g.querySelector('.pp-group-label').textContent,
      open: g.classList.contains('is-open'),
    })),
  };
});

// 展开「全部展开」后再测规格
await wb.evaluate(() => document.querySelectorAll('.pp-head-actions .pp-mini-btn')[0].click());
await wb.waitForTimeout(300);
const wbAllOpen = await spec(wb, WB_IDS);
const wbGroupsAfterAll = await wb.evaluate(() =>
  [...document.querySelectorAll('.draw-sidebar .pp-group')].map((g) => g.classList.contains('is-open')));

// 全部收起 → 再测规格（控件在 display:none 里，规格仍应一致）
await wb.evaluate(() => document.querySelectorAll('.pp-head-actions .pp-mini-btn')[0].click());
await wb.waitForTimeout(300);
const wbAllClosed = await spec(wb, WB_IDS);

// 面板整体收起 / 展开
await wb.evaluate(() => {
  document.querySelector('.draw-sidebar .pp-collapse-btn').click();
});
await wb.waitForTimeout(400);
const wbPanelCollapsed = await wb.evaluate(() => ({
  collapsed: document.querySelector('.draw-sidebar').classList.contains('is-collapsed'),
  // 把手只在收起时出现，作为唯一的展开入口
  gutterVisible: !!document.querySelector('.pp-gutter-btn')?.offsetParent,
  canvasW: Math.round(document.getElementById('workbench-left').querySelector('.viewport-box').getBoundingClientRect().width),
}));
await wb.evaluate(() => {
  const b = document.querySelector('.pp-gutter-btn');
  if (b) b.click();
});
await wb.waitForTimeout(400);
const wbPanelReopened = await wb.evaluate(() => ({
  collapsed: document.querySelector('.draw-sidebar').classList.contains('is-collapsed'),
  gutterVisible: !!document.querySelector('.pp-gutter-btn')?.offsetParent,
  canvasW: Math.round(document.getElementById('workbench-left').querySelector('.viewport-box').getBoundingClientRect().width),
}));

// 宽度拖拽
const wbWidth = await wb.evaluate(async () => {
  const sb = document.querySelector('.draw-sidebar');
  const before = sb.getBoundingClientRect().width;
  const handle = sb.querySelector('.pp-resize-handle');
  const r = handle.getBoundingClientRect();
  handle.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: r.left + 3, clientY: r.top + 40, pointerId: 1 }));
  window.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: r.left + 83, clientY: r.top + 40, pointerId: 1 }));
  window.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, clientX: r.left + 83, clientY: r.top + 40, pointerId: 1 }));
  await new Promise((r2) => setTimeout(r2, 120));
  return { before: Math.round(before), after: Math.round(sb.getBoundingClientRect().width) };
});

// 工具真的还能用（点画笔 → 画一笔 → 检查 canvas 尺寸变化说明渲染未崩）
const wbToolWorks = await wb.evaluate(async () => {
  document.getElementById('tool-pen').click();
  const c = document.getElementById('wb-canvas');
  const r = c.getBoundingClientRect();
  const ev = (t, x, y) => c.dispatchEvent(new PointerEvent(t, { bubbles: true, clientX: r.left + x, clientY: r.top + y, pointerId: 1, isPrimary: true }));
  const evw = (t, x, y) => window.dispatchEvent(new PointerEvent(t, { bubbles: true, clientX: r.left + x, clientY: r.top + y, pointerId: 1, isPrimary: true }));
  ev('pointerdown', 30, 30); evw('pointermove', 32, 32); evw('pointerup', 32, 32);
  await new Promise((r2) => setTimeout(r2, 200));
  return {
    penActive: document.getElementById('tool-pen').classList.contains('active'),
    legendHasEntries: document.querySelectorAll('#stats-container tbody tr').length > 0,
  };
});

// 各档屏幕下画布可见性
const wbViewports = [];
for (const vp of [{ width: 1440, height: 900 }, { width: 1280, height: 800 }, { width: 1366, height: 768 }, { width: 390, height: 844 }]) {
  const p = await newPage('/whiteboard.html', vp);
  const d = await p.evaluate(() => {
    const wbEl = document.getElementById('workbench-left');
    const cv = wbEl.querySelector('.viewport-box').getBoundingClientRect();
    const sb = document.querySelector('.draw-sidebar');
    const groups = [...sb.querySelectorAll('.pp-group')].length;
    return {
      画布完整可见: cv.top >= 0 && cv.bottom <= window.innerHeight + 2,
      画布高: Math.round(cv.height),
      画布宽: Math.round(cv.width),
      分组数: groups,
      // 拖拽把手本就设计为探出右缘 3px，判定时排除它（容差 6px）
      侧栏可横向滚动: sb.scrollWidth > sb.clientWidth + 6,
      面板超出视口宽: sb.getBoundingClientRect().width > window.innerWidth,
    };
  });
  wbViewports.push({ 尺寸: `${vp.width}x${vp.height}`, ...d });
  await p.close();
}

/* ================= 创作工坊 ================= */
const CT_IDS = [
  'board-width', 'palette-select', 'max-color-select', 'pegboard-select',
  'bg-toggle', 'bg-tolerance', 'noise-threshold',
  'brightness-range', 'contrast-range', 'saturate-range',
];
const ct = await newPage('/create.html');
const ctBaseline = await spec(ct, CT_IDS);
const ctGroups = await ct.evaluate(() => {
  const grid = document.getElementById('studio-params');
  return {
    isPanel: grid.classList.contains('is-param-panel'),
    groups: [...grid.querySelectorAll('.pp-group')].map((g) => ({
      title: g.querySelector('.pp-group-label').textContent,
      open: g.classList.contains('is-open'),
    })),
    // 两列布局是否保住
    cols: getComputedStyle(grid.querySelector('.pp-body')).gridTemplateColumns,
  };
});
await ct.evaluate(() => document.querySelectorAll('#studio-params .pp-head-actions .pp-mini-btn')[0].click());
await ct.waitForTimeout(300);
const ctAllOpen = await spec(ct, CT_IDS);
await ct.evaluate(() => document.getElementById('board-width').dispatchEvent(new Event('input', { bubbles: true })));
const ctAfterInput = await spec(ct, CT_IDS);
const ctValueLabel = await ct.evaluate(() => document.getElementById('board-width-val').textContent.trim());

await ct.evaluate(() => document.querySelector('#studio-params .pp-collapse-btn').click());
await ct.waitForTimeout(300);
const ctCollapsed = await ct.evaluate(() => ({
  collapsed: document.getElementById('studio-params').classList.contains('is-collapsed'),
  bodyHidden: !document.querySelector('#studio-params .pp-body').offsetParent,
}));
const ctWhenCollapsed = await spec(ct, CT_IDS);
await ct.evaluate(() => document.querySelector('#studio-params .pp-collapse-btn').click());
await ct.waitForTimeout(300);
const ctReopened = await spec(ct, CT_IDS);

// 创作工坊各档屏幕
const ctViewports = [];
for (const vp of [{ width: 1440, height: 900 }, { width: 1280, height: 800 }, { width: 390, height: 844 }]) {
  const p = await newPage('/create.html', vp);
  const d = await p.evaluate(() => {
    const stage = document.getElementById('stage-canvas');
    const sr = stage.getBoundingClientRect();
    const grid = document.getElementById('studio-params');
    return {
      展示台完整可见: sr.top >= 0 && sr.bottom <= window.innerHeight + 2,
      展示台宽: Math.round(sr.width),
      // 拖拽把手在 grid 场景下被 CSS 隐藏，不应计入溢出
      参数区不横向溢出: grid.scrollWidth <= grid.clientWidth + 6,
    };
  });
  ctViewports.push({ 尺寸: `${vp.width}x${vp.height}`, ...d });
  await p.close();
}

await wb.close();
await ct.close();
await browser.close();

/* ================= 断言 ================= */
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const sameSpec = (a, b) => {
  const diffs = [];
  for (const k of Object.keys(a)) if (a[k] !== b[k]) diffs.push(`${k}: ${a[k]} → ${b[k]}`);
  return diffs;
};

const wbDiffAllOpen = sameSpec(wbBaseline, wbAllOpen);
const wbDiffAllClosed = sameSpec(wbBaseline, wbAllClosed);
const ctDiffAllOpen = sameSpec(ctBaseline, ctAllOpen);
const ctDiffCollapsed = sameSpec(ctBaseline, ctWhenCollapsed);
const ctDiffReopened = sameSpec(ctBaseline, ctReopened);
const missingIds = [
  ...WB_IDS.filter((id) => String(wbBaseline[id]).includes('MISSING')),
  ...CT_IDS.filter((id) => String(ctBaseline[id]).includes('MISSING')),
];

const report = {
  errors,
  whiteboard: { groups: wbGroups, groupsAfterAll: wbGroupsAfterAll, panel: wbPanelCollapsed, reopened: wbPanelReopened, width: wbWidth, tool: wbToolWorks, viewports: wbViewports },
  studio: { groups: ctGroups, collapsed: ctCollapsed, valueLabel: ctValueLabel, viewports: ctViewports },
  specDiff: {
    whiteboardAllOpen: wbDiffAllOpen,
    whiteboardAllClosed: wbDiffAllClosed,
    studioAllOpen: ctDiffAllOpen,
    studioCollapsed: ctDiffCollapsed,
    studioReopened: ctDiffReopened,
  },
  verdict: {
    noMissingControls: missingIds.length === 0,
    // 取值零漂移
    whiteboardSpecsIdentical: wbDiffAllOpen.length === 0 && wbDiffAllClosed.length === 0,
    studioSpecsIdentical: ctDiffAllOpen.length === 0 && ctDiffCollapsed.length === 0 && ctDiffReopened.length === 0,
    // 收纳生效
    whiteboardPanelActive: wbGroups.isPanel && wbGroups.groups.length === 7,
    whiteboardHasHandle: wbGroups.handle && wbGroups.head,
    studioPanelActive: ctGroups.isPanel && ctGroups.groups.length === 2,
    highFreqGroupOpen: wbGroups.groups[0].open === true,
    lowFreqGroupFolded: wbGroups.groups.slice(3).every((g) => g.open === false),
    studioLowFreqFolded: ctGroups.groups[1].open === false,
    allExpandWorks: wbGroupsAfterAll.every(Boolean),
    // 面板行为
    panelCollapses: wbPanelCollapsed.collapsed === true && wbPanelCollapsed.gutterVisible === true,
    panelReopens: wbPanelReopened.collapsed === false && wbPanelReopened.gutterVisible === false,
    collapseWidensCanvas: wbPanelCollapsed.canvasW > wbPanelReopened.canvasW + 200,
    widthDraggable: wbWidth.after > wbWidth.before + 30,
    // 工具仍可用
    toolsStillWork: wbToolWorks.penActive && wbToolWorks.legendHasEntries,
    // 画布可见性（桌面三档）
    canvasVisibleAllDesktop: wbViewports.filter((v) => !v.尺寸.startsWith('390')).every((v) => v.画布完整可见),
    noHorizontalOverflow: wbViewports.every((v) => !v.侧栏可横向滚动 && !v.面板超出视口宽),
    studioNoOverflow: ctViewports.every((v) => v.参数区不横向溢出),
    mobileUsable: wbViewports.find((v) => v.尺寸 === '390x844')?.分组数 === 7
      && ctViewports.find((v) => v.尺寸 === '390x844')?.参数区不横向溢出 === true,    noJsErrors: errors.length === 0,
  },
};
console.log(JSON.stringify(report, null, 2));
