/**
 * _browser.mjs — 极简 CDP 驱动（不依赖 playwright）
 *
 * 背景：
 *   1) 本机 Edge 155 已移除 `--headless=old`，playwright 的 launch() 会带上该参数，
 *      浏览器启动即崩溃；
 *   2) playwright 的 connectOverCDP 在本机解析出的 ws 端口与实际不符。
 *   因此这里直接手写一个够用的 CDP 客户端：Node 22 自带全局 WebSocket，
 *   只需 HTTP 建 target + WS 发命令两步。
 *
 * 提供：openBrowser() → { newPage, close }
 *   page.goto(url) / page.evaluate(expr) / page.waitForFunction(expr)
 *   page.setViewport({width,height}) / page.screenshot({clip}) / page.mouse*()
 *   page.onPageError(cb) / page.onConsoleError(cb)
 */
import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { inflateSync } from 'node:zlib';

const EDGE_CANDIDATES = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];
const PORT = Number(process.env.LG_CDP_PORT || 9333);
const PROFILE = 'D:\\网站项目\\Micheal--main\\.workbuddy\\shots\\_edgeprofile';

function findEdge() {
  for (const p of EDGE_CANDIDATES) { try { execFileSync('cmd', ['/c', 'if', 'exist', `"${p}"`, 'exit', '0']); return p; } catch {} }
  return EDGE_CANDIDATES[0];
}

async function cdpAlive() {
  try { const r = await fetch(`http://127.0.0.1:${PORT}/json/version`, { signal: AbortSignal.timeout(1500) }); return r.ok; }
  catch { return false; }
}

async function ensureBrowser() {
  if (await cdpAlive()) return;
  try { rmSync(PROFILE, { recursive: true, force: true }); } catch {}
  mkdirSync(PROFILE, { recursive: true });
  const child = spawn(findEdge(), [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run',
    '--disable-extensions', '--disable-features=Translate,AcceptCHFrame',
    '--force-color-profile=srgb', '--hide-scrollbars', '--mute-audio',
    '--window-size=1920,1200', '--force-device-scale-factor=1',
    `--remote-debugging-port=${PORT}`, `--user-data-dir=${PROFILE}`, 'about:blank',
  ], { detached: true, stdio: 'ignore' });
  child.unref();
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 250));
    if (await cdpAlive()) return;
  }
  throw new Error('Edge 启动超时（CDP 端口未就绪）');
}

/* ------------------------------------------------------------------ */
/* 一个 page：一条 WebSocket + 一条命令队列                              */
/* ------------------------------------------------------------------ */
class Page {
  constructor(ws, targetId) {
    this.ws = ws;
    this.targetId = targetId;
    this.seq = 0;
    this.pending = new Map();
    this.pageErrors = [];
    this.consoleErrors = [];
    ws.addEventListener('message', ev => {
      let msg; try { msg = JSON.parse(ev.data); } catch { return; }
      if (msg.id != null && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? reject(new Error(`${msg.error.message} (${msg.error.code})`)) : resolve(msg.result);
        return;
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        this.pageErrors.push(msg.params?.exceptionDetails?.exception?.description || msg.params?.exceptionDetails?.text || 'unknown');
      }
      if (msg.method === 'Runtime.consoleAPICalled' && msg.params?.type === 'error') {
        this.consoleErrors.push((msg.params.args || []).map(a => a.value ?? a.description ?? '').join(' '));
      }
    });
  }

