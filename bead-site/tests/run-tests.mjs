// run-tests.mjs — QA test suite for 拼豆网 (Bead Studio) static site.
// Runs pure-logic + static-consistency + data-integrity checks with Node 22 (ESM).
// No browser required.
//
// Groups:
//   1) Color algorithm fidelity (srgbToLab / nearestColorId vs Python reference)
//   2) Palette integrity (ARTKAL_55)
//   3) Data grid decode (featured.json / inspiration.json)
//   4) Module dependency: no cycle / resolvable (node --check + graph + import)
//   5) DOM id consistency (HTML id="..." vs JS getElementById)
//   6) Worker contract (worker/index.js routes + wrangler.toml)
//   7) Exporter pure part (exportCSV string construction, mock download)

import { strict as assert } from 'node:assert';
import { readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const NODE = process.env.NODE_BIN || 'node';

// ---------------------------------------------------------------------------
// Minimal browser-ish globals so the ESM modules can be imported in Node.
// lab.js / palette.js / color.js / convert.js / exporter.js access `window`
// at top-level; exporter.js + a few functions touch document/Blob/URL at call
// time only, so we provide light mocks.
// ---------------------------------------------------------------------------
globalThis.window = globalThis;
globalThis.location = { pathname: '/', href: '' };

let lastBlobContent = null;
globalThis.Blob = class Blob {
  constructor(parts, opts) {
    this.parts = parts;
    this.type = (opts && opts.type) || '';
    lastBlobContent = parts.join('');
  }
};
globalThis.URL = { createObjectURL: () => 'blob:mock', revokeObjectURL: () => {} };
globalThis.document = {
  createElement(tag) {
    if (tag === 'a') return { href: '', download: '', click() {}, remove() {}, style: {} };
    if (tag === 'canvas') {
      return { getContext: () => ({}), width: 0, height: 0, toBlob: (cb) => cb({}), toDataURL: () => '' };
    }
    if (tag === 'script') return { src: '', async: false, onload: null, onerror: null };
    return { appendChild() {}, click() {}, remove() {}, style: {}, setAttribute() {}, addEventListener() {} };
  },
  head: { appendChild() {} },
  body: { appendChild() {} },
};

// ---------------------------------------------------------------------------
// Tiny test harness
// ---------------------------------------------------------------------------
const results = [];
function rec(group, name, pass, err) {
  results.push({ group, name, pass, err: pass ? null : err });
}
async function case_(group, name, fn) {
  try {
    await fn();
    rec(group, name, true);
  } catch (e) {
    rec(group, name, false, e && e.message ? e.message : String(e));
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function read(rel) {
  return readFileSync(join(ROOT, rel), 'utf8');
}
function readJSON(rel) {
  return JSON.parse(read(rel));
}
function listJs(dir) {
  return readdirSync(join(ROOT, dir)).filter((f) => f.endsWith('.js'));
}
function nodeCheck(fileRel) {
  const abs = join(ROOT, fileRel);
  try {
    // 首选：进程内 ESM parse（vm.SourceTextModule 仅做语法编译，不执行代码），
    // 避免在 node.exe 被占用（EBUSY）的受限环境下派生子进程失败。
    if (typeof vm.SourceTextModule === 'function') {
      new vm.SourceTextModule(readFileSync(abs, 'utf8'), { identifier: abs });
      return { ok: true, err: null };
    }
    // 回退：旧 Node 无 SourceTextModule 时仍用 node --check 子进程。
    execFileSync(NODE, ['--check', abs], { stdio: 'pipe' });
    return { ok: true, err: null };
  } catch (e) {
    return { ok: false, err: e.stderr ? e.stderr.toString() : e.message };
  }
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------
async function main() {
  // =====================================================================
  // GROUP 1 — Color algorithm fidelity
  // =====================================================================
  const { srgbToLab } = await import('../assets/js/lab.js');
  const { nearestColorId } = await import('../assets/js/color.js');
  const { ARTKAL_55, PALETTE_LAB } = await import('../assets/js/palette.js');
  const validIds = new Set(ARTKAL_55.map((c) => c.id));

  const REF = {
    '255,255,255': [100, 0, 0],
    '0,0,0': [0, 0, 0],
    '255,0,0': [53.2, 80.1, 67.2],
    '0,255,0': [87.7, -86.2, 83.2],
    '0,0,255': [32.3, 79.2, -107.9],
  };

  for (const key of Object.keys(REF)) {
    const rgb = key.split(',').map(Number);
    await case_('G1-color', `srgbToLab(${key}) within ±0.5 of reference`, () => {
      const got = srgbToLab(rgb);
      const exp = REF[key];
      const maxErr = Math.max(Math.abs(got[0] - exp[0]), Math.abs(got[1] - exp[1]), Math.abs(got[2] - exp[2]));
      assert.ok(maxErr <= 0.5, `maxErr=${maxErr} (got [${got.map((v) => +v.toFixed(3))}] expect [${exp}])`);
    });
  }

  await case_('G1-color', 'nearestColorId(255,255,255) === A01', () => {
    assert.strictEqual(nearestColorId([255, 255, 255]), 'A01');
  });
  await case_('G1-color', 'nearestColorId(26,26,26) === A30', () => {
    assert.strictEqual(nearestColorId([26, 26, 26]), 'A30');
  });

  // Re-implement the same brute-force nearest (sRGB->Lab + min Euclidean dist)
  // to verify nearestColorId is self-consistent with the documented formula.
  function recompute(rgb) {
    const lab = srgbToLab(rgb);
    let best = null;
    let bestD = Infinity;
    for (const id of Object.keys(PALETTE_LAB)) {
      const L = PALETTE_LAB[id];
      const d = Math.hypot(lab[0] - L[0], lab[1] - L[1], lab[2] - L[2]);
      if (d < bestD) {
        bestD = d;
        best = id;
      }
    }
    return best;
  }
  function familyOk(id, rgb) {
    const c = ARTKAL_55.find((x) => x.id === id);
    const [r, g, b] = rgb;
    if (r >= g && r >= b && r > 0) return true; // reddish
    if (g >= r && g >= b && g > 0) return true; // greenish
    if (b >= r && b >= g && b > 0) return true; // blueish
    return false;
  }
  for (const [name, rgb] of [
    ['red(255,0,0)', [255, 0, 0]],
    ['green(0,255,0)', [0, 255, 0]],
    ['blue(0,0,255)', [0, 0, 255]],
  ]) {
    await case_('G1-color', `nearestColorId(${name}) is valid Artkal id + self-consistent + in color family`, () => {
      const got = nearestColorId(rgb);
      assert.ok(validIds.has(got), `returned id "${got}" is not a valid Artkal id`);
      assert.strictEqual(got, recompute(rgb), 'not consistent with srgbToLab+min-distance formula');
      assert.ok(familyOk(got, rgb), `returned "${got}" is not a reasonable nearest neighbour for ${name}`);
    });
  }

  // =====================================================================
  // GROUP 2 — Palette integrity
  // =====================================================================
  await case_('G2-palette', 'ARTKAL_55 has exactly 55 entries', () => {
    assert.strictEqual(ARTKAL_55.length, 55);
  });
  await case_('G2-palette', 'ARTKAL_55 ids unique and sequential A01..A55', () => {
    const seen = new Set();
    for (let i = 0; i < ARTKAL_55.length; i++) {
      const c = ARTKAL_55[i];
      assert.ok(/^A\d{2}$/.test(c.id), `bad id format: ${c.id}`);
      assert.ok(!seen.has(c.id), `duplicate id ${c.id}`);
      seen.add(c.id);
      const expected = 'A' + String(i + 1).padStart(2, '0');
      assert.strictEqual(c.id, expected, `expected sequential ${expected}, got ${c.id}`);
    }
    assert.strictEqual(seen.size, 55);
  });
  await case_('G2-palette', 'every entry has legal #RRGGBB hex', () => {
    for (const c of ARTKAL_55) {
      assert.match(c.hex, /^#[0-9A-Fa-f]{6}$/, `bad hex for ${c.id}: ${c.hex}`);
    }
  });
  await case_('G2-palette', 'every entry has rgb[3] ints in 0..255', () => {
    for (const c of ARTKAL_55) {
      assert.ok(Array.isArray(c.rgb) || (typeof c.r === 'number'), 'rgb shape');
      for (const v of [c.r, c.g, c.b]) {
        assert.ok(Number.isInteger(v) && v >= 0 && v <= 255, `rgb out of range for ${c.id}: ${v}`);
      }
    }
  });
  await case_('G2-palette', 'PALETTE_LAB precomputed for all 55 ids', () => {
    const keys = Object.keys(PALETTE_LAB);
    assert.strictEqual(keys.length, 55);
    for (const id of validIds) {
      assert.ok(Array.isArray(PALETTE_LAB[id]) && PALETTE_LAB[id].length === 3, `lab missing/invalid for ${id}`);
      for (const v of PALETTE_LAB[id]) assert.ok(Number.isFinite(v), `lab value not finite for ${id}`);
    }
  });
  await case_('G2-palette', 'PALETTE_LAB matches srgbToLab(rgb)', () => {
    for (const c of ARTKAL_55) {
      const computed = srgbToLab([c.r, c.g, c.b]);
      const stored = PALETTE_LAB[c.id];
      for (let i = 0; i < 3; i++) {
        assert.ok(Math.abs(computed[i] - stored[i]) < 1e-9, `lab mismatch for ${c.id} idx ${i}`);
      }
    }
  });

  // =====================================================================
  // GROUP 3 — Data grid decode (uses the real decodeGrid from home.js)
  // =====================================================================
  const { decodeGrid } = await import('../assets/js/home.js');

  function validateExample(ex, where) {
    assert.ok(Array.isArray(ex.rows) && ex.rows.length > 0, `${where}: empty rows`);
    const w = ex.rows[0].length;
    assert.ok(w > 0, `${where}: zero width`);
    for (let r = 0; r < ex.rows.length; r++) {
      const row = ex.rows[r];
      assert.strictEqual(row.length, w, `${where}: row ${r} width ${row.length} != ${w} (not rectangular)`);
      for (const ch of row.split('')) {
        const idx = parseInt(ch, 36);
        assert.ok(idx >= 0 && idx < ex.colors.length, `${where}: char '${ch}' -> index ${idx} out of colors range [0,${ex.colors.length})`);
        const id = ex.colors[idx];
        assert.ok(validIds.has(id), `${where}: decoded id '${id}' (char '${ch}') not in ARTKAL_55`);
      }
    }
  }

  const featured = readJSON('data/featured.json');
  const inspiration = readJSON('data/inspiration.json');

  await case_('G3-decode', 'featured.json has >= 4 examples', () => {
    assert.ok(Array.isArray(featured.featured) && featured.featured.length >= 4, `got ${featured.featured && featured.featured.length}`);
  });
  await case_('G3-decode', 'inspiration.json has >= 6 categories, each >= 3 examples', () => {
    assert.ok(Array.isArray(inspiration.categories) && inspiration.categories.length >= 6, `cats=${inspiration.categories && inspiration.categories.length}`);
    for (const cat of inspiration.categories) {
      assert.ok(Array.isArray(cat.examples) && cat.examples.length >= 3, `category ${cat.id} has ${cat.examples && cat.examples.length} examples (<3)`);
    }
  });
  await case_('G3-decode', 'featured: all decoded cells valid + rectangular (base36 scheme)', () => {
    for (const ex of featured.featured) {
      validateExample(ex, `featured.${ex.id}`);
      const grid = decodeGrid(ex); // exercise the real source function
      assert.strictEqual(grid.length, ex.rows.length, 'decoded row count mismatch');
    }
  });
  await case_('G3-decode', 'inspiration: all decoded cells valid + rectangular (base36 scheme)', () => {
    for (const cat of inspiration.categories) {
      for (const ex of cat.examples) {
        validateExample(ex, `inspiration.${cat.id}.${ex.id}`);
        const grid = decodeGrid(ex);
        assert.strictEqual(grid.length, ex.rows.length, 'decoded row count mismatch');
      }
    }
  });

  // =====================================================================
  // GROUP 4 — Module dependency: no cycle / resolvable
  // =====================================================================
  const jsFiles = listJs('assets/js');
  await case_('G4-modules', `node --check passes for all ${jsFiles.length} assets/js/*.js + worker`, () => {
    let failed = [];
    for (const f of jsFiles) {
      const r = nodeCheck(`assets/js/${f}`);
      if (!r.ok) failed.push(`${f}: ${r.err}`);
    }
    const w = nodeCheck('worker/index.js');
    if (!w.ok) failed.push(`worker/index.js: ${w.err}`);
    assert.ok(failed.length === 0, 'syntax/parse failures:\n' + failed.join('\n'));
  });
  await case_('G4-modules', 'lab.js has NO imports (no business-module dependency)', () => {
    const src = read('assets/js/lab.js');
    const imports = src.match(/^\s*import\s+/m);
    assert.ok(!imports, 'lab.js must not import anything');
  });
  await case_('G4-modules', 'import graph is acyclic (no circular dependency / TDZ hazard)', () => {
    const nodes = jsFiles.slice();
    const adj = {};
    for (const f of nodes) adj[f] = [];
    for (const f of nodes) {
      const src = read(`assets/js/${f}`);
      const re = /import\s+(?:[^'"]*?\s+from\s+)?['"]\.\/([^'"]+)['"]/g;
      let m;
      while ((m = re.exec(src))) {
        const dep = m[1].split('/').pop();
        if (nodes.includes(dep)) adj[f].push(dep);
      }
    }
    // DFS cycle detection
    const WHITE = 0, GRAY = 1, BLACK = 2;
    const color = {};
    nodes.forEach((n) => (color[n] = WHITE));
    const stack = [];
    function dfs(u) {
      color[u] = GRAY;
      stack.push(u);
      for (const v of adj[u]) {
        if (color[v] === GRAY) return [u, v];
        if (color[v] === WHITE) {
          const cyc = dfs(v);
          if (cyc) return cyc;
        }
      }
      stack.pop();
      color[u] = BLACK;
      return null;
    }
    let cycle = null;
    for (const n of nodes) {
      if (color[n] === WHITE) {
        cycle = dfs(n);
        if (cycle) break;
      }
    }
    assert.ok(!cycle, 'cycle detected: ' + (cycle ? cycle.join(' -> ') : ''));
  });
  await case_('G4-modules', 'runtime import chain resolves (lab/palette/color/convert/exporter)', async () => {
    // Already imported lab/color/palette above; add convert + exporter.
    const conv = await import('../assets/js/convert.js');
    const exp = await import('../assets/js/exporter.js');
    assert.ok(typeof conv.renderGrid === 'function', 'convert.renderGrid missing');
    assert.ok(typeof exp.exportCSV === 'function', 'exporter.exportCSV missing');
  });

  // =====================================================================
  // GROUP 5 — DOM id consistency
  // =====================================================================
  // Which JS modules each HTML page loads (from <script type="module">).
  const PAGE_JS = {
    'index.html': ['chrome.js', 'patterns-data.js', 'bead-viewer.js'],
    'create.html': ['chrome.js', 'patterns-data.js', 'bead-viewer.js'],
    'inspiration.html': ['chrome.js', 'patterns-data.js', 'bead-viewer.js'],
    'inspiration/animals.html': ['chrome.js', 'inspiration.js'],
    'inspiration/anime.html': ['chrome.js', 'inspiration.js'],
    'inspiration/festival.html': ['chrome.js', 'inspiration.js'],
    'inspiration/food.html': ['chrome.js', 'inspiration.js'],
    'inspiration/landscape.html': ['chrome.js', 'inspiration.js'],
    'inspiration/text.html': ['chrome.js', 'inspiration.js'],
    'tutorial.html': ['chrome.js'],
    'whiteboard.html': ['chrome.js', 'palette.js'],
  };
  // ids that are created dynamically by JS (so they need not exist in static HTML)
  const DYNAMIC_IDS = new Set([
    'bead-lightbox',      // inspiration.js lightbox
    'sponsor-modal',      // chrome.js sponsor dialog (injected at runtime)
    'sponsor-close-btn',
    'tab-wechat',
    'tab-alipay',
    'qr-wechat',
    'qr-alipay',
    'btn-confirm-sponsored',
    'btn-close-thanks',
    'sponsor-step-pay',
    'sponsor-step-thanks',
    'site-header',        // chrome.js nav host
    'site-footer',        // chrome.js footer host
    'theme-toggle-btn',
    'nav-hamburger-btn',
    'nav-mobile-dropdown',
    'btn-open-sponsor',
    'mobile-sponsor-btn',
  ]);

  function collectHtmlIds(htmlRel) {
    const src = read(htmlRel);
    const ids = new Set();
    const re = /id="([^"]+)"/g;
    let m;
    while ((m = re.exec(src))) ids.add(m[1]);
    return ids;
  }
  function collectJsIds(jsFile) {
    const src = read(`assets/js/${jsFile}`);
    const ids = new Set();
    let m;
    const re1 = /getElementById\(\s*['"]([^'"]+)['"]\s*\)/g;
    while ((m = re1.exec(src))) ids.add(m[1]);
    const re2 = /querySelector\(\s*['"]#([^'"]+)['"]\s*\)/g;
    while ((m = re2.exec(src))) ids.add(m[1]);
    return ids;
  }

  // Build module -> set of HTML pages that load it. A shared module (e.g.
  // inspiration.js) is loaded by several pages; its referenced ids must exist
  // in the UNION of those pages' ids, because different entry functions are
  // invoked on different pages (initInspirationIndex on inspiration.html only,
  // initInspirationCategory on the sub-pages only).
  const moduleToPages = {};
  for (const [htmlRel, jsList] of Object.entries(PAGE_JS)) {
    for (const js of jsList) {
      (moduleToPages[js] = moduleToPages[js] || new Set()).add(htmlRel);
    }
  }

  let refStaticSet = new Set();
  let resStaticSet = new Set();
  let dynSet = new Set();

  for (const [js, pages] of Object.entries(moduleToPages)) {
    const refs = collectJsIds(js);
    const unionIds = new Set();
    for (const p of pages) for (const id of collectHtmlIds(p)) unionIds.add(id);
    await case_('G5-dom', `DOM ids: module ${js} — referenced ids exist in its pages`, () => {
      for (const id of refs) {
        if (DYNAMIC_IDS.has(id)) {
          dynSet.add(id);
          continue; // created at runtime, not required in static HTML
        }
        refStaticSet.add(id);
        const ok = unionIds.has(id);
        if (ok) resStaticSet.add(id);
        assert.ok(ok, `module ${js}: id "${id}" not found in any of its pages [${[...pages].join(', ')}]`);
      }
    });
  }
  // Every static getElementById / querySelector('#id') reference must resolve
  // against the union of its pages' ids; runtime-injected ids are whitelisted
  // via DYNAMIC_IDS above.
  await case_('G5-dom', 'all static getElementById refs resolvable (dynamic ids whitelisted)', () => {
    assert.strictEqual(resStaticSet.size, refStaticSet.size, `resolved ${resStaticSet.size} != referenced ${refStaticSet.size}`);
    const total = refStaticSet.size + dynSet.size;
    assert.ok(total > 0, 'no getElementById references found at all');
    console.log(`   (unique static ids: ${refStaticSet.size}, dynamic: ${[...dynSet].join(',') || 'none'}, total refs: ${total})`);
  });


  // =====================================================================
  // GROUP 6 — Worker contract
  // =====================================================================
  await case_('G6-worker', 'worker/index.js node --check passes', () => {
    const r = nodeCheck('worker/index.js');
    assert.ok(r.ok, r.err || 'check failed');
  });
  await case_('G6-worker', 'worker has /api/convert + /api/ai-proxy routes and reads env.API_KEY', () => {
    const src = read('worker/index.js');
    assert.ok(src.includes("'/api/convert'"), 'missing /api/convert route');
    assert.ok(src.includes("'/api/ai-proxy'"), 'missing /api/ai-proxy route');
    assert.ok(/env\.API_KEY/.test(src), 'does not read env.API_KEY');
  });
  await case_('G6-worker', 'wrangler.toml has name / main / compatibility_date', () => {
    assert.ok(existsSync(join(ROOT, 'worker/wrangler.toml')), 'wrangler.toml missing');
    const t = read('worker/wrangler.toml');
    const name = t.match(/name\s*=\s*"([^"]+)"/);
    const main = t.match(/main\s*=\s*"([^"]+)"/);
    const compat = t.match(/compatibility_date\s*=\s*"([^"]+)"/);
    assert.ok(name, 'wrangler.toml missing name');
    assert.ok(main, 'wrangler.toml missing main');
    assert.ok(compat, 'wrangler.toml missing compatibility_date');
    assert.strictEqual(main[1], 'index.js', 'main should point to index.js');
  });

  // =====================================================================
  // GROUP 7 — Exporter pure part (exportCSV)
  // =====================================================================
  const { exportCSV } = await import('../assets/js/exporter.js');
  await case_('G7-export', 'exportCSV: row count = grid height, col count = grid width', () => {
    lastBlobContent = null;
    const grid = [
      ['A01', 'A30', 'A22'],
      ['A22', null, 'A07'],
      ['A07', 'A07', 'A01'],
    ];
    exportCSV(grid, { filename: 't.csv' });
    assert.ok(lastBlobContent, 'no blob content captured');
    const body = lastBlobContent.replace(/^﻿/, '');
    const rows = body.split('\r\n');
    assert.strictEqual(rows.length, 3, `expected 3 rows, got ${rows.length}`);
    for (const row of rows) {
      const cells = row.split(',');
      assert.strictEqual(cells.length, 3, `expected 3 cols, got ${cells.length}`);
    }
  });
  await case_('G7-export', 'exportCSV: each non-null cell is a valid Artkal id string, null -> empty', () => {
    const grid = [['A01', null], [null, 'A55']];
    exportCSV(grid, { filename: 't2.csv' });
    const body = lastBlobContent.replace(/^﻿/, '');
    const rows = body.split('\r\n');
    assert.strictEqual(rows[0], 'A01,', 'row0 mismatch');
    assert.strictEqual(rows[1], ',A55', 'row1 mismatch');
    for (const row of rows) {
      for (const cell of row.split(',')) {
        if (cell === '') continue;
        assert.ok(validIds.has(cell), `cell "${cell}" is not a valid Artkal id`);
      }
    }
  });
  await case_('G7-export', 'exportCSV: Excel-friendly BOM + CRLF line endings', () => {
    const grid = [
      ['A01', 'A02'],
      ['A03', 'A04'],
    ];
    exportCSV(grid, { filename: 't3.csv' });
    assert.ok(lastBlobContent.startsWith('﻿'), 'missing UTF-8 BOM');
    assert.ok(lastBlobContent.includes('\r\n'), 'missing CRLF line endings');
  });

  // =====================================================================
  // GROUP 8 — Bead-viewer: hollow-style code label legibility
  // 中空圆珠中心孔洞填充画布底色，色号文字颜色必须与孔洞底色对比，
  // 且叠加底色光晕描边；否则深色豆子的白色文字会在浅色主题下「隐身」。
  // =====================================================================
  const { renderPattern } = await import('../assets/js/bead-viewer.js');

  function makeMockCtx() {
    const ops = [];
    const ctx = {
      canvas: { width: 0, height: 0 },
      globalAlpha: 1,
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      lineJoin: '',
      font: '',
      textAlign: '',
      textBaseline: '',
      shadowColor: '',
      shadowBlur: 0,
      save() {}, restore() {}, beginPath() {}, arc() {}, rect() {}, roundRect() {},
      fill() {}, stroke() {}, clip() {}, clearRect() {}, fillRect() {},
      moveTo() {}, lineTo() {}, strokeRect() {},
      fillText(text) { ops.push({ op: 'fillText', text, fillStyle: this.fillStyle, alpha: this.globalAlpha }); },
      strokeText(text) { ops.push({ op: 'strokeText', text, strokeStyle: this.strokeStyle, alpha: this.globalAlpha }); },
    };
    return { ctx, ops };
  }

  const DARK_BEAD = { code: 'H7', r: 20, g: 24, b: 40, hex: '#141828' };
  const LIGHT_THEME = {
    isDark: false, canvasBg: '#ffffff', grid: 'rgba(15,23,42,0.10)',
    gridStrong: 'rgba(15,23,42,0.2)', rulerText: '#64748b', accent: '#0052ff', check: '#10b981',
  };
  const DARK_THEME = { ...LIGHT_THEME, isDark: true, canvasBg: '#0f172a', accent: '#6d95ff' };

  function renderOne(beadStyle, theme, bead = DARK_BEAD) {
    const { ctx, ops } = makeMockCtx();
    renderPattern(ctx, [[bead]], {
      cellSize: 24,
      beadStyle,
      gap: 'none',
      showGrid: false,
      showRuler: false,
      showCode: true,
      highlightCode: null,
      dimOthers: false,
      checked: new Set(),
      excluded: new Set(),
      theme,
    });
    return ops.filter((o) => o.text === bead.code);
  }

  await case_('G8-hollow-code', 'hollow + light theme: dark bead code label uses dark fill (visible on white hole)', () => {
    const ops = renderOne('hollow', LIGHT_THEME);
    const fills = ops.filter((o) => o.op === 'fillText');
    assert.ok(fills.length === 1, `expected exactly 1 fillText, got ${fills.length}`);
    assert.notStrictEqual(
      fills[0].fillStyle,
      'rgba(255,255,255,0.9)',
      'regression: white label on white hole — code would be invisible'
    );
    assert.strictEqual(fills[0].fillStyle, 'rgba(15,23,42,0.85)');
  });

  await case_('G8-hollow-code', 'hollow + light theme: code label has canvas-bg halo stroke over the colored ring', () => {
    const ops = renderOne('hollow', LIGHT_THEME);
    const halos = ops.filter((o) => o.op === 'strokeText');
    assert.ok(halos.length === 1, `expected exactly 1 strokeText halo, got ${halos.length}`);
    assert.strictEqual(halos[0].strokeStyle, 'rgba(255,255,255,0.9)');
  });

  await case_('G8-hollow-code', 'hollow + dark theme: dark bead code label uses light fill on dark hole + dark halo', () => {
    const ops = renderOne('hollow', DARK_THEME);
    const fill = ops.find((o) => o.op === 'fillText');
    const halo = ops.find((o) => o.op === 'strokeText');
    assert.ok(fill && halo, 'missing fillText/strokeText');
    assert.strictEqual(fill.fillStyle, 'rgba(255,255,255,0.92)');
    assert.strictEqual(halo.strokeStyle, 'rgba(15,23,42,0.9)');
  });

  await case_('G8-hollow-code', 'hollow + light theme: light bead keeps dark fill (contrast vs white hole)', () => {
    const ops = renderOne('hollow', LIGHT_THEME, { code: 'A01', r: 240, g: 240, b: 240, hex: '#f0f0f0' });
    const fill = ops.find((o) => o.op === 'fillText');
    assert.ok(fill, 'missing fillText');
    assert.strictEqual(fill.fillStyle, 'rgba(15,23,42,0.85)');
  });

  await case_('G8-hollow-code', 'round/square style: luminance-based label color preserved (no behavior change)', () => {
    for (const style of ['round', 'square']) {
      const ops = renderOne(style, LIGHT_THEME);
      const fill = ops.find((o) => o.op === 'fillText');
      const stroke = ops.find((o) => o.op === 'strokeText');
      assert.ok(fill, `${style}: missing fillText`);
      assert.strictEqual(fill.fillStyle, 'rgba(255,255,255,0.9)', `${style}: dark bead should keep white label`);
      assert.ok(!stroke, `${style}: non-hollow style must not add halo strokes`);
    }
  });

  // =====================================================================
  // GROUP 9 — Whiteboard core logic (whiteboard-core.js)
  // 重点回归「调亮度/对比度后色号不更新」这个 bug：
  // 旧实现走离屏 canvas 的 ctx.filter，滤镜不生效时色号保持不变；
  // 新实现是纯数学变换 + Lab 匹配，必须保证参数一变色号就真的变。
  // =====================================================================
  const wb = await import('../assets/js/whiteboard-core.js');
  const {
    buildPaletteIndex, matchNearest, remapGrid, adjustPixel, isNeutralAdjust,
    createEmptyGrid, computeStats, floodFill, rectCells, mirrorTargets,
    createHistory, pushHistory, canUndo, canRedo, undo, redo,
    pixelsToBeadGrid, filterPalette, sortByHue,
  } = wb;

  const wbPalette = ARTKAL_55;
  const wbIndex = buildPaletteIndex(wbPalette);

  await case_('G9-wb-core', 'buildPaletteIndex covers every palette entry with a finite Lab', () => {
    assert.strictEqual(wbIndex.length, wbPalette.length);
    for (const entry of wbIndex) {
      assert.ok(entry.bead && typeof entry.bead.code === 'string', 'missing normalized bead.code');
      assert.ok(Array.isArray(entry.lab) && entry.lab.length === 3, 'bad lab');
      for (const v of entry.lab) assert.ok(Number.isFinite(v), 'non-finite lab value');
    }
  });

  await case_('G9-wb-core', 'matchNearest returns an exact palette member for an exact palette color', () => {
    for (const c of wbPalette) {
      const got = matchNearest(c.r, c.g, c.b, wbIndex);
      assert.strictEqual(got.code, c.id, `${c.id} matched to ${got.code}`);
    }
  });

  await case_('G9-wb-core', 'adjustPixel: neutral params are identity', () => {
    const src = { r: 120, g: 60, b: 200 };
    const out = adjustPixel(src, { brightness: 0, contrast: 0, saturation: 0 });
    assert.deepStrictEqual(out, src);
  });

  await case_('G9-wb-core', 'adjustPixel: brightness +100 doubles values and clamps at 255', () => {
    const out = adjustPixel({ r: 100, g: 50, b: 10 }, { brightness: 100 });
    assert.strictEqual(out.r, 200);
    assert.strictEqual(out.g, 100);
    assert.strictEqual(out.b, 20);
    const hot = adjustPixel({ r: 200, g: 200, b: 200 }, { brightness: 100 });
    assert.strictEqual(hot.r, 255, 'must clamp to 255 instead of overflowing');
  });

  await case_('G9-wb-core', 'adjustPixel: contrast -100 collapses toward mid gray', () => {
    const out = adjustPixel({ r: 255, g: 255, b: 255 }, { contrast: -100 });
    // (255-127.5)*0+127.5 = 127.5 -> 128
    assert.ok(Math.abs(out.r - 128) <= 1, `expected ~128, got ${out.r}`);
    assert.ok(Math.abs(out.g - 128) <= 1, `expected ~128, got ${out.g}`);
  });

  await case_('G9-wb-core', 'adjustPixel: saturation -100 yields a neutral gray', () => {
    const out = adjustPixel({ r: 230, g: 0, b: 18 }, { saturation: -100 });
    assert.strictEqual(out.r, out.g, 'red channel should equal green at zero saturation');
    assert.strictEqual(out.g, out.b, 'green channel should equal blue at zero saturation');
  });

  await case_('G9-wb-core', 'isNeutralAdjust detects all-zero and non-zero param sets', () => {
    assert.ok(isNeutralAdjust({}), 'empty object is neutral');
    assert.ok(isNeutralAdjust({ brightness: 0, contrast: 0, saturation: 0 }), 'all zeros are neutral');
    assert.ok(!isNeutralAdjust({ brightness: 1 }), 'brightness 1 is not neutral');
    assert.ok(!isNeutralAdjust({ contrast: -30 }), 'contrast -30 is not neutral');
  });

  // ---- 核心 bug 回归：调滤镜后色号必须真的变 ----
  function gridWithCodes(codes) {
    return codes.map((row) => row.map((code) => {
      const c = wbPalette.find((x) => x.id === code);
      return { code: c.id, name: c.name, hex: c.hex, r: c.r, g: c.g, b: c.b };
    }));
  }
  function codeOf(grid, x, y) {
    return grid[y][x] ? grid[y][x].code : null;
  }

  await case_('G9-wb-core', 'REGRESSION: brightness change actually changes remapped bead codes', () => {
    // 亮色 A05 (255,179,71) 提亮 +60 后必须跳到更浅的真实色号（实测 → A03）
    const base = gridWithCodes([['A05', 'A05'], ['A05', 'A05']]);
    const before = remapGrid(base, { brightness: 0 }, wbIndex);
    const after = remapGrid(base, { brightness: 60 }, wbIndex);
    assert.strictEqual(codeOf(before, 0, 0), 'A05');
    assert.strictEqual(codeOf(after, 0, 0), 'A03', 'brightness +60 on A05 must map to A03');
    assert.notStrictEqual(codeOf(after, 0, 0), 'A05', 'code must actually change');
  });

  await case_('G9-wb-core', 'REGRESSION: contrast change actually changes remapped bead codes', () => {
    // 对比度 +70 会把中间调推向两端：A05 → A04（实测）
    const base = gridWithCodes([['A05', 'A30'], ['A05', 'A30']]);
    const before = remapGrid(base, { contrast: 0 }, wbIndex);
    const after = remapGrid(base, { contrast: 70 }, wbIndex);
    assert.strictEqual(codeOf(before, 0, 0), 'A05');
    assert.strictEqual(codeOf(after, 0, 0), 'A04', 'contrast +70 on A05 must map to A04');
    assert.notStrictEqual(codeOf(after, 0, 0), 'A05', 'code must actually change');
  });

  await case_('G9-wb-core', 'REGRESSION: negative brightness darkens codes (A05 → A26 measured)', () => {
    const base = gridWithCodes([['A05']]);
    const after = remapGrid(base, { brightness: -40 }, wbIndex);
    assert.strictEqual(codeOf(after, 0, 0), 'A26', 'brightness -40 on A05 must map to A26');
  });

  await case_('G9-wb-core', 'REGRESSION: every slider direction produces a distinct remap (sweep)', () => {
    // 逐档扫过亮度区间，确认不是只有极端值才有反应
    const base = gridWithCodes([['A05']]);
    const seen = new Set();
    for (let b = -100; b <= 100; b += 20) {
      seen.add(codeOf(remapGrid(base, { brightness: b }, wbIndex), 0, 0));
    }
    assert.ok(seen.size >= 4, `brightness sweep should hit several codes, got ${seen.size}: ${[...seen]}`);
  });

  await case_('G9-wb-core', 'remapGrid is deterministic (same input -> same output, twice)', () => {
    const base = gridWithCodes([['A07', 'A01'], ['A30', 'A03']]);
    const a = remapGrid(base, { brightness: 25, contrast: 15, saturation: -20 }, wbIndex);
    const b = remapGrid(base, { brightness: 25, contrast: 15, saturation: -20 }, wbIndex);
    assert.deepStrictEqual(a, b, 'remap must be deterministic — this is what ctx.filter could not guarantee');
  });

  await case_('G9-wb-core', 'remapGrid preserves every empty cell as null (no phantom beads)', () => {
    const base = gridWithCodes([['A07', 'A01']]);
    base[0][1] = null;
    const out = remapGrid(base, { brightness: 80, contrast: 80, saturation: 80 }, wbIndex);
    assert.strictEqual(out[0][1], null, 'empty cell must stay empty after remap');
    assert.ok(out[0][0], 'filled cell must stay filled');
  });

  await case_('G9-wb-core', 'remapGrid with neutral params returns the original codes untouched', () => {
    const base = gridWithCodes([['A07', 'A30', 'A01']]);
    const out = remapGrid(base, { brightness: 0, contrast: 0, saturation: 0 }, wbIndex);
    assert.deepStrictEqual(out.map((r) => r.map((c) => c && c.code)), [['A07', 'A30', 'A01']]);
  });

  await case_('G9-wb-core', 'remapGrid outputs only codes that exist in the target palette', () => {
    const base = gridWithCodes([['A07', 'A30'], ['A01', 'A03']]);
    const out = remapGrid(base, { brightness: 40, contrast: 40, saturation: 40 }, wbIndex);
    const valid = new Set(wbPalette.map((c) => c.id));
    for (const row of out) {
      for (const bead of row) {
        if (!bead) continue;
        assert.ok(valid.has(bead.code), `remapped code ${bead.code} is not in the palette`);
      }
    }
  });
  await case_('G9-wb-core', 'REGRESSION: switching palette re-maps codes even with zero filters', () => {
    // 这是本次修复的另一个真实 bug：过去 remapGrid 对空滤镜短路返回原色，
    // 导致「Artkal → Perler」后画布上仍显示旧的 A 系列色号。
    const other = [
      { code: 'X1', name: 'X White', hex: '#FFFFFF', r: 255, g: 255, b: 255 },
      { code: 'X2', name: 'X Black', hex: '#000000', r: 0, g: 0, b: 0 },
    ];
    const idx = buildPaletteIndex(other);
    const base = gridWithCodes([['A01', 'A30']]);
    const out = remapGrid(base, { brightness: 0, contrast: 0, saturation: 0 }, idx);
    assert.deepStrictEqual(
      out.map((r) => r.map((c) => c && c.code)),
      [['X1', 'X2']],
      'with a zero filter the codes must still be re-mapped onto the new palette'
    );
  });

  await case_('G9-wb-core', 'createEmptyGrid builds a square grid of nulls', () => {
    const g = createEmptyGrid(5);
    assert.strictEqual(g.length, 5);
    for (const row of g) {
      assert.strictEqual(row.length, 5);
      for (const c of row) assert.strictEqual(c, null);
    }
  });

  await case_('G9-wb-core', 'computeStats counts per code and totals (nulls ignored)', () => {
    const g = [
      [{ code: 'A07' }, { code: 'A07' }, null],
      [{ code: 'A30' }, null, { code: 'A07' }],
    ];
    const s = computeStats(g);
    assert.strictEqual(s.total, 4);
    assert.strictEqual(s.colors, 2);
    assert.strictEqual(s.list[0].code, 'A07', 'most used color must sort first');
    assert.strictEqual(s.list[0].count, 3);
  });

  await case_('G9-wb-core', 'floodFill fills a contiguous region and respects boundaries', () => {
    const A = { code: 'A07', r: 1, g: 2, b: 3 };
    const B = { code: 'A30', r: 4, g: 5, b: 6 };
    // 3x3，被 B 占据 (0,2)(1,2) 两格；左下 2×2 + 底行右侧 = 连通区共 7 格
    const g = [
      [null, null, B],
      [null, null, B],
      [null, null, null],
    ];
    const filled = floodFill(g, 0, 0, A, { size: 3 });
    assert.strictEqual(filled, 7, 'connected region (7 cells) should be filled');
    assert.strictEqual(g[0][0].code, 'A07');
    assert.strictEqual(g[2][2].code, 'A07', 'bottom-right cell belongs to the same region');
    assert.strictEqual(g[0][2].code, 'A30', 'wall must stay untouched');
    assert.strictEqual(g[1][2].code, 'A30', 'second wall cell must stay untouched');
  });

  await case_('G9-wb-core', 'floodFill is a no-op when target color equals fill color', () => {
    const A = { code: 'A07' };
    const g = [[A, A], [A, A]];
    const filled = floodFill(g, 0, 0, A, { size: 2 });
    assert.strictEqual(filled, 0);
  });

  await case_('G9-wb-core', 'floodFill can erase to empty (fillBead = null)', () => {
    const A = { code: 'A07' };
    const g = [[A, A], [A, null]];
    const filled = floodFill(g, 0, 0, null, { size: 2 });
    assert.strictEqual(filled, 3);
    assert.strictEqual(g[0][0], null);
    assert.strictEqual(g[1][1], null, 'already-empty cell stays empty');
  });

  await case_('G9-wb-core', 'rectCells normalizes reverse drags and includes both ends', () => {
    // 行优先顺序：先走完一行再换行
    const expected = [[1, 1], [2, 1], [1, 2], [2, 2]];
    assert.deepStrictEqual(rectCells(1, 1, 2, 2), expected);
    assert.deepStrictEqual(rectCells(2, 2, 1, 1), expected, 'reverse drag must yield the same set');
    assert.strictEqual(rectCells(0, 0, 0, 0).length, 1);
  });

  await case_('G9-wb-core', 'mirrorTargets: none returns empty, vertical mirrors x only', () => {
    assert.deepStrictEqual(mirrorTargets(1, 5, 10, 'none'), []);
    assert.deepStrictEqual(mirrorTargets(1, 5, 10, 'vertical'), [[8, 5]]);
    assert.deepStrictEqual(mirrorTargets(1, 5, 10, 'horizontal'), [[1, 4]]);
  });

  await case_('G9-wb-core', 'mirrorTargets: quad returns 3 distinct targets, center cell returns none', () => {
    assert.deepStrictEqual(mirrorTargets(1, 1, 10, 'quad'), [[8, 1], [1, 8], [8, 8]]);
    // 奇数边长的正中格子镜像到自己，不应产生重复落子
    assert.deepStrictEqual(mirrorTargets(2, 2, 5, 'quad'), []);
  });

  await case_('G9-wb-core', 'history: undo restores previous snapshot, redo re-applies it', () => {
    const h = createHistory(10);
    assert.ok(!canUndo(h) && !canRedo(h), 'fresh history is empty');
    pushHistory(h, 'v1');
    assert.ok(canUndo(h));
    const back = undo(h, 'v2');
    assert.strictEqual(back, 'v1');
    assert.ok(canRedo(h), 'undo must populate the redo stack');
    const fwd = redo(h, 'v1');
    assert.strictEqual(fwd, 'v2');
  });

  await case_('G9-wb-core', 'history: a new action clears the redo stack (standard editor behavior)', () => {
    const h = createHistory(10);
    pushHistory(h, 'v1');
    undo(h, 'v2');
    assert.ok(canRedo(h));
    pushHistory(h, 'v2');
    assert.ok(!canRedo(h), 'redo stack must be cleared after a new edit');
  });

  await case_('G9-wb-core', 'history: respects the size limit (drops oldest)', () => {
    const h = createHistory(3);
    ['a', 'b', 'c', 'd'].forEach((s) => pushHistory(h, s));
    assert.strictEqual(h.undo.length, 3);
    assert.strictEqual(h.undo[0], 'b', 'oldest snapshot should have been dropped');
  });

  await case_('G9-wb-core', 'history: undo/redo on empty stacks return null instead of throwing', () => {
    const h = createHistory(5);
    assert.strictEqual(undo(h, 'x'), null);
    assert.strictEqual(redo(h, 'x'), null);
  });

  await case_('G9-wb-core', 'pixelsToBeadGrid maps an image down to real bead codes', () => {
    const w = 4;
    const h = 4;
    const data = new Uint8ClampedArray(w * h * 4);
    for (let i = 0; i < w * h; i++) {
      data[i * 4] = 255; data[i * 4 + 1] = 255; data[i * 4 + 2] = 255; data[i * 4 + 3] = 255;
    }
    const out = pixelsToBeadGrid({ data, width: w, height: h }, 2, 2, wbIndex);
    assert.strictEqual(out.length, 2);
    assert.strictEqual(out[0].length, 2);
    for (const row of out) for (const bead of row) assert.ok(bead && bead.code === 'A01', 'white image must map to A01');
  });

  await case_('G9-wb-core', 'pixelsToBeadGrid treats fully transparent pixels as empty cells', () => {
    const w = 2;
    const h = 2;
    const data = new Uint8ClampedArray(w * h * 4); // all zeros => alpha 0
    const out = pixelsToBeadGrid({ data, width: w, height: h }, 2, 2, wbIndex);
    for (const row of out) for (const bead of row) assert.strictEqual(bead, null);
  });

  await case_('G9-wb-core', 'filterPalette matches code or name, case-insensitive; empty query returns all', () => {
    assert.strictEqual(filterPalette(wbPalette, '').length, wbPalette.length);
    assert.ok(filterPalette(wbPalette, 'a07').length >= 1, 'code search must be case-insensitive');
    const reds = filterPalette(wbPalette, 'red');
    assert.ok(reds.length >= 1, 'name search must work');
    assert.ok(reds.every((c) => /red/i.test(c.name)), 'every hit must actually contain the query');
    assert.strictEqual(filterPalette(wbPalette, 'zzz-not-a-color').length, 0);
  });

  await case_('G9-wb-core', 'sortByHue returns the same members (pure reordering)', () => {
    const sorted = sortByHue(wbPalette);
    assert.strictEqual(sorted.length, wbPalette.length);
    assert.deepStrictEqual(
      sorted.map((c) => c.id).slice().sort(),
      wbPalette.map((c) => c.id).slice().sort(),
      'sortByHue must not add or drop colors'
    );
  });
  await case_('G9-wb-core', 'whiteboard.html no longer relies on ctx.filter for bead remapping', () => {
    const src = read('whiteboard.html');
    assert.ok(
      !/ctx2?\.filter\s*=/.test(src),
      'regression: whiteboard.html must not use canvas ctx.filter — it silently no-ops in some browsers'
    );
    assert.ok(src.includes('remapGrid'), 'whiteboard.html must remap through whiteboard-core.remapGrid');
    assert.ok(src.includes("from './assets/js/whiteboard-core.js'"), 'must import the shared core module');
  });

  await case_('G9-wb-core', 'whiteboard.html every slider input path reaches applyFiltersAndRender', () => {
    const src = read('whiteboard.html');
    // 6 个画面滤镜控件（顶部 3 + 侧栏 3）都必须触发重算
    const handlers = src.match(/addEventListener\('input'/g) || [];
    assert.ok(handlers.length >= 6, `expected >=6 input listeners, found ${handlers.length}`);
    // 顶部与侧栏滑块都必须在 input 时调用 applyFiltersAndRender
    const brightTop = src.indexOf("wbBrightRange.addEventListener('input'");
    const contrastTop = src.indexOf("wbContrastRange.addEventListener('input'");
    const brightSide = src.indexOf("wbBrightSide.addEventListener('input'");
    const contrastSide = src.indexOf("wbContrastSide.addEventListener('input'");
    for (const [name, idx] of [['brightness(top)', brightTop], ['contrast(top)', contrastTop], ['brightness(side)', brightSide], ['contrast(side)', contrastSide]]) {
      assert.ok(idx > -1, `missing ${name} listener`);
      const seg = src.slice(idx, idx + 320);
      assert.ok(seg.includes('applyFiltersAndRender'), `${name} must call applyFiltersAndRender`);
    }
  });

  await case_('G9-wb-core', 'whiteboard.html module script parses as valid ESM', () => {
    const src = read('whiteboard.html');
    const m = src.match(/<script type="module">([\s\S]*?)<\/script>/);
    assert.ok(m, 'no module script found in whiteboard.html');
    if (typeof vm.SourceTextModule === 'function') {
      new vm.SourceTextModule(m[1], { identifier: 'whiteboard-inline-module' });
    } else {
      nodeCheck('whiteboard.html');
    }
  });

  await case_('G9-wb-core', 'whiteboard.html exposes the aligned feature set', () => {
    const src = read('whiteboard.html');
    const required = [
      'btn-redo',            // 重做
      'tool-rect',           // 矩形
      'tool-line',           // 直线
      'tool-move',           // 移动
      'brush-size-btns',     // 笔刷大小
      'btn-symmetry',        // 对称
      'symmetry-mode',
      'btn-import-grid',     // 图片转色号
      'btn-import-ref',      // 图片临摹底图
      'btn-toggle-grid',     // 网格开关
      'btn-toggle-ruler',    // 标尺开关
      'btn-toggle-code',     // 色号开关
      'palette-search',      // 色号搜索
      'btn-rotate',          // 旋转 90
    ];
    for (const id of required) {
      assert.ok(src.includes(`id="${id}"`), `missing control: #${id}`);
    }
  });

  // =====================================================================
  // GROUP 10 — 创作工坊侧边栏 + 教程检索
  // 核心约束：创意工坊与白板画板的教程数据源相互独立，检索绝不跨模块。
  // =====================================================================
  const td = await import('../assets/js/tutorial-data.js');
  const ts = await import('../assets/js/tutorial-search.js');
  const { MODULES, TUTORIALS, categoriesOf, countOf } = td;
  const { searchTutorials, highlightRanges, renderHighlight, escapeHtml, tokenize, subsequenceMatch } = ts;

  await case_('G10-tutorial', 'two modules declared: studio + whiteboard, with distinct names', () => {
    assert.ok(MODULES.studio && MODULES.whiteboard, 'both modules must exist');
    assert.strictEqual(MODULES.studio.name, '创意工坊');
    assert.strictEqual(MODULES.whiteboard.name, '白板画板');
    assert.notStrictEqual(MODULES.studio.href, MODULES.whiteboard.href, 'modules must not share a target');
    assert.ok(MODULES.whiteboard.href.endsWith('.html'), 'whiteboard href must carry an explicit extension');
  });

  await case_('G10-tutorial', 'each module has entries, and every entry is tagged with its own module', () => {
    assert.ok(countOf('studio') >= 5, `studio needs >=5 entries, got ${countOf('studio')}`);
    assert.ok(countOf('whiteboard') >= 5, `whiteboard needs >=5 entries, got ${countOf('whiteboard')}`);
    for (const id of ['studio', 'whiteboard']) {
      for (const e of TUTORIALS[id]) {
        assert.strictEqual(e.module, id, `entry ${e.id} must belong to ${id}`);
        assert.ok(e.title && e.category, `entry ${e.id} missing title/category`);
        assert.ok(Array.isArray(e.steps) && Array.isArray(e.controls) && Array.isArray(e.keywords), `entry ${e.id} missing structured fields`);
      }
    }
  });

  await case_('G10-tutorial', 'entry ids are unique across BOTH modules (no shared id collision)', () => {
    const all = [...TUTORIALS.studio, ...TUTORIALS.whiteboard].map((e) => e.id);
    assert.strictEqual(new Set(all).size, all.length, 'duplicate entry id found');
  });

  await case_('G10-tutorial', 'every control declares name / type / action / result', () => {
    for (const id of ['studio', 'whiteboard']) {
      for (const e of TUTORIALS[id]) {
        for (const c of e.controls) {
          assert.ok(c.name, `${e.id}: control without name`);
          assert.ok(c.type, `${e.id}/${c.name}: missing type`);
          assert.ok(c.action, `${e.id}/${c.name}: missing action`);
          assert.ok(c.result, `${e.id}/${c.name}: missing result`);
        }
      }
    }
  });

  // ---- 隔离性：本组是这个需求最核心的验收点 ----
  await case_('G10-tutorial', 'ISOLATION: studio-only keyword returns nothing in whiteboard module', () => {
    // 「拼豆模式」是创意工坊独有的概念
    const inStudio = searchTutorials(TUTORIALS.studio, '拼豆模式');
    const inWb = searchTutorials(TUTORIALS.whiteboard, '拼豆模式');
    assert.ok(inStudio.length > 0, 'sanity: keyword must match inside studio');
    assert.strictEqual(inWb.length, 0, `whiteboard must not match studio-only keyword, got ${inWb.length}`);
  });

  await case_('G10-tutorial', 'ISOLATION: whiteboard-only keyword returns nothing in studio module', () => {
    // 「对称」是白板画板独有的功能
    const inWb = searchTutorials(TUTORIALS.whiteboard, '对称');
    const inStudio = searchTutorials(TUTORIALS.studio, '对称');
    assert.ok(inWb.length > 0, 'sanity: keyword must match inside whiteboard');
    assert.strictEqual(inStudio.length, 0, `studio must not match whiteboard-only keyword, got ${inStudio.length}`);
  });

  await case_('G10-tutorial', 'ISOLATION: shared keyword can match in both modules independently', () => {
    // 「色号」两套教程都写了，应各自都能搜到，互不影响
    const a = searchTutorials(TUTORIALS.studio, '色号');
    const b = searchTutorials(TUTORIALS.whiteboard, '色号');
    assert.ok(a.length > 0, 'studio should match 色号');
    assert.ok(b.length > 0, 'whiteboard should match 色号');
    // 命中结果必须确实是该模块自己的条目
    const wbIds = new Set(TUTORIALS.whiteboard.map((e) => e.id));
    for (const r of b) assert.ok(wbIds.has(r.entry.id), 'whiteboard result came from another module');
  });

  await case_('G10-tutorial', 'ISOLATION: every returned entry belongs to the searched module', () => {
    for (const id of ['studio', 'whiteboard']) {
      const ids = new Set(TUTORIALS[id].map((e) => e.id));
      for (const q of ['色号', '导出', '色板', '画', 'a', '调']) {
        for (const r of searchTutorials(TUTORIALS[id], q, { limit: 50 })) {
          assert.ok(ids.has(r.entry.id), `${id} search "${q}" leaked entry ${r.entry.id}`);
          assert.strictEqual(r.entry.module, id);
        }
      }
    }
  });

  // ---- 模糊 / 部分匹配 ----
  await case_('G10-tutorial', 'fuzzy: substring of a title matches (部分匹配)', () => {
    const r = searchTutorials(TUTORIALS.whiteboard, '橡皮');
    assert.ok(r.length > 0, 'substring must match');
    assert.ok(r.some((x) => x.entry.title.includes('橡皮') || (x.entry.keywords || []).includes('橡皮')));
  });

  await case_('G10-tutorial', 'fuzzy: control name is searchable (搜按钮名能找到所属条目)', () => {
    const r = searchTutorials(TUTORIALS.whiteboard, '吸管');
    assert.ok(r.length > 0, 'must find the entry that documents 吸管');
    const hit = r[0].entry.controls.some((c) => c.name.includes('吸管'));
    assert.ok(hit, 'matched entry should document the 吸管 control');
  });

  await case_('G10-tutorial', 'fuzzy: alias keywords work (e.g. 「撤销」via keyword)', () => {
    const r = searchTutorials(TUTORIALS.whiteboard, '回退');
    assert.ok(r.length > 0, 'alias keyword 回退 should match 撤销条目');
  });

  await case_('G10-tutorial', 'fuzzy: english/数字 token works (A07, Ctrl+Z)', () => {
    assert.ok(searchTutorials(TUTORIALS.whiteboard, 'A07').length > 0, 'A07 should be findable');
    assert.ok(searchTutorials(TUTORIALS.whiteboard, 'Ctrl').length > 0, 'Ctrl should be findable');
  });

  await case_('G10-tutorial', 'fuzzy: subsequence match tolerates skipped chars', () => {
    // 「对」「称」都能在「对称绘制」里按序找到 → 命中下标 [0,1]
    assert.deepStrictEqual(subsequenceMatch('对称', '对称绘制'), [0, 1]);
    // 跳字查询：「称绘」在「对称绘制」中按序落在下标 1、2
    assert.deepStrictEqual(subsequenceMatch('称绘', '对称绘制'), [1, 2]);
    // 真正跳字的场景：查询里夹一个标题中不存在的字就应失败
    assert.deepStrictEqual(subsequenceMatch('称X绘', '对称绘制'), [], 'a non-present char must break the match');
    assert.deepStrictEqual(subsequenceMatch('zzz', '对称'), [], 'non-matching subsequence returns empty');
    // 端到端：模糊查询也应召回「对称绘制」条目
    const r = searchTutorials(TUTORIALS.whiteboard, '称绘');
    assert.ok(r.length > 0, 'fuzzy subsequence query should still return the 对称 entry');
    assert.ok(r.some((x) => x.entry.title.includes('对称')));
  });

  await case_('G10-tutorial', 'tokenize handles mixed 中文/英文/数字', () => {
    const tokens = tokenize('Ctrl+Z 亮度 -40');
    assert.ok(tokens.includes('ctrl'), 'english lowercased');
    assert.ok(tokens.includes('z'), 'single letter');
    assert.ok(tokens.includes('40'), 'digits');
    assert.ok(tokens.includes('亮'), 'cjk single char');
    assert.ok(tokens.includes('亮度'), 'cjk bigram');
  });

  // ---- 高亮 ----
  await case_('G10-tutorial', 'highlightRanges locates every occurrence of the query', () => {
    assert.deepStrictEqual(highlightRanges('色号与色号', '色号'), [[0, 2], [3, 5]]);
    assert.deepStrictEqual(highlightRanges('abc', 'zz'), [], 'no match -> no ranges');
    assert.deepStrictEqual(highlightRanges('', 'a'), []);
  });

  await case_('G10-tutorial', 'highlightRanges indexes map back to the original substring', () => {
    const text = '调节亮度与对比度';
    for (const [s, e] of highlightRanges(text, '亮度')) {
      assert.strictEqual(text.slice(s, e), '亮度');
    }
  });

  await case_('G10-tutorial', 'renderHighlight wraps hits in <mark> and keeps the rest intact', () => {
    const html = renderHighlight('调节亮度', [[2, 4]]);
    assert.ok(html.includes('<mark>亮度</mark>'), `got ${html}`);
    assert.ok(html.startsWith('调节'), `prefix must be preserved: ${html}`);
  });

  await case_('G10-tutorial', 'renderHighlight escapes HTML in tutorial text (no injection)', () => {
    const html = renderHighlight('<img src=x onerror=alert(1)>', [[0, 4]]);
    assert.ok(!html.includes('<img'), 'raw tag must be escaped');
    assert.ok(html.includes('&lt;'), 'should be escaped as &lt;');
  });

  await case_('G10-tutorial', 'escapeHtml covers the five dangerous chars', () => {
    assert.strictEqual(escapeHtml('<a href="x">&</a>'), '&lt;a href=&quot;x&quot;&gt;&amp;&lt;/a&gt;');
    assert.strictEqual(escapeHtml(null), '');
  });

  await case_('G10-tutorial', 'every search result carries a snippet with highlight ranges', () => {
    for (const id of ['studio', 'whiteboard']) {
      for (const r of searchTutorials(TUTORIALS[id], '色号', { limit: 20 })) {
        assert.ok(r.snippet && typeof r.snippet.text === 'string', `${r.entry.id} missing snippet text`);
        assert.ok(Array.isArray(r.snippet.ranges), `${r.entry.id} snippet missing ranges`);
        assert.ok(r.snippet.label, `${r.entry.id} snippet missing label`);
      }
    }
  });

  await case_('G10-tutorial', 'empty query returns no results (caller shows the idle hint)', () => {
    assert.strictEqual(searchTutorials(TUTORIALS.studio, '').length, 0);
    assert.strictEqual(searchTutorials(TUTORIALS.studio, '   ').length, 0);
  });

  await case_('G10-tutorial', 'nonsense query returns empty so the UI can show an empty state', () => {
    assert.strictEqual(searchTutorials(TUTORIALS.studio, 'zzzz-not-a-thing').length, 0);
    assert.strictEqual(searchTutorials(TUTORIALS.whiteboard, 'zzzz-not-a-thing').length, 0);
  });

  await case_('G10-tutorial', 'results are sorted by score descending', () => {
    const r = searchTutorials(TUTORIALS.whiteboard, '色号', { limit: 20 });
    for (let i = 1; i < r.length; i++) {
      assert.ok(r[i - 1].score >= r[i].score, 'results must be sorted by score');
    }
  });

  await case_('G10-tutorial', 'categoriesOf groups entries per module without mixing', () => {
    const sCats = categoriesOf('studio');
    const wCats = categoriesOf('whiteboard');
    assert.ok(sCats.length > 0 && wCats.length > 0);
    for (const c of sCats) for (const e of c.items) assert.strictEqual(e.module, 'studio');
    for (const c of wCats) for (const e of c.items) assert.strictEqual(e.module, 'whiteboard');
    const sTitles = sCats.flatMap((c) => c.items.map((e) => e.title));
    const wTitles = wCats.flatMap((c) => c.items.map((e) => e.title));
    assert.strictEqual(sTitles.filter((t) => wTitles.includes(t)).length, 0, 'no duplicated tutorial title across modules');
  });

  await case_('G10-tutorial', 'limit is respected', () => {
    assert.ok(searchTutorials(TUTORIALS.studio, '色', { limit: 2 }).length <= 2);
  });

  // ---- 页面集成静态检查 ----
  await case_('G10-tutorial', 'create.html wires the sidebar: shell, search box, nav, both panes', () => {
    const src = read('create.html');
    for (const id of ['studio-shell', 'sb-collapse', 'sb-search', 'sb-nav', 'sb-results', 'sb-all-link', 'pane-studio', 'pane-whiteboard']) {
      assert.ok(src.includes(`id="${id}"`), `missing sidebar element: #${id}`);
    }
    assert.ok(src.includes("from './assets/js/tutorial-data.js'"), 'must import tutorial-data');
    assert.ok(src.includes("from './assets/js/tutorial-search.js'"), 'must import tutorial-search');
  });

  await case_('G10-tutorial', 'create.html sidebar starts expanded and collapse state is persisted', () => {
    const src = read('create.html');
    assert.ok(src.includes("aria-expanded=\"true\""), 'collapse button should declare expanded=true initially');
    assert.ok(src.includes('studio.sidebar.collapsed'), 'collapse preference should be persisted');
    assert.ok(/let sidebarCollapsed = false/.test(src), 'default state must be expanded');
  });

  await case_('G10-tutorial', 'create.html search results are scoped to the current module only', () => {
    const src = read('create.html');
    // 检索入口必须传当前模块的数组，而不是合并后的全集
    assert.ok(
      /searchTutorials\(entries, q/.test(src),
      'sidebar search must query the scoped entries array, not a merged list'
    );
    assert.ok(src.includes('TUTORIALS[currentModule]'), 'entries must come from the current module');
  });

  await case_('G10-tutorial', 'create.html whiteboard pane does not hardcode a pretty URL', () => {
    const src = read('create.html');
    assert.ok(!/src="whiteboard"/.test(src), 'iframe must not use the extension-less path (404 on plain static servers)');
    assert.ok(src.includes('src="whiteboard.html"'), 'iframe must point at whiteboard.html');
  });

  await case_('G10-tutorial', 'tutorial-guide.html exists with module switch + search', () => {
    const src = read('tutorial-guide.html');
    for (const id of ['td-switch', 'td-search', 'td-body', 'td-count']) {
      assert.ok(src.includes(`id="${id}"`), `missing guide element: #${id}`);
    }
    assert.ok(src.includes("from './assets/js/tutorial-data.js'"));
    assert.ok(src.includes("from './assets/js/tutorial-search.js'"));
  });

  await case_('G10-tutorial', 'module scripts parse as valid ESM', () => {
    for (const f of ['create.html', 'tutorial-guide.html']) {
      const src = read(f);
      const m = src.match(/<script type="module">([\s\S]*?)<\/script>/);
      assert.ok(m, `${f}: no module script`);
      if (typeof vm.SourceTextModule === 'function') {
        new vm.SourceTextModule(m[1], { identifier: `${f}#module` });
      }
    }
  });

  await case_('G10-tutorial', 'every page declares a favicon (no more 404 noise)', () => {
    for (const f of ['index.html', 'create.html', 'whiteboard.html', 'inspiration.html', 'tutorial.html', 'tutorial-guide.html']) {
      assert.ok(read(f).includes('rel="icon"'), `${f} is missing a favicon link`);
    }
  });

  // -------------------------------------------------------------------------
  // Report
  // -------------------------------------------------------------------------
  const groups = {};
  for (const r of results) {
    groups[r.group] = groups[r.group] || { total: 0, pass: 0, fail: 0 };
    groups[r.group].total++;
    if (r.pass) groups[r.group].pass++;
    else groups[r.group].fail++;
  }
  const total = results.length;
  const passed = results.filter((r) => r.pass).length;
  const failed = total - passed;

  console.log('\n================ QA TEST REPORT — 拼豆网 ================');
  console.log(`Total: ${total} | Passed: ${passed} | Failed: ${failed}`);
  console.log('--------------------------------------------------------');
  for (const g of Object.keys(groups)) {
    const s = groups[g];
    console.log(`${g.padEnd(12)} total=${s.total} pass=${s.pass} fail=${s.fail}`);
  }
  if (failed > 0) {
    console.log('--------------------------------------------------------');
    console.log('FAILED CASES:');
    for (const r of results.filter((x) => !x.pass)) {
      console.log(`  [${r.group}] ${r.name}\n      -> ${r.err}`);
    }
  }
  console.log('========================================================');

  // Routing decision written to a JSON sidecar for the team-lead handoff.
  const decision = failed > 0 ? 'Engineer' : 'NoOne';
  const report = {
    total,
    passed,
    failed,
    groups,
    routing: decision,
    failedCases: results.filter((x) => !x.pass).map((x) => ({ group: x.group, name: x.name, err: x.err })),
  };
  writeSidecar(report);
  process.exit(failed > 0 ? 1 : 0);
}

function writeSidecar(report) {
  try {
    writeFileSync(join(ROOT, 'tests', 'test-report.json'), JSON.stringify(report, null, 2));
  } catch (e) {
    /* non-fatal */
  }
}

main().catch((e) => {
  console.error('TEST RUNNER CRASHED:', e);
  process.exit(2);
});
