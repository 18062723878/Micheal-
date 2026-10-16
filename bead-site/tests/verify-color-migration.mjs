/**
 * 迁移后浏览器端验证：页面能否真的渲染出颜色。
 * 关键点：色号换成真实 Artkal 后，PALETTE 查表必须仍然命中，
 * 否则画布会渲染成空白/黑块（这正是迁移最可能踩的坑）。
 */
import { chromium } from 'file:///C:/Users/18062/.workbuddy/binaries/node/workspace/node_modules/playwright-core/index.mjs';

const BASE = (process.env.BASE_URL || 'http://127.0.0.1:8099').replace(/\/+$/, '');
const browser = await chromium.launch({ channel: 'msedge', headless: true });

let pass = 0, fail = 0;
const ok = (n, c, d) => { console.log((c ? '  ✓ ' : '  ✗ ') + n + (c ? '' : ' — ' + JSON.stringify(d))); c ? pass++ : fail++; };

async function checkPage(page, path, label, { expectBlankCanvas = false } = {}) {
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e)));
  const bad = [];
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon|ERR_/.test(m.text())) bad.push(m.text()); });
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  // 画布非空白检测：取所有 canvas，统计非透明像素占比
  const canvasStats = await page.evaluate(() => {
    const out = [];
    for (const cv of document.querySelectorAll('canvas')) {
      if (!cv.width || !cv.height) { out.push({ w: cv.width, h: cv.height, 有色: 0 }); continue; }
      try {
        const c2 = document.createElement('canvas');
        c2.width = cv.width; c2.height = cv.height;
        const cx = c2.getContext('2d');
        cx.drawImage(cv, 0, 0);
        const d = cx.getImageData(0, 0, cv.width, cv.height).data;
        let colored = 0;
        for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 0) colored++;
        out.push({ w: cv.width, h: cv.height, 有色: Math.round(colored / (d.length / 4) * 100) });
      } catch (e) { out.push({ w: cv.width, h: cv.height, err: String(e).slice(0, 40) }); }
    }
    return out;
  });

  if (expectBlankCanvas) {
    // 创作工坊在未上传图片时，画布本来就是空的（空状态引导），这里只要求画布存在
    ok(`${label}: 画布已就位`, canvasStats.length > 0, canvasStats.slice(0, 2));
  } else {
    const withColor = canvasStats.filter((c) => c.有色 > 5);
    ok(`${label}: 有画布且已渲染出内容`, withColor.length > 0, canvasStats.slice(0, 3));
  }
  ok(`${label}: 无 JS 错误`, errs.length === 0 && bad.length === 0, { errs, bad });
  console.log(`     canvas:`, JSON.stringify(canvasStats.slice(0, 3)));
}

console.log('\n=== 迁移后浏览器验证 ===');
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await checkPage(await ctx.newPage(), '/index.html', '首页');
  await checkPage(await ctx.newPage(), '/inspiration.html', '图库索引');
  await checkPage(await ctx.newPage(), '/inspiration/anime.html', '图库子页(JSON数据)');
  await ctx.close();
}
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await checkPage(await ctx.newPage(), '/whiteboard.html', '白板画板');
  await ctx.close();
}
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await checkPage(await ctx.newPage(), '/create.html', '创作工坊', { expectBlankCanvas: true });
  await ctx.close();
}

// 白板色板：确认 artkal 库已是 221 色且色号是真实的
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/whiteboard.html`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const info = await page.evaluate(() => {
    const sel = document.getElementById('palette-select');
    const sw = [...document.querySelectorAll('#swatches-container .swatch')];
    // 色号写在 title 里，形如 "MF11 深棕"
    const codes = sw.map((e) => (e.title || '').split(' ')[0]).filter(Boolean).slice(0, 8);
    return { options: sel ? [...sel.options].map((o) => o.text) : [], swatchCount: sw.length, sampleCodes: codes };
  });
  ok('白板色板下拉含 Artkal 221色', info.options.some((t) => /221/.test(t)), info.options);
  ok('色块数量 = 221（真实色库全量）', info.swatchCount === 221, { n: info.swatchCount });
  ok('色块用的是真实色号', info.sampleCodes.length > 0 && info.sampleCodes.every((c) => /^M[A-HM]\d{1,2}$/.test(c)), info.sampleCodes);
  console.log('     下拉:', info.options.join(' | '));
  console.log('     前几个色号:', info.sampleCodes.join(' '));
  await ctx.close();
}

await browser.close();
console.log(`\n结果：${pass} 通过 / ${fail} 失败`);
process.exit(fail ? 1 : 0);