  send(method, params = {}) {
    const id = ++this.seq;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
      setTimeout(() => { if (this.pending.has(id)) { this.pending.delete(id); reject(new Error('CDP 超时: ' + method)); } }, 30000);
    });
  }

  async init() {
    await this.send('Page.enable');
    await this.send('Runtime.enable');
    await this.send('DOM.enable');
  }

  async setViewport({ width, height, scale = 1 }) {
    this.viewport = { width, height, scale };
    await this.send('Emulation.setDeviceMetricsOverride', {
      width, height, deviceScaleFactor: scale, mobile: false,
    });
  }

  async goto(url, { waitUntil = 'load', timeout = 30000 } = {}) {
    const done = new Promise(res => {
      const h = ev => { const m = JSON.parse(ev.data); if (m.method === 'Page.loadEventFired') { this.ws.removeEventListener('message', h); res(); } };
      this.ws.addEventListener('message', h);
    });
    await this.send('Page.navigate', { url });
    await Promise.race([done, new Promise(r => setTimeout(r, timeout))]);
    if (waitUntil === 'idle') await new Promise(r => setTimeout(r, 800));
  }

  async evaluate(expression, { awaitPromise = true } = {}) {
    const r = await this.send('Runtime.evaluate', {
      expression, awaitPromise, returnByValue: true, allowUnsafeEvalBlockedByCSP: true,
    });
    if (r.exceptionDetails) throw new Error('evaluate 抛错: ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text));
    return r.result?.value;
  }

  async waitForFunction(expression, { timeout = 20000, interval = 100 } = {}) {
    const t0 = Date.now();
    while (Date.now() - t0 < timeout) {
      if (await this.evaluate(`!!(${expression})`)) return true;
      await new Promise(r => setTimeout(r, interval));
    }
    throw new Error('waitForFunction 超时: ' + expression);
  }

  async wait(ms) { await new Promise(r => setTimeout(r, ms)); }

  /** 返回 PNG Buffer；clip 为页面坐标 */
  async screenshot({ clip, fullPage = false } = {}) {
    const params = { format: 'png', captureBeyondViewport: !!fullPage, fromSurface: true };
    if (clip) params.clip = { x: clip.x, y: clip.y, width: clip.width, height: clip.height, scale: clip.scale || 1 };
    const r = await this.send('Page.captureScreenshot', params);
    return Buffer.from(r.data, 'base64');
  }

  async mouseMove(x, y) {
    await this.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, buttons: 0, pointerType: 'mouse' });
  }
  async mouseDown(x, y, button = 'left') {
    await this.send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button, buttons: 1, clickCount: 1, pointerType: 'mouse' });
  }
  async mouseUp(x, y, button = 'left') {
    await this.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button, buttons: 0, clickCount: 1, pointerType: 'mouse' });
  }
  async click(x, y) { await this.mouseMove(x, y); await this.mouseDown(x, y); await this.mouseUp(x, y); }
  async key(type, key, code, windowsVirtualKeyCode) {
    await this.send('Input.dispatchKeyEvent', { type, key, code, windowsVirtualKeyCode, nativeVirtualKeyCode: windowsVirtualKeyCode });
  }

  async metrics() {
    return this.evaluate(`(() => ({
      scrollH: document.documentElement.scrollHeight,
      innerH: window.innerHeight,
      innerW: window.innerWidth,
      scrollW: document.documentElement.scrollWidth,
    }))()`);
  }
}

export async function openBrowser() {
  await ensureBrowser();
  const targets = [];
  return {
    async newPage(viewport = { width: 1440, height: 900 }) {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' });
      const t = await r.json();
      const ws = new WebSocket(t.webSocketDebuggerUrl);
      await new Promise((res, rej) => { ws.addEventListener('open', res); ws.addEventListener('error', rej); });
      const page = new Page(ws, t.id);
      targets.push({ ws, id: t.id });
      await page.init();
      await page.setViewport(viewport);
      return page;
    },
    async close() {
      for (const t of targets) {
        try { await fetch(`http://127.0.0.1:${PORT}/json/close/${t.id}`); } catch {}
        try { t.ws.close(); } catch {}
      }
    },
  };
}

/* ---------------- 内置静态服务器 ----------------
   ES Modules 在 file:// 下会被浏览器拦，所以测试统一走 http。
   自带一个极简静态服务器，避免依赖外部进程（后台进程容易被回收）。 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
  '.woff2': 'font/woff2',
};

export async function serve(root, port = 8391) {
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      let p = decodeURIComponent(url.pathname);
      if (p.endsWith('/')) p += 'index.html';
      const file = normalize(join(root, p));
      if (!file.startsWith(normalize(root))) { res.writeHead(403).end('forbidden'); return; }
      const s = await stat(file);
      if (s.isDirectory()) { res.writeHead(404).end('not found'); return; }
      const body = await readFile(file);
      res.writeHead(200, {
        'Content-Type': MIME[extname(file).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'no-store',
      });
      res.end(body);
    } catch (e) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('not found');
    }
  });
  await new Promise(r => server.listen(port, '127.0.0.1', r));
  return { base: `http://127.0.0.1:${port}`, close: () => new Promise(r => server.close(r)) };
}

/* ---------------- 极简 PNG 解码（只用 node 内置 zlib） ---------------- */
export function decodePNG(buf) {
  let pos = 8, w = 0, h = 0, colorType = 0;
  const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === 'IHDR') { w = data.readUInt32BE(0); h = data.readUInt32BE(4); colorType = data[9]; }
    else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    pos += 12 + len;
  }
  const raw = inflateSync(Buffer.concat(idat));
  const ch = colorType === 6 ? 4 : colorType === 2 ? 3 : colorType === 4 ? 2 : 1;
  const stride = w * ch;
  const out = Buffer.alloc(w * h * ch);
  let prev = Buffer.alloc(stride), rp = 0;
  for (let y = 0; y < h; y++) {
    const ft = raw[rp++];
    const line = Buffer.from(raw.subarray(rp, rp + stride)); rp += stride;
    for (let i = 0; i < stride; i++) {
      const a = i >= ch ? line[i - ch] : 0, b = prev[i], c = i >= ch ? prev[i - ch] : 0;
      let v = line[i];
      if (ft === 1) v += a; else if (ft === 2) v += b;
      else if (ft === 3) v += (a + b) >> 1;
      else if (ft === 4) {
        const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v += (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c);
      }
      line[i] = v & 0xff;
    }
    line.copy(out, y * stride); prev = line;
  }
  return { w, h, ch, data: out };
}

