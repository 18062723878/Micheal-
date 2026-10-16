/**
 * lg-shot.mjs — 给指定页面截图，用于肉眼核对 Liquid Glass 的落地效果。
 * 用法：node tests/lg-shot.mjs <page> [width] [height] [theme] [name]
 *   page: index | create | whiteboard | inspiration | tutorial | tutorial-guide
 */
import { openBrowser, serve } from './_browser.mjs';
import { writeFileSync } from 'node:fs';

const ROOT = 'D:/网站项目/Micheal--main/bead-site';
const SHOT = 'D:/网站项目/Micheal--main/.workbuddy/shots/';

const page = process.argv[2] || 'index';
const W = Number(process.argv[3] || 1440);
const H = Number(process.argv[4] || 950);
const theme = process.argv[5] || 'dark';
const name = process.argv[6] || `lg-${page}-${theme}-${W}`;

const PAGES = {
  index: 'index.html',
  create: 'create.html',
  whiteboard: 'whiteboard.html',
  inspiration: 'inspiration.html',
  tutorial: 'tutorial.html',
  'tutorial-guide': 'tutorial-guide.html',
};

const srv = await serve(ROOT);
const { newPage, close } = await openBrowser();
const p = await newPage({ width: W, height: H });

// 主题：提前写 localStorage，页面 initTheme 会读它
await p.goto(srv.base + '/index.html');
await p.evaluate(`localStorage.setItem('site-theme', ${JSON.stringify(theme)})`);
// 清掉「收起侧栏」这类会被记住的 UI 状态，保证每次截图都是默认态
await p.evaluate(
  `['create.rail.collapsed','whiteboard.side.collapsed','whiteboard.params.collapsed','create.params.collapsed'].forEach(k => localStorage.removeItem(k))`
);

await p.goto(`${srv.base}/${PAGES[page] || page}`);
await p.wait(1600);
// 触发一次补扫，确保动态渲染的卡片也被挂上
await p.evaluate('window.__liquidGlass && window.__liquidGlass.scan()');
await p.wait(600);

const stats = await p.evaluate('window.__liquidGlass ? JSON.stringify(window.__liquidGlass.stats()) : "no-glass"');
const metrics = await p.metrics();
console.log('page =', page, '| viewport =', W, 'x', H, '| theme =', theme);
console.log('glass stats =', stats);
console.log('metrics =', JSON.stringify(metrics));
if (p.pageErrors.length) console.log('PAGE ERRORS:', p.pageErrors.slice(0, 5));
if (p.consoleErrors.length) console.log('CONSOLE ERRORS:', p.consoleErrors.slice(0, 5));

const buf = await p.screenshot({ clip: { x: 0, y: 0, width: W, height: H } });
writeFileSync(SHOT + name + '.png', buf);
console.log('saved ->', SHOT + name + '.png');

await close();
await srv.close();
