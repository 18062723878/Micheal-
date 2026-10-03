/**
 * 浏览器端到端验证：驱动真实的 whiteboard.html，
 * 确认「调节亮度/对比度/饱和度 → 画布色号实时更新」这条用户报告的 bug 已修复。
 *
 * 复用本机 Edge（channel: msedge），不下载 Chromium。
 * 运行前先在 bead-site 目录起一个静态服务器：
 *   python -m http.server 8099
 * 然后：
 *   node tests/verify-whiteboard.mjs
 */
import { chromium } from 'file:///C:/Users/18062/.workbuddy/binaries/node/workspace/node_modules/playwright-core/index.mjs';

const URL = process.env.WB_URL || 'http://localhost:8099/whiteboard.html';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
// 清空画板等操作会弹 confirm，默认接受
page.on('dialog', (d) => d.accept());

await page.goto(URL, { waitUntil: 'networkidle' });

/* ---------- 1. 新增控件是否都已渲染 ---------- */
const controls = await page.evaluate(() => {
  const ids = ['btn-redo', 'tool-rect', 'tool-line', 'tool-move', 'brush-size-btns',
    'btn-symmetry', 'symmetry-mode', 'btn-import-grid', 'btn-import-ref',
    'btn-toggle-grid', 'btn-toggle-ruler', 'btn-toggle-code', 'palette-search', 'btn-rotate'];
  return {
    missing: ids.filter((id) => !document.getElementById(id)),
    swatches: document.querySelectorAll('#swatches-container .swatch').length,
    paletteMeta: (document.getElementById('palette-meta') || {}).textContent,
  };
});

/* ---------- 2. 在干净画布上只画一格 A05，扫三个滤镜 ---------- */
const filterTrace = await page.evaluate(async () => {
  const wait = (t = 80) => new Promise((res) => setTimeout(res, t));
  const codes = () => [...document.querySelectorAll('#stats-container tbody tr')]
    .map((tr) => tr.querySelector('strong').textContent.trim()).sort().join('/') || '(空)';

  // 清空画板，确保基线干净
  document.getElementById('btn-clear').click();
  await wait();

  // 选中 A05 并画一格
  const sw = [...document.querySelectorAll('#swatches-container .swatch')]
    .find((s) => s.title.startsWith('A05'));
  sw.click();
  const c = document.getElementById('wb-canvas');
  const rect = c.getBoundingClientRect();
  const ev = (t, x, y, target) => target.dispatchEvent(new PointerEvent(t, {
    bubbles: true, clientX: rect.left + x, clientY: rect.top + y, pointerId: 1, isPrimary: true,
  }));
  ev('pointerdown', 40, 40, c);
  ev('pointerup', 40, 40, window);
  await wait();

  const base = codes();
  const trace = {};
  for (const [id, label] of [['wb-bright-range', 'brightness'], ['wb-contrast-range', 'contrast'], ['wb-saturate-range', 'saturation']]) {
    trace[label] = {};
    for (const v of [-100, -50, 50, 100]) {
      const el = document.getElementById(id);
      el.value = String(v);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      await wait();
      trace[label][v] = codes();
    }
    const el = document.getElementById(id);
    el.value = '0';
    el.dispatchEvent(new Event('input', { bubbles: true }));
    await wait();
  }
  return { base, trace };
});

/* ---------- 3. 侧栏滑块与顶部滑块双向同步 ---------- */
const sideSync = await page.evaluate(async () => {
  const wait = (t = 100) => new Promise((res) => setTimeout(res, t));
  const el = document.getElementById('wb-bright-side');
  el.value = '-40';
  el.dispatchEvent(new Event('input', { bubbles: true }));
  await wait();
  return {
    topValue: document.getElementById('wb-bright-range').value,
    topLabel: document.getElementById('wb-bright-val').textContent,
    sideLabel: document.getElementById('wb-bright-side-val').textContent,
  };
});

/* ---------- 4. 撤销 / 重做 ---------- */
const undoRedo = await page.evaluate(async () => {
  const wait = (t = 120) => new Promise((res) => setTimeout(res, t));
  const codes = () => [...document.querySelectorAll('#stats-container tbody tr')]
    .map((tr) => tr.querySelector('strong').textContent.trim()).sort().join('/') || '(空)';
  const c = document.getElementById('wb-canvas');
  const rect = c.getBoundingClientRect();
  const ev = (t, x, y, target) => target.dispatchEvent(new PointerEvent(t, {
    bubbles: true, clientX: rect.left + x, clientY: rect.top + y, pointerId: 1, isPrimary: true,
  }));

  document.getElementById('btn-clear').click();
  await wait();
  const empty = codes();
  // 画两格不同颜色 → 清空 → 撤销（应恢复两格）→ 重做（应回到空）
  const swA07 = [...document.querySelectorAll('#swatches-container .swatch')].find((s) => s.title.startsWith('A07'));
  swA07.click();
  ev('pointerdown', 40, 40, c); ev('pointerup', 40, 40, window);
  ev('pointerdown', 90, 40, c); ev('pointerup', 90, 40, window);
  await wait();
  const painted = codes();

  document.getElementById('btn-clear').click();
  await wait();
  const cleared = codes();

  document.getElementById('btn-undo').click();
  await wait();
  const afterUndo = codes();
  const redoEnabled = !document.getElementById('btn-redo').disabled;

  document.getElementById('btn-redo').click();
  await wait();
  const afterRedo = codes();

  return { empty, painted, cleared, afterUndo, redoEnabled, afterRedo };
});

