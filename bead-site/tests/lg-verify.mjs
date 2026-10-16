/**
 * lg-verify.mjs — Liquid Glass 验收测试（真实浏览器 + 逐像素比对）
 *
 * 对应三条验收标准：
 *   1. 玻璃下面放网格图，四条边附近的网格线必须可见地弯曲/压缩，中心完全清晰。
 *   2. 移动玻璃时，折射内容跟着变，而不是贴着一张固定纹理。
 *   3. 鼠标划过时，玻璃上有一块高光跟着走。
 *
 * 外加：
 *   4. 硬性约束 —— 折射的 url() 必须被 @supports 圈住，且存在纯 blur/saturate 兜底。
 *   5. 硬性约束 —— 滤镜只挂 backdrop-filter，绝不挂 filter（否则文字被一起扭曲）。
 *   6. 硬性约束 —— 中心位移严格为零（贴图中心必须是 128/128）。
 *   7. 无障碍 —— prefers-reduced-transparency 下退化为不透明。
 *   8. 真实页面 —— 各页面玻璃挂载数量、无 JS 报错。
 *
 * 运行：node tests/lg-verify.mjs
 */
import { openBrowser, serve, decodePNG, regionDiff, bestShift } from './_browser.mjs';
import { readFileSync, writeFileSync } from 'node:fs';

const ROOT = 'D:/网站项目/Micheal--main/bead-site';
const SHOT = 'D:/网站项目/Micheal--main/.workbuddy/shots/';

let pass = 0, fail = 0;
const results = [];
function check(name, ok, detail = '') {
  results.push({ name, ok, detail });
  ok ? pass++ : fail++;
  console.log(`${ok ? '  PASS' : '  FAIL'}  ${name}${detail ? '   — ' + detail : ''}`);
}

const srv = await serve(ROOT);
const { newPage, close } = await openBrowser();
const page = await newPage({ width: 1100, height: 700 });

console.log('\n=== 夹具页：几何与像素 ===');
await page.goto(`${srv.base}/tests/lg-fixture.html`);
await page.waitForFunction('window.__ready === true', { timeout: 20000 });
await page.wait(500);

const fixtureLog = await page.evaluate('document.getElementById("probe").textContent');
console.log('  ' + fixtureLog.replace(/\n/g, '\n  '));

/* ---------------- 标准 1：边缘弯曲 / 中心清晰 ---------------- */
console.log('\n[1] 四条边附近的网格线弯曲 / 中心完全清晰');

const CLIP = { x: 0, y: 0, width: 1100, height: 700 };
const REGIONS = {
  中心: { x: 250, y: 250, w: 120, h: 80 },
  左边缘: { x: 124, y: 250, w: 34, h: 80 },
  右边缘: { x: 502, y: 250, w: 34, h: 80 },
  上边缘: { x: 250, y: 124, w: 120, h: 26 },
  下边缘: { x: 250, y: 388, w: 120, h: 26 },
  左上角: { x: 124, y: 124, w: 44, h: 44 },
};

await page.evaluate('window.__lg.setRefract(false)');
await page.wait(400);
const offShot = await page.screenshot({ clip: CLIP });
writeFileSync(SHOT + 'lgv-refract-off.png', offShot);
const offImg = decodePNG(offShot);

await page.evaluate('window.__lg.setRefract(true)');
await page.wait(400);
const onShot = await page.screenshot({ clip: CLIP });
writeFileSync(SHOT + 'lgv-refract-on.png', onShot);
const onImg = decodePNG(onShot);

const diffs = {};
for (const [k, r] of Object.entries(REGIONS)) diffs[k] = regionDiff(offImg, onImg, r);

const centerMad = diffs['中心'].mad;
const EDGE_KEYS = ['左边缘', '右边缘', '上边缘', '下边缘', '左上角'];
const edgeMads = EDGE_KEYS.map(k => diffs[k].mad);
const edgeMaxes = EDGE_KEYS.map(k => diffs[k].max);
const minEdge = Math.min(...edgeMads);
const minEdgeMax = Math.min(...edgeMaxes);

check(
  '中心区域开关折射后像素几乎一致（严格零位移）',
  centerMad < 0.5,
  `中心 MAD=${centerMad.toFixed(3)} MAX=${diffs['中心'].max}`
);

/* 直接量「背景被挪了几像素」：在玻璃四条边的带内，
   找让「开启折射」的像素最贴近「关闭折射」的整像素位移。
   这比单纯比差异更硬 —— 差异大也可能是模糊或调色造成的，位移才是折射。 */
const SHIFT_BANDS = {
  左边缘带: { r: { x: 124, y: 190, w: 44, h: 160 }, axis: 'x' },
  右边缘带: { r: { x: 492, y: 190, w: 44, h: 160 }, axis: 'x' },
  上边缘带: { r: { x: 190, y: 124, w: 220, h: 44 }, axis: 'y' },
  下边缘带: { r: { x: 190, y: 372, w: 220, h: 44 }, axis: 'y' },
  中心带: { r: { x: 240, y: 240, w: 140, h: 60 }, axis: 'x' },
};
const shifts = {};
for (const [k, cfg] of Object.entries(SHIFT_BANDS)) {
  shifts[k] = bestShift(offImg, onImg, cfg.r, cfg.axis);
}
console.log(
  '  背景位移量：' +
    Object.entries(shifts).map(([k, v]) => `${k} ${v.d}px(gain ${(v.gain * 100).toFixed(0)}%)`).join('  ')
);

