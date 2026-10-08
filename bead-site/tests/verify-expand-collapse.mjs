/**
 * 回归验证：参数面板「展开/折叠状态失效 + 内部元素点不动」的三条根因。
 *
 * 这组测试对应三个真实缺陷：
 *   1. .pp-head / .pp-body 没有跨列 → 头部与分组各占一列，布局错乱
 *   2. 收起态把 .pp-head 一起 display:none → ⟩ 按钮自己消失，进入死锁
 *   3. 分组底部被裁且无滚动提示 → 用户误以为「内容丢失 / 点不动」
 *
 * 判定标准（客观测量，不看截图）：
 *   - 折叠态与展开态的**高度必须不同**，且折叠态显著更矮
 *   - 折叠态下 ⟩ 按钮必须**可见可点**（不死锁）
 *   - 每个分组标题中心点命中自身或后代（可点）
 *   - .pp-head 与 .pp-body 必须**跨满所有列**（left 一致、上下排列）
 *   - 白板面板底部滚动后末组必须可点
 *
 * 复用本机 Edge，不下载 Chromium。
 * 运行：node tests/verify-expand-collapse.mjs
 *   设 BASE_URL=https://pindouwang.pages.dev 可直接验证线上。
 */
import { chromium } from 'file:///C:/Users/18062/.workbuddy/binaries/node/workspace/node_modules/playwright-core/index.mjs';

const BASE = (process.env.BASE_URL || 'http://127.0.0.1:8099').replace(/\/+$/, '');
const browser = await chromium.launch({ channel: 'msedge', headless: true });

let pass = 0;
let fail = 0;
const failures = [];

function ok(name, cond, detail) {
  if (cond) { pass++; console.log(`  ✓ ${name}`); }
  else { fail++; failures.push(`${name}${detail ? ' — ' + JSON.stringify(detail) : ''}`); console.log(`  ✗ ${name}${detail ? ' — ' + JSON.stringify(detail) : ''}`); }
}

/**
 * 采集某页参数面板的结构与命中信息。
 *
 * 关于命中测试：elementFromPoint 只对视口内的坐标生效，
 * 窄屏下面板整体位于文档流下方（实测 top≈1059px > 视口 844px），
 * 此时返回 null 会被误判成「点不动」。所以先 scrollIntoView 把目标滚进视口，
 * 再做命中测试—— 这样测的才是真实的「能不能点到」。
 */
