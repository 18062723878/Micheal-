/**
 * lg-zoom.mjs — 把某个元素放大截出来，用于细看材质细节。
 * 用法：node tests/lg-zoom.mjs <page> <selector> [scale] [theme] [name]
 */
import { openBrowser, serve } from './_browser.mjs';
import { writeFileSync } from 'node:fs';

const ROOT = 'D:/网站项目/Micheal--main/bead-site';
const SHOT = 'D:/网站项目/Micheal--main/.workbuddy/shots/';
const page = process.argv[2] || 'create.html';
const sel = process.argv[3] || '.panel';
const scale = Number(process.argv[4] || 2);
const theme = process.argv[5] || 'dark';
const name = process.argv[6] || `zoom-${theme}`;

const srv = await serve(ROOT);
const { newPage, close } = await openBrowser();
const p = await newPage({ width: 1440, height: 950 });
await p.goto(srv.base + '/index.html');
await p.evaluate(`localStorage.setItem('site-theme', ${JSON.stringify(theme)})`);
await p.evaluate(`['create.rail.collapsed','whiteboard.side.collapsed'].forEach(k=>localStorage.removeItem(k))`);
await p.goto(`${srv.base}/${page}`);
await p.wait(2000);
await p.evaluate('window.__liquidGlass && window.__liquidGlass.scan()');
await p.wait(500);

// 先把目标元素滚进视口，否则截到的是空白
await p.evaluate(`(() => {
  const el = document.querySelector(${JSON.stringify(sel)});
  if (el) el.scrollIntoView({ block: 'center', inline: 'nearest' });
})()`);
await p.wait(600);
await p.evaluate('window.__liquidGlass && window.__liquidGlass.scan()');
await p.wait(400);

const r = await p.evaluate(`(() => {
  const el = document.querySelector(${JSON.stringify(sel)});
  if (!el) return null;
  const b = el.getBoundingClientRect();
  // captureScreenshot 的 clip 用的是**页面坐标**（相对文档原点），
  // getBoundingClientRect 给的是**视口坐标**，滚动后必须补上 scrollX/scrollY。
  return { x: Math.max(0, b.left + scrollX), y: Math.max(0, b.top + scrollY), width: b.width, height: b.height };
})()`);
if (!r) { console.log('找不到元素:', sel); await close(); await srv.close(); process.exit(1); }

// 只截元素加上一圈外扩，方便看边界
const pad = 24;
const clip = {
  x: Math.max(0, r.x - pad),
  y: Math.max(0, r.y - pad),
  width: Math.min(r.width + pad * 2, 1440),
  height: Math.min(r.height + pad * 2, 950),
  scale,
};
console.log('clip =', JSON.stringify(clip));
writeFileSync(SHOT + name + '.png', await p.screenshot({ clip }));
console.log('saved ->', SHOT + name + '.png');

await close();
await srv.close();