check(
  '中心带位移为 0 像素（中心完全清晰）',
  shifts['中心带'].d === 0,
  `实测 ${shifts['中心带'].d}px`
);
check(
  '四条边带都发生了 ≥ 3 像素的位移（网格线可见地弯曲/压缩）',
  ['左边缘带', '右边缘带', '上边缘带', '下边缘带'].every(k => Math.abs(shifts[k].d) >= 3),
  ['左边缘带', '右边缘带', '上边缘带', '下边缘带'].map(k => `${k} ${shifts[k].d}px`).join('  ')
);
check(
  '边缘带与中心带的位移差 ≥ 3 像素（中心与边缘形成对比）',
  Math.min(...['左边缘带', '右边缘带', '上边缘带', '下边缘带'].map(k => Math.abs(shifts[k].d))) >= 3,
  `中心 ${shifts['中心带'].d}px`
);
check(
  '四条边 + 角都有像素级变化',
  minEdgeMax > 5,
  EDGE_KEYS.map(k => `${k} MAD=${diffs[k].mad.toFixed(2)}/MAX=${diffs[k].max.toFixed(0)}`).join('  ')
);

/* ---------------- 标准 2：移动玻璃，折射内容跟着变 ---------------- */
console.log('\n[2] 玻璃下面内容变化时，折射内容跟着变（不是固定纹理）');

const beforeScroll = await page.screenshot({ clip: CLIP });
// 滚动背景：卡片 fixed 不动，网格从玻璃下面经过
await page.evaluate('window.scrollTo(0, 43)');
await page.wait(400);
const afterScroll = await page.screenshot({ clip: CLIP });
writeFileSync(SHOT + 'lgv-scrolled.png', afterScroll);

const bImg = decodePNG(beforeScroll);
const aImg = decodePNG(afterScroll);
const cardRegion = { x: 130, y: 130, w: 400, h: 280 };
const scrollDiff = regionDiff(bImg, aImg, cardRegion);
check(
  '滚动背景后，玻璃覆盖区的像素明显改变（折射是实时的）',
  scrollDiff.mad > 8,
  `MAD=${scrollDiff.mad.toFixed(2)} MAX=${scrollDiff.max}`
);

// 再滚回去，内容应当复原 —— 证明是「跟随背景」而非随机噪声
await page.evaluate('window.scrollTo(0, 0)');
await page.wait(400);
const restored = await page.screenshot({ clip: CLIP });
const restoreDiff = regionDiff(bImg, decodePNG(restored), cardRegion);
check(
  '滚回原位后折射内容复原（可复现，非噪声）',
  restoreDiff.mad < 1.5,
  `MAD=${restoreDiff.mad.toFixed(3)}`
);

/* ---------------- 标准 3：鼠标划过，高光跟着走 ---------------- */
console.log('\n[3] 鼠标划过时玻璃上有一块高光跟着走');

await page.mouseMove(180, 180);
await page.wait(450);
const sheenA = await page.evaluate('window.__lg.sheen()');
const shotA = await page.screenshot({ clip: { x: 120, y: 120, width: 420, height: 300 } });

await page.mouseMove(470, 370);
await page.wait(450);
const sheenB = await page.evaluate('window.__lg.sheen()');
const shotB = await page.screenshot({ clip: { x: 120, y: 120, width: 420, height: 300 } });
writeFileSync(SHOT + 'lgv-sheen-a.png', shotA);
writeFileSync(SHOT + 'lgv-sheen-b.png', shotB);

console.log(`  指针(180,180) → --lg-mx=${sheenA.mx} --lg-my=${sheenA.my}`);
console.log(`  指针(470,370) → --lg-mx=${sheenB.mx} --lg-my=${sheenB.my}`);

check(
  '镜面位置变量随指针改变',
  sheenA.mx !== sheenB.mx && sheenA.my !== sheenB.my,
  `${sheenA.mx}/${sheenA.my} → ${sheenB.mx}/${sheenB.my}`
);
check(
  '镜面位置落在元素内的合理百分比区间',
  parseFloat(sheenB.mx) > 60 && parseFloat(sheenB.my) > 60,
  `mx=${sheenB.mx} my=${sheenB.my}`
);
check(
  '::before 上确实有 radial-gradient 镜面层',
  /radial-gradient/.test(sheenA.beforeBg),
  sheenA.beforeBg
);

const sheenDiff = regionDiff(decodePNG(shotA), decodePNG(shotB), { x: 0, y: 0, w: 420, h: 300 });
check(
  '高光移动导致玻璃表面像素可见变化',
  sheenDiff.mad > 1.5,
  `MAD=${sheenDiff.mad.toFixed(2)} MAX=${sheenDiff.max}`
);

/* ---------------- 硬性约束 ---------------- */
console.log('\n[4] 硬性约束');