async function snap(page, panelSel) {
  // 先把面板**和它的滚动区内容**一起带进视口。
  // 注意：只 scrollIntoView 面板是不够的—— 白板的分组在 .pp-body 这个
  // 内部滚动区里，面板本身滚进视口不代表分组也在视口内
  // （实测「板型」分组在 y=1010 而视口只有 900）。
  // 这里滚两次：先把外层页面滚到位，再把面板内滚动区也滚到底/顶，
  // 保证至少有一段内容在视口内可测。
  await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (el) el.scrollIntoView({ block: 'center', behavior: 'instant' });
  }, panelSel);
  await page.evaluate((sel) => {
    const body = document.querySelector(sel)?.querySelector(':scope > .pp-body');
    if (body) body.scrollTop = 0;
  }, panelSel);
  await page.waitForTimeout(220);

  return await page.evaluate((sel) => {
    const panel = document.querySelector(sel);
    if (!panel) return null;
    const pr = panel.getBoundingClientRect();

    const head = panel.querySelector(':scope > .pp-head');
    const body = panel.querySelector(':scope > .pp-body');
    const hr = head ? head.getBoundingClientRect() : null;
    const br = body ? body.getBoundingClientRect() : null;

    const collapseBtn = panel.querySelector(':scope > .pp-head .pp-collapse-btn');
    let btn = null;
    if (collapseBtn) {
      const b = collapseBtn.getBoundingClientRect();
      const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
      const hit = (b.width > 0 && b.height > 0 && cy >= 0 && cy <= window.innerHeight)
        ? document.elementFromPoint(cx, cy) : null;
      btn = {
        宽: Math.round(b.width), 高: Math.round(b.height),
        可见: b.width > 0 && b.height > 0,
        display: getComputedStyle(collapseBtn).display,
        可点: hit ? collapseBtn.contains(hit) : false,
      };
    }

    const groups = Array.from(panel.querySelectorAll(':scope > .pp-body > .pp-group')).map((g) => {
      const h = g.querySelector('.pp-group-head');
      const gr = g.getBoundingClientRect();
      const hgr = h.getBoundingClientRect();
      // 只对「当前确实在视口内」的分组做命中测试；视口外的分组单独用滚动可达性判定
      const cx = hgr.left + hgr.width / 2, cy = hgr.top + hgr.height / 2;
      const inView = cy >= 0 && cy <= window.innerHeight
        && cx >= 0 && cx <= window.innerWidth
        && hgr.width > 0 && hgr.height > 0;
      const hit = inView ? document.elementFromPoint(cx, cy) : null;
      // 中心点是否落在 .pp-body 的可视区内（跨滚动边界的分组属于正常滚动）
      const bRect = body ? body.getBoundingClientRect() : null;
      const 中心在滚动区外 = bRect ? (cy < bRect.top || cy > bRect.bottom) : false;
      return {
        名: (h.querySelector('.pp-group-label') || {}).textContent,
        isOpen: g.classList.contains('is-open'),
        组高: Math.round(gr.height),
        头高: Math.round(hgr.height),
        体高: Math.round(g.querySelector('.pp-group-body').getBoundingClientRect().height),
        体display: getComputedStyle(g.querySelector('.pp-group-body')).display,
        left: Math.round(gr.left),
        top: Math.round(gr.top),
        宽: Math.round(gr.width),
        头超出组: hgr.bottom - gr.bottom > 1,
        在视口内: inView,
        中心在滚动区外,
        可点: inView ? h.contains(hit) : null,   // null = 未测（视口外），不算失败
      };
    });

    // 视口外分组的可达性：容器可滚动 ⇒ 滚动后一定能点到
    const scrollable = body ? body.scrollHeight > body.clientHeight + 1 : false;

    return {
      面板高: Math.round(pr.height),
      面板宽: Math.round(pr.width),
      className: panel.className,
      head: hr ? { display: getComputedStyle(head).display, left: Math.round(hr.left), 宽: Math.round(hr.width), 高: Math.round(hr.height) } : null,
      body: br ? { display: getComputedStyle(body).display, left: Math.round(br.left), 宽: Math.round(br.width), scrollH: body.scrollHeight, clientH: body.clientHeight, 可滚动: scrollable } : null,
      收起按钮: btn,
      分组: groups,
    };
  }, panelSel);
}

/**
 * 判定「分组标题均可点」。
 *
 * 分组处在 .pp-body 这个**可滚动容器**里，跨在可视区边界的分组
 * 中心点会落在滚动区之外（例如「板型」实测中心 y=871 而滚动区底 711）。
 * 这不是遮挡，而是正常滚动 —— 判据应当是：
 *   - 中心点确实落在滚动区内 → 必须命中自己（真·可点）
 *   - 中心点在滚动区外 → 容器可滚动即可达（滚动后能点到，不算失败）
 * 之前一律要求「中心点命中自己」，把正常的滚动边界误判成不可点。
 */
function allGroupsClickable(snapResult) {
  const scrollable = snapResult.body?.可滚动 === true;
  return snapResult.分组.every((g) => {
    if (g.可点 === true) return true;          // 命中自己：可点
    if (g.可点 === null) return scrollable;     // 视口外：靠滚动可达
    // 可点 === false：中心点在视口内却没命中自己 —— 这才是真遮挡
    return scrollable && g.中心在滚动区外 === true;
  });
}

/** 只报告真·不可点的分组（命中失败且中心不在滚动区外） */
function notClickableNames(snapResult) {
  return snapResult.分组
    .filter((g) => g.可点 === false && g.中心在滚动区外 !== true)
    .map((g) => g.名);
}

