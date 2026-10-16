/**
 * lg-scene.mjs — 交互场景截图：载入图纸 / 打开拼豆模式 / 打开弹窗 / 收起侧栏等。
 * 用法：node tests/lg-scene.mjs <scene> [width] [height] [theme]
 */
import { openBrowser, serve } from './_browser.mjs';
import { writeFileSync } from 'node:fs';

const ROOT = process.env.LG_ROOT || 'D:/网站项目/Micheal--main/bead-site';
const SHOT = 'D:/网站项目/Micheal--main/.workbuddy/shots/';
const scene = process.argv[2] || 'pattern';
const W = Number(process.argv[3] || 1600);
const H = Number(process.argv[4] || 1000);
const theme = process.argv[5] || 'dark';

const srv = await serve(ROOT);
const { newPage, close } = await openBrowser();
const p = await newPage({ width: W, height: H });
await p.goto(srv.base + '/index.html');
await p.evaluate(`localStorage.setItem('site-theme', ${JSON.stringify(theme)})`);
await p.evaluate(`localStorage.removeItem('create.rail.collapsed'); localStorage.removeItem('whiteboard.side.collapsed');`);

async function shot(name) {
  await p.evaluate('window.__liquidGlass && window.__liquidGlass.scan()');
  await p.wait(700);
  writeFileSync(SHOT + (process.env.LG_PREFIX||"") + name + '.png', await p.screenshot({ clip: { x: 0, y: 0, width: W, height: H } }));
  console.log('saved ->', name + '.png', '| scrollH =', (await p.metrics()).scrollH);
  if (p.pageErrors.length) console.log('  PAGE ERRORS:', p.pageErrors.slice(0, 3));
}

if (scene === 'pattern' || scene === 'beadmode' || scene === 'crop') {
  await p.goto(`${srv.base}/create.html?patternId=mount-fuji-sakura`);
  await p.wait(2600);
  if (scene === 'beadmode') {
    await p.evaluate('document.getElementById("btn-bead-mode").click()');
    await p.wait(900);
  }
  if (scene === 'crop') {
    await p.evaluate('document.getElementById("crop-modal").classList.add("open")');
    await p.wait(500);
  }
  await shot(`scene-${scene}-${theme}`);
} else if (scene === 'rail-collapsed') {
  await p.goto(`${srv.base}/create.html?patternId=mount-fuji-sakura`);
  await p.wait(2600);
  await p.evaluate('document.getElementById("btn-toggle-rail").click()');
  await p.wait(600);
  await shot(`scene-${scene}-${theme}`);
} else if (scene === 'wb-side-collapsed') {
  await p.goto(`${srv.base}/whiteboard.html`);
  await p.wait(2200);
  await p.evaluate('document.getElementById("btn-toggle-side").click()');
  await p.wait(600);
  await shot(`scene-${scene}-${theme}`);
} else if (scene === 'wb-fullscreen') {
  await p.goto(`${srv.base}/whiteboard.html`);
  await p.wait(2200);
  await p.evaluate('document.getElementById("btn-fullscreen-left").click()');
  await p.wait(700);
  await shot(`scene-${scene}-${theme}`);
} else if (scene === 'sponsor') {
  await p.goto(`${srv.base}/index.html`);
  await p.wait(1800);
  await p.evaluate('document.getElementById("sponsor-modal").classList.add("open")');
  await p.wait(600);
  await shot(`scene-${scene}-${theme}`);
} else {
  console.log('未知场景:', scene);
}

await close();
await srv.close();
