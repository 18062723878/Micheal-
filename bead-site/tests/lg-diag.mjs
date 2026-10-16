/**
 * lg-diag.mjs — 页面布局诊断：把关键元素的几何信息打出来，找「谁把页面撑高了」。
 * 用法：node tests/lg-diag.mjs <page> [width] [height] [theme]
 */
import { openBrowser, serve } from './_browser.mjs';

const ROOT = 'D:/网站项目/Micheal--main/bead-site';
const page = process.argv[2] || 'whiteboard';
const W = Number(process.argv[3] || 1600);
const H = Number(process.argv[4] || 1000);
const theme = process.argv[5] || 'dark';
const PAGES = {
  index: 'index.html', create: 'create.html', whiteboard: 'whiteboard.html',
  inspiration: 'inspiration.html', tutorial: 'tutorial.html', 'tutorial-guide': 'tutorial-guide.html',
};

const srv = await serve(ROOT);
const { newPage, close } = await openBrowser();
const p = await newPage({ width: W, height: H });
await p.goto(srv.base + '/index.html');
await p.evaluate(`localStorage.setItem('site-theme', ${JSON.stringify(theme)})`);
await p.goto(`${srv.base}/${PAGES[page] || page}`);
await p.wait(1800);
await p.evaluate('window.__liquidGlass && window.__liquidGlass.scan()');
await p.wait(400);

const out = await p.evaluate(`(() => {
  const lines = [];
  lines.push('scrollH=' + document.documentElement.scrollHeight + '  innerH=' + innerHeight + '  scrollW=' + document.documentElement.scrollWidth + '  innerW=' + innerWidth);
  const seen = [];
  const walk = (el, depth) => {
    if (depth > 4) return;
    const r = el.getBoundingClientRect();
    if (r.height > 60) {
      const cls = (el.className && typeof el.className === 'string') ? el.className.split(' ').slice(0, 3).join('.') : '';
      seen.push('  '.repeat(depth) + el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (cls ? '.' + cls : '') +
        '  top=' + Math.round(r.top + scrollY) + ' h=' + Math.round(r.height) + ' bottom=' + Math.round(r.bottom + scrollY));
    }
    for (const c of el.children) walk(c, depth + 1);
  };
  walk(document.body, 0);
  return lines.concat(seen).join('\\n');
})()`);
console.log(out);
if (p.pageErrors.length) console.log('PAGE ERRORS:', p.pageErrors.slice(0, 5));
await close();
await srv.close();