const css = readFileSync(ROOT + '/assets/css/liquid-glass.css', 'utf8');
check(
  'url() 进 backdrop-filter 被 @supports 包住',
  /@supports\s*\(backdrop-filter:\s*url\(/.test(css),
  ''
);
check(
  '存在纯 blur/saturate 兜底规则（不含 url()）',
  /backdrop-filter:\s*blur\(var\(--lg-blur\)\)\s*saturate\(var\(--lg-saturate\)\)/.test(css),
  ''
);
check(
  'CSS 中没有任何把 url() 滤镜挂到 filter 属性上的写法',
  !/(^|[^-\w])filter:\s*var\(--lg-filter\)/.test(css),
  ''
);

// 运行时：元素自身文字不应被扭曲 —— 检查计算样式里 filter 为 none
const filterOfCard = await page.evaluate(
  'getComputedStyle(document.getElementById("card")).filter'
);
check('玻璃元素的 filter 属性为 none（文字不会被扭曲）', filterOfCard === 'none', `filter=${filterOfCard}`);

const backdropOfCard = await page.evaluate(
  'getComputedStyle(document.getElementById("card")).backdropFilter || getComputedStyle(document.getElementById("card")).webkitBackdropFilter'
);
check(
  '玻璃元素的 backdrop-filter 里带 url(#...) 折射滤镜',
  /url\(/.test(backdropOfCard),
  backdropOfCard
);

// 贴图中心必须是严格 128/128
const mapProbe = await page.evaluate(`(async () => {
  const mod = await import('../assets/js/liquid-glass.js');
  const cv = mod._internal.buildDisplacementMap(420, 300, 26, 46);
  const ctx = cv.getContext('2d');
  const mid = ctx.getImageData(210, 150, 1, 1).data;
  const corner = ctx.getImageData(2, 2, 1, 1).data;
  // 统计「非 128」的像素占比，应当只出现在边缘带
  const all = ctx.getImageData(0, 0, 420, 300).data;
  let moved = 0;
  for (let i = 0; i < all.length; i += 4) if (all[i] !== 128 || all[i + 1] !== 128) moved++;
  return { mid: [mid[0], mid[1]], corner: [corner[0], corner[1]], movedRatio: moved / (420 * 300) };
})()`);
check('位移贴图中心严格为 128/128', mapProbe.mid[0] === 128 && mapProbe.mid[1] === 128, JSON.stringify(mapProbe.mid));
check('位移贴图角上确实有位移', mapProbe.corner[0] !== 128 || mapProbe.corner[1] !== 128, JSON.stringify(mapProbe.corner));
check(
  '位移只发生在边缘带（中心大片保持 128）',
  mapProbe.movedRatio > 0.1 && mapProbe.movedRatio < 0.6,
  `非 128 像素占比 ${(mapProbe.movedRatio * 100).toFixed(1)}%`
);

/* ---------------- 无障碍 ---------------- */
console.log('\n[5] 无障碍');

const a11y = await page.evaluate(`(async () => {
  const out = {};
  out.reducedTransparencyRule = /prefers-reduced-transparency/.test(
    [...document.styleSheets].flatMap(s => { try { return [...s.cssRules].map(r => r.cssText); } catch (e) { return []; } }).join('')
  );
  out.reducedMotionRule = /prefers-reduced-motion/.test(
    [...document.styleSheets].flatMap(s => { try { return [...s.cssRules].map(r => r.cssText); } catch (e) { return []; } }).join('')
  );
  return out;
})()`);
check('CSS 里有 prefers-reduced-transparency 处理', a11y.reducedTransparencyRule, '');
check('CSS 里有 prefers-reduced-motion 处理', a11y.reducedMotionRule, '');

/* ---------------- 真实页面 ---------------- */
console.log('\n[6] 真实页面挂载与报错');
const PAGES = ['index.html', 'create.html', 'whiteboard.html', 'inspiration.html', 'tutorial.html', 'tutorial-guide.html', 'inspiration/anime.html'];
for (const file of PAGES) {
  const p2 = await newPage({ width: 1440, height: 900 });
  await p2.goto(`${srv.base}/${file}`);
  await p2.wait(1500);
  await p2.evaluate('window.__liquidGlass && window.__liquidGlass.scan()');
  await p2.wait(400);
  const st = await p2.evaluate('window.__liquidGlass ? JSON.stringify(window.__liquidGlass.stats()) : null');
  const errs = p2.pageErrors.slice(0, 2);
  const hasCss = await p2.evaluate(
    `[...document.styleSheets].some(s => (s.href||'').includes('liquid-glass.css'))`
  );
  check(`${file}：材质样式已加载 + 玻璃已挂载`, !!st && hasCss, st || 'no-glass');
  check(`${file}：无 JS 报错`, errs.length === 0, errs.join(' | '));
  await p2.ws.close();
}

console.log(`\n================  ${pass} passed, ${fail} failed  ================\n`);
writeFileSync(SHOT + 'lgv-report.json', JSON.stringify(results, null, 2));

await close();
await srv.close();
process.exit(fail ? 1 : 0);