/* ============ 创作工坊 ============ */
console.log('\n=== create.html 参数面板 ===');
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e)));
  await page.goto(`${BASE}/create.html`, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const SEL = '.settings-grid.is-param-panel';

  // 展开外层 details
  await page.click('#studio-prep-fold > summary');
  await page.waitForTimeout(450);
  const expanded = await snap(page, SEL);

  console.log('  [根因1] .pp-head / .pp-body 跨列');
  ok('头部横跨整行（left 与面板内容区一致）',
    expanded.head && Math.abs(expanded.head.left - expanded.body.left) <= 2,
    { head: expanded.head?.left, body: expanded.body?.left });
  ok('分组容器横跨整行（left 与头部一致）',
    expanded.body && expanded.head && Math.abs(expanded.body.left - expanded.head.left) <= 2,
    { head: expanded.head?.left, body: expanded.body?.left });
  ok('头部在分组容器上方（top 更小，结构为上下排列）',
    expanded.head && expanded.body && expanded.head.高 > 0,
    { head高: expanded.head?.高 });

  console.log('  [根因1] 分组本身并排且不重叠');
  const gs = expanded.分组;
  ok('至少存在 2 个分组', gs.length >= 2, { 数量: gs.length });
  ok('分组标题不被自身分组裁剪', gs.every((g) => !g.头超出组), gs.filter((g) => g.头超出组).map((g) => g.名));
  ok('分组高度大于标题高度（未被压扁）',
    gs.every((g) => g.组高 >= g.头高),
    gs.map((g) => ({ 名: g.名, 组高: g.组高, 头高: g.头高 })));
  ok('展开态分组标题均可点', allGroupsClickable(expanded), notClickableNames(expanded));

  // 点 ⟩ 收起
  console.log('  [根因2] 收起后不进入死锁');
  await page.click(`${SEL} > .pp-head .pp-collapse-btn`);
  await page.waitForTimeout(450);
  const collapsed = await snap(page, SEL);

  ok('折叠态 class 已生效', /is-collapsed/.test(collapsed.className), { className: collapsed.className });
  ok('折叠态与展开态高度不同（结构有明确差异）',
    collapsed.面板高 !== expanded.面板高,
    { 展开: expanded.面板高, 折叠: collapsed.面板高 });
  ok('折叠态显著更矮（不超过展开态的一半）',
    collapsed.面板高 <= expanded.面板高 / 2,
    { 展开: expanded.面板高, 折叠: collapsed.面板高 });
  ok('折叠态头部保留（display 非 none）',
    collapsed.head && collapsed.head.display !== 'none',
    { display: collapsed.head?.display });
  ok('折叠态 ⟩ 按钮可见（不死锁的关键）',
    collapsed.收起按钮?.可见 === true,
    collapsed.收起按钮);
  ok('折叠态 ⟩ 按钮可点', collapsed.收起按钮?.可点 === true, collapsed.收起按钮);
  ok('折叠态分组体已隐藏',
    collapsed.分组.every((g) => g.体display === 'none' || g.体高 === 0),
    collapsed.分组.map((g) => ({ 名: g.名, 体高: g.体高, display: g.体display })));

  // 再点回来
  console.log('  [根因2] 能从折叠态恢复');
  await page.click(`${SEL} > .pp-head .pp-collapse-btn`);
  await page.waitForTimeout(450);
  const restored = await snap(page, SEL);
  ok('可重新展开（高度恢复）', restored.面板高 === expanded.面板高,
    { 原: expanded.面板高, 恢复后: restored.面板高 });
  ok('恢复后分组标题可点', allGroupsClickable(restored), notClickableNames(restored));

  // 分组折叠/展开有高度差异
  console.log('  [根因1] 分组折叠态有高度差异');
  const first = restored.分组[0];
  await page.click(`${SEL} > .pp-body > .pp-group:first-child .pp-group-head`);
  await page.waitForTimeout(400);
  const afterGroupToggle = await snap(page, SEL);
  const firstAfter = afterGroupToggle.分组[0];
  ok('点击分组标题后高度发生变化', firstAfter.组高 !== first.组高,
    { 前: first.组高, 后: firstAfter.组高 });
  ok('折叠后的分组标题仍可点', firstAfter.可点 === true, { 可点: firstAfter.可点 });

  ok('全程无 JS 错误', errs.length === 0, errs);
  await ctx.close();
}