/* ---------- 5. 色板搜索 ---------- */
const search = await page.evaluate(() => {
  const el = document.getElementById('palette-search');
  el.value = 'A07';
  el.dispatchEvent(new Event('input', { bubbles: true }));
  const matched = document.querySelectorAll('#swatches-container .swatch').length;
  const meta = document.getElementById('palette-meta').textContent;
  el.value = '';
  el.dispatchEvent(new Event('input', { bubbles: true }));
  return { matched, meta, restored: document.querySelectorAll('#swatches-container .swatch').length };
});

/* ---------- 6. 换色板后色号整体重映射 ---------- */
const paletteSwitch = await page.evaluate(async () => {
  const wait = (t = 150) => new Promise((res) => setTimeout(res, t));
  const codes = () => [...document.querySelectorAll('#stats-container tbody tr')]
    .map((tr) => tr.querySelector('strong').textContent.trim()).sort().join('/') || '(空)';
  const c = document.getElementById('wb-canvas');
  const rect = c.getBoundingClientRect();
  const ev = (t, x, y, target) => target.dispatchEvent(new PointerEvent(t, {
    bubbles: true, clientX: rect.left + x, clientY: rect.top + y, pointerId: 1, isPrimary: true,
  }));

  // 先确保画布上有内容（上一段 undo/redo 实验结束时可能是空的）
  document.getElementById('btn-clear').click();
  await wait();
  const swA07 = [...document.querySelectorAll('#swatches-container .swatch')].find((s) => s.title.startsWith('A07'));
  swA07.click();
  ev('pointerdown', 40, 40, c); ev('pointerup', 40, 40, window);
  await wait();
  const artkal = codes();

  const sel = document.getElementById('palette-select');
  sel.value = 'perler';
  sel.dispatchEvent(new Event('change', { bubbles: true }));
  await wait();
  return { artkal, perler: codes() };
});

/* ---------- 7. 显示开关（网格 / 标尺 / 色号） ---------- */
const viewToggles = await page.evaluate(async () => {
  const wait = (t = 100) => new Promise((res) => setTimeout(res, t));
  const sizeOf = (id) => {
    const c = document.getElementById(id);
    return c.width + 'x' + c.height;
  };
  const before = { schematic: sizeOf('wb-schematic') };
  document.getElementById('btn-toggle-ruler').click();
  await wait();
  const noRuler = { schematic: sizeOf('wb-schematic') };
  document.getElementById('btn-toggle-ruler').click();
  await wait();
  const back = { schematic: sizeOf('wb-schematic') };
  return { before, noRuler, back };
});

await page.screenshot({ path: process.env.WB_SHOT || 'wb_verify.png' }).catch(() => {});
await browser.close();

const changed = (a, b) => JSON.stringify(a) !== JSON.stringify(b);
const distinct = (obj) => new Set(Object.values(obj)).size;

const report = {
  jsErrors: errors,
  missingControls: controls.missing,
  swatchCount: controls.swatches,
  paletteMeta: controls.paletteMeta,
  filterTrace: filterTrace.trace,
  filterBase: filterTrace.base,
  sideSync,
  undoRedo,
  search,
  paletteSwitch,
  viewToggles,
  verdict: {
    // 主判据：三个滤镜参数都能让色号真的变（这就是用户报的 bug）
    brightnessChangesCodes: distinct(filterTrace.trace.brightness) >= 3,
    contrastChangesCodes: distinct(filterTrace.trace.contrast) >= 3,
    saturationChangesCodes: distinct(filterTrace.trace.saturation) >= 2,
    sideSliderSyncsBothWays: sideSync.topValue === '-40' && sideSync.topLabel === '-40' && sideSync.sideLabel === '-40',
    undoRestoresPrevious: undoRedo.redoEnabled && changed(undoRedo.cleared, undoRedo.afterUndo),
    redoReapplies: changed(undoRedo.afterUndo, undoRedo.afterRedo),
    paletteSearchFilters: search.matched > 0 && search.matched < search.restored,
    paletteSwitchRemaps: changed(paletteSwitch.artkal, paletteSwitch.perler),
    rulerToggleResizesCanvas: changed(viewToggles.before.schematic, viewToggles.noRuler.schematic)
      && changed(viewToggles.noRuler.schematic, viewToggles.back.schematic),
    allControlsPresent: controls.missing.length === 0,
    noJsErrors: errors.filter((e) => !/favicon|404/.test(e)).length === 0,
  },
};
console.log(JSON.stringify(report, null, 2));