export function regionDiff(a, b, r) {
  let sum = 0, n = 0, max = 0;
  for (let y = r.y; y < Math.min(r.y + r.h, a.h); y++) {
    for (let x = r.x; x < Math.min(r.x + r.w, a.w); x++) {
      const o = (y * a.w + x) * a.ch;
      const d = (Math.abs(a.data[o] - b.data[o]) + Math.abs(a.data[o + 1] - b.data[o + 1]) + Math.abs(a.data[o + 2] - b.data[o + 2])) / 3;
      sum += d; n++; if (d > max) max = d;
    }
  }
  return { mad: n ? sum / n : 0, max };
}

/**
 * 在一维方向上寻找让 b 最贴近 a 的整像素位移。
 * 用途：直接量出「折射把这块背景整体挪了几像素」——
 * 比单纯比差异更硬，因为差异大也可能是模糊或调色造成的。
 *
 * 用原始亮度而不是梯度：夹具背景是非周期噪点纹理，
 * 噪点的梯度是白噪声、没有空间相关性，位移在梯度域里测不出来；
 * 亮度域里互相关只有一个尖峰，位移可以被唯一确定。
 * 唯一需要额外处理的是玻璃底色造成的整体压暗 —— 用区域均值归一化消掉。
 *
 * 返回 { d, mad }：把 b 沿 +d 方向平移 d 像素后与 a 最吻合。
 */
const lumAt = (img, x, y) => {
  const o = (y * img.w + x) * img.ch;
  return (img.data[o] + img.data[o + 1] + img.data[o + 2]) / 3;
};

export function bestShift(a, b, r, axis = 'x', range = 26) {
  // 区域均值归一化：玻璃底色会把背景整体压暗，不归一化时「谁更亮」会盖过「谁挪了位置」
  let sa = 0, sb = 0, n0 = 0;
  for (let y = r.y; y < Math.min(r.y + r.h, a.h); y++) {
    for (let x = r.x; x < Math.min(r.x + r.w, a.w); x++) { sa += lumAt(a, x, y); sb += lumAt(b, x, y); n0++; }
  }
  const na = n0 ? sa / n0 || 1 : 1;
  const nb = n0 ? sb / n0 || 1 : 1;

  let bestD = 0, bestScore = Infinity, zeroScore = Infinity;
  for (let d = -range; d <= range; d++) {
    let sum = 0, n = 0;
    for (let y = r.y; y < Math.min(r.y + r.h, a.h); y++) {
      for (let x = r.x; x < Math.min(r.x + r.w, a.w); x++) {
        const xb = axis === 'x' ? x + d : x;
        const yb = axis === 'y' ? y + d : y;
        if (xb < 0 || xb >= a.w || yb < 0 || yb >= a.h) continue;
        sum += Math.abs(lumAt(a, x, y) / na - lumAt(b, xb, yb) / nb); n++;
      }
    }
    const score = n ? sum / n : Infinity;
    if (d === 0) zeroScore = score;
    if (score < bestScore) { bestScore = score; bestD = d; }
  }
  // 只有当「最优位移」明显优于「零位移」时才采信，否则判为无位移（避免在噪声里挑极值）
  const gain = zeroScore > 0 ? (zeroScore - bestScore) / zeroScore : 0;
  return { d: gain > 0.08 ? bestD : 0, mad: bestScore, gain };
}