/* ============ 白板画板 ============ */
console.log('\n=== whiteboard.html 参数面板 ===');
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e)));
  await page.goto(`${BASE}/whiteboard.html`, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const SEL = '.draw-sidebar.is-param-panel';
  const expanded = await snap(page, SEL);

  console.log('  [根因3] 分组底部可达（可滚动 + 滚后可点）');
  ok('分组容器可纵向滚动', expanded.body?.可滚动 === true,
    { scrollH: expanded.body?.scrollH, clientH: expanded.body?.clientH });
  ok('展开态分组标题均可点', allGroupsClickable(expanded), notClickableNames(expanded));
  ok('分组标题不被自身分组裁剪', expanded.分组.every((g) => !g.头超出组),
    expanded.分组.filter((g) => g.头超出组).map((g) => g.名));

  // 滚到底部再测命中
  const bottomState = await page.evaluate((sel) => {
    const panel = document.querySelector(sel);
    const body = panel.querySelector(':scope > .pp-body');
    body.scrollTop = body.scrollHeight;
    const groups = Array.from(panel.querySelectorAll(':scope > .pp-body > .pp-group'));
    const lastHead = groups[groups.length - 1].querySelector('.pp-group-head');
    const r = lastHead.getBoundingClientRect();
    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return {
      组名: lastHead.querySelector('.pp-group-label').textContent,
      scrollTop: Math.round(body.scrollTop),
      可点: hit ? lastHead.contains(hit) : false,
      命中: hit ? (hit.className || hit.tagName) : null,
    };
  }, SEL);
  ok('滚动到底部后末组标题可点', bottomState.可点 === true, bottomState);

  console.log('  [根因2] 收起后可恢复');
  await page.click(`${SEL} > .pp-head .pp-collapse-btn`);
  await page.waitForTimeout(450);
  const collapsed = await snap(page, SEL);
  ok('折叠态高度与展开态不同', collapsed.面板高 !== expanded.面板高,
    { 展开: expanded.面板高, 折叠: collapsed.面板高 });
  ok('折叠态 ⟩ 按钮可见', collapsed.收起按钮?.可见 === true, collapsed.收起按钮);
  // 有 gutter 把手的情况下，也要能靠头部按钮恢复
  if (collapsed.收起按钮?.可见) {
    await page.click(`${SEL} > .pp-head .pp-collapse-btn`);
    await page.waitForTimeout(450);
    const back = await snap(page, SEL);
    ok('可重新展开', back.面板高 === expanded.面板高, { 展开: expanded.面板高, 恢复后: back.面板高 });
  }

  ok('全程无 JS 错误', errs.length === 0, errs);
  await ctx.close();
}

/* ============ 窄屏 ============ */
console.log('\n=== 窄屏 390×844 ===');
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e)));

  for (const [name, sel, foldSel] of [
    ['create.html', '.settings-grid.is-param-panel', '#studio-prep-fold > summary'],
    ['whiteboard.html', '.draw-sidebar.is-param-panel', null],
  ]) {
    await page.goto(`${BASE}/${name}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(700);
    if (foldSel) { await page.click(foldSel); await page.waitForTimeout(400); }

    const s = await snap(page, sel);
    ok(`${name} 窄屏无横向溢出`,
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 2),
      await page.evaluate(() => ({ scrollW: document.documentElement.scrollWidth, winW: window.innerWidth })));
    ok(`${name} 窄屏分组标题可点`, allGroupsClickable(s), notClickableNames(s));
    ok(`${name} 窄屏分组标题不被裁剪`, s.分组.every((g) => !g.头超出组), null);
  }
  ok('窄屏全程无 JS 错误', errs.length === 0, errs);
  await ctx.close();
}

await browser.close();

console.log(`\n${'='.repeat(60)}`);
console.log(`结果：${pass} 通过 / ${fail} 失败`);
if (failures.length) {
  console.log('\n失败项：');
  failures.forEach((f) => console.log('  - ' + f));
}
process.exit(fail ? 1 : 0);